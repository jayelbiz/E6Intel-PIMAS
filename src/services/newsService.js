import { supabase } from '../config/supabase';

class NewsService {
    constructor() {
        this.guardianApiKey = import.meta.env.VITE_GUARDIAN_API_KEY;
        this.newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
        this.gNewsApiKey = import.meta.env.VITE_GNEWS_API_KEY;
        this.mediastackApiKey = import.meta.env.VITE_MEDIASTACK_API_KEY;
        this.cacheExpiryMinutes = 5;
    }

    async logApiCall(apiName, endpoint, status, responseTime, error = null) {
        try {
            await supabase.from('api_logs').insert({
                api_name: apiName,
                endpoint,
                response_status: status,
                response_time_ms: responseTime,
                error_message: error,
                request_metadata: { timestamp: new Date().toISOString() }
            });
        } catch (error) {
            console.error('Error logging API call:', error);
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
            const response = await fetch(
                `https://content.guardianapis.com/search?api-key=${this.guardianApiKey}&show-fields=thumbnail,bodyText&q=${query}`
            );
            
            const responseTime = Date.now() - startTime;
            await this.logApiCall('Guardian', '/search', response.status, responseTime);

            if (!response.ok) throw new Error('Guardian API request failed');

            const data = await response.json();
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
            await this.logApiCall('Guardian', '/search', 500, Date.now() - startTime, error.message);
            return [];
        }
    }

    async fetchNewsAPI(query = '') {
        const startTime = Date.now();
        try {
            const response = await fetch(
                `https://newsapi.org/v2/everything?q=${query}&apiKey=${this.newsApiKey}&language=en`
            );
            
            const responseTime = Date.now() - startTime;
            await this.logApiCall('NewsAPI', '/everything', response.status, responseTime);

            if (!response.ok) throw new Error('NewsAPI request failed');

            const data = await response.json();
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
            await this.logApiCall('NewsAPI', '/everything', 500, Date.now() - startTime, error.message);
            return [];
        }
    }

    async fetchGNews(query = '') {
        const startTime = Date.now();
        try {
            const response = await fetch(
                `https://gnews.io/api/v4/search?q=${query}&lang=en&country=us&max=10&apikey=${this.gNewsApiKey}`
            );
            
            const responseTime = Date.now() - startTime;
            await this.logApiCall('GNews', '/search', response.status, responseTime);

            if (!response.ok) throw new Error('GNews API request failed');

            const data = await response.json();
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
            await this.logApiCall('GNews', '/search', 500, Date.now() - startTime, error.message);
            return [];
        }
    }

    async fetchMediastack(query = '') {
        const startTime = Date.now();
        try {
            const response = await fetch(
                `http://api.mediastack.com/v1/news?access_key=${this.mediastackApiKey}&languages=en&keywords=${query}`
            );
            
            const responseTime = Date.now() - startTime;
            await this.logApiCall('Mediastack', '/news', response.status, responseTime);

            if (!response.ok) throw new Error('Mediastack API request failed');

            const data = await response.json();
            return data.data.map(article => ({
                title: article.title,
                content: article.description,
                url: article.url,
                image_url: article.image,
                source_name: article.source,
                source_id: null,
                published_at: article.published_at,
                category: this.categorizeArticle(article.category || article.title)
            }));
        } catch (error) {
            console.error('Error fetching from Mediastack:', error);
            await this.logApiCall('Mediastack', '/news', 500, Date.now() - startTime, error.message);
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

    async fetchAllNews(query = '') {
        // First check cache
        const cachedNews = await this.getCachedNews();
        if (cachedNews.length > 0) {
            return cachedNews;
        }

        // Fetch from all sources in parallel
        const [guardianNews, newsApiNews, gNews, mediastackNews] = await Promise.all([
            this.fetchGuardianNews(query),
            this.fetchNewsAPI(query),
            this.fetchGNews(query),
            this.fetchMediastack(query)
        ]);

        // Combine and cache results
        const allNews = [...guardianNews, ...newsApiNews, ...gNews, ...mediastackNews];
        await this.cacheNews(allNews);

        return allNews;
    }
}

export const newsService = new NewsService();
