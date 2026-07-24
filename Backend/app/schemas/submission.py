"""
Request/response schemas for the three public forms. Validation rules are
matched 1:1 against the Zod schemas in the frontend (ContactForm.jsx,
QuoteForm.jsx, JobApplicationForm.jsx) so the server rejects anything the
client should already have caught — never trust client-side validation
alone. If either side's rules change, check the other.

`quoteFormOptions` (companySector / typeOfService enums) lives here rather
than in a DB model since it's static reference data, not admin-editable
content — see note in app/models/content.py.
"""
import re
from datetime import datetime

from pydantic import EmailStr, Field, field_validator

from app.schemas.service import CamelModel

# Mirrors siteContent.js's quoteFormOptions exactly — keep in sync if that
# file's option lists change.
COMPANY_SECTOR_OPTIONS = [
    "Industrial/Manufacturing/Construction",
    "Energy",
    "Telecom/IT",
    "Service Providers",
    "Utilities",
    "Financials",
    "Healthcare",
    "Schools/Training Institution",
    "Others",
]

TYPE_OF_SERVICE_OPTIONS = [
    "ISO Certification",
    "ISO Training",
    "ISO Documentation & Implementation",
    "Engineering Design",
    "Surveying Work",
    "HSE Training & Documentation",
    "First Aid Training",
    "Fire Training",
    "Supply of Safety Equipment",
]

_PHONE_RE = re.compile(r"^[0-9+\-\s]+$")


# --- Contact ---

class ContactMessageIn(CamelModel):
    first_name: str = Field(..., min_length=1)
    last_name: str | None = None
    email: EmailStr
    message: str = Field(..., min_length=1)


class ContactMessageOut(ContactMessageIn):
    id: str
    handled: bool
    created_at: datetime


# --- Quote request ---

class QuoteRequestIn(CamelModel):
    first_name: str = Field(..., min_length=1)
    last_name: str | None = None
    phone: str = Field(..., min_length=1)
    email: EmailStr
    company_sector: str
    type_of_service: str
    company_name: str = Field(..., min_length=1)
    company_website: str | None = None
    country: str = Field(..., min_length=1)
    number_of_employees: str | None = None
    company_scope: str | None = None

    @field_validator("company_sector")
    @classmethod
    def validate_sector(cls, v: str) -> str:
        if v not in COMPANY_SECTOR_OPTIONS:
            raise ValueError(f"companySector must be one of {COMPANY_SECTOR_OPTIONS}")
        return v

    @field_validator("type_of_service")
    @classmethod
    def validate_service_type(cls, v: str) -> str:
        if v not in TYPE_OF_SERVICE_OPTIONS:
            raise ValueError(f"typeOfService must be one of {TYPE_OF_SERVICE_OPTIONS}")
        return v


class QuoteRequestOut(QuoteRequestIn):
    id: str
    handled: bool
    created_at: datetime


# --- Job application ---
# Note: this one is submitted as multipart/form-data (has a file), so the
# router parses form fields individually via Form(...) rather than a single
# JSON body bound to this schema — see routers/submissions.py. This schema
# still documents/validates the non-file fields for reuse in tests.

class JobApplicationIn(CamelModel):
    full_name: str = Field(..., min_length=1)
    email: EmailStr
    phone: str
    region: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)
    job_id: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not _PHONE_RE.match(v):
            raise ValueError("Numbers only")
        return v


class JobApplicationOut(CamelModel):
    id: str
    full_name: str
    email: str
    phone: str
    region: str
    message: str
    cv_url: str
    cv_filename: str
    job_id: str | None = None
    handled: bool
    created_at: datetime
