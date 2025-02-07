// Firebase types
export interface NewsArticle {
  id: string
  title: string
  url: string
  classification: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  confidence: number
  summary: string
  keywords: string[]
  createdAt: Date
}

export interface User {
  id: string
  fullName: string | null
  timezone: string
  emailPreferences: {
    alerts: boolean
    digest: boolean
    news: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description: string | null
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  severity: 'low' | 'medium' | 'high'
  occurredAt: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string | null
}

export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  createdAt: Date
}

export interface Alert {
  id: string
  userId: string
  eventTypes: Array<'prophecy' | 'disaster' | 'miracle' | 'endTimes'>
  minSeverity: 'low' | 'medium' | 'high'
  locations: string[]
  createdAt: Date
  updatedAt: Date
}