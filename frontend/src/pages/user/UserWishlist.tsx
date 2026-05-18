import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../services/userService'
import type { Property } from '../../types'

export default function UserWishlist() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = () => {
    setLoading(true)
    userService.getBookmarks()
      .then(r => setProperties(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchWishlist() }, [])

  const handleRemove = async (id: number) => {
    try {
      await userService.toggleBookmark(id)
      setProperties(p => p.filter(x => x.id !== id))
    } catch {}
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading wishlist...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {properties.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">Your wishlist is empty. Browse properties and save your favorites!</p>
          <Link to="/properties" className="mt-4 inline-block text-primary hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(p => (
            <div key={p.id} className="border rounded-lg bg-card overflow-hidden group">
              <Link to={`/properties/${p.slug}`}>
                <div className="h-40 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                  {p.images?.[0] ? (
                    <img src={p.images[0].image_path} alt={p.title} className="w-full h-full object-cover" />
                  ) : 'No Image'}
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/properties/${p.slug}`}>
                  <h3 className="font-semibold truncate">{p.title}</h3>
                </Link>
                <p className="text-lg font-bold text-primary">${p.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{p.city}, {p.state}</p>
                <button onClick={() => handleRemove(p.id)} className="text-sm text-red-400 hover:text-red-300 mt-2">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
