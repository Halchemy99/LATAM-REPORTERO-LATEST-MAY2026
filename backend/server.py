from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
from supabase import create_client, Client


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# LLM API key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Supabase configuration
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


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
    """Admin endpoint to change a user's password using Supabase Admin API"""
    try:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            logger.error("Supabase credentials not configured")
            raise HTTPException(status_code=500, detail="Supabase admin not configured")
        
        if len(request.newPassword) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Create Supabase admin client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        
        # Update user password using admin API
        response = supabase.auth.admin.update_user_by_id(
            request.userId,
            {"password": request.newPassword}
        )
        
        if response.user:
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
async def ai_search(request: AISearchRequest):
    """AI-powered article search with conversational follow-ups"""
    try:
        if not EMERGENT_LLM_KEY:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(status_code=500, detail="Supabase not configured")
        
        # Create Supabase client to fetch articles
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        
        # Fetch all published articles from CMS
        articles_response = supabase.table('cms_articles').select(
            'id, title_en, title_es, title_pt, slug, standfirst_en, standfirst_es, standfirst_pt, '
            'featured_image, region, read_time, published_at, is_featured, '
            'category:categories(name_en, slug), author:authors(name)'
        ).eq('status', 'published').execute()
        
        articles = articles_response.data or []
        
        # Build article summaries for the LLM
        article_summaries = []
        for i, art in enumerate(articles):
            summary = f"""
Article {i+1}:
- Title: {art.get('title_en', 'Untitled')}
- Summary: {art.get('standfirst_en', 'No summary')}
- Category: {art.get('category', {}).get('name_en', 'General') if art.get('category') else 'General'}
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
            except:
                pass
        
        # Clean the response (remove the JSON part for display)
        clean_response = response.split("MATCHED_ARTICLES:")[0].strip()
        
        # Get full article data for matched slugs
        matched_articles = []
        for art in articles:
            if art.get('slug') in matched_slugs:
                matched_articles.append({
                    'id': art.get('id'),
                    'title': art.get('title_en'),
                    'excerpt': art.get('standfirst_en'),
                    'slug': art.get('slug'),
                    'image': art.get('featured_image'),
                    'category': art.get('category', {}).get('name_en') if art.get('category') else 'General',
                    'region': art.get('region'),
                    'read_time': art.get('read_time'),
                    'author': art.get('author', {}).get('name') if art.get('author') else 'Staff Writer'
                })
        
        # If no matches found via JSON, try to find articles mentioned in text
        if not matched_articles:
            response_lower = clean_response.lower()
            for art in articles:
                title = art.get('title_en', '').lower()
                # Check if significant part of title is mentioned
                title_words = [w for w in title.split() if len(w) > 4]
                matches = sum(1 for w in title_words if w in response_lower)
                if matches >= 2 or art.get('slug', '') in response_lower:
                    matched_articles.append({
                        'id': art.get('id'),
                        'title': art.get('title_en'),
                        'excerpt': art.get('standfirst_en'),
                        'slug': art.get('slug'),
                        'image': art.get('featured_image'),
                        'category': art.get('category', {}).get('name_en') if art.get('category') else 'General',
                        'region': art.get('region'),
                        'read_time': art.get('read_time'),
                        'author': art.get('author', {}).get('name') if art.get('author') else 'Staff Writer'
                    })
        
        # Generate follow-up suggestions
        follow_ups = [
            "Show me more articles about this topic",
            "What other regions have similar stories?",
            "Find articles about different solutions"
        ]
        
        # Store search in MongoDB for analytics
        search_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "query": request.query,
            "matched_count": len(matched_articles),
            "matched_slugs": [a.get('slug') for a in matched_articles],
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

# Include the router in the main app
app.include_router(api_router)

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