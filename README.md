# 🌾 MorningStar — AI-Powered Agricultural Market Intelligence & Trade Platform

> **SIH 2026 Problem Statement 26132**  
> *Smart Farming & FinTech Intelligence for Indian Agriculture*

---

## 🌟 Product North Star
**MorningStar** answers the critical question for Indian farmers:  
> *"Given my crop, quantity, quality, location, storage, financial urgency, market conditions, and buyers, what is the best action I should take?"*

---

## 🚀 Complete End-to-End Farmer Journey
```
Farmer → Crop Lot → Quality → Market Intelligence → Forecast → Sell/Wait → Net Realisation → Buyer Matching → Negotiation → Transaction → Logistics → Payment → Trust
```

1. **Farmer Command Center**: Dashboard answering *"What I have → What it's worth → What may happen → What should I do → Who to sell to"*.
2. **Crop Lot Registration**: 3-step wizard with crop variety, quantity in quintals, location, and safe storage capacity.
3. **AI Quality Grading**: Grain analysis estimating moisture, protein, impurity levels, and issuing Grade A/B/C ratings.
4. **Market Intelligence**: Live APMC mandi modal rates across 500+ regional markets + 14-day AI forecast curve.
5. **Sell / Wait Recommendation**: Mathematical decision model factoring price upside, daily storage holding fees, and spoilage risk.
6. **Net Realisation Modeling**: Direct comparison between immediate liquidation vs. recommended holding.
7. **Institutional Buyer Matching**: Verified food processors, exporters, and retail chains ranked by match percentage and trust rating.
8. **Digital Negotiation**: Counter-offer discussion rounds, quantity/price revisions, and instant contract generation.
9. **Fulfillment Tracking**: Order lifecycle from signed contract to pickup, transit, and delivery.
10. **Settled Payments**: Bank transfer (NEFT/UPI) receipts with official UTR confirmation.
11. **Logistics Integration**: Verified freight carriers with capacity filters, estimated rates, and driver dispatch.
12. **KYC & Trust Score**: Aadhaar verified farmer profile, Kisan Credit Card (KCC) linkage, and 98/100 reliability score.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Backend & APIs**: Node.js, Express, MongoDB (Mongoose), JWT Authentication
- **AI & Forecast Engine**: Machine learning predictive models (price forecasting & recommendation engine)
- **Evaluator Mode**: Built-in 12-step interactive SIH Judge Walkthrough controller (`DemoTourBar`)

---

## 📁 Project Structure

```
MorningStar/
├── frontend/                     # React 19 + TypeScript frontend application
│   ├── src/
│   │   ├── api/                 # API service layer (crops, buyers, forecast, offers, etc.)
│   │   ├── components/          # Reusable UI design system & AppShell
│   │   ├── context/             # AuthContext (state & session management)
│   │   ├── mock/                # Mock data & localStorage state persistence
│   │   ├── pages/               # 15 farmer & public experience pages
│   │   └── types/               # TypeScript domain contracts
│   └── package.json
│
├── src/                         # Backend API server (Express / MongoDB)
│   ├── config/                  # Database connection
│   ├── controllers/             # Route handlers
│   ├── middleware/              # Auth & error handling
│   ├── models/                  # Mongoose models
│   ├── routes/                  # Express routers
│   ├── utils/                   # Helpers (ApiError, asyncHandler)
│   └── server.js                # App entry point
└── README.md
```

---

## 🔌 Backend Modules & API Routes

| Module | Model | Route | Description |
|---|---|---|---|
| **Buyers** | `Buyer` | `/api/buyers` | Institutional buyer directory & profiles |
| **Buyer Verification** | `BuyerVerification` | `/api/buyer-verifications` | KYC & GST verification records |
| **Crop Lots** | `CropLot` | `/api/crop-lots` | Farmer crop lot inventory & quality |
| **Offers** | `Offer` | `/api/offers` | Bid submissions & proposals |
| **Negotiation** | `Negotiation` | `/api/negotiations` | Counter-offer discussion rounds |
| **Contracts** | `Contract` | `/api/contracts` | Legally binding digital agreements |
| **Transactions** | `Transaction` | `/api/transactions` | Order fulfillment lifecycle |
| **Logistics** | `Logistics` | `/api/logistics` | Transport carrier booking & tracking |
| **Payments** | `Payment` | `/api/payments` | Escrow & NEFT/UPI settlement |
| **Trust** | `Trust` | `/api/trust` | User reputation & reliability rating |
| **Disputes** | `Dispute` | `/api/disputes` | Conflict resolution management |

---

## 🏃 Getting Started

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

### 2. Backend Setup

```bash
# In the root project directory
npm install
cp .env.example .env   # Configure MongoDB URI and JWT secrets
npm run dev
```

---

## 👥 Team
- **Tilak**: Product Shell, Frontend Architecture, Design System & Final Integration Owner
- **Kuldeep**: Market Intelligence & AI/ML Forecasting Engine
- **Ishan**: Marketplace, Logistics & Transaction Backend
