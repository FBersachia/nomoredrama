import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

const client = axios.create({
  baseURL: API_URL
});

export async function fetchPublicContent() {
  const { data } = await client.get('/v1/content');
  return data;
}

export async function loginAdmin(params: { email: string; password: string }) {
  const { data } = await client.post('/v1/admin/login', params);
  return data as { token: string };
}

export async function fetchAdminContent(token: string) {
  const { data } = await client.get('/v1/admin/content', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}

export async function saveContent(token: string, payload: unknown) {
  const { data } = await client.put('/v1/admin/content', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
}
