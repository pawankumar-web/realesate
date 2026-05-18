import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, Mic, X, TrendingUp, MapPin, Building2 } from 'lucide-react'

interface SmartSuggestion {
  text: string
  icon: typeof Sparkles
  category: string
}

const smartSuggestions: SmartSuggestion[] = [
  { text: 'Luxury villa under 2 crore', icon: Sparkles, category: 'Popular' },
  { text: '2BHK near metro station', icon: MapPin, category: 'Popular' },
  { text: 'Peaceful family apartment', icon: Building2, category: 'Lifestyle' },
  { text: 'High ROI investment property', icon: TrendingUp, category: 'Investment' },
  { text: 'Penthouse with sea view', icon: Sparkles, category: 'Premium' },
  { text: 'Ready to move 3BHK in Bangalore', icon: Building2, category: 'Popular' },
  { text: 'Commercial space for rent in CBD', icon: TrendingUp, category: 'Commercial' },
  { text: 'Villa with pool for weekend home', icon: Sparkles, category: 'Lifestyle' },
]

interface AISmartSearchProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

function parseSearchQuery(query: string): Record<string, string> {
  const params: Record<string, string> = {}
  const lower = query.toLowerCase()

  if (lower.includes('under') || lower.includes('below')) {
    const match = query.match(/(?:under|below)\s*(\d+\.?\d*)\s*(cr|lakh|lac|k)/i)
    if (match) {
      const val = parseFloat(match[1])
      const unit = match[2].toLowerCase()
      params.maxPrice = String(unit === 'cr' ? val * 10000000 : unit === 'lakh' || unit === 'lac' ? val * 100000 : val * 1000)
    }
  }

  const bhkMatch = query.match(/(\d+)\s*BHK/i)
  if (bhkMatch) params.bhk = bhkMatch[1]

  const typeMap: Record<string, string> = {
    villa: 'Villa', apartment: 'Apartment', penthouse: 'Penthouse',
    'commercial space': 'Commercial', land: 'Land', house: 'House',
  }
  for (const [key, value] of Object.entries(typeMap)) {
    if (lower.includes(key)) { params.property_type = value; break }
  }

  if (lower.includes('luxury') || lower.includes('premium')) params.is_featured = '1'
  if (lower.includes('rent')) params.purpose = 'rent'
  else if (lower.includes('buy') || lower.includes('purchase')) params.purpose = 'buy'

  const cities = ['mumbai', 'bangalore', 'delhi', 'pune', 'hyderabad', 'chennai', 'kolkata', 'gurgaon', 'noida', 'goa']
  for (const city of cities) {
    if (lower.includes(city)) { params.city = city.charAt(0).toUpperCase() + city.slice(1); break }
  }

  return params
}

export default function AISmartSearch({ onSearch, placeholder = 'Describe your dream home naturally...', className = '' }: AISmartSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [parsedIntent, setParsedIntent] = useState<Record<string, string> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Voice recognition
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const recognition = useRef<typeof SpeechRecognition | null>(null)

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'
      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setQuery(transcript)
        setIsListening(false)
        if (transcript.trim()) {
          setParsedIntent(parseSearchQuery(transcript))
          setShowSuggestions(false)
        }
      }
      recognition.current.onerror = () => setIsListening(false)
      recognition.current.onend = () => setIsListening(false)
    }
  }, [])

  const handleVoiceClick = () => {
    if (!recognition.current) {
      alert('Voice search is not supported in your browser. Try Chrome.')
      return
    }
    if (isListening) {
      recognition.current.stop()
      setIsListening(false)
    } else {
      recognition.current.start()
      setIsListening(true)
    }
  }

  const handleSubmit = (searchQuery?: string) => {
    const q = (searchQuery || query).trim()
    if (!q) return
    const parsed = parseSearchQuery(q)
    setParsedIntent(parsed)
    setShowSuggestions(false)

    const params = new URLSearchParams()
    Object.entries(parsed).forEach(([k, v]) => params.set(k, v))
    const url = `/properties?${params.toString()}`

    if (onSearch) onSearch(q)
    else window.location.href = url
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSubmit(suggestion)
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center gap-2 rounded-2xl border transition-all duration-300 ${
        isFocused ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-border'
      } bg-foreground/5 backdrop-blur-xl`}>
        <div className="flex-1 flex items-center gap-3 px-4">
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Mic className="w-5 h-5 text-red-400" />
            </motion.div>
          ) : (
            <Search className="w-5 h-5 text-primary shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
              setParsedIntent(null)
            }}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true) }}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={isListening ? 'Listening...' : placeholder}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground/50 text-sm sm:text-base py-3 outline-none"
          />
        </div>

        {query && (
          <button onClick={() => { setQuery(''); setParsedIntent(null) }} className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={handleVoiceClick}
          className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-red-500/20 text-red-400' : 'hover:bg-foreground/5 text-muted-foreground hover:text-foreground'}`}
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleSubmit()}
          className="mr-2 p-2.5 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white transition-all flex items-center gap-2 px-4"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Parsed intent display */}
      <AnimatePresence>
        {parsedIntent && Object.keys(parsedIntent).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex flex-wrap gap-1.5 mt-2"
          >
            {Object.entries(parsedIntent).map(([key, value]) => (
              <span key={key} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/20 text-primary border border-primary/20">
                {key}: {value}
              </span>
            ))}
            <span className="text-[10px] text-muted-foreground self-center ml-1">AI detected</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions */}
      <AnimatePresence>
        {showSuggestions && !query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-strong rounded-2xl p-3 shadow-2xl z-50"
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 px-2">Try asking naturally</p>
            <div className="grid grid-cols-1 gap-0.5">
              {smartSuggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={() => handleSuggestionClick(s.text)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors flex items-center gap-3"
                >
                  <s.icon className="w-4 h-4 text-primary/50 shrink-0" />
                  <span className="flex-1">{s.text}</span>
                  <span className="text-[10px] text-muted-foreground/50">{s.category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isListening && (
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl -z-10 animate-glow-pulse" />
      )}
    </div>
  )
}

export { parseSearchQuery }
