import { useEffect, useState } from 'react'
import { adminService, type BlogPost } from '../../services/adminService'
import { Button } from '../../components/ui/button'

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBlogs = () => {
    setLoading(true)
    adminService.getBlogs()
      .then(r => setBlogs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBlogs() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this blog post?')) return
    try {
      await adminService.deleteBlog(id)
      setBlogs(b => b.filter(x => x.id !== id))
    } catch {}
  }

  if (loading) return <div className="text-center py-12 text-muted-foreground">Loading blog posts...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button onClick={() => {
          const title = prompt('Blog title:')
          if (!title) return
          const status = confirm('Click OK for published, Cancel for draft') ? 'published' as const : 'draft' as const
          adminService.createBlog({ title, content: 'Write your content here...', status })
            .then(() => fetchBlogs())
            .catch(() => alert('Failed to create blog'))
        }}>Add Blog</Button>
      </div>
      {blogs.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center">
          <p className="text-muted-foreground">No blog posts yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map(b => (
            <div key={b.id} className="border rounded-lg p-4 bg-card flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">{b.title}</p>
                <p className="text-sm text-muted-foreground">
                  {b.author?.name} &middot; {new Date(b.created_at).toLocaleDateString()}
                </p>
                <span className={`text-xs font-medium ${b.status === 'published' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  const newStatus = b.status === 'published' ? 'draft' as const : 'published' as const
                  adminService.updateBlog(b.id, { status: newStatus })
                    .then(() => fetchBlogs())
                    .catch(() => {})
                }}>
                  {b.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(b.id)} className="text-red-400">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
