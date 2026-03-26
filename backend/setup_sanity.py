"""
Sanity Schema Setup Script

This script creates the necessary schema in Sanity for the LATAM Reportero CMS.
Run once to set up the content structure.
"""

import os
import httpx
import json
from datetime import datetime

# Sanity configuration
PROJECT_ID = os.environ.get("SANITY_PROJECT_ID", "s5taeh5v")
DATASET = os.environ.get("SANITY_DATASET", "production")
TOKEN = os.environ.get("SANITY_API_TOKEN", "sk3uAraMFTXwRiA6MsfqJIYBDT5iZc9FUJ6IAaJhiPOvbcyIjrH5mbQY9EBckfYbmARDl1wSebKlixUSnX2LMF2lblU2VqfjwEeXcyYr5UDGB2ix5Xn44mi0Lz3M1WZNCdT2g2qUOIGuBKtC0RprVuTUxeQSHYKPyeessdv8OoqPeh1swKff")
API_VERSION = "2025-03-01"

BASE_URL = f"https://{PROJECT_ID}.api.sanity.io/v{API_VERSION}/data"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def create_document(doc):
    """Create a document in Sanity"""
    url = f"{BASE_URL}/mutate/{DATASET}"
    mutations = {"mutations": [{"createOrReplace": doc}]}
    
    response = httpx.post(url, headers=HEADERS, json=mutations, timeout=30.0)
    response.raise_for_status()
    return response.json()

def create_initial_categories():
    """Create initial categories for articles"""
    categories = [
        {"_id": "category-environment", "title": "Environment", "slug": {"_type": "slug", "current": "environment"}, "color": "#22c55e"},
        {"_id": "category-economy", "title": "Economy", "slug": {"_type": "slug", "current": "economy"}, "color": "#3b82f6"},
        {"_id": "category-health", "title": "Health", "slug": {"_type": "slug", "current": "health"}, "color": "#ef4444"},
        {"_id": "category-education", "title": "Education", "slug": {"_type": "slug", "current": "education"}, "color": "#f59e0b"},
        {"_id": "category-politics", "title": "Politics", "slug": {"_type": "slug", "current": "politics"}, "color": "#8b5cf6"},
        {"_id": "category-technology", "title": "Technology", "slug": {"_type": "slug", "current": "technology"}, "color": "#06b6d4"},
        {"_id": "category-human-rights", "title": "Human Rights", "slug": {"_type": "slug", "current": "human-rights"}, "color": "#ec4899"},
        {"_id": "category-infrastructure", "title": "Infrastructure", "slug": {"_type": "slug", "current": "infrastructure"}, "color": "#64748b"},
        {"_id": "category-agriculture", "title": "Agriculture", "slug": {"_type": "slug", "current": "agriculture"}, "color": "#84cc16"},
        {"_id": "category-energy", "title": "Energy", "slug": {"_type": "slug", "current": "energy"}, "color": "#eab308"},
    ]
    
    print("Creating categories...")
    for cat in categories:
        cat["_type"] = "category"
        try:
            result = create_document(cat)
            print(f"  ✓ Created category: {cat['title']}")
        except Exception as e:
            print(f"  ✗ Error creating {cat['title']}: {e}")

def create_test_article():
    """Create a test article to verify the schema works"""
    article = {
        "_id": "article-test-sanity-setup",
        "_type": "article",
        "title": "Sanity CMS Integration Test",
        "slug": {"_type": "slug", "current": "sanity-cms-test"},
        "language": "en",
        "standfirst": "This is a test article to verify the Sanity CMS integration is working correctly.",
        "body": [
            {
                "_type": "block",
                "_key": "block1",
                "style": "normal",
                "children": [{"_type": "span", "text": "This article was created automatically to test the Sanity integration."}]
            },
            {
                "_type": "block",
                "_key": "block2",
                "style": "h2",
                "children": [{"_type": "span", "text": "The Problem"}]
            },
            {
                "_type": "block",
                "_key": "block3",
                "style": "normal",
                "children": [{"_type": "span", "text": "Testing CMS integrations can be challenging, especially when working with headless architectures."}]
            }
        ],
        "category": "technology",
        "region": "latam",
        "isAiGenerated": True,
        "status": "draft",
        "publishedAt": datetime.now().isoformat(),
        "createdAt": datetime.now().isoformat()
    }
    
    print("\nCreating test article...")
    try:
        result = create_document(article)
        print(f"  ✓ Created test article: {article['title']}")
        return True
    except Exception as e:
        print(f"  ✗ Error creating test article: {e}")
        return False

def verify_connection():
    """Verify we can connect to Sanity"""
    print(f"Verifying Sanity connection...")
    print(f"  Project ID: {PROJECT_ID}")
    print(f"  Dataset: {DATASET}")
    
    query_url = f"{BASE_URL}/query/{DATASET}?query=*[_type == 'article'][0...1]"
    
    try:
        response = httpx.get(query_url, headers=HEADERS, timeout=10.0)
        response.raise_for_status()
        print("  ✓ Connection successful!")
        return True
    except Exception as e:
        print(f"  ✗ Connection failed: {e}")
        return False

def main():
    print("=" * 50)
    print("LATAM Reportero - Sanity CMS Setup")
    print("=" * 50)
    print()
    
    if not verify_connection():
        print("\n⚠️  Cannot connect to Sanity. Check your credentials.")
        return False
    
    create_initial_categories()
    create_test_article()
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)
    print("\nYou can now:")
    print("1. Access Sanity Studio at: https://www.sanity.io/manage")
    print(f"2. Select project: {PROJECT_ID}")
    print("3. View your content in the Studio")
    print("\nNote: Schema types are defined implicitly by the documents created.")
    print("Sanity's schema-less approach means types are inferred from document structure.")
    
    return True

if __name__ == "__main__":
    main()
