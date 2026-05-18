import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { RootState } from '../../store'
import { Button } from '../ui/button'
import ThemeToggle from '../ui/ThemeToggle'
import MegaMenu from './MegaMenu'
import { Menu, X, Home, User, Shield, Store, UserCircle, Building2, Search, FileText, HelpCircle, Info, TrendingUp, Sparkles, Compass, BarChart3, CreditCard, Users, ChevronRight } from 'lucide-react'

const mobileMenuLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Buy', href: '/properties?purpose=buy', icon: TrendingUp, group: 'Properties' },
  { label: 'Rent', href: '/properties?purpose=rent', icon: Search, group: 'Properties' },
  { label: 'Commercial', href: '/properties?purpose=commercial', icon: Building2, group: 'Properties' },
  { label: 'PG / Hostel', href: '/properties?purpose=pg', icon: Home, group: 'Properties' },
  { label: 'Premium Picks', href: '/properties?filter=Premium', icon: Sparkles, group: 'Properties' },
  { label: 'New Launches', href: '/properties?filter=New Launch', icon: Compass, group: 'Properties' },
  { label: 'Our Agents', href: '/agents', icon: Users, group: 'Explore' },
  { label: 'Compare', href: '/compare', icon: BarChart3, group: 'Explore' },
  { label: 'Pricing', href: '/subscription-plans', icon: CreditCard, group: 'Explore' },
  { label: 'Blog', href: '/blog', icon: FileText, group: 'Resources' },
  { label: 'FAQ', href: '/faq', icon: HelpCircle, group: 'Resources' },
  { label: 'About Us', href: '/about', icon: Info, group: 'Resources' },
  { label: 'Contact', href: '/contact', icon: HelpCircle },
]

export default function Navbar() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        transparent
          ? 'bg-transparent'
          : 'glass-strong'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="EstateAI" className="h-8 w-auto" />
          </Link>

          <MegaMenu transparent={transparent} />

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/dashboard'}>
                <Button
                  variant={transparent ? 'secondary' : 'default'}
                  className="rounded-xl bg-foreground/10 backdrop-blur-md border border-border text-foreground hover:bg-foreground/20"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login?role=user">
                  <Button variant="ghost" className="rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                    <UserCircle className="w-4 h-4" />
                    User
                  </Button>
                </Link>
                <Link to="/login?role=vendor">
                  <Button variant="ghost" className="rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                    <Store className="w-4 h-4" />
                    Vendor
                  </Button>
                </Link>
                <Link to="/login?role=admin">
                  <Button variant="ghost" className="rounded-xl text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
                <div className="w-px h-5 bg-border mx-1" />
                <Link to="/register">
                  <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-lg shadow-primary/25 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border"
          >
            <div className="px-4 py-4 space-y-1">
              {/* Group headers */}
              {['Properties', 'Explore', 'Resources'].map((group) => (
                <div key={group}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/50 px-3 pt-3 pb-1">{group}</p>
                  {mobileMenuLinks
                    .filter((l) => 'group' in l && l.group === group)
                    .map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                      >
                        <link.icon className="w-4 h-4 text-primary/60" />
                        {link.label}
                      </Link>
                    ))}
                </div>
              ))}
              {/* Simple links */}
              {mobileMenuLinks
                .filter((l) => !('group' in l))
                .map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <link.icon className="w-4 h-4 text-primary/60" />
                    {link.label}
                  </Link>
                ))}
              <div className="flex items-center justify-between pt-2 px-1">
                <ThemeToggle />
              </div>
              <div className="space-y-2">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent">Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-1">
                      <Link to="/login?role=user" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl text-xs gap-1.5 h-10">
                          <UserCircle className="w-3.5 h-3.5" />
                          User
                        </Button>
                      </Link>
                      <Link to="/login?role=vendor" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl text-xs gap-1.5 h-10">
                          <Store className="w-3.5 h-3.5" />
                          Vendor
                        </Button>
                      </Link>
                      <Link to="/login?role=admin" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full rounded-xl text-xs gap-1.5 h-10">
                          <Shield className="w-3.5 h-3.5" />
                          Admin
                        </Button>
                      </Link>
                    </div>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-xl bg-gradient-to-r from-primary to-accent">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
