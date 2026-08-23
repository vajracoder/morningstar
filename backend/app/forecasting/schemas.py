"""
Pydantic Schemas for Price Forecasting Engine.
Adheres strictly to docs/API_CONTRACTS.md and MorningStar_Kuldeep_Master_Prompt.md.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict


class HorizonPrediction(BaseModel):
    days_ahead: int
    predicted_price: float
    confidence_lower: float
    confidence_upper: float
    projected_change_pct: float


class PriceForecastResponse(BaseModel):
    crop_lot_id: str
    crop: str
    current_price: float = Field(..., description="Current APMC modal price in INR/quintal")
    forecast_1d: float = Field(..., description="1-day predicted modal price")
    forecast_3d: float = Field(..., description="3-day predicted modal price")
    forecast_7d: float = Field(..., description="7-day predicted modal price")
    forecast_14d: float = Field(..., description="14-day predicted modal price")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    trend: str = Field(..., description="BULLISH_SHORT_TERM, BEARISH, NEUTRAL, or VOLATILE")
    horizons: List[HorizonPrediction] = Field(default_factory=list, description="Detailed horizon breakdown")
    market_id: Optional[str] = None
    market_name: Optional[str] = None
    is_simulated_demo: bool = True
    generated_at: str
