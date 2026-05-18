import { useState, useEffect, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { ArrowRight, MapPin, Bed, Bath, Square, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { propertyService } from '../../services/propertyService'
import type { Property } from '../../types'
import { mockProperties } from '../../data/mockData'

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

const getFirstImage = (property: Property): string => {
  if (property.images && property.images.length > 0) {
    return property.images[0].image_path
  }
  return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
}

const propertyTags = ['Premium', 'Featured', 'Smart Home', 'Exclusive']

export default function FeaturedProperties() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  useEffect(() => {
    let cancelled = false
    propertyService.featured()
      .then((res) => {
        if (!cancelled && res.data) setProperties(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    const timer = setTimeout(() => {
      if (!cancelled && loading) {
        setProperties(mockProperties.filter((p) => p.is_featured))
        setLoading(false)
      }
    }, 1500)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [])

  const updateScrollButtons = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollButtons)
    updateScrollButtons()
    return () => el.removeEventListener('scroll', updateScrollButtons)
  }, [properties])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.querySelector('a, div')?.clientWidth ?? 320
    const gap = 16
    const scrollAmount = (cardWidth + gap) * (direction === 'left' ? -1 : 1)
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-16"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Curated Collection</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 text-gradient-light">
              Featured Properties
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Handpicked premium properties that redefine modern living
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-full glass-card hover:glow transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="p-2.5 rounded-full glass-card hover:glow transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              to="/properties"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-2"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : properties.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden glass-card animate-pulse">
                <div className="aspect-[16/10] bg-foreground/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-foreground/5 rounded w-2/3" />
                  <div className="h-4 bg-foreground/5 rounded w-1/2" />
                  <div className="h-4 bg-foreground/5 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {properties.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative rounded-3xl overflow-hidden glass-card hover:glow transition-all duration-500 flex-shrink-0 w-[calc(100vw-2rem)] sm:w-[calc(50vw-2rem)] md:w-[calc(33.33vw-2.5rem)] lg:w-[calc(25vw-2.5rem)] xl:w-[calc(20vw-2.5rem)] min-w-[280px] snap-start"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <motion.img
                      src={getFirstImage(property)}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-foreground/10 backdrop-blur-md border border-border text-foreground">
                        {propertyTags[i % propertyTags.length]}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold truncate">{property.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{property.city}, {property.state}</span>
                        </p>
                      </div>
                      <span className="text-lg font-bold text-gradient whitespace-nowrap">{formatPrice(property.price)}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Bed className="w-4 h-4" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Bath className="w-4 h-4" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground ml-auto">
                        <Square className="w-4 h-4" /> {property.area_sqft} sqft
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/properties/${property.slug}`}
                    className="absolute inset-0"
                    aria-label={`View ${property.title}`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
