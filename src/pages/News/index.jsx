import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNews } from '@/contexts/NewsContext';
import { processContent, getLocationSummary } from '@/utils/contentProcessor';
import '@/styles/news.scss';

const LoadingState = () => (
  <div className="card flex justify-content-center align-items-center min-h-screen">
    <ProgressSpinner />
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="card flex flex-column justify-content-center align-items-center min-h-screen gap-4">
    <i className="pi pi-exclamation-circle text-6xl text-red-500"></i>
    <h2 className="text-xl font-bold text-900">{message}</h2>
    <Button label="Retry" icon="pi pi-refresh" onClick={onRetry} />
  </div>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const News = () => {
  document.title = "News | E6Intel PIMAS";
  
  const { articles, loading, categories, error, refetch } = useNews();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [processedContent, setProcessedContent] = useState({ html: '', locations: [] });
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'recent',
    search: ''
  });

  const sortOptions = [
    { label: 'Most Recent', value: 'date' },
    { label: 'Reliability Score', value: 'reliability' },
    { label: 'Sentiment Score', value: 'sentiment' },
    { label: 'Event Severity', value: 'severity' }
  ];

  useEffect(() => {
    if (selectedArticle) {
      const { html, locations } = processContent(selectedArticle.content);
      setProcessedContent({ html, locations });
    }
  }, [selectedArticle]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const renderHeader = () => (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h1 className="text-3xl font-bold mb-4 md:mb-0">News Feed</h1>
      <div className="flex flex-column md:flex-row gap-3">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText 
            placeholder="Search" 
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </span>
        <Dropdown
          value={filters.category}
          options={[
            { label: 'All Categories', value: 'all' },
            ...categories.map(category => ({ label: category, value: category.toLowerCase() }))
          ]}
          onChange={(e) => setFilters({...filters, category: e.value})}
          placeholder="Select Category"
        />
        <Dropdown
          value={filters.sortBy}
          options={sortOptions}
          onChange={(e) => setFilters({...filters, sortBy: e.value})}
          placeholder="Sort by"
        />
      </div>
    </div>
  );

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'success',
      negative: 'danger',
      neutral: 'info'
    };
    return colors[sentiment] || 'info';
  };

  const itemTemplate = (article) => (
    <div className="col-12 md:col-6 lg:col-4 p-2">
      <Card className="h-full surface-card shadow-2">
        <div className="flex flex-column gap-3">
          {article.image_url && (
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full border-round"
              style={{ maxHeight: '200px', objectFit: 'cover' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="text-xl font-bold text-900">{article.title}</div>
          <div className="text-500">{article.summary}</div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge value={article.category} severity="info" />
            <Badge value={article.sentiment} severity={getSentimentColor(article.sentiment)} />
            {article.themes?.map((theme, index) => (
              <Badge key={index} value={theme} severity="warning" />
            ))}
          </div>

          <div className="flex flex-column gap-2 text-sm">
            <div className="flex align-items-center gap-2">
              <i className="pi pi-calendar text-500"></i>
              <span className="text-500">{formatDate(article.published_at)}</span>
            </div>
            <div className="flex align-items-center gap-2">
              <i className="pi pi-globe text-500"></i>
              <span className="text-500">{article.source}</span>
            </div>
          </div>

          <div className="flex justify-content-between align-items-center">
            <Button 
              label="Read More" 
              className="p-button-text" 
              onClick={() => setSelectedArticle(article)}
            />
            <Button 
              icon="pi pi-bookmark" 
              className="p-button-rounded p-button-text"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const filteredArticles = articles.filter(article => {
    const matchesCategory = filters.category === 'all' || 
      article.category.toLowerCase() === filters.category;
    
    const matchesSearch = !filters.search ||
      article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      article.summary.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'date':
        return new Date(b.published_at) - new Date(a.published_at);
      case 'reliability':
        return (b.reliabilityScore || 0) - (a.reliabilityScore || 0);
      case 'sentiment':
        return (b.sentiment === 'positive' ? 1 : b.sentiment === 'negative' ? -1 : 0) -
               (a.sentiment === 'positive' ? 1 : a.sentiment === 'negative' ? -1 : 0);
      case 'severity':
        return (b.severityScore || 0) - (a.severityScore || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="news-container">
      <DataView
        value={filteredArticles}
        itemTemplate={itemTemplate}
        header={renderHeader()}
        paginator
        rows={9}
        layout="grid"
      />
      
      <Dialog
        visible={!!selectedArticle}
        onHide={() => setSelectedArticle(null)}
        header={selectedArticle?.title}
        style={{ width: '90vw', maxWidth: '1200px' }}
        maximizable
      >
        {selectedArticle && (
          <div className="article-content">
            <div className="flex flex-column gap-4 mb-4">
              <div className="flex gap-2 flex-wrap">
                <Badge value={selectedArticle.category} severity="info" />
                <Badge value={selectedArticle.sentiment} severity={getSentimentColor(selectedArticle.sentiment)} />
                {selectedArticle.themes?.map((theme, index) => (
                  <Badge key={index} value={theme} severity="warning" />
                ))}
              </div>

              <div className="flex flex-column gap-2 text-sm">
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-calendar text-500"></i>
                  <span className="text-500">{formatDate(selectedArticle.published_at)}</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-globe text-500"></i>
                  <span className="text-500">{selectedArticle.source}</span>
                </div>
                <div className="flex align-items-center gap-2">
                  <i className="pi pi-external-link text-500"></i>
                  <a 
                    href={selectedArticle.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Original Article
                  </a>
                </div>
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: processedContent.html }} />
            
            {processedContent.locations.length > 0 && (
              <div className="locations-section mt-4 p-3 surface-ground border-round">
                <h3 className="text-xl mb-2">Mentioned Locations</h3>
                <p>{getLocationSummary(processedContent.locations)}</p>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default News;
