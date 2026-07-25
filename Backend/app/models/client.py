"""
Client (logo cloud) document. A flat, admin-managed list of client/partner
logos shown in the "Our clients" marquee on the homepage — deliberately
simple (no children, no benefits) since all it needs is a name, a logo
image, and a display order.
"""
from beanie import Document
from pydantic import BaseModel, Field

from app.models.common import ImageInfo


class Client(Document):
    name: str
    image: ImageInfo = Field(default_factory=ImageInfo)
    display_order: int = 0
    active: bool = True

    class Settings:
        name = "clients"
        indexes = ["display_order"]
