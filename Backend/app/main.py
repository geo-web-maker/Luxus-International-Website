"""
App entrypoint. Run with: uvicorn app.main:app --reload --port 8000

Kept deliberately thin — this file wires things together (lifespan, CORS,
routers) and shouldn't grow business logic. Each phase adds its router(s)
in the "include routers" block below; nothing else here should need to
change as the app grows.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="Luxuz Consult API",
    description="Backend for the Luxuz Consult International website + admin portal.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["health"])
async def health_check():
    """Confirms the app booted and Mongo connection was established."""
    return {"status": "ok", "environment": settings.environment}


from app.routers import services, jobs, content, admin_auth, submissions, clients

app.include_router(services.router)
app.include_router(jobs.router)
app.include_router(content.router)
app.include_router(admin_auth.router)
app.include_router(submissions.router)
app.include_router(clients.router)
