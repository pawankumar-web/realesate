import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const storyTemplates = [
  "Wake up to golden sunlight streaming through floor-to-ceiling windows. Your morning coffee tastes better when the view is this beautiful.",
  "Imagine evening dinners on your private balcony, city lights twinkling below, a gentle breeze carrying the scent of jasmine.",
  "Perfect for growing families — spacious rooms where laughter echoes, a kitchen that brings everyone together, and a garden where memories bloom.",
  "Your home office with a view. Where productivity meets tranquility. Video calls never looked this good.",
  "Step into a sanctuary designed for relaxation. After a long day, this is where the world fades away and peace takes over.",
  "A home that grows with you. From first steps to graduation, every corner holds the promise of beautiful tomorrows.",
  "Entertain in style. Open-plan living that flows seamlessly from kitchen to terrace — made for dinner parties and lazy Sundays.",
  "Find your rhythm in a home that moves with you. Morning yoga by the window, evening walks in the neighborhood park.",
]

const tags = [
  'Perfect for Families',
  'Investment Hotspot',
  'Luxury Living',
  'Peaceful Retreat',
  'Urban Oasis',
  'Smart Home Ready',
  'Eco-Friendly',
  'Starter Paradise',
]

interface EmotionalStoryProps {
  price?: number
  propertyType?: string
  city?: string
  bhk?: number
}

function getStory(price = 0, propertyType = '', city = '', bhk = 0): string {
  const index = (price + bhk + propertyType.length + city.length) % storyTemplates.length
  return storyTemplates[index]
}

function getTags(price = 0, bhk = 0): string[] {
  const selected: string[] = []
  const startIdx = (price * bhk) % tags.length
  selected.push(tags[startIdx])
  selected.push(tags[(startIdx + 3) % tags.length])
  if (bhk >= 3) selected.push(tags[(startIdx + 6) % tags.length])
  return selected
}

export default function EmotionalStory({ price, propertyType, city, bhk }: EmotionalStoryProps) {
  const story = getStory(price, propertyType, city, bhk)
  const storyTags = getTags(price ?? 0, bhk ?? 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">AI Story</h3>
          <span className="text-[10px] text-muted-foreground ml-auto">Emotional Insight</span>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground leading-relaxed italic"
        >
          &ldquo;{story}&rdquo;
        </motion.p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {storyTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
