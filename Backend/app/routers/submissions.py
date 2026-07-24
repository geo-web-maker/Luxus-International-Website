"""
Submissions router. Public POST endpoints for the three frontend forms
(ContactForm, QuoteForm, JobApplicationForm — these are the exact routes
their TODO comments name). Admin-gated GET/PATCH/DELETE per bucket for the
inbox view, matching submissionsApi in store.js which takes a `bucket`
argument — here that's three explicit route groups instead of one
parameterized bucket, since the shapes genuinely differ (see model file).
"""
from fastapi import APIRouter, Depends, Form, HTTPException, Query, UploadFile, status
from pydantic import ValidationError

from app.core.uploads import read_and_validate_cv
from app.deps import require_admin
from app.models.submission import ContactMessage, JobApplication, QuoteRequest
from app.schemas.submission import (
    ContactMessageIn,
    ContactMessageOut,
    JobApplicationIn,
    JobApplicationOut,
    QuoteRequestIn,
    QuoteRequestOut,
)
from app.services_layer import submission_service

router = APIRouter(tags=["submissions"])


def _contact_out(m: ContactMessage) -> ContactMessageOut:
    return ContactMessageOut(id=str(m.id), **m.model_dump(exclude={"id", "revision_id"}))


def _quote_out(q: QuoteRequest) -> QuoteRequestOut:
    return QuoteRequestOut(id=str(q.id), **q.model_dump(exclude={"id", "revision_id"}))


def _application_out(a: JobApplication) -> JobApplicationOut:
    return JobApplicationOut(id=str(a.id), **a.model_dump(exclude={"id", "revision_id"}))


# --- Contact messages ---

@router.post("/api/contact-messages", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
async def submit_contact_message(data: ContactMessageIn):
    message = await submission_service.create_contact_message(data)
    return _contact_out(message)


@router.get("/api/admin/contact-messages", response_model=list[ContactMessageOut])
async def list_contact_messages(handled: bool | None = Query(default=None), _admin: str = Depends(require_admin)):
    messages = await submission_service.list_contact_messages(handled=handled)
    return [_contact_out(m) for m in messages]


@router.patch("/api/admin/contact-messages/{message_id}", response_model=ContactMessageOut)
async def update_contact_message_handled(
    message_id: str, handled: bool = Query(...), _admin: str = Depends(require_admin)
):
    message = await submission_service.set_contact_handled(message_id, handled)
    return _contact_out(message)


@router.delete("/api/admin/contact-messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact_message(message_id: str, _admin: str = Depends(require_admin)):
    await submission_service.delete_contact_message(message_id)


# --- Quote requests ---

@router.post("/api/quote-requests", response_model=QuoteRequestOut, status_code=status.HTTP_201_CREATED)
async def submit_quote_request(data: QuoteRequestIn):
    quote = await submission_service.create_quote_request(data)
    return _quote_out(quote)


@router.get("/api/admin/quote-requests", response_model=list[QuoteRequestOut])
async def list_quote_requests(handled: bool | None = Query(default=None), _admin: str = Depends(require_admin)):
    quotes = await submission_service.list_quote_requests(handled=handled)
    return [_quote_out(q) for q in quotes]


@router.patch("/api/admin/quote-requests/{quote_id}", response_model=QuoteRequestOut)
async def update_quote_request_handled(
    quote_id: str, handled: bool = Query(...), _admin: str = Depends(require_admin)
):
    quote = await submission_service.set_quote_handled(quote_id, handled)
    return _quote_out(quote)


@router.delete("/api/admin/quote-requests/{quote_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quote_request(quote_id: str, _admin: str = Depends(require_admin)):
    await submission_service.delete_quote_request(quote_id)


# --- Job applications ---
# multipart/form-data: individual Form(...) fields + an UploadFile for the CV,
# rather than binding to JobApplicationIn directly (FastAPI can't bind a
# Pydantic model AND a file from the same multipart body in one parameter).

@router.post("/api/job-applications", response_model=JobApplicationOut, status_code=status.HTTP_201_CREATED)
async def submit_job_application(
    cv: UploadFile,
    full_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    region: str = Form(...),
    message: str = Form(...),
    job_id: str | None = Form(default=None),
):
    try:
        data = JobApplicationIn(
            fullName=full_name, email=email, phone=phone, region=region, message=message, jobId=job_id
        )
    except ValidationError as exc:
        errors = exc.errors(include_context=False, include_url=False)
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=errors)
    cv_bytes = await read_and_validate_cv(cv)
    application = await submission_service.create_job_application(
        data, cv_bytes=cv_bytes, cv_filename=cv.filename or "cv", cv_content_type=cv.content_type or "application/pdf"
    )
    return _application_out(application)


@router.get("/api/admin/job-applications", response_model=list[JobApplicationOut])
async def list_job_applications(handled: bool | None = Query(default=None), _admin: str = Depends(require_admin)):
    applications = await submission_service.list_job_applications(handled=handled)
    return [_application_out(a) for a in applications]


@router.patch("/api/admin/job-applications/{application_id}", response_model=JobApplicationOut)
async def update_job_application_handled(
    application_id: str, handled: bool = Query(...), _admin: str = Depends(require_admin)
):
    application = await submission_service.set_job_application_handled(application_id, handled)
    return _application_out(application)


@router.delete("/api/admin/job-applications/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job_application(application_id: str, _admin: str = Depends(require_admin)):
    await submission_service.delete_job_application(application_id)
