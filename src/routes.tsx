import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout'
import { NewsPage } from './pages/news'
import { AnalysisPage } from './pages/analysis'
import { NotFoundPage } from './pages/404'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/news" replace />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}