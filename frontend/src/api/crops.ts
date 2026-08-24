import { request } from './client';
import { USE_MOCK } from '@/mock/data';
import {
  getStoredCropLots, addStoredCropLot, getStoredQualityReport,
  saveStoredQualityReport
} from '@/mock/mockStorage';
import type { CropLot, CropQualityReport } from '@/types';

export async function getCropLots(): Promise<CropLot[]> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return getStoredCropLots();
  }
  return request<CropLot[]>({ method: 'GET', url: '/api/crop-lots' });
}

export async function getCropLot(id: string): Promise<CropLot> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 200));
    const lots = getStoredCropLots();
    const lot = lots.find(l => l.id === id) || lots[0];
    if (!lot) throw { message: 'Crop lot not found', status: 404 };
    return lot;
  }
  return request<CropLot>({ method: 'GET', url: `/api/crop-lots/${id}` });
}

export async function createCropLot(data: Partial<CropLot>): Promise<CropLot> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600));
    const newLot: CropLot = {
      id: `lot-${Date.now()}`,
      farmer_id: 'user-001',
      crop_name: data.crop_name || 'Wheat',
      variety: data.variety,
      quantity_quintal: data.quantity_quintal || 0,
      grade: 'A',
      location: data.location || '',
      district: data.district || '',
      state: data.state || 'Maharashtra',
      harvest_date: data.harvest_date,
      storage_type: data.storage_type,
      storage_capacity_days: data.storage_capacity_days,
      status: 'quality_done',
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    addStoredCropLot(newLot);
    return newLot;
  }
  return request<CropLot>({ method: 'POST', url: '/api/crop-lots', data });
}

export async function getQualityReport(cropLotId: string): Promise<CropQualityReport> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return getStoredQualityReport(cropLotId);
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
