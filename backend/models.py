from pydantic import BaseModel, EmailStr
from typing import Optional


class HealthResponse(BaseModel):
    status: str


class WaitlistRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    interest: Optional[str] = None


class WaitlistResponse(BaseModel):
    success: bool
    message: str
    position: int


class WaitlistCount(BaseModel):
    count: int


class SlideRequest(BaseModel):
    transcript: str

    @property
    def is_valid(self):
        return bool(self.transcript and self.transcript.strip())


class SlideResponse(BaseModel):
    title: str
    points: list[str]
    category: str
    icon: str
