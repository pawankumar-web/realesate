import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Calendar, User, Tag, ArrowRight, Clock, BookOpen, Loader2 } from 'lucide-react'
import { publicService } from '../../services/publicService'
import type { PublicBlogPost } from '../../services/publicService'
import { mockBlogPosts } from '../../data/mockData'

const categories = ['All', 'Market Trends', 'Buying Guide', 'Selling Tips', 'Investment', 'Interior Design', 'Legal']

const blogImages: Record<string, string> = {
  '2026-real-estate-market-trends': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&q=80',
  'first-time-home-buyer-guide': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
  'maximize-home-selling-price': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
  'real-estate-investment-2026': 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600&q=80',
  'biophilic-interior-design-trends': 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&q=80',
  'legal-checklist-property-purchase': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
  'smart-home-technology-value': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&q=80',
  'staging-tips-quick-sale': 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=80',
  'rental-property-passive-income': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
}

const defaultImage = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [posts, setPosts] = useState<PublicBlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fallbackTimer = setTimeout(() => {
      if (!cancelled && loading) {
        setPosts(mockBlogPosts)
        setLoading(false)
      }
    }, 1500)
    publicService.getBlogs()
      .then((res) => {
        if (!cancelled && res.data) setPosts(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) setPosts(mockBlogPosts)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; clearTimeout(fallbackTimer) }
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    const postCategory = post.tags?.[0] || 'General'
    const matchesCategory = activeCategory === 'All' || postCategory === activeCategory
    return matchesSearch && matchesCategory
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const formatDate = (date: string | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getReadTime = (content: string) => {
    const words = content.split(/\s+/).length
    const mins = Math.max(1, Math.ceil(words / 200))
    return `${mins} min read`
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Insights & Updates</span>
            <h1 className="text-4xl sm:text-6xl font-bold mt-3 text-gradient-light">
              Our
              <br />
              <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Expert insights, market analysis, and guides from our team
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="sticky top-20 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-foreground/5 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none justify-center flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">Try a different search or category</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredPosts.map((post) => {
              const postCategory = (post.tags?.[0]) || 'General'
              return (
                <motion.div key={post.id} variants={itemVariants}>
                  <Link to={`/blog/${post.slug}`} className="block group">
                    <div className="glass-card rounded-2xl overflow-hidden hover:glow transition-all duration-500 h-full">
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img
                          src={blogImages[post.slug] || defaultImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { (e.target as HTMLImageElement).src = defaultImage }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-foreground/10 backdrop-blur-md border border-border text-foreground flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {postCategory}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getReadTime(post.content)}
                          </span>
                        </div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author.name}
                          </span>
                          <span className="text-xs text-primary flex items-center gap-1 group-hover/btn:gap-2 transition-all">
                            Read More <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
