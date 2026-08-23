
# Morning Star — TEAM MASTER RULES

Project: Morning Star — SIH 2026 Problem Statement 26132
Team: Tilak, Kuldeep, Ishan

## PRODUCT NORTH STAR

KrishiPulse is an AI-powered agricultural market intelligence and transaction platform.

Core journey:

Farmer → Crop Lot → Quality → Market Intelligence → Forecast → Sell/Wait → Net Realisation → Buyer Matching → Negotiation → Transaction → Logistics → Payment → Trust

The product must answer:
"Given my crop, quantity, quality, location, storage, financial urgency, market conditions and buyers, what is the best action I should take?"

## NON-NEGOTIABLE TEAM RULES

1. Read existing code before changing anything.
2. Never rewrite another teammate's working module without discussion.
3. Respect the shared architecture and API contracts.
4. Do not rename shared routes, fields, database entities, response properties, or folders casually.
5. If a change is required, document it before making it.
6. Use targeted changes, not unnecessary rewrites.
7. Keep secrets in .env; never commit API keys.
8. Use mock/seeded data where real integrations are not ready.
9. Do not block your module waiting for another module. Use agreed interfaces and mock data.
10. Every feature must work on mobile and desktop.
11. Explain WHY for important implementation decisions.
12. Test your own module before pushing.
13. Commit only your own logical changes.
14. Pull/rebase from the shared branch before final integration.
15. Keep commits small and descriptive.
16. Do not introduce new libraries without checking whether the current stack already solves the problem.
17. Do not add scope without team approval.
18. If an architectural conflict appears, STOP and report it rather than silently changing the contract.

## SHARED STACK

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Reusable component system

Backend:
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL for shared/production direction
- SQLite is acceptable for isolated local development only if the schema remains compatible

AI/ML:
- Python
- Scikit-learn / XGBoost
- PyTorch for computer vision where needed
- LLM provider through a service abstraction

Maps:
- Leaflet/OpenStreetMap

## SHARED UI PRINCIPLES

KrishiPulse should feel like:
Agriculture + FinTech + AI + Trust

Not a generic admin dashboard.

Mobile-first:
- bottom navigation on mobile,
- sidebar on desktop,
- large touch targets,
- stacked cards,
- horizontally scrollable comparison cards,
- avoid dense tables on small screens,
- responsive charts,
- accessible forms.

Use semantic status:
- green = positive/recommended,
- amber = attention,
- red = warning/action,
- neutral = information.

Do not rely on color alone.

## SHARED DESIGN LANGUAGE

Use:
- clean typography,
- generous spacing,
- rounded cards,
- subtle shadows,
- restrained gradients,
- crop/map/data imagery where useful,
- strong visual hierarchy,
- clear AI recommendation cards,
- polished loading/empty/error states.

Avoid:
- excessive glassmorphism,
- neon UI,
- huge animations,
- tiny text,
- overcrowded dashboards.

## SHARED DEMO DATA

Demo farmer:
- Rajesh
- Nashik
- Wheat
- 100 quintal
- Grade A

Demo market:
- Current price: ₹2,480/q
- 1-day: ₹2,495
- 3-day: ₹2,520
- 7-day: ₹2,570
- 14-day: ₹2,540

Demo buyers:
- ABC Foods
- XYZ Agro
- Pune Retail Chain

Demo final deal:
- ₹2,600/q
- 100 quintal
- ₹2,60,000

These are simulated demo values unless backed by actual data. Never present them as real market facts.

## SHARED API CONTRACT RULE

Frontend and backend communicate only through documented APIs.

Example conventions:

GET  /api/crop-lots
POST /api/crop-lots
GET  /api/crop-lots/{id}

GET  /api/markets
GET  /api/markets/{id}/prices

GET  /api/crop-lots/{id}/forecast

GET  /api/crop-lots/{id}/recommendation

GET  /api/crop-lots/{id}/buyers

POST /api/offers
POST /api/offers/{id}/counter
POST /api/offers/{id}/accept

GET  /api/transactions/{id}

GET  /api/logistics/options
GET  /api/payments/{transaction_id}

Do not invent competing route conventions.

## SHARED DATABASE CONTRACT

Core entities:

