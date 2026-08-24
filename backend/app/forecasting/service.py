"""
Price Forecasting Service Implementations.
Includes Deterministic Seeded Engine (exact SIH demo spec) and ML Statistical Trend Engine.
"""
from datetime import datetime, timezone
import math
from typing import Optional, List, Dict
from backend.app.forecasting.provider import ForecastProvider
from backend.app.forecasting.schemas import PriceForecastResponse, HorizonPrediction
from backend.app.market.service import market_service


class DeterministicForecastProvider(ForecastProvider):
    """
    Standard deterministic forecasting engine aligned with the SIH 2026 Morning Star demo specification.
    Produces exact agreed baseline predictions for Farmer Rajesh (Nashik Wheat).
    """

    def generate_forecast(
        self,
        crop_lot_id: str,
        crop: str,
        current_price: float,
        price_history: Optional[List[Dict]] = None,
        market_id: Optional[str] = "mkt_nashik_001",
        market_name: Optional[str] = "Nashik APMC"
    ) -> PriceForecastResponse:
        # If standard demo wheat lot, return standard demo numbers
        if "wheat" in crop.lower() or current_price == 2480.0:
            f_1d = 2495.0
            f_3d = 2520.0
            f_7d = 2570.0
            f_14d = 2540.0
            confidence = 0.78
            trend = "BULLISH_SHORT_TERM"
        else:
            # Scaled demo calculation based on base price
            f_1d = round(current_price * 1.006, 1)
            f_3d = round(current_price * 1.016, 1)
            f_7d = round(current_price * 1.036, 1)
            f_14d = round(current_price * 1.024, 1)
            confidence = 0.75
            trend = "BULLISH_SHORT_TERM"

        horizons = [
            HorizonPrediction(
                days_ahead=1,
                predicted_price=f_1d,
                confidence_lower=round(f_1d * 0.985, 1),
                confidence_upper=round(f_1d * 1.015, 1),
                projected_change_pct=round(((f_1d - current_price) / current_price) * 100, 2),
            ),
            HorizonPrediction(
                days_ahead=3,
                predicted_price=f_3d,
                confidence_lower=round(f_3d * 0.975, 1),
                confidence_upper=round(f_3d * 1.025, 1),
                projected_change_pct=round(((f_3d - current_price) / current_price) * 100, 2),
            ),
            HorizonPrediction(
                days_ahead=7,
                predicted_price=f_7d,
                confidence_lower=round(f_7d * 0.960, 1),
                confidence_upper=round(f_7d * 1.040, 1),
                projected_change_pct=round(((f_7d - current_price) / current_price) * 100, 2),
            ),
            HorizonPrediction(
                days_ahead=14,
                predicted_price=f_14d,
                confidence_lower=round(f_14d * 0.945, 1),
                confidence_upper=round(f_14d * 1.055, 1),
                projected_change_pct=round(((f_14d - current_price) / current_price) * 100, 2),
            ),
        ]

        return PriceForecastResponse(
            crop_lot_id=crop_lot_id,
            crop=crop,
            current_price=current_price,
            forecast_1d=f_1d,
            forecast_3d=f_3d,
            forecast_7d=f_7d,
            forecast_14d=f_14d,
            confidence=confidence,
            trend=trend,
            horizons=horizons,
            market_id=market_id,
            market_name=market_name,
            is_simulated_demo=True,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )


