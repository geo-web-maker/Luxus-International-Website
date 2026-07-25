"""
Service group document. Sub-services ("children") are embedded, not a
separate collection — see comment in app/models/common.py. This mirrors
services.js exactly: a group has slug/path/name/shortName/summary/image/
includedServices?/children[], and each child has slug/path/name/
standardCode?/note?/benefits?[].

servicesApi in store.js operates on groups by `slug` and on children by
(groupSlug, childSlug) — `slug` is therefore the stable key here too;
renaming a group's slug is a delete+recreate, same rule store.js enforces.
"""
from beanie import Document
from pydantic import BaseModel, Field

from app.models.common import Benefit, ImageInfo


class ServiceChild(BaseModel):
    slug: str
    path: str
    name: str
    short_name: str | None = None
    standard_code: str | None = None
    note: str | None = None
    benefits: list[Benefit] | None = None
    image: ImageInfo = Field(default_factory=ImageInfo)


class ServiceGroup(Document):
    slug: str = Field(..., description="Stable unique key; changing it means delete+recreate")
    path: str
    name: str
    short_name: str
    summary: str = ""
    image: ImageInfo = Field(default_factory=ImageInfo)
    included_services: list[str] | None = None
    children: list[ServiceChild] = Field(default_factory=list)

    class Settings:
        name = "service_groups"
        indexes = ["slug"]
