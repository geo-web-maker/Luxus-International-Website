"""
Jobs router. GET /api/jobs accepts ?keyword=&location=&filled= so
Career.jsx's search/filter UI can be backed by the DB query instead of
filtering a fully-loaded in-memory array (see Phase 0 frontend notes).
"""
from fastapi import APIRouter, Depends, Query, status

from app.deps import require_admin
from app.models.job import Job
from app.schemas.job import JobIn, JobOut, JobUpdate
from app.services_layer import job_service

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


def _to_out(job: Job) -> JobOut:
    return JobOut(id=job.job_id, **job.model_dump(exclude={"id", "revision_id", "job_id"}))


@router.get("", response_model=list[JobOut])
async def list_jobs(
    keyword: str | None = Query(default=None),
    location: str | None = Query(default=None),
    filled: bool | None = Query(default=None),
):
    jobs = await job_service.list_jobs(keyword=keyword, location=location, filled=filled)
    return [_to_out(j) for j in jobs]


@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: str):
    job = await job_service.get_job_or_404(job_id)
    return _to_out(job)


@router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
async def create_job(data: JobIn, _admin: str = Depends(require_admin)):
    job = await job_service.create_job(data)
    return _to_out(job)


@router.patch("/{job_id}", response_model=JobOut)
async def update_job(job_id: str, data: JobUpdate, _admin: str = Depends(require_admin)):
    job = await job_service.update_job(job_id, data)
    return _to_out(job)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(job_id: str, _admin: str = Depends(require_admin)):
    await job_service.delete_job(job_id)
