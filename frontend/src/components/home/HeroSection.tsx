import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Video, Compass, Brain, Box, Sparkles, Home, Phone, TrendingUp, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AISmartSearch from '../search/AISmartSearch'
import Hero3DScene from './Hero3DScene'

gsap.registerPlugin(ScrollTrigger)

const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=85',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85',
  'https://images.unsplash.com/photo-1600566753086-00f18f6b5af2?w=1920&q=85',
  'https://images.unsplash.com/photo-1600573472556-e636ea9f07e6?w=1920&q=85',
]

const liveActivities = [
  { icon: '🔥', text: 'Someone booked a site visit in Mumbai', time: '2m ago' },
  { icon: '🏠', text: '3BHK sold in Whitefield, Bangalore - ₹1.2Cr', time: '5m ago' },
  { icon: '📱', text: 'New enquiry for Sea View Penthouse', time: '7m ago' },
  { icon: '✨', text: 'AI Match found for Luxury Villa in Gurgaon', time: '12m ago' },
  { icon: '💰', text: 'Loan approved for Premium Apartment, Pune', time: '15m ago' },
  { icon: '🤝', text: 'Deal closed - Studio Cyber City, Gurgaon', time: '22m ago' },
  { icon: '⭐', text: 'Agent Priya Sharma got 5-star review', time: '28m ago' },
  { icon: '📈', text: 'Property values up 12% in Hyderabad', time: '35m ago' },
]

const floatingCards = [
  { label: 'Premium Villa', price: '₹2.8 Cr', location: 'Mumbai, Bandra', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', match: 98, badge: 'Lifestyle Match', delay: 0, top: 28, left: 2 },
  { label: 'Smart Penthouse', price: '₹4.2 Cr', location: 'Bangalore, Whitefield', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', match: 96, badge: 'AI Recommended', delay: 1, top: 22, left: 80 },
  { label: 'Luxury Apartment', price: '₹1.5 Cr', location: 'Gurgaon, Cyber City', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80', match: 94, badge: 'Hot Deal', delay: 2, top: 55, left: 85 },
]

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.2 + 0.05,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.a})`
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] pointer-events-none" />
}

function MagneticButton({ children, href, className = '' }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' })
  }, [])

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' })
  }, [])

  return (
    <Link to={href} ref={ref} onMouseMove={handleMouse} onMouseLeave={handleLeave} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${className}`}>
      {children}
    </Link>
  )
}

