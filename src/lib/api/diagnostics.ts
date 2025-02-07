import { supabase } from '../supabase'
import { db } from '../firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { analytics } from '../firebase'

interface ApiStatus {
  name: string
  status: 'connected' | 'error' | 'missing_config'
  error?: string
}

export async function checkApiConnections(): Promise<ApiStatus[]> {
  const results: ApiStatus[] = []

  // Check News API
  try {
    const newsApiKey = import.meta.env.VITE_NEWS_API_KEY?.trim()
    if (!newsApiKey) {
      results.push({
        name: 'News API',
        status: 'missing_config',
        error: 'API key not configured'
      })
    } else {
      const response = await fetch('/.netlify/functions/fetch-news?q=test')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      results.push({ name: 'News API', status: 'connected' })
    }
  } catch (error) {
    results.push({
      name: 'News API',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Check Supabase
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1)
    if (error) throw error
    results.push({ name: 'Supabase', status: 'connected' })
  } catch (error) {
    const isConfigMissing = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY
    results.push({
      name: 'Supabase',
      status: isConfigMissing ? 'missing_config' : 'error',
      error: isConfigMissing ? 'Configuration missing' : 'Connection failed'
    })
  }

  // Check Firebase
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
    }
    
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      results.push({
        name: 'Firebase',
        status: 'missing_config',
        error: 'Configuration missing'
      })
    } else {
      const q = query(collection(db, 'news_articles'), limit(1))
      await getDocs(q)
      results.push({ name: 'Firebase', status: 'connected' })
    }
  } catch (error) {
    results.push({
      name: 'Firebase',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }

  // Check Firebase Analytics
  results.push({
    name: 'Firebase Analytics',
    status: analytics ? 'connected' : 'error',
    error: analytics ? undefined : 'Analytics not initialized'
  })

  return results
}