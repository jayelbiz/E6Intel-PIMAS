import React, { useState, useEffect } from 'react';
import { newsService } from '@services/newsService';
import NewsCard from './NewsCard';
import NewsModal from './NewsModal';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton } from 'primereact/togglebutton';
import { Panel } from 'primereact/panel';
import '@/styles/animations.css';

const NewsFeed = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
    
    // Source filters
    const [enabledSources, setEnabledSources] = useState({
        guardian: true,
        newsapi: true,
        gnews: true,
        mediastack: true
    });

    // Mediastack specific filters
    const [mediastackOptions, setMediastackOptions] = useState({
        countries: [],
        categories: [],
        sources: [],
        sort: 'published_desc'
    });

    const categories = [
        { label: 'All', value: null },
        { label: 'Geopolitical', value: 'geopolitical' },
        { label: 'Security Alerts', value: 'security_alerts' },
        { label: 'Natural Disasters', value: 'natural_disasters' },
        { label: 'Social Movements', value: 'social_movements' },
        { label: 'Financial & Economic', value: 'financial_economic' }
    ];

    const mediastackCountries = [
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'gb' },
        { label: 'Canada', value: 'ca' },
        { label: 'Australia', value: 'au' }
    ];

    const mediastackCategories = [
        { label: 'General', value: 'general' },
        { label: 'Business', value: 'business' },
        { label: 'Technology', value: 'technology' },
        { label: 'Science', value: 'science' },
        { label: 'Health', value: 'health' },
        { label: 'Politics', value: 'politics' }
    ];

    const sortOptions = [
        { label: 'Latest First', value: 'published_desc' },
        { label: 'Oldest First', value: 'published_asc' }
    ];

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Update news service with current source settings
            newsService.setSources(enabledSources);

            const news = await newsService.fetchAllNews(searchQuery, {
                mediastack: mediastackOptions
            });

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
    }, [searchQuery, selectedCategory, enabledSources, mediastackOptions]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchNews();
    };

    const handleViewDetails = (article) => {
        setSelectedArticle(article);
        setModalVisible(true);
    };

    const renderSourceToggles = () => (
        <div className="flex flex-wrap gap-3 mb-4">
            <ToggleButton
                checked={enabledSources.guardian}
                onChange={e => setEnabledSources(prev => ({ ...prev, guardian: e.value }))}
                onLabel="Guardian"
                offLabel="Guardian"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                className="shadow-1 hover:shadow-2 transition-all transition-duration-200"
            />
            <ToggleButton
                checked={enabledSources.newsapi}
                onChange={e => setEnabledSources(prev => ({ ...prev, newsapi: e.value }))}
                onLabel="NewsAPI"
                offLabel="NewsAPI"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                className="shadow-1 hover:shadow-2 transition-all transition-duration-200"
            />
            <ToggleButton
                checked={enabledSources.gnews}
                onChange={e => setEnabledSources(prev => ({ ...prev, gnews: e.value }))}
                onLabel="GNews"
                offLabel="GNews"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                className="shadow-1 hover:shadow-2 transition-all transition-duration-200"
            />
            <ToggleButton
                checked={enabledSources.mediastack}
                onChange={e => setEnabledSources(prev => ({ ...prev, mediastack: e.value }))}
                onLabel="Mediastack"
                offLabel="Mediastack"
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                className="shadow-1 hover:shadow-2 transition-all transition-duration-200"
            />
        </div>
    );

    const renderMediastackFilters = () => (
        <Panel 
            header="Mediastack Filters" 
            toggleable 
            collapsed={!advancedFiltersVisible}
            onToggle={(e) => setAdvancedFiltersVisible(e.value)}
            className="mb-4 shadow-2"
            pt={{
                toggler: { className: 'hover:bg-primary-50 transition-colors transition-duration-200' },
                content: { className: 'p-3' }
            }}
        >
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block mb-2 font-medium text-700">Countries</label>
                    <MultiSelect
                        value={mediastackOptions.countries}
                        options={mediastackCountries}
                        onChange={(e) => setMediastackOptions(prev => ({ ...prev, countries: e.value }))}
                        placeholder="Select Countries"
                        className="w-full shadow-1 hover:shadow-2 transition-all transition-duration-200"
                        display="chip"
                    />
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block mb-2 font-medium text-700">Categories</label>
                    <MultiSelect
                        value={mediastackOptions.categories}
                        options={mediastackCategories}
                        onChange={(e) => setMediastackOptions(prev => ({ ...prev, categories: e.value }))}
                        placeholder="Select Categories"
                        className="w-full shadow-1 hover:shadow-2 transition-all transition-duration-200"
                        display="chip"
                    />
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <label className="block mb-2 font-medium text-700">Sort Order</label>
                    <Dropdown
                        value={mediastackOptions.sort}
                        options={sortOptions}
                        onChange={(e) => setMediastackOptions(prev => ({ ...prev, sort: e.value }))}
                        placeholder="Select Sort Order"
                        className="w-full shadow-1 hover:shadow-2 transition-all transition-duration-200"
                    />
                </div>
            </div>
        </Panel>
    );

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
            <div className="mb-5 surface-card p-4 border-round shadow-2">
                <form onSubmit={handleSearch} className="flex flex-column md:flex-row gap-3 mb-4">
                    <span className="p-input-icon-left flex-1 w-full">
                        <i className="pi pi-search" />
                        <InputText
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search news..."
                            className="w-full shadow-1 hover:shadow-2 transition-all transition-duration-200"
                        />
                    </span>
                    <Button 
                        type="submit" 
                        label="Search"
                        icon="pi pi-search"
                        className="shadow-1 hover:shadow-3 transition-all transition-duration-200"
                    />
                </form>
                
                {renderSourceToggles()}
                
                {enabledSources.mediastack && renderMediastackFilters()}
                
                <SelectButton
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.value)}
                    options={categories}
                    className="flex flex-wrap gap-2 shadow-1 hover:shadow-2 transition-all transition-duration-200"
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
                
                {articles.length === 0 && (
                    <div className="col-12 text-center p-5 surface-card border-round shadow-2">
                        <i className="pi pi-info-circle text-4xl mb-3 text-primary"></i>
                        <p className="text-xl font-medium">No articles found. Try adjusting your filters or search query.</p>
                    </div>
                )}
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
