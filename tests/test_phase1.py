"""
Deterministic Test Suite for Phase 1: Digital Twin + Seeded Market Data.
Owned by Kuldeep.
"""
import pytest
from fastapi.testclient import TestClient
from database.session import Base, engine, SessionLocal
from backend.app.main import app
from backend.app.market.seed_provider import SeedMarketDataProvider, SeedWeatherProvider
from backend.app.seed.seed_data import init_db_and_seed


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Ensure DB schema is initialized and seeded before tests."""
    init_db_and_seed()
    yield


@pytest.fixture
def client():
    return TestClient(app)


# ---------------------------------------------------------
# 1. Market Data Provider Tests
# ---------------------------------------------------------

def test_seed_market_provider_markets_list():
    """Verify seeded provider returns APMC markets sorted by distance."""
    provider = SeedMarketDataProvider()
    markets = provider.get_markets(commodity="Wheat", farmer_location="Nashik")
    assert len(markets) >= 4

    # Closest should be Nashik APMC (15 km)
    assert markets[0].id == "mkt_nashik_001"
    assert markets[0].name == "Nashik APMC"
    assert markets[0].modal_price == 2480.0
    assert markets[0].min_price == 2350.0
    assert markets[0].max_price == 2550.0


def test_seed_market_provider_price_history():
    """Verify price history returns historical records for Nashik APMC."""
    provider = SeedMarketDataProvider()
    history = provider.get_price_history(market_id="mkt_nashik_001", commodity="Wheat")
    assert history is not None
    assert history.current_price == 2480.0
    assert len(history.price_history) >= 5
    assert history.price_history[-1].modal_price == 2480.0


def test_seed_market_provider_unknown_market():
    """Verify provider returns None for unknown market ID."""
    provider = SeedMarketDataProvider()
    result = provider.get_market_by_id("non_existent_market_999")
    assert result is None
    history = provider.get_price_history("non_existent_market_999")
    assert history is None


def test_seed_weather_provider():
    """Verify weather provider outputs valid weather telemetry."""
    provider = SeedWeatherProvider()
    weather = provider.get_weather("Nashik")
    assert weather.location == "Nashik"
    assert weather.temperature_c > 0
    assert weather.humidity_percent > 0


# ---------------------------------------------------------
# 2. Market Intelligence API Endpoint Tests
# ---------------------------------------------------------

def test_api_get_markets(client):
    """Test GET /api/markets returns 200 with demo market data."""
    response = client.get("/api/markets?commodity=Wheat&location=Nashik")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 4
    nashik = next((m for m in data if m["id"] == "mkt_nashik_001"), None)
    assert nashik is not None
    assert nashik["modal_price"] == 2480.0


def test_api_get_market_prices(client):
    """Test GET /api/markets/{id}/prices returns 200 with historical series."""
    response = client.get("/api/markets/mkt_nashik_001/prices?commodity=Wheat")
    assert response.status_code == 200
    data = response.json()
    assert data["market_id"] == "mkt_nashik_001"
    assert data["current_price"] == 2480.0
    assert "price_history" in data
    assert len(data["price_history"]) > 0


def test_api_get_market_prices_not_found(client):
    """Test GET /api/markets/{id}/prices returns 404 for invalid market."""
    response = client.get("/api/markets/invalid_id_999/prices")
    assert response.status_code == 404


# ---------------------------------------------------------
# 3. Digital Twin Tests (Normal, Zero, Negative, Missing)
# ---------------------------------------------------------

def test_api_get_demo_digital_twin(client):
    """Test GET /api/crop-lots/{id}/digital-twin for Farmer Rajesh (demo lot)."""
    response = client.get("/api/crop-lots/lot_wheat_nashik_001/digital-twin")
    assert response.status_code == 200
    data = response.json()
    assert data["farmer_id"] == "farmer_rajesh_001"
    assert data["crop_lot_id"] == "lot_wheat_nashik_001"
    assert data["crop"] == "Wheat"
    assert data["quantity"] == 100.0
    assert data["quality"] == "Grade A"
    assert data["location"] == "Nashik"
    assert data["current_market_price"] == 2480.0
    assert data["financial_urgency"] == "MEDIUM"


def test_api_get_digital_twin_not_found(client):
    """Test GET /api/crop-lots/{id}/digital-twin returns 404 for unknown lot."""
    response = client.get("/api/crop-lots/unknown_lot_999/digital-twin")
    assert response.status_code == 404


def test_api_create_valid_digital_twin(client):
    """Test POST /api/crop-lots/{id}/digital-twin creates new valid twin."""
    payload = {
        "farmer_id": "farmer_test_002",
        "crop": "Soybean",
        "quantity": 50.0,
        "quantity_unit": "quintal",
        "location": "Pune",
        "quality": "Grade B",
        "harvest_date": "2026-08-21",
        "storage_days": 2,
        "financial_urgency": "HIGH",
        "current_market_price": 4200.0,
        "buyer_demand": "HIGH",
        "transport_estimate": 4500.0,
        "spoilage_risk": "LOW"
    }
    response = client.post("/api/crop-lots/lot_soybean_pune_002/digital-twin", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["crop_lot_id"] == "lot_soybean_pune_002"
    assert data["crop"] == "Soybean"
    assert data["quantity"] == 50.0
    assert data["financial_urgency"] == "HIGH"


def test_api_create_digital_twin_zero_quantity(client):
    """Test POST /api/crop-lots/{id}/digital-twin fails on zero quantity (must be > 0)."""
    payload = {
        "farmer_id": "farmer_test_003",
        "crop": "Wheat",
        "quantity": 0.0,
        "location": "Nashik",
    }
    response = client.post("/api/crop-lots/lot_zero_qty/digital-twin", json=payload)
    assert response.status_code == 422  # Unprocessable Entity / Validation Error


def test_api_create_digital_twin_negative_quantity(client):
    """Test POST /api/crop-lots/{id}/digital-twin fails on negative quantity."""
    payload = {
        "farmer_id": "farmer_test_004",
        "crop": "Wheat",
        "quantity": -25.0,
        "location": "Nashik",
    }
    response = client.post("/api/crop-lots/lot_neg_qty/digital-twin", json=payload)
    assert response.status_code == 422


def test_api_create_digital_twin_invalid_type_quantity(client):
    """Test POST /api/crop-lots/{id}/digital-twin fails on non-numeric string quantity."""
    payload = {
        "farmer_id": "farmer_test_005",
        "crop": "Wheat",
        "quantity": "one-hundred-quintals",
        "location": "Nashik",
    }
    response = client.post("/api/crop-lots/lot_bad_type/digital-twin", json=payload)
    assert response.status_code == 422


def test_api_create_digital_twin_missing_required_fields(client):
    """Test POST /api/crop-lots/{id}/digital-twin fails when missing mandatory fields."""
    payload = {
        # missing farmer_id, crop, quantity, location
        "quality": "Grade A"
    }
    response = client.post("/api/crop-lots/lot_missing_fields/digital-twin", json=payload)
    assert response.status_code == 422


def test_api_create_digital_twin_invalid_enum_level(client):
    """Test POST /api/crop-lots/{id}/digital-twin fails on invalid enum value."""
    payload = {
        "farmer_id": "farmer_test_006",
        "crop": "Wheat",
        "quantity": 50.0,
        "location": "Nashik",
        "financial_urgency": "SUPER_PANIC_INVALID"
    }
    response = client.post("/api/crop-lots/lot_bad_enum/digital-twin", json=payload)
    assert response.status_code == 422
