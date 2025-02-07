import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Initialize with placeholder values for development
let supabaseUrl = 'https://placeholder-project.supabase.co'
let supabaseAnonKey = 'placeholder-key'

// Try to get environment variables
try {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

  if (envUrl?.startsWith('https://') && envKey) {
    supabaseUrl = envUrl
    supabaseAnonKey = envKey
  } else {
    console.warn(
      'Valid Supabase credentials not found. Using development defaults. ' +
      'Click "Connect to Supabase" to set up your project.'
    )
  }
} catch (error) {
  console.warn('Using development Supabase configuration')
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
})