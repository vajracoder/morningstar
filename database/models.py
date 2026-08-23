"""
SQLAlchemy database models for KrishiPulse.
Shared entity contracts adhering to docs/DATABASE_SCHEMA.md.
"""
from datetime import datetime, date, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Date,
    DateTime,
    Boolean,
    ForeignKey,
    JSON,
    Text,
)
from sqlalchemy.orm import relationship
from database.session import Base


def utc_now():
    return datetime.now(timezone.utc)


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    phone = Column(String(32), unique=True, index=True, nullable=False)
    role = Column(String(32), default="FARMER", nullable=False)  # FARMER, BUYER, FPO, ADMIN
    created_at = Column(DateTime, default=utc_now, nullable=False)

    farmer_profile = relationship("FarmerProfileModel", back_populates="user", uselist=False)
    crop_lots = relationship("CropLotModel", back_populates="farmer")


class FarmerProfileModel(Base):
    __tablename__ = "farmer_profiles"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    district = Column(String(64), nullable=False)
    state = Column(String(64), nullable=False, default="Maharashtra")
    land_size_acres = Column(Float, default=5.0)
    primary_crops = Column(JSON, default=lambda: ["Wheat", "Soybean"])

    user = relationship("UserModel", back_populates="farmer_profile")


class CropLotModel(Base):
    __tablename__ = "crop_lots"

    id = Column(String(64), primary_key=True, index=True)
    farmer_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    commodity = Column(String(64), nullable=False)
    variety = Column(String(64), default="Lokwan")
    quantity = Column(Float, nullable=False)
    quantity_unit = Column(String(16), default="quintal")
    quality_grade = Column(String(32), default="Grade A")
    harvest_date = Column(Date, default=date.today)
    storage_location = Column(String(128), default="On-farm dry storage")
    status = Column(String(32), default="ANALYZED")  # DRAFT, ANALYZED, LISTED, NEGOTIATING, SOLD
    created_at = Column(DateTime, default=utc_now, nullable=False)

    farmer = relationship("UserModel", back_populates="crop_lots")
    digital_twin = relationship("DigitalTwinModel", back_populates="crop_lot", uselist=False)


class DigitalTwinModel(Base):
    """
    Kuldeep's Digital Twin Entity.
    Tracks state of the crop lot for intelligence calculation.
    """
    __tablename__ = "digital_twins"

    id = Column(String(64), primary_key=True, index=True)
    farmer_id = Column(String(64), nullable=False, index=True)
    crop_lot_id = Column(String(64), ForeignKey("crop_lots.id"), unique=True, nullable=False)
    crop = Column(String(64), nullable=False)
    quantity = Column(Float, nullable=False)
    location = Column(String(128), nullable=False)
    quality = Column(String(32), default="Grade A")
    harvest_date = Column(Date, default=date.today)
    storage_days = Column(Integer, default=0)
    financial_urgency = Column(String(16), default="MEDIUM")  # LOW, MEDIUM, HIGH
    current_market_price = Column(Float, nullable=False, default=2480.0)
    buyer_demand = Column(String(16), default="HIGH")  # LOW, MEDIUM, HIGH
    transport_estimate = Column(Float, default=6800.0)
    spoilage_risk = Column(String(16), default="LOW")  # LOW, MEDIUM, HIGH
    forecast_summary = Column(JSON, nullable=True)
    last_synced_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    crop_lot = relationship("CropLotModel", back_populates="digital_twin")


class MarketModel(Base):
    """
    APMC Market definition.
    """
    __tablename__ = "markets"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    district = Column(String(64), nullable=False)
    state = Column(String(64), nullable=False, default="Maharashtra")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    prices = relationship("MarketPriceModel", back_populates="market", cascade="all, delete-orphan")


class MarketPriceModel(Base):
    """
    Commodity price records for markets.
    """
    __tablename__ = "market_prices"

    id = Column(String(64), primary_key=True, index=True)
    market_id = Column(String(64), ForeignKey("markets.id"), nullable=False, index=True)
    commodity = Column(String(64), nullable=False, index=True)
    variety = Column(String(64), default="Standard")
    modal_price = Column(Float, nullable=False)
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    unit = Column(String(32), default="INR/quintal")
    arrivals_tonnes = Column(Float, default=0.0)
    demand_level = Column(String(16), default="HIGH")
    recorded_date = Column(Date, default=date.today, index=True)
    is_simulated = Column(Boolean, default=True)

    market = relationship("MarketModel", back_populates="prices")
