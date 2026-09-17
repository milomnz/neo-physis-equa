import { apiClient } from './api';
import { getSession } from './session';

export const GROWTH_STAGES = ['vegetativo', 'floración', 'fructificación', 'producción'] as const;
export type GrowthStage = (typeof GROWTH_STAGES)[number];

export interface Crop {
  id: string;
  farmId: string;
  species: string;
  plantedDate: string | null;
  growthStage: GrowthStage;
  notes: string | null;
  farm?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCropData {
  farmId: string;
  species: string;
  plantedDate?: string | null;
  growthStage?: GrowthStage;
  notes?: string | null;
}

export interface UpdateCropData {
  species?: string;
  plantedDate?: string | null;
  growthStage?: GrowthStage;
  notes?: string | null;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  if (!session || !session.token) {
    throw new Error('No hay sesión activa');
  }
  return {
    Authorization: `Bearer ${session.token}`,
  };
}

export async function getCrops(farmId?: string): Promise<Crop[]> {
  const headers = await getAuthHeaders();
  const query = farmId ? `?farmId=${encodeURIComponent(farmId)}` : '';
  return apiClient<Crop[]>(`/api/crops${query}`, {
    method: 'GET',
    headers,
  });
}

export async function getCrop(id: string): Promise<Crop> {
  const headers = await getAuthHeaders();
  return apiClient<Crop>(`/api/crops/${id}`, {
    method: 'GET',
    headers,
  });
}

export async function createCrop(data: CreateCropData): Promise<Crop> {
  const headers = await getAuthHeaders();
  return apiClient<Crop>('/api/crops', {
    method: 'POST',
    headers,
    body: data,
  });
}

export async function updateCrop(id: string, data: UpdateCropData): Promise<Crop> {
  const headers = await getAuthHeaders();
  return apiClient<Crop>(`/api/crops/${id}`, {
    method: 'PATCH',
    headers,
    body: data,
  });
}

export async function deleteCrop(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  return apiClient<{ message: string }>(`/api/crops/${id}`, {
    method: 'DELETE',
    headers,
  });
}