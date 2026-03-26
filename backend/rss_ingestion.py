"""
RSS Ingestion and AI Content Processing Service

This service handles:
1. Fetching articles from RSS feeds
2. Processing with AI (GPT-5.2) to convert to solutions journalism format
3. Translation with DeepL to EN/ES/PT
4. Creating drafts in Sanity CMS (tagged as AI-generated)
"""

import os
import re
import json
import asyncio
import hashlib
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from enum import Enum

import feedparser
import httpx
import deepl

from rss_config import RSS_FEEDS, SOLUTIONS_CATEGORIES, LATAM_REGIONS

logger = logging.getLogger(__name__)

# ============================================
# DATA MODELS
# ============================================

class Language(str, Enum):
    EN = "en"
    ES = "es"
    PT = "pt"

@dataclass
class RSSArticle:
    """Raw article from RSS feed"""
    title: str
    content: str
    summary: str
    link: str
    published: datetime
    author: Optional[str]
    source_feed: str
    source_language: str
    external_id: str

@dataclass
class ProcessedArticle:
    """AI-processed article ready for CMS"""
    title: Dict[str, str]  # {en: ..., es: ..., pt: ...}
    slug: str
    standfirst: Dict[str, str]
    body: Dict[str, List[Dict]]  # Portable Text format per language
    category: str
    region: str
    source_url: str
    source_feed: str
    external_id: str
    is_ai_generated: bool
    original_language: str
    published_at: datetime

# ============================================
# SANITY CLIENT
# ============================================

class SanityClient:
    """Client for Sanity CMS operations"""
    
    def __init__(self):
        self.project_id = os.environ.get("SANITY_PROJECT_ID")
        self.dataset = os.environ.get("SANITY_DATASET", "production")
        self.token = os.environ.get("SANITY_API_TOKEN")
        self.api_version = "2025-03-01"
        
        if not all([self.project_id, self.token]):
            raise ValueError("Missing Sanity configuration (SANITY_PROJECT_ID, SANITY_API_TOKEN)")
        
        self.base_url = f"https://{self.project_id}.api.sanity.io/v{self.api_version}/data"
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
    
    async def query(self, groq_query: str, params: Dict = None) -> List[Dict]:
        """Execute a GROQ query"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/query/{self.dataset}"
            response = await client.get(
                url,
                headers=self.headers,
                params={"query": groq_query, **(params or {})}
            )
            response.raise_for_status()
            return response.json().get("result", [])
    
    async def create(self, document: Dict) -> Dict:
        """Create a document in Sanity"""
        async with httpx.AsyncClient() as client:
            url = f"{self.base_url}/mutate/{self.dataset}"
            mutations = {"mutations": [{"create": document}]}
            response = await client.post(
                url,
                headers=self.headers,
                json=mutations
            )
            response.raise_for_status()
            result = response.json()
            return result.get("results", [{}])[0]
    
    async def check_exists(self, external_id: str) -> bool:
        """Check if an article with external_id already exists"""
        query = f'*[_type == "article" && externalId == "{external_id}"][0]._id'
        result = await self.query(query)
        return result is not None

# ============================================
# DEEPL TRANSLATION SERVICE
# ============================================

class TranslationService:
    """DeepL-powered translation service"""
    
    def __init__(self):
        api_key = os.environ.get("DEEPL_API_KEY")
        if not api_key:
            raise ValueError("Missing DEEPL_API_KEY")
        self.translator = deepl.Translator(api_key)
    
    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """Translate text using DeepL"""
        if source_lang == target_lang:
            return text
        
        # DeepL language codes
        lang_map = {"en": "EN-US", "es": "ES", "pt": "PT-BR"}
        target = lang_map.get(target_lang, target_lang.upper())
        
        try:
            result = self.translator.translate_text(
                text,
                target_lang=target
            )
            return result.text
        except Exception as e:
            logger.error(f"Translation error: {e}")
            return text  # Return original on error
    
    def translate_to_all(self, text: str, source_lang: str) -> Dict[str, str]:
        """Translate text to all supported languages"""
        translations = {source_lang: text}
        
        for lang in ["en", "es", "pt"]:
            if lang != source_lang:
                translations[lang] = self.translate(text, source_lang, lang)
        
        return translations

# ============================================
# AI CONTENT PROCESSOR
# ============================================

class AIContentProcessor:
    """GPT-5.2 powered content processor for solutions journalism"""
    
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not self.api_key:
            raise ValueError("Missing EMERGENT_LLM_KEY")
    
    async def process_article(self, article: RSSArticle) -> Dict:
        """
        Process raw RSS article into solutions journalism format using GPT-5.2
        
        Returns structured content with:
        - Rewritten title (engaging, solutions-focused)
        - Standfirst (compelling summary)
        - Body (Problem → Solution → Impact structure)
        - Category classification
        - Region detection
        """
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        system_prompt = """You are an expert solutions journalist for LATAM Reportero, a platform covering Latin America with a solutions-oriented approach.

