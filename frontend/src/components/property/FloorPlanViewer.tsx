import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Layers } from 'lucide-react'

interface FloorPlan {
  label: string
  image: string
  area: string
  price: string
  bhk?: string
}

interface Props {
  plans: FloorPlan[]
}

const defaultPlans: FloorPlan[] = [
  { label: '2 BHK', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', area: '1200 sqft', price: '₹85 L', bhk: '2 BHK' },
  { label: '3 BHK', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', area: '1650 sqft', price: '₹1.2 Cr', bhk: '3 BHK' },
  { label: '4 BHK', image: 'https://images.unsplash.com/photo-1600566753086-00f18f6b5af2?w=800&q=80', area: '2400 sqft', price: '₹1.8 Cr', bhk: '4 BHK' },
]

export default function FloorPlanViewer({ plans = defaultPlans }: Props) {
  const [activePlan, setActivePlan] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const plan = plans[activePlan] || plans[0]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Floor Plans</h2>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Preview */}
        <div className="relative aspect-[4/3] bg-foreground/5 cursor-pointer group" onClick={() => setFullscreen(true)}>
          <img
            src={plan.image}
            alt={plan.label}
            className="w-full h-full object-contain p-4"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border">
          {plans.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePlan(i)}
              className={`flex-1 py-3 text-xs font-medium transition-all relative ${
                i === activePlan ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p.label}
              {i === activePlan && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>

        {/* Info */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-foreground/[0.02]">
          <div className="flex gap-4">
            <span className="text-xs text-muted-foreground">Area: <span className="text-foreground font-medium">{plan.area}</span></span>
            {plan.bhk && <span className="text-xs text-muted-foreground">Type: <span className="text-foreground font-medium">{plan.bhk}</span></span>}
          </div>
          <span className="text-xs font-bold text-gradient">{plan.price}</span>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/90 flex items-center justify-center p-4"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md flex items-center justify-center hover:bg-foreground/20 transition-colors z-10"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex gap-3 overflow-x-auto pb-2 absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[90vw]">
              {plans.map((p, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActivePlan(i) }}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    i === activePlan ? 'bg-primary text-primary-foreground' : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <motion.img
              key={activePlan}
              src={plan.image}
              alt={plan.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
