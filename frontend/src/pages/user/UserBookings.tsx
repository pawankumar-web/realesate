import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../../services/userService'
import type { Booking } from '../../types'

const statusStyles: Record<string, string> = {
  pending: 'text-yellow-400',
  confirmed: 'text-green-400',
  cancelled: 'text-red-400',
  completed: 'text-blue-400',
}

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    userService.getBookings()
      .then(r => setBookings(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading bookings...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">No scheduled visits yet. Book a property visit to get started.</p>
          <Link to="/properties" className="mt-4 inline-block text-primary hover:underline">Browse Properties</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b.id} className="border rounded-lg p-4 bg-card flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Link to={`/properties/${b.property.slug}`} className="font-semibold hover:text-primary truncate block">
                  {b.property.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {new Date(b.visit_date).toLocaleDateString()} at {b.visit_time}
                </p>
                {b.notes && <p className="text-sm text-muted-foreground mt-1">Note: {b.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${statusStyles[b.status] || ''}`}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
