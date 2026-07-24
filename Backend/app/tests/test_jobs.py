def _create_job(client, admin_headers, **overrides):
    payload = {
        "id": "sales-exec", "title": "Regional Sales Executive", "location": "Kampala, Uganda",
        "type": "Full Time", "companyName": "Luxuz Consult",
    }
    payload.update(overrides)
    return client.post("/api/jobs", json=payload, headers=admin_headers)


def test_create_and_list_job(client, admin_headers):
    r = _create_job(client, admin_headers)
    assert r.status_code == 201

    r = client.get("/api/jobs")
    assert r.status_code == 200
    assert len(r.json()) == 1
    assert r.json()[0]["id"] == "sales-exec"


def test_duplicate_job_id_conflicts(client, admin_headers):
    _create_job(client, admin_headers)
    r = _create_job(client, admin_headers)
    assert r.status_code == 409


def test_get_missing_job_404(client):
    r = client.get("/api/jobs/does-not-exist")
    assert r.status_code == 404


def test_filter_by_filled_status(client, admin_headers):
    _create_job(client, admin_headers, id="open-job", filled=False)
    _create_job(client, admin_headers, id="filled-job", filled=True)

    r = client.get("/api/jobs", params={"filled": "false"})
    assert r.status_code == 200
    ids = [j["id"] for j in r.json()]
    assert "open-job" in ids
    assert "filled-job" not in ids


def test_filter_by_keyword_matches_title(client, admin_headers):
    _create_job(client, admin_headers, id="sales-role", title="Regional Sales Executive")
    _create_job(client, admin_headers, id="eng-role", title="Site Engineer")

    r = client.get("/api/jobs", params={"keyword": "Sales"})
    assert r.status_code == 200
    ids = [j["id"] for j in r.json()]
    assert ids == ["sales-role"]


def test_filter_by_location(client, admin_headers):
    _create_job(client, admin_headers, id="kampala-job", location="Kampala, Uganda")
    _create_job(client, admin_headers, id="nairobi-job", location="Nairobi, Kenya")

    r = client.get("/api/jobs", params={"location": "Kampala"})
    assert r.status_code == 200
    ids = [j["id"] for j in r.json()]
    assert ids == ["kampala-job"]


def test_update_job_patch_semantics(client, admin_headers):
    _create_job(client, admin_headers)
    r = client.patch("/api/jobs/sales-exec", json={"filled": True}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["filled"] is True
    assert r.json()["title"] == "Regional Sales Executive"  # untouched


def test_delete_job(client, admin_headers):
    _create_job(client, admin_headers)
    r = client.delete("/api/jobs/sales-exec", headers=admin_headers)
    assert r.status_code == 204
    r = client.get("/api/jobs/sales-exec")
    assert r.status_code == 404


def test_write_routes_require_admin(client):
    r = client.patch("/api/jobs/sales-exec", json={"filled": True})
    assert r.status_code == 401
    r = client.delete("/api/jobs/sales-exec")
    assert r.status_code == 401
