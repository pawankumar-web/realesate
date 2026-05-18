import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { WhatsAppCTA } from '../components/conversion/ConversionOptimizer'
import AIAssistant from '../components/common/AIAssistant'
import CompareFloatingBar from '../components/property/CompareFloatingBar'

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppCTA />
      <AIAssistant />
      <CompareFloatingBar />
    </div>
  )
}
