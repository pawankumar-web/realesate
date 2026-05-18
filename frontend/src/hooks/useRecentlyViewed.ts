import { useState, useCallback } from 'react'

export interface ViewedProperty {
  id: number
  slug: string
  title: string
  price: number
  city: string
  image: string
  bedrooms: number
  bathrooms: number
  area_sqft: number
  viewedAt: number
}

const STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS = 8

function load(): ViewedProperty[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(items: ViewedProperty[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* ignore */ }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<ViewedProperty[]>(load)

  const addProperty = useCallback((property: ViewedProperty) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== property.id)
      const updated = [property, ...filtered].slice(0, MAX_ITEMS)
      save(updated)
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setItems([])
  }, [])

  return { recentlyViewed: items, addProperty, clearAll }
}
