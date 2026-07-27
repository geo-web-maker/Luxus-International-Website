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


class SpecRow(BaseModel):
    """One label:value row inside a spec-table section, e.g.
    {label: "Duration", value: "5 Days"}."""

    label: str
    value: str


class ContentSection(BaseModel):
    """One block in a service page's admin-ordered content.

    - "richtext": uses `body` (a small markdown subset — paragraphs via
      blank lines, "- " bullets, "**bold**").
    - "content-grid": uses `items`, displayed per `layout`.
    - "spec-table": uses `rows` as a list of {label, value} objects — a
      fixed two-column key:value table, e.g. course duration/level/CPD
      credits.
    - "data-table": uses `columns` (optional header row) and `rows` as a
      list of lists of cell strings, each cell supporting the same
      richtext subset as above — an arbitrary-width table, e.g. credential
      comparison tables or side-by-side benefit lists rendered as a
      headerless 2-column table.

    `rows` is deliberately one field covering both shapes (matching what
    the frontend sends under the same key for either section type) rather
    than two separately-named fields — Pydantic accepts either shape here
    and downstream code branches on `section.type` to know which one it got.

    See PLAN in the clients/services conversation for the reasoning — this
    replaces the old fixed `benefits` field so any service page (ISO-standard
    style, Asset-Management style, Surveying style, Engineering-Design style,
    course pages with spec/credential tables, etc.) can be assembled from the
    same small set of reusable blocks instead of one rigid template."""

    id: str  # renumbered on write, see service_service.py
    type: Literal["richtext", "content-grid", "spec-table", "data-table"]
    heading: str | None = None
    body: str | None = None  # used when type == "richtext"
    layout: Literal["icon-grid", "photo-cards", "feature-rows"] | None = None
    items: list[ContentItem] = Field(default_factory=list)  # used when type == "content-grid"
    columns: list[str] = Field(default_factory=list)  # used when type == "data-table"
    rows: list[SpecRow] | list[list[str]] = Field(
        default_factory=list
    )  # list[SpecRow] for "spec-table", list[list[str]] for "data-table"

