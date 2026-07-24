VALID_CONTACT = {"firstName": "Jane", "email": "jane@example.com", "message": "Hello"}

VALID_QUOTE = {
    "firstName": "Jane", "phone": "0700000000", "email": "jane@example.com",
    "companySector": "Energy", "typeOfService": "ISO Training",
    "companyName": "Acme", "country": "Uganda",
}


# --- Contact messages ---

def test_submit_contact_message(client):
    r = client.post("/api/contact-messages", json=VALID_CONTACT)
    assert r.status_code == 201
    assert r.json()["handled"] is False


def test_submit_contact_message_missing_field_422(client):
    r = client.post("/api/contact-messages", json={"firstName": "Jane", "email": "jane@example.com"})
    assert r.status_code == 422


def test_submit_contact_message_bad_email_422(client):
    r = client.post("/api/contact-messages", json={**VALID_CONTACT, "email": "not-an-email"})
    assert r.status_code == 422


def test_list_contact_messages_requires_admin(client):
    r = client.get("/api/admin/contact-messages")
    assert r.status_code == 401


def test_admin_can_list_and_mark_handled(client, admin_headers):
    created = client.post("/api/contact-messages", json=VALID_CONTACT).json()

    r = client.get("/api/admin/contact-messages", headers=admin_headers)
    assert r.status_code == 200
    assert len(r.json()) == 1

    r = client.patch(
        f"/api/admin/contact-messages/{created['id']}",
        params={"handled": True},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["handled"] is True


def test_admin_can_delete_contact_message(client, admin_headers):
    created = client.post("/api/contact-messages", json=VALID_CONTACT).json()
    r = client.delete(f"/api/admin/contact-messages/{created['id']}", headers=admin_headers)
    assert r.status_code == 204
    r = client.get("/api/admin/contact-messages", headers=admin_headers)
    assert r.json() == []


# --- Quote requests ---

def test_submit_quote_request(client):
    r = client.post("/api/quote-requests", json=VALID_QUOTE)
    assert r.status_code == 201


def test_submit_quote_request_bad_sector_422(client):
    r = client.post("/api/quote-requests", json={**VALID_QUOTE, "companySector": "Not A Real Sector"})
    assert r.status_code == 422


def test_submit_quote_request_bad_service_type_422(client):
    r = client.post("/api/quote-requests", json={**VALID_QUOTE, "typeOfService": "Not A Real Service"})
    assert r.status_code == 422


def test_admin_quote_inbox_flow(client, admin_headers):
    created = client.post("/api/quote-requests", json=VALID_QUOTE).json()
    r = client.get("/api/admin/quote-requests", headers=admin_headers)
    assert len(r.json()) == 1

    r = client.patch(
        f"/api/admin/quote-requests/{created['id']}", params={"handled": True}, headers=admin_headers
    )
    assert r.json()["handled"] is True


# --- Job applications (multipart) ---

def _valid_cv_file():
    return {"cv": ("resume.pdf", b"%PDF-1.4 fake content", "application/pdf")}


def _valid_job_app_form():
    return {
        "full_name": "Jane Doe", "email": "jane@example.com", "phone": "0700000000",
        "region": "Kampala", "message": "I would like to apply",
    }


def test_submit_job_application_bad_phone_422(client):
    r = client.post(
        "/api/job-applications",
        data={**_valid_job_app_form(), "phone": "abc-not-numeric"},
        files=_valid_cv_file(),
    )
    assert r.status_code == 422


def test_submit_job_application_bad_file_type_415(client):
    r = client.post(
        "/api/job-applications",
        data=_valid_job_app_form(),
        files={"cv": ("resume.exe", b"MZ", "application/octet-stream")},
    )
    assert r.status_code == 415


def test_submit_job_application_file_too_large_413(client):
    big = b"0" * (11 * 1024 * 1024)
    r = client.post(
        "/api/job-applications",
        data=_valid_job_app_form(),
        files={"cv": ("resume.pdf", big, "application/pdf")},
    )
    assert r.status_code == 413


def test_list_job_applications_requires_admin(client):
    r = client.get("/api/admin/job-applications")
    assert r.status_code == 401


def test_submit_valid_job_application_succeeds(client, monkeypatch):
    """Mocks the R2 upload so this test covers the full success path
    (validation -> CV read -> DB insert) without needing real R2 credentials."""
    from app.core import storage

    async def fake_upload_file(content, original_filename, content_type, prefix):
        return f"https://fake-r2.example.com/{prefix}/{original_filename}"

    monkeypatch.setattr(storage, "upload_file", fake_upload_file)

    r = client.post("/api/job-applications", data=_valid_job_app_form(), files=_valid_cv_file())
    assert r.status_code == 201
    body = r.json()
    assert body["cvUrl"] == "https://fake-r2.example.com/job-applications/resume.pdf"
    assert body["handled"] is False


def test_admin_job_application_inbox_flow(client, admin_headers, monkeypatch):
    from app.core import storage

    async def fake_upload_file(content, original_filename, content_type, prefix):
        return "https://fake-r2.example.com/cv.pdf"

    monkeypatch.setattr(storage, "upload_file", fake_upload_file)

    created = client.post(
        "/api/job-applications", data=_valid_job_app_form(), files=_valid_cv_file()
    ).json()

    r = client.get("/api/admin/job-applications", headers=admin_headers)
    assert len(r.json()) == 1

    r = client.patch(
        f"/api/admin/job-applications/{created['id']}", params={"handled": True}, headers=admin_headers
    )
    assert r.json()["handled"] is True

    async def fake_delete_file(key_or_url):
        return None

    monkeypatch.setattr(storage, "delete_file", fake_delete_file)
    r = client.delete(f"/api/admin/job-applications/{created['id']}", headers=admin_headers)
    assert r.status_code == 204
