import api from './api'
import type { ApiResponse, PaginatedResponse, Property, Booking, Review } from '../types'

export interface BookingData {
  visit_date: string
  visit_time: string
  notes?: string
}

export interface ReviewData {
  rating: number
  review?: string
}

export interface ProfileData {
  name?: string
  email?: string
  phone?: string
}

export const userService = {
  async getBookmarks(): Promise<PaginatedResponse<Property>> {
    const response = await api.get('/user/bookmarks')
    return response.data
  },

  async toggleBookmark(propertyId: number): Promise<ApiResponse<{ is_bookmarked: boolean; property_id: number }>> {
    const response = await api.post(`/user/bookmarks/${propertyId}`)
    return response.data
  },

  async getBookings(): Promise<PaginatedResponse<Booking>> {
    const response = await api.get('/user/bookings')
    return response.data
  },

  async createBooking(propertyId: number, data: BookingData): Promise<ApiResponse<Booking>> {
    const response = await api.post(`/user/bookings/${propertyId}`, data)
    return response.data
  },

  async createReview(propertyId: number, data: ReviewData): Promise<ApiResponse<Review>> {
    const response = await api.post(`/user/reviews/${propertyId}`, data)
    return response.data
  },

  async updateProfile(data: ProfileData): Promise<ApiResponse<import('../types').User>> {
    const response = await api.put('/auth/profile', data)
    return response.data
  },
}