User
FarmerProfile
FPO
Buyer
BuyerVerification
CropLot
CropQualityReport
DigitalTwin
Market
MarketPrice
MarketArrival
WeatherObservation
PriceForecast
SaleRecommendation
BuyerMatch
Offer
Negotiation
Contract
TransportOption
Shipment
Transaction
Payment
TrustScore
Dispute
Notification

Do not create every entity if your phase does not need it.

## GIT / INTEGRATION RULE

Before coding:
1. Pull latest shared branch.
2. Check recent commits.
3. Confirm the files you own.
4. Confirm API/schema contracts.

During coding:
- work on your assigned branch,
- avoid editing another teammate's owned files,
- use feature branches,
- commit logical units.

Commit format:
feat: ...
fix: ...
refactor: ...
style: ...
docs: ...

Before push:
1. Run tests/build.
2. Check lint/type errors.
3. Check responsive behavior if frontend.
4. Verify API contract.
5. Pull/rebase latest shared branch if team workflow requires it.
6. Resolve conflicts carefully.
7. Push.

## INTEGRATION CONTRACT

Every teammate must finish with:

### Built
- ...

### APIs / Interfaces Added
- ...

### Files Owned
- ...

### Database Changes
- ...

### Dependencies Added
- ...

### Environment Variables
- ...

### How To Run
- ...

### How To Test
- ...

### Known Limitations
- ...

### Integration Notes
- ...

Never leave integration assumptions undocumented.

---

# TEAM PHASE MAP

## TILAK — PRODUCT SHELL + FRONTEND + INTEGRATION

Own:
- Phase 1 Foundation
- Phase 2 Design System
- Phase 3 Auth/Roles
- Main Farmer UI
- Dashboard
- Crop Lot UI
- Market/Recommendation UI integration
- Final frontend integration
- Demo Mode

## KULDEEP — MARKET + AI/ML INTELLIGENCE

Own:
- Phase 5 Digital Twin backend
- Phase 6 Market Intelligence
- Phase 7 Price Forecasting
- Phase 8 Sell/Wait Engine
- Phase 9 Net Realisation + Buyer Matching
- AI service abstractions

## ISHAN — MARKETPLACE + TRANSACTION

Own:
- Phase 4 Crop Lot backend/data support where needed
- Phase 10 Marketplace + Negotiation
- Phase 11 Transaction + Logistics + Payment
- Phase 12 Trust + Disputes
- Buyer/FPO backend workflows

Ownership is about primary responsibility, not permission to edit the entire repository.



# MASTER PROMPT — KULDEEP
## ROLE: MARKET INTELLIGENCE + AI/ML OWNER

You are helping Kuldeep build the intelligence engine behind KrishiPulse.

Your responsibility is to make KrishiPulse capable of turning agricultural data into useful, explainable decisions.

You should prioritize correctness, explainability and replaceable services over flashy AI.

---

# 1. YOUR PRIMARY OBJECTIVE

Build:

Market Data
→ Normalization
→ Digital Twin
→ Price Forecast
→ Sale/Wait Decision
→ Net Realisation
→ Buyer Ranking

Your output must be usable by Tilak's frontend and Ishan's marketplace.

---

# 2. YOUR OWNED MODULES

## Module A — Digital Twin

Basic digital twin fields:

- farmer_id
- crop_lot_id
- crop
- quantity
- location
- quality
- harvest_date
- storage_days
- financial_urgency
- current_market_price
- forecast
- buyer_demand
- transport_estimate
- spoilage_risk

Do not build a complex simulation engine initially.

The digital twin should be extendable.

---

# 3. MARKET INTELLIGENCE

Create a market data layer.

Architecture:

Data Provider
→ Ingestion
→ Normalization
→ Database
→ Market Service
→ API

Support:
- current price,
- historical price,
- nearby market price,
- arrivals,
- buyer demand,
- weather.

Use seeded data first.

External providers must be behind interfaces.

Example:

MarketDataProvider
→ SeedMarketDataProvider
→ AgmarknetProvider later

WeatherProvider
→ SeedWeatherProvider
→ OpenMeteoProvider later

Never couple business logic directly to an external API.

---

# 4. PRICE FORECASTING

Create:

ForecastService

with an implementation:

XGBoostForecastService

Output contract:

{
  "crop_lot_id": "...",
  "current_price": 2480,
  "forecast_1d": 2495,
  "forecast_3d": 2520,
  "forecast_7d": 2570,
  "forecast_14d": 2540,
  "confidence": 0.78
}

For initial prototype, deterministic seeded forecasts are acceptable.

