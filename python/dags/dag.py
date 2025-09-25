from airflow import DAG
from airflow.providers.hook.http.hook import HttpHook
from airflow.decorators import task
from airflow.models import Variable
from datetime import datetime, timedelta
import logging

API_CONN_ID = 'airflow_default'

default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

# creating dag object
with DAG(
    dag_id='env_etl_pipeline_dag',
    default_args=default_args,
    schedule='@daily',
    catchup=False,
    description='Extract environmental news from Guardian API and load to MongoDB',
    tags=['environment', 'news', 'guardian']
) as dag:
    
    @task
    def extract_guardian():
        '''extracting environment news articles'''
        logger = logging.getLogger(__name__)
        try:
            # api key
            api_key = Variable.get("GUARDIAN_API_KEY")
            
            # Use HttpHook to get connection details from Airflow
            http_hook = HttpHook(http_conn_id=API_CONN_ID, method='GET')

            # calculate date range (yesterday to today for daily articles)
            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            today = datetime.now().strftime('%Y-%m-%d')
            
            # build endpoin- just the path- not full URL
            endpoint = '/search'

            query_params = {
                'section': 'environment',
                'from-date': yesterday,
                'to-date': today,
                'show-fields': 'headline,bodyText',
                'api-key': api_key,
                'page-size': '50'
            }
            logger.info(f"Fetching articles from {yesterday} to {today}")
            
            # make HTTP request via endpoint
            response = http_hook.run(
                endpoint=endpoint,
                data=query_params,  # query parameters passed here
                headers={'Accept': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                logger.info(f"Successfully extracted {len(data.get('response', {}).get('results', []))} articles")
                return data
            else:
                logger.error(f"API request failed with status code: {response.status_code}")
                raise Exception(f"Guardian API request failed: {response.status_code}")
        
        except Exception as e:
            logger.error(f"Extract task failed: {str(e)}")
            raise
        

    @task
    def transform_guardian(data):
        """Transform Guardian API response to structured format"""
        logger = logging.getLogger(__name__)
        
        try:
            # validate ip data
            if not data or 'response' not in data:
                raise ValueError("Invalid data structure from Guardian API")
            
            response_data = data['response']
            results = response_data.get('results', [])
            
            if not results:
                logger.warning("No articles found in API response")
                return []
            
            data_list = []
            extraction_date = datetime.now().isoformat()
            
            for article in results:
                # handle missing fields
                fields = article.get('fields', {})
                
                data_dict = {
                    'id': article.get('id', 'unknown'),
                    'publish_date': article.get('webPublicationDate', ''),
                    'extracted_date': extraction_date,
                    'url': article.get('webUrl', ''),
                    'headline': fields.get('headline', 'No headline available'),
                    'body': fields.get('bodyText', 'No content available'),
                    'section': article.get('sectionName', 'environment'),
                    'source': 'guardian_api'
                }
                data_list.append(data_dict)
            
            logger.info(f"Successfully transformed {len(data_list)} articles")
            return data_list
            
        except Exception as e:
            logger.error(f"Transform task failed: {str(e)}")
            raise

    @task 
    def load_guardian():
        ...
