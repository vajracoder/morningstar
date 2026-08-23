"""
Pydantic Schemas for Digital Twin and Intelligence Models.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
from datetime import date, datetime


class DigitalTwinCreateUpdateSchema(BaseModel):
    farmer_id: str = Field(..., min_length=1, description="Farmer identifier (e.g. farmer_rajesh_001)")
    crop: str = Field(..., min_length=1, description="Crop name (e.g. Wheat)")
    quantity: float = Field(..., gt=0.0, description="Quantity in quintals (must be strictly > 0)")
    quantity_unit: str = Field(default="quintal", description="Unit of measurement")
    location: str = Field(..., min_length=1, description="Farm or storage location (e.g. Nashik)")
    quality: str = Field(default="Grade A", description="Crop quality grade (e.g. Grade A, Grade B, Grade C)")
    harvest_date: str = Field(default_factory=lambda: date.today().isoformat(), description="Harvest date YYYY-MM-DD")
    storage_days: int = Field(default=0, ge=0, description="Number of days the crop has been stored")
    financial_urgency: str = Field(default="MEDIUM", description="Urgency to sell: LOW, MEDIUM, or HIGH")
    current_market_price: float = Field(default=2480.0, gt=0.0, description="Current local APMC price in INR/quintal")
    buyer_demand: str = Field(default="HIGH", description="Market demand level: LOW, MEDIUM, or HIGH")
    transport_estimate: float = Field(default=6800.0, ge=0.0, description="Estimated logistics cost in INR")
    spoilage_risk: str = Field(default="LOW", description="Spoilage risk level: LOW, MEDIUM, or HIGH")
    forecast: Optional[Dict[str, Any]] = None

    @field_validator("financial_urgency", "spoilage_risk", "buyer_demand")
    @classmethod
    def validate_enum_levels(cls, v: str) -> str:
        upper_v = v.upper()
        if upper_v not in {"LOW", "MEDIUM", "HIGH", "VERY_HIGH"}:
            raise ValueError(f"Value must be one of LOW, MEDIUM, HIGH, or VERY_HIGH, got '{v}'")
        return upper_v


class DigitalTwinResponseSchema(BaseModel):
    id: str
    farmer_id: str
    crop_lot_id: str
    crop: str
    quantity: float
    quantity_unit: str = "quintal"
    location: str
    quality: str
    harvest_date: str
    storage_days: int
    financial_urgency: str
    current_market_price: float
    buyer_demand: str
    transport_estimate: float
    spoilage_risk: str
    forecast: Optional[Dict[str, Any]] = None
    updated_at: str
