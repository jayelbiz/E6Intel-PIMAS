import { supabase } from '../supabase'

export interface NewsItem {
  id: string
  title: string
  type: 'prophecy' | 'disaster' | 'miracle' | 'endTimes'
  summary: string
  source: string
  timestamp: string
  image?: string
  url: string
}

export async function fetchNews(query?: string): Promise<NewsItem[]> {
  try {
    // Return mock data if no API key is configured
    if (!import.meta.env.VITE_NEWS_API_KEY) {
      return mockNews
    }

    const params = new URLSearchParams()
    if (query) {
      params.append('q', query)
    }

    const response = await fetch(`/.netlify/functions/fetch-news?${params}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await response.json()
    return data as NewsItem[]
  } catch (error) {
    console.error('Error fetching news:', error)
    return mockNews
  }
}

export async function saveNewsItem(newsItem: NewsItem) {
  try {
    const { data, error } = await supabase
      .from('news_articles')
      .insert([{
        title: newsItem.title,
        url: newsItem.url,
        classification: newsItem.type,
        confidence: 0.85, // Default confidence score
        summary: newsItem.summary,
        keywords: extractKeywords(newsItem.title + ' ' + newsItem.summary)
      }])

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving news item:', error)
    return null
  }
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'])
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  return [...new Set(words.filter(word => !stopWords.has(word)))]
}

// Mock data for development
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Unusual Celestial Event Over Jerusalem',
    type: 'prophecy',
    summary: 'Multiple witnesses report unprecedented astronomical events visible over Jerusalem.',
    source: 'Jerusalem Post',
    timestamp: new Date().toISOString(),
    url: '#'
  },
  {
    id: '2',
    title: 'Ancient Manuscript Discovery',
    type: 'miracle',
    summary: 'Archaeological team uncovers well-preserved prophetic texts.',
    source: 'Biblical Archaeology Review',
    timestamp: new Date().toISOString(),
    url: '#'
  },
  {
    id: '3',
    title: 'Regional Weather Anomalies',
    type: 'disaster',
    summary: 'Unprecedented weather patterns affecting multiple countries.',
    source: 'Reuters',
    timestamp: new Date().toISOString(),
    url: '#'
  }
]