import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { HomePage } from '@/pages/home'
import { Dashboard } from '@/pages/dashboard'
import { EventsPage } from '@/pages/Events'
import { MapPage } from '@/pages/Map'
import { AnalysisPage, AnalysisDetailPage } from '@/pages/analysis'
import { SubmitReportPage } from '@/pages/submit-report'
import { SettingsPage } from '@/pages/Settings'

// Dashboard subroutes
import { TrendingPage } from '@/pages/dashboard/trending'
import { SocialMonitoringPage } from '@/pages/dashboard/social-monitoring'
import { PropheticSignalsPage } from '@/pages/dashboard/prophetic-signals'
import { DeceptionDetectionPage } from '@/pages/dashboard/deception-detection'

// Map subroutes
import { MapEventsPage } from '@/pages/map/events'
import { MapLayersPage } from '@/pages/map/layers'
import { MapTimelinePage } from '@/pages/map/timeline'

// Analysis subroutes
import { SentimentAnalysisPage } from '@/pages/analysis/sentiment'
import { ProphecyCorrelationPage } from '@/pages/analysis/prophecy-correlation'
import { MediaControlPage } from '@/pages/analysis/media-control'

// Submit Report subroutes
import { ManualSubmissionPage } from '@/pages/submit-report/manual'
import { AutoSubmissionPage } from '@/pages/submit-report/auto'

// Settings subroutes
import { AccountSettingsPage } from '@/pages/settings/account'
import { AlertSettingsPage } from '@/pages/settings/alerts'
import { FilterSettingsPage } from '@/pages/settings/filters'

// Auth routes
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { ResetPasswordPage } from '@/pages/auth/reset-password'

import { NotFoundPage } from '@/pages/404'

export function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Main Layout Routes */}
      <Route element={<Layout />}>
        {/* Home */}
        {/* Map as default landing page */}
        <Route path="/" element={<EventsPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Events */}
        <Route path="/map" element={<MapPage />} />

        {/* Dashboard and subroutes */}
        <Route path="/dashboard">
          <Route index element={<Dashboard />} />
          <Route path="trending" element={<TrendingPage />} />
          <Route path="social-monitoring" element={<SocialMonitoringPage />} />
          <Route path="prophetic-signals" element={<PropheticSignalsPage />} />
          <Route path="deception-detection" element={<DeceptionDetectionPage />} />
        </Route>

        {/* Map and subroutes */}
        <Route path="/map">
          <Route index element={<MapPage />} />
          <Route path="events" element={<MapEventsPage />} />
          <Route path="layers" element={<MapLayersPage />} />
          <Route path="timeline" element={<MapTimelinePage />} />
        </Route>

        {/* Analysis and subroutes */}
        <Route path="/analysis">
          <Route index element={<AnalysisPage />} />
          <Route path=":id" element={<AnalysisDetailPage />} />
          <Route path="sentiment" element={<SentimentAnalysisPage />} />
          <Route path="prophecy-correlation" element={<ProphecyCorrelationPage />} />
          <Route path="media-control" element={<MediaControlPage />} />
        </Route>

        {/* Submit Report and subroutes */}
        <Route path="/submit-report">
          <Route index element={<SubmitReportPage />} />
          <Route path="manual" element={<ManualSubmissionPage />} />
          <Route path="auto" element={<AutoSubmissionPage />} />
        </Route>

        {/* Settings and subroutes */}
        <Route path="/settings">
          <Route index element={<SettingsPage />} />
          <Route path="account" element={<AccountSettingsPage />} />
          <Route path="alerts" element={<AlertSettingsPage />} />
          <Route path="filters" element={<FilterSettingsPage />} />
        </Route>
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}