function LiveActivityBar() {
  const doubled = [...liveActivities, ...liveActivities]

  return (
    <div className="relative w-full overflow-hidden bg-background/40 backdrop-blur-md border-b border-border/30">
      <div className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider shrink-0 bg-background/60 absolute left-0 top-0 bottom-0 z-10 pr-4" style={{ maskImage: 'linear-gradient(to right, black 60%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 60%, transparent)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        LIVE
      </div>
      <motion.div
        className="flex items-center gap-8 pl-16 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-foreground/70">
            <span>{item.icon}</span>
            <span>{item.text}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-muted-foreground/50 text-[10px]">{item.time}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const [currentImage, setCurrentImage] = useState(0)
  const [show3D, setShow3D] = useState(false)

  // Background image rotation
  useEffect(() => {
    if (show3D) return
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [show3D])

  // GSAP ScrollTrigger + text animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
      if (headlineRef.current) {
        gsap.fromTo(headlineRef.current.querySelectorAll('.word'),
          { y: 60, opacity: 0, rotateX: 30 },
          { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.3 }
        )
      }
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.8, delay: 0.7, ease: 'power3.out' })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[650px] sm:min-h-[750px] overflow-hidden bg-background">
      {/* ===== CINEMATIC BACKGROUND ===== */}
      {show3D ? (
        <Hero3DScene />
      ) : (
        <div ref={bgRef} className="absolute inset-0 will-change-transform">
          <AnimatePresence mode="wait">
            {heroImages.map((img, i) => (
              i === currentImage && (
                <motion.div
                  key={i}
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 pointer-events-none z-[2]" />
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 20%, oklch(0.5 0.18 25 / 0.15), transparent), radial-gradient(ellipse 40% 30% at 80% 60%, oklch(0.55 0.15 45 / 0.08), transparent)' }} />

      {/* Particles */}
      <ParticleCanvas />

      {/* Scanline effect */}
      <div className="absolute inset-0 z-[3] pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />

      {/* ===== FLOATING PROPERTY CARDS ===== */}
      <div className="absolute inset-0 pointer-events-none z-10 hidden xl:block">
        {floatingCards.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30, x: card.left > 50 ? 30 : -30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 1.2 + card.delay * 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute group"
            style={{ top: `${card.top}%`, left: `${card.left}%` }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4 + card.delay, repeat: Infinity, ease: 'easeInOut' }}
              className="w-48 rounded-xl overflow-hidden glass-strong border border-border/50 shadow-xl pointer-events-auto cursor-default"
            >
              <div className="relative h-24 overflow-hidden">
                <img src={card.image} alt={card.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-primary/80 text-primary-foreground backdrop-blur-sm flex items-center gap-1">
                  <Brain className="w-2 h-2" />
                  {card.badge}
                </div>
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold truncate">{card.label}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{card.location}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-[11px] font-bold text-gradient">{card.price}</p>
                    <p className="text-[8px] text-emerald-400">{card.match}% Match</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ===== LIVE ACTIVITY BAR ===== */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <LiveActivityBar />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div ref={contentRef} className="relative z-20 h-full flex flex-col px-4 sm:px-6">
        <div className="flex-1 flex flex-col items-center justify-center -mt-8 sm:-mt-6">
          <div className="max-w-4xl mx-auto text-center w-full">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-strong border border-border/50 mb-4 sm:mb-5"
            >
              <Brain className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] sm:text-xs text-muted-foreground">AI-Powered Intelligence</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span className="w-px h-3 bg-border/50 mx-1" />
              <button
                onClick={() => setShow3D((prev) => !prev)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-all ${
                  show3D ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground/60 hover:text-foreground'
                }`}
              >
                <Box className="w-2.5 h-2.5" />
                {show3D ? '3D On' : '3D'}
              </button>
            </motion.div>

            {/* Headline */}
            <h1 ref={headlineRef} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight mb-3 sm:mb-4">
              <span className="block word text-gradient-light">Find Homes</span>
              <span className="block word text-gradient">Designed For</span>
              <span className="block word text-gradient-light">Your Future</span>
            </h1>

            {/* Subheadline */}
            <p ref={subtitleRef} className="text-sm sm:text-base md:text-lg text-muted-foreground/80 max-w-xl mx-auto mb-5 sm:mb-6 leading-relaxed font-light">
              Discover smarter investments, peaceful living, and future-ready homes powered by AI insights.
            </p>

            {/* AI Search */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="max-w-xl mx-auto"
            >
              <AISmartSearch placeholder='Try "Luxury villa near metro under 2Cr"' />
            </motion.div>

            {/* Quick chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="flex items-center justify-center gap-2 mt-4 flex-wrap"
            >
              {['Buy', 'Rent', 'Commercial', 'PG/Hostel'].map((item) => (
                <Link key={item} to={`/properties?purpose=${item.toLowerCase()}`}
                  className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-muted-foreground/70 hover:text-foreground border border-border/50 hover:border-primary/40 hover:bg-primary/5 transition-all"
                >
                  {item} <ChevronRight className="w-2.5 h-2.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex items-center justify-center gap-2 sm:gap-3 mt-5 sm:mt-6 flex-wrap"
            >
              <MagneticButton href="/properties" className="bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40">
                <Compass className="w-3.5 h-3.5" />
                Explore Properties
              </MagneticButton>
              <MagneticButton href="/properties?filter=Premium" className="glass-strong border border-border/50 text-foreground hover:bg-foreground/5">
                <Brain className="w-3.5 h-3.5 text-primary" />
                AI Picks
              </MagneticButton>
              <MagneticButton href="/contact" className="glass-strong border border-border/50 text-foreground hover:bg-foreground/5">
                <Video className="w-3.5 h-3.5 text-primary" />
                Virtual Tour
              </MagneticButton>
            </motion.div>
          </div>
        </div>

      </div>

      {/* ===== SCROLL INDICATOR ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="flex flex-col items-center gap-0.5">
          <span className="text-[8px] text-muted-foreground/40 uppercase tracking-[0.15em] font-medium">Scroll</span>
          <div className="w-3.5 h-6 rounded-full border border-foreground/20 flex items-start justify-center p-1">
            <motion.div className="w-0.5 h-1 rounded-full bg-foreground/40" animate={{ y: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
