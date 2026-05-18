import { useEffect } from 'react'
import Lenis from 'lenis'
import HeroSection from '../../components/home/HeroSection'
import AIExplorer from '../../components/home/AIExplorer'
import FeaturedProperties from '../../components/home/FeaturedProperties'
import LifestyleSection from '../../components/home/LifestyleSection'
import TestimonialsSection from '../../components/home/TestimonialsSection'
import RecentlyViewed from '../../components/property/RecentlyViewed'
import { useRecentlyViewed } from '../../hooks/useRecentlyViewed'

export default function HomePage() {
  const { recentlyViewed, clearAll } = useRecentlyViewed()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [])

  return (
    <div className="relative">
      <HeroSection />
      <AIExplorer />
      <FeaturedProperties />
      <RecentlyViewed items={recentlyViewed} onClear={clearAll} />
      <LifestyleSection />
      <TestimonialsSection />

      {/* Bottom gradient fade */}
      <div className="h-32 bg-gradient-to-b from-transparent to-background relative -mt-32 pointer-events-none" />
    </div>
  )
}
