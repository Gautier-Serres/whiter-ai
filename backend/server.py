import os
import sqlite3
import time
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from backend.models import WaitlistRequest, WaitlistResponse, WaitlistCount, SlideRequest, SlideResponse
from backend.slide_engine import generate_slide

# ─── Config ──────────────────────────────────────────────────────────────────

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "waitlist.db")
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "test-secret-key")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# ─── Rate limiter ─────────────────────────────────────────────────────────────

_rate_limit: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 5
RATE_WINDOW = 60


def check_rate_limit(ip: str) -> bool:
    now = time.time()
    timestamps = [t for t in _rate_limit[ip] if now - t < RATE_WINDOW]
    _rate_limit[ip] = timestamps
    if len(timestamps) >= RATE_LIMIT:
        return False
    _rate_limit[ip].append(now)
    return True


# ─── Database ─────────────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS signups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                interest TEXT,
                signed_up_at TEXT DEFAULT (datetime('now'))
            )
        """)


# ─── App ──────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/waitlist", status_code=201)
async def join_waitlist(payload: WaitlistRequest, request: Request):
    ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(ip):
        raise HTTPException(status_code=429, detail="Too many requests. Try again in a minute.")

    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO signups (email, name, interest) VALUES (?, ?, ?)",
                (payload.email, payload.name, payload.interest),
            )
            position = conn.execute("SELECT COUNT(*) FROM signups").fetchone()[0]
        return WaitlistResponse(success=True, message="You're on the list!", position=position)
    except sqlite3.IntegrityError:
        return JSONResponse(
            status_code=409,
            content={"success": False, "message": "You're already on the list!", "position": 0},
        )


@app.get("/api/waitlist/count")
async def waitlist_count():
    with get_db() as conn:
        count = conn.execute("SELECT COUNT(*) FROM signups").fetchone()[0]
    return WaitlistCount(count=count)


@app.post("/api/generate-slide", response_model=SlideResponse)
async def generate_slide_endpoint(payload: SlideRequest):
    if not payload.transcript or not payload.transcript.strip():
        raise HTTPException(status_code=422, detail="transcript cannot be empty")
    return generate_slide(payload.transcript)


@app.get("/api/waitlist/export")
async def waitlist_export(x_api_key: str = Header(default=None)):
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    with get_db() as conn:
        rows = conn.execute(
            "SELECT name, email, interest, signed_up_at FROM signups ORDER BY id"
        ).fetchall()
    return [dict(row) for row in rows]


# ─── Static files ─────────────────────────────────────────────────────────────

dist_path = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    index_path = os.path.join(os.path.dirname(__file__), "..", "index.html")

    @app.get("/")
    async def serve_index():
        return FileResponse(index_path)
