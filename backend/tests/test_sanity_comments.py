"""
Backend API tests for LATAM Reportero - Sanity CMS Proxy and Comments
Tests: Sanity articles proxy, Comments CRUD with role-based access
"""
import pytest
import requests
import os
import uuid

BASE_URL = "https://true-replica-1.preview.emergentagent.com"


class TestSanityProxyEndpoints:
    """Sanity CMS proxy endpoint tests - avoids CORS issues"""
    
    def test_get_articles_by_language(self):
        """Test /api/sanity/articles returns articles for specified language"""
        response = requests.get(f"{BASE_URL}/api/sanity/articles?language=en&limit=5")
        assert response.status_code == 200
        data = response.json()
        
        # Verify structure
        assert "articles" in data
        articles = data["articles"]
        assert isinstance(articles, list)
        
        if len(articles) > 0:
            article = articles[0]
            # Verify article structure
            assert "_id" in article
            assert "title" in article
            assert "slug" in article
            assert "language" in article
            print(f"✓ Sanity articles endpoint returned {len(articles)} articles")
            print(f"  First article: {article['title'][:50]}...")
        else:
            print("✓ Sanity articles endpoint returned empty list (no published articles)")
    
    def test_get_all_articles(self):
        """Test /api/sanity/articles/all returns all published articles"""
        response = requests.get(f"{BASE_URL}/api/sanity/articles/all?limit=10")
        assert response.status_code == 200
        data = response.json()
        
        assert "articles" in data
        articles = data["articles"]
        assert isinstance(articles, list)
        print(f"✓ Sanity all articles endpoint returned {len(articles)} articles")
    
    def test_get_single_article_by_slug(self):
        """Test /api/sanity/article/{slug} returns single article with body content"""
        # First get an article slug from the list
        list_response = requests.get(f"{BASE_URL}/api/sanity/articles?language=en&limit=1")
        assert list_response.status_code == 200
        articles = list_response.json().get("articles", [])
        
        if len(articles) == 0:
            pytest.skip("No articles available to test single article endpoint")
        
        slug = articles[0]["slug"]
        
        # Fetch single article
        response = requests.get(f"{BASE_URL}/api/sanity/article/{slug}")
        assert response.status_code == 200
        data = response.json()
        
        assert "article" in data
        article = data["article"]
        
        # Verify article has body content (Portable Text)
        assert "title" in article
        assert "slug" in article
        assert "body" in article
        
        # Body should be an array (Portable Text format)
        if article["body"]:
            assert isinstance(article["body"], list)
            print(f"✓ Single article has {len(article['body'])} body blocks")
        
        print(f"✓ Single article endpoint returned: {article['title'][:50]}...")
    
    def test_get_nonexistent_article(self):
        """Test /api/sanity/article/{slug} returns null for nonexistent slug"""
        response = requests.get(f"{BASE_URL}/api/sanity/article/nonexistent-article-slug-12345")
        assert response.status_code == 200
        data = response.json()
        
        # Should return null/None for article
        assert data.get("article") is None
        print("✓ Nonexistent article correctly returns null")


