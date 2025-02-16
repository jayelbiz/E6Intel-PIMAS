import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/newsService';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { ProgressSpinner } from 'primereact/progressspinner';

const NewsFeed = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const categories = [
        { label: 'All', value: null },
        { label: 'Geopolitical', value: 'geopolitical' },
        { label: 'Security Alerts', value: 'security_alerts' },
        { label: 'Natural Disasters', value: 'natural_disasters' },
        { label: 'Social Movements', value: 'social_movements' },
        { label: 'Financial & Economic', value: 'financial_economic' }
    ];

    const fetchNews = async () => {
        setLoading(true);
        try {
            const news = await newsService.fetchAllNews(searchQuery);
            const filteredNews = selectedCategory
                ? news.filter(article => article.category === selectedCategory)
                : news;
            setArticles(filteredNews);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
        // Set up polling every 5 minutes
        const interval = setInterval(fetchNews, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [searchQuery, selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchNews();
    };

    const handleViewDetails = (article) => {
        setSelectedArticle(article);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <div className="flex justify-content-center align-items-center min-h-screen">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Search and Filter Section */}
            <div className="mb-4">
                <form onSubmit={handleSearch} className="flex flex-column md:flex-row gap-3 mb-4">
                    <span className="p-input-icon-left flex-1">
                        <i className="pi pi-search" />
                        <InputText
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search news..."
                            className="w-full"
                        />
                    </span>
                    <Button 
                        type="submit" 
                        label="Search"
                        icon="pi pi-search"
                    />
                </form>
                
                <SelectButton
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.value)}
                    options={categories}
                    className="flex flex-wrap gap-2"
                />
            </div>

            {/* News Grid */}
            <div className="grid">
                {articles.map((article, index) => (
                    <div key={index} className="col-12 md:col-6 lg:col-4 xl:col-3 p-2">
                        <NewsCard 
                            article={article} 
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                ))}
            </div>

            {/* News Modal */}
            <NewsModal
                article={selectedArticle}
                visible={modalVisible}
                onHide={() => {
                    setModalVisible(false);
                    setSelectedArticle(null);
                }}
            />
        </div>
    );
};

export default NewsFeed;
