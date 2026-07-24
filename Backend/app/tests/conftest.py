"""
Shared fixtures. `db` gives every test an isolated in-memory Mongo instance
(mongomock_motor) so tests never touch real Atlas and never leak state
between each other. `client` wraps the FastAPI app with that DB already
wired in, bypassing the real lifespan's init_db() (which would try to
connect to settings.mongo_uri for real).

Required env vars are set here, before any `app.*` import, so the test
suite never depends on a real .env file existing — CI can run this with
zero setup.
"""
import os

os.environ.setdefault("MONGO_URI", "mongodb://localhost:27017")
os.environ.setdefault("MONGO_DB_NAME", "test_db")
os.environ.setdefault("JWT_SECRET", "test-secret-not-for-production")
os.environ.setdefault("ADMIN_EMAIL", "admin@luxuzconsult.com")
# bcrypt hash of "test-password-123", generated once and pinned here so
# tests are reproducible without calling hash_password() at collection time
os.environ.setdefault(
    "ADMIN_PASSWORD_HASH",
    "$2b$12$Rmk0/z0DE4ubBkXOWMh53.OSe3GKHNQDYtOd14xFpGAf/Q7AEPI4y",  # bcrypt("test-password-123")
)

import asyncio

import pytest
import pytest_asyncio
from beanie import init_beanie
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

from app.core.security import create_access_token, hash_password
from app.config import settings
from app.models.content import SiteContent
from app.models.job import Job
from app.models.service import ServiceGroup
from app.models.submission import ContactMessage, JobApplication, QuoteRequest


@pytest_asyncio.fixture
async def db():
    """Fresh in-memory Mongo + Beanie init per test, so no test sees another
    test's data."""
    mock_client = AsyncMongoMockClient()
    database = mock_client["test_db"]
    await init_beanie(
        database=database,
        document_models=[ServiceGroup, Job, SiteContent, ContactMessage, QuoteRequest, JobApplication],
    )
    yield database


@pytest.fixture
def client(db):
    """TestClient with the app's routes, but with the real lifespan's
    init_db() replaced by a no-op so it never dials settings.mongo_uri.
    Beanie is already initialized against the mock DB by the `db` fixture
    before this runs."""
    import app.main as main_module

    async def _noop_init_db():
        return None

    async def _noop_close_db():
        return None

    original_init_db = main_module.init_db
    original_close_db = main_module.close_db
    main_module.init_db = _noop_init_db
    main_module.close_db = _noop_close_db

    try:
        with TestClient(main_module.app) as c:
            yield c
    finally:
        main_module.init_db = original_init_db
        main_module.close_db = original_close_db


@pytest.fixture
def admin_token():
    """A valid JWT for the fixed admin identity, bypassing the login HTTP
    call for tests that only care about what happens after auth."""
    return create_access_token(subject=settings.admin_email)


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
