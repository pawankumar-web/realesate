import api from './api'
import type { ApiResponse, PaginatedResponse, Property, Lead } from '../types'
import type { PropertyImage } from '../types'

export interface VendorAnalytics {
  total_properties: number
  active_properties: number
  total_views: number
  total_leads: number
  recent_properties: Property[]
}

export interface VendorKycData {
  company_name?: string
  gst_no?: string
  pan_no?: string
  business_address?: string
}

export interface VendorSubscription {
  id: number
  user_id: number
  plan_name: string
  plan_type: string
  price: number
  duration: string
  starts_at: string
  ends_at: string
  status: string
  created_at: string
}

export interface Conversation {
  id: number
  sender_id: number
  receiver_id: number
  property_id: number | null
  last_message_at: string
  sender: import('../types').User
  receiver: import('../types').User
  property: Property | null
  last_message: Message | null
  messages?: Message[]
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  message: string | null
  file_path: string | null
  file_type: string | null
  is_read: boolean
  sender: import('../types').User
  created_at: string
}

export interface CreatePropertyData {
  title: string
  description: string
  price: number
  purpose: 'buy' | 'rent'
  property_type: string
  area_sqft: number
  bedrooms?: number
  bathrooms?: number
  address: string
  city: string
  state: string
  zip_code: string
  bhk?: number
  furnished_status?: string
  lat?: number
  lng?: number
  amenities?: number[]
}

export const vendorService = {
  async getProperties(): Promise<PaginatedResponse<Property>> {
    const response = await api.get('/vendor/properties')
    return response.data
  },

  async getAnalytics(): Promise<ApiResponse<VendorAnalytics>> {
    const response = await api.get('/vendor/analytics')
    return response.data
  },

  async getLeads(): Promise<PaginatedResponse<Lead>> {
    const response = await api.get('/vendor/leads')
    return response.data
  },

  async updateKyc(data: VendorKycData): Promise<ApiResponse<{ id: number; user_id: number; kyc_status: string }>> {
    const response = await api.put('/vendor/kyc', data)
    return response.data
  },

  async getSubscriptions(): Promise<ApiResponse<VendorSubscription[]>> {
    const response = await api.get('/subscriptions/my')
    return response.data
  },

  async createProperty(data: CreatePropertyData): Promise<ApiResponse<Property>> {
    const response = await api.post('/properties', data)
    return response.data
  },

  async updateProperty(id: number, data: Partial<CreatePropertyData>): Promise<ApiResponse<Property>> {
    const response = await api.put(`/properties/${id}`, data)
    return response.data
  },

  async deleteProperty(id: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/properties/${id}`)
    return response.data
  },

  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await api.get('/chats')
    return response.data
  },

  async getConversation(id: number): Promise<ApiResponse<Conversation>> {
    const response = await api.get(`/chats/${id}`)
    return response.data
  },

  async sendMessage(receiverId: number, message: string, propertyId?: number): Promise<ApiResponse<Message>> {
    const response = await api.post('/chats', { receiver_id: receiverId, message, property_id: propertyId })
    return response.data
  },

  async markConversationRead(id: number): Promise<ApiResponse<null>> {
    const response = await api.post(`/chats/${id}/read`)
    return response.data
  },

  async getAmenities(): Promise<ApiResponse<import('../types').Amenity[]>> {
    const response = await api.get('/amenities')
    return response.data
  },

  async uploadPropertyImage(propertyId: number, file: FormData): Promise<ApiResponse<PropertyImage>> {
    const response = await api.post(`/properties/${propertyId}/images`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async deletePropertyImage(propertyId: number, imageId: number): Promise<ApiResponse<null>> {
    const response = await api.delete(`/properties/${propertyId}/images/${imageId}`)
    return response.data
  },
}
