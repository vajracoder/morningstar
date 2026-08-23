// ============================================================
// MORNINGSTAR — RECOMMENDATIONS API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_RECOMMENDATION, USE_MOCK } from '@/mock/data';
import type { SaleRecommendation } from '@/types';

export async function getRecommendation(cropLotId: string): Promise<SaleRecommendation> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 900));
    return MOCK_RECOMMENDATION;
  }
  return request<SaleRecommendation>({
    method: 'GET',
    url: `/api/crop-lots/${cropLotId}/recommendation`,
  });
}
