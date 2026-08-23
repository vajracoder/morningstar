"""
FastAPI Router for Digital Twin Endpoints.
Adheres strictly to docs/API_CONTRACTS.md.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.session import get_db
from backend.app.intelligence.schemas import DigitalTwinCreateUpdateSchema, DigitalTwinResponseSchema
from backend.app.intelligence.digital_twin import digital_twin_service

router = APIRouter(prefix="/api/crop-lots", tags=["Digital Twin (Kuldeep)"])


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
