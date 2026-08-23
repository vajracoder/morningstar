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


# ---------------------------------------------------------
# Net Realisation Schemas
# ---------------------------------------------------------

class CostDeductions(BaseModel):
    transport: float = Field(..., description="Estimated transport/logistics cost in INR")
    storage: float = Field(..., description="Estimated storage/holding cost in INR")
    commission: float = Field(..., description="Mandi/platform commission in INR")
    spoilage: float = Field(..., description="Estimated quality degradation/spoilage loss in INR")
    financing: float = Field(0.0, description="Financing/interest cost if holding in INR")


class NetRealisationResponse(BaseModel):
    crop_lot_id: Optional[str] = None
    quantity: float
    quantity_unit: str = "quintal"
    offered_price_per_q: float
    gross_revenue: float
    deductions: CostDeductions
    total_deductions: float
    net_realisation: float = Field(..., description="Net cash realization in farmer's pocket (INR)")
    net_price_per_q: float = Field(..., description="Effective net realization per quintal (INR/q)")
    is_simulated_demo: bool = True


class NetRealisationRequest(BaseModel):
    crop_lot_id: Optional[str] = None
    quantity: float = Field(..., gt=0.0)
    offered_price_per_q: float = Field(..., gt=0.0)
    distance_km: float = Field(default=15.0, ge=0.0)
    storage_days: int = Field(default=3, ge=0)
    quality_grade: str = Field(default="Grade A")
    spoilage_risk: str = Field(default="LOW")


# ---------------------------------------------------------
# Sell / Wait Decision Engine Schemas
# ---------------------------------------------------------

class NetBenefitBreakdown(BaseModel):
    gross_gain: float
    storage_cost: float
    spoilage_cost: float
    net_gain: float


class SellDecisionResponse(BaseModel):
    crop_lot_id: str
    decision: str = Field(..., description="WAIT, SELL_NOW, or SPLIT_SALE")
    recommended_days: int = Field(..., ge=0, description="Recommended holding period in days (0 if SELL_NOW)")
    expected_gain: float = Field(..., description="Projected net gain over selling immediately (INR)")
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk: str = Field(..., description="LOW, MEDIUM, or HIGH")
    reason: str = Field(..., description="Transparent human-readable explanation")
    projected_price: float = Field(..., description="Expected price at recommended horizon (INR/q)")
    net_benefit_breakdown: NetBenefitBreakdown
    is_simulated_demo: bool = True
    generated_at: str
