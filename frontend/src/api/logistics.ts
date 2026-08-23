// ============================================================
// MORNINGSTAR — LOGISTICS API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_TRANSPORT_OPTIONS, USE_MOCK } from '@/mock/data';
import type { TransportOption } from '@/types';

export async function getLogisticsOptions(transactionId: string): Promise<TransportOption[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_TRANSPORT_OPTIONS;
  }
  return request<TransportOption[]>({
    method: 'GET',
    url: '/api/logistics/options',
    params: { transaction_id: transactionId },
  });
}
