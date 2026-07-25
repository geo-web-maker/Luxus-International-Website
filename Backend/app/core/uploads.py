"""
File upload validation. Server-side enforcement of size/type limits —
JobApplicationForm.jsx has a client-side 10MB cap and a comment noting the
old WP Job Manager 2GB default isn't worth carrying over, but the client
check is only a UX nicety; this is the real gate.
"""
from fastapi import HTTPException, UploadFile, status

from app.config import settings

ALLOWED_CV_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

ALLOWED_IMAGE_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}


async def read_and_validate_cv(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_CV_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="CV must be a PDF or Word document",
        )

    content = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"CV must be under {settings.max_upload_mb}MB",
        )

    return content


async def read_and_validate_image(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Image must be JPEG, PNG, WebP, or GIF",
        )

    content = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image must be under {settings.max_upload_mb}MB",
        )

    return content
