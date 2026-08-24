import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

import LandingPage from '@/pages/landing'
import LoginPage from '@/pages/login'
import ForgotPasswordPage from '@/pages/forgot-password'
import ResetPasswordPage from '@/pages/reset-password'
import NotFoundPage from '@/pages/app/NotFound'
import PublicDonationPage from '@/pages/users/public'
import LogoutPage from '@/pages/app/logout'
import AppLayout from '@/pages/app/layout'
import DashboardPage from '@/pages/app/dashboard'
import TreasuryPage from '@/pages/app/treasury'
import MembersPage from '@/pages/app/members'
import TithesPage from '@/pages/app/tithes'
import OfferingsPage from '@/pages/app/offerings'
import DepartmentsPage from '@/pages/app/departments'
import ProjectsPage from '@/pages/app/projects'
import BudgetsPage from '@/pages/app/budgets'
import BankAccountsPage from '@/pages/app/bank-accounts'
import IncomePage from '@/pages/app/income'
import ExpensesPage from '@/pages/app/expenses'
import ReportsPage from '@/pages/app/reports'
import AuditsPage from '@/pages/app/audits'
import DocumentsPage from '@/pages/app/documents'
import UsersPage from '@/pages/app/users'
import SettingsPage from '@/pages/app/settings'
import ProfilePage from '@/pages/app/profile'
import DonationTypesPage from '@/pages/app/donation-types'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const auth = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(!!(token && auth === 'true'))
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const auth = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(!!(token && auth === 'true'))
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      } />
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPasswordPage />
        </PublicRoute>
      } />
      <Route path="/donate" element={<PublicDonationPage />} />
      <Route path="/donation" element={<Navigate to="/donate" replace />} />
      <Route path="/donations" element={<Navigate to="/donate" replace />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="logout" element={<LogoutPage />} />
      <Route path="treasury" element={<TreasuryPage />} />
      <Route path="members" element={<MembersPage />} />
        <Route path="tithes" element={<TithesPage />} />
        <Route path="offerings" element={<OfferingsPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="bank-accounts" element={<BankAccountsPage />} />
        <Route path="income" element={<IncomePage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="audits" element={<AuditsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="donation-types" element={<DonationTypesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
