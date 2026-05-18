import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { propertyService } from '../../services/propertyService'
import type { Property } from '../../types'

export default function UserReviews() {
  const [reviewedProperties, setReviewedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    propertyService.list({ per_page: 50 })
      .then(r => {
        const reviewed = r.data.filter(p => p.reviews?.length > 0)
        setReviewedProperties(reviewed)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading reviews...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Reviews</h1>
      {reviewedProperties.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">You haven't reviewed any properties yet.</p>
          <Link to="/properties" className="mt-4 inline-block text-primary hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewedProperties.map(p => (
            <div key={p.id} className="border rounded-lg p-4 bg-card">
              <Link to={`/properties/${p.slug}`} className="font-semibold hover:text-primary">{p.title}</Link>
              {p.reviews?.map(r => (
                <div key={r.id} className="mt-2 pl-4 border-l-2 border-primary/30">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.review && <p className="text-sm mt-1">{r.review}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
