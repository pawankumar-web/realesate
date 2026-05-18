import api from './api'
import type { ApiResponse, PaginatedResponse, Property, User } from '../types'

export interface AdminDashboardStats {
  total_users: number
  total_vendors: number
  total_properties: number
  pending_properties: number
  total_leads: number
  total_revenue: number
  recent_users: User[]
  recent_properties: Property[]
}

export interface AdminReport {
  users_by_role: { role: string; total: number }[]
  properties_by_status: { status: string; total: number }[]
  properties_by_purpose: { purpose: string; total: number }[]
  revenue: { total: number; count: number } | null
  recent_payments: {
    id: number
    amount: number
    currency: string
    status: string
    user: User
    created_at: string
  }[]
}

export interface BlogPostData {
  title: string
  content: string
  excerpt?: string
  status: 'draft' | 'published'
  tags?: string[]
  featured_image?: File
}

export interface BannerData {
  title: string
  subtitle?: string
  image: File
  link?: string
  position: string
  sort_order?: number
  is_active?: boolean
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  tags: string[] | null
  status: 'draft' | 'published'
  author: User
  author_id: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface Banner {
  id: number
  title: string
  subtitle: string | null
  image: string
  link: string | null
  position: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export const adminService = {
  async getDashboard(): Promise<ApiResponse<AdminDashboardStats>> {
    const response = await api.get('/admin/dashboard')
    return response.data
  },

  async getUsers(): Promise<PaginatedResponse<User>> {
    const response = await api.get('/admin/users')
    return response.data
  },

  async getUser(id: number): Promise<ApiResponse<User>> {
    const response = await api.get(`/admin/users/${id}`)
    return response.data
  },

  async updateUser(id: number, data: Partial<{ name: string; email: string; phone: string; role: string; status: string }>): Promise<ApiResponse<User>> {
    const response = await api.put(`/admin/users/${id}`, data)
    return response.data
  },

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/users/${id}`)
    return response.data
  },

  async getProperties(): Promise<PaginatedResponse<Property>> {
    const response = await api.get('/admin/properties')
    return response.data
  },

  async getProperty(id: number): Promise<ApiResponse<Property>> {
    const response = await api.get(`/admin/properties/${id}`)
    return response.data
  },

  async updateProperty(id: number, data: Partial<Property>): Promise<ApiResponse<Property>> {
    const response = await api.put(`/admin/properties/${id}`, data)
    return response.data
  },

  async deleteProperty(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/properties/${id}`)
    return response.data
  },

  async approveProperty(id: number): Promise<ApiResponse<Property>> {
    const response = await api.put(`/admin/properties/${id}/approve`)
    return response.data
  },

  async rejectProperty(id: number): Promise<ApiResponse<Property>> {
    const response = await api.put(`/admin/properties/${id}/reject`)
    return response.data
  },

  async getBlogs(): Promise<PaginatedResponse<BlogPost>> {
    const response = await api.get('/admin/blogs')
    return response.data
  },

  async getBlog(id: number): Promise<ApiResponse<BlogPost>> {
    const response = await api.get(`/admin/blogs/${id}`)
    return response.data
  },

  async createBlog(data: BlogPostData): Promise<ApiResponse<BlogPost>> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('status', data.status)
    if (data.excerpt) formData.append('excerpt', data.excerpt)
    if (data.tags) formData.append('tags', JSON.stringify(data.tags))
    if (data.featured_image) formData.append('featured_image', data.featured_image)
    const response = await api.post('/admin/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async updateBlog(id: number, data: Partial<BlogPostData>): Promise<ApiResponse<BlogPost>> {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.content) formData.append('content', data.content)
    if (data.status) formData.append('status', data.status)
    if (data.excerpt) formData.append('excerpt', data.excerpt)
    if (data.tags) formData.append('tags', JSON.stringify(data.tags))
    if (data.featured_image) formData.append('featured_image', data.featured_image)
    formData.append('_method', 'PUT')
    const response = await api.post(`/admin/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deleteBlog(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/blogs/${id}`)
    return response.data
  },

  async getBanners(): Promise<ApiResponse<Banner[]>> {
    const response = await api.get('/admin/banners')
    return response.data
  },

  async createBanner(data: BannerData): Promise<ApiResponse<Banner>> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('position', data.position)
    formData.append('image', data.image)
    if (data.subtitle) formData.append('subtitle', data.subtitle)
    if (data.link) formData.append('link', data.link)
    if (data.sort_order !== undefined) formData.append('sort_order', String(data.sort_order))
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active))
    const response = await api.post('/admin/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async updateBanner(id: number, data: Partial<BannerData>): Promise<ApiResponse<Banner>> {
    const formData = new FormData()
    if (data.title) formData.append('title', data.title)
    if (data.subtitle) formData.append('subtitle', data.subtitle)
    if (data.image) formData.append('image', data.image)
    if (data.link) formData.append('link', data.link)
    if (data.sort_order !== undefined) formData.append('sort_order', String(data.sort_order))
    if (data.is_active !== undefined) formData.append('is_active', String(data.is_active))
    formData.append('_method', 'PUT')
    const response = await api.post(`/admin/banners/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deleteBanner(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/admin/banners/${id}`)
    return response.data
  },

  async getReports(period?: string): Promise<ApiResponse<AdminReport>> {
    const response = await api.get('/admin/reports', { params: { period } })
    return response.data
  },
}
