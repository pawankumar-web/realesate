import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { Button } from '../../components/ui/button'
import type { User } from '../../types'

const roleStyles: Record<string, string> = {
  admin: 'bg-purple-500/20 text-purple-400',
  vendor: 'bg-blue-500/20 text-blue-400',
  user: 'bg-green-500/20 text-green-400',
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = () => {
    setLoading(true)
    adminService.getUsers()
      .then(r => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return
    try {
      await adminService.deleteUser(id)
      setUsers(u => u.filter(x => x.id !== id))
    } catch {}
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading users...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {users.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 text-muted-foreground">{u.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${roleStyles[u.role] || ''}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs">{u.email_verified_at ? 'Verified' : 'Unverified'}</span>
                  </td>
                  <td className="py-3">
                    <Button variant="outline" size="sm" onClick={() => handleDelete(u.id)} className="text-red-400">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
