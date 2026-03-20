from pydantic import BaseModel
from typing import Optional


class HealthResponse(BaseModel):
    status: str


class ContactRequest(BaseModel):
    name: str
    company: str
    email: str
    phone: Optional[str] = None
    message: Optional[str] = None


class ContactResponse(BaseModel):
    status: str
    message: str
