import api from './api'
import type { ApiResponse, PaginatedResponse, Property } from '../types'

export const propertyService = {
  async list(params?: Record<string, string | number | boolean>): Promise<PaginatedResponse<Property>> {
    const response = await api.get('/properties', { params })
    return response.data
  },

  async featured(): Promise<ApiResponse<Property[]>> {
    const response = await api.get('/properties/featured')
    return response.data
  },

  async trending(): Promise<ApiResponse<Property[]>> {
    const response = await api.get('/properties/trending')
    return response.data
  },

  async getBySlug(slug: string): Promise<ApiResponse<Property>> {
    const response = await api.get(`/properties/${slug}`)
    return response.data
  },

  async nearby(lat: number, lng: number, radius: number = 5): Promise<ApiResponse<Property[]>> {
    const response = await api.get('/properties/nearby', { params: { lat, lng, radius } })
    return response.data
  },
}
