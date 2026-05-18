import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, Tag, ArrowLeft, Share2, Heart, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { publicService } from '../../services/publicService'
import type { PublicBlogPost } from '../../services/publicService'

const blogImages: Record<string, string> = {
  '2026-real-estate-market-trends': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80',
  'first-time-home-buyer-guide': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  'maximize-home-selling-price': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
  'real-estate-investment-2026': 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200&q=80',
  'biophilic-interior-design-trends': 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=80',
  'legal-checklist-property-purchase': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1200&q=80',
  'smart-home-technology-value': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80',
  'staging-tips-quick-sale': 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=80',
  'rental-property-passive-income': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
}

const defaultImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<PublicBlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    publicService.getBlog(slug)
      .then((res) => {
        if (res.data) setPost(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const mins = Math.max(1, Math.ceil(words / 200))
    return `${mins} min read`
  }

  const parseContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('Step ')) {
        const lines = block.split('\n')
        const heading = lines[0]
        const body = lines.slice(1).join('\n')
        return { type: 'step', heading, body, key: i }
      }
      if (block.match(/^\d+\.\s/)) {
        const lines = block.split('\n')
        return { type: 'list', lines, key: i }
      }
      return { type: 'paragraph', text: block, key: i }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Article not found</h2>
          <p className="text-muted-foreground mt-2">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const postCategory = (post.tags?.[0]) || 'General'
  const postDate = formatDate(post.published_at)
  const readTime = getReadTime(post.content)
  const avatarInitials = post.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const blocks = parseContent(post.content)

  return (
    <div className="min-h-screen pt-20">
      {/* Back navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden glass-card mb-8"
        >
          <div className="aspect-[21/9] max-h-[50vh]">
            <img
              src={blogImages[post.slug] || defaultImage}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = defaultImage }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white mb-2">
              <Tag className="w-3 h-3" />
              {postCategory}
            </span>
          </div>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient-light">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
                {avatarInitials}
              </div>
              <span>{post.author.name}</span>
            </div>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {postDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="ghost" size="sm" className="rounded-xl">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-6 sm:p-8 mb-8"
        >
          <div className="prose prose-invert max-w-none">
            {blocks.map((block) => {
              if (block.type === 'step') {
                return (
                  <div key={block.key} className="mb-6">
                    <h3 className="text-lg font-semibold text-gradient-light mb-2">{block.heading}</h3>
                    <p className="text-muted-foreground leading-relaxed">{block.body}</p>
                  </div>
                )
              }
              if (block.type === 'list') {
                return (
                  <div key={block.key} className="mb-4">
                    {(block as any).lines.map((line: string, li: number) => (
                      <p key={li} className="text-muted-foreground leading-relaxed mb-1">{line}</p>
                    ))}
                  </div>
                )
              }
              return (
                <p key={block.key} className="text-muted-foreground leading-relaxed mb-4">{block.text}</p>
              )
            })}
          </div>
        </motion.div>

        {/* Author Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-white shrink-0">
            {avatarInitials}
          </div>
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Real estate expert with years of industry experience. Passionate about helping people find their dream homes.
            </p>
          </div>
        </motion.div>
      </article>
    </div>
  )
}
