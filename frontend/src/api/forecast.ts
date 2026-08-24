// ============================================================
// MORNINGSTAR — FORECAST API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_PRICE_FORECAST, USE_MOCK } from '@/mock/data';
import type { PriceForecast } from '@/types';

export async function getForecast(cropLotId: string): Promise<PriceForecast> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 700));
    return MOCK_PRICE_FORECAST;
  }
  return request<PriceForecast>({
    method: 'GET',
    url: `/api/crop-lots/${cropLotId}/forecast`,
  });
}