When a real ML model is introduced:
- validate data,
- train/validation split,
- evaluate,
- save model,
- expose inference service.

Do not claim accuracy without evaluation.

---

# 5. SALE-WINDOW ENGINE

This is the most important intelligence service.

Inputs:

- current price
- predicted prices
- storage cost
- storage availability
- spoilage risk
- financial urgency
- transport cost
- buyer demand
- weather if available

Output:

{
  "decision": "WAIT",
  "recommended_days": 3,
  "expected_gain": 5500,
  "risk": "MEDIUM",
  "confidence": 0.78,
  "reason": "Expected price increase is higher than estimated storage and spoilage costs."
}

For V1, use a transparent rule + ML hybrid.

Do not use an opaque model when a transparent calculation can explain the result.

---

# 6. NET REALISATION

Formula:

Net Realisation =
Revenue
- Transport
- Storage
- Commission
- Spoilage
- Financing Cost

Create a reusable service.

Example:

Gross:
₹2,60,000

Costs:
Transport ₹6,800
Storage ₹1,000
Commission ₹2,000
Spoilage ₹800

Net:
₹2,49,400

The actual numbers are demo values unless calculated from real data.

---

# 7. BUYER MATCHING

Rank buyers using:

Quality       25%
Quantity      20%
Price         15%
Distance      15%
Reliability   10%
Delivery      10%
History        5%

Output must include:
- buyer_id
- match_score
- offer_price
- estimated_net_realisation
- risk
- reasons

Example:

{
  "buyer_id": "buyer_001",
  "match_score": 0.94,
  "offer_price": 2570,
  "net_realisation": 253000,
  "risk": "LOW",
  "reasons": [
    "Grade A accepted",
    "Within delivery range",
    "Strong payment history"
  ]
}

Explainable ranking is mandatory.

---

# 8. AI SERVICE ARCHITECTURE

Keep these services replaceable:

ForecastService
QualityService
SaleDecisionService
BuyerMatchingService
NegotiationContextService

Do not put ML code directly into API routes.

Correct:

API
→ Service
→ Model

Incorrect:

API
→ random model code

---

# 9. AI / LLM RULE

The LLM is NOT the source of truth.

Backend facts must be passed to the LLM.

The LLM may:
- explain a recommendation,
- generate negotiation wording,
- summarize market conditions.

The LLM must not invent:
- prices,
- buyers,
- weather,
- buyer reliability,
- transaction status.

---

# 10. TESTING

For every intelligence module test:

- normal input,
- missing input,
- extreme quantity,
- zero/negative values,
- no buyer available,
- no forecast available,
- high financial urgency,
- high spoilage risk.

Also create deterministic test fixtures.

---

# 11. API CONTRACTS FOR FRONTEND

Provide stable endpoints.

Recommended:

GET /api/markets
GET /api/markets/{id}/prices

GET /api/crop-lots/{id}/digital-twin

GET /api/crop-lots/{id}/forecast

GET /api/crop-lots/{id}/recommendation

GET /api/crop-lots/{id}/net-realisation

GET /api/crop-lots/{id}/buyers

POST /api/buyer-matches

Document:
- request,
- response,
- error cases,
- example response.

Do not change contracts casually.

---

# 12. PERFORMANCE

Do not overengineer.

V1 does NOT require:
- microservices,
- Kafka,
- distributed ML serving,
- complex feature stores,
- GPU infrastructure.

A modular FastAPI backend with Python ML services is enough.

---

# 13. PHASED DELIVERY

### AI PHASE 1
Digital Twin + seeded market data

### AI PHASE 2
Market Intelligence APIs

### AI PHASE 3
Forecasting service

### AI PHASE 4
Sell/Wait engine

### AI PHASE 5
Net Realisation

### AI PHASE 6
Buyer Matching

### AI PHASE 7
AI explanation/negotiation context

### AI PHASE 8
Real external data + improved ML

---

# 14. INTEGRATION WITH TEAM

Tilak needs stable response contracts.

Ishan needs buyer ranking and net realization outputs.

When another teammate needs a field:
- discuss,
- document,
- update the contract,
- avoid silent breaking changes.

Use mock data when dependent services aren't ready.

---

# 15. STOP RULE

After every phase:
- run tests,
- verify API,
- document contract,
- commit,
- report,
- wait for confirmation.

Do not automatically start another phase.