Your task is to transform news articles into our "solutions journalism" format that focuses on:
1. THE PROBLEM: What challenge or issue is being addressed?
2. THE SOLUTION: What innovative approaches are being tried?
3. THE IMPACT: What measurable results or potential outcomes exist?

RULES:
- Be factual and cite specific data when available
- Focus on constructive, solution-oriented angles
- Maintain journalistic integrity - don't invent facts
- Make content engaging and accessible
- Identify the most relevant LATAM region if applicable

OUTPUT FORMAT (JSON):
{
    "title": "Engaging, solutions-focused headline",
    "standfirst": "Compelling 1-2 sentence summary (max 200 chars)",
    "problem": "Description of the challenge (2-3 paragraphs)",
    "solution": "Description of solutions being implemented (2-3 paragraphs)",
    "impact": "Measurable outcomes or potential impact (1-2 paragraphs)",
    "category": "One of: environment, economy, health, education, politics, technology, human-rights, infrastructure, agriculture, energy",
    "region": "One of: mexico, brazil, argentina, colombia, chile, peru, venezuela, ecuador, bolivia, central-america, caribbean, latam, international, europe",
    "key_facts": ["Fact 1", "Fact 2", "Fact 3"]
}"""

        user_prompt = f"""Transform this news article into solutions journalism format:

TITLE: {article.title}

CONTENT:
{article.content[:4000]}

SOURCE: {article.source_feed}
PUBLISHED: {article.published.isoformat()}

Please analyze this article and rewrite it in our solutions journalism format. If the article doesn't have clear solutions, identify what solutions COULD address the problem mentioned."""

        try:
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"rss-process-{article.external_id}",
                system_message=system_prompt
            )
            chat.with_model("openai", "gpt-5.2")
            
            message = UserMessage(text=user_prompt)
            response = await chat.send_message(message)
            
            # Parse JSON response
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                return json.loads(json_match.group())
            else:
                logger.error(f"Failed to parse AI response: {response[:500]}")
                return None
                
        except Exception as e:
            logger.error(f"AI processing error: {e}")
            return None
    
    def to_portable_text(self, text: str) -> List[Dict]:
        """Convert plain text to Sanity Portable Text format"""
        blocks = []
        paragraphs = text.split('\n\n')
        
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # Check for headers (lines starting with **)
            if para.startswith('**') and para.endswith('**'):
                blocks.append({
                    "_type": "block",
                    "_key": hashlib.md5(para.encode()).hexdigest()[:12],
                    "style": "h3",
                    "children": [{"_type": "span", "text": para.strip('*')}]
                })
            else:
                blocks.append({
                    "_type": "block",
                    "_key": hashlib.md5(para.encode()).hexdigest()[:12],
                    "style": "normal",
                    "children": [{"_type": "span", "text": para}]
                })
        
        return blocks

# ============================================
# RSS FEED SERVICE
# ============================================

