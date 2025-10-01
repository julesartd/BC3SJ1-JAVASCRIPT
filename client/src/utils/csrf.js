const base = import.meta.env.VITE_BASE_URL || '/';

export async function getCsrfToken() {
  const res = await fetch(base + 'api/csrf-token', { credentials: 'include' });
  const data = await res.json();
  return data.csrfToken;
}
