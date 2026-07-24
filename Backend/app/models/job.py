"""
Job document. Mirrors jobs.js exactly: id, title, location, remote, type,
salary, companyName, applicationDeadline, filled, description.

Note: jobs.js uses a human-assigned slug-like `id` (e.g.
"regional-sales-executive"), not a Mongo ObjectId, and jobsApi in store.js
looks jobs up by that field — so `id` stays the stable external key here
too, distinct from Beanie's internal `_id`.
"""
from datetime import date

from beanie import Document
from pydantic import Field


class Job(Document):
    job_id: str = Field(..., description="Stable external key, e.g. 'regional-sales-executive'")
    title: str
    location: str
    remote: bool = False
    type: str  # e.g. "Full Time", "Part Time", "Contract"
    salary: str | None = None
    company_name: str
    application_deadline: date | None = None
    filled: bool = False
    description: str = ""

    class Settings:
        name = "jobs"
        indexes = ["job_id", "filled", "location"]
