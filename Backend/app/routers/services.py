"""
Services router. Public GETs, admin-gated everything else — mirrors
servicesApi in store.js exactly (list/getGroup/createGroup/updateGroup/
deleteGroup/createChild/updateChild/deleteChild).
"""
from fastapi import APIRouter, Depends, File, UploadFile, status

from app.deps import require_admin
from app.models.service import ServiceGroup
from app.schemas.service import (
    ServiceGroupIn,
    ServiceGroupOut,
    ServiceGroupUpdate,
    ServiceChildIn,
    ServiceChildUpdate,
)
from app.services_layer import service_service

router = APIRouter(prefix="/api/services", tags=["services"])


def _to_out(group: ServiceGroup) -> ServiceGroupOut:
    return ServiceGroupOut(id=str(group.id), **group.model_dump(exclude={"id", "revision_id"}))


@router.get("", response_model=list[ServiceGroupOut])
async def list_services():
    groups = await service_service.list_groups()
    return [_to_out(g) for g in groups]


@router.get("/{slug}", response_model=ServiceGroupOut)
async def get_service(slug: str):
    group = await service_service.get_group_or_404(slug)
    return _to_out(group)


@router.post("", response_model=ServiceGroupOut, status_code=status.HTTP_201_CREATED)
async def create_service(data: ServiceGroupIn, _admin: str = Depends(require_admin)):
    group = await service_service.create_group(data)
    return _to_out(group)


@router.patch("/{slug}", response_model=ServiceGroupOut)
async def update_service(slug: str, data: ServiceGroupUpdate, _admin: str = Depends(require_admin)):
    group = await service_service.update_group(slug, data)
    return _to_out(group)


@router.delete("/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(slug: str, _admin: str = Depends(require_admin)):
    await service_service.delete_group(slug)


@router.post("/{slug}/image", response_model=ServiceGroupOut)
async def upload_service_image(
    slug: str, file: UploadFile = File(...), _admin: str = Depends(require_admin)
):
    group = await service_service.set_group_image(slug, file)
    return _to_out(group)


@router.post("/{slug}/children", response_model=ServiceGroupOut, status_code=status.HTTP_201_CREATED)
async def create_child(slug: str, data: ServiceChildIn, _admin: str = Depends(require_admin)):
    group = await service_service.create_child(slug, data)
    return _to_out(group)


@router.patch("/{slug}/children/{child_slug}", response_model=ServiceGroupOut)
async def update_child(
    slug: str, child_slug: str, data: ServiceChildUpdate, _admin: str = Depends(require_admin)
):
    group = await service_service.update_child(slug, child_slug, data)
    return _to_out(group)


@router.delete("/{slug}/children/{child_slug}", response_model=ServiceGroupOut)
async def delete_child(slug: str, child_slug: str, _admin: str = Depends(require_admin)):
    group = await service_service.delete_child(slug, child_slug)
    return _to_out(group)


@router.post("/{slug}/children/{child_slug}/image", response_model=ServiceGroupOut)
async def upload_child_image(
    slug: str, child_slug: str, file: UploadFile = File(...), _admin: str = Depends(require_admin)
):
    group = await service_service.set_child_image(slug, child_slug, file)
    return _to_out(group)
