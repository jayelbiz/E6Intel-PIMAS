import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout'
import { Dashboard } from './pages/dashboard'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}