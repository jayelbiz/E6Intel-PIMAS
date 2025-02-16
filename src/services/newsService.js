import { supabase } from '../config/supabase';
import { CACHE_DURATION, API_RETRY_ATTEMPTS, API_TIMEOUT } from '../constants';
import axios from 'axios';

// Mock categories for initial setup
const categories = [
    'Geopolitical',
    'Security Alerts',
    'Natural Disasters',
    'Social Movements',
    'Financial & Economic'
];

// Mock data for initial setup
const mockArticles = [
    {
        id: 1,
        title: 'Global Security Update',
        summary: 'Recent developments in international security measures...',
        content: 'Detailed analysis of global security trends and their implications...',
        category: 'Security Alerts',
        published_at: new Date().toISOString(),
        image_url: 'https://picsum.photos/800/400',
        sentiment: 'neutral',
        bias: 'balanced',
        themes: ['security', 'global', 'technology']
    },
    {
        id: 2,
        title: 'Economic Impact Analysis',
        summary: 'Analysis of recent economic developments...',
        content: 'In-depth review of economic indicators and market trends...',
        category: 'Financial & Economic',
        published_at: new Date().toISOString(),
        image_url: 'https://picsum.photos/800/400',
        sentiment: 'positive',
        bias: 'neutral',
        themes: ['economy', 'markets', 'finance']
    }
];

class NewsService {
    constructor() {
        this.guardianApiKey = import.meta.env.VITE_GUARDIAN_API_KEY;
        this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
        this.gNewsApiKey = import.meta.env.VITE_GNEWS_API_KEY;
        this.mediastackApiKey = import.meta.env.VITE_MEDIASTACK_API_KEY;
        this.cacheExpiryMinutes = 5;
        this.sources = {
            guardian: true,
            newsapi: true,
            gnews: true,
            mediastack: true
        };
        this.axios = axios.create({
            timeout: API_TIMEOUT
        });
        this.articles = mockArticles;
        this.categories = categories;
    }

