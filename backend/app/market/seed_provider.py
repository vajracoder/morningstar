"""
Deterministic Seed Market and Weather Data Providers for Phase 1.
Implements standardized demo data for Rajesh (Nashik, Wheat, 100 quintal).
"""
from datetime import date, timedelta, datetime, timezone
from typing import List, Optional, Dict, Any
from backend.app.market.provider import MarketDataProvider, WeatherProvider
from backend.app.market.schemas import MarketSummary, MarketPriceHistoryResponse, MarketPricePoint, WeatherObservation


class SeedMarketDataProvider(MarketDataProvider):
    """
    Deterministic seeded provider for APMC market data.
    Provides realistic market pricing for Maharashtra APMC mandis.
    """

    def __init__(self):
        self._markets_db: Dict[str, Dict[str, Any]] = {
            "mkt_nashik_001": {
                "id": "mkt_nashik_001",
                "name": "Nashik APMC",
                "district": "Nashik",
                "state": "Maharashtra",
                "distance_km_from_nashik": 15.0,
                "commodity": "Wheat",
                "modal_price": 2480.0,
                "min_price": 2350.0,
                "max_price": 2550.0,
                "unit": "INR/quintal",
                "arrivals_tonnes": 450.0,
                "demand_level": "HIGH",
                "history_offsets": [
                    (-7, 2440.0, 2300.0, 2500.0, 410.0),
                    (-5, 2450.0, 2320.0, 2515.0, 425.0),
                    (-3, 2465.0, 2335.0, 2530.0, 435.0),
                    (-1, 2475.0, 2345.0, 2545.0, 445.0),
                    (0, 2480.0, 2350.0, 2550.0, 450.0),
                ],
            },
            "mkt_pune_002": {
                "id": "mkt_pune_002",
                "name": "Pune Gultekdi APMC",
                "district": "Pune",
                "state": "Maharashtra",
                "distance_km_from_nashik": 185.0,
                "commodity": "Wheat",
                "modal_price": 2510.0,
                "min_price": 2380.0,
                "max_price": 2590.0,
                "unit": "INR/quintal",
                "arrivals_tonnes": 600.0,
                "demand_level": "VERY_HIGH",
                "history_offsets": [
                    (-7, 2470.0, 2340.0, 2540.0, 570.0),
                    (-3, 2490.0, 2360.0, 2570.0, 590.0),
                    (0, 2510.0, 2380.0, 2590.0, 600.0),
                ],
            },
            "mkt_vashi_003": {
                "id": "mkt_vashi_003",
                "name": "Mumbai Vashi APMC",
                "district": "Navi Mumbai",
                "state": "Maharashtra",
                "distance_km_from_nashik": 165.0,
                "commodity": "Wheat",
                "modal_price": 2560.0,
                "min_price": 2420.0,
                "max_price": 2650.0,
                "unit": "INR/quintal",
                "arrivals_tonnes": 850.0,
                "demand_level": "HIGH",
                "history_offsets": [
                    (-7, 2520.0, 2380.0, 2600.0, 800.0),
                    (-3, 2545.0, 2400.0, 2630.0, 830.0),
                    (0, 2560.0, 2420.0, 2650.0, 850.0),
                ],
            },
            "mkt_lasalgaon_004": {
                "id": "mkt_lasalgaon_004",
                "name": "Lasalgaon APMC",
                "district": "Nashik",
                "state": "Maharashtra",
                "distance_km_from_nashik": 58.0,
                "commodity": "Wheat",
                "modal_price": 2460.0,
                "min_price": 2320.0,
                "max_price": 2510.0,
                "unit": "INR/quintal",
                "arrivals_tonnes": 300.0,
                "demand_level": "MEDIUM",
                "history_offsets": [
                    (-7, 2430.0, 2300.0, 2480.0, 280.0),
                    (-3, 2445.0, 2310.0, 2495.0, 290.0),
                    (0, 2460.0, 2320.0, 2510.0, 300.0),
                ],
            },
        }

    def get_markets(self, commodity: str = "Wheat", farmer_location: str = "Nashik") -> List[MarketSummary]:
        today_str = date.today().isoformat()
        results = []
        for raw in self._markets_db.values():
            if raw["commodity"].lower() == commodity.lower():
                results.append(
                    MarketSummary(
                        id=raw["id"],
                        name=raw["name"],
                        district=raw["district"],
                        state=raw["state"],
                        distance_km=raw["distance_km_from_nashik"],
                        commodity=raw["commodity"],
                        modal_price=raw["modal_price"],
                        min_price=raw["min_price"],
                        max_price=raw["max_price"],
                        unit=raw["unit"],
                        arrivals_tonnes=raw["arrivals_tonnes"],
                        demand_level=raw["demand_level"],
                        updated_at=f"{today_str}T09:00:00Z",
                    )
                )
        # Sort by distance
        results.sort(key=lambda m: m.distance_km)
        return results

    def get_market_by_id(self, market_id: str) -> Optional[MarketSummary]:
        raw = self._markets_db.get(market_id)
        if not raw:
            return None
        today_str = date.today().isoformat()
        return MarketSummary(
            id=raw["id"],
            name=raw["name"],
            district=raw["district"],
            state=raw["state"],
            distance_km=raw["distance_km_from_nashik"],
            commodity=raw["commodity"],
            modal_price=raw["modal_price"],
            min_price=raw["min_price"],
            max_price=raw["max_price"],
            unit=raw["unit"],
            arrivals_tonnes=raw["arrivals_tonnes"],
            demand_level=raw["demand_level"],
            updated_at=f"{today_str}T09:00:00Z",
        )

    def get_price_history(self, market_id: str, commodity: str = "Wheat", days: int = 14) -> Optional[MarketPriceHistoryResponse]:
        raw = self._markets_db.get(market_id)
        if not raw:
            return None

        today = date.today()
        price_history: List[MarketPricePoint] = []

        for offset, modal, min_p, max_p, arr in raw["history_offsets"]:
            rec_date = (today + timedelta(days=offset)).isoformat()
            price_history.append(
                MarketPricePoint(
                    date=rec_date,
                    modal_price=modal,
                    min_price=min_p,
                    max_price=max_p,
                    arrivals_tonnes=arr,
                )
            )

        return MarketPriceHistoryResponse(
            market_id=raw["id"],
            market_name=raw["name"],
            commodity=raw["commodity"],
            current_price=raw["modal_price"],
            min_price=raw["min_price"],
            max_price=raw["max_price"],
            unit=raw["unit"],
            price_history=price_history,
            is_simulated_demo=True,
        )


class SeedWeatherProvider(WeatherProvider):
    """
    Deterministic seeded provider for weather observations.
    """

    def get_weather(self, location: str = "Nashik") -> WeatherObservation:
        now_str = datetime.now(timezone.utc).isoformat()
        return WeatherObservation(
            location=location,
            temperature_c=28.5,
            humidity_percent=45.0,
            condition="Clear Sky",
            rain_probability_percent=5.0,
            recorded_at=now_str,
        )
