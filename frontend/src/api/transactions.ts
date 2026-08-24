// ============================================================
// MORNINGSTAR — TRANSACTIONS API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_TRANSACTION, USE_MOCK } from '@/mock/data';
import type { Transaction } from '@/types';

export async function getTransaction(id: string): Promise<Transaction> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_TRANSACTION;
  }
  return request<Transaction>({ method: 'GET', url: `/api/transactions/${id}` });
}

export async function getTransactions(): Promise<Transaction[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return [MOCK_TRANSACTION];
  }
  return request<Transaction[]>({ method: 'GET', url: '/api/transactions' });
}
