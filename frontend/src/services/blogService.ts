import api from './api'
import type { ApiResponse, PaginatedResponse } from '../types'

export interface Blog {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string | null
  author: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export const blogService = {
  async list(params?: Record<string, string | number>): Promise<PaginatedResponse<Blog>> {
    const response = await api.get('/blogs', { params })
    return response.data
  },

  async getBySlug(slug: string): Promise<ApiResponse<Blog>> {
    const response = await api.get(`/blogs/${slug}`)
    return response.data
  },
}
