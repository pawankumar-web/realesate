import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, HelpCircle, MessageCircle, FileText, Shield, CreditCard, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'general', label: 'General', icon: Home },
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'listings', label: 'Listings', icon: FileText },
]

const faqs = [
  { q: 'How do I search for properties?', a: 'Use the search bar on the home page or navigate to the Properties page to use advanced filters. You can filter by location, property type, price range, and more. Our AI-powered search also provides personalized recommendations based on your preferences.', category: 'general' },
  { q: 'How do I contact an agent?', a: 'Each property listing has a "Contact Agent" button. You can also visit the agent\'s profile page to find their phone number, email, or send them a direct message through our platform.', category: 'general' },
  { q: 'Is my personal data secure?', a: 'Absolutely. We use industry-standard 256-bit SSL encryption for all data transmissions. Your personal information is stored securely and never shared with third parties without your explicit consent. We are fully compliant with data protection regulations.', category: 'account' },
  { q: 'How do I create an account?', a: 'Click on the "Sign Up" button in the top navigation bar. You can register using your email address or phone number. Fill in your details, verify your email, and you are ready to start exploring properties.', category: 'account' },
  { q: 'How do I reset my password?', a: 'On the login page, click "Forgot Password". Enter your registered email address, and we will send you a password reset link. For security, the link expires within 60 minutes.', category: 'account' },
  { q: 'How do I list my property?', a: 'Register as a vendor/agent, complete your KYC verification, and you can start listing properties from your dashboard. Each listing requires property details, images, and pricing information. Our team reviews listings within 24 hours.', category: 'listings' },
  { q: 'What are the listing fees?', a: 'Basic listing is free for verified vendors. Premium listings with featured placement and additional marketing exposure start at $29/month. Enterprise plans with unlimited listings are also available.', category: 'listings' },
  { q: 'How long does it take for a listing to go live?', a: 'Standard listings are reviewed and published within 24 hours. Premium and featured listings are prioritized and typically go live within 2-4 hours during business hours.', category: 'listings' },
  { q: 'What payment methods are accepted?', a: 'We accept Razorpay, Stripe, and major credit/debit cards (Visa, MasterCard, American Express) for all payments including subscriptions. All transactions are processed securely through encrypted payment gateways.', category: 'payments' },
  { q: 'Can I get a refund?', a: 'Yes, we offer a 14-day money-back guarantee on all subscription plans. If you are not satisfied, contact our support team for a full refund. Individual listing fees are non-refundable once published.', category: 'payments' },
  { q: 'How do subscription plans work?', a: 'Choose from Monthly, Quarterly, or Annual plans. Annual subscribers get 2 months free. You can upgrade, downgrade, or cancel your plan at any time. Changes take effect at the start of the next billing cycle.', category: 'payments' },
  { q: 'How does the AI property matching work?', a: 'Our AI analyzes your search behavior, saved properties, and stated preferences to recommend properties that match your criteria. It learns from your interactions to provide increasingly accurate recommendations over time.', category: 'general' },
]

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const toggleFaq = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Banner */}
      <div className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">Help Center</span>
            <h1 className="text-4xl sm:text-6xl font-bold mt-3 text-gradient-light">
              Frequently Asked
              <br />
              <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Find answers to common questions about our platform
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="sticky top-20 z-40 glass-strong border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQ..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-foreground/5 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none justify-center flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {filteredFaqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <HelpCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">Try a different search term or category</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card rounded-2xl overflow-hidden hover:glow transition-all duration-500"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed mt-3">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Still need help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-8 text-center mt-8"
        >
          <MessageCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is ready to help you
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/contact">
              <Button className="rounded-xl bg-gradient-to-r from-primary to-accent">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
