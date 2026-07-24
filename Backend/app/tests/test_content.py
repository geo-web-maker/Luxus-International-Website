def test_get_content_returns_defaults_when_empty(client):
    r = client.get("/api/content")
    assert r.status_code == 200
    body = r.json()
    assert body["company"]["name"] == "Luxuz Consult International Ltd"
    assert len(body["navLinks"]) == 4
    assert "ISO 9001:2015" in body["isoCoverageTags"]


def test_get_content_is_idempotent_singleton(client):
    r1 = client.get("/api/content")
    r2 = client.get("/api/content")
    assert r1.json() == r2.json()


def test_update_company_requires_admin(client):
    r = client.patch("/api/content/company", json={"tagline": "New tagline"})
    assert r.status_code == 401


def test_update_company_patch_semantics(client, admin_headers):
    r = client.patch("/api/content/company", json={"tagline": "New tagline"}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["company"]["tagline"] == "New tagline"
    # untouched field survives
    assert r.json()["company"]["name"] == "Luxuz Consult International Ltd"


def test_set_coverage_tags_replaces_list(client, admin_headers):
    r = client.patch(
        "/api/content/coverage-tags",
        json={"isoCoverageTags": ["ISO 9001:2015"]},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["isoCoverageTags"] == ["ISO 9001:2015"]
