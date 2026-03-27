#!/usr/bin/env python3
"""
LATAM Reportero API Backend Test Suite
Tests VoiceBot and Core API endpoints according to the review request requirements.
"""

import requests
import json
import sys
import time
from datetime import datetime

# Base URL from environment - Use the correct URL from frontend .env
BASE_URL = "https://latam-reportero-2.preview.emergentagent.com"

def print_test_result(test_name, success, message=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if message:
        print(f"    {message}")

def test_api_root():
    """Test GET /api/ - Should return Hello World message"""
    try:
        response = requests.get(f"{BASE_URL}/api/", timeout=10)
        
        if response.status_code != 200:
            print_test_result("GET /api/", False, f"Expected status 200, got {response.status_code}")
            return False
            
        data = response.json()
        
        # Check for message field
        if 'message' not in data:
            print_test_result("GET /api/", False, f"Missing 'message' field. Got: {data}")
            return False
            
        print_test_result("GET /api/", True, f"Message: {data['message']}")
        return True
        
    except Exception as e:
        print_test_result("GET /api/", False, f"Exception: {str(e)}")
        return False

def test_voicebot_chat():
    """Test POST /api/voicebot/chat - Main feature to test"""
    try:
        # Test payload with article context
        payload = {
            "message": "What is this article about?",
            "article": {
                "title": "Test Article Title",
                "excerpt": "Test article excerpt about environmental issues",
                "problem": "Environmental pollution is affecting local communities",
                "solutions": "Implementing green technologies and community awareness",
                "impact": "Reduced pollution and improved health outcomes",
                "category": "environment",
                "region": "colombia"
            },
            "history": []
        }
        
        response = requests.post(
            f"{BASE_URL}/api/voicebot/chat", 
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30  # Increased timeout for AI response
        )
        
        if response.status_code != 200:
            error_text = ""
            try:
                error_data = response.json()
                error_text = f" - {error_data.get('detail', '')}"
            except:
                error_text = f" - {response.text[:200]}"
            print_test_result("POST /api/voicebot/chat", False, f"Expected status 200, got {response.status_code}{error_text}")
            return False
            
        data = response.json()
        
        # Check for required response fields
        if 'response' not in data:
            print_test_result("POST /api/voicebot/chat", False, f"Missing 'response' field. Got: {data}")
            return False
            
        # Validate response is not empty and seems like AI response
        ai_response = data['response']
        if not ai_response or len(ai_response.strip()) < 10:
            print_test_result("POST /api/voicebot/chat", False, f"AI response too short or empty: '{ai_response}'")
            return False
            
        print_test_result("POST /api/voicebot/chat", True, f"AI Response received ({len(ai_response)} chars)")
        print(f"    Sample: {ai_response[:100]}...")
        return True
        
    except Exception as e:
        print_test_result("POST /api/voicebot/chat", False, f"Exception: {str(e)}")
        return False

def test_voicebot_chat_no_article():
    """Test POST /api/voicebot/chat without article context"""
    try:
        payload = {
            "message": "Hello, can you help me?",
            "history": []
        }
        
        response = requests.post(
            f"{BASE_URL}/api/voicebot/chat", 
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        if response.status_code != 200:
            print_test_result("POST /api/voicebot/chat (no article)", False, f"Expected status 200, got {response.status_code}")
            return False
            
        data = response.json()
        
        if 'response' not in data:
            print_test_result("POST /api/voicebot/chat (no article)", False, f"Missing 'response' field. Got: {data}")
            return False
            
        print_test_result("POST /api/voicebot/chat (no article)", True, f"Response: {data['response'][:50]}...")
        return True
        
    except Exception as e:
        print_test_result("POST /api/voicebot/chat (no article)", False, f"Exception: {str(e)}")
        return False

def test_voicebot_chat_error_cases():
    """Test POST /api/voicebot/chat error handling"""
    try:
        # Test without message (should fail)
        payload = {
            "article": {"title": "Test"}
        }
        
        response = requests.post(
            f"{BASE_URL}/api/voicebot/chat", 
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code == 200:
            print_test_result("POST /api/voicebot/chat (no message)", False, "Should have failed without message")
            return False
            
        print_test_result("POST /api/voicebot/chat (no message)", True, f"Correctly rejected with status {response.status_code}")
        return True
        
    except Exception as e:
        print_test_result("POST /api/voicebot/chat (no message)", False, f"Exception: {str(e)}")
        return False

def test_status_endpoint():
    """Test GET /api/status - Should return status checks"""
    try:
        response = requests.get(f"{BASE_URL}/api/status", timeout=10)
        
        if response.status_code != 200:
            print_test_result("GET /api/status", False, f"Expected status 200, got {response.status_code}")
            return False
            
        data = response.json()
        
        if not isinstance(data, list):
            print_test_result("GET /api/status", False, f"Expected array, got {type(data)}")
            return False
            
        print_test_result("GET /api/status", True, f"Got {len(data)} status checks")
        return True
        
    except Exception as e:
        print_test_result("GET /api/status", False, f"Exception: {str(e)}")
        return False

def test_create_status():
    """Test POST /api/status - Should create status check"""
    try:
        payload = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/status",
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=10
        )
        
        if response.status_code != 200:
            print_test_result("POST /api/status", False, f"Expected status 200, got {response.status_code}")
            return False
            
        data = response.json()
        
        # Check required fields
        required_fields = ['id', 'client_name', 'timestamp']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            print_test_result("POST /api/status", False, f"Missing fields: {missing_fields}")
            return False
            
        print_test_result("POST /api/status", True, f"Created status check: {data['client_name']}")
        return True
        
    except Exception as e:
        print_test_result("POST /api/status", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests and report results"""
    print("=" * 60)
    print("LATAM Reportero VoiceBot & Core API Test Suite")
    print("=" * 60)
    print(f"Testing against: {BASE_URL}")
    print(f"Test started at: {datetime.now().isoformat()}")
    print()
    
    # Run all tests
    tests = [
        test_api_root,
        test_voicebot_chat,
        test_voicebot_chat_no_article,
        test_voicebot_chat_error_cases,
        test_status_endpoint,
        test_create_status,
    ]
    
    passed = 0
    failed = 0
    
    for test_func in tests:
        try:
            result = test_func()
            if result:
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print_test_result(test_func.__name__, False, f"Unexpected error: {str(e)}")
            failed += 1
        print()  # Empty line between tests
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Total: {passed + failed}")
    print(f"Success Rate: {(passed / (passed + failed) * 100):.1f}%" if (passed + failed) > 0 else "0.0%")
    print()
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)