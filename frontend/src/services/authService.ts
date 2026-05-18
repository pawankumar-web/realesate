import api from './api'

export interface LoginData {
  email?: string
  phone?: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  phone?: string
  password: string
  password_confirmation: string
  role: 'user' | 'vendor'
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  async logout() {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  getSocialRedirectUrl(provider: 'google' | 'github') {
    return `${BACKEND_URL}/auth/${provider}/redirect`
  },
}
