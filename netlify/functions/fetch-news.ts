import { Handler } from '@netlify/functions'
import fetch from 'node-fetch'

const NEWS_API_KEY = process.env.NEWS_API_KEY
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything'

interface NewsAPIResponse {
  status: string
  totalResults: number
  articles: Array<{
    title: string
    description: string
    url: string
    urlToImage: string
    publishedAt: string
    source: {
      name: string
    }
  }>
}

const handler: Handler = async (event) => {
  if (!NEWS_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'News API key not configured' })
    }
  }

  const { q = 'prophecy OR jerusalem OR israel', page = '1' } = event.queryStringParameters || {}

  try {
    const response = await fetch(
      `${NEWS_API_ENDPOINT}?q=${encodeURIComponent(q)}&pageSize=10&page=${page}&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`News API responded with ${response.status}`)
    }

    const data: NewsAPIResponse = await response.json()

    // Transform the response to match our app's data structure
    const transformedArticles = data.articles.map(article => ({
      id: Buffer.from(article.url).toString('base64'),
      title: article.title,
      type: determineArticleType(article.title, article.description),
      summary: article.description,
      source: article.source.name,
      timestamp: article.publishedAt,
      image: article.urlToImage,
      url: article.url
    }))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      },
      body: JSON.stringify(transformedArticles)
    }
  } catch (error) {
    console.error('News API Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch news' })
    }
  }
}

function determineArticleType(title: string, description: string): 'prophecy' | 'disaster' | 'miracle' | 'endTimes' {
  const text = `${title} ${description}`.toLowerCase()
  
  if (text.includes('prophecy') || text.includes('prophetic') || text.includes('biblical')) {
    return 'prophecy'
  }
  if (text.includes('disaster') || text.includes('catastrophe') || text.includes('earthquake')) {
    return 'disaster'
  }
  if (text.includes('miracle') || text.includes('supernatural') || text.includes('divine')) {
    return 'miracle'
  }
  return 'endTimes'
}

export { handler }