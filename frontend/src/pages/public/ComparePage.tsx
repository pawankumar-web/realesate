import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BarChart3, Bed, Bath, Square, MapPin, Home, Building2, Calendar, Car, Sun, ArrowLeft, Trash2, Sparkles, Check, X, Star, Maximize, Layers } from 'lucide-react'
import { RootState } from '../../store'
import { removeFromCompare, clearCompare } from '../../store/slices/compareSlice'
import type { Property } from '../../types'

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)} K`
  return `₹${price.toLocaleString('en-IN')}`
}

const rows: { label: string; key: keyof Property | 'discount'; icon: React.ReactNode; render: (p: Property) => string | React.ReactNode }[] = [
  { label: 'Price', key: 'price', icon: <BarChart3 className="w-3.5 h-3.5" />, render: (p) => {
    const price = formatPrice(p.price)
    if (p.discount_price) {
      return (
        <div>
          <span className="text-gradient font-bold">{formatPrice(p.discount_price)}</span>
          <span className="block text-[10px] text-muted-foreground/60 line-through">{price}</span>
        </div>
      )
    }
    return <span className="text-gradient font-bold">{price}</span>
  }},
  { label: 'Purpose', key: 'purpose', icon: <Building2 className="w-3.5 h-3.5" />, render: (p) => <span className="capitalize">{p.purpose}</span> },
  { label: 'Type', key: 'property_type', icon: <Home className="w-3.5 h-3.5" />, render: (p) => <span className="capitalize">{p.property_type}</span> },
  { label: 'Bedrooms', key: 'bedrooms', icon: <Bed className="w-3.5 h-3.5" />, render: (p) => p.bedrooms > 0 ? <span className="font-semibold">{p.bedrooms}</span> : <span className="text-muted-foreground/50">-</span> },
  { label: 'Bathrooms', key: 'bathrooms', icon: <Bath className="w-3.5 h-3.5" />, render: (p) => p.bathrooms > 0 ? <span className="font-semibold">{p.bathrooms}</span> : <span className="text-muted-foreground/50">-</span> },
  { label: 'Area', key: 'area_sqft', icon: <Maximize className="w-3.5 h-3.5" />, render: (p) => <span className="font-semibold">{p.area_sqft.toLocaleString()} sqft</span> },
  { label: 'BHK', key: 'bhk', icon: <Layers className="w-3.5 h-3.5" />, render: (p) => p.bhk ? <span className="font-semibold">{p.bhk} BHK</span> : <span className="text-muted-foreground/50">-</span> },
  { label: 'Furnished', key: 'furnished_status', icon: <Sun className="w-3.5 h-3.5" />, render: (p) => p.furnished_status || <span className="text-muted-foreground/50">-</span> },
  { label: 'Ownership', key: 'ownership_type', icon: <Star className="w-3.5 h-3.5" />, render: (p) => p.ownership_type || <span className="text-muted-foreground/50">-</span> },
  { label: 'Property Age', key: 'property_age', icon: <Calendar className="w-3.5 h-3.5" />, render: (p) => p.property_age !== null ? <span>{p.property_age} years</span> : <span className="text-muted-foreground/50">-</span> },
  { label: 'Floors', key: 'floors', icon: <Layers className="w-3.5 h-3.5" />, render: (p) => p.floors ? <span>{p.floors}</span> : <span className="text-muted-foreground/50">-</span> },
  { label: 'Parking', key: 'parking', icon: <Car className="w-3.5 h-3.5" />, render: (p) => p.parking ? <div className="flex items-center justify-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /><span>{p.parking}</span></div> : <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" /> },
  { label: 'Balcony', key: 'balcony', icon: <Sun className="w-3.5 h-3.5" />, render: (p) => p.balcony ? <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" /> },
  { label: 'City', key: 'city', icon: <MapPin className="w-3.5 h-3.5" />, render: (p) => <span>{p.city}</span> },
  { label: 'State', key: 'state', icon: <MapPin className="w-3.5 h-3.5" />, render: (p) => <span>{p.state}</span> },
  { label: 'Verified', key: 'is_verified', icon: <Check className="w-3.5 h-3.5" />, render: (p) => p.is_verified ? <Check className="w-3.5 h-3.5 text-emerald-400 mx-auto" /> : <X className="w-3.5 h-3.5 text-muted-foreground/40 mx-auto" /> },
]

export default function ComparePage() {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.compare.items)
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  const allProperties = items.length >= 2 ? items : []

  if (allProperties.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Compare Properties</h1>
          <p className="text-muted-foreground mb-8">
            Add properties from the listing page to compare them side by side.
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-32">
      {/* Header */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/properties" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to listings
            </Link>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Comparison</span>
                <h1 className="text-3xl sm:text-4xl font-bold mt-2 text-gradient-light">
                  Side-by-Side <span className="text-gradient">Analysis</span>
                </h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  Comparing {allProperties.length} properties
                </p>
              </div>
              <button
                onClick={() => dispatch(clearCompare())}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            {/* Property cards row */}
            <thead>
              <tr>
                <th className="w-40 sm:w-48 p-3" />
                {allProperties.map((property) => (
                  <th key={property.id} className="p-2 align-top">
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-xl overflow-hidden glass-card border border-border/50 group"
                    >
                      <Link to={`/properties/${property.slug}`} className="block">
                        <div className="relative h-36 sm:h-44 overflow-hidden">
                          <img
                            src={property.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          {property.is_featured && (
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/80 text-primary-foreground backdrop-blur-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Premium
                            </div>
                          )}
                          <button
                            onClick={(e) => { e.preventDefault(); dispatch(removeFromCompare(property.id)) }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                          >
                            <X className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold truncate">{property.title}</h3>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{property.city}, {property.state}</p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                            {property.bedrooms > 0 && <span><Bed className="w-3 h-3 inline mr-0.5" />{property.bedrooms}</span>}
                            <span><Bath className="w-3 h-3 inline mr-0.5" />{property.bathrooms}</span>
                            <span><Square className="w-3 h-3 inline mr-0.5" />{property.area_sqft}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Attribute rows */}
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`group ${i % 2 === 0 ? 'bg-foreground/[0.02]' : ''} hover:bg-foreground/[0.04] transition-colors`}
                >
                  <td className="p-3 text-sm font-medium text-muted-foreground border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <span className="text-primary/60">{row.icon}</span>
                      {row.label}
                    </div>
                  </td>
                  {allProperties.map((property) => (
                    <td key={property.id} className="p-3 text-sm text-center border-b border-border/30">
                      {row.render(property)}
                    </td>
                  ))}
                </motion.tr>
              ))}

              {/* Amenities row */}
              <tr className="bg-foreground/[0.02]">
                <td className="p-3 text-sm font-medium text-muted-foreground border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                    Amenities
                  </div>
                </td>
                {allProperties.map((property) => (
                  <td key={property.id} className="p-3 text-center border-b border-border/30">
                    <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mx-auto">
                      {property.amenities?.length > 0
                        ? property.amenities.map((a) => (
                            <span key={a.id} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20">
                              {a.name}
                            </span>
                          ))
                        : <span className="text-muted-foreground/50 text-xs">None listed</span>
                      }
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating row */}
              <tr>
                <td className="p-3 text-sm font-medium text-muted-foreground border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-primary/60" />
                    Rating
                  </div>
                </td>
                {allProperties.map((property) => {
                  const avgRating = property.reviews?.length
                    ? (property.reviews.reduce((sum, r) => sum + r.rating, 0) / property.reviews.length).toFixed(1)
                    : null
                  return (
                    <td key={property.id} className="p-3 text-center border-b border-border/30">
                      {avgRating
                        ? <div className="flex items-center justify-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{avgRating} ({property.reviews.length})</div>
                        : <span className="text-muted-foreground/50 text-xs">No reviews</span>
                      }
                    </td>
                  )
                })}
              </tr>

              {/* Views row */}
              <tr className="bg-foreground/[0.02]">
                <td className="p-3 text-sm font-medium text-muted-foreground border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-primary/60" />
                    Views
                  </div>
                </td>
                {allProperties.map((property) => (
                  <td key={property.id} className="p-3 text-center border-b border-border/30">
                    <span className="font-semibold">{property.views.toLocaleString()}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  )
}
