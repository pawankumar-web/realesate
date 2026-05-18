import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Sparkles, Brain, Shield, Zap, Globe, InfinityIcon } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI Matchmaking',
    description: 'Our AI analyzes thousands of data points to find your perfect property match with 98% accuracy.',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    icon: Shield,
    title: 'Verified Premium',
    description: 'Every property is verified through our multi-layer authentication system for peace of mind.',
    gradient: 'from-emerald-500/20 to-blue-500/20',
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Real-time market analysis, price predictions, and neighborhood intelligence at your fingertips.',
    gradient: 'from-amber-500/20 to-red-500/20',
  },
  {
    icon: Globe,
    title: 'Virtual Preview',
    description: 'Immersive 3D virtual tours with AI-guided walkthroughs from anywhere in the world.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon:     InfinityIcon,
    title: 'Endless Options',
    description: 'Access to premium properties across 500+ cities with AI-curated recommendations.',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    icon: Sparkles,
    title: 'Smart Alerts',
    description: 'Get notified instantly when a property matching your preferences hits the market.',
    gradient: 'from-rose-500/20 to-amber-500/20',
  },
]

export default function AIExplorer() {
  const ref = useRef<HTMLDivElement>(null)
  useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 section-gradient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Powered by AI</span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-3 text-gradient-light">
            Smarter Way to Find
            <br />
            <span className="text-gradient">Your Dream Home</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience the future of real estate with our AI-powered platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative p-6 rounded-2xl glass-card hover:glow transition-all duration-500 cursor-default"
              whileHover={{ y: -5 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
