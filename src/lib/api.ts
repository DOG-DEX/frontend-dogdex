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

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (requiresAuth && typeof window !== 'undefined') {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, { ...options, headers });
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
