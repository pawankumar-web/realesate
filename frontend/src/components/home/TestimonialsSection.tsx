import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Homeowner',
    content: 'The AI matchmaking found me a home that checked every box. The virtual tour was incredibly immersive - I felt like I was walking through the property.',
    rating: 5,
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    name: 'Rahul Verma',
    role: 'Investor',
    content: 'The market intelligence and predictive analytics helped me make informed investment decisions. My portfolio has grown 40% since using EstateAI.',
    rating: 5,
    gradient: 'from-emerald-500/20 to-blue-500/20',
  },
  {
    name: 'Ananya Patel',
    role: 'First-time Buyer',
    content: 'As a first-time buyer, the process was seamless. The AI assistant guided me through every step, from search to closing. Truly revolutionary.',
    rating: 5,
    gradient: 'from-amber-500/20 to-red-500/20',
  },
]

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Testimonials</span>
          <h2 className="text-3xl sm:text-5xl font-bold mt-3 text-gradient-light">
            Loved by Thousands
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group relative p-6 sm:p-8 rounded-2xl glass-card"
              whileHover={{ y: -5 }}
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {t.content}
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-medium text-white`}>
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
