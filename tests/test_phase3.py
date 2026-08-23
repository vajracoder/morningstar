"""
Deterministic Test Suite for Phase 3: Net Realisation & Sell/Wait Decision Engine.
Owned by Kuldeep.
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.intelligence.net_realisation_service import net_realisation_calculator
from backend.app.intelligence.sell_decision_service import sell_decision_engine
from backend.app.seed.seed_data import init_db_and_seed


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db_and_seed()
    yield


@pytest.fixture
def client():
    return TestClient(app)


# ---------------------------------------------------------
# 1. Net Realisation Calculator Unit Tests
# ---------------------------------------------------------

def test_net_realisation_demo_rajesh_benchmark():
    """Verify demo deal matches SIH spec: 100q @ ₹2600/q -> Gross ₹2,60,000, Deductions ₹10,600, Net ₹2,49,400."""
    res = net_realisation_calculator.calculate(
        crop_lot_id="lot_wheat_nashik_001",
        quantity=100.0,
        offered_price_per_q=2600.0,
        storage_days=3,
        spoilage_risk="LOW",
    )

    assert res.gross_revenue == 260000.0
    assert res.deductions.transport == 6800.0
    assert res.deductions.storage == 1000.0
    assert res.deductions.commission == 2000.0
    assert res.deductions.spoilage == 800.0
    assert res.total_deductions == 10600.0
    assert res.net_realisation == 249400.0
    assert res.net_price_per_q == 2494.0


def test_net_realisation_dynamic_parameters():
    """Verify calculator adapts to custom quantity and distance."""
    res = net_realisation_calculator.calculate(
        quantity=50.0,
        offered_price_per_q=2500.0,
        distance_km=40.0,
        storage_days=5,
        spoilage_risk="MEDIUM",
    )
    assert res.gross_revenue == 125000.0
    assert res.deductions.transport > 0.0
    assert res.deductions.storage > 0.0
    assert res.net_realisation < res.gross_revenue
    assert res.net_price_per_q < 2500.0


# ---------------------------------------------------------
# 2. Sell / Wait Decision Engine Unit Tests
# ---------------------------------------------------------

def test_sell_decision_demo_rajesh_wait():
    """Verify demo farmer Rajesh receives WAIT recommendation for 3 days."""
    res = sell_decision_engine.evaluate_decision(
        crop_lot_id="lot_wheat_nashik_001",
        crop="Wheat",
        quantity=100.0,
        current_price=2480.0,
        financial_urgency="MEDIUM",
        spoilage_risk="LOW",
        storage_days=3,
    )
    assert res.decision == "WAIT"
    assert res.recommended_days == 3
    assert res.expected_gain == 5500.0
    assert res.confidence == 0.78
    assert res.risk == "MEDIUM"
    assert res.projected_price == 2520.0
    assert "higher than estimated storage" in res.reason


def test_sell_decision_high_urgency_override():
    """Verify high financial urgency overrides market gains and triggers immediate SELL_NOW."""
    res = sell_decision_engine.evaluate_decision(
        crop_lot_id="lot_wheat_nashik_001",
        crop="Wheat",
        quantity=100.0,
        current_price=2480.0,
        financial_urgency="HIGH",
        spoilage_risk="LOW",
    )
    assert res.decision == "SELL_NOW"
    assert res.recommended_days == 0
    assert "High financial urgency" in res.reason


def test_sell_decision_high_spoilage_override():
    """Verify high spoilage risk forces SELL_NOW to prevent total loss."""
    res = sell_decision_engine.evaluate_decision(
        crop_lot_id="lot_wheat_nashik_001",
        crop="Wheat",
        quantity=100.0,
        current_price=2480.0,
        financial_urgency="LOW",
        spoilage_risk="HIGH",
    )
    assert res.decision == "SELL_NOW"
    assert res.recommended_days == 0
    assert "spoilage risk" in res.reason.lower()


# ---------------------------------------------------------
# 3. API Endpoints Integration Tests
# ---------------------------------------------------------

def test_api_get_lot_recommendation(client):
    """Test GET /api/crop-lots/{id}/recommendation endpoint."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/recommendation")
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "WAIT"
    assert data["recommended_days"] == 3
    assert data["expected_gain"] == 5500.0
    assert "net_benefit_breakdown" in data


def test_api_get_lot_net_realisation(client):
    """Test GET /api/crop-lots/{id}/net-realisation endpoint."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/net-realisation?offered_price=2600")
    assert response.status_code == 200
    data = response.json()
    assert data["gross_revenue"] == 260000.0
    assert data["net_realisation"] == 249400.0
    assert data["total_deductions"] == 10600.0


def test_api_post_custom_net_realisation(client):
    """Test POST /api/net-realisation/calculate endpoint for arbitrary trade calculation."""
    payload = {
        "quantity": 100.0,
        "offered_price_per_q": 2600.0,
        "distance_km": 15.0,
        "storage_days": 3,
        "quality_grade": "Grade A",
        "spoilage_risk": "LOW"
    }
    response = client.post("/api/net-realisation/calculate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["net_realisation"] == 249400.0


def test_api_recommendation_not_found(client):
    """Test GET /api/crop-lots/{id}/recommendation returns 404 for unknown lot."""
    response = client.get("/api/crop-lots/unknown_999/recommendation")
    assert response.status_code == 404


def test_api_net_realisation_not_found(client):
    """Test GET /api/crop-lots/{id}/net-realisation returns 404 for unknown lot."""
    response = client.get("/api/crop-lots/unknown_999/net-realisation")
    assert response.status_code == 404
