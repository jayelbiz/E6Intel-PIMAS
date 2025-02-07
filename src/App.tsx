import { BrowserRouter as Router } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'
import { AppRoutes } from './routes'

const primereactConfig = {
  ripple: true,
  inputStyle: 'outlined',
  buttonStyle: 'outlined',
  scale: 'compact'
}

export function App() {
  return (
    <Router>
      <PrimeReactProvider value={primereactConfig}>
        <AppRoutes />
      </PrimeReactProvider>
    </Router>
  )
}