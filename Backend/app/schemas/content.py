"""
Request/response schemas for site content. Mirrors siteContent.js's
`company`, `navLinks`, `isoCoverageTags` exports.
"""
from pydantic import Field

from app.schemas.service import CamelModel


class NavLinkSchema(CamelModel):
    label: str
    path: str


class CompanySchema(CamelModel):
    name: str
    short_name: str
    phone: str
    email: str
    accreditation_partner: str
    tagline: str


class CompanyUpdate(CamelModel):
    """All fields optional — PATCH semantics."""

    name: str | None = None
    short_name: str | None = None
    phone: str | None = None
    email: str | None = None
    accreditation_partner: str | None = None
    tagline: str | None = None


class SiteContentOut(CamelModel):
    company: CompanySchema
    nav_links: list[NavLinkSchema] = Field(default_factory=list)
    iso_coverage_tags: list[str] = Field(default_factory=list)


class CoverageTagsUpdate(CamelModel):
    iso_coverage_tags: list[str]
