import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { useEffect, useState } from 'react'
import { userService } from '../../services/userService'

interface Counts { wishlist: number; bookings: number; reviews: number }

export default function UserDashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [counts, setCounts] = useState<Counts>({ wishlist: 0, bookings: 0, reviews: 0 })

  useEffect(() => {
    Promise.all([
      userService.getBookmarks().then(r => setCounts(c => ({ ...c, wishlist: r.meta.total }))).catch(() => {}),
      userService.getBookings().then(r => setCounts(c => ({ ...c, bookings: r.meta.total }))).catch(() => {}),
    ])
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h1>
      <p className="text-muted-foreground mb-6">Manage your account and property interests</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Wishlist', value: String(counts.wishlist), path: '/dashboard/wishlist' },
          { label: 'Bookings', value: String(counts.bookings), path: '/dashboard/bookings' },
          { label: 'Reviews', value: String(counts.reviews), path: '/dashboard/reviews' },
          { label: 'Saved Searches', value: '0', path: '/dashboard/saved-searches' },
        ].map((s) => (
          <Link key={s.label} to={s.path} className="border rounded-lg p-4 bg-card hover:border-primary transition-colors">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="font-semibold mb-2">Quick Links</h2>
        <div className="flex gap-3">
          <Link to="/properties"><Button variant="outline" size="sm">Browse Properties</Button></Link>
          <Link to="/dashboard/profile"><Button variant="outline" size="sm">Edit Profile</Button></Link>
        </div>
      </div>
    </div>
  )
}
