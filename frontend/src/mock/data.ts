// ============================================================
// MORNINGSTAR — MOCK DATA
// Used when backend APIs are not yet available.
// Shape MUST match the real API response shape exactly.
// ============================================================

import type {
  User, FarmerProfile, CropLot, CropQualityReport,
  MarketPrice, PriceForecast, SaleRecommendation,
  BuyerMatch, Offer, Transaction, TransportOption,
  Payment, Notification, TrustScore
} from '@/types';

// ----- Demo Farmer -----
export const MOCK_USER: User = {
  id: 'user-001',
  name: 'Rajesh Patil',
  phone: '+91-9876543210',
  email: 'rajesh.patil@example.com',
  role: 'farmer',
  created_at: '2026-01-15T10:00:00Z',
};

export const MOCK_FARMER_PROFILE: FarmerProfile = {
  id: 'fp-001',
  user_id: 'user-001',
  location: 'Nashik',
  district: 'Nashik',
  state: 'Maharashtra',
  total_land_acres: 12,
  aadhaar_verified: true,
  kisan_credit_card: 'KCC-MH-2024-001',
};

// ----- Demo Crop Lot -----
export const MOCK_CROP_LOTS: CropLot[] = [
  {
    id: 'lot-001',
    farmer_id: 'user-001',
    crop_name: 'Wheat',
    variety: 'Lok-1',
    quantity_quintal: 100,
    grade: 'A',
    location: 'Nashik',
    district: 'Nashik',
    state: 'Maharashtra',
    harvest_date: '2026-07-10',
    storage_type: 'Warehouse',
    storage_capacity_days: 30,
    status: 'quality_done',
    images: [],
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
  },
];

// ----- Demo Quality Report -----
export const MOCK_QUALITY_REPORT: CropQualityReport = {
  id: 'qr-001',
  crop_lot_id: 'lot-001',
  grade: 'A',
  moisture_percent: 12.5,
  protein_percent: 11.2,
  impurity_percent: 1.8,
  ai_confidence: 0.93,
  graded_at: '2026-08-15T11:00:00Z',
  notes: 'Excellent quality. Suitable for export grade markets.',
};

// ----- Demo Market Prices -----
export const MOCK_MARKET_PRICES: MarketPrice[] = [
  {
    market_id: 'mkt-001',
    market_name: 'Nashik APMC',
    crop_name: 'Wheat',
    date: '2026-08-23',
    min_price: 2350,
    max_price: 2600,
    modal_price: 2480,
    unit: 'quintal',
  },
  {
    market_id: 'mkt-002',
    market_name: 'Pune APMC',
    crop_name: 'Wheat',
    date: '2026-08-23',
    min_price: 2400,
    max_price: 2650,
    modal_price: 2510,
    unit: 'quintal',
  },
  {
    market_id: 'mkt-003',
    market_name: 'Mumbai APMC',
    crop_name: 'Wheat',
    date: '2026-08-23',
    min_price: 2450,
    max_price: 2700,
    modal_price: 2560,
    unit: 'quintal',
  },
];

// ----- Demo Price Forecast -----
export const MOCK_PRICE_FORECAST: PriceForecast = {
  crop_lot_id: 'lot-001',
  crop_name: 'Wheat',
  current_price: 2480,
  forecasts: [
    { days: 1,  predicted_price: 2495, lower_bound: 2460, upper_bound: 2530, confidence: 0.91 },
    { days: 3,  predicted_price: 2520, lower_bound: 2480, upper_bound: 2570, confidence: 0.85 },
    { days: 7,  predicted_price: 2570, lower_bound: 2510, upper_bound: 2630, confidence: 0.78 },
    { days: 14, predicted_price: 2540, lower_bound: 2470, upper_bound: 2620, confidence: 0.65 },
  ],
  generated_at: '2026-08-23T06:00:00Z',
};

// ----- Demo Sale Recommendation -----
export const MOCK_RECOMMENDATION: SaleRecommendation = {
  crop_lot_id: 'lot-001',
  decision: 'WAIT',
  recommended_days: 7,
  expected_gain: 5500,
  confidence: 0.78,
  risk: 'MEDIUM',
  reason: 'Expected price increase to ₹2,570/q in 7 days exceeds estimated storage cost of ₹4,000 and spoilage risk. Wait is recommended for maximum net realisation.',
  storage_cost_total: 4000,
  spoilage_risk_percent: 2.5,
  net_realisation_current: 244000,
  net_realisation_recommended: 249500,
  generated_at: '2026-08-23T06:00:00Z',
};

