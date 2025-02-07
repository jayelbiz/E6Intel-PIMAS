// API configuration and utilities
const NEWS_API_KEY = import.meta.env.VITE_NEWSAPI_KEY;
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

interface NewsApiResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: {
      name: string;
    };
  }>;
}

interface DeepSeekAnalysis {
  classification: 'prophecy' | 'disaster' | 'miracle' | 'endTimes';
  confidence: number;
  keywords: string[];
  summary: string;
}

export async function fetchNews(query: string = ''): Promise<NewsApiResponse> {
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=il&q=${encodeURIComponent(query)}&apiKey=${NEWS_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch news');
  }
  
  return response.json();
}

export async function analyzeText(text: string): Promise<DeepSeekAnalysis> {
  const response = await fetch("https://api.deepseek.com/analyze", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze text');
  }

  return response.json();
}

// Utility function to validate environment variables
export function validateEnvVariables(): void {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_NEWSAPI_KEY',
    'VITE_DEEPSEEK_API_KEY'
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}