"""Phase 2: Waiting List — API Tests"""

import pytest
import os


class TestWaitlistSignup:
    async def test_signup_returns_201(self, client):
        response = await client.post(
            "/api/waitlist",
            json={"email": "test@example.com", "name": "Test User", "interest": "Real-time slides"},
        )
        assert response.status_code == 201

    async def test_signup_returns_success_true(self, client):
        response = await client.post(
            "/api/waitlist",
            json={"email": "success@example.com"},
        )
        data = response.json()
        assert data["success"] is True

    async def test_signup_returns_position(self, client):
        response = await client.post(
            "/api/waitlist",
            json={"email": "position@example.com"},
        )
        data = response.json()
        assert "position" in data
        assert isinstance(data["position"], int)
        assert data["position"] >= 1

    async def test_duplicate_email_returns_409(self, client):
        await client.post("/api/waitlist", json={"email": "dup@example.com"})
        response = await client.post("/api/waitlist", json={"email": "dup@example.com"})
        assert response.status_code == 409

    async def test_duplicate_returns_success_false(self, client):
        await client.post("/api/waitlist", json={"email": "dup2@example.com"})
        response = await client.post("/api/waitlist", json={"email": "dup2@example.com"})
        data = response.json()
        assert data["success"] is False

    async def test_invalid_email_returns_422(self, client):
        response = await client.post("/api/waitlist", json={"email": "not-an-email"})
        assert response.status_code == 422

    async def test_missing_email_returns_422(self, client):
        response = await client.post("/api/waitlist", json={"name": "No Email"})
        assert response.status_code == 422


class TestWaitlistCount:
    async def test_count_returns_200(self, client):
        response = await client.get("/api/waitlist/count")
        assert response.status_code == 200

    async def test_count_returns_integer(self, client):
        response = await client.get("/api/waitlist/count")
        data = response.json()
        assert "count" in data
        assert isinstance(data["count"], int)

    async def test_count_increments_after_signup(self, client):
        before = (await client.get("/api/waitlist/count")).json()["count"]
        await client.post("/api/waitlist", json={"email": "counter@example.com"})
        after = (await client.get("/api/waitlist/count")).json()["count"]
        assert after == before + 1


class TestWaitlistExport:
    async def test_export_without_key_returns_401(self, client):
        response = await client.get("/api/waitlist/export")
        assert response.status_code == 401

    async def test_export_with_wrong_key_returns_401(self, client):
        response = await client.get("/api/waitlist/export", headers={"X-API-Key": "wrong"})
        assert response.status_code == 401

    async def test_export_with_correct_key_returns_200(self, client):
        api_key = os.environ.get("ADMIN_API_KEY", "test-secret-key")
        response = await client.get("/api/waitlist/export", headers={"X-API-Key": api_key})
        assert response.status_code == 200

    async def test_export_returns_list(self, client):
        api_key = os.environ.get("ADMIN_API_KEY", "test-secret-key")
        response = await client.get("/api/waitlist/export", headers={"X-API-Key": api_key})
        data = response.json()
        assert isinstance(data, list)
