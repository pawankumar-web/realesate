import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { type AuthState } from '../../../store/slices/authSlice'
import LoginPage from '../../../pages/public/LoginPage'

interface RootState {
  auth: AuthState
}

function renderWithProviders(ui: React.ReactElement, { preloadedState }: { preloadedState?: Partial<RootState> } = {}) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: preloadedState as RootState,
  })
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders login form', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In as User' })).toBeInTheDocument()
  })

  it('shows error message when error exists', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: { auth: { user: null, token: null, loading: false, error: 'Invalid credentials' } },
    })
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('disables submit button while loading', () => {
    renderWithProviders(<LoginPage />, {
      preloadedState: { auth: { user: null, token: null, loading: true, error: null } },
    })
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled()
  })

  it('redirects to home when user is already logged in', () => {
    const mockUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'user', phone: null, avatar: null, email_verified_at: null }
    renderWithProviders(<LoginPage />, {
      preloadedState: { auth: { user: mockUser, token: 'token', loading: false, error: null } },
    })
    expect(screen.queryByText('Welcome back')).not.toBeInTheDocument()
  })

  it('has link to register page', () => {
    renderWithProviders(<LoginPage />)
    expect(screen.getByText('Sign up')).toBeInTheDocument()
    expect(screen.getByText('Sign up').closest('a')).toHaveAttribute('href', '/register')
  })
})
