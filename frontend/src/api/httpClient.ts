import { storage } from '@/services/storage';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000/api';

const TOKEN_STORAGE_KEY = 'kantin_pos_access_token';
const GUEST_TOKEN_STORAGE_KEY = 'kantin_pos_guest_token';

function getLocalStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return getLocalStorage()?.getItem(TOKEN_STORAGE_KEY) || null;
}

export function setAuthToken(token: string | null): void {
  const storageObj = getLocalStorage();
  if (!storageObj) return;
  if (token) {
    storageObj.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    storageObj.removeItem(TOKEN_STORAGE_KEY);
  }
}

function getGuestToken(): string | null {
  return getLocalStorage()?.getItem(GUEST_TOKEN_STORAGE_KEY) || null;
}

function setGuestToken(token: string | null): void {
  const storageObj = getLocalStorage();
  if (!storageObj) return;
  if (token) {
    storageObj.setItem(GUEST_TOKEN_STORAGE_KEY, token);
  } else {
    storageObj.removeItem(GUEST_TOKEN_STORAGE_KEY);
  }
}

async function fetchGuestToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const token = json?.data?.access_token || null;
    if (token) setGuestToken(token);
    return token;
  } catch {
    return null;
  }
}

async function resolveBearerToken(method: string, path: string): Promise<string | null> {
  const staffToken = getAuthToken();
  if (staffToken) return staffToken;

  const upperMethod = method.toUpperCase();
  const isPublicAuth =
    path.startsWith('/auth/login') ||
    path.startsWith('/auth/verify-pin') ||
    path.startsWith('/auth/guest');

  if (upperMethod !== 'GET' && !isPublicAuth) {
    let guestToken = getGuestToken();
    if (!guestToken) {
      guestToken = await fetchGuestToken();
    }
    return guestToken;
  }

  return null;
}

function extractErrorMessage(json: any, fallback: string): string {
  if (json?.errors && typeof json.errors === 'object') {
    const firstFieldErrors = Object.values(json.errors)[0];
    if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
      return String(firstFieldErrors[0]);
    }
  }
  return json?.meta?.message || json?.message || fallback;
}

export interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const method = (options.method || 'GET').toUpperCase();
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = await resolveBearerToken(method, path);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(url, {
    ...options,
    method,
    headers,
    cache: 'no-store',
  });

  // Jika guest token kedaluwarsa, refresh sekali dan ulangi request
  if (response.status === 401 && !getAuthToken() && getGuestToken()) {
    setGuestToken(null);
    const refreshed = await fetchGuestToken();
    if (refreshed) {
      headers.set('Authorization', `Bearer ${refreshed}`);
      response = await fetch(url, {
        ...options,
        method,
        headers,
        cache: 'no-store',
      });
    }
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const isLoginPath = path.startsWith('/auth/login') || path.startsWith('/auth/verify-pin');
    if (response.status === 401 && !isLoginPath && getAuthToken()) {
      setAuthToken(null);
      storage.setCurrentUser(null);
    }
    throw new Error(extractErrorMessage(json, `HTTP ${response.status} ${response.statusText}`));
  }

  return (json?.data !== undefined ? json.data : json) as T;
}
