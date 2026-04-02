const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');
export const ADMIN_SESSION_STORAGE_KEY = 'dermas-admin-session';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type StoredAdminSession<T = unknown> = {
  token: string;
  admin: T;
};

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

export const getStoredAdminSession = <T = unknown,>(): StoredAdminSession<T> | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<StoredAdminSession<T>>;

    if (!parsedValue || typeof parsedValue !== 'object' || typeof parsedValue.token !== 'string') {
      return null;
    }

    return {
      token: parsedValue.token,
      admin: parsedValue.admin as T,
    };
  } catch {
    return null;
  }
};

export const getStoredAdminToken = () => getStoredAdminSession()?.token ?? null;

export const setStoredAdminSession = <T,>(session: StoredAdminSession<T>) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAdminSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
};

export const withQuery = (path: string, params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    const normalizedValue = value?.trim();
    if (normalizedValue) {
      searchParams.set(key, normalizedValue);
    }
  });

  const query = searchParams.toString();
  const normalizedPath = normalizePath(path);

  return query ? `${normalizedPath}?${query}` : normalizedPath;
};

export const apiRequest = async <T,>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { body, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set('Accept', 'application/json');

  if (body !== undefined && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const token = getStoredAdminToken();

  if (token && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  if (!response.ok) {
    let message = 'The server could not complete this request.';

    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) {
        message = payload.message;
      }
    } catch {
      // Ignore JSON parsing failures and fall back to the default message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const apiFetch = <T,>(path: string, signal?: AbortSignal) => apiRequest<T>(path, { method: 'GET', signal });
