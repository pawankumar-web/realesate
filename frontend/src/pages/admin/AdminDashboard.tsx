import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService, type AdminDashboardStats } from '../../services/adminService'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)

  useEffect(() => {
    adminService.getDashboard().then(r => setStats(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: String(stats?.total_users ?? '0') },
          { label: 'Total Vendors', value: String(stats?.total_vendors ?? '0') },
          { label: 'Properties', value: String(stats?.total_properties ?? '0') },
          { label: 'Pending Approvals', value: String(stats?.pending_properties ?? '0') },
        ].map((s) => (
          <div key={s.label} className="border rounded-lg p-4 bg-card">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-3">Recent Users</h2>
          {stats?.recent_users?.length ? (
            <div className="space-y-2">
              {stats.recent_users.map(u => (
                <div key={u.id} className="flex justify-between text-sm">
                  <span>{u.name}</span>
                  <span className="text-muted-foreground capitalize">{u.role}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No recent users</p>}
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-3">Recent Properties</h2>
          {stats?.recent_properties?.length ? (
            <div className="space-y-2">
              {stats.recent_properties.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="truncate">{p.title}</span>
                  <span className="text-muted-foreground capitalize">{p.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No recent properties</p>}
        </div>
      </div>
    </div>
  )
}
