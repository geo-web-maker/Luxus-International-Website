"""
Clients (logo cloud) router. Public GET only returns active clients in
display order — admin-gated everything else, same pattern as
routers/services.py.
"""
from fastapi import APIRouter, Depends, File, UploadFile, status

from app.deps import require_admin
from app.models.client import Client
from app.schemas.client import ClientIn, ClientOut, ClientUpdate
from app.services_layer import client_service

router = APIRouter(prefix="/api/clients", tags=["clients"])


def _to_out(client: Client) -> ClientOut:
    return ClientOut(id=str(client.id), **client.model_dump(exclude={"id", "revision_id"}))


@router.get("", response_model=list[ClientOut])
async def list_clients(include_inactive: bool = False):
    """Public: only active clients unless include_inactive=true is passed.
    Logos aren't sensitive data, so this flag is left open rather than
    admin-gated — the admin panel uses it to see toggled-off clients too."""
    clients = await client_service.list_clients(include_inactive=include_inactive)
    return [_to_out(c) for c in clients]


@router.post("", response_model=ClientOut, status_code=status.HTTP_201_CREATED)
async def create_client(data: ClientIn, _admin: str = Depends(require_admin)):
    client = await client_service.create_client(data)
    return _to_out(client)


@router.patch("/{client_id}", response_model=ClientOut)
async def update_client(client_id: str, data: ClientUpdate, _admin: str = Depends(require_admin)):
    client = await client_service.update_client(client_id, data)
    return _to_out(client)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(client_id: str, _admin: str = Depends(require_admin)):
    await client_service.delete_client(client_id)


@router.post("/{client_id}/image", response_model=ClientOut)
async def upload_client_image(
    client_id: str, file: UploadFile = File(...), _admin: str = Depends(require_admin)
):
    client = await client_service.set_client_image(client_id, file)
    return _to_out(client)