class TestCommentsEndpoints:
    """Comments API tests with role-based access control"""
    
    @pytest.fixture
    def test_article_slug(self):
        """Generate unique test article slug"""
        return f"TEST_article_{uuid.uuid4().hex[:8]}"
    
    def test_get_comments_empty(self, test_article_slug):
        """Test GET /api/comments/{slug} returns empty array for new article"""
        response = requests.get(f"{BASE_URL}/api/comments/{test_article_slug}")
        assert response.status_code == 200
        data = response.json()
        
        assert "comments" in data
        assert isinstance(data["comments"], list)
        assert len(data["comments"]) == 0
        print("✓ GET comments returns empty array for new article")
    
    def test_create_comment_paid_role(self, test_article_slug):
        """Test POST /api/comments with paid role succeeds"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "demo@latamreportero.com",
                "user_name": "Demo Paid User",
                "content": "This is a test comment from a paid user",
                "user_role": "paid"
            }
        )
        assert response.status_code == 200
        data = response.json()
        
        assert "comment" in data
        comment = data["comment"]
        assert comment["article_slug"] == test_article_slug
        assert comment["user_email"] == "demo@latamreportero.com"
        assert comment["content"] == "This is a test comment from a paid user"
        assert comment["user_role"] == "paid"
        assert "id" in comment
        assert "created_at" in comment
        
        print(f"✓ Paid user comment created with id: {comment['id']}")
        return comment["id"]
    
    def test_create_comment_subscriber_role(self, test_article_slug):
        """Test POST /api/comments with subscriber role succeeds"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "subscriber@test.com",
                "user_name": "Test Subscriber",
                "content": "Comment from subscriber",
                "user_role": "subscriber"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "comment" in data
        print("✓ Subscriber role can create comments")
    
    def test_create_comment_contributor_role(self, test_article_slug):
        """Test POST /api/comments with contributor role succeeds"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "contributor@test.com",
                "user_name": "Test Contributor",
                "content": "Comment from contributor",
                "user_role": "contributor"
            }
        )
        assert response.status_code == 200
        print("✓ Contributor role can create comments")
    
    def test_create_comment_editor_role(self, test_article_slug):
        """Test POST /api/comments with editor role succeeds"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "editor@test.com",
                "user_name": "Test Editor",
                "content": "Comment from editor",
                "user_role": "editor"
            }
        )
        assert response.status_code == 200
        print("✓ Editor role can create comments")
    
    def test_create_comment_admin_role(self, test_article_slug):
        """Test POST /api/comments with admin role succeeds"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "admin@test.com",
                "user_name": "Test Admin",
                "content": "Comment from admin",
                "user_role": "admin"
            }
        )
        assert response.status_code == 200
        print("✓ Admin role can create comments")
    
    def test_create_comment_free_role_rejected(self, test_article_slug):
        """Test POST /api/comments with free role returns 403"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "free@latamreportero.com",
                "user_name": "Free User",
                "content": "This comment should be rejected",
                "user_role": "free"
            }
        )
        assert response.status_code == 403
        data = response.json()
        assert "Only subscribers can leave comments" in data.get("detail", "")
        print("✓ Free role correctly rejected with 403")
    
    def test_create_comment_guest_role_rejected(self, test_article_slug):
        """Test POST /api/comments with guest role returns 403"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "guest@test.com",
                "user_name": "Guest User",
                "content": "Guest comment should be rejected",
                "user_role": "guest"
            }
        )
        assert response.status_code == 403
        print("✓ Guest role correctly rejected with 403")
    
    def test_create_comment_empty_content_rejected(self, test_article_slug):
        """Test POST /api/comments with empty content returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "demo@latamreportero.com",
                "user_name": "Demo User",
                "content": "",
                "user_role": "paid"
            }
        )
        assert response.status_code == 400
        data = response.json()
        assert "Comment cannot be empty" in data.get("detail", "")
        print("✓ Empty content correctly rejected with 400")
    
    def test_create_comment_whitespace_only_rejected(self, test_article_slug):
        """Test POST /api/comments with whitespace-only content returns 400"""
        response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": test_article_slug,
                "user_email": "demo@latamreportero.com",
                "user_name": "Demo User",
                "content": "   \n\t  ",
                "user_role": "paid"
            }
        )
        assert response.status_code == 400
        print("✓ Whitespace-only content correctly rejected with 400")
    
    def test_get_comments_after_creation(self):
        """Test GET /api/comments/{slug} returns created comments"""
        # Create a unique slug for this test
        slug = f"TEST_verify_comments_{uuid.uuid4().hex[:8]}"
        
        # Create a comment
        create_response = requests.post(
            f"{BASE_URL}/api/comments",
            json={
                "article_slug": slug,
                "user_email": "verify@test.com",
                "user_name": "Verify User",
                "content": "Comment to verify persistence",
                "user_role": "paid"
            }
        )
        assert create_response.status_code == 200
        created_comment = create_response.json()["comment"]
        
        # Fetch comments
        get_response = requests.get(f"{BASE_URL}/api/comments/{slug}")
        assert get_response.status_code == 200
        data = get_response.json()
        
        assert "comments" in data
        comments = data["comments"]
        assert len(comments) >= 1
        
        # Verify the created comment is in the list
        found = any(c["id"] == created_comment["id"] for c in comments)
        assert found, "Created comment not found in GET response"
        
        print(f"✓ GET comments returns {len(comments)} comment(s) including created one")


class TestHealthEndpoints:
    """Health and status endpoint tests"""
    
    def test_root_endpoint(self):
        """Test root API endpoint returns Hello World"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Hello World"
        print("✓ Root endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
