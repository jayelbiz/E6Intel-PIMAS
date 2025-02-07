import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Initialize with default values for development
let supabaseUrl = 'https://your-project.supabase.co'
let supabaseAnonKey = 'your-anon-key'

// Try to get environment variables
try {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

  if (envUrl && envKey) {
    // Validate URL format
    const url = new URL(envUrl)
    if (!url.protocol.startsWith('https:')) {
      console.warn('Warning: Supabase URL should use HTTPS protocol')
    }
    
    supabaseUrl = envUrl
    supabaseAnonKey = envKey
  } else {
    console.warn(
      'Supabase credentials not found. Using development defaults. ' +
      'Click "Connect to Supabase" to set up your project.'
    )
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error)
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