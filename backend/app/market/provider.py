"""
Abstract Provider Interfaces for Market Data and Weather.
Adheres to ADR 002: Provider Abstraction Pattern.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from backend.app.market.schemas import MarketSummary, MarketPriceHistoryResponse, WeatherObservation


class MarketDataProvider(ABC):
    """
    Abstract interface for fetching APMC market data, prices, and arrivals.
    Can be backed by Seed Data, Agmarknet, e-NAM, or other external APIs.
    """

    @abstractmethod
    def get_markets(self, commodity: str = "Wheat", farmer_location: str = "Nashik") -> List[MarketSummary]:
        """Fetch available APMC markets and current modal prices."""
        pass

    @abstractmethod
    def get_market_by_id(self, market_id: str) -> Optional[MarketSummary]:
        """Fetch market details by market identifier."""
        pass

    @abstractmethod
    def get_price_history(self, market_id: str, commodity: str = "Wheat", days: int = 14) -> Optional[MarketPriceHistoryResponse]:
        """Fetch historical and current commodity prices for a specific market."""
        pass


class WeatherProvider(ABC):
    """
    Abstract interface for fetching local weather observations and forecasts.
    Can be backed by Seed Data, OpenMeteo, IMD, or other weather APIs.
    """

    @abstractmethod
    def get_weather(self, location: str) -> WeatherObservation:
        """Fetch current weather observation for a location."""
        pass
