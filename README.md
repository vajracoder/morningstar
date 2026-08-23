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
- **State & Architecture**: Modular API services with TypeScript domain models & local storage mock persistence
- **Evaluator Tour**: Built-in 12-step interactive SIH Judge Walkthrough controller (`DemoTourBar`)
- **Backend & AI Integration**: FastAPI (Python), PostgreSQL / SQLite, Price Forecasting & ML models

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production
npm run build
```

---

## 👥 Team
- **Tilak**: Product Shell, Frontend Architecture, Design System & Integration Owner
- **Kuldeep**: Market Intelligence & AI/ML Forecasting Engine
- **Ishan**: Marketplace, Logistics & Transaction Backend