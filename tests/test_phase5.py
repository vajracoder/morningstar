"""
Deterministic Test Suite for Phase 5: Grounded AI Explanation & Negotiation Context Service.
Owned by Kuldeep.
"""
import pytest
from fastapi.testclient import TestClient
from database.session import SessionLocal
from backend.app.main import app
from backend.app.intelligence.ai_explanation_service import ai_explanation_service
from backend.app.seed.seed_data import init_db_and_seed


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db_and_seed()
    yield


@pytest.fixture
def client():
    return TestClient(app)


# ---------------------------------------------------------
# 1. AI Explanation Service Unit Tests
# ---------------------------------------------------------

def test_ai_explanation_demo_rajesh():
    """Verify grounded explanation contains exact verified facts without hallucination."""
    db = SessionLocal()
    try:
        res = ai_explanation_service.generate_decision_explanation(
            db=db,
            crop_lot_id="lot_wheat_nashik_001"
        )

        assert res.crop_lot_id == "lot_wheat_nashik_001"
        assert res.decision == "WAIT"
        assert res.is_grounded_factual is True

        # Factual checks in summary
        assert "100 quintal" in res.farmer_summary
        assert "Grade A" in res.farmer_summary
        assert "Wheat" in res.farmer_summary
        assert "2,480" in res.farmer_summary or "2480" in res.farmer_summary
        assert "2,520" in res.farmer_summary or "2520" in res.farmer_summary
        assert "5,500" in res.headline or "5500" in res.headline

        # Key drivers
        assert len(res.key_drivers) >= 3
        assert any("Price Momentum" in k for k in res.key_drivers)
        assert any("Holding Cost" in k for k in res.key_drivers)

        # Risks & mitigations
        assert len(res.risks_and_mitigations) >= 2
    finally:
        db.close()


def test_negotiation_context_abc_foods():
    """Verify negotiation talking points for ABC Foods with realistic counter-offer."""
    db = SessionLocal()
    try:
        res = ai_explanation_service.generate_negotiation_context(
            db=db,
            crop_lot_id="lot_wheat_nashik_001",
            buyer_id="buyer_001"
        )

        assert res.crop_lot_id == "lot_wheat_nashik_001"
        assert res.buyer_id == "buyer_001"
        assert "ABC Foods" in res.buyer_name
        assert res.current_market_price == 2480.0
        assert res.offered_price == 2570.0
        assert res.suggested_counter_offer == 2600.0
        assert res.walkaway_price > 2480.0
        assert "100 quintals" in res.opening_statement
        assert "Grade A" in res.opening_statement

        # Leverage points
        assert len(res.leverage_points) >= 3
        assert any("Grade A" in lp for lp in res.leverage_points)
        assert any("7-day forecast" in lp for lp in res.leverage_points)

        # Counter arguments
        assert len(res.counter_arguments) >= 2
    finally:
        db.close()


# ---------------------------------------------------------
# 2. API Endpoints Tests
# ---------------------------------------------------------

def test_api_get_ai_explanation(client):
    """Test GET /api/crop-lots/{id}/ai-explanation endpoint."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/ai-explanation")
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "WAIT"
    assert "Hold your Wheat" in data["headline"]
    assert data["is_grounded_factual"] is True


def test_api_get_negotiation_context(client):
    """Test GET /api/crop-lots/{id}/negotiation-context endpoint."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/negotiation-context?buyer_id=buyer_001")
    assert response.status_code == 200
    data = response.json()
    assert data["buyer_id"] == "buyer_001"
    assert data["suggested_counter_offer"] == 2600.0
    assert len(data["leverage_points"]) >= 3


def test_api_ai_explanation_not_found(client):
    """Test GET /api/crop-lots/{id}/ai-explanation returns 404 for unknown lot."""
    response = client.get("/api/crop-lots/unknown_lot_999/ai-explanation")
    assert response.status_code == 404


def test_api_negotiation_context_not_found(client):
    """Test GET /api/crop-lots/{id}/negotiation-context returns 404 for unknown lot."""
    response = client.get("/api/crop-lots/unknown_lot_999/negotiation-context")
    assert response.status_code == 404
