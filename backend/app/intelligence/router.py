"""
FastAPI Router for Digital Twin Endpoints.
Adheres strictly to docs/API_CONTRACTS.md.
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database.session import get_db
from backend.app.intelligence.schemas import (
    DigitalTwinCreateUpdateSchema,
    DigitalTwinResponseSchema,
    SellDecisionResponse,
    NetRealisationResponse,
    NetRealisationRequest,
    BuyerMatchResponse,
    BuyerMatchRequest,
    AIExplanationResponse,
    NegotiationTalkingPointsResponse,
)
from backend.app.intelligence.digital_twin import digital_twin_service
from backend.app.intelligence.net_realisation_service import net_realisation_calculator
from backend.app.intelligence.sell_decision_service import sell_decision_engine
from backend.app.intelligence.buyer_matching_service import buyer_matching_service
from backend.app.intelligence.ai_explanation_service import ai_explanation_service

router = APIRouter(prefix="/api/crop-lots", tags=["Digital Twin & Decision Engine (Kuldeep)"])


@router.get("/{id}/digital-twin", response_model=DigitalTwinResponseSchema, summary="Get Crop Lot Digital Twin")
def get_crop_lot_digital_twin(id: str, db: Session = Depends(get_db)):
    """
    Retrieve the current Digital Twin state for a specific crop lot.
    Includes crop condition, quantity, storage duration, market price, logistics estimates, and risk flags.
    """
    twin = digital_twin_service.get_by_crop_lot_id(db=db, crop_lot_id=id)
    if not twin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Digital Twin for crop lot '{id}' not found."
        )
    return twin


@router.post("/{id}/digital-twin", response_model=DigitalTwinResponseSchema, summary="Create or Update Digital Twin")
def upsert_crop_lot_digital_twin(
    id: str,
    payload: DigitalTwinCreateUpdateSchema,
    db: Session = Depends(get_db)
):
    """
    Create or update a Digital Twin state for a given crop lot.
    Performs validation on physical quantities, urgency, quality grades, and spoilage risk.
    """
    return digital_twin_service.upsert_digital_twin(db=db, crop_lot_id=id, payload=payload)


@router.get("/{id}/recommendation", response_model=SellDecisionResponse, summary="Get Sell vs Wait Recommendation")
def get_sell_wait_recommendation(id: str, db: Session = Depends(get_db)):
    """
    Evaluates whether the farmer should sell now or hold, providing optimal days, projected net gain,
    confidence score, and transparent risk explanations.
    """
    twin = digital_twin_service.get_by_crop_lot_id(db=db, crop_lot_id=id)
    if not twin:
        if id == "lot_wheat_nashik_001":
            crop = "Wheat"
            quantity = 100.0
            current_price = 2480.0
            financial_urgency = "MEDIUM"
            spoilage_risk = "LOW"
            storage_days = 3
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop lot with id '{id}' not found."
            )
    else:
        crop = twin.crop
        quantity = twin.quantity
        current_price = twin.current_market_price
        financial_urgency = twin.financial_urgency
        spoilage_risk = twin.spoilage_risk
        storage_days = twin.storage_days

    return sell_decision_engine.evaluate_decision(
        crop_lot_id=id,
        crop=crop,
        quantity=quantity,
        current_price=current_price,
        financial_urgency=financial_urgency,
        spoilage_risk=spoilage_risk,
        storage_days=storage_days,
    )


@router.get("/{id}/net-realisation", response_model=NetRealisationResponse, summary="Calculate Crop Lot Net Realisation")
def get_crop_lot_net_realisation(
    id: str,
    offered_price: Optional[float] = Query(default=None, gt=0, description="Optional buyer offer price per quintal"),
    db: Session = Depends(get_db)
):
    """
    Calculates detailed take-home realization deducting transport, storage, commission, and spoilage.
    """
    twin = digital_twin_service.get_by_crop_lot_id(db=db, crop_lot_id=id)
    if not twin:
        if id == "lot_wheat_nashik_001":
            quantity = 100.0
            price = offered_price or 2600.0
            quality = "Grade A"
            spoilage_risk = "LOW"
            storage_days = 3
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop lot with id '{id}' not found."
            )
    else:
        quantity = twin.quantity
        price = offered_price or (twin.current_market_price if twin.current_market_price > 0 else 2480.0)
        quality = twin.quality
        spoilage_risk = twin.spoilage_risk
        storage_days = twin.storage_days

    return net_realisation_calculator.calculate(
        crop_lot_id=id,
        quantity=quantity,
        offered_price_per_q=price,
        distance_km=15.0,
        storage_days=storage_days,
        quality_grade=quality,
        spoilage_risk=spoilage_risk,
    )


@router.get("/{id}/buyers", response_model=List[BuyerMatchResponse], summary="Get 7-Factor Ranked Buyers")
def get_ranked_buyers_for_lot(id: str, db: Session = Depends(get_db)):
    """
    Ranks verified buyers for a crop lot using a 7-factor weighted algorithm:
    Quality (25%), Quantity (20%), Price (15%), Distance (15%), Reliability (10%), Delivery (10%), History (5%).
    """
    twin = digital_twin_service.get_by_crop_lot_id(db=db, crop_lot_id=id)
    if not twin:
        if id == "lot_wheat_nashik_001":
            crop = "Wheat"
            quantity = 100.0
            quality = "Grade A"
            location = "Nashik"
            current_price = 2480.0
            spoilage_risk = "LOW"
            storage_days = 3
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Crop lot with id '{id}' not found for buyer matching."
            )
    else:
        crop = twin.crop
        quantity = twin.quantity
        quality = twin.quality
        location = twin.location
        current_price = twin.current_market_price
        spoilage_risk = twin.spoilage_risk
        storage_days = twin.storage_days

    return buyer_matching_service.match_buyers_for_lot(
        db=db,
        crop=crop,
        quantity=quantity,
        quality_grade=quality,
        location=location,
        current_market_price=current_price,
        spoilage_risk=spoilage_risk,
        storage_days=storage_days,
    )


@router.get("/{id}/ai-explanation", response_model=AIExplanationResponse, summary="Get Grounded Farmer AI Explanation")
def get_farmer_ai_explanation(id: str, db: Session = Depends(get_db)):
    """
    Generates a natural, grounded explanation of market factors, price predictions,
    and why the recommended action (WAIT or SELL_NOW) maximizes the farmer's profit.
    """
    try:
        return ai_explanation_service.generate_decision_explanation(db=db, crop_lot_id=id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/{id}/negotiation-context", response_model=NegotiationTalkingPointsResponse, summary="Get Grounded Negotiation Talking Points")
def get_negotiation_talking_points(
    id: str,
    buyer_id: Optional[str] = Query(default=None, description="Optional buyer identifier"),
    db: Session = Depends(get_db)
):
    """
    Generates strategic negotiation talking points, suggested counter-offers, walkaway bounds,
    and leverage arguments for trading with a specific buyer.
    """
    try:
        return ai_explanation_service.generate_negotiation_context(
            db=db,
            crop_lot_id=id,
            buyer_id=buyer_id
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


# Standalone calculation router for arbitrary buyer/marketplace scenarios
standalone_net_router = APIRouter(prefix="/api/net-realisation", tags=["Net Realisation (Kuldeep)"])


@standalone_net_router.post("/calculate", response_model=NetRealisationResponse, summary="Calculate Arbitrary Net Realisation")
def calculate_custom_net_realisation(payload: NetRealisationRequest):
    """
    Standalone endpoint to calculate take-home profit for arbitrary offer prices and parameters.
    Can be called by Ishan's marketplace/negotiation module.
    """
    return net_realisation_calculator.calculate(
        crop_lot_id=payload.crop_lot_id,
        quantity=payload.quantity,
        offered_price_per_q=payload.offered_price_per_q,
        distance_km=payload.distance_km,
        storage_days=payload.storage_days,
        quality_grade=payload.quality_grade,
        spoilage_risk=payload.spoilage_risk,
    )


# Standalone buyer match router for arbitrary requirements
standalone_buyer_router = APIRouter(prefix="/api/buyer-matches", tags=["Buyer Matching (Kuldeep)"])


@standalone_buyer_router.post("", response_model=List[BuyerMatchResponse], summary="Custom Buyer Matching on Demand")
def match_buyers_custom(payload: BuyerMatchRequest, db: Session = Depends(get_db)):
    """
    On-demand ranking of buyers for custom crop requirements.
    """
    return buyer_matching_service.match_buyers_for_lot(
        db=db,
        crop=payload.crop,
        quantity=payload.quantity,
        quality_grade=payload.quality_grade,
        location=payload.location,
        current_market_price=payload.current_market_price,
        spoilage_risk=payload.spoilage_risk,
    )
