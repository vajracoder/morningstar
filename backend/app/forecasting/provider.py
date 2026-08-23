"""
Abstract Base Interface for Price Forecasting Services.
Adheres to ADR 002: Replaceable AI/ML Service Architecture.
"""
from abc import ABC, abstractmethod
from typing import Optional, List, Dict
from backend.app.forecasting.schemas import PriceForecastResponse


class ForecastProvider(ABC):
    """
    Abstract interface for generating multi-horizon commodity price forecasts.
    Implementations can range from deterministic demo baselines to XGBoost / LSTM models.
    """

    @abstractmethod
    def generate_forecast(
        self,
        crop_lot_id: str,
        crop: str,
        current_price: float,
        price_history: Optional[List[Dict]] = None,
        market_id: Optional[str] = None,
        market_name: Optional[str] = None
    ) -> PriceForecastResponse:
        """Generate 1d, 3d, 7d, 14d horizon forecasts with confidence bounds."""
        pass
