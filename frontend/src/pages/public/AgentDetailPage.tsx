import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPin, Bed, Bath, Square, Phone, Mail, MessageCircle, 
  Building2, Shield, BadgeCheck, Star, Calendar, ArrowLeft, 
  ChevronRight, Check, Loader2
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { publicService } from '../../services/publicService'
import type { AgentDetail } from '../../services/publicService'
import type { Property } from '../../types'

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

const getFirstImage = (property: Property): string => {
  if (property.images && property.images.length > 0) {
    return property.images[0].image_path
  }
  return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'
}

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [agent, setAgent] = useState<AgentDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    publicService.getAgent(Number(id))
      .then((res) => {
        if (res.data) setAgent(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Agents
          </Link>
        </div>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">Agent not found</h2>
          <p className="text-muted-foreground mt-2">The agent you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const properties = (agent.properties || []) as Property[]
  const specialties = ['Luxury Villas', 'Apartments', 'Commercial', 'Investment Properties']

  return (
    <div className="min-h-screen pt-20">
      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Agents
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-8"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-primary to-accent p-[3px] shrink-0">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                    <span className="text-4xl font-bold text-gradient">
                      {agent.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  {agent.vendor?.is_verified && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-[3px] border-card">
                      <BadgeCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-3xl font-bold text-gradient-light">{agent.name}</h1>
                  <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <Building2 className="w-4 h-4" />
                    {agent.vendor?.company_name || 'Independent Agent'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                    {agent.vendor?.is_verified && (
                      <span className="flex items-center gap-1 text-sm text-emerald-400">
                        <Shield className="w-4 h-4" /> Verified Agent
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" /> Professional
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-6">
                {agent.name} is a dedicated real estate professional with extensive experience in the property market. 
                Known for exceptional client service and deep market knowledge, {agent.name.split(' ')[0]} has helped 
                numerous clients find their dream properties and make successful real estate investments.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {specialties.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-foreground/5 border border-border text-primary">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Listed Properties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gradient-light">
                  Listed Properties
                  <span className="text-sm text-muted-foreground ml-2">({properties.length})</span>
                </h2>
                <Link to="/properties" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
                  <p className="text-muted-foreground">Check back later for new listings.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {properties.slice(0, 6).map((property, i) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="group relative rounded-2xl overflow-hidden glass-card hover:glow transition-all duration-500"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={getFirstImage(property)}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
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
                      <Link to={`/properties/${property.slug}`} className="absolute inset-0" aria-label={`View ${property.title}`} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 rounded-2xl glass-card"
              >
                <h3 className="font-semibold mb-4">Contact Agent</h3>
                <div className="space-y-3">
                  <a href={`tel:${agent.phone}`}>
                    <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </a>
                  <a href={`https://wa.me/91${agent.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full rounded-xl">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={`mailto:${agent.email}`}>
                    <Button variant="outline" className="w-full rounded-xl">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl glass-card"
              >
                <h3 className="font-semibold mb-4">Agent Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{agent.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm truncate">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{agent.vendor?.company_name || 'Independent Agent'}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl glass-card"
              >
                <h3 className="font-semibold mb-3">Why Work With {agent.name.split(' ')[0]}?</h3>
                <ul className="space-y-2">
                  {[
                    '10+ years industry experience',
                    'Top performer nationally',
                    'Personalized property matching',
                    'Negotiation expertise',
                    'End-to-end support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
