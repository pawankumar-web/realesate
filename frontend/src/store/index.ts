import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import compareReducer from './slices/compareSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    compare: compareReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
