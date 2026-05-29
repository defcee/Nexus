//import { use } from "react";

// ============================================
// NEXUS API CONFIG (PRODUCTION SAFE)
// ============================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://nexus-whsr.onrender.com"
).replace(/\/+$/, "");

// ============================================
// TOKEN
// ============================================

function getToken() {
  return localStorage.getItem("admin_token");
}

// ============================================
// NORMALIZE ENDPOINT
// ============================================

function normalizeEndpoint(endpoint: string) {
  let clean = endpoint.trim();

  if (clean.startsWith("/api")) {
    clean = clean.replace(/^\/api/, "");
  }

  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }

  return clean;
}

// ============================================
// SAFE FETCH WRAPPER
// ============================================

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${API_BASE_URL}/api${normalizeEndpoint(endpoint)}`;

  const token = getToken();

  console.log("🌍 API REQUEST:", url);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    console.error("❌ API ERROR:", data || res.statusText);

    throw new Error(
      data?.error ||
        data?.message ||
        `Request failed (${res.status})`
    );
  }

  return data;
}

// ============================================
// ADMIN API
// ============================================

export const adminAPI = {
  login: (data: any) =>
    apiFetch("/admin/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch("/admin/logout", {
      method: "POST",
    }),

  getStats: () =>
    apiFetch("/admin/stats"),

  // ADMIN CHAT (existing)
  getChatMessages: () =>
    apiFetch("/admin/chat"),

  saveChatMessage: (data: any) =>
    apiFetch("/admin/chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getInvoices: () =>
    apiFetch("/admin/invoices"),

  createInvoice: (data: any) =>
    apiFetch("/admin/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ============================================
// PACKAGE API
// ============================================

export const packageAPI = {
  create: (data: any) =>
    apiFetch("/packages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () =>
    apiFetch("/packages"),

  track: (trackingNumber: string) =>
    apiFetch(`/packages/track/${trackingNumber}`),

  update: (trackingNumber: string, data: any) =>
    apiFetch(`/packages/${trackingNumber}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateStatus: (trackingNumber: string, data: any) =>
    apiFetch(`/packages/${trackingNumber}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string | number) =>
    apiFetch(`/packages/${id}`, {
      method: "DELETE",
    }),
};

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  signup: (data: any) =>
    apiFetch("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: any) =>
    apiFetch("/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getUser: (id: string) =>
    apiFetch(`/users/${id}`),

  updateUser: (id: string, data: any) =>
    apiFetch(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// ============================================
// ✅ CHAT API (FIX ADDED)
// ============================================

export const chatAPI = {
  // customer sends message
  sendMessage: (data: any) =>
    apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // customer/admin reads messages
  getMessages: () =>
    apiFetch("/chat"),
};