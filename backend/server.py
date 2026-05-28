from fastapi import FastAPI, APIRouter, HTTPException, Request, File, UploadFile
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
# Drop-in replacements for emergentintegrations (private package not on PyPI)
from openai import AsyncOpenAI as _AsyncOpenAI
import stripe as _stripe

class UserMessage:
    def __init__(self, text): self.text = text

class LlmChat:
    def __init__(self, api_key, session_id=None, system_message=""):
        self.client = _AsyncOpenAI(api_key=api_key)
        self.model_name = "gpt-4o"
        self.messages = []
        if system_message:
            self.messages.append({"role": "system", "content": system_message})
    def with_model(self, provider, model):
        self.model_name = model; return self
    async def send_message(self, user_message):
        self.messages.append({"role": "user", "content": user_message.text})
        completion = await self.client.chat.completions.create(model=self.model_name, messages=self.messages)
        response = completion.choices[0].message.content
        self.messages.append({"role": "assistant", "content": response})
        return response

class CheckoutSessionRequest:
    def __init__(self, amount, currency, success_url, cancel_url, metadata=None):
        self.amount = amount; self.currency = currency
        self.success_url = success_url; self.cancel_url = cancel_url
        self.metadata = metadata or {}

class CheckoutSessionResponse:
    def __init__(self, session_id, url): self.session_id = session_id; self.url = url

class CheckoutStatusResponse:
    def __init__(self, payment_status, status): self.payment_status = payment_status; self.status = status

class StripeCheckout:
    def __init__(self, api_key, webhook_url=None):
        _stripe.api_key = api_key
    async def create_checkout_session(self, request):
        session = _stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price_data": {"currency": request.currency, "product_data": {"name": request.metadata.get("plan_name", "Subscription")}, "unit_amount": request.amount}, "quantity": 1}],
            mode="payment", success_url=request.success_url, cancel_url=request.cancel_url, metadata=request.metadata)
        return CheckoutSessionResponse(session_id=session.id, url=session.url)
    async def get_checkout_status(self, session_id):
        session = _stripe.checkout.Session.retrieve(session_id)
        return CheckoutStatusResponse(payment_status=session.payment_status, status=session.status)

class OpenAITextToSpeech:
    def __init__(self, api_key): self.client = _AsyncOpenAI(api_key=api_key)
    async def generate_speech(self, text, model="tts-1-hd", voice="nova", **kwargs):
        response = await self.client.audio.speech.create(model=model, voice=voice, input=text)
        return response.content
import jwt
import bcrypt

# Import RSS ingestion service
from rss_ingestion import ContentIngestionService, RSSFeedService, run_scheduled_ingestion
from rss_config import RSS_FEEDS


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# LLM API key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'latam-reportero-jwt-secret-2026')

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Sanity configuration
SANITY_PROJECT_ID = os.environ.get('SANITY_PROJECT_ID', 's5taeh5v')
SANITY_DATASET = os.environ.get('SANITY_DATASET', 'production')
SANITY_API_TOKEN = os.environ.get('SANITY_API_TOKEN')

# Make.com configuration
MAKE_API_KEY = os.environ.get('MAKE_API_KEY')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============================================
# BACKGROUND SCHEDULER (replaces crontab)
# ============================================
RSS_INGESTION_INTERVAL_HOURS = 3
_scheduler_task = None

async def _rss_scheduler_loop():
    """Background loop that runs RSS ingestion every N hours"""
    import asyncio as _asyncio
    while True:
        try:
            await _asyncio.sleep(RSS_INGESTION_INTERVAL_HOURS * 3600)
            logging.getLogger(__name__).info("Scheduled RSS ingestion starting...")
            service = ContentIngestionService()
            results = await service.run_ingestion()
            logging.getLogger(__name__).info(
                f"Scheduled ingestion done: {results.get('processed', 0)} new, "
                f"{results.get('skipped_existing', 0)} skipped"
            )
        except Exception as e:
            logging.getLogger(__name__).error(f"Scheduled ingestion error: {e}")

@app.on_event("startup")
async def start_scheduler():
    import asyncio as _asyncio
    global _scheduler_task
    _scheduler_task = _asyncio.create_task(_rss_scheduler_loop())
    logging.getLogger(__name__).info(f"RSS scheduler started (every {RSS_INGESTION_INTERVAL_HOURS}h)")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# VoiceBot Chat Models
class ArticleContext(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    problem: Optional[str] = None
    solutions: Optional[str] = None
    impact: Optional[str] = None
    category: Optional[str] = None
    region: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class VoiceBotChatRequest(BaseModel):
    message: str
    article: Optional[ArticleContext] = None
    history: Optional[List[Dict[str, Any]]] = None

# Admin Password Change Model
class AdminPasswordChangeRequest(BaseModel):
    userId: str
    newPassword: str

# Stripe Payment Models
class CreateCheckoutRequest(BaseModel):
    plan_id: str  # 'standard' or 'premium'
    origin_url: str  # Frontend origin URL

class CheckoutStatusRequest(BaseModel):
    session_id: str

# AI Search Models
class AISearchRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

class AISearchResponse(BaseModel):
    answer: str
    articles: List[Dict[str, Any]]
    session_id: str
    follow_up_suggestions: List[str]

# Comment Models
class CreateCommentRequest(BaseModel):
    article_slug: str
    user_email: str
    user_name: str
    content: str
    user_role: str

PAID_ROLES = {"paid", "subscriber", "contributor", "editor", "admin"}

# Auth Models
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# Define subscription plans (server-side only)
SUBSCRIPTION_PLANS = {
    "standard": {
        "name": "Standard",
        "amount": 9.99,
        "currency": "usd",
        "features": ["Access to all articles", "AI Voice Bot", "Community access"]
    },
    "premium": {
        "name": "Premium",
        "amount": 19.99,
        "currency": "usd",
        "features": ["All Standard features", "Exclusive content", "Priority support", "Early access"]
    }
}

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Health check endpoint for deployment
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "latam-reportero-backend"}

