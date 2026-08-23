// ============================================================
// MORNINGSTAR — OFFERS API SERVICE
// ============================================================

import { request } from './client';
import { USE_MOCK } from '@/mock/data';
import { getStoredOffer, saveStoredOffer } from '@/mock/mockStorage';
import type { Offer } from '@/types';

export async function createOffer(data: Partial<Offer>): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    const newOffer = {
      ...getStoredOffer(data.id || 'offer-001'),
      ...data,
      id: `offer-${Date.now()}`,
      status: 'pending',
    } as Offer;
    saveStoredOffer(newOffer);
    return newOffer;
  }
  return request<Offer>({ method: 'POST', url: '/api/offers', data });
}

export async function counterOffer(offerId: string, price: number): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 400));
    const off = getStoredOffer(offerId);
    const updated = { ...off, id: offerId, price_per_quintal: price, status: 'counter_offered' } as Offer;
    saveStoredOffer(updated);
    return updated;
  }
  return request<Offer>({
    method: 'POST',
    url: `/api/offers/${offerId}/counter`,
    data: { price_per_quintal: price },
  });
}

export async function acceptOffer(offerId: string): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    const off = getStoredOffer(offerId);
    const updated = { ...off, id: offerId, status: 'accepted' } as Offer;
    saveStoredOffer(updated);
    return updated;
  }
  return request<Offer>({ method: 'POST', url: `/api/offers/${offerId}/accept` });
}

export async function rejectOffer(offerId: string): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    const off = getStoredOffer(offerId);
    const updated = { ...off, id: offerId, status: 'rejected' } as Offer;
    saveStoredOffer(updated);
    return updated;
  }
  return request<Offer>({ method: 'POST', url: `/api/offers/${offerId}/reject` });
}
