import { describe, it, expect, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, { login, register, fetchUser, logout, clearError } from '../../../store/slices/authSlice'
import type { RootState } from '../../../store'

const mockUser = { id: 1, name: 'Test', email: 'test@test.com', role: 'user', avatar: null, phone: null, email_verified_at: null }
const mockToken = 'fake-token'

beforeEach(() => {
  localStorage.clear()
})

describe('authSlice', () => {
  it('should return initial state', () => {
    const store = configureStore({ reducer: { auth: authReducer } })
    const state = (store.getState() as RootState).auth
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('should handle logout', () => {
    localStorage.setItem('token', mockToken)
    localStorage.setItem('user', JSON.stringify(mockUser))

    const store = configureStore({ reducer: { auth: authReducer } })
    store.dispatch(logout())
    const state = (store.getState() as RootState).auth

    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  it('should handle clearError', () => {
    const store = configureStore({
      reducer: { auth: authReducer },
      preloadedState: { auth: { user: null, token: null, loading: false, error: 'some error' } },
    })
    store.dispatch(clearError())
    const state = (store.getState() as RootState).auth
    expect(state.error).toBeNull()
  })

  it('should handle login.fulfilled', () => {
    const store = configureStore({ reducer: { auth: authReducer } })
    const payload = { user: mockUser, token: mockToken }
    store.dispatch(login.fulfilled(payload, '', { email: 'test@test.com', password: 'pass' }))
    const state = (store.getState() as RootState).auth

    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(state.loading).toBe(false)
    expect(localStorage.getItem('token')).toBe(mockToken)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })

  it('should handle login.pending', () => {
    const store = configureStore({ reducer: { auth: authReducer } })
    store.dispatch(login.pending('', { email: 'test@test.com', password: 'pass' }))
    const state = (store.getState() as RootState).auth

    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle login.rejected', () => {
    const store = configureStore({ reducer: { auth: authReducer } })
    store.dispatch(login.rejected(new Error(), '', { email: 'test@test.com', password: 'pass' }, 'Invalid credentials'))
    const state = (store.getState() as RootState).auth

    expect(state.loading).toBe(false)
    expect(state.error).toBe('Invalid credentials')
  })

  it('should handle register.fulfilled', () => {
    const store = configureStore({ reducer: { auth: authReducer } })
    const payload = { user: mockUser, token: mockToken }
    store.dispatch(register.fulfilled(payload, '', { name: 'Test', email: 'test@test.com', password: 'pass', password_confirmation: 'pass', role: 'user' }))
    const state = (store.getState() as RootState).auth

    expect(state.user).toEqual(mockUser)
    expect(state.token).toBe(mockToken)
    expect(localStorage.getItem('token')).toBe(mockToken)
  })

  it('should handle fetchUser.fulfilled', () => {
    const store = configureStore({ reducer: { auth: authReducer } })
    store.dispatch(fetchUser.fulfilled(mockUser, ''))
    const state = (store.getState() as RootState).auth

    expect(state.user).toEqual(mockUser)
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser))
  })
})
