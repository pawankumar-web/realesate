import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, X, Sparkles, Clock, Users, Eye, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

/* ─── Floating WhatsApp CTA ─── */
export function WhatsAppCTA({ phone = '+919999999999' }: { phone?: string }) {
  const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hi! I'm interested in a property`

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-6 left-6 z-[99] w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 cursor-pointer"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <motion.div
        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[9px] text-white font-bold">1</span>
      </motion.div>
    </motion.a>
  )
}

/* ─── Instant Callback Popup ─── */
export function CallbackPopup({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length >= 10) {
      setSubmitted(true)
      setTimeout(onClose, 2000)
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-strong rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-6">
                <Phone className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">We'll Call You!</h3>
                <p className="text-sm text-muted-foreground">An agent will reach out shortly</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Get a Callback</h3>
                  <button onClick={onClose} className="p-1 rounded-lg hover:bg-foreground/5 text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Leave your number and we'll call you within 2 minutes</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full h-11 px-4 rounded-xl bg-foreground/[0.03] border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-all"
                  >
                    Request Callback
                  </button>
                </form>
                <p className="text-[10px] text-muted-foreground text-center mt-3">Free • No spam • 100% privacy</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Exit Intent Popup ─── */
export function ExitIntentPopup() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 5) setShow(true)
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-strong rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
            onClick={e => e.stopPropagation()}
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Don't Miss Out!</h3>
            <p className="text-muted-foreground mb-6">
              Get early access to exclusive luxury properties before they hit the market.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full h-11 px-4 rounded-xl bg-foreground/[0.03] border border-border text-sm outline-none focus:border-primary/50 transition-colors"
              />
              <button className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-all">
                Get Exclusive Access
              </button>
            </div>
            <button onClick={() => setShow(false)} className="text-xs text-muted-foreground mt-4 hover:text-foreground transition-colors">
              No thanks, I'll browse
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Social Proof Bar ─── */
export function SocialProofBar({ peopleViewing = 12, recentlySold = '3 this week' }: { peopleViewing?: number; recentlySold?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 text-xs text-muted-foreground"
    >
      <span className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium text-foreground">{peopleViewing}</span> people viewing now
      </span>
      <span className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-primary" />
        <span className="font-medium text-foreground">{recentlySold}</span> sold
      </span>
    </motion.div>
  )
}

/* ─── Urgency Banner ─── */
export function UrgencyBanner({ text = '🔥 5 people booked a visit today' }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 text-xs text-amber-400">
        <Clock className="w-3.5 h-3.5" />
        {text}
      </div>
    </motion.div>
  )
}