class RSSFeedService:
    """Service for fetching and parsing RSS feeds"""
    
    @staticmethod
    def generate_external_id(url: str, title: str) -> str:
        """Generate unique ID from URL and title"""
        content = f"{url}:{title}"
        return hashlib.md5(content.encode()).hexdigest()[:16]
    
    @staticmethod
    def generate_slug(title: str) -> str:
        """Generate URL-friendly slug"""
        slug = title.lower()
        slug = re.sub(r'[áàäâã]', 'a', slug)
        slug = re.sub(r'[éèëê]', 'e', slug)
        slug = re.sub(r'[íìïî]', 'i', slug)
        slug = re.sub(r'[óòöôõ]', 'o', slug)
        slug = re.sub(r'[úùüû]', 'u', slug)
        slug = re.sub(r'[ñ]', 'n', slug)
        slug = re.sub(r'[ç]', 'c', slug)
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        slug = slug.strip('-')[:80]
        return slug
    
    async def fetch_feed(self, feed_key: str) -> List[RSSArticle]:
        """Fetch and parse a single RSS feed"""
        if feed_key not in RSS_FEEDS:
            raise ValueError(f"Unknown feed: {feed_key}")
        
        feed_config = RSS_FEEDS[feed_key]
        articles = []
        
        try:
            logger.info(f"Fetching feed: {feed_config['name']}")
            
            # Use httpx to fetch (handles redirects better)
            async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
                response = await client.get(feed_config["url"])
                content = response.text
            
            # Parse with feedparser
            parsed = feedparser.parse(content)
            
            if parsed.bozo:
                logger.warning(f"Feed parsing warning for {feed_key}: {parsed.bozo_exception}")
            
            for entry in parsed.entries[:10]:  # Limit to 10 per feed
                try:
                    # Extract published date
                    published = datetime.now(timezone.utc)
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                        published = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                    elif hasattr(entry, 'updated_parsed') and entry.updated_parsed:
                        published = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
                    
                    # Extract content
                    content = ""
                    if hasattr(entry, 'content') and entry.content:
                        content = entry.content[0].get('value', '')
                    elif hasattr(entry, 'summary'):
                        content = entry.summary
                    elif hasattr(entry, 'description'):
                        content = entry.description
                    
                    # Clean HTML
                    content = re.sub(r'<[^>]+>', '', content)
                    
                    # Extract summary
                    summary = entry.get('summary', content[:300])
                    summary = re.sub(r'<[^>]+>', '', summary)
                    
                    article = RSSArticle(
                        title=entry.get('title', 'Untitled'),
                        content=content,
                        summary=summary[:300],
                        link=entry.get('link', ''),
                        published=published,
                        author=entry.get('author', feed_config['name']),
                        source_feed=feed_config['name'],
                        source_language=feed_config['language'],
                        external_id=self.generate_external_id(
                            entry.get('link', ''), 
                            entry.get('title', '')
                        )
                    )
                    articles.append(article)
                    
                except Exception as e:
                    logger.error(f"Error parsing entry in {feed_key}: {e}")
                    continue
            
            logger.info(f"Fetched {len(articles)} articles from {feed_config['name']}")
            return articles
            
        except Exception as e:
            logger.error(f"Error fetching feed {feed_key}: {e}")
            return []
    
    async def fetch_all_feeds(self) -> List[RSSArticle]:
        """Fetch all configured RSS feeds"""
        all_articles = []
        
        # Fetch feeds in parallel (but limit concurrency)
        semaphore = asyncio.Semaphore(5)
        
        async def fetch_with_semaphore(feed_key: str):
            async with semaphore:
                return await self.fetch_feed(feed_key)
        
        tasks = [fetch_with_semaphore(key) for key in RSS_FEEDS.keys()]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, list):
                all_articles.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"Feed fetch error: {result}")
        
        logger.info(f"Total articles fetched: {len(all_articles)}")
        return all_articles

# ============================================
# MAIN INGESTION SERVICE
# ============================================

