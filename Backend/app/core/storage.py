"""
Cloudflare R2 storage abstraction. R2 is S3-compatible, so this uses boto3's
S3 client pointed at the R2 endpoint. Kept as one module so if storage ever
moves (different provider, different bucket layout), this is the only file
that changes — routers/services_layer only ever call upload_file/get_url/
delete_file, never boto3 directly.
"""
import uuid
from datetime import datetime

import boto3
from botocore.client import Config

from app.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            endpoint_url=settings.r2_endpoint_url,
            aws_access_key_id=settings.r2_access_key_id,
            aws_secret_access_key=settings.r2_secret_access_key,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
    return _client


def _build_key(prefix: str, original_filename: str) -> str:
    """e.g. 'job-applications/2026/07/23/f3a1c2.pdf' — date-partitioned so a
    bucket listing stays browsable, uuid-suffixed so filenames never collide."""
    ext = original_filename.rsplit(".", 1)[-1].lower() if "." in original_filename else "bin"
    date_path = datetime.utcnow().strftime("%Y/%m/%d")
    unique = uuid.uuid4().hex[:12]
    return f"{prefix}/{date_path}/{unique}.{ext}"


async def upload_file(content: bytes, original_filename: str, content_type: str, prefix: str) -> str:
    """Uploads bytes to R2, returns the public URL. `prefix` namespaces the
    object key (e.g. 'job-applications', 'service-images')."""
    key = _build_key(prefix, original_filename)
    client = _get_client()
    client.put_object(
        Bucket=settings.r2_bucket_name,
        Key=key,
        Body=content,
        ContentType=content_type,
    )
    return get_url(key)


def get_url(key: str) -> str:
    base = settings.r2_public_base_url.rstrip("/")
    return f"{base}/{key}"


async def delete_file(key_or_url: str) -> None:
    """Accepts either a bare object key or a full public URL (strips the
    base URL if present) so callers can pass whichever they have on hand."""
    key = key_or_url
    base = settings.r2_public_base_url.rstrip("/")
    if key_or_url.startswith(base):
        key = key_or_url[len(base):].lstrip("/")

    client = _get_client()
    client.delete_object(Bucket=settings.r2_bucket_name, Key=key)
