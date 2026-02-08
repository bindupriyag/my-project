const DEFAULT_BASE_URL = 'http://localhost:3001';

function getBaseUrl() {
  return process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL;
}

export function getApiBaseUrl() {
  return getBaseUrl();
}

async function request(path, options) {
  const url = `${getBaseUrl()}${path}`;
  let res;
  try {
    res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });
  } catch (e) {
    const message = `Network error calling ${url}. If you're using the mock API, start it with: npm run api`;
    throw new Error(message);
  }

  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {
      bodyText = '';
    }
    const message = bodyText || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function listUsers() {
  return request('/users', { method: 'GET' });
}

export async function createUser(payload) {
  return request('/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateUser(id, payload) {
  return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}
