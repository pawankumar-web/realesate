import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Wind, Train, School, Coffee, Hospital, AlertTriangle, Droplets, Volume2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

interface Insight {
  label: string
  value: string
  icon: typeof MapPin
  status: 'good' | 'moderate' | 'poor'
}

interface LocalityInsightsProps {
  city?: string
  compact?: boolean
}

const defaultInsights: Insight[] = [
  { label: 'Air Quality', value: 'AQI 42 — Good', icon: Wind, status: 'good' },
  { label: 'Metro Access', value: '850m — 3 min walk', icon: Train, status: 'good' },
  { label: 'Nearby Schools', value: '6 schools within 2km', icon: School, status: 'good' },
  { label: 'Cafes & Dining', value: '12 within 1km', icon: Coffee, status: 'good' },
  { label: 'Hospitals', value: '3 within 3km', icon: Hospital, status: 'good' },
  { label: 'Water Availability', value: '24/7 Supply', icon: Droplets, status: 'good' },
  { label: 'Noise Level', value: '45 dB — Quiet', icon: Volume2, status: 'good' },
  { label: 'Traffic', value: 'Moderate during peak', icon: AlertTriangle, status: 'moderate' },
]

const statusColors = {
  good: 'text-emerald-400',
  moderate: 'text-amber-400',
  poor: 'text-red-400',
}

const statusBg = {
  good: 'bg-emerald-500/10 border-emerald-500/20',
  moderate: 'bg-amber-500/10 border-amber-500/20',
  poor: 'bg-red-500/10 border-red-500/20',
}

export default function LocalityInsights({ city = 'This area', compact = false }: LocalityInsightsProps) {
  const [expanded, setExpanded] = useState(false)
  const displayInsights = compact && !expanded ? defaultInsights.slice(0, 4) : defaultInsights

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Locality Insights</h3>
        <span className="text-[10px] text-muted-foreground ml-auto">{city}</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {displayInsights.map((insight, i) => (
          <motion.div
            key={insight.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${statusBg[insight.status]}`}
          >
            <insight.icon className={`w-4 h-4 shrink-0 ${statusColors[insight.status]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{insight.label}</p>
              <p className="text-sm font-medium">{insight.value}</p>
            </div>
            <span className={`text-[10px] font-medium ${statusColors[insight.status]}`}>
              {insight.status === 'good' ? '✓' : insight.status === 'moderate' ? '~' : '!'}
            </span>
          </motion.div>
        ))}
      </div>

      {compact && defaultInsights.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 w-full mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>Show less <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Show all {defaultInsights.length} insights <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}

      <div className="mt-3 pt-3 border-t border-white/5">
        <a
          href={`https://www.google.com/maps/search/?q=${encodeURIComponent(city)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Explore on Google Maps
        </a>
      </div>
    </motion.div>
  )
}