// ----- Demo Buyer Matches -----
export const MOCK_BUYER_MATCHES: BuyerMatch[] = [
  {
    buyer: {
      id: 'buyer-001',
      name: 'ABC Foods Pvt Ltd',
      type: 'processor',
      location: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      verified: true,
      trust_score: 94,
      avg_payment_days: 3,
      logo_url: undefined,
    },
    match_score: 94,
    offered_price: 2580,
    distance_km: 12,
    payment_reliability: 97,
    risk_level: 'LOW',
    match_reason: 'Processes Lok-1 wheat variety; Grade A preferred; 3-day payment cycle.',
  },
  {
    buyer: {
      id: 'buyer-002',
      name: 'XYZ Agro Exports',
      type: 'exporter',
      location: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      verified: true,
      trust_score: 87,
      avg_payment_days: 7,
      logo_url: undefined,
    },
    match_score: 87,
    offered_price: 2600,
    distance_km: 185,
    payment_reliability: 88,
    risk_level: 'LOW',
    match_reason: 'Export quality wheat buyer. Higher price but longer payment cycle.',
  },
  {
    buyer: {
      id: 'buyer-003',
      name: 'Pune Retail Chain',
      type: 'retailer',
      location: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      verified: true,
      trust_score: 79,
      avg_payment_days: 14,
      logo_url: undefined,
    },
    match_score: 79,
    offered_price: 2540,
    distance_km: 185,
    payment_reliability: 81,
    risk_level: 'MEDIUM',
    match_reason: 'Retail distribution chain. Moderate price with longer payment timeline.',
  },
];

// ----- Demo Offer -----
export const MOCK_OFFER: Offer = {
  id: 'offer-001',
  crop_lot_id: 'lot-001',
  buyer_id: 'buyer-001',
  farmer_id: 'user-001',
  price_per_quintal: 2600,
  quantity_quintal: 100,
  total_amount: 260000,
  status: 'accepted',
  initiated_by: 'buyer',
  created_at: '2026-08-20T10:00:00Z',
  expires_at: '2026-08-27T10:00:00Z',
};

// ----- Demo Transaction -----
export const MOCK_TRANSACTION: Transaction = {
  id: 'txn-001',
  crop_lot_id: 'lot-001',
  offer_id: 'offer-001',
  farmer_id: 'user-001',
  buyer_id: 'buyer-001',
  final_price: 2600,
  final_quantity: 100,
  total_amount: 260000,
  status: 'payment_done',
  created_at: '2026-08-20T12:00:00Z',
  updated_at: '2026-08-22T15:00:00Z',
};

// ----- Demo Transport Options -----
export const MOCK_TRANSPORT_OPTIONS: TransportOption[] = [
  {
    id: 'trans-001',
    provider: 'Shree Transport',
    vehicle_type: 'Truck (10T)',
    capacity_quintal: 100,
    price_per_km: 28,
    estimated_total: 3360,
    estimated_hours: 4,
    contact_phone: '+91-9876500001',
  },
  {
    id: 'trans-002',
    provider: 'Agro Logistics',
    vehicle_type: 'Mini Truck (5T)',
    capacity_quintal: 50,
    price_per_km: 22,
    estimated_total: 2640,
    estimated_hours: 4,
    contact_phone: '+91-9876500002',
  },
];

// ----- Demo Payment -----
export const MOCK_PAYMENT: Payment = {
  id: 'pay-001',
  transaction_id: 'txn-001',
  amount: 260000,
  method: 'bank_transfer',
  status: 'completed',
  paid_at: '2026-08-22T15:00:00Z',
  utr_number: 'UTR26082200001',
};

// ----- Demo Trust Score -----
export const MOCK_TRUST_SCORE: TrustScore = {
  user_id: 'buyer-001',
  score: 94,
  total_transactions: 238,
  on_time_payments: 230,
  dispute_count: 2,
  last_updated: '2026-08-20T00:00:00Z',
};

// ----- Demo Notifications -----
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    user_id: 'user-001',
    type: 'recommendation',
    title: 'AI Recommends: Wait 7 Days',
    message: 'Expected price for Wheat is ₹2,570/q in 7 days. Potential gain: ₹5,500.',
    read: false,
    created_at: '2026-08-23T06:00:00Z',
    action_url: '/crop-lots/lot-001/recommendation',
  },
  {
    id: 'notif-002',
    user_id: 'user-001',
    type: 'offer_received',
    title: 'New Offer from ABC Foods',
    message: 'ABC Foods offered ₹2,580/q for your Wheat lot.',
    read: false,
    created_at: '2026-08-22T14:30:00Z',
    action_url: '/negotiations/offer-001',
  },
  {
    id: 'notif-003',
    user_id: 'user-001',
    type: 'payment_received',
    title: 'Payment Received ₹2,60,000',
    message: 'Full payment of ₹2,60,000 received from ABC Foods. UTR: UTR26082200001.',
    read: true,
    created_at: '2026-08-22T15:00:00Z',
    action_url: '/transactions/txn-001',
  },
];

// ----- Mock API Toggle -----
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;
