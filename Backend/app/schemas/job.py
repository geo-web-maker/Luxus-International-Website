"""
Request/response schemas for the jobs resource. Mirrors jobs.js's field
names via CamelModel so the frontend sees the exact same shape it already
gets from the static import.
"""
from datetime import date

from pydantic import Field

from app.schemas.service import CamelModel  # reuse the camelCase base


class JobIn(CamelModel):
    id: str  # stable external key, e.g. "regional-sales-executive"
    title: str
    location: str
    remote: bool = False
    type: str
    salary: str | None = None
    company_name: str
    application_deadline: date | None = None
    filled: bool = False
    description: str = ""


class JobUpdate(CamelModel):
    """All fields optional — PATCH semantics. `id` excluded; same
    delete+recreate-to-rename rule as ServiceGroupUpdate."""

    title: str | None = None
    location: str | None = None
    remote: bool | None = None
    type: str | None = None
    salary: str | None = None
    company_name: str | None = None
    application_deadline: date | None = None
    filled: bool | None = None
    description: str | None = None


class JobOut(CamelModel):
    id: str
    title: str
    location: str
    remote: bool
    type: str
    salary: str | None = None
    company_name: str
    application_deadline: date | None = None
    filled: bool
    description: str
