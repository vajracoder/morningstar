// ============================================================
// MORNINGSTAR — CROPS API SERVICE
// ============================================================

import { request } from './client';
import { MOCK_CROP_LOTS, MOCK_QUALITY_REPORT, USE_MOCK } from '@/mock/data';
import type { CropLot, CropQualityReport } from '@/types';

export async function getCropLots(): Promise<CropLot[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500));
    return MOCK_CROP_LOTS;
  }
  return request<CropLot[]>({ method: 'GET', url: '/api/crop-lots' });
}

export async function getCropLot(id: string): Promise<CropLot> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 400));
    const lot = MOCK_CROP_LOTS.find(l => l.id === id);
    if (!lot) throw { message: 'Crop lot not found', status: 404 };
    return lot;
  }
  return request<CropLot>({ method: 'GET', url: `/api/crop-lots/${id}` });
}

export async function createCropLot(data: Partial<CropLot>): Promise<CropLot> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 800));
    const newLot: CropLot = {
      id: `lot-${Date.now()}`,
      farmer_id: 'user-001',
      crop_name: data.crop_name || 'Wheat',
      variety: data.variety,
      quantity_quintal: data.quantity_quintal || 0,
      grade: 'ungraded',
      location: data.location || '',
      district: data.district || '',
      state: data.state || 'Maharashtra',
      harvest_date: data.harvest_date,
      storage_type: data.storage_type,
      status: 'draft',
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return newLot;
  }
  return request<CropLot>({ method: 'POST', url: '/api/crop-lots', data });
}

export async function getQualityReport(cropLotId: string): Promise<CropQualityReport> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    return MOCK_QUALITY_REPORT;
  }
  return request<CropQualityReport>({
    method: 'GET',
    url: `/api/crop-lots/${cropLotId}/quality`,
  });
}

export async function uploadCropImage(cropLotId: string, file: File): Promise<{ image_url: string }> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 1200));
    return { image_url: URL.createObjectURL(file) };
  }
  const formData = new FormData();
  formData.append('image', file);
  return request({
    method: 'POST',
    url: `/api/crop-lots/${cropLotId}/images`,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
