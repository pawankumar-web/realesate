import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Sparkles, X, Send, ChevronDown } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  text: string
}

const suggestions = [
  'Find me a property',
  'Buy',
  'Rent',
  'Price range',
]

const botResponses: Record<string, string> = {
  'find me a property': "I can help you find the perfect property! What type are you looking for? (Apartment, Villa, Commercial)",
  'buy': "Great choice! Let me show you some premium properties available for purchase.",
  'rent': "Looking to rent? We have some amazing rental properties available.",
  'price range': "We have properties ranging from ₹20L to ₹10Cr. What's your budget?",
  'hello': "Welcome to EstateAI! How can I help you find your dream home today?",
  'hi': "Welcome to EstateAI! How can I help you find your dream home today?",
}

const defaultResponse = "I'm here to help you with property searches, market insights, and more. Try asking about buying, renting, or specific property types!"

function getBotResponse(input: string): string {
  const key = input.toLowerCase().trim()
  for (const [pattern, response] of Object.entries(botResponses)) {
    if (key.includes(pattern)) return response
  }
  return defaultResponse
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-primary" />
      </div>
      <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/60"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ msg }: { msg: Message }) {
  const isBot = msg.type === 'bot'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot ? (
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Bot size={14} className="text-primary" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
          <Sparkles size={14} className="text-accent" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isBot
            ? 'glass-card rounded-tl-sm text-foreground/90'
            : 'bg-primary/20 rounded-tr-sm text-foreground'
        }`}
      >
        {msg.text}
      </div>
    </motion.div>
  )
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', type: 'bot', text: "Welcome to EstateAI! How can I help you find your dream home today?" },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idCounter = useRef(1)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isTyping, isOpen, scrollToBottom])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  function addMessage(type: 'user' | 'bot', text: string) {
    const id = String(idCounter.current++)
    setMessages((prev) => [...prev, { id, type, text }])
  }

  function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    addMessage('user', trimmed)
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      addMessage('bot', getBotResponse(trimmed))
      setIsTyping(false)
    }, 1000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  return (
    <>
      {/* FAB button */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg cursor-pointer"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ['0 0 20px var(--primary)', '0 0 40px var(--primary)', '0 0 20px var(--primary)'] }}
          transition={{ boxShadow: { duration: 2.5, repeat: Infinity } }}
        >
          {isOpen ? <X size={22} className="text-white" /> : <Bot size={24} className="text-white" />}
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-6 z-[100] w-[360px] max-w-[calc(100vw-48px)]"
            style={{ maxHeight: 'min(560px, calc(100vh - 160px))' }}
          >
            <div className="glass-strong rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border">
              {/* Header */}
              <div className="px-4 py-3.5 border-b border-border flex items-center justify-between bg-foreground/[0.03]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">EstateAI</p>
                    <p className="text-[11px] text-muted-foreground">Online</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth" style={{ minHeight: 320, maxHeight: 380 }}>
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} msg={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-xs px-3 py-1.5 rounded-full glass-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-4 py-3 border-t border-border">
                <div className="flex items-center gap-2 bg-foreground/[0.03] rounded-xl px-3 py-2 border border-border focus-within:border-primary/40 transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                  <button
                    onClick={() => handleSend(input)}
                    disabled={!input.trim()}
                    className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
