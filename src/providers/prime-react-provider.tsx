import { PrimeReactProvider as Provider } from 'primereact/api'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface PrimeReactProviderProps {
  children: React.ReactNode
}

export function PrimeReactProvider({ children }: PrimeReactProviderProps) {
  const toast = useRef(null)
  const { theme } = useTheme()
  
  const value = {
    ripple: false,
    pt: {
      global: {
        css: `
          *:not(i) {
            font-family: var(--font-sans);
          }
        `
      }
    },
    inputStyle: 'outlined',
    buttonStyle: 'outlined',
    unstyled: false,
    scale: 'compact',
    ptOptions: {
      mergeSections: true,
      mergeProps: true,
    },
  }

  return (
    <Provider value={value} colorScheme={theme}>
      <Toast ref={toast} />
      {children}
    </Provider>
  )
}