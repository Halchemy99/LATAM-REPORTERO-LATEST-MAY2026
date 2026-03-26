"""
Scheduled RSS Ingestion Runner

This script runs the RSS ingestion pipeline on a schedule.
It should be called by a cron job or task scheduler every 3 hours.

Usage:
    python run_scheduled_ingestion.py

Cron entry (every 3 hours):
    0 */3 * * * cd /app/backend && python run_scheduled_ingestion.py >> /var/log/rss_ingestion.log 2>&1
"""

import asyncio
import logging
import os
from datetime import datetime
from pathlib import Path

# Setup logging
log_dir = Path("/var/log")
if not log_dir.exists():
    log_dir = Path("/tmp")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_dir / "rss_ingestion.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / '.env')

async def main():
    """Run the scheduled ingestion"""
    from rss_ingestion import ContentIngestionService
    
    logger.info("=" * 60)
    logger.info(f"Starting scheduled RSS ingestion at {datetime.now().isoformat()}")
    logger.info("=" * 60)
    
    try:
        service = ContentIngestionService()
        results = await service.run_ingestion()
        
        logger.info(f"Ingestion complete:")
        logger.info(f"  - Total fetched: {results['total_fetched']}")
        logger.info(f"  - Processed: {results['processed']}")
        logger.info(f"  - Skipped (existing): {results['skipped_existing']}")
        logger.info(f"  - Failed: {results['failed']}")
        logger.info(f"  - Duration: {results['duration_seconds']:.2f} seconds")
        
        # Log individual articles processed
        for article in results.get('articles', [])[:5]:
            logger.info(f"  + {article.get('processed_title', {}).get('en', 'Unknown')[:50]}...")
        
        if len(results.get('articles', [])) > 5:
            logger.info(f"  ... and {len(results['articles']) - 5} more")
            
    except Exception as e:
        logger.error(f"Ingestion failed: {str(e)}", exc_info=True)
        raise
    
    logger.info("=" * 60)
    logger.info("Scheduled ingestion finished")
    logger.info("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())
