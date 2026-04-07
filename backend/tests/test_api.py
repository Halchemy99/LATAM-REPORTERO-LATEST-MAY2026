"""
Backend API tests for LATAM Reportero
Tests: Health, Status, Payments (Stripe), and VoiceBot endpoints
"""
import pytest
import requests
import os

BASE_URL = "https://true-replica-1.preview.emergentagent.com"


class TestHealthEndpoints:
    """Health and status endpoint tests"""
    
    def test_root_endpoint(self):
        """Test root API endpoint returns Hello World"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Hello World"
        print("✓ Root endpoint working")
    
    def test_status_create(self):
        """Test creating a status check"""
        response = requests.post(
            f"{BASE_URL}/api/status",
            json={"client_name": "TEST_pytest_client"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["client_name"] == "TEST_pytest_client"
        assert "timestamp" in data
        print(f"✓ Status created with id: {data['id']}")
    
    def test_status_list(self):
        """Test listing status checks"""
        response = requests.get(f"{BASE_URL}/api/status")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Status list returned {len(data)} items")


class TestPaymentEndpoints:
    """Stripe payment integration tests"""
    
    def test_get_subscription_plans(self):
        """Test /api/payments/plans returns valid subscription plans"""
        response = requests.get(f"{BASE_URL}/api/payments/plans")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "plans" in data
        plans = data["plans"]
        assert len(plans) >= 2
        
        # Verify standard plan
        standard_plan = next((p for p in plans if p["id"] == "standard"), None)
        assert standard_plan is not None
        assert standard_plan["amount"] == 9.99
        assert standard_plan["currency"] == "usd"
        assert standard_plan["name"] == "Standard"
        assert "features" in standard_plan
        
        # Verify premium plan
        premium_plan = next((p for p in plans if p["id"] == "premium"), None)
        assert premium_plan is not None
        assert premium_plan["amount"] == 19.99
        assert premium_plan["currency"] == "usd"
        assert premium_plan["name"] == "Premium"
        
        print(f"✓ Subscription plans: {[p['name'] for p in plans]}")
    
    def test_create_checkout_session_standard(self):
        """Test creating Stripe checkout session for standard plan"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "standard",
                "origin_url": BASE_URL
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify checkout response structure
        assert "checkout_url" in data
        assert "session_id" in data
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        assert data["session_id"].startswith("cs_test")
        
        print(f"✓ Standard checkout created: {data['session_id'][:30]}...")
        return data["session_id"]
    
    def test_create_checkout_session_premium(self):
        """Test creating Stripe checkout session for premium plan"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "premium",
                "origin_url": BASE_URL
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "checkout_url" in data
        assert "session_id" in data
        assert data["checkout_url"].startswith("https://checkout.stripe.com")
        
        print(f"✓ Premium checkout created: {data['session_id'][:30]}...")
    
    def test_checkout_invalid_plan(self):
        """Test checkout with invalid plan returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "invalid_plan",
                "origin_url": BASE_URL
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "Invalid plan" in data.get("detail", "")
        print("✓ Invalid plan correctly rejected with 400")
    
    def test_get_payment_status(self):
        """Test getting payment status for a checkout session"""
        # First create a session
        create_response = requests.post(
            f"{BASE_URL}/api/payments/checkout",
            json={
                "plan_id": "standard",
                "origin_url": BASE_URL
            }
        )
        assert create_response.status_code == 200
        session_id = create_response.json()["session_id"]
        
        # Get status
        status_response = requests.get(f"{BASE_URL}/api/payments/status/{session_id}")
        assert status_response.status_code == 200
        data = status_response.json()
        
        # Verify status response structure
        assert data["session_id"] == session_id
        assert "status" in data
        assert "payment_status" in data
        assert "amount" in data
        assert "currency" in data
        
        print(f"✓ Payment status: {data['payment_status']}, amount: ${data['amount']}")


class TestVoiceBotEndpoint:
    """VoiceBot chat endpoint tests"""
    
    def test_voicebot_chat_basic(self):
        """Test basic voicebot chat without article context"""
        response = requests.post(
            f"{BASE_URL}/api/voicebot/chat",
            json={
                "message": "What is LATAM Reportero about?",
                "article": None,
                "history": []
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "response" in data
        assert "session_id" in data
        assert len(data["response"]) > 0
        
        print(f"✓ VoiceBot response received ({len(data['response'])} chars)")
    
    def test_voicebot_chat_with_article_context(self):
        """Test voicebot chat with article context"""
        response = requests.post(
            f"{BASE_URL}/api/voicebot/chat",
            json={
                "message": "What is this article about?",
                "article": {
                    "title": "Climate Action in Brazil",
                    "excerpt": "New initiatives for sustainable farming",
                    "category": "Environment",
                    "region": "Brazil"
                },
                "history": []
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "response" in data
        assert len(data["response"]) > 0
        
        print(f"✓ VoiceBot with context response ({len(data['response'])} chars)")


class TestAdminEndpoints:
    """Admin endpoint tests (requires proper auth in production)"""
    
    def test_admin_password_change_missing_supabase(self):
        """Test admin password change endpoint exists"""
        # This should return 400 for invalid user or 500 if Supabase not configured
        response = requests.post(
            f"{BASE_URL}/api/admin/users/password",
            json={
                "userId": "invalid-user-id",
                "newPassword": "testpassword123"
            }
        )
        # Either 400 (invalid user), 500 (config error), or 200 (success)
        # We just want to verify the endpoint exists and handles requests
        assert response.status_code in [200, 400, 500]
        print(f"✓ Admin password endpoint responded with {response.status_code}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
