// ============================================================
// MORNINGSTAR — SHARED FRONTEND TYPES
// Matches backend API contract exactly.
// DO NOT rename properties without team discussion.
// ============================================================

// ----- Auth / User -----
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'farmer' | 'buyer' | 'fpo' | 'admin';
  created_at: string;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  location: string;
  district: string;
  state: string;
  total_land_acres?: number;
  aadhaar_verified: boolean;
  kisan_credit_card?: string;
  avatar_url?: string;
}

export interface AuthState {
  user: User | null;
  farmer_profile: FarmerProfile | null;
  token: string | null;
  is_authenticated: boolean;
}

// ----- Crop Lot -----
export type CropLotStatus =
  | 'draft'
  | 'quality_pending'
  | 'quality_done'
  | 'listed'
  | 'negotiating'
  | 'sold'
  | 'expired';

export type GradeType = 'A' | 'B' | 'C' | 'ungraded';

export interface CropLot {
  id: string;
  farmer_id: string;
  crop_name: string;
  variety?: string;
  quantity_quintal: number;
  grade: GradeType;
  location: string;
  district: string;
  state: string;
  harvest_date?: string;
  storage_type?: string;
  storage_capacity_days?: number;
  status: CropLotStatus;
  images?: string[];
  created_at: string;
  updated_at: string;
}

// ----- Crop Quality Report -----
export interface CropQualityReport {
  id: string;
  crop_lot_id: string;
  grade: GradeType;
  moisture_percent?: number;
  protein_percent?: number;
  impurity_percent?: number;
  ai_confidence: number;
  graded_at: string;
  notes?: string;
}

// ----- Market & Prices -----
export interface Market {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export interface MarketPrice {
  market_id: string;
  market_name: string;
  crop_name: string;
  date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
}

export interface MarketArrival {
  market_id: string;
  crop_name: string;
  date: string;
  arrival_quintal: number;
}

// ----- Price Forecast -----
export interface PriceForecast {
  crop_lot_id: string;
  crop_name: string;
  current_price: number;
  forecasts: {
    days: number;
    predicted_price: number;
    lower_bound: number;
    upper_bound: number;
    confidence: number;
  }[];
  generated_at: string;
}

// ----- Sale Recommendation -----
export type Decision = 'SELL_NOW' | 'WAIT' | 'PARTIAL_SELL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SaleRecommendation {
  crop_lot_id: string;
  decision: Decision;
  recommended_days: number;
  expected_gain: number;
  confidence: number;
  risk: RiskLevel;
  reason: string;
  storage_cost_total: number;
  spoilage_risk_percent: number;
  net_realisation_current: number;
  net_realisation_recommended: number;
  generated_at: string;
}

// ----- Buyer Match -----
export type BuyerType = 'processor' | 'retailer' | 'exporter' | 'fpo' | 'individual';

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType;
  location: string;
  district: string;
  state: string;
  verified: boolean;
  trust_score: number;
  avg_payment_days: number;
  logo_url?: string;
}

export interface BuyerMatch {
  buyer: Buyer;
  match_score: number;
  offered_price?: number;
  distance_km: number;
  payment_reliability: number;
  risk_level: RiskLevel;
  match_reason?: string;
}

// ----- Offer & Negotiation -----
export type OfferStatus =
  | 'pending'
  | 'counter_offered'
  | 'accepted'
  | 'rejected'
  | 'expired';

export interface Offer {
  id: string;
  crop_lot_id: string;
  buyer_id: string;
  farmer_id: string;
  price_per_quintal: number;
  quantity_quintal: number;
  total_amount: number;
  status: OfferStatus;
  initiated_by: 'farmer' | 'buyer';
  created_at: string;
  expires_at?: string;
  notes?: string;
}

export interface Negotiation {
  id: string;
  offer_id: string;
  rounds: {
    round: number;
    by: 'farmer' | 'buyer';
    price: number;
    quantity: number;
    message?: string;
    created_at: string;
  }[];
}

// ----- Transaction -----
export type TransactionStatus =
  | 'initiated'
  | 'contract_signed'
  | 'pickup_scheduled'
  | 'in_transit'
  | 'delivered'
  | 'payment_pending'
  | 'payment_done'
  | 'disputed'
  | 'completed';

export interface Contract {
  id: string;
  offer_id: string;
  signed_by_farmer: boolean;
  signed_by_buyer: boolean;
  pdf_url?: string;
  signed_at?: string;
}

export interface Transaction {
  id: string;
  crop_lot_id: string;
  offer_id: string;
  farmer_id: string;
  buyer_id: string;
  final_price: number;
  final_quantity: number;
  total_amount: number;
  status: TransactionStatus;
  contract?: Contract;
  created_at: string;
  updated_at: string;
}

// ----- Logistics -----
export interface TransportOption {
  id: string;
  provider: string;
  vehicle_type: string;
  capacity_quintal: number;
  price_per_km: number;
  estimated_total: number;
  estimated_hours: number;
  contact_phone?: string;
}

export interface Shipment {
  id: string;
  transaction_id: string;
  transport_option_id: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date?: string;
  delivery_date?: string;
  status: 'scheduled' | 'picked_up' | 'in_transit' | 'delivered';
  tracking_url?: string;
}

// ----- Payment -----
export interface Payment {
  id: string;
  transaction_id: string;
  amount: number;
  method: 'upi' | 'bank_transfer' | 'cash' | 'neft';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  paid_at?: string;
  utr_number?: string;
}

// ----- Trust & Dispute -----
export interface TrustScore {
  user_id: string;
  score: number;
  total_transactions: number;
  on_time_payments: number;
  dispute_count: number;
  last_updated: string;
}

// ----- Notifications -----
export type NotificationType =
  | 'price_alert'
  | 'offer_received'
  | 'offer_accepted'
  | 'payment_received'
  | 'recommendation'
  | 'general';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

// ----- API Response Wrappers -----
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
