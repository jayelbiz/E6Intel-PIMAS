import { supabase } from '@/config/supabaseClient';
import axios from 'axios';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const API_RETRY_ATTEMPTS = 3;
const API_TIMEOUT = 10000; // 10 seconds

class NewsService {
    constructor() {
        this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
        this.guardianApiKey = import.meta.env.VITE_GUARDIAN_API_KEY;
        this.cache = {
            articles: [],
            lastFetched: null
        };
        this.categories = [
            'Geopolitical',
            'Security Alerts',
            'Natural Disasters',
            'Social Movements',
            'Financial & Economic'
        ];
    }

    async getArticles() {
        try {
            // Check cache first
            if (this.cache.articles.length > 0 && 
                this.cache.lastFetched && 
                (Date.now() - this.cache.lastFetched) < CACHE_DURATION) {
                return {
                    data: this.cache.articles,
                    error: null
                };
            }

            // Fetch from multiple sources
            const [newsApiArticles, guardianArticles] = await Promise.all([
                this.fetchFromNewsApi(),
                this.fetchFromGuardian()
            ]);

            // Combine and normalize articles
            const articles = [
                ...this.normalizeNewsApiArticles(newsApiArticles),
                ...this.normalizeGuardianArticles(guardianArticles)
            ];

            // Sort by date
            articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

            // Update cache
            this.cache = {
                articles,
                lastFetched: Date.now()
            };

            return {
                data: articles,
                error: null
            };
        } catch (error) {
            console.error('Error fetching articles:', error);
            // Return cached data if available
            if (this.cache.articles.length > 0) {
                return {
                    data: this.cache.articles,
                    error: 'Using cached data due to fetch error'
                };
            }
            return {
                data: null,
                error: 'Failed to fetch articles'
            };
        }
    }

    async fetchFromNewsApi() {
        try {
            const response = await axios.get('https://newsapi.org/v2/top-headlines', {
                params: {
                    apiKey: this.newsApiKey,
                    language: 'en',
                    pageSize: 50
                },
                timeout: API_TIMEOUT
            });
            return response.data.articles;
        } catch (error) {
            console.error('NewsAPI fetch error:', error);
            return [];
        }
    }

    async fetchFromGuardian() {
        try {
            const response = await axios.get('https://content.guardianapis.com/search', {
                params: {
                    'api-key': this.guardianApiKey,
                    'show-fields': 'all',
                    'page-size': 50,
                    'order-by': 'newest'
                },
                timeout: API_TIMEOUT
            });
            return response.data.response.results;
        } catch (error) {
            console.error('Guardian API fetch error:', error);
            return [];
        }
    }

    normalizeNewsApiArticles(articles) {
        return articles.map(article => ({
            id: article.url,
            title: article.title,
            summary: article.description,
            content: article.content,
            category: this.categorizeArticle(article.title + ' ' + article.description),
            published_at: article.publishedAt,
            image_url: article.urlToImage,
            source: article.source.name,
            url: article.url,
            sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
            bias: this.analyzeBias(article.content || ''),
            themes: this.extractThemes(article.title + ' ' + article.description)
        }));
    }

    normalizeGuardianArticles(articles) {
        return articles.map(article => ({
            id: article.id,
            title: article.webTitle,
            summary: article.fields?.trailText || '',
            content: article.fields?.bodyText || '',
            category: this.categorizeArticle(article.webTitle + ' ' + (article.fields?.trailText || '')),
            published_at: article.webPublicationDate,
            image_url: article.fields?.thumbnail || '',
            source: 'The Guardian',
            url: article.webUrl,
            sentiment: this.analyzeSentiment(article.webTitle + ' ' + (article.fields?.trailText || '')),
            bias: this.analyzeBias(article.fields?.bodyText || ''),
            themes: this.extractThemes(article.webTitle + ' ' + (article.fields?.trailText || ''))
        }));
    }

    categorizeArticle(text) {
        // Simple keyword-based categorization
        const keywords = {
            'Geopolitical': ['war', 'diplomacy', 'international', 'treaty', 'foreign', 'government'],
            'Security Alerts': ['security', 'threat', 'attack', 'cyber', 'military', 'defense'],
            'Natural Disasters': ['earthquake', 'storm', 'flood', 'disaster', 'hurricane', 'wildfire'],
            'Social Movements': ['protest', 'rights', 'movement', 'demonstration', 'activism'],
            'Financial & Economic': ['market', 'economy', 'financial', 'stock', 'trade', 'business']
        };

        const textLower = text.toLowerCase();
        for (const [category, words] of Object.entries(keywords)) {
            if (words.some(word => textLower.includes(word))) {
                return category;
            }
        }
        return 'Geopolitical'; // Default category
    }

    analyzeSentiment(text) {
        // Simple keyword-based sentiment analysis
        const positive = ['success', 'growth', 'positive', 'agreement', 'progress', 'peace'];
        const negative = ['crisis', 'conflict', 'threat', 'failure', 'decline', 'war'];

        const textLower = text.toLowerCase();
        const positiveCount = positive.filter(word => textLower.includes(word)).length;
        const negativeCount = negative.filter(word => textLower.includes(word)).length;

        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    analyzeBias(text) {
        // Placeholder for bias analysis
        return 'neutral';
    }

    extractThemes(text) {
        // Simple keyword-based theme extraction
        const themes = new Set();
        const themeKeywords = {
            'politics': ['government', 'policy', 'election'],
            'economy': ['market', 'economy', 'financial'],
            'technology': ['tech', 'cyber', 'digital'],
            'security': ['security', 'defense', 'military'],
            'environment': ['climate', 'environmental', 'energy']
        };

        const textLower = text.toLowerCase();
        for (const [theme, keywords] of Object.entries(themeKeywords)) {
            if (keywords.some(word => textLower.includes(word))) {
                themes.add(theme);
            }
        }

        return Array.from(themes).slice(0, 3); // Return top 3 themes
    }

    async getCategories() {
        return {
            data: this.categories,
            error: null
        };
    }

    async getArticleById(id) {
        try {
            const { data: articles } = await this.getArticles();
            const article = articles.find(a => a.id === id);
            return {
                data: article,
                error: article ? null : 'Article not found'
            };
        } catch (error) {
            console.error('Error fetching article:', error);
            return {
                data: null,
                error: 'Failed to fetch article'
            };
        }
    }
}

export const newsService = new NewsService();
