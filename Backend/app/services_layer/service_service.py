"""
Business logic for services, kept out of routers/services.py so the router
stays pure HTTP-concerns (status codes, request/response mapping) and this
stays pure domain logic (uniqueness rules, renumbering) that's independently
testable without spinning up FastAPI.
"""
from fastapi import HTTPException, UploadFile, status

from app.core import storage
from app.core.uploads import read_and_validate_image
from app.models.common import ImageInfo
from app.models.service import ServiceGroup, ServiceChild
from app.schemas.service import ServiceGroupIn, ServiceGroupUpdate, ServiceChildIn, ServiceChildUpdate


async def list_groups() -> list[ServiceGroup]:
    return await ServiceGroup.find_all().to_list()


async def get_group_or_404(slug: str) -> ServiceGroup:
    group = await ServiceGroup.find_one(ServiceGroup.slug == slug)
    if group is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Service group '{slug}' not found")
    return group


async def create_group(data: ServiceGroupIn) -> ServiceGroup:
    existing = await ServiceGroup.find_one(ServiceGroup.slug == data.slug)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Slug '{data.slug}' already exists")

    group = ServiceGroup(**data.model_dump())
    await group.insert()
    return group


async def update_group(slug: str, data: ServiceGroupUpdate) -> ServiceGroup:
    group = await get_group_or_404(slug)
    set_fields = data.model_dump(exclude_unset=True).keys()
    for field in set_fields:
        setattr(group, field, getattr(data, field))
    await group.save()
    return group


async def delete_group(slug: str) -> None:
    group = await get_group_or_404(slug)
    await group.delete()


async def set_group_image(slug: str, file: UploadFile) -> ServiceGroup:
    group = await get_group_or_404(slug)
    content = await read_and_validate_image(file)
    url = await storage.upload_file(
        content=content,
        original_filename=file.filename or "image",
        content_type=file.content_type,
        prefix="service-images",
    )
    group.image = ImageInfo(status="confirmed", file=url)
    await group.save()
    return group


def _renumber_benefits(child: ServiceChild) -> None:
    """Benefits are displayed in order with a zero-padded id ("01", "02", ...);
    reassign after any add/remove so ids stay contiguous, matching the
    behavior store.js's renumbering comment describes for the mock data."""
    if not child.benefits:
        return
    for index, benefit in enumerate(child.benefits, start=1):
        benefit.id = f"{index:02d}"


async def create_child(group_slug: str, data: ServiceChildIn) -> ServiceGroup:
    group = await get_group_or_404(group_slug)

    if any(c.slug == data.slug for c in group.children):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Child slug '{data.slug}' already exists under '{group_slug}'",
        )

    child = ServiceChild(**data.model_dump())
    _renumber_benefits(child)
    group.children.append(child)
    await group.save()
    return group


def _find_child_or_404(group: ServiceGroup, child_slug: str) -> ServiceChild:
    for child in group.children:
        if child.slug == child_slug:
            return child
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Child '{child_slug}' not found under '{group.slug}'",
    )


async def update_child(group_slug: str, child_slug: str, data: ServiceChildUpdate) -> ServiceGroup:
    group = await get_group_or_404(group_slug)
    child = _find_child_or_404(group, child_slug)

    # Use model_dump only to know which fields were explicitly set; pull the
    # actual values from `data` itself (not the dump) so nested models like
    # `benefits: list[Benefit]` stay as real Benefit instances rather than
    # being flattened to plain dicts, which _renumber_benefits requires.
    set_fields = data.model_dump(exclude_unset=True).keys()
    for field in set_fields:
        setattr(child, field, getattr(data, field))
    _renumber_benefits(child)

    await group.save()
    return group


async def delete_child(group_slug: str, child_slug: str) -> ServiceGroup:
    group = await get_group_or_404(group_slug)
    _find_child_or_404(group, child_slug)  # raises 404 if missing
    group.children = [c for c in group.children if c.slug != child_slug]
    await group.save()
    return group


async def set_child_image(group_slug: str, child_slug: str, file: UploadFile) -> ServiceGroup:
    group = await get_group_or_404(group_slug)
    child = _find_child_or_404(group, child_slug)
    content = await read_and_validate_image(file)
    url = await storage.upload_file(
        content=content,
        original_filename=file.filename or "image",
        content_type=file.content_type,
        prefix="service-images",
    )
    child.image = ImageInfo(status="confirmed", file=url)
    await group.save()
    return group
