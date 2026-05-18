import api from './api'
import type { ApiResponse, PaginatedResponse, User } from '../types'

export interface AgentUser extends User {
  property_count?: number
  vendor?: {
    id: number
    user_id: number
    company_name: string | null
    gst_no: string | null
    pan_no: string | null
    business_address: string | null
    kyc_status: 'pending' | 'approved' | 'rejected'
    is_verified: boolean
    commission_rate: number | null
  }
}

export interface AgentDetail extends AgentUser {
  properties?: import('../types').Property[]
}

export interface PublicBlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  tags: string[] | null
  status: string
  author: import('../types').User
  author_id: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export const publicService = {
  async getAgents(): Promise<PaginatedResponse<AgentUser>> {
    const response = await api.get('/agents')
    return response.data
  },

  async getAgent(id: number): Promise<ApiResponse<AgentDetail>> {
    const response = await api.get(`/agents/${id}`)
    return response.data
  },

  async getBlogs(): Promise<PaginatedResponse<PublicBlogPost>> {
    const response = await api.get('/blogs')
    return response.data
  },

  async getBlog(slug: string): Promise<ApiResponse<PublicBlogPost>> {
    const response = await api.get(`/blogs/${slug}`)
    return response.data
  },
}
