def _create_group(client, admin_headers, slug="hse"):
    return client.post(
        "/api/services",
        json={
            "slug": slug, "path": f"/ser/{slug}", "name": "HSE",
            "shortName": "HSE training",
        },
        headers=admin_headers,
    )


def test_list_services_empty(client):
    r = client.get("/api/services")
    assert r.status_code == 200
    assert r.json() == []


def test_create_and_get_service_group(client, admin_headers):
    r = _create_group(client, admin_headers)
    assert r.status_code == 201
    assert r.json()["slug"] == "hse"

    r = client.get("/api/services/hse")
    assert r.status_code == 200
    assert r.json()["name"] == "HSE"


def test_create_duplicate_slug_conflicts(client, admin_headers):
    _create_group(client, admin_headers)
    r = _create_group(client, admin_headers)
    assert r.status_code == 409


def test_get_missing_group_404(client):
    r = client.get("/api/services/does-not-exist")
    assert r.status_code == 404


def test_update_group_patch_semantics(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.patch("/api/services/hse", json={"summary": "Updated summary"}, headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["summary"] == "Updated summary"
    assert r.json()["name"] == "HSE"  # untouched fields survive PATCH


def test_delete_group(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.delete("/api/services/hse", headers=admin_headers)
    assert r.status_code == 204
    r = client.get("/api/services/hse")
    assert r.status_code == 404


def test_create_child_under_group(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.post(
        "/api/services/hse/children",
        json={"slug": "hset", "path": "/ser/hse/hset", "name": "HSE Training"},
        headers=admin_headers,
    )
    assert r.status_code == 201
    assert len(r.json()["children"]) == 1
    assert r.json()["children"][0]["slug"] == "hset"


def test_create_duplicate_child_slug_conflicts(client, admin_headers):
    _create_group(client, admin_headers)
    client.post(
        "/api/services/hse/children",
        json={"slug": "hset", "path": "/ser/hse/hset", "name": "HSE Training"},
        headers=admin_headers,
    )
    r = client.post(
        "/api/services/hse/children",
        json={"slug": "hset", "path": "/ser/hse/hset", "name": "Duplicate"},
        headers=admin_headers,
    )
    assert r.status_code == 409


def test_benefit_renumbering_on_child_update(client, admin_headers):
    _create_group(client, admin_headers)
    client.post(
        "/api/services/hse/children",
        json={
            "slug": "envms", "path": "/ser/hse/envms", "name": "Env",
            "benefits": [
                {"id": "01", "label": "A"},
                {"id": "02", "label": "B"},
                {"id": "03", "label": "C"},
            ],
        },
        headers=admin_headers,
    )
    # remove the middle benefit -> remaining should renumber to 01, 02
    r = client.patch(
        "/api/services/hse/children/envms",
        json={"benefits": [{"id": "99", "label": "A"}, {"id": "99", "label": "C"}]},
        headers=admin_headers,
    )
    assert r.status_code == 200
    child = next(c for c in r.json()["children"] if c["slug"] == "envms")
    assert [b["id"] for b in child["benefits"]] == ["01", "02"]


def test_delete_child(client, admin_headers):
    _create_group(client, admin_headers)
    client.post(
        "/api/services/hse/children",
        json={"slug": "hset", "path": "/ser/hse/hset", "name": "HSE Training"},
        headers=admin_headers,
    )
    r = client.delete("/api/services/hse/children/hset", headers=admin_headers)
    assert r.status_code == 200
    assert r.json()["children"] == []


def test_public_reads_do_not_require_auth(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.get("/api/services")
    assert r.status_code == 200
    r = client.get("/api/services/hse")
    assert r.status_code == 200
