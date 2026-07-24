"""
Form submission documents. Three separate collections (one per bucket, matching
submissionsApi.list(bucket) in store.js: "contact-messages", "quote-requests",
"job-applications") rather than one polymorphic collection — the shapes
diverge enough (quote requests have 8+ fields, job applications carry a file
reference) that a shared schema would need a lot of nullable fields either way.

All three share `handled: bool` and `created_at` so the admin inbox UI can
treat them uniformly for the parts that are uniform (mark-as-handled, sort
by date) while each keeps its own fields for the parts that aren't.
"""
from datetime import datetime, timezone

from beanie import Document
from pydantic import Field


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class ContactMessage(Document):
    first_name: str
    last_name: str | None = None
    email: str
    message: str
    handled: bool = False
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "contact_messages"
        indexes = ["handled", "created_at"]


class QuoteRequest(Document):
    first_name: str
    last_name: str | None = None
    phone: str
    email: str
    company_sector: str
    type_of_service: str
    company_name: str
    company_website: str | None = None
    country: str
    number_of_employees: str | None = None
    company_scope: str | None = None
    handled: bool = False
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "quote_requests"
        indexes = ["handled", "created_at"]


class JobApplication(Document):
    full_name: str
    email: str
    phone: str
    region: str
    message: str
    cv_url: str  # R2 object URL, populated after upload in the submissions router
    cv_filename: str
    job_id: str | None = None  # which listing this application is for, if any
    handled: bool = False
    created_at: datetime = Field(default_factory=_utcnow)

    class Settings:
        name = "job_applications"
        indexes = ["handled", "created_at", "job_id"]
