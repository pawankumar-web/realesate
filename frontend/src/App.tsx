import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import MainLayout from './layouts/MainLayout'
import UserDashboardLayout from './layouts/UserDashboardLayout'
import VendorDashboardLayout from './layouts/VendorDashboardLayout'
import AdminDashboardLayout from './layouts/AdminDashboardLayout'
import PageLoader from './components/common/PageLoader'

const HomePage = lazy(() => import('./pages/public/HomePage'))
const LoginPage = lazy(() => import('./pages/public/LoginPage'))
const RegisterPage = lazy(() => import('./pages/public/RegisterPage'))
const PropertyListingPage = lazy(() => import('./pages/public/PropertyListingPage'))
const PropertyDetailPage = lazy(() => import('./pages/public/PropertyDetailPage'))
const AgentListingPage = lazy(() => import('./pages/public/AgentListingPage'))
const AgentDetailPage = lazy(() => import('./pages/public/AgentDetailPage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const BlogPage = lazy(() => import('./pages/public/BlogPage'))
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage'))
const FaqPage = lazy(() => import('./pages/public/FaqPage'))
const ComparePage = lazy(() => import('./pages/public/ComparePage'))
const SubscriptionPlansPage = lazy(() => import('./pages/public/SubscriptionPlansPage'))
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'))
const UserBookings = lazy(() => import('./pages/user/UserBookings'))
const UserWishlist = lazy(() => import('./pages/user/UserWishlist'))
const UserReviews = lazy(() => import('./pages/user/UserReviews'))
const UserSavedSearches = lazy(() => import('./pages/user/UserSavedSearches'))
const UserProfile = lazy(() => import('./pages/user/UserProfile'))
const VendorDashboard = lazy(() => import('./pages/vendor/VendorDashboard'))
const VendorProperties = lazy(() => import('./pages/vendor/VendorProperties'))
const VendorPropertyForm = lazy(() => import('./pages/vendor/VendorPropertyForm'))
const VendorLeads = lazy(() => import('./pages/vendor/VendorLeads'))
const VendorAnalytics = lazy(() => import('./pages/vendor/VendorAnalytics'))
const VendorChat = lazy(() => import('./pages/vendor/VendorChat'))
const VendorKyc = lazy(() => import('./pages/vendor/VendorKyc'))
const VendorSubscriptions = lazy(() => import('./pages/vendor/VendorSubscriptions'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'))
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'))
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useSelector((state: RootState) => state.auth)
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/properties" element={<PropertyListingPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path="/agents" element={<AgentListingPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/subscription-plans" element={<SubscriptionPlansPage />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboardLayout /></ProtectedRoute>}>
          <Route index element={<UserDashboard />} />
          <Route path="wishlist" element={<UserWishlist />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="reviews" element={<UserReviews />} />
          <Route path="saved-searches" element={<UserSavedSearches />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>

        <Route path="/vendor" element={<ProtectedRoute roles={['vendor']}><VendorDashboardLayout /></ProtectedRoute>}>
          <Route index element={<VendorDashboard />} />
          <Route path="properties" element={<VendorProperties />} />
          <Route path="properties/create" element={<VendorPropertyForm />} />
          <Route path="properties/:id/edit" element={<VendorPropertyForm />} />
          <Route path="leads" element={<VendorLeads />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="chat" element={<VendorChat />} />
          <Route path="chat/:conversationId" element={<VendorChat />} />
          <Route path="kyc" element={<VendorKyc />} />
          <Route path="subscriptions" element={<VendorSubscriptions />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboardLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="properties" element={<AdminProperties />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
