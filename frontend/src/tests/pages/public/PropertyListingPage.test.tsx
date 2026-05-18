import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import compareReducer from '../../../store/slices/compareSlice'
import PropertyListingPage from '../../../pages/public/PropertyListingPage'

const mockStore = configureStore({
  reducer: { compare: compareReducer },
})

vi.mock('../../../services/propertyService', () => ({
  propertyService: {
    list: vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 1, title: 'Skyline Penthouse', slug: 'skyline-penthouse', price: 28000000, purpose: 'buy', location: 'Downtown, Mumbai', bedrooms: 4, bathrooms: 3, area_sqft: 2450, city: 'Mumbai', state: 'MH', property_type: 'apartment', is_featured: true, status: 'approved', images: [], amenities: [], created_at: '2024-01-01T00:00:00.000000Z' },
        { id: 2, title: 'Azure Waters Villa', slug: 'azure-waters-villa', price: 45000000, purpose: 'buy', location: 'Goa', bedrooms: 5, bathrooms: 4, area_sqft: 3800, city: 'Goa', state: 'GA', property_type: 'villa', is_featured: true, status: 'approved', images: [], amenities: [], created_at: '2024-01-01T00:00:00.000000Z' },
      ],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 2 },
    }),
  },
}))

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <Provider store={mockStore}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  )
}

describe('PropertyListingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    renderWithProviders(<PropertyListingPage />)
    expect(screen.getByText('Find Your Perfect')).toBeInTheDocument()
  })

  it('renders property cards from API', async () => {
    renderWithProviders(<PropertyListingPage />)
    await waitFor(() => {
      expect(screen.getByText('Skyline Penthouse')).toBeInTheDocument()
    })
    expect(screen.getByText('Azure Waters Villa')).toBeInTheDocument()
  })

  it('renders filter pills', () => {
    renderWithProviders(<PropertyListingPage />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Buy')).toBeInTheDocument()
    expect(screen.getByText('Rent')).toBeInTheDocument()
  })
})
