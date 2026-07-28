import { env } from './env';

type ApiEnvelope<T> = { data: T };
type ApiErrorBody = { message?: string | string[] };

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

function unwrap<T>(payload: T | ApiEnvelope<T>): T {
  return typeof payload === 'object' && payload !== null && 'data' in payload
    ? (payload as ApiEnvelope<T>).data
    : (payload as T);
}

function errorMessage(payload: ApiErrorBody, fallback: string) {
  return Array.isArray(payload.message)
    ? payload.message.join(', ')
    : payload.message ?? fallback;
}

let refreshingPromise: Promise<boolean> | null = null;

async function executeTokenRefresh(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch(`${env.apiBaseUrl}/api/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      credentials: 'include',
    });
    if (!res.ok) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-change'));
      return false;
    }
    const payload = await res.json();
    const data = payload.data ?? payload;
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('auth-change'));
      return true;
    }
    return false;
  } catch {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true,
  isRetry = false,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (
    response.status === 401 &&
    !isRetry &&
    !path.includes('/api/auth/login') &&
    !path.includes('/api/auth/refresh-token')
  ) {
    if (!refreshingPromise) {
      refreshingPromise = executeTokenRefresh().finally(() => {
        refreshingPromise = null;
      });
    }

    const refreshed = await refreshingPromise;
    if (refreshed) {
      return apiFetch<T>(path, options, requiresAuth, true);
    }
  }

  const payload = (await response.json().catch(() => ({}))) as
    | T
    | ApiErrorBody
    | ApiEnvelope<T>;
  if (!response.ok) {
    throw new ApiRequestError(
      errorMessage(payload as ApiErrorBody, 'Request failed'),
      response.status,
    );
  }

  return unwrap(payload as T | ApiEnvelope<T>);
}
