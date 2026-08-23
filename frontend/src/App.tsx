// ============================================================
// MORNINGSTAR — APP ROUTER
// All routes defined here. Add new routes in respective groups.
// ============================================================

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import AppShell from '@/components/layout/AppShell'

// Public Pages
import LandingPage from '@/pages/public/LandingPage'
import LoginPage from '@/pages/public/LoginPage'
import HowItWorksPage from '@/pages/public/HowItWorksPage'

// Farmer Pages (lazy stubs — will be built in subsequent phases)
import DashboardPage from '@/pages/farmer/DashboardPage'
import CropLotsPage from '@/pages/farmer/CropLotsPage'
import CreateCropLotPage from '@/pages/farmer/CreateCropLotPage'
import CropLotDetailPage from '@/pages/farmer/CropLotDetailPage'
import MarketIntelligencePage from '@/pages/farmer/MarketIntelligencePage'
import RecommendationPage from '@/pages/farmer/RecommendationPage'
import BuyersPage from '@/pages/farmer/BuyersPage'
import NegotiationPage from '@/pages/farmer/NegotiationPage'
import TransactionsPage from '@/pages/farmer/TransactionsPage'
import LogisticsPage from '@/pages/farmer/LogisticsPage'
import NotificationsPage from '@/pages/farmer/NotificationsPage'
import ProfilePage from '@/pages/farmer/ProfilePage'

// Guard: redirect to login if not authenticated
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { is_authenticated } = useAuth()
  return is_authenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Guard: redirect to dashboard if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { is_authenticated } = useAuth()
  return is_authenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />

      {/* Farmer Protected Routes */}
      <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/crop-lots" element={<CropLotsPage />} />
        <Route path="/crop-lots/new" element={<CreateCropLotPage />} />
        <Route path="/crop-lots/:id" element={<CropLotDetailPage />} />
        <Route path="/crop-lots/:id/market" element={<MarketIntelligencePage />} />
        <Route path="/crop-lots/:id/recommendation" element={<RecommendationPage />} />
        <Route path="/crop-lots/:id/buyers" element={<BuyersPage />} />
        <Route path="/negotiations/:offerId" element={<NegotiationPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/logistics/:transactionId" element={<LogisticsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
