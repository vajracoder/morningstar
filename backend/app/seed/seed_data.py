"""
Seed Data Loader for KrishiPulse.
Populates standard demo records for Farmer Rajesh, Crop Lot, Digital Twin, and APMC Markets.
"""
from datetime import date, timedelta, datetime, timezone
from database.session import engine, SessionLocal, Base
from database.models import (
    UserModel,
    FarmerProfileModel,
    CropLotModel,
    DigitalTwinModel,
    MarketModel,
    MarketPriceModel,
    BuyerModel,
    BuyerMatchModel,
)


def init_db_and_seed():
    """Initializes tables and seeds standard demo fixtures."""
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        existing_user = db.query(UserModel).filter(UserModel.id == "farmer_rajesh_001").first()
        if existing_user:
            return

        today = date.today()
        three_days_ago = today - timedelta(days=3)

        # 1. Create Farmer Rajesh
        user_rajesh = UserModel(
            id="farmer_rajesh_001",
            name="Rajesh",
            phone="+919876543210",
            role="FARMER",
            created_at=datetime.now(timezone.utc),
        )
        db.add(user_rajesh)

        # 2. Farmer Profile
        profile_rajesh = FarmerProfileModel(
            id="fp_rajesh_001",
            user_id="farmer_rajesh_001",
            district="Nashik",
            state="Maharashtra",
            land_size_acres=5.0,
            primary_crops=["Wheat", "Soybean"],
        )
        db.add(profile_rajesh)

        # 3. Crop Lot: Wheat 100 quintal Grade A
        crop_lot = CropLotModel(
            id="lot_wheat_nashik_001",
            farmer_id="farmer_rajesh_001",
            commodity="Wheat",
            variety="Lokwan",
            quantity=100.0,
            quantity_unit="quintal",
            quality_grade="Grade A",
            harvest_date=three_days_ago,
            storage_location="On-farm dry storage",
            status="ANALYZED",
            created_at=datetime.now(timezone.utc),
        )
        db.add(crop_lot)

        # 4. Digital Twin
        digital_twin = DigitalTwinModel(
            id="dt_lot_wheat_nashik_001",
            farmer_id="farmer_rajesh_001",
            crop_lot_id="lot_wheat_nashik_001",
            crop="Wheat",
            quantity=100.0,
            location="Nashik",
            quality="Grade A",
            harvest_date=three_days_ago,
            storage_days=3,
            financial_urgency="MEDIUM",
            current_market_price=2480.0,
            buyer_demand="HIGH",
            transport_estimate=6800.0,
            spoilage_risk="LOW",
            forecast_summary={
                "forecast_1d": 2495.0,
                "forecast_3d": 2520.0,
                "forecast_7d": 2570.0,
                "forecast_14d": 2540.0,
                "confidence": 0.78,
                "note": "Simulated demo projection"
            },
            last_synced_at=datetime.now(timezone.utc),
        )
        db.add(digital_twin)

        # 5. APMC Markets & Prices
        markets_info = [
            {
                "id": "mkt_nashik_001",
                "name": "Nashik APMC",
                "district": "Nashik",
                "state": "Maharashtra",
                "lat": 19.9975,
                "lng": 73.7898,
                "modal": 2480.0,
                "min": 2350.0,
                "max": 2550.0,
                "arrivals": 450.0,
            },
            {
                "id": "mkt_pune_002",
                "name": "Pune Gultekdi APMC",
                "district": "Pune",
                "state": "Maharashtra",
                "lat": 18.5204,
                "lng": 73.8567,
                "modal": 2510.0,
                "min": 2380.0,
                "max": 2590.0,
                "arrivals": 600.0,
            },
            {
                "id": "mkt_vashi_003",
                "name": "Mumbai Vashi APMC",
                "district": "Navi Mumbai",
                "state": "Maharashtra",
                "lat": 19.0760,
                "lng": 72.8777,
                "modal": 2560.0,
                "min": 2420.0,
                "max": 2650.0,
                "arrivals": 850.0,
            },
            {
                "id": "mkt_lasalgaon_004",
                "name": "Lasalgaon APMC",
                "district": "Nashik",
                "state": "Maharashtra",
                "lat": 20.1472,
                "lng": 74.2289,
                "modal": 2460.0,
                "min": 2320.0,
                "max": 2510.0,
                "arrivals": 300.0,
            },
        ]

        for m_data in markets_info:
            market = MarketModel(
                id=m_data["id"],
                name=m_data["name"],
                district=m_data["district"],
                state=m_data["state"],
                latitude=m_data["lat"],
                longitude=m_data["lng"],
                created_at=datetime.now(timezone.utc),
            )
            db.add(market)

            price = MarketPriceModel(
                id=f"price_{m_data['id']}_wheat",
                market_id=m_data["id"],
                commodity="Wheat",
                variety="Lokwan",
                modal_price=m_data["modal"],
                min_price=m_data["min"],
                max_price=m_data["max"],
                unit="INR/quintal",
                arrivals_tonnes=m_data["arrivals"],
                demand_level="HIGH",
                recorded_date=today,
                is_simulated=True,
            )
            db.add(price)

        # 6. Demo Buyers (ABC Foods, XYZ Agro, Pune Retail Chain)
        buyers_info = [
            {
                "id": "buyer_001",
                "name": "Suresh Gupta",
                "company_name": "ABC Foods Pvt Ltd",
                "location": "Pune Industrial Area",
                "district": "Pune",
                "lat": 18.5204,
                "lng": 73.8567,
                "preferred_crops": ["Wheat", "Maize"],
                "accepted_grades": ["Grade A"],
                "min_qty": 50.0,
                "max_qty": 500.0,
                "base_price": 2570.0,
                "reliability": 0.98,
                "delivery_pref": "MANDI_DELIVERY",
                "dispute_free": 98,
                "total_trades": 100,
            },
            {
                "id": "buyer_002",
                "name": "Vikram Patel",
                "company_name": "XYZ Agro Industries",
                "location": "Nashik MIDC",
                "district": "Nashik",
                "lat": 19.9975,
                "lng": 73.7898,
                "preferred_crops": ["Wheat", "Soybean"],
                "accepted_grades": ["Grade A", "Grade B"],
                "min_qty": 20.0,
                "max_qty": 300.0,
                "base_price": 2530.0,
                "reliability": 0.92,
                "delivery_pref": "FARMGATE",
                "dispute_free": 46,
                "total_trades": 50,
            },
            {
                "id": "buyer_003",
                "name": "Anil Sharma",
                "company_name": "Pune Retail Chain",
                "location": "Kothrud, Pune",
                "district": "Pune",
                "lat": 18.5074,
                "lng": 73.8077,
                "preferred_crops": ["Wheat", "Basmati Rice"],
                "accepted_grades": ["Grade A"],
                "min_qty": 10.0,
                "max_qty": 80.0,
                "base_price": 2590.0,
                "reliability": 0.88,
                "delivery_pref": "MANDI_DELIVERY",
                "dispute_free": 22,
                "total_trades": 25,
            },
        ]

        for b_data in buyers_info:
            buyer = BuyerModel(
                id=b_data["id"],
                name=b_data["name"],
                company_name=b_data["company_name"],
                location=b_data["location"],
                district=b_data["district"],
                latitude=b_data["lat"],
                longitude=b_data["lng"],
                preferred_commodities=b_data["preferred_crops"],
                accepted_grades=b_data["accepted_grades"],
                min_quantity=b_data["min_qty"],
                max_quantity=b_data["max_qty"],
                base_offer_price=b_data["base_price"],
                reliability_score=b_data["reliability"],
                delivery_preference=b_data["delivery_pref"],
                dispute_free_trades=b_data["dispute_free"],
                total_trades=b_data["total_trades"],
                verification_status="VERIFIED",
                created_at=datetime.now(timezone.utc),
            )
            db.add(buyer)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    init_db_and_seed()
    print("Database initialized and demo data seeded successfully.")
