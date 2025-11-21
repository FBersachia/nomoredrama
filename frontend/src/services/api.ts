import axios from 'axios';
import { PublicContent } from '../types/content';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const ADMIN_TOKEN_KEY = 'nomoredrama_admin_token';

const client = axios.create({
  baseURL: API_URL
});

const resolveToken = (explicitToken?: string) => explicitToken ?? localStorage.getItem(ADMIN_TOKEN_KEY) ?? undefined;

export async function fetchPublicContent(): Promise<PublicContent> {
  const { data } = await client.get<PublicContent>('/v1/content');
  return data;
}

export async function loginAdmin(params: { email: string; password: string }) {
  const { data } = await client.post('/v1/admin/login', params);
  localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  return data as { token: string };
}

export async function fetchAdminContent(token: string): Promise<PublicContent> {
  const { data } = await client.get<PublicContent>(
    '/v1/admin/content',
    {
      headers: { Authorization: `Bearer ${resolveToken(token)}` }
    }
  );
  return data;
}

export async function saveContent(token: string, payload: unknown) {
  const { data } = await client.put('/v1/admin/content', payload, {
    headers: { Authorization: `Bearer ${resolveToken(token)}` }
  });
  return data;
}

export function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearStoredAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function logoutAdmin(token?: string) {
  const { data } = await client.post(
    '/v1/admin/logout',
    {},
    {
      headers: { Authorization: `Bearer ${resolveToken(token)}` }
    }
  );
  clearStoredAdminToken();
  return data;
}
