from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()


@app.get("/api/health")
async def health():
    return {"status": "ok"}


# Serve built frontend static files
dist_path = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.exists(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        return FileResponse(os.path.join(dist_path, "index.html"))
else:
    # Dev fallback: serve index.html from root
    index_path = os.path.join(os.path.dirname(__file__), "..", "index.html")

    @app.get("/")
    async def serve_index():
        return FileResponse(index_path)
