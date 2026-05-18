import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { 
  MapPin, Bed, Bath, Square, Share2, Heart, ChevronLeft, ChevronRight,
  Maximize2, Building2, Shield, TrendingUp, Calendar,
  Phone, Mail, MessageCircle, Sparkles, Check, ArrowLeft, AlertCircle, Home, ChevronRight as ChevronRightSmall
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { propertyService } from '../../services/propertyService'
import type { Property } from '../../types'
import { mockProperties } from '../../data/mockData'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'
import AIMatchScore from '../../components/property/AIMatchScore'
import EmotionalStory from '../../components/property/EmotionalStory'
import LocalityInsights from '../../components/insights/LocalityInsights'
import TrustBadges from '../../components/property/TrustBadges'
import RecentlyViewed from '../../components/property/RecentlyViewed'
import PropertyMap from '../../components/property/PropertyMap'
import FloorPlanViewer from '../../components/property/FloorPlanViewer'
import RERABadge from '../../components/property/RERABadge'
import MobileStickyCTA from '../../components/property/MobileStickyCTA'
import { parsePropertyMeta } from '../../utils/propertyMeta'
import { WhatsAppCTA, CallbackPopup, ExitIntentPopup, SocialProofBar, UrgencyBanner } from '../../components/conversion/ConversionOptimizer'

const formatPrice = (price: number) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
  if (price >= 1000) return `₹${(price / 1000).toFixed(0)} K`
  return `₹${price.toLocaleString('en-IN')}`
}

const calculateEMI = (price: number) => {
  const principal = price * 0.8
  const rate = 8.5 / 12 / 100
  const months = 240
  const emi = principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1)
  return `₹${Math.round(emi).toLocaleString('en-IN')}/mo`
}

const placeholderImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18f6b5af2?w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472556-e636ea9f07e6?w=1200&q=80',
]

function DetailSkeleton() {
  return (
    <div className="min-h-screen pt-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4"><div className="h-4 bg-foreground/5 rounded w-32" /></div>
      <section className="relative px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass-card">
          <div className="aspect-[21/9] max-h-[70vh] bg-foreground/5" />
          <div className="flex gap-2 p-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="shrink-0 w-16 h-12 rounded-xl bg-foreground/5" />))}</div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <div className="h-8 bg-foreground/5 rounded w-3/4" />
              <div className="h-4 bg-foreground/5 rounded w-1/2" />
              <div className="flex gap-6 mt-6 p-4 rounded-2xl glass-card">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="flex items-center gap-2"><div className="w-5 h-5 bg-foreground/5 rounded" /><div><div className="h-4 bg-foreground/5 rounded w-12 mb-1" /><div className="h-3 bg-foreground/5 rounded w-16" /></div></div>))}</div>
              <div className="h-4 bg-foreground/5 rounded w-full mt-6" />
              <div className="h-4 bg-foreground/5 rounded w-5/6" />
            </div>
          </div>
          <div className="lg:col-span-1"><div className="p-6 rounded-2xl glass-card space-y-4"><div className="h-5 bg-foreground/5 rounded w-3/4" /><div className="h-10 bg-foreground/5 rounded" /><div className="h-10 bg-foreground/5 rounded" /><div className="h-10 bg-foreground/5 rounded" /></div></div>
        </div>
      </div>
    </div>
  )
}

