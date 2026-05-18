import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, MessageCircle, MapPin, ChevronUp, X, Bed, Bath, Square, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ReelProperty {
  id: number
  slug: string
  title: string
  price: number
  location: string
  beds: number
  baths: number
  sqft: number
  image: string
  tag?: string
}

interface PropertyReelsProps {
  properties: ReelProperty[]
  onClose?: () => void
}

function SwipeIndicator() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full bg-white/60"
          initial={{ width: 24 }}
          animate={{ width: i === 1 ? 40 : 24 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

function ReelCard({ property, onSwipeUp, onClose }: {
  property: ReelProperty
  onSwipeUp: () => void
  onClose: () => void
}) {
  const [liked, setLiked] = useState(false)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(timer); return 100 }
        return p + 1.67
      })
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY
    const diff = touchStartY.current - touchEndY.current
    if (diff > 80) onSwipeUp()
  }

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < -50) onSwipeUp()
  }, [onSwipeUp])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full w-full flex-shrink-0 snap-start"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Progress bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
        <div className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Like/Save animation layer */}
      <div
        onDoubleClick={() => setLiked(true)}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <AnimatePresence>
          {liked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [1, 0.8, 0] }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <Heart className="w-24 h-24 fill-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background image */}
      <img
        src={property.image}
        alt={property.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Bottom content */}
      <div className="absolute bottom-6 left-5 right-16 z-10">
        <Link to={`/properties/${property.slug}`} className="block">
          <h3 className="text-xl font-bold text-white mb-1">{property.title}</h3>
        </Link>
        <p className="text-lg font-bold text-primary">${property.price.toLocaleString()}</p>
        <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5" />
          {property.location}
        </p>
        <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
          <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.beds}</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.baths}</span>
          <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" />{property.sqft} sqft</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-8 right-4 z-10 flex flex-col items-center gap-5">
        <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1 group">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </div>
          <span className="text-[10px] text-white/60">Like</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">Share</span>
        </button>
        <a
          href={`https://wa.me/?text=Check out ${property.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">WhatsApp</span>
        </a>
        <button className="flex flex-col items-center gap-1 group">
          <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center group-hover:bg-black/60 transition-colors">
            <Maximize2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white/60">Full</span>
        </button>
      </div>

      {/* Swipe up hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronUp className="w-5 h-5 text-white/40" />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function PropertyReels({ properties, onClose }: PropertyReelsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSwipeUp = useCallback(() => {
    setCurrentIndex(i => Math.min(i + 1, properties.length - 1))
  }, [properties.length])

  if (properties.length === 0) return null

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <div
        ref={containerRef}
        className="h-full w-full max-w-md mx-auto relative overflow-hidden snap-y snap-mandatory"
      >
        <AnimatePresence mode="wait">
          <ReelCard
            key={currentIndex}
            property={properties[currentIndex]}
            onSwipeUp={handleSwipeUp}
            onClose={onClose || (() => {})}
          />
        </AnimatePresence>

        {/* Counter */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-xs text-white/40">
          {currentIndex + 1} / {properties.length}
        </div>
      </div>
    </div>
  )
}
