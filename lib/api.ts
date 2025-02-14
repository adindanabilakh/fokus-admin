// lib/api.ts
import axios from "axios";

// Ambil base URL dari .env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Buat instance axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Middleware untuk menambahkan token auth
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 🟢 GET: Ambil semua kategori
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// 🔵 POST: Tambah kategori
export const addCategory = async (category: { name: string; description?: string }) => {
  const response = await api.post("/categories", category);
  return response.data;
};

// 🟡 PUT: Update kategori
export const updateCategory = async (id: number, category: { name: string; description?: string }) => {
  const response = await api.put(`/categories/${id}`, category);
  return response.data;
};

// 🔴 DELETE: Hapus kategori
export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};
