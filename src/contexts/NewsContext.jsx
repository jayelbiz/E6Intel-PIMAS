import React, { createContext, useContext, useState, useEffect } from 'react';
import { newsService } from '@/services/newsService';

const NewsContext = createContext();

export const useNews = () => {
    const context = useContext(NewsContext);
    if (!context) {
        throw new Error('useNews must be used within a NewsProvider');
    }
    return context;
};

export const NewsProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [articlesRes, categoriesRes] = await Promise.all([
                    newsService.getArticles(),
                    newsService.getCategories()
                ]);

                if (articlesRes.error) throw new Error(articlesRes.error);
                if (categoriesRes.error) throw new Error(categoriesRes.error);

                setArticles(articlesRes.data || []);
                setCategories(categoriesRes.data || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching news data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const value = {
        articles,
        categories,
        loading,
        error
    };

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
};

export default NewsProvider;
