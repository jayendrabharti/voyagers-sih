from airflow import DAG
from airflow.providers.http.hooks.http import HttpHook
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.decorators import task
from airflow.models import Variable
from datetime import datetime, timedelta
import logging
import json

API_CONN_ID = 'guardian_default'
POSTGRES_CONN_ID = 'postgres_default'

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2025, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=3)
}

# Creating dag object
with DAG(
    dag_id='env_etl_pipeline_dag',
    default_args=default_args,
    schedule='@daily',
    catchup=False,
    description='Extract environmental news from Guardian API and load to Postgres',
    tags=['environment', 'news', 'guardian']
) as dag:
    
    @task
    def create_table():
        """Create PostgreSQL table if it doesn't exist"""
        logger = logging.getLogger(__name__)
        
        try:
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            create_table_sql = """
            CREATE TABLE IF NOT EXISTS guardian_articles (
                id VARCHAR(500) PRIMARY KEY,
                publish_date TIMESTAMP,
                extracted_date TIMESTAMP,
                url TEXT,
                headline TEXT,
                body TEXT,
                section VARCHAR(100),
                source VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            -- Create index for faster querying
            CREATE INDEX IF NOT EXISTS idx_guardian_publish_date ON guardian_articles(publish_date);
            CREATE INDEX IF NOT EXISTS idx_guardian_section ON guardian_articles(section);
            """
            
            postgres_hook.run(create_table_sql)
            logger.info("Table guardian_articles created/verified successfully")
            
        except Exception as e:
            logger.error(f"Create table task failed: {str(e)}")
            raise
    
    @task
    def extract_guardian():
        """Extract environment news articles from Guardian API"""
        logger = logging.getLogger(__name__)
        
        try:
            # Get API key
            api_key = Variable.get("GUARDIAN_API_KEY")
            
            # Use HttpHook to get connection details from Airflow
            http_hook = HttpHook(http_conn_id=API_CONN_ID, method='GET')

            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            today = datetime.now().strftime('%Y-%m-%d')
            
            # Build endpoint - just the path, not full URL
            endpoint = '/search'

            # Query parameters for URL
            query_params = {
                'section': 'environment',
                'from-date': yesterday,
                'to-date': today,
                'show-fields': 'headline,bodyText',
                'api-key': api_key,
                'page-size': '20'
            }
            
            logger.info(f"Fetching articles from {yesterday} to {today}")
            
            # Make HTTP request via endpoint
            response = http_hook.run(
                endpoint=endpoint,
                data=query_params,
                headers={'Accept': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                article_count = len(data.get('response', {}).get('results', []))
                logger.info(f"Successfully extracted {article_count} articles")
                return data
            else:
                logger.error(f"API request failed with status code: {response.status_code}")
                raise Exception(f"Guardian API request failed: {response.status_code}")
        
        except Exception as e:
            logger.error(f"Extract task failed: {str(e)}")
            raise

    @task
    def transform_guardian(data):
        """Transform guardian data into PostgreSQL-appropriate format"""
        logger = logging.getLogger(__name__)
        
        try:
            # Validate input data
            if not data or 'response' not in data:
                raise ValueError("Invalid data structure from Guardian API")
            
            results = data['response'].get('results', [])
            
            if not results:
                logger.warning("No articles found in API response")
                return []
            
            transformed_articles = []
            extraction_date = datetime.now()
            
            for article in results:
                # handle missing fields
                fields = article.get('fields', {}) # fields are body and headline
                
                # parse publication date
                pub_date_str = article.get('webPublicationDate', '')
                try:
                    # if guardian API returns dates in ISO format like "2025-01-15T10:30:00Z"
                    if pub_date_str:
                        pub_date = datetime.fromisoformat(pub_date_str.replace('Z', '+00:00'))
                        # convert to naive datetime (remove timezone info for PostgreSQL)
                        pub_date = pub_date.replace(tzinfo=None)
                    else:
                        pub_date = None
                except ValueError:
                    logger.warning(f"Could not parse date: {pub_date_str}")
                    pub_date = None
                
                # clean and truncate text fields to avoid PostgreSQL errors
                headline = fields.get('headline', 'No headline available')[:1000]  # truncate if too long
                body = fields.get('bodyText', 'No content available')
                
                # create article dictionary with PostgreSQL-appropriate data types
                article_dict = {
                    'id': article.get('id', f'unknown_{extraction_date.timestamp()}'),
                    'publish_date': pub_date,
                    'extracted_date': extraction_date,
                    'url': article.get('webUrl', '')[:2000],  # truncate URL if too long
                    'headline': headline,
                    'body': body,
                    'section': article.get('sectionName', 'environment')[:100],
                    'source': 'guardian_api'
                }
                
                transformed_articles.append(article_dict)
            
            logger.info(f"Successfully transformed {len(transformed_articles)} articles")
            return transformed_articles
            
        except Exception as e:
            logger.error(f"Transform task failed: {str(e)}")
            raise

    @task 
    def load_guardian(articles_data):
        """Load transformed articles into PostgreSQL"""
        logger = logging.getLogger(__name__)
        
        try:
            if not articles_data:
                logger.info("No articles to load")
                return
            
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            # Prepare insert SQL with conflict resolution (upsert)
            insert_sql = """
            INSERT INTO guardian_articles (
                id, publish_date, extracted_date, url, headline, 
                body, section, source
            ) VALUES (
                %(id)s, %(publish_date)s, %(extracted_date)s, %(url)s, 
                %(headline)s, %(body)s, %(section)s, %(source)s
            )
            ON CONFLICT (id) 
            DO UPDATE SET 
                extracted_date = EXCLUDED.extracted_date,
                url = EXCLUDED.url,
                headline = EXCLUDED.headline,
                body = EXCLUDED.body,
                section = EXCLUDED.section
            """
            
            # insert articles in batch
            inserted_count = 0
            for article in articles_data:
                try:
                    postgres_hook.run(insert_sql, parameters=article)
                    inserted_count += 1
                except Exception as e:
                    logger.error(f"Failed to insert article {article.get('id', 'unknown')}: {str(e)}")
                    # Continue with other articles instead of failing the entire task
                    continue
            
            logger.info(f"Successfully loaded {inserted_count} out of {len(articles_data)} articles into PostgreSQL")
            
            # Verify the insertion
            count_sql = "SELECT COUNT(*) FROM guardian_articles WHERE DATE(extracted_date) = CURRENT_DATE"
            result = postgres_hook.get_first(count_sql)
            total_today = result[0] if result else 0
            logger.info(f"Total articles extracted today: {total_today}")
            
        except Exception as e:
            logger.error(f"Load task failed: {str(e)}")
            raise

    @task
    def data_quality_check():
        """Perform basic data quality checks"""
        logger = logging.getLogger(__name__)
        
        try:
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            # Check for duplicate articles
            duplicate_check = """
            SELECT id, COUNT(*) as count 
            FROM guardian_articles 
            WHERE DATE(extracted_date) = CURRENT_DATE
            GROUP BY id 
            HAVING COUNT(*) > 1
            """
            
            duplicates = postgres_hook.get_records(duplicate_check)
            if duplicates:
                logger.warning(f"Found {len(duplicates)} duplicate articles")
            
            # Check for articles with missing critical fields
            missing_data_check = """
            SELECT COUNT(*) 
            FROM guardian_articles 
            WHERE DATE(extracted_date) = CURRENT_DATE 
            AND (headline IS NULL OR headline = '' OR body IS NULL OR body = '')
            """
            
            missing_count = postgres_hook.get_first(missing_data_check)[0]
            if missing_count > 0:
                logger.warning(f"Found {missing_count} articles with missing headline or body")
            
            logger.info("Data quality check completed")
            
        except Exception as e:
            logger.error(f"Data quality check failed: {str(e)}")
            raise

    # task dependencies
    create_table_task = create_table()
    extract_task = extract_guardian()
    transform_task = transform_guardian(extract_task)
    load_task = load_guardian(transform_task)
    quality_check_task = data_quality_check()
    
    # pipeline flow
    create_table_task >> extract_task >> transform_task >> load_task >> quality_check_task