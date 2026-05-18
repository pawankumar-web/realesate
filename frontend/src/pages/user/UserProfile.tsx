import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { userService } from '../../services/userService'
import { fetchUser } from '../../store/slices/authSlice'
import type { AppDispatch } from '../../store'

export default function UserProfile() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await userService.updateProfile({ name, email, phone })
      dispatch(fetchUser())
      setMessage('Profile updated successfully')
    } catch {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        {message && <p className="text-sm text-green-400">{message}</p>}
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Profile'}</Button>
      </form>
    </div>
  )
}
