"""
Deterministic Test Suite for Phase 4: 7-Factor Buyer Matching & Ranking Engine.
Owned by Kuldeep.
"""
import pytest
from fastapi.testclient import TestClient
from database.session import SessionLocal
from backend.app.main import app
from backend.app.intelligence.buyer_matching_service import buyer_matching_service
from backend.app.seed.seed_data import init_db_and_seed


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db_and_seed()
    yield


@pytest.fixture
def client():
    return TestClient(app)


# ---------------------------------------------------------
# 1. 7-Factor Buyer Matching Service Tests
# ---------------------------------------------------------

def test_buyer_matching_demo_rajesh():
    """Verify demo farmer Rajesh matches ABC Foods as #1 ranked buyer."""
    db = SessionLocal()
    try:
        matches = buyer_matching_service.match_buyers_for_lot(
            db=db,
            crop="Wheat",
            quantity=100.0,
            quality_grade="Grade A",
            location="Nashik",
            current_market_price=2480.0,
        )

        assert len(matches) >= 3
        top_buyer = matches[0]

        # Top match should be ABC Foods (buyer_001)
        assert top_buyer.buyer_id == "buyer_001"
        assert top_buyer.company_name == "ABC Foods Pvt Ltd"
        assert top_buyer.match_score == 0.94
        assert top_buyer.offer_price == 2570.0
        assert top_buyer.estimated_net_realisation == 253000.0
        assert top_buyer.risk == "LOW"

        # Check explainable reasons
        assert len(top_buyer.reasons) >= 2
        assert any("Grade A" in r for r in top_buyer.reasons)
        assert any("payment history" in r for r in top_buyer.reasons)

        # Check 7-factor breakdown
        fb = top_buyer.factor_breakdown
        assert fb.quality_score >= 0.95
        assert fb.quantity_score >= 0.95
        assert fb.reliability_score >= 0.95
    finally:
        db.close()


def test_buyer_matching_fallback_when_no_db():
    """Verify engine gracefully falls back to mock buyers if database session is None."""
    matches = buyer_matching_service.match_buyers_for_lot(
        db=None,
        crop="Wheat",
        quantity=100.0,
        quality_grade="Grade A",
        location="Nashik",
    )
    assert len(matches) == 3
    assert matches[0].buyer_id == "buyer_001"
    assert matches[0].match_score == 0.94


def test_buyer_matching_grade_penalty():
    """Verify lower quality grade (Grade C) receives lower match scores from premium buyers."""
    db = SessionLocal()
    try:
        matches = buyer_matching_service.match_buyers_for_lot(
            db=db,
            crop="Wheat",
            quantity=100.0,
            quality_grade="Grade C",
            location="Nashik",
        )
        # ABC Foods only accepts Grade A, so match score should decrease
        abc_match = next((m for m in matches if m.buyer_id == "buyer_001"), None)
        assert abc_match is not None
        assert abc_match.factor_breakdown.quality_score < 0.70
    finally:
        db.close()


# ---------------------------------------------------------
# 2. API Endpoints Tests
# ---------------------------------------------------------

def test_api_get_lot_buyers(client):
    """Test GET /api/crop-lots/{id}/buyers returns 200 with ranked buyers."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/buyers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3

    top = data[0]
    assert top["buyer_id"] == "buyer_001"
    assert top["match_score"] == 0.94
    assert top["offer_price"] == 2570.0
    assert "factor_breakdown" in top


def test_api_post_custom_buyer_match(client):
    """Test POST /api/buyer-matches returns ranked matches on demand."""
    payload = {
        "crop": "Wheat",
        "quantity": 100.0,
        "quality_grade": "Grade A",
        "location": "Nashik",
        "current_market_price": 2480.0,
    }
    response = client.post("/api/buyer-matches", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3
    assert data[0]["buyer_id"] == "buyer_001"


def test_api_get_lot_buyers_not_found(client):
    """Test GET /api/crop-lots/{id}/buyers returns 404 for non-existent lot."""
    response = client.get("/api/crop-lots/unknown_lot_999/buyers")
    assert response.status_code == 404
