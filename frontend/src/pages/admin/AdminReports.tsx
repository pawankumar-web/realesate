import { useEffect, useState } from 'react'
import { adminService, type AdminReport } from '../../services/adminService'

export default function AdminReports() {
  const [report, setReport] = useState<AdminReport | null>(null)

  useEffect(() => {
    adminService.getReports().then(r => setReport(r.data)).catch(() => {})
  }, [])

  const revenue = report?.revenue?.total ?? 0
  const totalUsers = report?.users_by_role?.reduce((sum, r) => sum + r.total, 0) ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: `$${revenue.toLocaleString()}` },
          { label: 'Registered Users', value: String(totalUsers) },
          { label: 'Total Properties', value: String(report?.properties_by_status?.reduce((s, r) => s + r.total, 0) ?? '0') },
          { label: 'Properties for Sale', value: String(report?.properties_by_purpose?.find(p => p.purpose === 'buy')?.total ?? '0') },
        ].map((s) => (
          <div key={s.label} className="border rounded-lg p-4 bg-card">
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-3">Users by Role</h2>
          {report?.users_by_role?.length ? (
            <div className="space-y-2">
              {report.users_by_role.map(r => (
                <div key={r.role} className="flex justify-between text-sm">
                  <span className="capitalize">{r.role}</span>
                  <span className="font-medium">{r.total}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No data</p>}
        </div>
        <div className="border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-3">Properties by Status</h2>
          {report?.properties_by_status?.length ? (
            <div className="space-y-2">
              {report.properties_by_status.map(r => (
                <div key={r.status} className="flex justify-between text-sm">
                  <span className="capitalize">{r.status}</span>
                  <span className="font-medium">{r.total}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No data</p>}
        </div>
      </div>

      {report?.recent_payments && report.recent_payments.length > 0 && (
        <div className="mt-6 border rounded-lg p-4 bg-card">
          <h2 className="font-semibold mb-3">Recent Payments</h2>
          <div className="space-y-2">
            {report.recent_payments.map(p => (
              <div key={p.id} className="flex justify-between text-sm">
                <span>{p.user?.name}</span>
                <span>${p.amount.toLocaleString()} <span className="text-muted-foreground capitalize">({p.status})</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
