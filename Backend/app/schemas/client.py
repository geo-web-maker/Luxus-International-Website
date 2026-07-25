"""
Request/response schemas for the clients (logo cloud) resource. Same
camelCase-over-the-wire pattern as app/schemas/service.py.
"""
from pydantic import ConfigDict, Field

from app.models.common import ImageInfo
from app.schemas.service import CamelModel  # reuse the shared camelCase base


class ClientIn(CamelModel):
    name: str
    display_order: int = 0
    active: bool = True
    image: ImageInfo = Field(default_factory=ImageInfo)


class ClientUpdate(CamelModel):
    """All fields optional — PATCH semantics."""

    name: str | None = None
    display_order: int | None = None
    active: bool | None = None
    image: ImageInfo | None = None


class ClientOut(CamelModel):
    id: str = Field(..., alias="id")
    name: str
    display_order: int
    active: bool
    image: ImageInfo
