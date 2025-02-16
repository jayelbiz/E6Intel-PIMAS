import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
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

const News = () => {
  document.title = "News | E6Intel PIMAS";
  
  const { articles, loading, categories, error } = useNews();
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

  const renderHeader = () => {
    return (
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
  };

  const itemTemplate = (article) => {
    return (
      <div className="col-12 md:col-6 lg:col-4 p-2">
        <Card className="h-full surface-card shadow-2">
          <div className="flex flex-column gap-3">
            <div className="text-xl font-bold text-900">{article.title}</div>
            <div className="text-500">{article.summary}</div>
            <div className="flex align-items-center gap-2">
              <i className="pi pi-calendar text-500"></i>
              <span className="text-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
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
  };

  useEffect(() => {
    if (selectedArticle) {
      const { html, locations } = processContent(selectedArticle.content);
      setProcessedContent({ html, locations });
    }
  }, [selectedArticle]);

  if (loading) return <LoadingState />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

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
        return new Date(b.publishedAt) - new Date(a.publishedAt);
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
    <div className="flex flex-column gap-4">
      {renderHeader()}
      <DataView
        value={filteredArticles}
        itemTemplate={itemTemplate}
        layout="grid"
        loading={loading}
        emptyMessage="No articles found"
      />
      <Dialog
        visible={!!selectedArticle}
        onHide={() => setSelectedArticle(null)}
        header={selectedArticle?.title}
        style={{ width: '90vw', maxWidth: '800px' }}
        maximizable
      >
        {selectedArticle && (
          <div className="article-content">
            <div className="flex gap-3 mb-4">
              <Badge value={selectedArticle.category} severity="info" />
              <span className="text-sm text-500">
                {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </span>
              <span className="text-sm text-600">{selectedArticle.source}</span>
            </div>
            {processedContent.locations.length > 0 && (
              <div className="mb-4 p-3 surface-ground border-round">
                <strong>Locations:</strong> {getLocationSummary(processedContent.locations)}
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: processedContent.html }} />
          </div>
        )}
      </Dialog>
    </div>
  );
};

const getCategorySeverity = (category) => {
  const severityMap = {
    'Geopolitical': 'info',
    'Security Alerts': 'danger',
    'Natural Disasters': 'warning',
    'Social Movements': 'success',
    'Financial & Economic': 'info'
  };
  return severityMap[category] || 'info';
};

export default News;
