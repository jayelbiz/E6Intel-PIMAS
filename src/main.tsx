import React from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil'
import { App } from './App'

// PrimeReact core styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Leaflet styles for maps
import 'leaflet/dist/leaflet.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
)