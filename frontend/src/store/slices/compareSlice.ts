import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Property } from '../../types'

interface CompareState {
  items: Property[]
}

const initialState: CompareState = {
  items: [],
}

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare(state, action: PayloadAction<Property>) {
      if (state.items.length >= 4) return
      const exists = state.items.find((p) => p.id === action.payload.id)
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeFromCompare(state, action: PayloadAction<number>) {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    clearCompare(state) {
      state.items = []
    },
  },
})

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions
export default compareSlice.reducer
