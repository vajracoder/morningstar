"""
Market Intelligence Service Layer.
Normalizes data, handles business queries, and bridges providers to controllers.
"""
from typing import List, Optional
from backend.app.market.provider import MarketDataProvider, WeatherProvider
from backend.app.market.seed_provider import SeedMarketDataProvider, SeedWeatherProvider
from backend.app.market.schemas import MarketSummary, MarketPriceHistoryResponse, WeatherObservation


class MarketService:
    """
    Core Market Service owned by Kuldeep.
    Encapsulates price retrieval, trend analysis, and market comparison.
    """

    def __init__(
        self,
        market_provider: Optional[MarketDataProvider] = None,
        weather_provider: Optional[WeatherProvider] = None
    ):
        self.market_provider = market_provider or SeedMarketDataProvider()
        self.weather_provider = weather_provider or SeedWeatherProvider()

    def list_markets(self, commodity: str = "Wheat", location: str = "Nashik") -> List[MarketSummary]:
        """Fetch all matching APMC markets ordered by proximity."""
        return self.market_provider.get_markets(commodity=commodity, farmer_location=location)

    def get_market(self, market_id: str) -> Optional[MarketSummary]:
        """Fetch single market summary."""
        return self.market_provider.get_market_by_id(market_id)

    def get_market_price_history(self, market_id: str, commodity: str = "Wheat", days: int = 14) -> Optional[MarketPriceHistoryResponse]:
        """Fetch historical price timeline for a market."""
        return self.market_provider.get_price_history(market_id, commodity=commodity, days=days)

    def get_weather(self, location: str = "Nashik") -> WeatherObservation:
        """Fetch local weather observation."""
        return self.weather_provider.get_weather(location=location)


# Default singleton instance
market_service = MarketService()
