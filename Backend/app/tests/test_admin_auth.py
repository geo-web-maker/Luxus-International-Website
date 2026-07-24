from app.config import settings


def test_login_wrong_password_rejected(client):
    r = client.post("/api/admin/login", json={"email": settings.admin_email, "password": "wrong"})
    assert r.status_code == 401


def test_login_wrong_email_rejected(client):
    r = client.post("/api/admin/login", json={"email": "nobody@example.com", "password": "test-password-123"})
    assert r.status_code == 401


def test_login_success_issues_token(client):
    r = client.post("/api/admin/login", json={"email": settings.admin_email, "password": "test-password-123"})
    assert r.status_code == 200
    body = r.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_write_route_without_token_rejected(client):
    r = client.post("/api/jobs", json={
        "id": "x", "title": "Y", "location": "K", "type": "Full Time", "companyName": "Luxuz",
    })
    assert r.status_code == 401


def test_write_route_with_invalid_token_rejected(client):
    r = client.post(
        "/api/jobs",
        json={"id": "x", "title": "Y", "location": "K", "type": "Full Time", "companyName": "Luxuz"},
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert r.status_code == 401


def test_write_route_with_valid_token_succeeds(client, admin_headers):
    r = client.post(
        "/api/jobs",
        json={"id": "x", "title": "Y", "location": "K", "type": "Full Time", "companyName": "Luxuz"},
        headers=admin_headers,
    )
    assert r.status_code == 201
