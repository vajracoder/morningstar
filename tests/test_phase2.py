"""
Deterministic Test Suite for Phase 2: Price Forecasting Engine.
Owned by Kuldeep.
"""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.forecasting.service import (
    DeterministicForecastProvider,
    MLTrendForecastProvider,
    ForecastingService,
    forecasting_service,
)
from backend.app.seed.seed_data import init_db_and_seed


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    init_db_and_seed()
    yield


@pytest.fixture
def client():
    return TestClient(app)


# ---------------------------------------------------------
# 1. Deterministic Forecast Provider Tests
# ---------------------------------------------------------

def test_deterministic_forecast_demo_farmer():
    """Verify demo farmer forecast matches SIH 2026 Morning Star spec exactly."""
    provider = DeterministicForecastProvider()
    res = provider.generate_forecast(
        crop_lot_id="lot_wheat_nashik_001",
        crop="Wheat",
        current_price=2480.0,
    )

    assert res.current_price == 2480.0
    assert res.forecast_1d == 2495.0
    assert res.forecast_3d == 2520.0
    assert res.forecast_7d == 2570.0
    assert res.forecast_14d == 2540.0
    assert res.confidence == 0.78
    assert res.trend == "BULLISH_SHORT_TERM"
    assert len(res.horizons) == 4
    assert res.is_simulated_demo is True


def test_deterministic_forecast_scaled_crop():
    """Verify other commodities receive logically scaled multi-horizon projections."""
    provider = DeterministicForecastProvider()
    res = provider.generate_forecast(
        crop_lot_id="lot_soybean_002",
        crop="Soybean",
        current_price=4000.0,
    )
    assert res.current_price == 4000.0
    assert res.forecast_1d > 4000.0
    assert res.forecast_7d > res.forecast_1d
    assert res.confidence > 0.70


# ---------------------------------------------------------
# 2. ML Trend Forecast Provider Tests
# ---------------------------------------------------------

def test_ml_trend_forecast_bullish_history():
    """Verify ML trend engine derives positive slope from upward price history."""
    provider = MLTrendForecastProvider()
    history = [
        {"date": "2026-08-16", "modal_price": 2400.0},
        {"date": "2026-08-18", "modal_price": 2420.0},
        {"date": "2026-08-20", "modal_price": 2450.0},
        {"date": "2026-08-22", "modal_price": 2480.0},
    ]
    res = provider.generate_forecast(
        crop_lot_id="lot_test_001",
        crop="Wheat",
        current_price=2480.0,
        price_history=history,
    )
    assert res.forecast_1d > 2480.0
    assert res.forecast_7d > res.forecast_3d
    assert res.trend == "BULLISH_SHORT_TERM"
    assert res.confidence >= 0.70


def test_ml_trend_forecast_bearish_history():
    """Verify ML trend engine detects negative slope and assigns BEARISH trend."""
    provider = MLTrendForecastProvider()
    history = [
        {"date": "2026-08-16", "modal_price": 2600.0},
        {"date": "2026-08-18", "modal_price": 2550.0},
        {"date": "2026-08-20", "modal_price": 2500.0},
        {"date": "2026-08-22", "modal_price": 2450.0},
    ]
    res = provider.generate_forecast(
        crop_lot_id="lot_test_bearish",
        crop="Wheat",
        current_price=2450.0,
        price_history=history,
    )
    assert res.forecast_1d < 2450.0
    assert res.forecast_7d < 2450.0
    assert res.trend == "BEARISH"


def test_ml_trend_forecast_fallback_on_insufficient_history():
    """Verify fallback to deterministic baseline if history has < 2 points."""
    provider = MLTrendForecastProvider()
    res = provider.generate_forecast(
        crop_lot_id="lot_test_fallback",
        crop="Wheat",
        current_price=2480.0,
        price_history=[{"date": "2026-08-22", "modal_price": 2480.0}],
    )
    assert res.forecast_1d == 2495.0
    assert res.confidence == 0.78


# ---------------------------------------------------------
# 3. API Endpoint Tests
# ---------------------------------------------------------

def test_api_get_demo_lot_forecast(client):
    """Test GET /api/crop-lots/lot_wheat_nashik_001/forecast returns 200 with forecast contract."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/forecast")
    assert response.status_code == 200
    data = response.json()
    assert data["crop_lot_id"] == "lot_wheat_nashik_001"
    assert data["crop"] == "Wheat"
    assert data["current_price"] == 2480.0
    assert data["forecast_1d"] == 2495.0
    assert data["forecast_3d"] == 2520.0
    assert data["forecast_7d"] == 2570.0
    assert data["forecast_14d"] == 2540.0
    assert data["confidence"] == 0.78
    assert data["trend"] == "BULLISH_SHORT_TERM"
    assert len(data["horizons"]) == 4


def test_api_get_unknown_lot_forecast_not_found(client):
    """Test GET /api/crop-lots/{id}/forecast returns 404 for unknown lot."""
    response = client.get("/api/crop-lots/unknown_lot_999/forecast")
    assert response.status_code == 404


def test_api_create_lot_and_get_forecast(client):
    """Test creating a new Digital Twin lot and fetching its dynamic price forecast."""
    twin_payload = {
        "farmer_id": "farmer_custom_001",
        "crop": "Mustard",
        "quantity": 80.0,
        "location": "Nashik",
        "quality": "Grade A",
        "current_market_price": 5400.0,
    }
    create_res = client.post("/api/crop-lots/lot_mustard_001/digital-twin", json=twin_payload)
    assert create_res.status_code == 200

    forecast_res = client.get("/api/crop-lots/lot_mustard_001/forecast")
    assert forecast_res.status_code == 200
    data = forecast_res.json()
    assert data["crop"] == "Mustard"
    assert data["current_price"] == 5400.0
    assert data["forecast_1d"] > 5400.0
