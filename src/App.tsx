import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from './providers/theme-provider'
import { AppRoutes } from './routes'

export function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="dark" storageKey="e612-theme">
        <AppRoutes />
      </ThemeProvider>
    </Router>
  )
}