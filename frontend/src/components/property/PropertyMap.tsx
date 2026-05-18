import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, ExternalLink, Maximize2 } from 'lucide-react'
import { Button } from '../ui/button'

interface Props {
  lat: number | null
  lng: number | null
  title: string
  city: string
}

export default function PropertyMap({ lat, lng, title, city }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (!lat || !lng) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl glass-card text-center">
        <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Map location not available for this property</p>
      </motion.div>
    )
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=libosrm_car&route=${lat}%2C${lng}`

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Location</h2>
        </div>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          <ExternalLink className="w-3 h-3" /> Directions
        </a>
      </div>

      <div className={`relative rounded-2xl overflow-hidden glass-card transition-all duration-500 ${expanded ? 'h-[500px]' : 'h-[300px]'}`}>
        <iframe
          src={mapUrl}
          title={`${title} location map`}
          className="w-full h-full border-0"
          loading="lazy"
          sandbox="allow-scripts"
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md">
          <span className="text-xs text-white">{city}</span>
        </div>
      </div>
    </motion.div>
  )
}
