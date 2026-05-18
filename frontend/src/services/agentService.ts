import api from './api'
import type { ApiResponse } from '../types'

export interface Agent {
  id: number
  user_id: number
  company_name: string | null
  gst_no: string | null
  pan_no: string | null
  business_address: string | null
  kyc_status: 'pending' | 'approved' | 'rejected'
  is_verified: boolean
  commission_rate: number | null
  user: {
    id: number
    name: string
    email: string
    phone: string | null
    avatar: string | null
  }
  properties_count?: number
}

export const agentService = {
  async list(): Promise<ApiResponse<Agent[]>> {
    const response = await api.get('/agents')
    return response.data
  },

  async getById(id: number): Promise<ApiResponse<Agent>> {
    const response = await api.get(`/agents/${id}`)
    return response.data
  },
}
