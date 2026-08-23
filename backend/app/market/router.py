"""
FastAPI Router for Market Intelligence Endpoints.
Adheres strictly to docs/API_CONTRACTS.md.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import List
from backend.app.market.schemas import MarketSummary, MarketPriceHistoryResponse, WeatherObservation
from backend.app.market.service import market_service

router = APIRouter(prefix="/api/markets", tags=["Market Intelligence (Kuldeep)"])


@router.get("", response_model=List[MarketSummary], summary="List APMC Markets & Modal Prices")
def get_markets(
    commodity: str = Query(default="Wheat", description="Commodity name (e.g., Wheat, Soybean)"),
    location: str = Query(default="Nashik", description="Farmer reference location for distance calculation")
):
    """
    Retrieve all APMC mandis trading the requested commodity, sorted by distance from the farmer.
    Returns current modal, min, and max prices, daily arrivals, and demand rating.
    """
    markets = market_service.list_markets(commodity=commodity, location=location)
    return markets


@router.get("/{id}/prices", response_model=MarketPriceHistoryResponse, summary="Get Market Price Timeline")
def get_market_prices(
    id: str,
    commodity: str = Query(default="Wheat", description="Commodity name"),
    days: int = Query(default=14, ge=1, le=90, description="Historical lookback window in days")
):
    """
    Retrieve historical price series and current mandi rates for a specific APMC market.
    """
    price_history = market_service.get_market_price_history(market_id=id, commodity=commodity, days=days)
    if not price_history:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Market with id '{id}' or price data for '{commodity}' not found."
        )
    return price_history
