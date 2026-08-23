// ============================================================
// MORNINGSTAR — MOCK STORAGE & DEMO DATA PERSISTENCE
// Stores interactive modifications in localStorage so created crop lots,
// counter-offers, and transactions persist across page reloads.
// ============================================================

import {
  MOCK_CROP_LOTS, MOCK_QUALITY_REPORT, MOCK_OFFER,
  MOCK_TRANSACTION, MOCK_NOTIFICATIONS
} from './data'
import type { CropLot, CropQualityReport, Offer, Transaction, Notification } from '@/types'

const STORAGE_KEYS = {
  CROP_LOTS: 'morningstar_crop_lots',
  QUALITY_REPORTS: 'morningstar_quality_reports',
  OFFERS: 'morningstar_offers',
  TRANSACTIONS: 'morningstar_transactions',
  NOTIFICATIONS: 'morningstar_notifications',
}

// ----- Crop Lots -----
export function getStoredCropLots(): CropLot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CROP_LOTS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load crop lots from storage', e)
  }
  return [...MOCK_CROP_LOTS]
}

export function saveStoredCropLots(lots: CropLot[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CROP_LOTS, JSON.stringify(lots))
  } catch (e) {
    console.error('Failed to save crop lots to storage', e)
  }
}

export function addStoredCropLot(lot: CropLot): CropLot[] {
  const lots = [lot, ...getStoredCropLots().filter(l => l.id !== lot.id)]
  saveStoredCropLots(lots)
  return lots
}

// ----- Quality Reports -----
export function getStoredQualityReport(cropLotId: string): CropQualityReport {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.QUALITY_REPORTS}_${cropLotId}`)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load quality report from storage', e)
  }
  return { ...MOCK_QUALITY_REPORT, crop_lot_id: cropLotId }
}

export function saveStoredQualityReport(report: CropQualityReport) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.QUALITY_REPORTS}_${report.crop_lot_id}`, JSON.stringify(report))
  } catch (e) {
    console.error('Failed to save quality report', e)
  }
}

// ----- Offers -----
export function getStoredOffer(offerId: string): Offer {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.OFFERS}_${offerId}`)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load offer from storage', e)
  }
  return { ...MOCK_OFFER, id: offerId }
}

export function saveStoredOffer(offer: Offer) {
  try {
    localStorage.setItem(`${STORAGE_KEYS.OFFERS}_${offer.id}`, JSON.stringify(offer))
  } catch (e) {
    console.error('Failed to save offer', e)
  }
}

// ----- Transactions -----
export function getStoredTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load transactions', e)
  }
  return [...[MOCK_TRANSACTION]]
}

export function saveStoredTransactions(txns: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txns))
  } catch (e) {
    console.error('Failed to save transactions', e)
  }
}

// ----- Reset All Demo Data -----
export function resetDemoData() {
  try {
    Object.values(STORAGE_KEYS).forEach(k => {
      localStorage.removeItem(k)
    })
    // also clear specific keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('morningstar_')) {
        localStorage.removeItem(key)
      }
    }
  } catch (e) {
    console.error('Failed to reset demo data', e)
  }
}
