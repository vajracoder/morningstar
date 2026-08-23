// ============================================================
// MORNINGSTAR — OFFERS API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_OFFER, USE_MOCK } from '@/mock/data';
import type { Offer } from '@/types';

export async function createOffer(data: Partial<Offer>): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 800));
    return { ...MOCK_OFFER, ...data, id: `offer-${Date.now()}`, status: 'pending' } as Offer;
  }
  return request<Offer>({ method: 'POST', url: '/api/offers', data });
}

export async function counterOffer(offerId: string, price: number): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    return { ...MOCK_OFFER, id: offerId, price_per_quintal: price, status: 'counter_offered' };
  }
  return request<Offer>({
    method: 'POST',
    url: `/api/offers/${offerId}/counter`,
    data: { price_per_quintal: price },
  });
}

export async function acceptOffer(offerId: string): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 700));
    return { ...MOCK_OFFER, id: offerId, status: 'accepted' };
  }
  return request<Offer>({ method: 'POST', url: `/api/offers/${offerId}/accept` });
}

export async function rejectOffer(offerId: string): Promise<Offer> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return { ...MOCK_OFFER, id: offerId, status: 'rejected' };
  }
  return request<Offer>({ method: 'POST', url: `/api/offers/${offerId}/reject` });
}
