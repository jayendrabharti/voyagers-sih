from airflow import DAG
from airflow.providers.http.hooks.http import HttpHook
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.decorators import task
from airflow.models import Variable
from datetime import datetime, timedelta
import logging
import json
import requests
from bs4 import BeautifulSoup
import google.generativeai as genai
import time
import re

API_CONN_ID = 'guardian_default'
POSTGRES_CONN_ID = 'postgres_default'

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2025, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=3)
}

# dag object
with DAG(
    dag_id='env_etl_pipeline_dag',
    default_args=default_args,
    schedule='@daily',
    catchup=False,
    description='Extract environmental news from Guardian API, scrape images, generate summaries and load to Postgres',
    tags=['environment', 'news', 'guardian', 'ai', 'scraping']
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
            
            # Add new columns if they don't exist
            alter_table_sql = """
            -- Add image_url column if it doesn't exist
            DO $$ 
            BEGIN
                BEGIN
                    ALTER TABLE articles ADD COLUMN image_url TEXT;
                EXCEPTION
                    WHEN duplicate_column THEN 
                        RAISE NOTICE 'Column image_url already exists';
                END;
                
                -- Add ai_summary column if it doesn't exist
                BEGIN
                    ALTER TABLE articles ADD COLUMN ai_summary TEXT;
                EXCEPTION
                    WHEN duplicate_column THEN 
                        RAISE NOTICE 'Column ai_summary already exists';
                END;
            END $$;
            """
            
            postgres_hook.run(alter_table_sql)
            logger.info("Table structure updated with new columns")
            
            # Create indexes if they don't exist
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
            
            # HttpHook to get connection details from airflow
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
            # validate input data
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
                # handle missing fields
                fields = article.get('fields', {})
                
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
                
                # clean and truncate text fields- no errors
                headline = fields.get('headline', 'No headline available')[:1000]  # Truncate if too long
                body = fields.get('bodyText', 'No content available')
                
                # article dictionary
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
    def scrape_and_enhance(articles_data):
        """Scrape images and generate AI summaries for articles"""
        logger = logging.getLogger(__name__)
        
        try:
            if not articles_data:
                logger.info("No articles to enhance")
                return []
            
            # Get Gemini API key and configure
            gemini_api_key = Variable.get("GEMINI_API_KEY", default_var=None)
            if gemini_api_key:
                genai.configure(api_key=gemini_api_key)
                # Initialize the model
                model = genai.GenerativeModel('gemini-2.5-pro')
            else:
                logger.warning("GEMINI_API_KEY not found in Airflow Variables")
            
            enhanced_articles = []
            
            for i, article in enumerate(articles_data):
                logger.info(f"Processing article {i+1}/{len(articles_data)}: {article['headline'][:50]}...")
                
                # Initialize with original data
                enhanced_article = article.copy()
                enhanced_article['image_url'] = None
                enhanced_article['ai_summary'] = None
                
                # Web scraping for images
                try:
                    headers = {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                    
                    response = requests.get(article['url'], headers=headers, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Try multiple selectors for Guardian images
                        image_selectors = [
                            'img[data-src]',  # Guardian lazy-loaded images
                            '.img img',       # Guardian image containers
                            'figure img',     # Figure images
                            'img[src*="guardian"]',  # Guardian CDN images
                            'img[alt]'        # Any image with alt text
                        ]
                        
                        image_url = None
                        for selector in image_selectors:
                            img_tags = soup.select(selector)
                            for img in img_tags:
                                # Try data-src first (lazy loading), then src
                                src = img.get('data-src') or img.get('src')
                                if src and ('guardian' in src.lower() or src.startswith('http')):
                                    # Make sure it's a full URL
                                    if src.startswith('//'):
                                        src = 'https:' + src
                                    elif src.startswith('/'):
                                        src = 'https://www.theguardian.com' + src
                                    
                                    # Basic image validation
                                    if any(ext in src.lower() for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                                        image_url = src
                                        break
                            if image_url:
                                break
                        
                        enhanced_article['image_url'] = image_url
                        if image_url:
                            logger.info(f"✓ Found image for article {i+1}")
                    else:
                        logger.warning(f"Failed to scrape article {i+1}: HTTP {response.status_code}")
                        
                except Exception as scrape_error:
                    logger.warning(f"Scraping failed for article {i+1}: {scrape_error}")
                
                # AI Summary generation with Gemini
                if gemini_api_key:
                    try:
                        if article['body'] and len(article['body']) > 100:
                            # Truncate body if too long
                            body_text = article['body'][:4000]  # Gemini can handle more tokens
                            
                            prompt = f"""Summarize this environmental news article in 2-3 sentences. Focus on the key environmental impact and main points:

Title: {article['headline']}
Content: {body_text}

Please provide a concise summary highlighting the environmental significance."""
                            
                            # Generate content using Gemini
                            response = model.generate_content(prompt)
                            
                            if response and response.text:
                                summary = response.text.strip()
                                enhanced_article['ai_summary'] = summary
                                logger.info(f"✓ Generated AI summary for article {i+1}")
                            else:
                                logger.warning(f"Empty response from Gemini for article {i+1}")
                            
                            # Rate limiting for Gemini API
                            time.sleep(1)
                            
                    except Exception as ai_error:
                        logger.warning(f"AI summary failed for article {i+1}: {ai_error}")
                else:
                    logger.info(f"Skipping AI summary for article {i+1} (API key not configured)")
                
                enhanced_articles.append(enhanced_article)
                
                # Small delay between requests to be respectful
                time.sleep(0.2)
            
            logger.info(f"Enhancement completed for {len(enhanced_articles)} articles")
            return enhanced_articles
            
        except Exception as e:
            logger.error(f"Scrape and enhance task failed: {str(e)}")
            raise

    @task 
    def load_guardian(articles_data):
        """Load enhanced articles with image URLs and AI summaries"""
        logger = logging.getLogger(__name__)
        
        try:
            if not articles_data:
                logger.info("No articles to load")
                return {"loaded": 0, "errors": 0}
            
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)
            
            # Setup UUID extension and fix updatedAt column
            setup_sql = """
            -- Enable UUID extension if not already enabled
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            -- Setup defaults and constraints
            DO $
            BEGIN
                -- Try to set default UUID generation for id column
                ALTER TABLE articles ALTER COLUMN id SET DEFAULT uuid_generate_v4();
            EXCEPTION
                WHEN others THEN
                    -- If that fails, try gen_random_uuid (available in newer PostgreSQL)
                    BEGIN
                        ALTER TABLE articles ALTER COLUMN id SET DEFAULT gen_random_uuid();
                    EXCEPTION
                        WHEN others THEN
                            RAISE NOTICE 'Could not set UUID default, will generate manually';
                    END;
            END
            $;
            
            -- Fix updatedAt column to have proper default and trigger
            ALTER TABLE articles ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
            
            -- Create or replace the trigger function for updatedAt
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $
            BEGIN
                NEW."updatedAt" = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $ language 'plpgsql';
            
            -- Drop trigger if it exists and recreate
            DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
            CREATE TRIGGER update_articles_updated_at 
                BEFORE UPDATE ON articles 
                FOR EACH ROW 
                EXECUTE FUNCTION update_updated_at_column();
            """
            
            try:
                postgres_hook.run(setup_sql)
                logger.info("UUID extension and default setup completed")
            except Exception as setup_error:
                logger.warning(f"Setup warning (continuing): {setup_error}")
            
            # Updated insert SQL with new columns
            insert_sql = """
            INSERT INTO articles (
                "publishDate", "extractedDate", url, headline, 
                body, section, source, image_url, ai_summary, "updatedAt"
            ) VALUES (
                %(publishDate)s, %(extractedDate)s, %(url)s, 
                %(headline)s, %(body)s, %(section)s, %(source)s, 
                %(image_url)s, %(ai_summary)s, CURRENT_TIMESTAMP
            )
            ON CONFLICT (url) 
            DO UPDATE SET 
                "extractedDate" = EXCLUDED."extractedDate",
                headline = EXCLUDED.headline,
                body = EXCLUDED.body,
                section = EXCLUDED.section,
                image_url = EXCLUDED.image_url,
                ai_summary = EXCLUDED.ai_summary,
                "updatedAt" = CURRENT_TIMESTAMP
            RETURNING id, url;
            """
            
            loaded_count = 0
            error_count = 0
            
            for i, article in enumerate(articles_data):
                try:
                    logger.info(f"Processing article {i+1}/{len(articles_data)}: {article['headline'][:50]}...")
                    
                    result = postgres_hook.get_records(insert_sql, parameters=article)
                    
                    if result:
                        article_id, url = result[0]
                        logger.info(f"✓ Article {i+1} loaded successfully with ID: {article_id}")
                        loaded_count += 1
                    else:
                        logger.warning(f"Article {i+1} processed but no ID returned")
                        loaded_count += 1
                        
                except Exception as e:
                    error_count += 1
                    logger.error(f"✗ Failed to insert article {i+1}: {str(e)}")
                    continue
            
            logger.info(f"Load completed: {loaded_count} successful, {error_count} errors")
            
            # Verify inserted records
            count_today = postgres_hook.get_first(
                'SELECT COUNT(*) FROM articles WHERE DATE("extractedDate") = CURRENT_DATE'
            )[0]
            
            # Check enhancement stats
            with_images = postgres_hook.get_first(
                'SELECT COUNT(*) FROM articles WHERE DATE("extractedDate") = CURRENT_DATE AND image_url IS NOT NULL'
            )[0]
            
            with_summaries = postgres_hook.get_first(
                'SELECT COUNT(*) FROM articles WHERE DATE("extractedDate") = CURRENT_DATE AND ai_summary IS NOT NULL'
            )[0]
            
            logger.info(f"Total articles extracted today: {count_today}")
            logger.info(f"Articles with images: {with_images}")
            logger.info(f"Articles with AI summaries: {with_summaries}")
            
            return {
                "loaded": loaded_count, 
                "errors": error_count,
                "with_images": with_images,
                "with_summaries": with_summaries
            }
            
        except Exception as e:
            logger.error(f"Load task failed: {str(e)}")
            raise

    @task
    def data_quality_check():
        """Perform basic data quality checks including new fields"""
        logger = logging.getLogger(__name__)
        
        try:
            postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)

            # Check for duplicate URLs
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
            
            # Check enhancement success rates
            total_today = postgres_hook.get_first(
                'SELECT COUNT(*) FROM articles WHERE DATE("extractedDate") = CURRENT_DATE'
            )[0]
            
            if total_today > 0:
                image_success_rate = postgres_hook.get_first(
                    'SELECT COUNT(*) * 100.0 / %s FROM articles WHERE DATE("extractedDate") = CURRENT_DATE AND image_url IS NOT NULL',
                    parameters=[total_today]
                )[0]
                
                summary_success_rate = postgres_hook.get_first(
                    'SELECT COUNT(*) * 100.0 / %s FROM articles WHERE DATE("extractedDate") = CURRENT_DATE AND ai_summary IS NOT NULL',
                    parameters=[total_today]
                )[0]
                
                logger.info(f"Image scraping success rate: {image_success_rate:.1f}%")
                logger.info(f"AI summary success rate: {summary_success_rate:.1f}%")
            
            logger.info("Data quality check completed")
            
        except Exception as e:
            logger.error(f"Data quality check failed: {str(e)}")
            raise

    # Task dependencies
    verify_table_task = verify_table()
    extract_task = extract_guardian()
    transform_task = transform_guardian(extract_task)
    enhance_task = scrape_and_enhance(transform_task)
    load_task = load_guardian(enhance_task)
    quality_check_task = data_quality_check()
    
    # Pipeline flow
    verify_table_task >> extract_task >> transform_task >> enhance_task >> load_task >> quality_check_task