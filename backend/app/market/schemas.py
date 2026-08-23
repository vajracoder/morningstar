"""
Pydantic schemas for Market Intelligence.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime


class MarketPricePoint(BaseModel):
    date: str = Field(..., description="ISO formatted date YYYY-MM-DD")
    modal_price: float = Field(..., description="Modal price in INR/quintal")
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    arrivals_tonnes: Optional[float] = 0.0


class MarketSummary(BaseModel):
    id: str
    name: str
    district: str
    state: str = "Maharashtra"
    distance_km: float = 0.0
    commodity: str = "Wheat"
    modal_price: float
    min_price: float
    max_price: float
    unit: str = "INR/quintal"
    arrivals_tonnes: float = 0.0
    demand_level: str = "HIGH"
    updated_at: str


class MarketPriceHistoryResponse(BaseModel):
    market_id: str
    market_name: str
    commodity: str
    current_price: float
    min_price: float
    max_price: float
    unit: str = "INR/quintal"
    price_history: List[MarketPricePoint]
    is_simulated_demo: bool = True


class WeatherObservation(BaseModel):
    location: str
    temperature_c: float
    humidity_percent: float
    condition: str
    rain_probability_percent: float
    recorded_at: str
