import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Award, Globe, TrendingUp, Shield, Sparkles, Check, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/button'

const stats = [
  { label: 'Properties Listed', value: 10000, suffix: '+', icon: Building2 },
  { label: 'Happy Customers', value: 50000, suffix: '+', icon: Users },
  { label: 'Trusted Agents', value: 1000, suffix: '+', icon: Award },
  { label: 'Cities Covered', value: 50, suffix: '+', icon: Globe },
]

const team = [
  { name: 'Alexandra Sterling', role: 'CEO & Founder', initials: 'AS', bio: 'Visionary leader with 20+ years in real estate technology' },
  { name: 'Marcus Rivera', role: 'Chief Technology Officer', initials: 'MR', bio: 'Former Google engineer leading our AI-powered platform' },
  { name: 'Priya Sharma', role: 'Head of Operations', initials: 'PS', bio: 'Operations expert ensuring seamless property transactions' },
  { name: 'James Anderson', role: 'VP of Sales', initials: 'JA', bio: 'Top-performing sales leader with a passion for client success' },
]

const milestones = [
  { year: '2019', title: 'Company Founded', description: 'RealEstate launched with a vision to transform property discovery' },
  { year: '2020', title: 'AI Discovery Engine', description: 'Launched our AI-powered property matching system' },
  { year: '2021', title: '10,000 Properties', description: 'Crossed 10,000 property listings on our platform' },
  { year: '2022', title: 'National Expansion', description: 'Expanded operations to 50+ cities across the country' },
  { year: '2023', title: '50K Happy Customers', description: 'Reached the milestone of 50,000 satisfied customers' },
  { year: '2024', title: 'Premium Launch', description: 'Introduced premium concierge services for luxury clients' },
  { year: '2025', title: 'Global Reach', description: 'Expanded internationally with partnerships in 15 countries' },
  { year: '2026', title: 'AI-Powered Future', description: 'Next-gen AI features revolutionizing how people buy and sell property' },
]

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return <>{count.toLocaleString()}{suffix}</>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Our Story</span>
            <h1 className="text-4xl sm:text-6xl font-bold mt-3 text-gradient-light">
              About
              <br />
              <span className="text-gradient">RealEstate</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
              We are on a mission to make property discovery smart, transparent, and delightful using cutting-edge AI technology.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-6 text-center hover:glow transition-all duration-500">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
              <p className="text-3xl sm:text-4xl font-bold text-gradient">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Our Vision</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gradient-light">
              Transforming Real Estate
              <br />
              <span className="text-gradient">Through Innovation</span>
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Founded in 2019, RealEstate started with a simple idea: use artificial intelligence to make property
              discovery as intuitive and personalized as possible. What began as a small startup has grown into a
              leading real estate platform serving thousands of customers across the country.
            </p>
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Our AI-powered platform analyzes millions of data points to match buyers with their perfect properties,
              predict market trends, and provide insights that help our users make informed decisions.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              {['AI-Powered Matching', '100% Transparent', 'Premium Support'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass-card rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 glass-strong rounded-2xl p-4 hidden sm:block">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-semibold">AI-Driven</div>
                  <div className="text-xs text-muted-foreground">Smart matching engine</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">What We Stand For</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gradient-light">Our Core Values</h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { icon: Shield, title: 'Trust & Transparency', desc: 'Every transaction is backed by our commitment to honesty and clear communication.' },
            { icon: TrendingUp, title: 'Innovation First', desc: 'We leverage cutting-edge AI to provide insights that traditional platforms cannot match.' },
            { icon: Users, title: 'Customer Centric', desc: 'Your satisfaction is our success. We put our customers at the heart of everything we do.' },
          ].map((value) => (
            <motion.div key={value.title} variants={itemVariants} className="glass-card rounded-2xl p-6 text-center hover:glow transition-all duration-500">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-lg">{value.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Timeline / Milestones */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-30" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gradient-light">Milestones</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent hidden sm:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-0 sm:pl-20"
                >
                  <div className="hidden sm:flex absolute left-4 top-1 w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent items-center justify-center text-xs font-bold text-white -translate-x-1/2">
                    {m.year.slice(2)}
                  </div>
                  <div className="glass-card rounded-2xl p-5 hover:glow transition-all duration-500">
                    <span className="text-xs font-medium text-primary">{m.year}</span>
                    <h3 className="font-semibold mt-1">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Leadership</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 text-gradient-light">Meet Our Team</h2>
          <p className="text-muted-foreground mt-2">The brilliant minds behind RealEstate</p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {team.map((member) => (
            <motion.div key={member.name} variants={itemVariants} className="glass-card rounded-2xl p-6 text-center hover:glow transition-all duration-500">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">{member.initials}</span>
              </div>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-sm text-primary mt-0.5">{member.role}</p>
              <p className="text-xs text-muted-foreground mt-2">{member.bio}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 hero-gradient opacity-20" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient-light">
              Ready to Find Your
              <br />
              <span className="text-gradient">Dream Property?</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              Join thousands of satisfied customers and let our AI-powered platform find your perfect match.
            </p>
            <Button className="mt-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 px-8 py-6 text-base">
              Get Started <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
