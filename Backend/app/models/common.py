"""
Embedded sub-documents shared across models. These are never their own
Mongo collection — they only exist nested inside a parent document.
"""
from typing import Literal

from pydantic import BaseModel


class ImageInfo(BaseModel):
    """Mirrors services.js `image: {status, file?, note?}`."""

    status: Literal["pending", "confirmed"] = "pending"
    file: str | None = None  # R2 object key / URL once uploaded
    note: str | None = None


class Benefit(BaseModel):
    """Mirrors a single entry in a service child's `benefits[]`."""

    id: str  # two-digit string, e.g. "01" — renumbered on write, see service_service.py
    label: str
    icon_file: str | None = None
