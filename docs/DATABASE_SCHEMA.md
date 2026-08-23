# KrishiPulse — Database Schema & Data Models

This document defines the shared relational database entities across all three workstreams.

---

## 1. Core Entities

### `users`
- `id` (VARCHAR, PK)
- `name` (VARCHAR)
- `phone` (VARCHAR, UNIQUE)
- `role` (VARCHAR: `FARMER`, `BUYER`, `FPO`, `ADMIN`)
- `created_at` (TIMESTAMP)

### `farmer_profiles`
- `id` (VARCHAR, PK)
- `user_id` (VARCHAR, FK -> `users.id`)
- `district` (VARCHAR)
- `state` (VARCHAR)
- `land_size_acres` (FLOAT)
- `primary_crops` (JSON/VARCHAR)

### `crop_lots`
- `id` (VARCHAR, PK)
- `farmer_id` (VARCHAR, FK -> `users.id`)
- `commodity` (VARCHAR)
- `variety` (VARCHAR)
- `quantity` (FLOAT)
- `quantity_unit` (VARCHAR: `quintal`, `kg`, `tonne`)
- `quality_grade` (VARCHAR: `Grade A`, `Grade B`, `Grade C`)
- `harvest_date` (DATE)
- `storage_location` (VARCHAR)
- `status` (VARCHAR: `DRAFT`, `ANALYZED`, `LISTED`, `NEGOTIATING`, `SOLD`)
- `created_at` (TIMESTAMP)

### `digital_twins` (Owner: Kuldeep)
- `id` (VARCHAR, PK)
- `farmer_id` (VARCHAR)
- `crop_lot_id` (VARCHAR, FK -> `crop_lots.id`, UNIQUE)
- `crop` (VARCHAR)
- `quantity` (FLOAT)
- `location` (VARCHAR)
- `quality` (VARCHAR)
- `harvest_date` (DATE)
- `storage_days` (INTEGER)
- `financial_urgency` (VARCHAR: `LOW`, `MEDIUM`, `HIGH`)
- `current_market_price` (FLOAT)
- `buyer_demand` (VARCHAR: `LOW`, `MEDIUM`, `HIGH`)
- `transport_estimate` (FLOAT)
- `spoilage_risk` (VARCHAR: `LOW`, `MEDIUM`, `HIGH`)
- `forecast_summary` (JSON, NULLABLE)
- `last_synced_at` (TIMESTAMP)

### `markets` (Owner: Kuldeep)
- `id` (VARCHAR, PK)
- `name` (VARCHAR)
- `district` (VARCHAR)
- `state` (VARCHAR)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `created_at` (TIMESTAMP)

### `market_prices` (Owner: Kuldeep)
- `id` (VARCHAR, PK)
- `market_id` (VARCHAR, FK -> `markets.id`)
- `commodity` (VARCHAR)
- `variety` (VARCHAR)
- `modal_price` (FLOAT)
- `min_price` (FLOAT)
- `max_price` (FLOAT)
- `unit` (VARCHAR)
- `arrivals_tonnes` (FLOAT)
- `recorded_date` (DATE)
- `is_simulated` (BOOLEAN)

---

## 2. Marketplace & Transaction Entities (Owner: Ishan)
- `buyers` (id, user_id, company_name, gst_number, verification_status, trust_score)
- `offers` (id, crop_lot_id, buyer_id, offered_price_per_q, quantity, status)
- `contracts` (id, offer_id, final_price, total_amount, terms, created_at)
- `transactions` (id, contract_id, payment_status, escrow_status, delivery_status)
- `disputes` (id, transaction_id, initiator_id, reason, status)
