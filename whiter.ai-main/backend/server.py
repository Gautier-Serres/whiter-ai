from fastapi import FastAPI
from fastapi.responses import FileResponse

from backend.models import HealthResponse, ContactRequest, ContactResponse

app = FastAPI()


@app.get("/api/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok")


@app.post("/api/contact", response_model=ContactResponse)
async def contact(request: ContactRequest):
    print(f"Demo request from {request.name} ({request.email}) at {request.company}")
    return ContactResponse(status="ok", message="Thank you, we'll be in touch within 24 hours.")


@app.get("/")
async def root():
    return FileResponse("index.html", media_type="text/html")
