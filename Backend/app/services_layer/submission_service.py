"""
Business logic for the three submission buckets. Kept out of the router so
the multipart/file-handling concern (job applications) and the plain-JSON
concern (contact/quote) are both testable without spinning up FastAPI's
request-parsing machinery.
"""
from fastapi import HTTPException, status

from app.core import storage
from app.models.submission import ContactMessage, JobApplication, QuoteRequest
from app.schemas.submission import ContactMessageIn, JobApplicationIn, QuoteRequestIn

# --- Contact ---

async def create_contact_message(data: ContactMessageIn) -> ContactMessage:
    message = ContactMessage(**data.model_dump())
    await message.insert()
    return message


async def list_contact_messages(handled: bool | None = None) -> list[ContactMessage]:
    if handled is None:
        return await ContactMessage.find_all().sort("-created_at").to_list()
    return await ContactMessage.find(ContactMessage.handled == handled).sort("-created_at").to_list()


async def set_contact_handled(message_id: str, handled: bool) -> ContactMessage:
    message = await ContactMessage.get(message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    message.handled = handled
    await message.save()
    return message


async def delete_contact_message(message_id: str) -> None:
    message = await ContactMessage.get(message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    await message.delete()


# --- Quote requests ---

async def create_quote_request(data: QuoteRequestIn) -> QuoteRequest:
    quote = QuoteRequest(**data.model_dump())
    await quote.insert()
    return quote


async def list_quote_requests(handled: bool | None = None) -> list[QuoteRequest]:
    if handled is None:
        return await QuoteRequest.find_all().sort("-created_at").to_list()
    return await QuoteRequest.find(QuoteRequest.handled == handled).sort("-created_at").to_list()


async def set_quote_handled(quote_id: str, handled: bool) -> QuoteRequest:
    quote = await QuoteRequest.get(quote_id)
    if quote is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote request not found")
    quote.handled = handled
    await quote.save()
    return quote


async def delete_quote_request(quote_id: str) -> None:
    quote = await QuoteRequest.get(quote_id)
    if quote is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote request not found")
    await quote.delete()


# --- Job applications ---

async def create_job_application(
    data: JobApplicationIn, cv_bytes: bytes, cv_filename: str, cv_content_type: str
) -> JobApplication:
    cv_url = await storage.upload_file(
        content=cv_bytes,
        original_filename=cv_filename,
        content_type=cv_content_type,
        prefix="job-applications",
    )
    application = JobApplication(
        **data.model_dump(),
        cv_url=cv_url,
        cv_filename=cv_filename,
    )
    await application.insert()
    return application


async def list_job_applications(handled: bool | None = None) -> list[JobApplication]:
    if handled is None:
        return await JobApplication.find_all().sort("-created_at").to_list()
    return await JobApplication.find(JobApplication.handled == handled).sort("-created_at").to_list()


async def set_job_application_handled(application_id: str, handled: bool) -> JobApplication:
    application = await JobApplication.get(application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job application not found")
    application.handled = handled
    await application.save()
    return application


async def delete_job_application(application_id: str) -> None:
    application = await JobApplication.get(application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job application not found")
    # best-effort cleanup of the R2 object; a failed delete here shouldn't
    # block deleting the DB record, so this is intentionally not awaited-and-raised
    try:
        await storage.delete_file(application.cv_url)
    except Exception:
        pass
    await application.delete()