class ContentIngestionService:
    """Main service orchestrating the content pipeline"""
    
    def __init__(self):
        self.rss_service = RSSFeedService()
        self.ai_processor = AIContentProcessor()
        self.translator = TranslationService()
        self.sanity = SanityClient()
    
    async def process_single_article(self, rss_article: RSSArticle) -> Optional[Dict]:
        """Process a single RSS article through the full pipeline"""
        
        # 1. Check if already exists in Sanity
        if await self.sanity.check_exists(rss_article.external_id):
            logger.info(f"Article already exists: {rss_article.title[:50]}...")
            return None
        
        # 2. Process with AI
        logger.info(f"Processing with AI: {rss_article.title[:50]}...")
        ai_result = await self.ai_processor.process_article(rss_article)
        
        if not ai_result:
            logger.error(f"AI processing failed for: {rss_article.title[:50]}")
            return None
        
        # 3. Translate to all languages
        logger.info(f"Translating: {rss_article.title[:50]}...")
        source_lang = rss_article.source_language
        
        title_translations = self.translator.translate_to_all(
            ai_result.get('title', rss_article.title), 
            source_lang
        )
        
        standfirst_translations = self.translator.translate_to_all(
            ai_result.get('standfirst', rss_article.summary), 
            source_lang
        )
        
        # Build full body content
        body_text = f"""**The Problem**

{ai_result.get('problem', 'No problem description available.')}

**Solutions Being Implemented**

{ai_result.get('solution', 'No solution description available.')}

**Impact & Outcomes**

{ai_result.get('impact', 'No impact description available.')}

**Key Facts**

{chr(10).join('• ' + fact for fact in ai_result.get('key_facts', []))}

---
*This article was generated with AI assistance from {rss_article.source_feed}. Original source: {rss_article.link}*"""

        body_translations = self.translator.translate_to_all(body_text, source_lang)
        
        # Convert to Portable Text for each language
        body_portable = {
            lang: self.ai_processor.to_portable_text(text)
            for lang, text in body_translations.items()
        }
        
        # 4. Create Sanity document
        slug = self.rss_service.generate_slug(title_translations.get('en', rss_article.title))
        
        # Create document for each language
        created_docs = []
        for lang in ['en', 'es', 'pt']:
            doc = {
                "_type": "article",
                "title": title_translations.get(lang, title_translations.get('en')),
                "slug": {"_type": "slug", "current": f"{slug}-{lang}"},
                "language": lang,
                "standfirst": standfirst_translations.get(lang, standfirst_translations.get('en')),
                "body": body_portable.get(lang, body_portable.get('en')),
                "category": ai_result.get('category', 'general'),
                "region": ai_result.get('region', 'latam'),
                "sourceUrl": rss_article.link,
                "sourceFeed": rss_article.source_feed,
                "externalId": f"{rss_article.external_id}-{lang}",
                "isAiGenerated": True,
                "status": "draft",  # Always create as draft for editorial review
                "publishedAt": rss_article.published.isoformat(),
                "createdAt": datetime.now(timezone.utc).isoformat()
            }
            
            try:
                result = await self.sanity.create(doc)
                created_docs.append(result)
                logger.info(f"Created draft in Sanity ({lang}): {doc['title'][:50]}...")
            except Exception as e:
                logger.error(f"Failed to create Sanity doc ({lang}): {e}")
        
        return {
            "original": rss_article.title,
            "processed_title": title_translations,
            "category": ai_result.get('category'),
            "region": ai_result.get('region'),
            "languages_created": len(created_docs)
        }
    
    async def run_ingestion(self, feed_keys: List[str] = None) -> Dict:
        """Run the full ingestion pipeline"""
        start_time = datetime.now(timezone.utc)
        
        # Fetch articles
        if feed_keys:
            all_articles = []
            for key in feed_keys:
                articles = await self.rss_service.fetch_feed(key)
                all_articles.extend(articles)
        else:
            all_articles = await self.rss_service.fetch_all_feeds()
        
        # Process each article
        results = {
            "total_fetched": len(all_articles),
            "processed": 0,
            "skipped_existing": 0,
            "failed": 0,
            "articles": []
        }
        
        for article in all_articles:
            try:
                result = await self.process_single_article(article)
                if result:
                    results["processed"] += 1
                    results["articles"].append(result)
                else:
                    results["skipped_existing"] += 1
            except Exception as e:
                logger.error(f"Error processing article: {e}")
                results["failed"] += 1
        
        results["duration_seconds"] = (datetime.now(timezone.utc) - start_time).total_seconds()
        results["timestamp"] = start_time.isoformat()
        
        return results


# ============================================
# SCHEDULED TASK RUNNER
# ============================================

async def run_scheduled_ingestion():
    """Entry point for scheduled ingestion (every 3 hours)"""
    logger.info("Starting scheduled content ingestion...")
    
    try:
        service = ContentIngestionService()
        results = await service.run_ingestion()
        
        logger.info(f"Ingestion complete: {results['processed']} new articles, "
                   f"{results['skipped_existing']} skipped, {results['failed']} failed")
        
        return results
    except Exception as e:
        logger.error(f"Scheduled ingestion failed: {e}")
        raise


if __name__ == "__main__":
    # Test run
    logging.basicConfig(level=logging.INFO)
    asyncio.run(run_scheduled_ingestion())
