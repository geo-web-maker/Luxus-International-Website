"""
Business logic for the site content singleton. `get_or_create_default`
means callers (router, seed script) never have to special-case "does the
document exist yet" — the default mirrors siteContent.js's real values so a
fresh DB still renders a working site before an admin edits anything.
"""
from app.models.content import Company, NavLink, SiteContent
from app.schemas.content import CompanyUpdate, CoverageTagsUpdate

_DEFAULT_COMPANY = Company(
    name="Luxuz Consult International Ltd",
    short_name="Luxuz Consult",
    phone="+256-775-508801",
    email="contact@luxuzconsult.com",
    accreditation_partner="MQA International Certification Body",
    tagline="Simplifying Compliance, Amplifying Excellence",
)

_DEFAULT_NAV_LINKS = [
    NavLink(label="Services", path="/services"),
    NavLink(label="About", path="/about"),
    NavLink(label="Career", path="/career"),
    NavLink(label="Contact", path="/contact"),
]

_DEFAULT_COVERAGE_TAGS = [
    "ISO 9001:2015",
    "ISO 14001:2015",
    "ISO 45001:2018",
    "ISO 22000:2018",
    "ISO/IEC 27001:2022",
]


async def get_or_create_default() -> SiteContent:
    content = await SiteContent.find_one({})
    if content is None:
        content = SiteContent(
            company=_DEFAULT_COMPANY,
            nav_links=_DEFAULT_NAV_LINKS,
            iso_coverage_tags=_DEFAULT_COVERAGE_TAGS,
        )
        await content.insert()
    return content


async def update_company(data: CompanyUpdate) -> SiteContent:
    content = await get_or_create_default()
    set_fields = data.model_dump(exclude_unset=True).keys()
    for field in set_fields:
        setattr(content.company, field, getattr(data, field))
    await content.save()
    return content


async def set_coverage_tags(data: CoverageTagsUpdate) -> SiteContent:
    content = await get_or_create_default()
    content.iso_coverage_tags = data.iso_coverage_tags
    await content.save()
    return content
