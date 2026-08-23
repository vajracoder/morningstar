"""
Digital Twin Service Layer.
Manages the living digital representation of a farmer's crop lot.
"""
from datetime import datetime, date, timezone
from typing import Optional
from sqlalchemy.orm import Session
from database.models import DigitalTwinModel, CropLotModel, UserModel
from backend.app.intelligence.schemas import DigitalTwinCreateUpdateSchema, DigitalTwinResponseSchema
from backend.app.market.service import market_service


class DigitalTwinService:
    """
    Service to manage Digital Twin state for crop lots.
    """

    def get_by_crop_lot_id(self, db: Session, crop_lot_id: str) -> Optional[DigitalTwinResponseSchema]:
        """Fetch the Digital Twin associated with a crop lot ID."""
        twin = db.query(DigitalTwinModel).filter(DigitalTwinModel.crop_lot_id == crop_lot_id).first()
        if not twin:
            return None
        return self._to_schema(twin)

    def upsert_digital_twin(
        self,
        db: Session,
        crop_lot_id: str,
        payload: DigitalTwinCreateUpdateSchema
    ) -> DigitalTwinResponseSchema:
        """Create or update a digital twin for a given crop lot."""
        twin = db.query(DigitalTwinModel).filter(DigitalTwinModel.crop_lot_id == crop_lot_id).first()

        # Parse harvest_date
        try:
            h_date = date.fromisoformat(payload.harvest_date)
        except Exception:
            h_date = date.today()

        if not twin:
            twin_id = f"dt_{crop_lot_id}"
            twin = DigitalTwinModel(
                id=twin_id,
                farmer_id=payload.farmer_id,
                crop_lot_id=crop_lot_id,
                crop=payload.crop,
                quantity=payload.quantity,
                location=payload.location,
                quality=payload.quality,
                harvest_date=h_date,
                storage_days=payload.storage_days,
                financial_urgency=payload.financial_urgency,
                current_market_price=payload.current_market_price,
                buyer_demand=payload.buyer_demand,
                transport_estimate=payload.transport_estimate,
                spoilage_risk=payload.spoilage_risk,
                forecast_summary=payload.forecast,
                last_synced_at=datetime.now(timezone.utc),
            )
            db.add(twin)
        else:
            twin.farmer_id = payload.farmer_id
            twin.crop = payload.crop
            twin.quantity = payload.quantity
            twin.location = payload.location
            twin.quality = payload.quality
            twin.harvest_date = h_date
            twin.storage_days = payload.storage_days
            twin.financial_urgency = payload.financial_urgency
            twin.current_market_price = payload.current_market_price
            twin.buyer_demand = payload.buyer_demand
            twin.transport_estimate = payload.transport_estimate
            twin.spoilage_risk = payload.spoilage_risk
            if payload.forecast is not None:
                twin.forecast_summary = payload.forecast
            twin.last_synced_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(twin)
        return self._to_schema(twin)

    def _to_schema(self, twin: DigitalTwinModel) -> DigitalTwinResponseSchema:
        return DigitalTwinResponseSchema(
            id=twin.id,
            farmer_id=twin.farmer_id,
            crop_lot_id=twin.crop_lot_id,
            crop=twin.crop,
            quantity=twin.quantity,
            quantity_unit="quintal",
            location=twin.location,
            quality=twin.quality,
            harvest_date=twin.harvest_date.isoformat() if twin.harvest_date else date.today().isoformat(),
            storage_days=twin.storage_days,
            financial_urgency=twin.financial_urgency,
            current_market_price=twin.current_market_price,
            buyer_demand=twin.buyer_demand,
            transport_estimate=twin.transport_estimate,
            spoilage_risk=twin.spoilage_risk,
            forecast=twin.forecast_summary,
            updated_at=twin.last_synced_at.isoformat() if twin.last_synced_at else datetime.now(timezone.utc).isoformat(),
        )


digital_twin_service = DigitalTwinService()
