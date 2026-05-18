import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { BarChart3, X, Trash2 } from 'lucide-react'
import { RootState } from '../../store'
import { removeFromCompare, clearCompare } from '../../store/slices/compareSlice'

export default function CompareFloatingBar() {
  const dispatch = useDispatch()
  const items = useSelector((state: RootState) => state.compare.items)

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="glass-strong border border-border/50 rounded-2xl shadow-2xl p-3 flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-border/50 shrink-0"
                  >
                    <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                      <img
                        src={item.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=48&q=60'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium truncate max-w-[100px]">{item.title}</span>
                    <button
                      onClick={() => dispatch(removeFromCompare(item.id))}
                      className="p-0.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {items.length > 0 && (
                <button
                  onClick={() => dispatch(clearCompare())}
                  className="p-2 rounded-lg hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground shrink-0"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <Link
                to="/compare"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-medium hover:opacity-90 transition-all shrink-0 shadow-lg shadow-primary/20"
              >
                <BarChart3 className="w-4 h-4" />
                Compare ({items.length})
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
