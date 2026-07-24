"""
Site content router. Single GET for the whole singleton (matches
contentApi.get() in store.js), scoped PATCHes per editable section so an
admin editing the tagline can't accidentally clobber the nav links in the
same request.
"""
from fastapi import APIRouter, Depends

from app.deps import require_admin
from app.schemas.content import CompanyUpdate, CoverageTagsUpdate, SiteContentOut
from app.services_layer import content_service

router = APIRouter(prefix="/api/content", tags=["content"])


@router.get("", response_model=SiteContentOut)
async def get_content():
    content = await content_service.get_or_create_default()
    return SiteContentOut(**content.model_dump())


@router.patch("/company", response_model=SiteContentOut)
async def update_company(data: CompanyUpdate, _admin: str = Depends(require_admin)):
    content = await content_service.update_company(data)
    return SiteContentOut(**content.model_dump())


@router.patch("/coverage-tags", response_model=SiteContentOut)
async def set_coverage_tags(data: CoverageTagsUpdate, _admin: str = Depends(require_admin)):
    content = await content_service.set_coverage_tags(data)
    return SiteContentOut(**content.model_dump())
