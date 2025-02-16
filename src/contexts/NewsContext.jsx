import React, { createContext, useContext, useState, useEffect } from 'react';
import { newsService } from '@services/newsService';

const NewsContext = createContext();

export const useNews = () => {
    const context = useContext(NewsContext);
    if (!context) {
        throw new Error('useNews must be used within a NewsProvider');
    }
    return context;
};

export const NewsProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestArticles, setLatestArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLatestNews = async () => {
        try {
            setLoading(true);
            const news = await newsService.getCachedNews();
            
            // Filter for unread articles in the last 24 hours
            const recentArticles = news.filter(article => {
                const articleDate = new Date(article.published_at);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return articleDate >= yesterday && !article.read;
            });

            setLatestArticles(recentArticles);
            setUnreadCount(recentArticles.length);
            setError(null);
        } catch (err) {
            console.error('Error fetching news:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const markArticleAsRead = async (articleId) => {
        try {
            await newsService.markArticleAsRead(articleId);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setLatestArticles(prev => 
                prev.map(article => 
                    article.id === articleId 
                        ? { ...article, read: true }
                        : article
                )
            );
        } catch (err) {
            console.error('Error marking article as read:', err);
        }
    };

    useEffect(() => {
        fetchLatestNews();
        // Refresh news every 5 minutes
        const interval = setInterval(fetchLatestNews, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const value = {
        unreadCount,
        latestArticles,
        loading,
        error,
        fetchLatestNews,
        markArticleAsRead
    };

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
};
