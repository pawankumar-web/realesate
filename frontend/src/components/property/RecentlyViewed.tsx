import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Bed, Bath, Square, MapPin, Eye, Trash2 } from 'lucide-react'
import type { ViewedProperty } from '../../hooks/useRecentlyViewed'

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

interface Props {
  items: ViewedProperty[]
  onClear?: () => void
}

export default function RecentlyViewed({ items, onClear }: Props) {
  if (items.length === 0) return null

  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Continue Exploring</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2 text-gradient-light flex items-center gap-3">
              <Eye className="w-6 h-6 text-primary" />
              Recently Viewed
            </h2>
          </div>
          {onClear && (
            <button onClick={onClear} className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
          {items.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="snap-start shrink-0"
            >
              <Link to={`/properties/${property.slug}`} className="block group">
                <div className="w-72 glass-card rounded-2xl overflow-hidden hover:glow transition-all duration-500">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">{property.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{property.city}</span>
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gradient whitespace-nowrap">{formatPrice(property.price)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Square className="w-3.5 h-3.5" /> {property.area_sqft}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
