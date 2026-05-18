import { motion } from 'framer-motion'
import { ShieldCheck, Calendar, Building2 } from 'lucide-react'

interface Props {
  reraNumber?: string | null
  possessionDate?: string | null
  builderName?: string | null
  propertyAge?: number | null
}

export default function RERABadge({ reraNumber, possessionDate, builderName, propertyAge }: Props) {
  const hasData = reraNumber || possessionDate || builderName

  if (!hasData) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm font-medium">RERA Registered</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">This property is registered with RERA for buyer protection</p>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
      {reraNumber && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-400">RERA Registered</p>
            <p className="text-[10px] text-muted-foreground truncate">{reraNumber}</p>
          </div>
        </div>
      )}
      {possessionDate && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-blue-400">Possession</p>
            <p className="text-[10px] text-muted-foreground">{possessionDate}</p>
          </div>
        </div>
      )}
      {builderName && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-purple-400">Builder</p>
            <p className="text-[10px] text-muted-foreground">{builderName}</p>
          </div>
        </div>
      )}
      {propertyAge !== null && propertyAge !== undefined && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-amber-400">Property Age</p>
            <p className="text-[10px] text-muted-foreground">{propertyAge === 0 ? 'New Construction' : `${propertyAge} years`}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}
