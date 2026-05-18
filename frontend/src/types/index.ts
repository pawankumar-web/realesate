export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'admin' | 'vendor' | 'user'
  avatar: string | null
  email_verified_at: string | null
  vendor?: Vendor
}

export interface Vendor {
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

export interface Property {
  id: number
  user_id: number
  title: string
  slug: string
  description: string
  price: number
  discount_price: number | null
  purpose: 'buy' | 'rent'
  property_type: string
  bhk: number | null
  area_sqft: number
  bedrooms: number
  bathrooms: number
  furnished_status: string
  property_age: number | null
  ownership_type: string
  floors: number | null
  parking: number | null
  balcony: number | null
  address: string
  city: string
  state: string
  zip_code: string
  lat: number | null
  lng: number | null
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'rented'
  is_featured: boolean
  is_verified: boolean
  views: number
  images: PropertyImage[]
  amenities: Amenity[]
  user: User
  reviews: Review[]
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  user: User
  rating: number
  review: string | null
  created_at: string
}

export interface Booking {
  id: number
  user_id: number
  property_id: number
  visit_date: string
  visit_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  notes: string | null
  property: Property
  created_at: string
  updated_at: string
}

export interface Lead {
  id: number
  vendor_id: number
  user_id: number | null
  property_id: number
  name: string
  email: string
  phone: string
  message: string | null
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed'
  source: string | null
  property: Property
  user: User | null
  created_at: string
}

export interface PropertyImage {
  id: number
  property_id: number
  image_path: string
  is_primary: boolean
  sort_order: number
}

export interface Amenity {
  id: number
  name: string
  icon: string | null
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}
