"""
Business logic for jobs. `list_jobs` takes optional keyword/location/filled
filters so Career.jsx's search can move server-side (see conversation notes)
instead of filtering the full in-memory array on the client.
"""
import re

from fastapi import HTTPException, status

from app.models.job import Job
from app.schemas.job import JobIn, JobUpdate


async def list_jobs(
    keyword: str | None = None,
    location: str | None = None,
    filled: bool | None = None,
) -> list[Job]:
    query = Job.find_all()

    if filled is not None:
        query = Job.find(Job.filled == filled)

    jobs = await query.to_list()

    if keyword:
        pattern = re.compile(re.escape(keyword), re.IGNORECASE)
        jobs = [j for j in jobs if pattern.search(j.title) or pattern.search(j.description)]

    if location:
        pattern = re.compile(re.escape(location), re.IGNORECASE)
        jobs = [j for j in jobs if pattern.search(j.location)]

    return jobs


async def get_job_or_404(job_id: str) -> Job:
    job = await Job.find_one(Job.job_id == job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Job '{job_id}' not found")
    return job


async def create_job(data: JobIn) -> Job:
    existing = await Job.find_one(Job.job_id == data.id)
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Job id '{data.id}' already exists")

    payload = data.model_dump()
    job_id = payload.pop("id")
    job = Job(job_id=job_id, **payload)
    await job.insert()
    return job


async def update_job(job_id: str, data: JobUpdate) -> Job:
    job = await get_job_or_404(job_id)
    set_fields = data.model_dump(exclude_unset=True).keys()
    for field in set_fields:
        setattr(job, field, getattr(data, field))
    await job.save()
    return job


async def delete_job(job_id: str) -> None:
    job = await get_job_or_404(job_id)
    await job.delete()
