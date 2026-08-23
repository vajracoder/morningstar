// ============================================================
// MORNINGSTAR — MARKET API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_MARKET_PRICES, USE_MOCK } from '@/mock/data';
import type { MarketPrice } from '@/types';

export async function getMarketPrices(cropName: string, district?: string): Promise<MarketPrice[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_MARKET_PRICES.filter(p =>
      p.crop_name.toLowerCase() === cropName.toLowerCase()
    );
  }
  return request<MarketPrice[]>({
    method: 'GET',
    url: '/api/markets',
    params: { crop: cropName, district },
  });
}

export async function getMarketPriceById(marketId: string, cropName: string): Promise<MarketPrice[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 400));
    return MOCK_MARKET_PRICES.filter(p => p.market_id === marketId);
  }
  return request<MarketPrice[]>({
    method: 'GET',
    url: `/api/markets/${marketId}/prices`,
    params: { crop: cropName },
  });
}
