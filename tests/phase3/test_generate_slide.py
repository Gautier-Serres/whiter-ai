"""Phase 3: MVP — Generate Slide Tests"""


class TestGenerateSlide:
    async def test_returns_200(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "Our Q4 revenue target is 2 million euros"},
        )
        assert response.status_code == 200

    async def test_returns_title(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "We need to launch the mobile app in October"},
        )
        data = response.json()
        assert "title" in data
        assert isinstance(data["title"], str)
        assert len(data["title"]) > 0

    async def test_returns_points(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "Sarah will lead the Berlin office and we need to hire two engineers"},
        )
        data = response.json()
        assert "points" in data
        assert isinstance(data["points"], list)
        assert len(data["points"]) >= 1

    async def test_returns_category(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "Our Q4 revenue target is 2 million euros"},
        )
        data = response.json()
        assert "category" in data
        assert data["category"] in ["Finance", "Product", "Team", "Strategy", "Vision", "Operations"]

    async def test_finance_category_detected(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "Revenue is up 40 percent this quarter and profit margins look strong"},
        )
        assert response.json()["category"] == "Finance"

    async def test_product_category_detected(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "We will launch the new feature and release the API next month"},
        )
        assert response.json()["category"] == "Product"

    async def test_team_category_detected(self, client):
        response = await client.post(
            "/api/generate-slide",
            json={"transcript": "We need to hire three engineers and promote the team lead"},
        )
        assert response.json()["category"] == "Team"

    async def test_missing_transcript_returns_422(self, client):
        response = await client.post("/api/generate-slide", json={})
        assert response.status_code == 422

    async def test_empty_transcript_returns_422(self, client):
        response = await client.post("/api/generate-slide", json={"transcript": ""})
        assert response.status_code == 422
