"""
Seed script to create initial users for LATAM Reportero
Run with: python seed_users.py
"""
import asyncio
import os
import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

# Load environment
from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).parent / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

SEED_USERS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Admin User",
        "email": "oket.hoxha@gmail.com",
        "password": "emergent2030",
        "role": "admin"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Demo Subscriber",
        "email": "demo@latamreportero.com",
        "password": "demo123",
        "role": "paid"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Free User",
        "email": "free@latamreportero.com",
        "password": "free123",
        "role": "free"
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Editor User",
        "email": "editor@latamreportero.com",
        "password": "editor123",
        "role": "editor"
    },
]

async def seed_users():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    print(f"Connected to MongoDB: {MONGO_URL}")
    print(f"Database: {DB_NAME}")
    print("-" * 50)
    
    for user_data in SEED_USERS:
        # Check if user exists
        existing = await db.users.find_one({"email": user_data["email"].lower()})
        
        if existing:
            print(f"⏭️  User already exists: {user_data['email']} (role: {existing.get('role')})")
            continue
        
        # Create user document
        user_doc = {
            "id": user_data["id"],
            "name": user_data["name"],
            "email": user_data["email"].lower(),
            "password_hash": hash_password(user_data["password"]),
            "role": user_data["role"],
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.users.insert_one(user_doc)
        print(f"✅ Created user: {user_data['email']} | role: {user_data['role']} | password: {user_data['password']}")
    
    print("-" * 50)
    
    # Show all users
    all_users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(100)
    print(f"\nTotal users in database: {len(all_users)}")
    for u in all_users:
        print(f"  • {u['email']} | {u['role']}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
