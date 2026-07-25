"""
Business logic for the clients (logo cloud) resource. Mirrors the shape of
service_service.py — routers/clients.py stays pure HTTP-concerns, this stays
pure domain logic.
"""
from fastapi import HTTPException, UploadFile, status

from app.core import storage
from app.core.uploads import read_and_validate_image
from app.models.client import Client
from app.models.common import ImageInfo
from app.schemas.client import ClientIn, ClientUpdate


async def list_clients(include_inactive: bool = False) -> list[Client]:
    """Public site only ever wants active clients, in display order; the
    admin panel passes include_inactive=True so it can still see/edit
    clients that have been toggled off."""
    query = Client.find_all() if include_inactive else Client.find(Client.active == True)  # noqa: E712
    clients = await query.to_list()
    return sorted(clients, key=lambda c: c.display_order)


async def get_client_or_404(client_id: str) -> Client:
    client = await Client.get(client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Client '{client_id}' not found")
    return client


async def create_client(data: ClientIn) -> Client:
    client = Client(**data.model_dump())
    await client.insert()
    return client


async def update_client(client_id: str, data: ClientUpdate) -> Client:
    client = await get_client_or_404(client_id)
    set_fields = data.model_dump(exclude_unset=True).keys()
    for field in set_fields:
        setattr(client, field, getattr(data, field))
    await client.save()
    return client


async def delete_client(client_id: str) -> None:
    client = await get_client_or_404(client_id)
    await client.delete()


async def set_client_image(client_id: str, file: UploadFile) -> Client:
    client = await get_client_or_404(client_id)
    content = await read_and_validate_image(file)
    url = await storage.upload_file(
        content=content,
        original_filename=file.filename or "image",
        content_type=file.content_type,
        prefix="client-logos",
    )
    client.image = ImageInfo(status="confirmed", file=url)
    await client.save()
    return client
