import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { useNews } from '@/contexts/NewsContext';
import { processContent } from '@/utils/contentProcessor';
import ArticleCard from '@/components/News/ArticleCard';
import ArticleContent from '@/components/News/ArticleContent';
import NewsHeader from '@/components/News/NewsHeader';
import ErrorBoundary from '@/components/News/ErrorBoundary';
import { useArticleFilters } from '@/hooks/useArticleFilters';
import PropTypes from 'prop-types';
import '@/styles/news.scss';

const LoadingState = () => (
  <div className="card flex justify-content-center align-items-center min-h-screen" data-testid="loading-state">
    <ProgressSpinner />
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="card flex flex-column justify-content-center align-items-center min-h-screen gap-4" data-testid="error-state">
    <i className="pi pi-exclamation-circle text-6xl text-red-500"></i>
    <h2 className="text-xl font-bold text-900">{message}</h2>
    <Button label="Retry" icon="pi pi-refresh" onClick={onRetry} />
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
  const [processedContent, setProcessedContent] = useState({ html: '', locations: [] });
  const [viewMode, setViewMode] = useState('grid');
  
  const { filters, setFilters, filteredArticles } = useArticleFilters(articles);

  const viewOptions = [
    { icon: 'pi pi-th-large', value: 'grid' },
    { icon: 'pi pi-list', value: 'list' }
  ];

  useEffect(() => {
    if (selectedArticle) {
      const { html, locations } = processContent(selectedArticle.content);
      setProcessedContent({ html, locations });
    }
  }, [selectedArticle]);

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

        <Dialog
          visible={!!selectedArticle}
          onHide={() => setSelectedArticle(null)}
          header={selectedArticle?.title}
          style={{ width: '90vw', maxWidth: '900px' }}
          maximizable
          modal
          data-testid="article-dialog"
        >
          {selectedArticle && (
            <ArticleContent content={processedContent.html} />
          )}
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default News;
