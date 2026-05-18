import { useEffect, useState } from 'react'
import { adminService, type Banner } from '../../services/adminService'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [position, setPosition] = useState('home-hero')
  const [file, setFile] = useState<File | null>(null)
  const [subtitle, setSubtitle] = useState('')
  const [link, setLink] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchBanners = () => {
    setLoading(true)
    adminService.getBanners()
      .then(r => setBanners(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBanners() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) { alert('Please select an image'); return }
    setCreating(true)
    try {
      await adminService.createBanner({ title, position, image: file, subtitle, link })
      setTitle(''); setSubtitle(''); setLink(''); setFile(null)
      fetchBanners()
    } catch { alert('Failed to create banner') }
    finally { setCreating(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this banner?')) return
    try {
      await adminService.deleteBanner(id)
      setBanners(b => b.filter(x => x.id !== id))
    } catch {}
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading banners...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Banner Management</h1>

      <form onSubmit={handleCreate} className="border rounded-lg p-4 bg-card mb-6 space-y-3">
        <h2 className="font-semibold">Add New Banner</h2>
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Input placeholder="Position (e.g. home-hero)" value={position} onChange={e => setPosition(e.target.value)} required />
          <Input placeholder="Subtitle (optional)" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          <Input placeholder="Link URL (optional)" value={link} onChange={e => setLink(e.target.value)} />
          <div>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required className="text-sm" />
          </div>
        </div>
        <Button type="submit" disabled={creating}>{creating ? 'Uploading...' : 'Create Banner'}</Button>
      </form>

      {banners.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">No banners yet. Create one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map(b => (
            <div key={b.id} className="border rounded-lg bg-card overflow-hidden">
              <div className="h-32 bg-muted flex items-center justify-center">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.position}</p>
                <Button variant="outline" size="sm" onClick={() => handleDelete(b.id)} className="mt-2 text-red-400">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
