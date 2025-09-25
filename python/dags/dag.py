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
    def verify_table():
        """Verify that the articles table exists and is accessible"""
        logger = logging.getLogger(__name__)
        
        try:
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            # Check if table exists and get its structure
            check_table_sql = """
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'articles' 
            ORDER BY ordinal_position;
            """
            
            columns = postgres_hook.get_records(check_table_sql)
            if not columns:
                raise Exception("Table 'articles' not found in database")
            
            logger.info(f"Table 'articles' found with {len(columns)} columns")
            for col_name, col_type in columns:
                logger.info(f"Column: {col_name} ({col_type})")
            
            # Create indexes if they don't exist (for better performance)
            index_sql = """
            CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles("publishDate");
            CREATE INDEX IF NOT EXISTS idx_articles_section ON articles(section);
            CREATE INDEX IF NOT EXISTS idx_articles_url ON articles(url);
            """
            
            postgres_hook.run(index_sql)
            logger.info("Indexes verified/created successfully")
            
        except Exception as e:
            logger.error(f"Table verification failed: {str(e)}")
            raise
    
    @task
    def extract_guardian():
        """Extract environment news articles from Guardian API"""
        logger = logging.getLogger(__name__)
        
        try:
            # API key
            api_key = Variable.get("GUARDIAN_API_KEY")
            
            # HttpHook to get connection details from Airflow
            http_hook = HttpHook(http_conn_id=API_CONN_ID, method='GET')

            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d') 
            today = datetime.now().strftime('%Y-%m-%d')
            
            # build endpoint - just the path- not full URL
            endpoint = '/search'

            # query parameters for URL
            query_params = {
                'section': 'environment',
                'from-date': yesterday,
                'to-date': today,
                'show-fields': 'headline,bodyText',
                'api-key': api_key,
                'page-size': '20'
            }
            
            logger.info(f"Fetching articles from {yesterday} to {today}")
            
            # HTTP request via endpoint
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
            
            response_data = data['response']
            results = response_data.get('results', [])
            
            if not results:
                logger.warning("No articles found in API response")
                return []
            
            transformed_articles = []
            extraction_date = datetime.now()
            
            for article in results:
                # Handle missing fields gracefully
                fields = article.get('fields', {})
                
                # Parse publication date
                pub_date_str = article.get('webPublicationDate', '')
                try:
                    # Guardian API returns dates in ISO format like "2025-01-15T10:30:00Z"
                    if pub_date_str:
                        pub_date = datetime.fromisoformat(pub_date_str.replace('Z', '+00:00'))
                        # Convert to naive datetime (remove timezone info for PostgreSQL)
                        pub_date = pub_date.replace(tzinfo=None)
                    else:
                        pub_date = None
                except ValueError:
                    logger.warning(f"Could not parse date: {pub_date_str}")
                    pub_date = None
                
                # Clean and truncate text fields to avoid PostgreSQL errors
                headline = fields.get('headline', 'No headline available')[:1000]  # Truncate if too long
                body = fields.get('bodyText', 'No content available')
                
                # Create article dictionary matching your Prisma schema
                article_dict = {
                    'publishDate': pub_date,
                    'extractedDate': extraction_date,
                    'url': article.get('webUrl', '')[:2000],
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
            
            # Prepare insert SQL matching your existing schema
            insert_sql = """
            INSERT INTO articles (
                "publishDate", "extractedDate", url, headline, 
                body, section, source
            ) VALUES (
                %(publishDate)s, %(extractedDate)s, %(url)s, 
                %(headline)s, %(body)s, %(section)s, %(source)s
            )
            ON CONFLICT (url) 
            DO UPDATE SET 
                "extractedDate" = EXCLUDED."extractedDate",
                headline = EXCLUDED.headline,
                body = EXCLUDED.body,
                section = EXCLUDED.section,
                "updatedAt" = CURRENT_TIMESTAMP
            """
            
            # Insert articles in batch
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
            count_sql = 'SELECT COUNT(*) FROM articles WHERE DATE("extractedDate") = CURRENT_DATE'
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
            
            # Check for duplicate URLs (since url is unique in your schema)
            duplicate_check = """
            SELECT url, COUNT(*) as count 
            FROM articles 
            WHERE DATE("extractedDate") = CURRENT_DATE
            GROUP BY url 
            HAVING COUNT(*) > 1
            """
            
            duplicates = postgres_hook.get_records(duplicate_check)
            if duplicates:
                logger.warning(f"Found {len(duplicates)} duplicate URLs")
            
            # Check for articles with missing critical fields
            missing_data_check = """
            SELECT COUNT(*) 
            FROM articles 
            WHERE DATE("extractedDate") = CURRENT_DATE 
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
    verify_table_task = verify_table()
    extract_task = extract_guardian()
    transform_task = transform_guardian(extract_task)
    load_task = load_guardian(transform_task)
    quality_check_task = data_quality_check()
    
    # pipeline flow
    verify_table_task >> extract_task >> transform_task >> load_task >> quality_check_task