import { BrowserRouter as Router } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'
import { analytics } from './lib/firebase'
import { AppRoutes } from './routes'
import { useEffect } from 'react'
import { logEvent } from 'firebase/analytics'

const primereactConfig = {
  ripple: true,
  inputStyle: 'outlined',
  buttonStyle: 'outlined',
  scale: 'compact'
}

export function App() {
  useEffect(() => {
    // Log app_init event when the application starts
    if (analytics) {
      logEvent(analytics, 'app_init')
    }
  }, [])

  return (
    <Router>
      <PrimeReactProvider value={primereactConfig}>
        <AppRoutes />
      </PrimeReactProvider>
    </Router>
  )
}