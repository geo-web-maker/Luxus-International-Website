"""
Generic image upload endpoint. Unlike services/clients image uploads
(which save straight onto a specific document field), content-grid item
images live at an arbitrary array position inside a section the admin is
still editing client-side — there's no document/field to attach to yet.
So this just uploads to R2 and hands back a URL; the admin UI drops that
URL into the right item locally, and the whole sections array is saved via
the normal PATCH afterwards.
"""
from fastapi import APIRouter, Depends, File, UploadFile

from app.core import storage
from app.core.uploads import read_and_validate_image
from app.deps import require_admin

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


@router.post("/image")
async def upload_image(file: UploadFile = File(...), _admin: str = Depends(require_admin)) -> dict:
    content = await read_and_validate_image(file)
    url = await storage.upload_file(
        content=content,
        original_filename=file.filename or "image",
        content_type=file.content_type,
        prefix="content-images",
    )
    return {"url": url}
