"""
FastAPI Router for Price Forecasting Endpoints.
Adheres strictly to docs/API_CONTRACTS.md.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from backend.app.forecasting.schemas import PriceForecastResponse
from backend.app.forecasting.service import forecasting_service
from backend.app.intelligence.digital_twin import digital_twin_service

router = APIRouter(prefix="/api/crop-lots", tags=["Price Forecasting (Kuldeep)"])


@router.get("/{id}/forecast", response_model=PriceForecastResponse, summary="Get Multi-Horizon Price Forecast")
def get_crop_lot_price_forecast(id: str, db: Session = Depends(get_db)):
    """
    Retrieve 1-day, 3-day, 7-day, and 14-day price projections with confidence bounds and trend analytics
    for a given crop lot.
    """
    # Fetch digital twin state for crop type and current APMC baseline
    twin = digital_twin_service.get_by_crop_lot_id(db=db, crop_lot_id=id)

    if not twin:
        # If not found in DB, verify if it's the known demo ID or 404
        if id == "lot_wheat_nashik_001":
            crop = "Wheat"
            current_price = 2480.0
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop lot with id '{id}' not found for price forecasting."
            )
    else:
        crop = twin.crop
        current_price = twin.current_market_price

    forecast = forecasting_service.get_forecast_for_lot(
        crop_lot_id=id,
        crop=crop,
        current_price=current_price,
        market_id="mkt_nashik_001"
    )
    return forecast
