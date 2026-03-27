"""
Test suite for JWT Authentication System (MongoDB + JWT)
Tests: signup, login, /api/auth/me endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://latam-reportero-2.preview.emergentagent.com').rstrip('/')


class TestAuthSignup:
    """Test POST /api/auth/signup endpoint"""
    
    def test_signup_success(self):
        """New user signup should return token and user data"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "name": "Test User",
            "email": unique_email,
            "password": "testpass123"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "token" in data, "Response should contain token"
        assert "user" in data, "Response should contain user"
        assert isinstance(data["token"], str), "Token should be a string"
        assert len(data["token"]) > 0, "Token should not be empty"
        
        # Verify user data
        user = data["user"]
        assert user["email"] == unique_email.lower(), "Email should match (lowercased)"
        assert user["name"] == "Test User", "Name should match"
        assert user["role"] == "free", "New users should have 'free' role"
        assert "id" in user, "User should have an id"
    
    def test_signup_duplicate_email(self):
        """Signup with existing email should return 400"""
        # Use admin email which is already registered
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "name": "Duplicate User",
            "email": "oket.hoxha@gmail.com",
            "password": "testpass123"
        })
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        data = response.json()
        assert "detail" in data, "Error response should have detail"
        assert "already registered" in data["detail"].lower(), "Error should mention email already registered"


class TestAuthLogin:
    """Test POST /api/auth/login endpoint"""
    
    def test_login_success_admin(self):
        """Login with valid admin credentials should return token and user"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "oket.hoxha@gmail.com",
            "password": "emergent2030"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "token" in data, "Response should contain token"
        assert "user" in data, "Response should contain user"
        assert isinstance(data["token"], str), "Token should be a string"
        assert len(data["token"]) > 0, "Token should not be empty"
        
        # Verify user data
        user = data["user"]
        assert user["email"] == "oket.hoxha@gmail.com", "Email should match"
        assert user["role"] == "admin", "Admin user should have 'admin' role"
        assert "name" in user, "User should have name"
        assert "id" in user, "User should have id"
    
    def test_login_wrong_password(self):
        """Login with wrong password should return 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "oket.hoxha@gmail.com",
            "password": "wrongpassword"
        })
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "detail" in data, "Error response should have detail"
        assert "invalid" in data["detail"].lower(), "Error should mention invalid credentials"
    
    def test_login_nonexistent_user(self):
        """Login with non-existent email should return 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "anypassword"
        })
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestAuthMe:
    """Test GET /api/auth/me endpoint"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token for authenticated tests"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "oket.hoxha@gmail.com",
            "password": "emergent2030"
        })
        if response.status_code == 200:
            return response.json()["token"]
        pytest.skip("Could not get admin token")
    
    def test_me_with_valid_token(self, admin_token):
        """GET /api/auth/me with valid token should return user data"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {admin_token}"
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "user" in data, "Response should contain user"
        user = data["user"]
        assert user["email"] == "oket.hoxha@gmail.com", "Email should match"
        assert user["role"] == "admin", "Role should be admin"
        assert "password_hash" not in user, "Password hash should not be exposed"
    
    def test_me_without_token(self):
        """GET /api/auth/me without token should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        data = response.json()
        assert "detail" in data, "Error response should have detail"
    
    def test_me_with_invalid_token(self):
        """GET /api/auth/me with invalid token should return 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": "Bearer invalid_token_here"
        })
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestCommentsWithAuth:
    """Test comments endpoint with authenticated users"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "oket.hoxha@gmail.com",
            "password": "emergent2030"
        })
        if response.status_code == 200:
            return response.json()
        pytest.skip("Could not get admin token")
    
    def test_admin_can_post_comment(self, admin_token):
        """Admin role should be able to post comments"""
        user = admin_token["user"]
        response = requests.post(f"{BASE_URL}/api/comments", json={
            "article_slug": "test-article-auth",
            "user_email": user["email"],
            "user_name": user["name"],
            "content": "Test comment from admin",
            "user_role": user["role"]
        })
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "comment" in data, "Response should contain comment"
        assert data["comment"]["content"] == "Test comment from admin"
    
    def test_free_user_cannot_post_comment(self):
        """Free role should NOT be able to post comments"""
        response = requests.post(f"{BASE_URL}/api/comments", json={
            "article_slug": "test-article-auth",
            "user_email": "free@example.com",
            "user_name": "Free User",
            "content": "Test comment from free user",
            "user_role": "free"
        })
        
        assert response.status_code == 403, f"Expected 403, got {response.status_code}"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
