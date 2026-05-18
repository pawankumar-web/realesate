import { motion } from 'framer-motion'
import { Sparkles, Brain, Heart, TrendingUp, Shield, MapPin } from 'lucide-react'

interface Score {
  label: string
  value: number
  icon: typeof Sparkles
  color: string
}

interface AIMatchScoreProps {
  scores?: Score[]
  overall?: number
  compact?: boolean
}

const defaultScores: Score[] = [
  { label: 'Match', value: 94, icon: Sparkles, color: 'from-blue-500 to-purple-500' },
  { label: 'Lifestyle', value: 88, icon: Heart, color: 'from-pink-500 to-rose-500' },
  { label: 'Investment', value: 82, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
  { label: 'Location', value: 91, icon: MapPin, color: 'from-amber-500 to-orange-500' },
  { label: 'Safety', value: 85, icon: Shield, color: 'from-cyan-500 to-blue-500' },
]

function CircularScore({ value, label, size = 'md' }: { value: number; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const radius = size === 'sm' ? 28 : size === 'md' ? 36 : 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const strokeWidth = size === 'sm' ? 4 : 6

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: radius * 2 + 8, height: radius * 2 + 8 }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${radius * 2 + 8} ${radius * 2 + 8}`}>
          <circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            fill="none"
            stroke="oklch(1 0 0 / 0.08)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={radius + 4}
            cy={radius + 4}
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.65 0.15 260)" />
              <stop offset="100%" stopColor="oklch(0.55 0.18 280)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-bold ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'} text-gradient`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {value}%
          </motion.span>
        </div>
      </div>
      <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-muted-foreground font-medium`}>
        {label}
      </span>
    </div>
  )
}

export default function AIMatchScore({ scores = defaultScores, overall = 94, compact = false }: AIMatchScoreProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-primary/20"
      >
        <Brain className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-medium text-gradient">{overall}% Match</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">AI Match Score</h3>
        <span className="ml-auto text-xs text-muted-foreground">Powered by AI</span>
      </div>
      <div className="flex items-center justify-around">
        {scores.map((score) => (
          <CircularScore key={score.label} value={score.value} label={score.label} size="sm" />
        ))}
      </div>
    </motion.div>
  )
}

export { CircularScore }
export type { Score }
