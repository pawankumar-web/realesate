import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

export default function LifestyleSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5])

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      <motion.div style={{ scale, opacity }} className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />

          <div className="relative z-10 px-6 sm:px-12 lg:px-20 py-16 sm:py-24 text-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.2em] text-primary font-medium"
            >
              Beyond Just a Home
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold mt-6 leading-tight"
            >
              It&apos;s Not Just About
              <br />
              <span className="text-gradient">Finding a Property</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto"
            >
              It&apos;s about discovering a space that resonates with your lifestyle,
              ambitions, and the future you envision for yourself and your loved ones.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <Link to="/properties">
                <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 px-8 py-6 text-base shadow-lg shadow-primary/25">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Explore Lifestyle Properties
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
