import { motion } from 'framer-motion'
import { Shield, BadgeCheck, Video, Zap, FileText, Star } from 'lucide-react'

interface TrustBadge {
  label: string
  icon: typeof Shield
  color: string
  active?: boolean
}

interface TrustBadgesProps {
  badges?: TrustBadge[]
  compact?: boolean
  fraudScore?: number
  isVerified?: boolean
}

const defaultBadges: TrustBadge[] = [
  { label: 'Verified Owner', icon: BadgeCheck, color: 'text-emerald-400', active: true },
  { label: 'Video Verified', icon: Video, color: 'text-blue-400', active: true },
  { label: 'Documents Verified', icon: FileText, color: 'text-purple-400', active: true },
  { label: 'Fast Responder', icon: Zap, color: 'text-amber-400', active: true },
  { label: 'Premium Listing', icon: Star, color: 'text-rose-400', active: false },
]

export default function TrustBadges({ badges = defaultBadges, compact = false, fraudScore = 95, isVerified = true }: TrustBadgesProps) {
  const activeBadges = badges.filter(b => b.active)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Trust & Verification</h3>
      </div>

      {/* Fraud risk score */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
        <Shield className="w-6 h-6 text-emerald-400" />
        <div className="flex-1">
          <p className="text-sm font-medium">Fraud Risk Score</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${fraudScore}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400">{fraudScore}%</span>
          </div>
          <p className="text-[10px] text-emerald-400/70 mt-0.5">Low Risk — Verified Property</p>
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
              badge.active
                ? 'bg-foreground/5 border border-border'
                : 'bg-foreground/5 border border-border opacity-40'
            }`}
          >
            <badge.icon className={`w-3.5 h-3.5 shrink-0 ${badge.color}`} />
            <span className={`${badge.active ? 'text-foreground' : 'text-muted-foreground'}`}>
              {badge.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
