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


def test_section_renumbering_on_child_update(client, admin_headers):
    _create_group(client, admin_headers)
    client.post(
        "/api/services/hse/children",
        json={
            "slug": "envms", "path": "/ser/hse/envms", "name": "Env",
            "sections": [
                {
                    "id": "s01", "type": "content-grid", "heading": "Benefits", "layout": "icon-grid",
                    "items": [
                        {"id": "i01", "heading": "A"},
                        {"id": "i02", "heading": "B"},
                        {"id": "i03", "heading": "C"},
                    ],
                },
            ],
        },
        headers=admin_headers,
    )
    # remove the middle item -> remaining items (and the section itself)
    # should renumber to their contiguous ids
    r = client.patch(
        "/api/services/hse/children/envms",
        json={
            "sections": [
                {
                    "id": "x", "type": "content-grid", "heading": "Benefits", "layout": "icon-grid",
                    "items": [{"id": "x", "heading": "A"}, {"id": "x", "heading": "C"}],
                },
            ],
        },
        headers=admin_headers,
    )
    assert r.status_code == 200
    child = next(c for c in r.json()["children"] if c["slug"] == "envms")
    assert child["sections"][0]["id"] == "s01"
    assert [i["id"] for i in child["sections"][0]["items"]] == ["i01", "i02"]


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


def test_spec_table_section_round_trips(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.post(
        "/api/services/hse/children",
        json={
            "slug": "isocli", "path": "/ser/hse/isocli", "name": "ISO Lead Implementer",
            "sections": [
                {
                    "id": "x",
                    "type": "spec-table",
                    "heading": "",
                    "rows": [
                        {"label": "Duration", "value": "5 Days"},
                        {"label": "Language", "value": "English"},
                    ],
                },
            ],
        },
        headers=admin_headers,
    )
    assert r.status_code == 201
    child = next(c for c in r.json()["children"] if c["slug"] == "isocli")
    section = child["sections"][0]
    assert section["type"] == "spec-table"
    assert section["rows"] == [
        {"label": "Duration", "value": "5 Days"},
        {"label": "Language", "value": "English"},
    ]


def test_data_table_section_round_trips(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.post(
        "/api/services/hse/children",
        json={
            "slug": "isot", "path": "/ser/hse/isot", "name": "ISO Training",
            "sections": [
                {
                    "id": "x",
                    "type": "data-table",
                    "heading": "Benefits of ISO Training",
                    "columns": ["Employees", "Individuals"],
                    "rows": [
                        ["- Improved performance", "- Enhanced career opportunities"],
                    ],
                },
            ],
        },
        headers=admin_headers,
    )
    assert r.status_code == 201
    child = next(c for c in r.json()["children"] if c["slug"] == "isot")
    section = child["sections"][0]
    assert section["type"] == "data-table"
    assert section["columns"] == ["Employees", "Individuals"]
    assert section["rows"] == [["- Improved performance", "- Enhanced career opportunities"]]


def test_section_renumbering_leaves_spec_table_rows_untouched(client, admin_headers):
    _create_group(client, admin_headers)
    r = client.post(
        "/api/services/hse/children",
        json={
            "slug": "isocli", "path": "/ser/hse/isocli", "name": "ISO Lead Implementer",
            "sections": [
                {"id": "x", "type": "richtext", "body": "Intro"},
                {
                    "id": "x", "type": "spec-table",
                    "rows": [{"label": "Duration", "value": "5 Days"}],
                },
            ],
        },
        headers=admin_headers,
    )
    assert r.status_code == 201
    child = next(c for c in r.json()["children"] if c["slug"] == "isocli")
    assert [s["id"] for s in child["sections"]] == ["s01", "s02"]
    assert child["sections"][1]["rows"] == [{"label": "Duration", "value": "5 Days"}]