export default function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [currentImage, setCurrentImage] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCallback, setShowCallback] = useState(false)
  const { recentlyViewed, addProperty } = useRecentlyViewed()
  const addedRef = useRef(false)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    const fallbackTimer = setTimeout(() => {
      if (!cancelled && loading) {
        const mock = mockProperties.find((p) => p.slug === slug)
        if (mock) { setProperty(mock); setLoading(false) }
      }
    }, 1500)
    propertyService.getBySlug(slug)
      .then((res) => { if (!cancelled) { setProperty(res.data); setLoading(false) } })
      .catch((err: unknown) => {
        if (!cancelled) {
          const mock = mockProperties.find((p) => p.slug === slug)
          if (mock) { setProperty(mock); setLoading(false) } else {
            setError(err instanceof Error ? err.message : 'Failed to load property details')
            setLoading(false)
          }
        }
      })
    return () => { cancelled = true; clearTimeout(fallbackTimer) }
  }, [slug])

  useEffect(() => {
    if (property && !addedRef.current) {
      addedRef.current = true
      const primaryImage = property.images?.[0]?.image_path || ''
      addProperty({
        id: property.id,
        slug: property.slug,
        title: property.title,
        price: property.price,
        city: property.city,
        image: primaryImage,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_sqft: property.area_sqft,
        viewedAt: Date.now(),
      })
      document.title = `${property.title} - ${property.city} | RealEstate`
    }
  }, [property, addProperty])

  useEffect(() => {
    const timer = setTimeout(() => setShowCallback(true), 30000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <DetailSkeleton />

  if (error || !property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto"><AlertCircle className="w-8 h-8 text-red-400" /></div>
          <h2 className="text-xl font-semibold mb-2">Property not found</h2>
          <p className="text-muted-foreground text-sm mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <Link to="/properties"><Button className="rounded-xl"><ArrowLeft className="w-4 h-4 mr-2" />Back to Properties</Button></Link>
        </div>
      </div>
    )
  }

  const images = property.images.length > 0 ? property.images.map((img) => img.image_path) : placeholderImages
  const amenities = property.amenities.map((a) => a.name)
  const priceFormatted = formatPrice(property.price)
  const emiFormatted = calculateEMI(property.price)
  const propertyMeta = parsePropertyMeta((property as any).meta_description)
  const floorPlans = [
    { label: '2 BHK', image: images[0] || placeholderImages[0], area: `${Math.round(property.area_sqft * 0.65)} sqft`, price: formatPrice(property.price * 0.75), bhk: '2 BHK' },
    { label: '3 BHK', image: images[1] || placeholderImages[1], area: `${Math.round(property.area_sqft * 0.85)} sqft`, price: priceFormatted, bhk: '3 BHK' },
    { label: '4 BHK', image: images[2] || placeholderImages[2], area: `${property.area_sqft} sqft`, price: formatPrice(property.price * 1.15), bhk: '4 BHK' },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Conversion components */}
      <WhatsAppCTA />
      <CallbackPopup show={showCallback} onClose={() => setShowCallback(false)} />
      <ExitIntentPopup />

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1"><Home className="w-3 h-3" /> Home</Link></li>
          <li><ChevronRightSmall className="w-3 h-3" /></li>
          <li><Link to="/properties" className="hover:text-foreground transition-colors">Properties</Link></li>
          <li><ChevronRightSmall className="w-3 h-3" /></li>
          <li><Link to={`/properties?city=${property.city}`} className="hover:text-foreground transition-colors">{property.city}</Link></li>
          <li><ChevronRightSmall className="w-3 h-3" /></li>
          <li className="text-foreground truncate max-w-[200px]">{property.title}</li>
        </ol>
      </nav>

      {/* Back navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
        <SocialProofBar />
      </div>

      {/* Urgency */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <UrgencyBanner text="🔥 5 people booked a visit to this property today" />
      </div>

      {/* Cinematic Image Gallery */}
      <section className="relative px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden glass-card">
          <div className="aspect-[21/9] max-h-[70vh] relative">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt={property.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setCurrentImage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImage ? 'w-6 bg-primary' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>

            <button onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors">
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"><Heart className="w-5 h-5 text-white" /></button>
              <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"><Share2 className="w-5 h-5 text-white" /></button>
              <button onClick={() => setGalleryOpen(!galleryOpen)} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"><Maximize2 className="w-5 h-5 text-white" /></button>
            </div>

            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white">
                {property.is_featured ? 'Premium Listing' : property.purpose === 'rent' ? 'Rental' : 'For Sale'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 p-3 overflow-x-auto">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrentImage(i)}
                className={`shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === currentImage ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Floor Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <FloorPlanViewer plans={floorPlans} />
      </section>

      {/* Property Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gradient-light">{property.title}</h1>
                  <p className="text-muted-foreground mt-2 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.address}, {property.city}, {property.state}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gradient">{priceFormatted}</div>
                  <p className="text-xs text-muted-foreground mt-1">{emiFormatted} EMI</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-6 p-4 rounded-2xl glass-card">
                <div className="flex items-center gap-2"><Bed className="w-5 h-5 text-primary" /><div><div className="text-sm font-semibold">{property.bedrooms}</div><div className="text-xs text-muted-foreground">Bedrooms</div></div></div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-primary" /><div><div className="text-sm font-semibold">{property.bathrooms}</div><div className="text-xs text-muted-foreground">Bathrooms</div></div></div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2"><Square className="w-5 h-5 text-primary" /><div><div className="text-sm font-semibold">{property.area_sqft}</div><div className="text-xs text-muted-foreground">sq ft</div></div></div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /><div><div className="text-sm font-semibold">{property.property_age ? `${property.property_age} yrs` : 'New'}</div><div className="text-xs text-muted-foreground">Property Age</div></div></div>
              </div>
            </motion.div>

            {/* Emotional Story */}
            <EmotionalStory price={property.price} propertyType={property.property_type} city={property.city} bhk={property.bhk ?? undefined} />

            {/* AI Match Score */}
            <AIMatchScore />

            {/* Description */}
            {property.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-xl font-semibold mb-3">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </motion.div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-xl font-semibold mb-4">Premium Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 p-3 rounded-xl glass-card">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Investment Prediction */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">AI Investment Prediction</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Price Trend', value: '+12% YoY', color: 'text-emerald-400', desc: 'Strong appreciation' },
                  { label: 'Rental Yield', value: '4.2%', color: 'text-blue-400', desc: 'Above market avg' },
                  { label: 'Demand Score', value: '92/100', color: 'text-purple-400', desc: 'High demand area' },
                  { label: 'ROI Prediction', value: '16.8%', color: 'text-amber-400', desc: '5-year projection' },
                ].map((insight) => (
                  <div key={insight.label} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span className={`w-2 h-2 rounded-full ${insight.color.replace('text-', 'bg-')}`} />
                      {insight.label}
                    </div>
                    <div className="text-xl font-bold">{insight.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{insight.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Locality Insights (full width) */}
            <LocalityInsights city={property.city} />

            {/* Location Map */}
            <PropertyMap lat={property.lat} lng={property.lng} title={property.title} city={property.city} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Vendor/Agent Card */}
              {property.user && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl glass-card">
                  <h3 className="font-semibold mb-4">Listed by</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      {property.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{property.user.name}</div>
                      <div className="text-xs text-muted-foreground">{property.user.role === 'vendor' ? 'Property Vendor' : 'Agent'}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent" onClick={() => setShowCallback(true)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Agent
                    </Button>
                    <a href={`https://wa.me/?text=Hi, I'm interested in ${property.title}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full rounded-xl">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>
                    <Button variant="outline" className="w-full rounded-xl">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* RERA + Possession Badges */}
              <RERABadge
                reraNumber={propertyMeta.rera}
                possessionDate={propertyMeta.possession}
                builderName={propertyMeta.builder}
                propertyAge={property.property_age}
              />

              {/* Trust Badges */}
              <TrustBadges isVerified={property.is_verified} />

              {/* EMI Calculator */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl glass-card">
                <h3 className="font-semibold mb-4">EMI Calculator</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Loan Amount (80%)</label>
                    <div className="text-lg font-bold">{formatPrice(property.price * 0.8)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Monthly EMI</label>
                    <div className="text-lg font-bold text-primary">{emiFormatted}</div>
                    <div className="text-[10px] text-muted-foreground">@ 8.5% for 20 years</div>
                  </div>
                </div>
              </motion.div>

              {/* Schedule Visit */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-2xl glass-card">
                <h3 className="font-semibold mb-2">Schedule a Visit</h3>
                <p className="text-xs text-muted-foreground mb-4">Book a virtual or in-person tour</p>
                <Button variant="outline" className="w-full rounded-xl" onClick={() => setShowCallback(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed items={recentlyViewed.filter((rv) => rv.id !== property.id)} />
      </div>

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA
        price={priceFormatted}
        emi={emiFormatted}
        onCall={() => setShowCallback(true)}
        onWhatsApp={() => window.open(`https://wa.me/?text=Hi, I'm interested in ${property.title}`, '_blank')}
        onVisit={() => setShowCallback(true)}
      />
    </div>
  )
}
