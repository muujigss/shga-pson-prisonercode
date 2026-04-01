import Cookies from 'js-cookie';

const TOKEN_NAME = 'prisoner-token';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function api(endpoint: string, options?: RequestInit): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  const token = Cookies.get(TOKEN_NAME);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    Cookies.remove(TOKEN_NAME);
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
}

export function setToken(token: string) {
  Cookies.set(TOKEN_NAME, token, { expires: 1 });
}

export function removeToken() {
  Cookies.remove(TOKEN_NAME);
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_NAME);
}
