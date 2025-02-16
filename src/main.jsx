import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Import PrimeReact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const root = createRoot(document.getElementById('root'))
root.render(<App />)