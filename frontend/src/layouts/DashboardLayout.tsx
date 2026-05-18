import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { RootState } from '../store'
import { logout } from '../store/slices/authSlice'
import { 
  LayoutDashboard, Home, Heart, Calendar, Star, Search, 
  User, LogOut, ChevronLeft, Menu, Bell, Settings,
  Building2, TrendingUp, MessageCircle, Briefcase, Shield
} from 'lucide-react'
import { Button } from '../components/ui/button'

interface DashboardLayoutProps {
  role: 'user' | 'vendor' | 'admin'
}

const navConfig = {
  user: {
    links: [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
      { label: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
      { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
      { label: 'Saved Searches', href: '/dashboard/saved-searches', icon: Search },
      { label: 'Profile', href: '/dashboard/profile', icon: User },
    ],
    color: 'from-blue-500 to-purple-500',
  },
  vendor: {
    links: [
      { label: 'Overview', href: '/vendor', icon: LayoutDashboard },
      { label: 'Properties', href: '/vendor/properties', icon: Building2 },
      { label: 'Leads', href: '/vendor/leads', icon: TrendingUp },
      { label: 'Analytics', href: '/vendor/analytics', icon: TrendingUp },
      { label: 'Chat', href: '/vendor/chat', icon: MessageCircle },
      { label: 'KYC', href: '/vendor/kyc', icon: Shield },
      { label: 'Subscriptions', href: '/vendor/subscriptions', icon: Briefcase },
    ],
    color: 'from-emerald-500 to-blue-500',
  },
  admin: {
    links: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Users', href: '/admin/users', icon: User },
      { label: 'Properties', href: '/admin/properties', icon: Building2 },
      { label: 'Blogs', href: '/admin/blogs', icon: Search },
      { label: 'Banners', href: '/admin/banners', icon: Shield },
      { label: 'Reports', href: '/admin/reports', icon: TrendingUp },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    color: 'from-purple-500 to-pink-500',
  },
}

export default function DashboardLayout({ role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const config = navConfig[role]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 72 }}
        className="fixed left-0 top-0 h-full z-50 flex flex-col glass-strong border-r border-border"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-border">
          <Link to="/" className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            {sidebarOpen ? (
              <img src="/logo.png" alt="EstateAI" className="h-7 w-auto" />
            ) : (
              <img src="/logo.png" alt="EstateAI" className="h-7 w-auto" />
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors ${!sidebarOpen && 'hidden'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {config.links.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                className="relative block"
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                  } ${!sidebarOpen && 'justify-center px-0'}`}
                >
                  <link.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                  {sidebarOpen && <span>{link.label}</span>}
                </div>
                {isActive && sidebarOpen && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-primary to-accent"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-18'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-40 glass-strong border-b border-border">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
              </button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="rounded-xl text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
