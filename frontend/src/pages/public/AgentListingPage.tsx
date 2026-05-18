import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, Phone, Mail, Users, Search, ChevronRight, Star, Shield, BadgeCheck, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { publicService } from '../../services/publicService'
import type { AgentUser } from '../../services/publicService'
import { mockAgents } from '../../data/mockData'

export default function AgentListingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [agents, setAgents] = useState<AgentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const fallbackTimer = setTimeout(() => {
      if (!cancelled && loading) {
        setAgents(mockAgents)
        setLoading(false)
      }
    }, 1500)
    publicService.getAgents()
      .then((res) => {
        if (!cancelled && res.data) setAgents(Array.isArray(res.data) ? res.data : [])
      })
      .catch(() => {
        if (!cancelled) setAgents(mockAgents)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true; clearTimeout(fallbackTimer) }
  }, [])

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (agent.vendor?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Our Team</span>
            <h1 className="text-4xl sm:text-6xl font-bold mt-3 text-gradient-light">
              Meet Our
              <br />
              <span className="text-gradient">Expert Agents</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Professional real estate agents dedicated to finding your perfect property
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-20 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents by name, company, or email..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-foreground/5 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No agents found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredAgents.map((agent) => (
              <motion.div key={agent.id} variants={itemVariants}>
                <Link to={`/agents/${agent.id}`} className="block group">
                  <div className="glass-card rounded-2xl p-6 text-center hover:glow transition-all duration-500 h-full">
                    {/* Avatar */}
                    <div className="relative w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary to-accent p-[2px]">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <span className="text-2xl font-bold text-gradient">
                          {agent.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      {agent.vendor?.is_verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-card">
                          <BadgeCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {agent.vendor?.company_name || 'Independent Agent'}
                    </p>

                    <div className="flex items-center justify-center gap-1.5 mt-2">
                      {agent.vendor?.is_verified ? (
                        <span className="text-xs flex items-center gap-1 text-emerald-400">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Unverified</span>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-muted-foreground">{agent.property_count ?? 0} Properties</span>
                    </div>

                    <div className="space-y-1.5 mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                        <Phone className="w-3 h-3" />
                        {agent.phone || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 truncate">
                        <Mail className="w-3 h-3" />
                        {agent.email}
                      </p>
                    </div>

                    <Button variant="ghost" className="mt-4 w-full rounded-xl text-sm group/btn">
                      View Profile
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
