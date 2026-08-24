// ============================================================
// MORNINGSTAR — BUYERS API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_BUYER_MATCHES, USE_MOCK } from '@/mock/data';
import type { BuyerMatch } from '@/types';

export async function getBuyerMatches(cropLotId: string): Promise<BuyerMatch[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_BUYER_MATCHES;
  }
  return request<BuyerMatch[]>({
    method: 'GET',
    url: `/api/crop-lots/${cropLotId}/buyers`,
  });
}
