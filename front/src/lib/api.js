export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function getAuthUser() {
  try {
    return JSON.parse(sessionStorage.getItem("authUser") || "null");
  } catch {
    sessionStorage.removeItem("authUser");
    return null;
  }
}

export function getAuthToken() {
  return getAuthUser()?.access_token || "";
}

export function saveAuthSession(user, accessToken) {
  sessionStorage.setItem("authUser", JSON.stringify({
    ...user,
    access_token: accessToken,
  }));
}

export function clearAuthSession() {
  sessionStorage.removeItem("authUser");
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  return fetch(url, {
    ...options,
    headers,
  });
}