class MLTrendForecastProvider(ForecastProvider):
    """
    Statistical time-series trend forecasting provider.
    Computes slope from historical APMC prices and derives multi-horizon projections.
    """

    def generate_forecast(
        self,
        crop_lot_id: str,
        crop: str,
        current_price: float,
        price_history: Optional[List[Dict]] = None,
        market_id: Optional[str] = None,
        market_name: Optional[str] = None
    ) -> PriceForecastResponse:
        if not price_history or len(price_history) < 2:
            # Fallback to deterministic if insufficient history
            return DeterministicForecastProvider().generate_forecast(
                crop_lot_id=crop_lot_id,
                crop=crop,
                current_price=current_price,
                market_id=market_id,
                market_name=market_name,
            )

        # Extract prices
        prices = [p["modal_price"] for p in price_history]
        n = len(prices)
        x_mean = (n - 1) / 2.0
        y_mean = sum(prices) / float(n)

        # Linear regression slope (daily price momentum)
        numerator = sum((i - x_mean) * (prices[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        daily_slope = (numerator / denominator) if denominator != 0 else 0.0

        # Project horizons
        f_1d = round(current_price + (daily_slope * 1), 1)
        f_3d = round(current_price + (daily_slope * 3), 1)
        f_7d = round(current_price + (daily_slope * 7), 1)
        f_14d = round(current_price + (daily_slope * 14 * 0.9), 1)  # mean reversion dampening

        # Determine trend
        change_7d = (f_7d - current_price) / current_price
        if change_7d > 0.02:
            trend = "BULLISH_SHORT_TERM"
        elif change_7d < -0.02:
            trend = "BEARISH"
        else:
            trend = "NEUTRAL"

        confidence = 0.82 if n >= 5 else 0.70

        horizons = [
            HorizonPrediction(
                days_ahead=1,
                predicted_price=f_1d,
                confidence_lower=round(f_1d * 0.985, 1),
                confidence_upper=round(f_1d * 1.015, 1),
                projected_change_pct=round(((f_1d - current_price) / current_price) * 100, 2),
            ),
            HorizonPrediction(
                days_ahead=3,
                predicted_price=f_3d,
                confidence_lower=round(f_3d * 0.975, 1),
                confidence_upper=round(f_3d * 1.025, 1),
                projected_change_pct=round(((f_3d - current_price) / current_price) * 100, 2),
            ),
            HorizonPrediction(
                days_ahead=7,
                predicted_price=f_7d,
                confidence_lower=round(f_7d * 0.960, 1),
                confidence_upper=round(f_7d * 1.040, 1),
                projected_change_pct=round(((f_7d - current_price) / current_price) * 100, 2),
            ),
            HorizonPrediction(
                days_ahead=14,
                predicted_price=f_14d,
                confidence_lower=round(f_14d * 0.945, 1),
                confidence_upper=round(f_14d * 1.055, 1),
                projected_change_pct=round(((f_14d - current_price) / current_price) * 100, 2),
            ),
        ]

        return PriceForecastResponse(
            crop_lot_id=crop_lot_id,
            crop=crop,
            current_price=current_price,
            forecast_1d=f_1d,
            forecast_3d=f_3d,
            forecast_7d=f_7d,
            forecast_14d=f_14d,
            confidence=confidence,
            trend=trend,
            horizons=horizons,
            market_id=market_id,
            market_name=market_name,
            is_simulated_demo=True,
            generated_at=datetime.now(timezone.utc).isoformat(),
        )


class ForecastingService:
    """
    Forecasting domain service.
    Orchestrates provider selection, APMC price history lookup, and lot forecasting.
    """

    def __init__(self, provider: Optional[ForecastProvider] = None):
        self.provider = provider or DeterministicForecastProvider()

    def get_forecast_for_lot(
        self,
        crop_lot_id: str,
        crop: str = "Wheat",
        current_price: float = 2480.0,
        market_id: str = "mkt_nashik_001"
    ) -> PriceForecastResponse:
        """Fetch forecast for a specific crop lot."""
        # Query market history if available
        market_history = market_service.get_market_price_history(market_id=market_id, commodity=crop)
        history_records = None
        market_name = "Nashik APMC"
        if market_history:
            market_name = market_history.market_name
            history_records = [
                {"date": p.date, "modal_price": p.modal_price}
                for p in market_history.price_history
            ]

        return self.provider.generate_forecast(
            crop_lot_id=crop_lot_id,
            crop=crop,
            current_price=current_price,
            price_history=history_records,
            market_id=market_id,
            market_name=market_name
        )


forecasting_service = ForecastingService()
