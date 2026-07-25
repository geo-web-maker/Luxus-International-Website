"""
Service group document. Sub-services ("children") are embedded, not a
separate collection — see comment in app/models/common.py. This mirrors
services.js exactly: a group has slug/path/name/shortName/summary/image/
includedServices?/children[], and each child has slug/path/name/
standardCode?/note?/sections[].

Both a group and a child can carry `sections` — a group with no children
(e.g. an "Asset Management" or "Engineering Design" style page) renders its
own sections directly, same as a leaf child page does; see ServiceDetail.jsx.

servicesApi in store.js operates on groups by `slug` and on children by
(groupSlug, childSlug) — `slug` is therefore the stable key here too;
renaming a group's slug is a delete+recreate, same rule store.js enforces.
"""
from beanie import Document
from pydantic import BaseModel, Field

from app.models.common import ContentSection, ImageInfo


class ServiceChild(BaseModel):
    slug: str
    path: str
    name: str
    short_name: str | None = None
    standard_code: str | None = None
    note: str | None = None
    sections: list[ContentSection] = Field(default_factory=list)
    image: ImageInfo = Field(default_factory=ImageInfo)


class ServiceGroup(Document):
    slug: str = Field(..., description="Stable unique key; changing it means delete+recreate")
    path: str
    name: str
    short_name: str
    summary: str = ""
    image: ImageInfo = Field(default_factory=ImageInfo)
    included_services: list[str] | None = None
    sections: list[ContentSection] = Field(default_factory=list)
    children: list[ServiceChild] = Field(default_factory=list)

    class Settings:
        name = "service_groups"
        indexes = ["slug"]
