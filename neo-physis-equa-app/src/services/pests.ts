import { apiClient } from './api';
import { getSession } from './session';

export const SEVERITIES = ['baja', 'media', 'alta'] as const;
export type Severity = (typeof SEVERITIES)[number];

export interface Pest {
  id: string;
  cropId: string;
  commonName: string;
  scientificName: string | null;
  affectedCrops: string[];
  symptoms: string[];
  severity: Severity;
  imageReferences: string[];
  crop?: {
    id: string;
    species: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePestData {
  cropId: string;
  commonName: string;
  scientificName?: string | null;
  symptoms?: string[];
  severity?: Severity;
  affectedCrops?: string[];
  imageReferences?: string[];
}

export interface UpdatePestData {
  commonName?: string;
  scientificName?: string | null;
  symptoms?: string[];
  severity?: Severity;
  affectedCrops?: string[];
  imageReferences?: string[];
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

export async function getPests(cropId?: string): Promise<Pest[]> {
  const headers = await getAuthHeaders();
  const query = cropId ? `?cropId=${encodeURIComponent(cropId)}` : '';
  return apiClient<Pest[]>(`/api/pests${query}`, {
    method: 'GET',
    headers,
  });
}

export async function getPest(id: string): Promise<Pest> {
  const headers = await getAuthHeaders();
  return apiClient<Pest>(`/api/pests/${id}`, {
    method: 'GET',
    headers,
  });
}

export async function createPest(data: CreatePestData): Promise<Pest> {
  const headers = await getAuthHeaders();
  return apiClient<Pest>('/api/pests', {
    method: 'POST',
    headers,
    body: data,
  });
}

export async function updatePest(id: string, data: UpdatePestData): Promise<Pest> {
  const headers = await getAuthHeaders();
  return apiClient<Pest>(`/api/pests/${id}`, {
    method: 'PATCH',
    headers,
    body: data,
  });
}

export async function deletePest(id: string): Promise<{ message: string }> {
  const headers = await getAuthHeaders();
  return apiClient<{ message: string }>(`/api/pests/${id}`, {
    method: 'DELETE',
    headers,
  });
}