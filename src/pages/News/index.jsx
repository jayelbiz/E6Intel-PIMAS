import React, { useState, useCallback } from 'react';
import { DataView } from 'primereact/dataview';
import { useNews } from '@/contexts/NewsContext';
import ArticleCard from '@/components/News/ArticleCard';
import ArticleContent from '@/components/News/ArticleContent';
import NewsHeader from '@/components/News/NewsHeader';
import ErrorBoundary from '@/components/News/ErrorBoundary';
import { useArticleFilters } from '@/hooks/useArticleFilters';
import PropTypes from 'prop-types';
import '@/styles/news.scss';

const LoadingState = () => (
  <div className="card flex justify-content-center align-items-center min-h-screen" data-testid="loading-state">
    <i className="pi pi-spin pi-spinner text-4xl"></i>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="card flex flex-column justify-content-center align-items-center min-h-screen gap-4" data-testid="error-state">
    <i className="pi pi-exclamation-circle text-6xl text-red-500"></i>
    <h2 className="text-xl font-bold text-900">{message}</h2>
    <button className="p-button" onClick={onRetry}>
      <i className="pi pi-refresh mr-2"></i>
      Retry
    </button>
  </div>
);

ErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired
};

const News = () => {
  document.title = "News | E6Intel PIMAS";
  
  const { articles, loading, categories, error, refetch } = useNews();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const { filters, setFilters, filteredArticles } = useArticleFilters(articles);

  const viewOptions = [
    { icon: 'pi pi-th-large', value: 'grid' },
    { icon: 'pi pi-list', value: 'list' }
  ];

  const getSentimentColor = useCallback((sentiment) => {
    const colors = {
      positive: 'success',
      negative: 'danger',
      neutral: 'info'
    };
    return colors[sentiment] || 'info';
  }, []);

  const renderAuthor = useCallback((author, authorUrl) => {
    if (!author) return null;
    
    if (authorUrl) {
      return (
        <a 
          href={authorUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-color hover:text-primary transition-colors transition-duration-150"
          data-testid="author-link"
        >
          <span className="flex align-items-center gap-1">
            <i className="pi pi-user"></i>
            {author}
          </span>
        </a>
      );
    }

    return (
      <span className="flex align-items-center gap-1" data-testid="author-text">
        <i className="pi pi-user"></i>
        {author}
      </span>
    );
  }, []);

  const itemTemplate = useCallback((article) => (
    <ArticleCard
      article={article}
      viewMode={viewMode}
      onArticleSelect={setSelectedArticle}
      renderAuthor={renderAuthor}
      getSentimentColor={getSentimentColor}
    />
  ), [viewMode, renderAuthor, getSentimentColor]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <ErrorBoundary onRetry={refetch}>
      <div className="news-container" data-testid="news-container">
        <NewsHeader
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          categories={categories}
          viewOptions={viewOptions}
        />

        <DataView
          value={filteredArticles}
          itemTemplate={itemTemplate}
          layout={viewMode}
          rows={12}
          paginator
          emptyMessage="No articles found"
          className="p-0"
          data-testid="articles-grid"
        />

        {selectedArticle && (
          <ArticleContent 
            article={selectedArticle}
            visible={!!selectedArticle}
            onHide={() => setSelectedArticle(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default News;
