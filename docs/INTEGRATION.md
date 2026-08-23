# KrishiPulse — Team Integration Guide

## 1. How Teammates Integrate with Kuldeep's AI/Market Services

### For Tilak (Frontend UI Shell & Dashboards)
- **Local Dev Server**: Backend runs at `http://localhost:8000`.
- **CORS**: Configured to permit requests from Vite default dev server `http://localhost:5173`.
- **Interactive Swagger Docs**: Browse `http://localhost:8000/docs` to inspect live request/response schemas.
- **Key Frontend Consumed Endpoints**:
  - `GET /api/markets`
  - `GET /api/markets/{id}/prices`
  - `GET /api/crop-lots/{id}/digital-twin`
  - `GET /api/crop-lots/{id}/forecast` (Phase 2+)
  - `GET /api/crop-lots/{id}/recommendation` (Phase 3+)
  - `GET /api/crop-lots/{id}/net-realisation` (Phase 3+)
  - `GET /api/crop-lots/{id}/buyers` (Phase 4+)

### For Ishan (Marketplace, Negotiation & Transactions)
- **Integration Points**:
  - **Buyer Matching**: Ishan's buyer verification and profile data feed into Kuldeep's `GET /api/crop-lots/{id}/buyers` matching algorithm.
  - **Counter-Offer & Net Realisation**: Ishan can call Kuldeep's net realisation calculator when evaluating buyer counter-offers to display exact farmer take-home profit.

---

## 2. Standard Demo Seed Fixture

### Demo Farmer
- **Name**: Rajesh
- **District**: Nashik, Maharashtra
- **Crop**: Wheat
- **Lot ID**: `lot_wheat_nashik_001`
- **Quantity**: 100 quintal
- **Quality**: Grade A
- **Harvest Date**: 2026-08-20

### Demo Market (Nashik APMC)
- **Market ID**: `mkt_nashik_001`
- **Current Modal Price**: ₹2,480 / quintal
- **1-Day Simulated**: ₹2,495 / quintal
- **3-Day Simulated**: ₹2,520 / quintal
- **7-Day Simulated**: ₹2,570 / quintal
- **14-Day Simulated**: ₹2,540 / quintal
