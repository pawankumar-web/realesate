import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, Building2, Search, Compass, FileText, HelpCircle, Info,
  Users, BarChart3, CreditCard, TrendingUp, Sparkles, ChevronRight,
} from 'lucide-react'

interface MenuItem {
  label: string
  href: string
  icon?: typeof Home
  description?: string
}

interface MenuGroup {
  label: string
  icon: typeof Home
  items: MenuItem[]
}

interface Props {
  transparent?: boolean
}

const menuGroups: MenuGroup[] = [
  {
    label: 'Properties',
    icon: Building2,
    items: [
      { label: 'For Sale', href: '/properties?purpose=buy', icon: TrendingUp, description: 'Browse homes for purchase' },
      { label: 'For Rent', href: '/properties?purpose=rent', icon: Search, description: 'Find rental properties' },
      { label: 'Commercial', href: '/properties?purpose=commercial', icon: Building2, description: 'Office & retail spaces' },
      { label: 'PG / Hostel', href: '/properties?purpose=pg', icon: Home, description: 'Budget shared living' },
      { label: 'Premium Picks', href: '/properties?filter=Premium', icon: Sparkles, description: 'Curated luxury listings' },
      { label: 'New Launches', href: '/properties?filter=New Launch', icon: Compass, description: 'Upcoming projects' },
    ],
  },
  {
    label: 'Explore',
    icon: Compass,
    items: [
      { label: 'Our Agents', href: '/agents', icon: Users, description: 'Meet expert agents' },
      { label: 'Compare', href: '/compare', icon: BarChart3, description: 'Side-by-side comparison' },
      { label: 'Plans & Pricing', href: '/subscription-plans', icon: CreditCard, description: 'Subscription options' },
    ],
  },
  {
    label: 'Resources',
    icon: FileText,
    items: [
      { label: 'Blog', href: '/blog', icon: FileText, description: 'Market insights & guides' },
      { label: 'FAQ', href: '/faq', icon: HelpCircle, description: 'Common questions' },
      { label: 'About Us', href: '/about', icon: Info, description: 'Our story & mission' },
    ],
  },
]

const simpleLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Contact', href: '/contact', icon: HelpCircle },
]

export default function MegaMenu({ transparent = false }: Props) {
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)
  const location = useLocation()
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const textBase = transparent
    ? 'text-foreground/70 hover:text-foreground hover:bg-foreground/10'
    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'

  const textActive = transparent
    ? 'text-foreground bg-foreground/15'
    : 'text-foreground bg-foreground/10'

  const indicatorBg = transparent ? 'bg-foreground/15' : 'bg-foreground/10'

  const handleOpen = (label: string) => {
    if (closing) return
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    setOpenGroup(label)
  }

  const handleClose = () => {
    setClosing(true)
    timeoutRef.current = setTimeout(() => {
      setOpenGroup(null)
      setClosing(false)
    }, 150)
  }

  useEffect(() => {
    setOpenGroup(null)
  }, [location.pathname])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href.split('?')[0])
  }

  return (
    <nav className="hidden md:flex items-center gap-0.5" onMouseLeave={handleClose}>
      {/* Simple links */}
      {simpleLinks.map((link) => {
        const active = isActive(link.href)
        return (
          <Link
            key={link.href}
            to={link.href}
            className={`relative px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
              active ? textActive : textBase
            }`}
          >
            {link.label}
            {active && (
              <motion.div
                layoutId="nav-indicator"
                className={`absolute inset-0 rounded-lg ${indicatorBg}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        )
      })}

      {/* Dropdown groups */}
      {menuGroups.map((group) => {
        const anyActive = group.items.some((item) => isActive(item.href))
        const isOpen = openGroup === group.label
        return (
          <div
            key={group.label}
            className="relative"
            onMouseEnter={() => handleOpen(group.label)}
          >
            <button
              className={`relative px-3 lg:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 inline-flex items-center gap-1.5 ${
                isOpen || anyActive ? textActive : textBase
              }`}
            >
              {group.label}
              <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
              {(isOpen || anyActive) && (
                <motion.div
                  layoutId="nav-indicator"
                  className={`absolute inset-0 rounded-lg ${indicatorBg}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                >
                  <div className="glass-strong rounded-2xl p-2 shadow-2xl border border-border min-w-[280px] overflow-hidden">
                    {group.items.map((item, i) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setOpenGroup(null)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-foreground/5 group/link"
                      >
                        {item.icon && (
                          <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0 group-hover/link:bg-primary/10 transition-colors">
                            <item.icon className="w-4 h-4 text-muted-foreground group-hover/link:text-primary transition-colors" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium group-hover/link:text-primary transition-colors">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground/70 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )
}
