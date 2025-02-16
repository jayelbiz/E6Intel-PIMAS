import React, { useState } from 'react';
import { Container } from "reactstrap";
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNews } from '@/contexts/NewsContext';

const LoadingState = () => (
  <div className="card flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <ProgressSpinner />
  </div>
);

const News = () => {
  document.title = "News | E6Intel PIMAS";
  
  const { articles, loading, categories, error } = useNews();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'recent',
    search: ''
  });

  const sortOptions = [
    { label: 'Most Recent', value: 'recent' },
    { label: 'Reliability Score', value: 'reliability' },
    { label: 'Sentiment Score', value: 'sentiment' },
    { label: 'Event Severity', value: 'severity' }
  ];

  const getFilteredArticles = () => {
    if (!articles) return [];
    
    return articles.filter(article => {
      const matchesCategory = filters.category === 'all' || 
        article.category.toLowerCase() === filters.category;
      
      const matchesSearch = !filters.search ||
        article.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        article.summary.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'recent':
          return new Date(b.published_at) - new Date(a.published_at);
        case 'reliability':
          return (b.reliability_score || 0) - (a.reliability_score || 0);
        case 'sentiment':
          return (b.sentiment === 'positive' ? 1 : b.sentiment === 'negative' ? -1 : 0) -
                 (a.sentiment === 'positive' ? 1 : a.sentiment === 'negative' ? -1 : 0);
        case 'severity':
          return (b.severity_score || 0) - (a.severity_score || 0);
        default:
          return 0;
      }
    });
  };

  const renderHeader = () => {
    return (
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex align-items-center gap-2">
          <span className="p-input-icon-left flex-grow-1">
            <i className="pi pi-search" />
            <InputText
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search articles..."
              className="w-100"
            />
          </span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Dropdown
            value={filters.category}
            options={[
              { label: 'All Categories', value: 'all' },
              ...(categories || []).map(cat => ({ label: cat, value: cat.toLowerCase() }))
            ]}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.value }))}
            className="w-200px"
          />
          <Dropdown
            value={filters.sortBy}
            options={sortOptions}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.value }))}
            className="w-200px"
          />
        </div>
      </div>
    );
  };

  const renderArticleCard = (article) => {
    return (
      <div className="col-12 col-md-6 col-lg-4 p-2">
        <Card className="h-100 cursor-pointer hover-lift" onClick={() => setSelectedArticle(article)}>
          {article.image_url && (
            <img
              src={article.image_url}
              alt=""
              className="w-100 card-img-top"
              style={{ height: '200px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          )}
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <Badge value={article.category} severity={getCategorySeverity(article.category)} />
              <small className="text-muted ms-auto">
                {new Date(article.published_at).toLocaleString()}
              </small>
            </div>
            <h5 className="card-title mb-2">{article.title}</h5>
            <p className="card-text text-truncate-2">{article.summary}</p>
            <div className="d-flex align-items-center mt-2">
              <small className="text-muted">{article.source}</small>
            </div>
            
            {/* AI Analysis Preview */}
            <div className="mt-3 pt-3 border-top">
              <div className="d-flex align-items-center gap-2">
                <i className="pi pi-chart-bar text-primary" />
                <small>AI Analysis Available</small>
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  size="small"
                  className="ms-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArticle(article);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const getCategorySeverity = (category) => {
    switch (category?.toLowerCase()) {
      case 'security alerts':
        return 'danger';
      case 'natural disasters':
        return 'warning';
      case 'geopolitical':
        return 'info';
      case 'social movements':
        return 'success';
      case 'financial & economic':
        return 'primary';
      default:
        return 'info';
    }
  };

  if (error) {
    return (
      <div className="page-content">
        <Container fluid>
          <Card>
            <div className="p-4 text-center">
              <i className="pi pi-exclamation-triangle text-danger" style={{ fontSize: '2rem' }} />
              <h5 className="mt-3">Error Loading News</h5>
              <p>{error}</p>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page title */}
        <div className="page-title-box">
          <h4 className="mb-0">Intelligence News</h4>
        </div>

        {/* Content */}
        <Card>
          <TabView>
            <TabPanel header="All News">
              <DataView
                value={getFilteredArticles()}
                layout="grid"
                header={renderHeader()}
                itemTemplate={renderArticleCard}
                paginator
                rows={9}
                loading={loading}
                loadingTemplate={() => <LoadingState />}
                emptyMessage={
                  <div className="p-4 text-center">
                    <i className="pi pi-search" style={{ fontSize: '2rem' }} />
                    <p className="mt-3">No articles found matching your criteria</p>
                  </div>
                }
              />
            </TabPanel>
            <TabPanel header="Saved">
              <div className="p-3">
                <h5>Saved Articles</h5>
                <p>Your saved articles will appear here.</p>
              </div>
            </TabPanel>
          </TabView>
        </Card>

        {/* Article Dialog */}
        <Dialog
          visible={!!selectedArticle}
          onHide={() => setSelectedArticle(null)}
          header={selectedArticle?.title}
          style={{ width: '90vw', maxWidth: '1200px' }}
          maximizable
        >
          {selectedArticle && (
            <div className="row">
              <div className="col-md-8">
                {selectedArticle.image_url && (
                  <img
                    src={selectedArticle.image_url}
                    alt=""
                    className="w-100 mb-4"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                    }}
                  />
                )}
                <div className="article-content">
                  <p className="lead mb-4">{selectedArticle.summary}</p>
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                  <div className="mt-4">
                    <a href={selectedArticle.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Read Full Article
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <Card title="AI Analysis">
                  <div className="mb-3">
                    <h6>Sentiment</h6>
                    <Badge value={selectedArticle.sentiment} severity={selectedArticle.sentiment === 'positive' ? 'success' : selectedArticle.sentiment === 'negative' ? 'danger' : 'warning'} />
                  </div>
                  <div className="mb-3">
                    <h6>Bias Detection</h6>
                    <Badge value={selectedArticle.bias} severity="info" />
                  </div>
                  <div className="mb-3">
                    <h6>Key Themes</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedArticle.themes?.map((theme, i) => (
                        <Badge key={i} value={theme} />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Dialog>
      </Container>
    </div>
  );
};

export default News;
