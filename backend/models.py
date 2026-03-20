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
    session_id: Optional[str] = None
    context: Optional[str] = None    # speaker pre-briefing notes
    subject: Optional[str] = None    # talk topic / subject
    template: Optional[str] = None   # visual theme id

    @property
    def is_valid(self):
        return bool(self.transcript and self.transcript.strip())


class SlideResponse(BaseModel):
    title: str
    points: list[str]
    category: str
    sub_category: str
    icon: str
    layout: str
    topic_key: str


class LookupResponse(BaseModel):
    term: str
    definition: str
