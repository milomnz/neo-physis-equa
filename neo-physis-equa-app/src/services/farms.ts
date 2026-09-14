import { apiClient } from './api';
import { getSession } from './session';

export interface LocationDetails {
  vereda?: string;
  municipio?: string;
  departamento?: string;
  coordinates?: {
    latitude?: number;
    longitude?: number;
  };
}

export interface Farm {
  id: string;
  name: string;
  location: LocationDetails;
  altitude: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFarmData {
  name: string;
  location: LocationDetails;
  altitude: number;
}

export interface UpdateFarmData {
  name?: string;
  location?: LocationDetails;
  altitude?: number;
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

export async function getFarms(): Promise<Farm[]> {
  const headers = await getAuthHeaders();
  return apiClient<Farm[]>('/api/farms', {
    method: 'GET',
    headers,
  });
}

export async function getFarm(id: string): Promise<Farm> {
  const headers = await getAuthHeaders();
  return apiClient<Farm>(`/api/farms/${id}`, {
    method: 'GET',
    headers,
  });
}

export async function createFarm(data: CreateFarmData): Promise<Farm> {
  const headers = await getAuthHeaders();
  return apiClient<Farm>('/api/farms', {
    method: 'POST',
    headers,
    body: data,
  });
}

export async function updateFarm(id: string, data: UpdateFarmData): Promise<Farm> {
  const headers = await getAuthHeaders();
  return apiClient<Farm>(`/api/farms/${id}`, {
    method: 'PATCH',
    headers,
    body: data,
  });
}

export async function deleteFarm(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  return apiClient<{ message: string }>(`/api/farms/${id}`, {
    method: 'DELETE',
    headers,
  });
}