# ============================================
# AUTH ENDPOINTS (MongoDB + JWT)
# ============================================

def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def _verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def _create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc).timestamp() + 86400 * 7  # 7 days
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def _decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

@api_router.post("/auth/signup")
async def signup(request: SignupRequest):
    """Register a new user"""
    existing = await db.users.find_one({"email": request.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_doc = {
        "id": str(uuid.uuid4()),
        "name": request.name,
        "email": request.email.lower(),
        "password_hash": _hash_password(request.password),
        "role": "free",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = _create_token(user_doc["id"], user_doc["email"], user_doc["role"])
    
    return {
        "token": token,
        "user": {
            "id": user_doc["id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": user_doc["role"]
        }
    }

@api_router.post("/auth/login")
async def login(request: LoginRequest):
    """Login with email and password"""
    user = await db.users.find_one({"email": request.email.lower()})
    if not user or not _verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = _create_token(user["id"], user["email"], user["role"])
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }

@api_router.get("/auth/me")
async def get_current_user(request: Request):
    """Get current user from JWT token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = _decode_token(auth_header.split(" ")[1])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"user": user}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# VoiceBot Chat Endpoint
@api_router.post("/voicebot/chat")
async def voicebot_chat(request: VoiceBotChatRequest):
    """Chat endpoint for ArticleVoiceBot using OpenAI via Emergent LLM key"""
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Build article context for the system message
        article_context = ""
        if request.article:
            article_context = f"""
You are an AI assistant helping users understand a news article about Latin America.

ARTICLE DETAILS:
Title: {request.article.title or 'N/A'}
Summary: {request.article.excerpt or 'N/A'}
Category: {request.article.category or 'N/A'}
Region: {request.article.region or 'N/A'}

PROBLEM DISCUSSED:
{request.article.problem or 'Not specified'}

SOLUTIONS PRESENTED:
{request.article.solutions or 'Not specified'}

IMPACT:
{request.article.impact or 'Not specified'}
"""
        
        system_message = f"""You are a helpful Article Assistant for LATAM Reportero, a solutions-oriented journalism platform focused on Latin America.
{article_context}

Your role:
1. Answer questions about this specific article's content
2. Explain complex topics in simple terms
3. Provide context about the region or issue being discussed
4. Be conversational and helpful
5. If asked about something not in the article, politely say you can only discuss the article's content

Keep responses concise (2-3 paragraphs max) and engaging. Use a friendly, journalistic tone."""

        # Generate unique session ID for this conversation
        session_id = f"article-chat-{uuid.uuid4()}"
        
        # Initialize the chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        )
        
        # Use GPT-4o for good performance and cost balance
        chat.with_model("openai", "gpt-4o")
        
        # Build conversation with history
        if request.history:
            for msg in request.history:
                if msg.get('role') == 'user':
                    user_msg = UserMessage(text=msg.get('content', ''))
                    await chat.send_message(user_msg)
                # Note: Assistant messages are handled by the library's history
        
        # Send the current message
        user_message = UserMessage(text=request.message)
        response = await chat.send_message(user_message)
        
        return {"response": response, "session_id": session_id}
        
    except Exception as e:
        logger.error(f"VoiceBot chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin Password Change Endpoint
@api_router.post("/admin/users/password")
async def admin_change_password(request: AdminPasswordChangeRequest):
    """Admin endpoint to change a user's password using MongoDB"""
    try:
        if len(request.newPassword) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Find user by ID
        user = await db.users.find_one({"id": request.userId})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Hash new password
        new_password_hash = bcrypt.hashpw(request.newPassword.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Update password
        result = await db.users.update_one(
            {"id": request.userId},
            {"$set": {"password_hash": new_password_hash}}
        )
        
        if result.modified_count > 0:
            logger.info(f"Password changed successfully for user: {request.userId}")
            return {"success": True, "message": "Password changed successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to change password")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to change password: {str(e)}")

# ============================================
# STRIPE PAYMENT ENDPOINTS
# ============================================

@api_router.get("/payments/plans")
async def get_subscription_plans():
    """Get available subscription plans"""
    return {
        "plans": [
            {"id": plan_id, **plan_data}
            for plan_id, plan_data in SUBSCRIPTION_PLANS.items()
        ]
    }

@api_router.post("/payments/checkout")
async def create_checkout_session(request: CreateCheckoutRequest, http_request: Request):
    """Create a Stripe checkout session for a subscription plan"""
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    # Validate plan exists
    if request.plan_id not in SUBSCRIPTION_PLANS:
        raise HTTPException(status_code=400, detail=f"Invalid plan: {request.plan_id}")
    
    plan = SUBSCRIPTION_PLANS[request.plan_id]
    
    try:
        # Initialize Stripe checkout
        host_url = str(http_request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Build success and cancel URLs using frontend origin
        success_url = f"{request.origin_url}/pricing?session_id={{CHECKOUT_SESSION_ID}}&status=success"
        cancel_url = f"{request.origin_url}/pricing?status=cancelled"
        
        # Create checkout session request
        checkout_request = CheckoutSessionRequest(
            amount=plan["amount"],
            currency=plan["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "plan_id": request.plan_id,
                "plan_name": plan["name"]
            }
        )
        
        # Create checkout session
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        # Store transaction in database
        transaction_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session.session_id,
            "plan_id": request.plan_id,
            "plan_name": plan["name"],
            "amount": plan["amount"],
            "currency": plan["currency"],
            "payment_status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payment_transactions.insert_one(transaction_doc)
        
        return {
            "checkout_url": session.url,
            "session_id": session.session_id
        }
        
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout: {str(e)}")

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, http_request: Request):
    """Get the status of a payment session"""
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    try:
        # Initialize Stripe checkout
        host_url = str(http_request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Get checkout status
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": status.payment_status,
                "status": status.status,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )
        
        return {
            "session_id": session_id,
            "status": status.status,
            "payment_status": status.payment_status,
            "amount": status.amount_total / 100,  # Convert cents to dollars
            "currency": status.currency,
            "metadata": status.metadata
        }
        
    except Exception as e:
        logger.error(f"Error getting payment status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get payment status: {str(e)}")

# ============================================
# AI SEARCH ENDPOINT
# ============================================

@api_router.post("/ai-search", response_model=AISearchResponse)
async def ai_search(request: AISearchRequest, req: Request):
    """AI-powered article search with conversational follow-ups
    
    Access control:
    - Free users: Can only search AI-generated articles
    - Paid users: Can search ALL articles including human-written
    """
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Check user subscription status from token
        is_subscriber = False
        auth_header = req.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            try:
                token = auth_header.split(" ")[1]
                payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
                user_role = payload.get("role", "free")
                is_subscriber = user_role in ["paid", "subscriber", "contributor", "editor", "admin"]
            except (jwt.InvalidTokenError, jwt.ExpiredSignatureError):
                pass  # Invalid token, treat as free user
        
        # Fetch articles from Sanity
        import httpx as _httpx
        project_id = os.environ.get("SANITY_PROJECT_ID", "s5taeh5v")
        dataset = os.environ.get("SANITY_DATASET", "production")
        
        # Build query based on subscription status
        if is_subscriber:
            # Subscribers can search ALL published articles
            sanity_query = '*[_type == "article" && status == "published" && language == "en"] | order(publishedAt desc) [0...30] {_id, title, "slug": slug.current, standfirst, category, region, isAiGenerated, sourceFeed}'
        else:
            # Free users can ONLY search AI-generated articles
            sanity_query = '*[_type == "article" && status == "published" && language == "en" && isAiGenerated == true] | order(publishedAt desc) [0...30] {_id, title, "slug": slug.current, standfirst, category, region, isAiGenerated, sourceFeed}'
        
        async with _httpx.AsyncClient() as http_client:
            sanity_url = f"https://{project_id}.api.sanity.io/v2025-03-01/data/query/{dataset}"
            resp = await http_client.get(sanity_url, params={"query": sanity_query})
            sanity_data = resp.json()
        
        articles = sanity_data.get("result", [])
        
        # Build article summaries for the LLM
        article_summaries = []
        for i, art in enumerate(articles):
            summary = f"""
Article {i+1}:
- Title: {art.get('title', 'Untitled')}
- Summary: {art.get('standfirst', 'No summary')}
- Category: {art.get('category', 'General')}
- Region: {art.get('region', 'Unknown')}
- Slug: {art.get('slug', '')}
"""
            article_summaries.append(summary)
        
        articles_context = "\n".join(article_summaries)
        
        # System message for the search assistant
        system_message = f"""You are an intelligent search assistant for LATAM Reportero, a solutions-oriented journalism platform focused on Latin America.

AVAILABLE ARTICLES:
{articles_context}

YOUR ROLE:
1. Understand the user's search query (they may ask in natural language)
2. Find the most relevant articles from the list above
3. Explain WHY these articles match their search
4. Be conversational and helpful
5. If the user asks follow-up questions, remember the context

RESPONSE FORMAT:
- Start with a brief, friendly response addressing their query
- Mention the relevant articles by their titles
- At the end, include a JSON block with the article slugs like this:
MATCHED_ARTICLES: ["slug1", "slug2", "slug3"]

Keep responses concise but helpful. You can suggest related topics they might be interested in."""

        # Generate or use existing session ID
        session_id = request.session_id or f"search-{uuid.uuid4()}"
        
        # Initialize the chat
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=session_id,
            system_message=system_message
        )
        
        # Use GPT-5.2 for best understanding
        chat.with_model("openai", "gpt-5.2")
        
        # Build conversation history if provided
        if request.history:
            for msg in request.history:
                if msg.get('role') == 'user':
                    user_msg = UserMessage(text=msg.get('content', ''))
                    await chat.send_message(user_msg)
        
        # Send the search query
        user_message = UserMessage(text=request.query)
        response = await chat.send_message(user_message)
        
        # Parse matched articles from response
        matched_slugs = []
        if "MATCHED_ARTICLES:" in response:
            try:
                import json
                json_part = response.split("MATCHED_ARTICLES:")[1].strip()
                # Find the JSON array
                start = json_part.find('[')
                end = json_part.find(']') + 1
                if start >= 0 and end > start:
                    matched_slugs = json.loads(json_part[start:end])
            except (json.JSONDecodeError, IndexError, ValueError):
                pass
        
        # Clean the response (remove the JSON part for display)
        clean_response = response.split("MATCHED_ARTICLES:")[0].strip()
        
        # Get full article data for matched slugs
        matched_articles = []
        for art in articles:
            if art.get('slug') in matched_slugs:
                matched_articles.append({
                    'id': art.get('_id'),
                    'title': art.get('title'),
                    'excerpt': art.get('standfirst'),
                    'slug': art.get('slug'),
                    'category': art.get('category', 'General'),
                    'region': art.get('region'),
                    'author': art.get('sourceFeed', 'Staff Writer')
                })
        
        # If no matches found via JSON, try to find articles mentioned in text
        if not matched_articles:
            response_lower = clean_response.lower()
            for art in articles:
                title = art.get('title', '').lower()
                title_words = [w for w in title.split() if len(w) > 4]
                matches = sum(1 for w in title_words if w in response_lower)
                if matches >= 2 or art.get('slug', '') in response_lower:
                    matched_articles.append({
                        'id': art.get('_id'),
                        'title': art.get('title'),
                        'excerpt': art.get('standfirst'),
                        'slug': art.get('slug'),
                        'category': art.get('category', 'General'),
                        'region': art.get('region'),
                        'author': art.get('sourceFeed', 'Staff Writer')
                    })
        
        # Generate follow-up suggestions
        follow_ups = [
            "Show me more articles about this topic",
            "What other regions have similar stories?",
            "Find articles about different solutions"
        ]
        
        # Add subscription prompt for free users
        access_note = ""
        if not is_subscriber:
            access_note = "\n\n*Note: Subscribe to search our full library including human-written investigative journalism.*"
            clean_response = clean_response + access_note
        
        # Store search in MongoDB for analytics
        search_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "query": request.query,
            "matched_count": len(matched_articles),
            "matched_slugs": [a.get('slug') for a in matched_articles],
            "is_subscriber": is_subscriber,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.ai_searches.insert_one(search_doc)
        
        return AISearchResponse(
            answer=clean_response,
            articles=matched_articles[:5],  # Return top 5 matches
            session_id=session_id,
            follow_up_suggestions=follow_ups
        )
        
    except Exception as e:
        logger.error(f"AI Search error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    if not STRIPE_API_KEY:
        raise HTTPException(status_code=500, detail="Stripe is not configured")
    
    try:
        # Get request body
        body = await request.body()
        signature = request.headers.get("Stripe-Signature")
        
        # Initialize Stripe checkout
        host_url = str(request.base_url).rstrip('/')
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
        
        # Handle webhook
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        # Update transaction based on webhook event
        if webhook_response.session_id:
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {
                    "payment_status": webhook_response.payment_status,
                    "event_type": webhook_response.event_type,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return {"status": "received"}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ============================================
# VOICE TRANSCRIPTION (WHISPER) ENDPOINT
# ============================================

@api_router.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio using OpenAI Whisper via Emergent"""
    try:
        pass  # LlmChat/UserMessage already defined at module level
        
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        # Save uploaded file temporarily
        import tempfile
        import os as local_os
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp_file:
            content = await audio.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Use OpenAI Whisper for transcription
            import httpx
            
            # For now, use a simple approach - send to OpenAI directly
            # In production, this would use the Emergent integrations library
            async with httpx.AsyncClient() as client:
                with open(tmp_path, "rb") as f:
                    response = await client.post(
                        "https://api.openai.com/v1/audio/transcriptions",
                        headers={"Authorization": f"Bearer {EMERGENT_LLM_KEY}"},
                        files={"file": ("audio.webm", f, "audio/webm")},
                        data={"model": "whisper-1"},
                        timeout=30.0
                    )
                
                if response.status_code == 200:
                    result = response.json()
                    return {"text": result.get("text", ""), "success": True}
                else:
                    logger.error(f"Whisper API error: {response.text}")
                    return {"text": "", "success": False, "error": "Transcription failed"}
                    
        finally:
            # Cleanup temp file
            local_os.unlink(tmp_path)
            
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# RSS INGESTION ENDPOINTS
# ============================================

class RSSIngestionRequest(BaseModel):
    feed_keys: Optional[List[str]] = None  # If None, ingest from all feeds

class RSSIngestionResponse(BaseModel):
    total_fetched: int
    processed: int
    skipped_existing: int
    failed: int
    duration_seconds: float
    timestamp: str

@api_router.get("/rss/feeds")
async def list_rss_feeds():
    """List all configured RSS feeds"""
    feeds = []
    for key, config in RSS_FEEDS.items():
        feeds.append({
            "key": key,
            "name": config["name"],
            "language": config["language"],
            "region": config["region"],
            "category": config["category"]
        })
    return {"feeds": feeds, "total": len(feeds)}

@api_router.post("/rss/ingest", response_model=RSSIngestionResponse)
async def trigger_rss_ingestion(request: RSSIngestionRequest):
    """
    Trigger RSS feed ingestion.
    
    This will:
    1. Fetch articles from RSS feeds
    2. Process with AI (GPT-5.2) into solutions journalism format
    3. Translate to EN/ES/PT using DeepL
    4. Create drafts in Sanity CMS (tagged as AI-generated)
    """
    try:
        service = ContentIngestionService()
        results = await service.run_ingestion(request.feed_keys)
        
        # Store ingestion log in MongoDB
        log_doc = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "results": {
                "total_fetched": results["total_fetched"],
                "processed": results["processed"],
                "skipped_existing": results["skipped_existing"],
                "failed": results["failed"]
            },
            "duration_seconds": results["duration_seconds"]
        }
        await db.rss_ingestion_logs.insert_one(log_doc)
        
        return RSSIngestionResponse(
            total_fetched=results["total_fetched"],
            processed=results["processed"],
            skipped_existing=results["skipped_existing"],
            failed=results["failed"],
            duration_seconds=results["duration_seconds"],
            timestamp=results["timestamp"]
        )
    except Exception as e:
        logger.error(f"RSS ingestion error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/rss/test-feed/{feed_key}")
async def test_single_feed(feed_key: str):
    """Test fetching a single RSS feed without processing"""
    if feed_key not in RSS_FEEDS:
        raise HTTPException(status_code=404, detail=f"Feed not found: {feed_key}")
    
    try:
        service = RSSFeedService()
        articles = await service.fetch_feed(feed_key)
        
        return {
            "feed": RSS_FEEDS[feed_key]["name"],
            "articles_found": len(articles),
            "sample_articles": [
                {
                    "title": a.title,
                    "published": a.published.isoformat(),
                    "source": a.source_feed,
                    "link": a.link[:100]
                }
                for a in articles[:5]
            ]
        }
    except Exception as e:
        logger.error(f"Feed test error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/rss/ingestion-logs")
async def get_ingestion_logs(limit: int = 20):
    """Get recent RSS ingestion logs"""
    logs = await db.rss_ingestion_logs.find().sort("timestamp", -1).limit(limit).to_list(limit)
    
    for log in logs:
        log.pop("_id", None)
    
    return {"logs": logs}

# ============================================
# COMMENTS ENDPOINTS
# ============================================

@api_router.post("/comments")
async def create_comment(request: CreateCommentRequest):
    """Create a comment - only paid/verified users"""
    if request.user_role not in PAID_ROLES:
        raise HTTPException(status_code=403, detail="Only subscribers can leave comments")
    
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Comment cannot be empty")
    
    comment_doc = {
        "id": str(uuid.uuid4()),
        "article_slug": request.article_slug,
        "user_email": request.user_email,
        "user_name": request.user_name,
        "content": request.content.strip(),
        "user_role": request.user_role,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.comments.insert_one(comment_doc)
    comment_doc.pop("_id", None)
    
    return {"comment": comment_doc}

@api_router.get("/comments/{article_slug}")
async def get_comments(article_slug: str):
    """Get comments for an article"""
    comments = await db.comments.find(
        {"article_slug": article_slug},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    return {"comments": comments}

# ============================================
# SANITY PROXY ENDPOINTS (avoids CORS issues)
# ============================================

SANITY_PROJECT_ID = os.environ.get("SANITY_PROJECT_ID", "s5taeh5v")
SANITY_DATASET = os.environ.get("SANITY_DATASET", "production")
SANITY_API_VERSION = "2025-03-01"

async def _sanity_query(groq_query: str, params: Dict = None) -> Any:
    """Execute a GROQ query against Sanity"""
    import httpx as _httpx
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v{SANITY_API_VERSION}/data/query/{SANITY_DATASET}"
    async with _httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, params={"query": groq_query, **(params or {})})
        return resp.json().get("result", [])

@api_router.get("/sanity/articles")
async def get_sanity_articles(
    language: str = "en", 
    limit: int = 50,
    status: str = None,
    category: str = None,
    ai_only: str = None
):
    """Fetch articles from Sanity by language with optional filters"""
    # Build filter conditions
    conditions = ['_type == "article"', f'language == "{language}"']
    
    if status and status != 'all':
        conditions.append(f'status == "{status}"')
    else:
        # By default, show all articles regardless of status for admin views
        pass
    
    if category and category != 'all':
        conditions.append(f'category == "{category}"')
    
    if ai_only == 'true':
        conditions.append('isAiGenerated == true')
    
    filter_str = " && ".join(conditions)
    query = f'*[{filter_str}] | order(publishedAt desc) [0...{limit}] {{_id, title, "slug": slug.current, language, standfirst, body, problem, solutions, impact, category, region, isAiGenerated, status, publishedAt, createdAt, sourceFeed, sourceUrl, "featuredImage": featuredImage.asset->url}}'
    articles = await _sanity_query(query)
    return {"articles": articles}

@api_router.get("/sanity/articles/all")
async def get_all_sanity_articles(limit: int = 50):
    """Fetch all published articles from Sanity"""
    query = f'*[_type == "article" && status == "published"] | order(publishedAt desc) [0...{limit}] {{_id, title, "slug": slug.current, language, standfirst, category, region, isAiGenerated, publishedAt, sourceFeed, sourceUrl, "featuredImage": featuredImage.asset->url}}'
    articles = await _sanity_query(query)
    return {"articles": articles}

@api_router.get("/sanity/articles/by-type")
async def get_sanity_articles_by_type(
    content_type: str,
    language: str = "en",
    limit: int = 10,
    status: str = "published"
):
    """Fetch articles filtered by contentType (morning-brief, press-review, deep-dive, video-post, article)."""
    conditions = ['_type == "article"', f'language == "{language}"', f'contentType == "{content_type}"']
    if status and status != 'all':
        conditions.append(f'status == "{status}"')
    filter_str = " && ".join(conditions)
    query = (
        f'*[{filter_str}] | order(publishedAt desc) [0...{limit}] '
        '{_id, title, "slug": slug.current, language, standfirst, category, region, '
        'isAiGenerated, contentType, authorName, authorSlug, tags, status, publishedAt, createdAt, '
        '"featuredImage": featuredImage.asset->url}'
    )
    articles = await _sanity_query(query)
    return {"articles": articles, "content_type": content_type}

@api_router.get("/sanity/homepage")
async def get_sanity_homepage(language: str = "en"):
    """Fetch grouped content for the homepage in a single call."""
    base_fields = (
        '{_id, title, "slug": slug.current, language, standfirst, category, region, '
        'isAiGenerated, contentType, authorName, authorSlug, tags, publishedAt, '
        '"featuredImage": featuredImage.asset->url}'
    )
    pub = f'_type == "article" && status == "published" && language == "{language}"'
    query = (
        '{'
        f'"hero": *[{pub} && contentType in ["morning-brief", "press-review"]] | order(publishedAt desc) [0] {base_fields},'
        f'"morningBriefs": *[{pub} && contentType == "morning-brief"] | order(publishedAt desc) [0...4] {base_fields},'
        f'"pressReviews": *[{pub} && contentType == "press-review"] | order(publishedAt desc) [0...4] {base_fields},'
        f'"deepDives": *[{pub} && contentType == "deep-dive"] | order(publishedAt desc) [0...4] {base_fields},'
        f'"videoPosts": *[{pub} && contentType == "video-post"] | order(publishedAt desc) [0...4] {base_fields},'
        f'"latest": *[{pub}] | order(publishedAt desc) [0...10] {base_fields}'
        '}'
    )
    result = await _sanity_query(query)
    # _sanity_query returns the value of "result" key. For object queries, it's a dict.
    return result if isinstance(result, dict) else {}

@api_router.get("/sanity/article/{slug}")
async def get_sanity_article(slug: str):
    """Fetch a single article by slug from Sanity"""
    query = f'*[_type == "article" && slug.current == "{slug}"][0] {{_id, title, "slug": slug.current, language, standfirst, body, category, region, sourceUrl, sourceFeed, isAiGenerated, aiDisclosure, status, publishedAt, createdAt, "featuredImage": featuredImage.asset->url, "authorName": author->name, "authorVerified": author->isVerified, "authorVerificationLevel": author->verificationLevel}}'
    article = await _sanity_query(query)
    return {"article": article}

@api_router.patch("/sanity/article/{article_id}/status")
async def update_sanity_article_status(article_id: str, request: Request):
    """Update an article's status in Sanity (draft, published, rejected)"""
    try:
        data = await request.json()
        new_status = data.get('status')
        
        if new_status not in ['draft', 'published', 'rejected']:
            raise HTTPException(status_code=400, detail="Invalid status. Must be draft, published, or rejected.")
        
        # Sanity mutation API
        mutations = [{
            "patch": {
                "id": article_id,
                "set": {
                    "status": new_status
                }
            }
        }]
        
        if new_status == 'published':
            mutations[0]["patch"]["set"]["publishedAt"] = datetime.now(timezone.utc).isoformat()
        
        sanity_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                sanity_url,
                headers={
                    "Authorization": f"Bearer {SANITY_API_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={"mutations": mutations}
            )
            
            if response.status_code != 200:
                logger.error(f"Sanity mutation error: {response.text}")
                raise HTTPException(status_code=500, detail="Failed to update article status")
            
            return {"success": True, "status": new_status, "article_id": article_id}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating article status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/sanity/article/{article_id}")
async def delete_sanity_article(article_id: str):
    """Delete an article from Sanity"""
    try:
        mutations = [{
            "delete": {
                "id": article_id
            }
        }]
        
        sanity_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                sanity_url,
                headers={
                    "Authorization": f"Bearer {SANITY_API_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={"mutations": mutations}
            )
            
            if response.status_code != 200:
                logger.error(f"Sanity delete error: {response.text}")
                raise HTTPException(status_code=500, detail="Failed to delete article")
            
            return {"success": True, "deleted": article_id}
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting article: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================
# MAKE.COM WEBHOOK ENDPOINTS
# ============================================

class MakeArticleRequest(BaseModel):
    """Request from Make.com with RSS article data"""
    title: str
    content: str
    source_url: str
    source_name: str
    published_at: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    region: Optional[str] = "latam"
    language: Optional[str] = "en"

class MakeArticleResponse(BaseModel):
    """Response to Make.com after processing"""
    success: bool
    article_id: Optional[str] = None
    sanity_id: Optional[str] = None
    title: str
    slug: str
    message: str

@api_router.post("/make/process-article", response_model=MakeArticleResponse)
async def make_process_article(request: MakeArticleRequest):
    """
    Webhook endpoint for Make.com to send RSS articles for AI processing.
    
    Flow:
    1. Make.com fetches RSS feed
    2. Make.com sends article here
    3. We process with GPT for solutions journalism format
    4. We create article in Sanity as draft
    5. Return success with Sanity ID
    
    Use this URL in Make.com: {YOUR_DOMAIN}/api/make/process-article
    """
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        if not SANITY_API_TOKEN:
            raise HTTPException(status_code=500, detail="Sanity API token not configured")
        
        logger.info(f"Make.com webhook received article: {request.title[:50]}...")
        
        # Generate unique article ID
        article_id = str(uuid.uuid4())[:16]
        
        # Process with AI to rewrite in solutions journalism format
        system_message = """You are a solutions journalism editor for LATAM Reportero.
Your task is to transform news articles into our "solutions journalism" format that focuses on:
1. PROBLEM: What issue is being addressed?
2. SOLUTIONS: What approaches are being tried?
3. IMPACT: What results have been achieved?

Transform the article while:
- Maintaining factual accuracy
- Focusing on constructive angles
- Highlighting actionable solutions
- Writing in clear, engaging prose

Output as JSON with these fields:
{
  "title": "rewritten title focusing on solutions angle",
  "standfirst": "1-2 sentence summary (max 200 chars)",
  "body": "full article in HTML format with <p> tags",
  "problem": "problem section in HTML",
  "solutions": "solutions section in HTML", 
  "impact": "impact section in HTML",
  "category": "one of: politics, health, environment, economy, education, human-rights, technology, energy",
  "region": "one of: mexico, brazil, argentina, chile, colombia, peru, venezuela, latam, international"
}"""
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"make-{article_id}",
            system_message=system_message
        )
        chat.with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=f"""Transform this article:

Title: {request.title}
Source: {request.source_name}
Content: {request.content[:3000]}

Rewrite in solutions journalism format. Return ONLY valid JSON.""")
        
        response = await chat.send_message(user_message)
        
        # Parse AI response
        import json
        try:
            # Extract JSON from response
            json_start = response.find('{')
            json_end = response.rfind('}') + 1
            if json_start >= 0 and json_end > json_start:
                ai_result = json.loads(response[json_start:json_end])
            else:
                raise ValueError("No JSON found in response")
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Failed to parse AI response: {e}")
            # Use original content as fallback
            ai_result = {
                "title": request.title,
                "standfirst": request.content[:200] if request.content else "",
                "body": f"<p>{request.content}</p>" if request.content else "",
                "category": request.category or "general",
                "region": request.region or "latam"
            }
        
        # Generate slug
        slug_base = ai_result.get('title', request.title).lower()
        slug_base = ''.join(c if c.isalnum() or c == ' ' else '' for c in slug_base)
        slug = '-'.join(slug_base.split()[:10]) + f"-{request.language}"
        
        # Create article document for Sanity
        sanity_doc = {
            "_type": "article",
            "title": ai_result.get('title', request.title),
            "slug": {"_type": "slug", "current": slug},
            "standfirst": ai_result.get('standfirst', '')[:200],
            "body": ai_result.get('body', ''),
            "problem": ai_result.get('problem', ''),
            "solutions": ai_result.get('solutions', ''),
            "impact": ai_result.get('impact', ''),
            "language": request.language,
            "category": ai_result.get('category', request.category or 'general'),
            "region": ai_result.get('region', request.region or 'latam'),
            "sourceUrl": request.source_url,
            "sourceFeed": request.source_name,
            "externalId": article_id,
            "isAiGenerated": True,
            "status": "draft",
            "publishedAt": request.published_at or datetime.now(timezone.utc).isoformat(),
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        
        # Upload image to Sanity if provided
        if request.image_url:
            try:
                async with httpx.AsyncClient() as http_client:
                    # Download image
                    img_response = await http_client.get(request.image_url, timeout=30)
                    if img_response.status_code == 200:
                        # Upload to Sanity
                        upload_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/{SANITY_DATASET}"
                        content_type = img_response.headers.get('content-type', 'image/jpeg')
                        
                        upload_response = await http_client.post(
                            upload_url,
                            headers={
                                "Authorization": f"Bearer {SANITY_API_TOKEN}",
                                "Content-Type": content_type
                            },
                            content=img_response.content
                        )
                        
                        if upload_response.status_code == 200:
                            asset_data = upload_response.json()
                            asset_id = asset_data.get('document', {}).get('_id')
                            if asset_id:
                                sanity_doc["featuredImage"] = {
                                    "_type": "image",
                                    "asset": {"_type": "reference", "_ref": asset_id}
                                }
                                logger.info(f"Image uploaded to Sanity: {asset_id}")
            except Exception as img_error:
                logger.warning(f"Failed to upload image: {img_error}")
        
        # Create article in Sanity
        sanity_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"
        
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                sanity_url,
                headers={
                    "Authorization": f"Bearer {SANITY_API_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={"mutations": [{"create": sanity_doc}]}
            )
            
            if response.status_code != 200:
                logger.error(f"Sanity create error: {response.text}")
                raise HTTPException(status_code=500, detail="Failed to create article in Sanity")
            
            result = response.json()
            sanity_id = result.get('results', [{}])[0].get('id', '')
        
        logger.info(f"Article created in Sanity: {sanity_id} - {slug}")
        
        # Log to MongoDB for tracking
        await db.make_webhook_logs.insert_one({
            "id": article_id,
            "sanity_id": sanity_id,
            "source_url": request.source_url,
            "source_name": request.source_name,
            "title": ai_result.get('title', request.title),
            "slug": slug,
            "status": "created",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return MakeArticleResponse(
            success=True,
            article_id=article_id,
            sanity_id=sanity_id,
            title=ai_result.get('title', request.title),
            slug=slug,
            message="Article processed and created in Sanity as draft"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Make.com webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


class DirectDraftRequest(BaseModel):
    """Request for creating draft directly in Sanity (no AI processing)"""
    title: str
    content: str  # HTML body content
    standfirst: Optional[str] = None  # Summary/subtitle
    category: Optional[str] = "general"
    region: Optional[str] = "latam"
    language: Optional[str] = "en"
    author_name: Optional[str] = None
    author_slug: Optional[str] = None
    image_url: Optional[str] = None
    content_type: Optional[str] = "article"  # article, press-review, digest, link-roundup
    tags: Optional[List[str]] = None
    source_links: Optional[List[Dict[str, str]]] = None  # For link roundups: [{"title": "...", "url": "..."}]


@api_router.post("/make/create-draft-direct", response_model=MakeArticleResponse)
async def make_create_draft_direct(request: DirectDraftRequest):
    """
    Create a draft directly in Sanity WITHOUT AI processing.
    
    Use this for:
    - Press reviews (your own voice)
    - Link roundups
    - Daily digests
    - Guest contributor pieces
    - Any content that's already publication-ready
    
    Webhook URL: {YOUR_DOMAIN}/api/make/create-draft-direct
    """
    try:
        if not SANITY_API_TOKEN:
            raise HTTPException(status_code=500, detail="Sanity API token not configured")
        
        logger.info(f"Direct draft webhook received: {request.title[:50]}...")
        
        # Generate unique article ID
        article_id = str(uuid.uuid4())[:16]
        
        # Generate slug from title
        slug_base = request.title.lower()
        slug_base = ''.join(c if c.isalnum() or c == ' ' else '' for c in slug_base)
        slug = '-'.join(slug_base.split()[:10]) + f"-{request.language}"
        
        # Build body content - if source_links provided, append them
        body_content = request.content
        if request.source_links:
            links_html = "<h3>Sources & Links</h3><ul>"
            for link in request.source_links:
                links_html += f'<li><a href="{link.get("url", "#")}" target="_blank">{link.get("title", "Link")}</a></li>'
            links_html += "</ul>"
            body_content += links_html
        
        # Create article document for Sanity
        sanity_doc = {
            "_type": "article",
            "title": request.title,
            "slug": {"_type": "slug", "current": slug},
            "standfirst": (request.standfirst or "")[:200],
            "body": body_content,
            "language": request.language,
            "category": request.category or "general",
            "region": request.region or "latam",
            "contentType": request.content_type,
            "isAiGenerated": False,  # Human-written content
            "status": "draft",
            "publishedAt": datetime.now(timezone.utc).isoformat(),
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        
        # Add author if provided
        if request.author_name:
            sanity_doc["authorName"] = request.author_name
        if request.author_slug:
            sanity_doc["authorSlug"] = request.author_slug
            
        # Add tags if provided
        if request.tags:
            sanity_doc["tags"] = request.tags
        
        # Upload image to Sanity if provided
        if request.image_url:
            try:
                async with httpx.AsyncClient() as http_client:
                    img_response = await http_client.get(request.image_url, timeout=30)
                    if img_response.status_code == 200:
                        upload_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/{SANITY_DATASET}"
                        content_type = img_response.headers.get('content-type', 'image/jpeg')
                        
                        upload_response = await http_client.post(
                            upload_url,
                            headers={
                                "Authorization": f"Bearer {SANITY_API_TOKEN}",
                                "Content-Type": content_type
                            },
                            content=img_response.content
                        )
                        
                        if upload_response.status_code == 200:
                            asset_data = upload_response.json()
                            asset_id = asset_data.get('document', {}).get('_id')
                            if asset_id:
                                sanity_doc["featuredImage"] = {
                                    "_type": "image",
                                    "asset": {"_type": "reference", "_ref": asset_id}
                                }
                                logger.info(f"Image uploaded to Sanity: {asset_id}")
            except Exception as img_error:
                logger.warning(f"Failed to upload image: {img_error}")
        
        # Create article in Sanity
        sanity_url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/{SANITY_DATASET}"
        
        async with httpx.AsyncClient() as http_client:
            response = await http_client.post(
                sanity_url,
                headers={
                    "Authorization": f"Bearer {SANITY_API_TOKEN}",
                    "Content-Type": "application/json"
                },
                json={"mutations": [{"create": sanity_doc}]}
            )
            
            if response.status_code != 200:
                logger.error(f"Sanity create error: {response.text}")
                raise HTTPException(status_code=500, detail="Failed to create draft in Sanity")
            
            result = response.json()
            sanity_id = result.get('results', [{}])[0].get('id', '')
        
        logger.info(f"Direct draft created in Sanity: {sanity_id} - {slug}")
        
        # Log to MongoDB for tracking
        await db.make_webhook_logs.insert_one({
            "id": article_id,
            "sanity_id": sanity_id,
            "title": request.title,
            "slug": slug,
            "content_type": request.content_type,
            "is_ai_generated": False,
            "status": "created",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        return MakeArticleResponse(
            success=True,
            article_id=article_id,
            sanity_id=sanity_id,
            title=request.title,
            slug=slug,
            message=f"Draft created directly in Sanity (type: {request.content_type})"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Direct draft webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/make/status")
async def make_status():
    """Check Make.com integration status and recent activity"""
    try:
        # Get recent webhook logs
        recent_logs = await db.make_webhook_logs.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1).limit(10).to_list(10)
        
        return {
            "status": "active",
            "make_api_configured": bool(MAKE_API_KEY),
            "sanity_configured": bool(SANITY_API_TOKEN),
            "llm_configured": bool(EMERGENT_LLM_KEY),
            "recent_articles": len(recent_logs),
            "recent_logs": recent_logs,
            "webhooks": {
                "process_article": "/api/make/process-article (AI rewrite → Sanity)",
                "create_draft_direct": "/api/make/create-draft-direct (Direct → Sanity, no AI)"
            }
        }
    except Exception as e:
        logger.error(f"Make status error: {e}")
        return {"status": "error", "message": str(e)}

# Include the router in the main app
app.include_router(api_router)

# ============================================
# TTS (Text-to-Speech) ENDPOINT
# ============================================
# OpenAITextToSpeech defined at top of file
from fastapi.responses import Response
import base64

@app.post("/api/tts")
async def text_to_speech(request: Request):
    """Convert article text to speech audio (MP3)"""
    body = await request.json()
    text = body.get("text", "")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text is required")
    
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="TTS API key not configured")
    
    try:
        tts = OpenAITextToSpeech(api_key=EMERGENT_LLM_KEY)
        
        # TTS has a 4096 char limit — chunk and concatenate
        chunks = []
        remaining = text.strip()
        while remaining:
            chunk = remaining[:4000]
            # Try to break at sentence boundary
            if len(remaining) > 4000:
                last_period = chunk.rfind('.')
                last_newline = chunk.rfind('\n')
                break_at = max(last_period, last_newline)
                if break_at > 2000:
                    chunk = remaining[:break_at + 1]
            chunks.append(chunk.strip())
            remaining = remaining[len(chunk):].strip()
        
        audio_parts = []
        for chunk in chunks:
            audio_bytes = await tts.generate_speech(
                text=chunk,
                model="tts-1-hd",
                voice="nova",
                response_format="mp3",
                speed=1.0
            )
            audio_parts.append(audio_bytes)
        
        # Concatenate all audio parts
        full_audio = b"".join(audio_parts)
        audio_b64 = base64.b64encode(full_audio).decode("utf-8")
        
        return {"audio_base64": audio_b64, "format": "mp3"}
    
    except Exception as e:
        logger.error(f"TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()