    async retryWithBackoff(fn, retries = API_RETRY_ATTEMPTS) {
        try {
            return await fn();
        } catch (error) {
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, API_RETRY_ATTEMPTS - retries) * 1000));
            return this.retryWithBackoff(fn, retries - 1);
        }
    }

    async logApiCall(apiName, endpoint, status, error = null, metadata = {}) {
        try {
            await supabase.from('api_logs').insert([{
                api_name: apiName,
                endpoint,
                response_status: status,
                error_message: error?.message,
                request_metadata: metadata
            }]);
        } catch (err) {
            console.error('Failed to log API call:', err);
        }
    }

    async getCachedNews(category = null) {
        try {
            let query = supabase
                .from('news_cache')
                .select(`
                    *,
                    news_analysis (
                        sentiment_score,
                        bias_indicator,
                        misinformation_flag,
                        key_themes
                    )
                `)
                .gt('expires_at', new Date().toISOString());

            if (category) {
                query = query.eq('category', category);
            }

            const { data: cachedNews, error } = await query;
            
            if (error) throw error;
            return cachedNews;
        } catch (error) {
            console.error('Error fetching cached news:', error);
            return [];
        }
    }

    async cacheNews(articles) {
        try {
            const expiryDate = new Date();
            expiryDate.setMinutes(expiryDate.getMinutes() + this.cacheExpiryMinutes);

            const { data, error } = await supabase
                .from('news_cache')
                .upsert(
                    articles.map(article => ({
                        ...article,
                        expires_at: expiryDate.toISOString()
                    })),
                    { onConflict: 'url' }
                );

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error caching news:', error);
            return null;
        }
    }

    async fetchGuardianNews(query = '') {
        const startTime = Date.now();
        try {
            const response = await this.retryWithBackoff(() => this.axios.get(
                `https://content.guardianapis.com/search?api-key=${this.guardianApiKey}&show-fields=thumbnail,bodyText&q=${query}`
            ));

            const responseTime = Date.now() - startTime;
            await this.logApiCall('Guardian', '/search', response.status);

            if (!response.ok) throw new Error('Guardian API request failed');

            const data = response.data;
            return data.response.results.map(article => ({
                title: article.webTitle,
                content: article.fields?.bodyText,
                url: article.webUrl,
                image_url: article.fields?.thumbnail,
                source_name: 'The Guardian',
                source_id: article.id,
                published_at: article.webPublicationDate,
                category: this.categorizeArticle(article.sectionName)
            }));
        } catch (error) {
            console.error('Error fetching from Guardian:', error);
            await this.logApiCall('Guardian', '/search', 500, error);
            return [];
        }
    }

    async fetchNewsAPI(query = '') {
        const startTime = Date.now();
        try {
            const response = await this.retryWithBackoff(() => this.axios.get(
                `https://newsapi.org/v2/everything?q=${query}&apiKey=${this.newsApiKey}&language=en`
            ));

            const responseTime = Date.now() - startTime;
            await this.logApiCall('NewsAPI', '/everything', response.status);

            if (!response.ok) throw new Error('NewsAPI request failed');

            const data = response.data;
            return data.articles.map(article => ({
                title: article.title,
                content: article.content,
                url: article.url,
                image_url: article.urlToImage,
                source_name: article.source.name,
                source_id: article.source.id,
                published_at: article.publishedAt,
                category: this.categorizeArticle(article.title)
            }));
        } catch (error) {
            console.error('Error fetching from NewsAPI:', error);
            await this.logApiCall('NewsAPI', '/everything', 500, error);
            return [];
        }
    }

    async fetchGNews(query = '') {
        const startTime = Date.now();
        try {
            const response = await this.retryWithBackoff(() => this.axios.get(
                `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=10&apikey=${this.gNewsApiKey}`
            ));

            const responseTime = Date.now() - startTime;
            await this.logApiCall('GNews', '/search', response.status);

            if (!response.ok) throw new Error('GNews API request failed');

            const data = response.data;
            return data.articles.map(article => ({
                title: article.title,
                content: article.content,
                url: article.url,
                image_url: article.image,
                source_name: article.source.name,
                source_id: null,
                published_at: article.publishedAt,
                category: this.categorizeArticle(article.title)
            }));
        } catch (error) {
            console.error('Error fetching from GNews:', error);
            await this.logApiCall('GNews', '/search', 500, error);
            return [];
        }
    }

    validateMediastackArticle(article) {
        const required = ['title', 'description', 'url', 'source', 'published_at'];
        const isValid = required.every(field => {
            const value = article[field];
            return value !== undefined && value !== null && value !== '';
        });

        if (!isValid) {
            console.warn('Invalid Mediastack article:', article);
            return false;
        }

        // Validate URL format
        try {
            new URL(article.url);
        } catch {
            console.warn('Invalid URL in Mediastack article:', article);
            return false;
        }

        // Validate date format
        if (isNaN(Date.parse(article.published_at))) {
            console.warn('Invalid date in Mediastack article:', article);
            return false;
        }

        return true;
    }

    async fetchMediastack(query = '', options = {}) {
        const startTime = Date.now();
        try {
            const {
                countries = [],
                categories = [],
                sources = [],
                limit = 100,
                offset = 0,
                sort = 'published_desc'
            } = options;

            const params = new URLSearchParams({
                access_key: this.mediastackApiKey,
                languages: 'en',
                keywords: query,
                limit: limit.toString(),
                offset: offset.toString(),
                sort
            });

            if (countries.length > 0) params.append('countries', countries.join(','));
            if (categories.length > 0) params.append('categories', categories.join(','));
            if (sources.length > 0) params.append('sources', sources.join(','));

            const response = await this.retryWithBackoff(() => this.axios.get(
                `http://api.mediastack.com/v1/news?${params.toString()}`
            ));

            const responseTime = Date.now() - startTime;
            await this.logApiCall('Mediastack', '/news', response.status);

            if (!response.ok) throw new Error('Mediastack API request failed');

            const data = response.data;
            
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid Mediastack API response format');
            }

            return data.data
                .filter(article => this.validateMediastackArticle(article))
                .map(article => ({
                    title: article.title,
                    content: article.description,
                    url: article.url,
                    image_url: article.image,
                    source_name: article.source,
                    source_id: null,
                    published_at: article.published_at,
                    category: this.categorizeArticle(article.category || article.title),
                    provider: 'mediastack',
                    metadata: {
                        country: article.country,
                        category: article.category,
                        language: article.language
                    }
                }));
        } catch (error) {
            console.error('Error fetching from Mediastack:', error);
            await this.logApiCall('Mediastack', '/news', 500, error);
            return [];
        }
    }

    categorizeArticle(text) {
        const categories = {
            geopolitical: ['war', 'diplomacy', 'international', 'politics', 'military'],
            security_alerts: ['cyber', 'attack', 'threat', 'security', 'hack'],
            natural_disasters: ['earthquake', 'storm', 'disaster', 'hurricane', 'wildfire'],
            social_movements: ['protest', 'rights', 'movement', 'demonstration'],
            financial_economic: ['market', 'economy', 'financial', 'stock', 'trade']
        };

        text = text.toLowerCase();
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                return category;
            }
        }
        return 'geopolitical'; // Default category
    }

    async fetchAllNews(query = '', options = {}) {
        try {
            // First check cache
            const cachedNews = await this.getCachedNews();
            if (cachedNews.length > 0 && !options.bypass_cache) {
                return this.filterNewsBySource(cachedNews);
            }

            // Prepare API calls based on enabled sources
            const apiCalls = [];
            
            if (this.sources.guardian) {
                apiCalls.push(this.fetchGuardianNews(query));
            }
            if (this.sources.newsapi) {
                apiCalls.push(this.fetchNewsAPI(query));
            }
            if (this.sources.gnews) {
                apiCalls.push(this.fetchGNews(query));
            }
            if (this.sources.mediastack) {
                apiCalls.push(this.fetchMediastack(query, options.mediastack));
            }

            // Fetch from enabled sources in parallel
            const results = await Promise.all(apiCalls);
            
            // Combine results
            const allNews = results.flat();
            
            // Cache if we have results
            if (allNews.length > 0) {
                await this.cacheNews(allNews);
            }

            return this.filterNewsBySource(allNews);
        } catch (error) {
            console.error('Error fetching news:', error);
            throw error;
        }
    }

    filterNewsBySource(articles) {
        return articles.filter(article => {
            const source = article.provider || this.determineProvider(article.source_name);
            return this.sources[source];
        });
    }

    determineProvider(sourceName) {
        // Map source names to providers
        const sourceMap = {
            'The Guardian': 'guardian',
            'NewsAPI': 'newsapi',
            'GNews': 'gnews'
        };
        return sourceMap[sourceName] || 'mediastack';
    }

    async getArticles() {
        try {
            // TODO: Replace with actual Supabase query
            return {
                data: this.articles,
                error: null
            };
        } catch (error) {
            console.error('Error fetching articles:', error);
            return {
                data: null,
                error: 'Failed to fetch articles'
            };
        }
    }

    async getCategories() {
        try {
            // TODO: Replace with actual Supabase query
            return {
                data: this.categories,
                error: null
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return {
                data: null,
                error: 'Failed to fetch categories'
            };
        }
    }

    async getArticleById(id) {
        try {
            const article = this.articles.find(a => a.id === id);
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
