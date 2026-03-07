from fastapi import FastAPI, APIRouter, HTTPException
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


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# LLM API key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

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