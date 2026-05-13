const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Centralized API client wrapping fetch() with consistent
 * credentials, headers, and error handling.
 */
async function request(path, options = {}) {
  const { body, headers: customHeaders, ...restOptions } = options;

  const headers = {
    Accept: 'application/json',
    ...customHeaders,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...restOptions,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

/**
 * Performs a raw fetch (no automatic JSON parsing) — useful
 * when the caller needs the raw Response object (e.g. checking
 * response.ok without throwing on non-2xx).
 */
async function rawRequest(path, options = {}) {
  const { body, headers: customHeaders, ...restOptions } = options;

  const headers = {
    Accept: 'application/json',
    ...customHeaders,
  };

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  return fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...restOptions,
  });
}

const apiClient = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),

  /** Raw request — returns Response object without auto-parsing */
  raw: {
    get: (path) => rawRequest(path),
    post: (path, body) => rawRequest(path, { method: 'POST', body }),
  },
};

export default apiClient;
