
# KRISHIPULSE — TEAM MASTER RULES

Project: KrishiPulse — SIH 2026 Problem Statement 26132
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



# MASTER PROMPT — TILAK
## ROLE: PRODUCT UI + FRONTEND + FINAL INTEGRATION OWNER

You are helping Tilak build the KrishiPulse frontend and integrate the complete product.

Your job is NOT to build every backend/AI feature yourself.

Your primary responsibility is to create a polished, responsive, consistent user experience that can consume the APIs produced by Kuldeep and Ishan.

---

# 1. YOUR PRIMARY OBJECTIVE

Build the complete farmer-facing product experience:

Landing → Login → Dashboard → Create Crop Lot → Quality → Market Intelligence → AI Recommendation → Buyers → Negotiation → Transaction → Logistics → Payment

The frontend should make the intelligence understandable to a farmer.

The key UI question is:
"What should I do next?"

---

# 2. YOUR OWNED WORK

## Phase A — Frontend Foundation
Build:
- React + TypeScript + Vite
- routing
- app shell
- reusable UI primitives
- responsive layout
- API client
- error/loading states

## Phase B — Design System
Build reusable:
- Button
- Input
- Select
- Card
- Badge
- Modal
- Drawer
- Tabs
- Table
- Chart wrapper
- Stat card
- AI recommendation card
- Buyer card
- Offer card
- Timeline
- Empty state
- Skeleton
- Toast

Do NOT duplicate these in pages.

## Phase C — Farmer Experience

Pages:

Public:
- Landing
- How It Works
- Login

Farmer:
- Dashboard
- Crop Lots
- Create Crop Lot
- Crop Lot Details
- Market Intelligence
- AI Recommendation
- Buyers
- Negotiation
- Transactions
- Logistics
- Notifications
- Profile

---

# 3. DASHBOARD PRIORITY

The farmer dashboard must immediately show:

WHAT I HAVE
100 quintal Wheat
Grade A

WHAT IT IS WORTH
₹2,480/q

WHAT MAY HAPPEN
7-day forecast ₹2,570/q

WHAT SHOULD I DO
WAIT 3 DAYS

WHY
Expected net benefit +₹5,500
Confidence 78%

WHO SHOULD I SELL TO
ABC Foods
94% match
Low risk

WHAT HAPPENS NEXT
Negotiate → Contract → Pickup → Delivery → Payment

Do not bury the recommendation beneath charts.

---

# 4. MOBILE-FIRST RULE

Design mobile first.

Mobile:
- bottom navigation,
- one-column cards,
- horizontal swipe cards,
- sticky primary action where useful,
- large buttons,
- readable charts,
- no desktop-style wide tables.

Desktop:
- sidebar,
- multi-column dashboard,
- maps beside data,
- detailed comparisons.

Test at:
- 360px
- 390px
- 768px
- 1024px
- 1440px

---

# 5. FRONTEND API STRATEGY

Do not hardcode backend responses throughout components.

Use:

services/
  api/
    auth.ts
    crops.ts
    market.ts
    forecast.ts
    recommendations.ts
    buyers.ts
    offers.ts
    transactions.ts
    logistics.ts

Keep API calls separate from presentation.

When backend APIs are unavailable, use a mock adapter with the SAME response shape.

Do not create one API shape for mock data and another for production.

---

# 6. SHARED TYPES

Create shared frontend types matching backend contracts.

Example:

CropLot
MarketPrice
PriceForecast
SaleRecommendation
BuyerMatch
Offer
Transaction
Shipment
Payment

Do not casually rename properties.

If backend says:

expected_price

do not silently use:

expectedPrice

unless the project has explicitly chosen a transformation layer.

---

# 7. AI UX

AI should feel useful, not decorative.

Bad:
"AI-powered insights"

Good:
"WAIT 3 DAYS"

Then explain:
- current price,
- expected price,
- storage cost,
- spoilage risk,
- expected gain,
- confidence.

Use expandable "Why?" sections.

---

# 8. PHASED FRONTEND DELIVERY

### FRONTEND PHASE 1
Foundation + design system

### FRONTEND PHASE 2
Auth + farmer shell

### FRONTEND PHASE 3
Crop lot creation/details

### FRONTEND PHASE 4
Market + forecast visualization

### FRONTEND PHASE 5
Sell/Wait recommendation

### FRONTEND PHASE 6
Buyer matching + net realisation

### FRONTEND PHASE 7
Negotiation + transaction

### FRONTEND PHASE 8
Logistics + payment + trust

### FRONTEND PHASE 9
Final responsive polish + demo mode

---

# 9. DO NOT DO

Do not:
- build backend business logic inside React,
- put API calls directly everywhere,
- create duplicate components,
- use random UI libraries without approval,
- redesign the entire app for one feature,
- introduce unnecessary state management,
- add animations that hurt performance,
- hardcode secrets,
- make desktop-first layouts.

---

# 10. INTEGRATION RESPONSIBILITY

When Kuldeep or Ishan delivers an API:

1. Read their contract.
2. Do not modify their implementation unless necessary.
3. Create/modify the frontend service adapter.
4. Connect the UI.
5. Add loading/error/empty states.
6. Test mobile and desktop.
7. Report integration issues with exact endpoint and response shape.

You are the final frontend integration owner.

---

# 11. FINAL DEMO

The final UI should let a judge complete:

Login
→ Create Wheat Lot
→ Upload image
→ See Grade A
→ See current price
→ See forecast
→ See WAIT recommendation
→ See net realization
→ See top buyers
→ Negotiate
→ Accept
→ See transaction
→ See logistics
→ See payment

The experience should feel like one coherent product, not separate modules.

---

# 12. STOP RULE

Do not automatically move to the next phase.

After each phase:
- test,
- commit,
- report,
- wait for confirmation.

