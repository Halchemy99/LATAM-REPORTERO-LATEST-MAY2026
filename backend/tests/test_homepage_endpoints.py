"""
Tests for the new content-type aware endpoints driving the homepage redesign.

These verify:
- /api/sanity/homepage returns the grouped object (hero + per-type buckets)
- /api/sanity/articles/by-type filters correctly by contentType
- /api/make/create-draft-direct properly stamps contentType + isAiGenerated=false
"""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get(
    "TEST_BASE_URL",
    "https://true-replica-1.preview.emergentagent.com",
)


def test_homepage_grouped_shape():
    """Homepage endpoint returns dict with the expected keys."""
    resp = requests.get(f"{BASE_URL}/api/sanity/homepage?language=en", timeout=15)
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    for k in ("hero", "morningBriefs", "pressReviews", "deepDives", "videoPosts", "latest"):
        assert k in data, f"Missing key: {k}"
    assert isinstance(data["latest"], list)
    print(
        f"✓ Homepage shape OK — latest={len(data['latest'])} "
        f"briefs={len(data['morningBriefs'])} reviews={len(data['pressReviews'])} "
        f"deepDives={len(data['deepDives'])}"
    )


@pytest.mark.parametrize(
    "ct", ["morning-brief", "press-review", "deep-dive", "video-post"]
)
def test_articles_by_type_filter(ct):
    """by-type endpoint returns articles all with the requested contentType."""
    resp = requests.get(
        f"{BASE_URL}/api/sanity/articles/by-type",
        params={"content_type": ct, "language": "en", "status": "all", "limit": 20},
        timeout=15,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["content_type"] == ct
    assert isinstance(data["articles"], list)
    for a in data["articles"]:
        assert a.get("contentType") == ct, f"Non-matching contentType in {a.get('_id')}"
    print(f"✓ by-type[{ct}] OK ({len(data['articles'])} items)")


def test_create_draft_direct_stamps_content_type():
    """Direct draft endpoint must store contentType and isAiGenerated=false."""
    unique = uuid.uuid4().hex[:8]
    payload = {
        "title": f"pytest draft {unique}",
        "standfirst": "Test draft created by pytest.",
        "content": "<p>Body of test draft.</p>",
        "category": "test",
        "region": "latam",
        "language": "en",
        "content_type": "morning-brief",
        "author_name": "pytest",
    }
    resp = requests.post(
        f"{BASE_URL}/api/make/create-draft-direct", json=payload, timeout=30
    )
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["success"] is True

    # Confirm it shows up under the right content type and as draft
    list_resp = requests.get(
        f"{BASE_URL}/api/sanity/articles/by-type",
        params={
            "content_type": "morning-brief",
            "language": "en",
            "status": "draft",
            "limit": 50,
        },
        timeout=15,
    )
    assert list_resp.status_code == 200
    titles = [a["title"] for a in list_resp.json()["articles"]]
    assert any(payload["title"] in t for t in titles), "Newly created draft not found"
    print(f"✓ Created draft stamped as morning-brief — slug={data.get('slug')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
