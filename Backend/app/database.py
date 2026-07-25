"""
Mongo connection lifecycle.

init_db() is called once from the app's lifespan (see main.py) and registers
every Beanie Document model against the shared Motor client. Phase 2 will
populate `document_models` as each model is added — nothing else in the app
should reach for AsyncIOMotorClient directly.
"""
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.config import settings

client: AsyncIOMotorClient | None = None


async def init_db() -> None:
    global client
    client = AsyncIOMotorClient(settings.mongo_uri)
    database = client[settings.mongo_db_name]

    from app.models.service import ServiceGroup
    from app.models.job import Job
    from app.models.content import SiteContent
    from app.models.submission import ContactMessage, QuoteRequest, JobApplication
    from app.models.client import Client

    document_models = [
        ServiceGroup,
        Job,
        SiteContent,
        ContactMessage,
        QuoteRequest,
        JobApplication,
        Client,
    ]

    await init_beanie(database=database, document_models=document_models)


async def close_db() -> None:
    if client is not None:
        client.close()
