# KrishiPulse — API Contracts & Specifications

This document serves as the team's single source of truth for REST API contracts between **Tilak (Frontend)**, **Kuldeep (AI/Market Intelligence)**, and **Ishan (Marketplace/Transactions)**.

---

## 1. Market Intelligence Endpoints (Owner: Kuldeep)

### `GET /api/markets`
- **Consumer**: Tilak (Frontend)
- **Query Params**:
  - `commodity` (optional string, default: "Wheat")
  - `location` (optional string, e.g. "Nashik")
- **Response**: `200 OK`
```json
[
  {
    "id": "mkt_nashik_001",
    "name": "Nashik APMC",
    "district": "Nashik",
    "state": "Maharashtra",
    "distance_km": 15.0,
    "commodity": "Wheat",
    "modal_price": 2480.0,
    "min_price": 2350.0,
    "max_price": 2550.0,
    "unit": "INR/quintal",
    "arrivals_tonnes": 450.0,
    "demand_level": "HIGH",
    "updated_at": "2026-08-23T10:00:00Z"
  }
]
```

---

### `GET /api/markets/{id}/prices`
- **Consumer**: Tilak (Frontend)
- **Query Params**:
  - `commodity` (optional string, default: "Wheat")
  - `days` (optional int, default: 14)
- **Response**: `200 OK`
```json
{
  "market_id": "mkt_nashik_001",
  "market_name": "Nashik APMC",
  "commodity": "Wheat",
  "current_price": 2480.0,
  "min_price": 2350.0,
  "max_price": 2550.0,
  "unit": "INR/quintal",
  "price_history": [
    {"date": "2026-08-16", "modal_price": 2440.0, "arrivals_tonnes": 410.0},
    {"date": "2026-08-20", "modal_price": 2465.0, "arrivals_tonnes": 435.0},
    {"date": "2026-08-23", "modal_price": 2480.0, "arrivals_tonnes": 450.0}
  ],
  "is_simulated_demo": true
}
```

---

## 2. Digital Twin Endpoints (Owner: Kuldeep)

### `GET /api/crop-lots/{id}/digital-twin`
- **Consumer**: Tilak (Frontend), Ishan (Marketplace)
- **Response**: `200 OK`
```json
{
  "farmer_id": "farmer_rajesh_001",
  "crop_lot_id": "lot_wheat_nashik_001",
  "crop": "Wheat",
  "quantity": 100.0,
  "quantity_unit": "quintal",
  "location": "Nashik",
  "quality": "Grade A",
  "harvest_date": "2026-08-20",
  "storage_days": 3,
  "financial_urgency": "MEDIUM",
  "current_market_price": 2480.0,
  "buyer_demand": "HIGH",
  "transport_estimate": 6800.0,
  "spoilage_risk": "LOW",
  "forecast": null,
  "updated_at": "2026-08-23T12:00:00Z"
}
```

### `POST /api/crop-lots/{id}/digital-twin`
- **Consumer**: Tilak (Frontend)
- **Body**: Digital Twin payload for creating or updating lot state.
- **Response**: `200 OK` or `201 Created`

---

## 3. Price Forecasting Endpoints (Owner: Kuldeep — Phase 2+)

### `GET /api/crop-lots/{id}/forecast`
- **Consumer**: Tilak (Frontend)
- **Response**: `200 OK`
```json
{
  "crop_lot_id": "lot_wheat_nashik_001",
  "crop": "Wheat",
  "current_price": 2480.0,
  "forecast_1d": 2495.0,
  "forecast_3d": 2520.0,
  "forecast_7d": 2570.0,
  "forecast_14d": 2540.0,
  "confidence": 0.78,
  "trend": "BULLISH_SHORT_TERM",
  "is_simulated_demo": true
}
```

---

## 4. Sell/Wait Recommendation Endpoints (Owner: Kuldeep — Phase 3+)

### `GET /api/crop-lots/{id}/recommendation`
- **Consumer**: Tilak (Frontend)
- **Response**: `200 OK`
```json
{
  "decision": "WAIT",
  "recommended_days": 3,
  "expected_gain": 5500.0,
  "confidence": 0.78,
  "risk": "MEDIUM",
  "reason": "Expected price increase is higher than estimated storage and spoilage costs.",
  "projected_price": 2520.0,
  "net_benefit_breakdown": {
    "gross_gain": 4000.0,
    "storage_cost": 300.0,
    "spoilage_cost": 200.0,
    "net_gain": 3500.0
  }
}
```

---

## 5. Net Realisation Endpoints (Owner: Kuldeep — Phase 3+)

### `GET /api/crop-lots/{id}/net-realisation`
- **Consumer**: Tilak (Frontend), Ishan (Marketplace)
- **Response**: `200 OK`
```json
{
  "crop_lot_id": "lot_wheat_nashik_001",
  "quantity": 100.0,
  "offered_price_per_q": 2600.0,
  "gross_revenue": 260000.0,
  "deductions": {
    "transport": 6800.0,
    "storage": 1000.0,
    "commission": 2000.0,
    "spoilage": 800.0,
    "financing": 0.0
  },
  "total_deductions": 10600.0,
  "net_realisation": 249400.0,
  "net_price_per_q": 2494.0
}
```

---

## 6. Buyer Matching Endpoints (Owner: Kuldeep / Ishan — Phase 4+)

### `GET /api/crop-lots/{id}/buyers`
- **Consumer**: Tilak (Frontend), Ishan (Marketplace)
- **Response**: `200 OK`
```json
[
  {
    "buyer_id": "buyer_001",
    "name": "ABC Foods Pvt Ltd",
    "location": "Pune",
    "distance_km": 160.0,
    "match_score": 0.94,
    "offer_price": 2570.0,
    "estimated_net_realisation": 253000.0,
    "risk": "LOW",
    "reasons": [
      "Grade A accepted",
      "Within delivery range",
      "Strong payment history (98% on-time)"
    ]
  }
]
```
