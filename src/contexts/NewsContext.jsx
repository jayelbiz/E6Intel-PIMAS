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

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [articlesRes, categoriesRes] = await Promise.all([
                newsService.getArticles(),
                newsService.getCategories()
            ]);

            setArticles(articlesRes?.data || []);
            setCategories(categoriesRes?.data || []);
        } catch (err) {
            console.error('Error fetching news data:', err);
            setError(err.message || 'Failed to fetch news data');
            setArticles([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const value = {
        articles,
        categories,
        loading,
        error,
        refetch: fetchData
    };

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
};

export default NewsProvider;
