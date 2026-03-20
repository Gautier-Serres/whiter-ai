import pytest
from httpx import AsyncClient, ASGITransport


@pytest.fixture
async def client(tmp_path):
    """Async test client with an isolated DB and clean rate limiter per test."""
    import backend.server as server_module

    # Isolate DB per test
    server_module.DB_PATH = str(tmp_path / "test_waitlist.db")

    # Reset rate limiter so tests don't bleed into each other
    server_module._rate_limit.clear()

    server_module.init_db()

    transport = ASGITransport(app=server_module.app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
