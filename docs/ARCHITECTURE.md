# KrishiPulse System Architecture

## 1. Overview
KrishiPulse is an AI-powered agricultural market intelligence and transaction platform (Morning Star — SIH 2026).
The platform guides the farmer through:
`Farmer → Crop Lot → Quality → Market Intelligence → Forecast → Sell/Wait → Net Realisation → Buyer Matching → Negotiation → Transaction → Logistics → Payment → Trust`

---

## 2. Parallel Workstream Architecture

```
                 KRISHIPULSE
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
    TILAK         KULDEEP        ISHAN
   FRONTEND        AI/ML       MARKETPLACE
  (UI/Shell)    (Intelligence) (Transaction)
       │             │             │
       │       API CONTRACTS       │
       │◄────────────┴────────────►│
       │                           │
       └─────────────┬─────────────┘
                     ▼
             INTEGRATED APP
```

### Workstream Ownership
1. **Tilak (Frontend & UI Integration)**:
   - Frontend React + Vite + Tailwind application (`frontend/`).
   - Farmer Dashboard, Market Visualizations, Marketplace UI, Demo Mode.
2. **Kuldeep (Market Intelligence & AI/ML)**:
   - Market Data Layer & APMC Ingestion (`backend/app/market/`).
   - Crop Lot Digital Twin (`backend/app/intelligence/`).
   - Multi-horizon Price Forecasting (`backend/app/forecasting/`, `ml/`).
   - Sell/Wait Decision Engine & Net Realisation (`backend/app/intelligence/`).
   - 7-Factor Buyer Matching Algorithm (`backend/app/intelligence/`).
3. **Ishan (Marketplace, Transactions, Trust)**:
   - Buyer Profiles & Verification (`backend/app/buyers/`).
   - Offers, Counter-offers & Negotiation (`backend/app/marketplace/`).
   - Contracts, Logistics, Payments (`backend/app/transactions/`, `backend/app/logistics/`).
   - Trust Scoring & Dispute Resolution (`backend/app/trust/`).

---

## 3. Kuldeep's Intelligence Pipeline

```text
Market Data Providers (Seed / Agmarknet)
        ↓
Data Normalization & Cleaning
        ↓
Database Persistence (SQLAlchemy)
        ↓
Market Intelligence Service
        ↓
Crop Lot Digital Twin State
        ↓
Multi-horizon Forecasting (1d, 3d, 7d, 14d)
        ↓
Net Realisation Calculator
        ↓
Sell / Wait Decision Engine
        ↓
7-Factor Buyer Matching & Grounded AI Advice
```

---

## 4. Design & Reliability Principles
- **Replaceable Services**: ML models and external APIs sit strictly behind abstract provider interfaces (`MarketDataProvider`, `WeatherProvider`, `ForecastService`).
- **Explainability**: No black-box AI decisions for money. All recommendations, net realisations, and buyer match scores contain human-readable transparent reasoning.
- **Zero Hallucination**: AI advice and negotiation wording generators strictly use verified backend facts injected into structured prompts.
