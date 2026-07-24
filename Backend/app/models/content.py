"""
Site content singleton. Mirrors siteContent.js's `company`, `navLinks`,
`isoCoverageTags` exports — the parts that are actually admin-editable
content. (`quoteFormOptions` is static enum data used for validation, not
editable content — it lives in app/schemas/submission.py instead.)

There is exactly one SiteContent document ever. content_service.py enforces
get-or-create-default so callers never have to think about the singleton
constraint.
"""
from beanie import Document
from pydantic import BaseModel, Field


class NavLink(BaseModel):
    label: str
    path: str


class Company(BaseModel):
    name: str
    short_name: str
    phone: str
    email: str
    accreditation_partner: str
    tagline: str


class SiteContent(Document):
    company: Company
    nav_links: list[NavLink] = Field(default_factory=list)
    iso_coverage_tags: list[str] = Field(default_factory=list)

    class Settings:
        name = "site_content"
