const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

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

  const response = await fetch(`${API_BASE_URL}${normalizePath(path)}`, {
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
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
      // Ignore malformed JSON responses and fall back to the default error.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const apiFetch = <T,>(path: string, signal?: AbortSignal) => apiRequest<T>(path, { method: 'GET', signal });

