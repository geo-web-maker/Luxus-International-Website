"""
Embedded sub-documents shared across models. These are never their own
Mongo collection — they only exist nested inside a parent document.
"""
from typing import Literal

from pydantic import BaseModel, Field


class ImageInfo(BaseModel):
    """Mirrors services.js `image: {status, file?, note?}`."""

    status: Literal["pending", "confirmed"] = "pending"
    file: str | None = None  # R2 object key / URL once uploaded
    note: str | None = None


class ContentItem(BaseModel):
    """One entry inside a content-grid section. `media` is reused for both
    an icon (icon-grid/feature-rows layouts) and a photo (photo-cards
    layout) — which one it represents is purely a matter of which `layout`
    the parent ContentSection uses, not a difference in shape."""

    id: str  # renumbered on write, see service_service.py
    heading: str
    body: str | None = None
    media: ImageInfo = Field(default_factory=ImageInfo)


class ContentSection(BaseModel):
    """One block in a service page's admin-ordered content. `type`
    "richtext" uses `body` (a small markdown subset — paragraphs via blank
    lines, "- " bullets, "**bold**"); `type` "content-grid" uses `items`,
    displayed per `layout`. See PLAN in the clients/services conversation
    for the reasoning — this replaces the old fixed `benefits` field so any
    service page (ISO-standard style, Asset-Management style, Surveying
    style, Engineering-Design style, etc.) can be assembled from the same
    small set of reusable blocks instead of one rigid template."""

    id: str  # renumbered on write, see service_service.py
    type: Literal["richtext", "content-grid"]
    heading: str | None = None
    body: str | None = None  # used when type == "richtext"
    layout: Literal["icon-grid", "photo-cards", "feature-rows"] | None = None
    items: list[ContentItem] = Field(default_factory=list)  # used when type == "content-grid"

