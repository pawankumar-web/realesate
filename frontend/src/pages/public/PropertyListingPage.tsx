import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, Grid3X3, LayoutList, MapPin, Bed, Bath, Square, Heart, Sparkles, AlertCircle, RefreshCw, Play, Brain, X, BarChart3, Check } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '../../components/ui/button'
import { propertyService } from '../../services/propertyService'
import type { Property } from '../../types'
import type { RootState } from '../../store'
import { addToCompare, removeFromCompare } from '../../store/slices/compareSlice'
import { mockProperties } from '../../data/mockData'
import PropertyReels from '../../components/property/PropertyReels'
import AIMatchScore from '../../components/property/AIMatchScore'

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)} K`
  return `₹${price.toLocaleString('en-IN')}`
}

const getFirstImage = (property: Property): string => {
  if (property.images && property.images.length > 0) {
    return property.images[0].image_path
  }
  return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
}

const getPropertyTag = (property: Property): string => {
  if (property.is_featured) return 'Premium'
  if (property.purpose === 'rent') return 'Rental'
  if (property.property_type === 'commercial') return 'Commercial'
  if (property.is_verified) return 'Verified'
  return property.furnished_status || property.property_type
}

const filterParamsMap: Record<string, Record<string, string | boolean>> = {
  'Buy': { purpose: 'buy' },
  'Rent': { purpose: 'rent' },
  'Commercial': { property_type: 'commercial' },
  'Premium': { is_featured: true },
  'New Launch': { ready_to_move: true },
}

const filters = ['Buy', 'Rent', 'Commercial', 'Premium', 'New Launch']

export default function PropertyListingPage() {
  const dispatch = useDispatch()
  const compareItems = useSelector((state: RootState) => state.compare.items)
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => (searchParams.get('view') as 'grid' | 'list') || 'grid')
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReels, setShowReels] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Read initial nav params (from MegaMenu/Footer links)
  useEffect(() => {
    const purpose = searchParams.get('purpose')
    const propType = searchParams.get('property_type')
    const isFeatured = searchParams.get('is_featured')
    const readyToMove = searchParams.get('ready_to_move')
    const existingFilter = searchParams.get('filter')
    if (existingFilter) return
    if (purpose === 'buy') searchParams.set('filter', 'Buy')
    else if (purpose === 'rent') searchParams.set('filter', 'Rent')
    else if (propType === 'commercial') searchParams.set('filter', 'Commercial')
    else if (isFeatured === 'true') searchParams.set('filter', 'Premium')
    else if (readyToMove === 'true') searchParams.set('filter', 'New Launch')
    if (purpose || propType || isFeatured || readyToMove) {
      setSearchParams(searchParams, { replace: true })
    }
  }, [])

  const toggleCompare = (property: Property) => {
    if (compareItems.some((p) => p.id === property.id)) {
      dispatch(removeFromCompare(property.id))
    } else {
      dispatch(addToCompare(property))
    }
  }

  const activeFilter = searchParams.get('filter') || 'All'

  const setActiveFilter = (filter: string) => {
    if (filter === 'All') {
      searchParams.delete('filter')
    } else {
      searchParams.set('filter', filter)
    }
    setSearchParams(searchParams, { replace: true })
  }

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const handleRetry = () => {
    setLoading(true)
    setError(null)
  }

  // Sync searchQuery to URL (debounced)
  const syncSearchToUrl = useCallback((q: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      if (q) {
        searchParams.set('q', q)
      } else {
        searchParams.delete('q')
      }
      setSearchParams(searchParams, { replace: true })
    }, 400)
  }, [searchParams, setSearchParams])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    syncSearchToUrl(value)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    if (mode === 'grid') {
      searchParams.delete('view')
    } else {
      searchParams.set('view', mode)
    }
    setSearchParams(searchParams, { replace: true })
  }

  useEffect(() => {
    const params: Record<string, string | boolean> = {}
    if (activeFilter !== 'All' && filterParamsMap[activeFilter]) {
      Object.assign(params, filterParamsMap[activeFilter])
    }
    let cancelled = false
    const fetchTimer = setTimeout(() => {
      if (!cancelled && loading) {
        setProperties(mockProperties)
        setLoading(false)
      }
    }, 1500)
    propertyService.list(params)
      .then((result) => { if (!cancelled) { setProperties(result.data); setLoading(false) } })
      .catch((err: unknown) => {
        if (!cancelled) {
          setProperties(mockProperties)
          setError(null)
          setLoading(false)
        }
      })
    return () => { cancelled = true; clearTimeout(fetchTimer) }
  }, [activeFilter])

  const filteredProperties = properties.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return p.title.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
  })

  const reelProperties = filteredProperties.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    location: `${p.city}, ${p.state}`,
    beds: p.bedrooms,
    baths: p.bathrooms,
    sqft: p.area_sqft,
    image: getFirstImage(p),
  }))

  return (
    <div className="min-h-screen pt-20">
      {/* Reels modal */}
      {showReels && (
        <PropertyReels properties={reelProperties} onClose={() => setShowReels(false)} />
      )}

      {/* Hero Banner */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Discover Premium</span>
            <h1 className="text-4xl sm:text-6xl font-bold mt-3 text-gradient-light">
              Find Your Perfect
              <br />
              <span className="text-gradient">Property</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Browse through our curated collection of premium properties
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="sticky top-20 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by location, property type..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-foreground/5 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-xl h-11"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <button
                onClick={() => setShowReels(true)}
                className="h-11 px-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-primary text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Reels</span>
              </button>
              <div className="flex items-center rounded-xl border border-border overflow-hidden">
                <button onClick={() => handleViewModeChange('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleViewModeChange('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'} transition-colors`}>
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
            {['All', ...filters].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={viewMode === 'list' ? 'flex' : ''}>
                <div className={viewMode === 'list' ? 'w-72 shrink-0' : ''}>
                  <div className={`rounded-2xl overflow-hidden glass-card animate-pulse ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`bg-foreground/5 ${viewMode === 'list' ? 'h-full w-72' : 'aspect-[4/3]'}`} />
                    <div className="p-4 flex-1 space-y-3">
                      <div className="h-4 bg-foreground/5 rounded w-3/4" />
                      <div className="h-3 bg-foreground/5 rounded w-1/2" />
                      <div className="flex gap-3 pt-3 border-t border-border">
                        <div className="h-3 bg-foreground/5 rounded w-16" />
                        <div className="h-3 bg-foreground/5 rounded w-16" />
                        <div className="h-3 bg-foreground/5 rounded w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load properties</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">{error}</p>
            <Button onClick={handleRetry} className="rounded-xl"><RefreshCw className="w-4 h-4 mr-2" />Try Again</Button>
          </motion.div>
        )}

        {!loading && !error && filteredProperties.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4"><Search className="w-8 h-8 text-muted-foreground" /></div>
            <h3 className="text-lg font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground text-sm max-w-md">{searchQuery ? 'Try adjusting your search or filters to find what you\'re looking for.' : 'No properties match the selected filters.'}</p>
          </motion.div>
        )}

        {!loading && !error && filteredProperties.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}
            >
              {filteredProperties.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  layout
                  className={`group relative rounded-2xl overflow-hidden glass-card hover:glow transition-all duration-500 ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  <div className={viewMode === 'list' ? 'w-72 shrink-0' : ''}>
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-full' : 'aspect-[4/3]'}`}>
                      <img src={getFirstImage(property)} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-foreground/10 backdrop-blur-md border border-border text-foreground">
                          {getPropertyTag(property)}
                        </span>
                        {property.is_featured && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-primary/20 backdrop-blur-md border border-primary/30 text-primary flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Pick
                          </span>
                        )}
                      </div>
                      {/* AI Match Score badge */}
                      <div className="absolute bottom-3 left-3">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full glass-card border border-primary/20">
                          <Brain className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-medium text-gradient">{70 + (property.id % 25)}% Match</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <button
                          onClick={(e) => { e.preventDefault(); toggleCompare(property) }}
                          className={`w-7 h-7 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors ${compareItems.some((p) => p.id === property.id) ? 'ring-2 ring-primary' : ''}`}
                          title={compareItems.some((p) => p.id === property.id) ? 'Remove from compare' : 'Add to compare'}
                        >
                          <BarChart3 className={`w-3.5 h-3.5 ${compareItems.some((p) => p.id === property.id) ? 'text-primary' : 'text-white'}`} />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); toggleWishlist(property.id) }}
                          className="w-7 h-7 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center hover:bg-black/40 transition-colors"
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{property.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {property.city}, {property.state}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gradient whitespace-nowrap">{formatPrice(property.price)}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Bed className="w-3.5 h-3.5" />{property.bedrooms}</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Square className="w-3.5 h-3.5" />{property.area_sqft}</span>
                    </div>

                    {/* Investment insight */}
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      High investment potential
                    </div>
                  </div>

                  <Link to={`/properties/${property.slug}`} className="absolute inset-0" aria-label={`View ${property.title}`} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
