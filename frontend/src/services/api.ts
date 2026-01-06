import axios, { AxiosError } from 'axios'
import { storage } from './storage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(null, (error) => {
  if (error instanceof AxiosError && error.response?.status === 401) {
    storage.access_token.value = '';
    storage.role.value = null;
  }

  return Promise.reject(error);
})

api.interceptors.request.use((config) => {
  const token = storage.access_token.value;
  
  if (!token) return config;

  config.headers.Authorization = `Bearer ${token}`;
  return config;
})

// Authors API
export const authorsApi = {
  getAll: (params: {page: number, limit: number}) => api.get('/authors', { params }),
  getAllFlat: () => api.get('/authors/flat'),
  getById: (id: number) => api.get(`/authors/${id}`),
  create: (data: { name: string; bio: string }) => api.post('/authors', data),
  update: (id: number, data: { name: string; bio: string }) => api.put(`/authors/${id}`, data),
  delete: (id: number) => api.delete(`/authors/${id}`),
}

// Books API
export const booksApi = {
  getAll: (params: {page: number, limit: number}) => api.get('/books', { params }),
  getAllFlat: () => api.get('/books/flat'),
  getById: (id: number) => api.get(`/books/${id}`),
  create: (data: { title: string; description: string; authorIds: number[]; stock: number }) =>
    api.post('/books', data),
  update: (
    id: number,
    data: { title: string; description: string; authorIds: number[]; stock: number },
  ) => api.put(`/books/${id}`, data),
  delete: (id: number) => api.delete(`/books/${id}`),
}

// Borrowings API
export const borrowingsApi = {
  getAll: (params: {page: number, limit: number}) => api.get('/borrowings', { params }),
  getById: (id: number) => api.get(`/borrowings/${id}`),
  add: (data: { userId: number; bookId: number }) => api.post('/borrowings/add', data),
  return: (data: { userId: number; bookId: number }) => api.post('/borrowings/return', data),
}

// Users API
export const usersApi = {
  getAll: (params: {page: number, limit: number}) => api.get('/users', { params }),
  getAllFlat: () => api.get('/users/flat'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: { username: string; password: string }) => api.post('/users', data),
  update: (id: number, data: { username: string, password?: string, role: string }) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  changePassword: (id: number, data: { password: string; newPassword: string }) =>
    api.post(`/users/${id}/change-password`, data),
}

// Auth API
export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: {username: string, password: string}) => api.post('/auth/register', data),
}

export default api
