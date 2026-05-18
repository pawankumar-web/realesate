import api from './api'
import type { ApiResponse } from '../types'

export interface CmsPage {
  id: number
  slug: string
  title: string
  content: string
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Amenity {
  id: number
  name: string
  icon: string | null
}

export interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  price: number
  duration_days: number
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export const cmsService = {
  async getPage(slug: string): Promise<ApiResponse<CmsPage>> {
    const response = await api.get(`/cms/${slug}`)
    return response.data
  },

  async getAmenities(): Promise<ApiResponse<Amenity[]>> {
    const response = await api.get('/amenities')
    return response.data
  },

  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const response = await api.get('/subscription-plans')
    return response.data
  },
}
