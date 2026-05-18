import { useState, useEffect } from 'react'
import { Phone, Calendar, MessageCircle, X } from 'lucide-react'
import { Button } from '../ui/button'

interface Props {
  price: string
  emi: string
  onCall?: () => void
  onWhatsApp?: () => void
  onVisit?: () => void
}

export default function MobileStickyCTA({ price, emi, onCall, onWhatsApp, onVisit }: Props) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollY / docHeight
      if (scrollPercent > 0.15 && !dismissed) {
        setVisible(true)
      } else if (scrollPercent < 0.05) {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out lg:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="glass-strong border-t border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-bold text-gradient">{price}</span>
            <span className="text-xs text-muted-foreground ml-2">{emi}</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 rounded-xl bg-gradient-to-r from-primary to-accent text-xs h-9" onClick={onCall}>
            <Phone className="w-3.5 h-3.5 mr-1" /> Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs h-9" onClick={onWhatsApp}>
            <MessageCircle className="w-3.5 h-3.5 mr-1" /> WhatsApp
          </Button>
          <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs h-9" onClick={onVisit}>
            <Calendar className="w-3.5 h-3.5 mr-1" /> Visit
          </Button>
        </div>
      </div>
    </div>
  )
}
