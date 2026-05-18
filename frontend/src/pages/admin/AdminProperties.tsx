import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { Button } from '../../components/ui/button'
import type { Property } from '../../types'

const statusStyles: Record<string, string> = {
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  rejected: 'text-red-400',
  sold: 'text-blue-400',
  rented: 'text-purple-400',
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProperties = () => {
    setLoading(true)
    adminService.getProperties()
      .then(r => setProperties(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProperties() }, [])

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveProperty(id)
      setProperties(p => p.map(x => x.id === id ? { ...x, status: 'approved', is_verified: true } : x))
    } catch {}
  }

  const handleReject = async (id: number) => {
    try {
      await adminService.rejectProperty(id)
      setProperties(p => p.map(x => x.id === id ? { ...x, status: 'rejected' } : x))
    } catch {}
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this property?')) return
    try {
      await adminService.deleteProperty(id)
      setProperties(p => p.filter(x => x.id !== id))
    } catch {}
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading properties...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Property Management</h1>
      {properties.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">No properties found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map(p => (
            <div key={p.id} className="border rounded-lg p-4 bg-card flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  ${p.price.toLocaleString()} &middot; {p.city} &middot; {p.user?.name}
                </p>
                <span className={`text-xs font-medium ${statusStyles[p.status] || ''}`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                {p.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => handleApprove(p.id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
                    <Button variant="outline" size="sm" onClick={() => handleReject(p.id)} className="text-red-400">Reject</Button>
                  </>
                )}
                <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="text-red-400">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
