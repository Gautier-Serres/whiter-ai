import os
import sqlite3
from dotenv import load_dotenv
load_dotenv()
import time
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from backend.models import WaitlistRequest, WaitlistResponse, WaitlistCount, SlideRequest, SlideResponse, LookupResponse
from backend.slide_engine import generate_slide, lookup_term

# ─── Config ───────────────────────────────────────────────────────────────────

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "waitlist.db")
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "test-secret-key")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# ─── Rate limiter ─────────────────────────────────────────────────────────────

_rate_limit: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 5
RATE_WINDOW = 60

# ─── Session store (in-memory) ────────────────────────────────────────────────

import secrets
_sessions: dict[str, dict] = {}  # { session_id: { cards: [], subject: str, context: str } }


def new_session_id() -> str:
    return secrets.token_urlsafe(6)


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


@app.post("/api/session/new")
async def create_session():
    sid = new_session_id()
    _sessions[sid] = {"cards": [], "subject": "", "context": ""}
    return {"session_id": sid}


@app.get("/api/session/{session_id}/cards")
async def get_session_cards(session_id: str):
    session = _sessions.get(session_id)
    return session["cards"] if session else []


@app.post("/api/generate-slide", response_model=SlideResponse)
async def generate_slide_endpoint(payload: SlideRequest):
    if not payload.transcript or not payload.transcript.strip():
        raise HTTPException(status_code=422, detail="transcript cannot be empty")

    result = generate_slide(
        payload.transcript,
        context=payload.context,
        subject=payload.subject,
    )

    if payload.session_id and payload.session_id in _sessions:
        session = _sessions[payload.session_id]
        session["cards"].append(result)
        # Store subject/context for summary endpoint
        if payload.subject:
            session["subject"] = payload.subject
        if payload.context:
            session["context"] = payload.context

    return result


@app.get("/api/lookup", response_model=LookupResponse)
async def lookup(q: str):
    if not q or len(q.strip()) < 2:
        raise HTTPException(status_code=422, detail="query too short")
    if len(q) > 120:
        raise HTTPException(status_code=422, detail="query too long")
    definition = lookup_term(q.strip())
    return LookupResponse(term=q.strip(), definition=definition)


@app.get("/api/session/{session_id}/summary", response_class=HTMLResponse)
async def get_session_summary(session_id: str):
    session = _sessions.get(session_id)
    if not session:
        return HTMLResponse("<html><body>Session not found.</body></html>", status_code=404)
    cards = session["cards"]
    subject = session.get("subject", "")
    html = _build_summary_html(cards, subject, session_id)
    return HTMLResponse(content=html)


def _build_summary_html(cards: list, subject: str, session_id: str) -> str:
    from datetime import datetime
    date_str = datetime.now().strftime("%B %d, %Y")

    COLORS = {
        "Finance":    {"bg": "#d1fae5", "text": "#065f46"},
        "Product":    {"bg": "#dbeafe", "text": "#1e40af"},
        "Team":       {"bg": "#ede9fe", "text": "#4c1d95"},
        "Strategy":   {"bg": "#fef3c7", "text": "#92400e"},
        "Vision":     {"bg": "#fce7f3", "text": "#9d174d"},
        "Operations": {"bg": "#f1f5f9", "text": "#334155"},
    }

    slides_html = ""
    for card in cards:
        cat = card.get("category", "Strategy")
        col = COLORS.get(cat, COLORS["Strategy"])
        points_html = "".join(f"<li>{p}</li>" for p in card.get("points", []))
        slides_html += f"""
        <div class="card">
          <span class="badge" style="background:{col['bg']};color:{col['text']}">{card.get('sub_category') or cat}</span>
          <h2>{card.get('title', '')}</h2>
          <ul>{points_html}</ul>
        </div>"""

    title_line = f"<h1>{subject}</h1>" if subject else "<h1>Session Summary</h1>"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Whiter.ai — {subject or 'Session Summary'}</title>
<style>
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
         background: #f8fafc; color: #0f172a; padding: 24px; max-width: 680px; margin: 0 auto; }}
  header {{ margin-bottom: 28px; }}
  {title_line.replace('<h1>', 'h1 {').replace('</h1>', '}')}
  h1 {{ font-size: 1.6rem; font-weight: 800; margin: 0 0 4px; }}
  .meta {{ color: #64748b; font-size: .85rem; }}
  .card {{ background: white; border: 1px solid #e2e8f0; border-radius: 12px;
           padding: 18px 20px; margin-bottom: 14px; page-break-inside: avoid; }}
  .badge {{ display: inline-block; font-size: .68rem; font-weight: 700;
            padding: 3px 10px; border-radius: 999px; text-transform: uppercase;
            letter-spacing: .06em; margin-bottom: 10px; }}
  h2 {{ font-size: 1.05rem; font-weight: 700; margin: 0 0 10px; }}
  ul {{ margin: 0; padding-left: 18px; color: #475569; }}
  li {{ font-size: .875rem; margin-bottom: 4px; line-height: 1.5; }}
  .footer {{ margin-top: 32px; text-align: center; color: #94a3b8; font-size: .75rem; }}
  .brand {{ font-weight: 800; color: #6366f1; }}
  @media print {{ body {{ padding: 12px; }} }}
</style>
</head>
<body>
<header>
  {title_line}
  <div class="meta">{date_str} &nbsp;·&nbsp; {len(cards)} slide{'s' if len(cards) != 1 else ''} &nbsp;·&nbsp; Generated by <span class="brand">Whiter.ai</span></div>
</header>
{slides_html}
<div class="footer">Generated with <span class="brand">Whiter.ai</span> — the whiteboard that writes itself.</div>
</body>
</html>"""


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
