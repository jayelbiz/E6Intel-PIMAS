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

  const renderArticleCard = (article) => {
    return (
      <div className="col-12 md:col-6 lg:col-4 p-3">
        <Card className="h-full">
          <div className="flex flex-column h-full">
            <div className="flex align-items-center gap-2 mb-3">
              <Badge value={article.category} severity={getCategorySeverity(article.category)} />
              <span className="text-sm text-500">{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <h3 className="text-xl font-bold mb-3">{article.title}</h3>
            <p className="line-clamp-3 mb-3 flex-grow-1">{article.summary}</p>
            <div className="flex justify-content-between align-items-center">
              <Button 
                label="Read More" 
                icon="pi pi-external-link" 
                onClick={() => setSelectedArticle(article)} 
                text
              />
              <span className="text-sm text-600">{article.source}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
        <div className="flex gap-3">
          <Dropdown
            value={filters.category}
            options={[{ label: 'All Categories', value: 'all' }, ...categories]}
            onChange={(e) => setFilters({ ...filters, category: e.value })}
            placeholder="Select Category"
          />
          <Dropdown
            value={filters.sortBy}
            options={[
              { label: 'Most Recent', value: 'recent' },
              { label: 'Reliability Score', value: 'reliability' },
              { label: 'Sentiment Score', value: 'sentiment' },
              { label: 'Severity', value: 'severity' }
            ]}
            onChange={(e) => setFilters({ ...filters, sortBy: e.value })}
            placeholder="Sort By"
          />
        </div>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search articles..."
          />
        </span>
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
      case 'recent':
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
    <div className="p-4">
      {renderHeader()}
      <DataView
        value={filteredArticles}
        itemTemplate={renderArticleCard}
        layout="grid"
        rows={9}
        paginator
      />
      <Dialog
        visible={!!selectedArticle}
        onHide={() => setSelectedArticle(null)}
        header={selectedArticle?.title}
        maximizable
        className="w-full md:w-8 lg:w-6"
      >
        {selectedArticle && (
          <div className="article-content">
            <div className="flex gap-3 mb-4">
              <Badge value={selectedArticle.category} severity={getCategorySeverity(selectedArticle.category)} />
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
