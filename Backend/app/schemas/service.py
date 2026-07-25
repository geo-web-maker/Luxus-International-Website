"""
Request/response schemas for the services resource. Separate from
app/models/service.py so the wire format (camelCase, matching what the
frontend already expects from services.js) can differ from the internal
Mongo field names (snake_case) without leaking one into the other.
"""
from pydantic import BaseModel, ConfigDict, Field

from app.models.common import Benefit, ImageInfo


def _to_camel(s: str) -> str:
    head, *tail = s.split("_")
    return head + "".join(w.capitalize() for w in tail)


class CamelModel(BaseModel):
    """Base for any schema exposed over the wire: accepts/emits camelCase,
    matching the shape services.js/store.js already use, while internal
    Python code still uses idiomatic snake_case field names."""

    model_config = ConfigDict(alias_generator=_to_camel, populate_by_name=True)


# --- Service child (sub-service) ---

class ServiceChildIn(CamelModel):
    slug: str
    path: str
    name: str
    standard_code: str | None = None
    note: str | None = None
    benefits: list[Benefit] | None = None
    image: ImageInfo = Field(default_factory=ImageInfo)


class ServiceChildUpdate(CamelModel):
    """All fields optional — PATCH semantics."""

    path: str | None = None
    name: str | None = None
    standard_code: str | None = None
    note: str | None = None
    benefits: list[Benefit] | None = None
    image: ImageInfo | None = None


class ServiceChildOut(ServiceChildIn):
    pass


# --- Service group ---

class ServiceGroupIn(CamelModel):
    slug: str
    path: str
    name: str
    short_name: str
    summary: str = ""
    image: ImageInfo = Field(default_factory=ImageInfo)
    included_services: list[str] | None = None


class ServiceGroupUpdate(CamelModel):
    """All fields optional — PATCH semantics. `slug` is deliberately excluded:
    per store.js's contract, renaming a slug is delete+recreate, not update."""

    path: str | None = None
    name: str | None = None
    short_name: str | None = None
    summary: str | None = None
    image: ImageInfo | None = None
    included_services: list[str] | None = None


class ServiceGroupOut(CamelModel):
    id: str = Field(..., alias="id")
    slug: str
    path: str
    name: str
    short_name: str
    summary: str
    image: ImageInfo
    included_services: list[str] | None = None
    children: list[ServiceChildOut] = Field(default_factory=list)
