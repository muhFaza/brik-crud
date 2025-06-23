import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api'  || 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface User {
  id: number
  email: string
  name: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  isActive?: boolean
}

// auth
export const authApi = {
  login: (data: LoginData) => api.post<{ access_token: string; user: User }>('/auth/login', data),
  register: (data: RegisterData) => api.post<User>('/auth/register', data),
}

// products
export const productsApi = {
  getAll: (params?: any) => api.get<Product[]>('/products', { params }),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: CreateProductData) => api.post<Product>('/products', data),
  update: (id: number, data: Partial<CreateProductData>) => api.patch<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
}

export default api