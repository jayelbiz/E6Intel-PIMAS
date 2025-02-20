import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { calculateReadingTime, formatShortDate } from '@/utils/contentProcessor';

const ArticleCard = ({ article, viewMode, onArticleSelect, renderAuthor, getSentimentColor }) => {
  const readingTime = calculateReadingTime(article.content);
  
  const handleImageError = (e) => {
    e.target.src = '/assets/images/placeholder-article.png';
    e.target.onerror = null;
  };

  if (viewMode === 'list') {
    return (
      <div className="col-12 p-1" data-testid="article-list-item">
        <Card className="surface-card shadow-1 list-view" pt={{ root: { className: 'p-2' }}}>
          <div className="flex gap-3">
            {article.image_url && (
              <img 
                src={article.image_url} 
                alt={article.title}
                className="border-round"
                style={{ 
                  width: '180px',
                  height: '120px',
                  objectFit: 'cover'
                }}
                onError={handleImageError}
                data-testid="article-image"
              />
            )}
            <div className="flex-1 flex flex-column gap-2">
              <div className="flex-1">
                <div className="text-xl font-bold text-900 line-clamp-1 mb-1" data-testid="article-title">
                  {article.title}
                </div>
                <div className="flex gap-2 text-xs text-500 mb-2" data-testid="article-metadata">
                  {renderAuthor(article.author, article.author_url)}
                  <span className="flex align-items-center gap-1">
                    <i className="pi pi-calendar"></i>
                    {formatShortDate(article.published_at)}
                  </span>
                  <span className="flex align-items-center gap-1">
                    <i className="pi pi-clock"></i>
                    {readingTime} min read
                  </span>
                </div>
                <div className="text-500 line-clamp-2 mb-2" data-testid="article-summary">
                  {article.summary}
                </div>
              </div>

              <div className="flex justify-content-between align-items-center">
                <div className="flex gap-2" data-testid="article-badges">
                  <Badge value={article.section} severity="info" size="small" />
                  <Badge value={article.sentiment} severity={getSentimentColor(article.sentiment)} size="small" />
                </div>
                <Button 
                  icon="pi pi-arrow-right"
                  label="Read"
                  className="p-button-text p-button-sm"
                  onClick={() => onArticleSelect(article)}
                  data-testid="read-article-button"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="col-12 md:col-6 lg:col-4 p-1" data-testid="article-grid-item">
      <Card className="h-full surface-card shadow-1" pt={{ root: { className: 'p-2' }}}>
        <div className="flex flex-column gap-2">
          {article.image_url && (
            <img 
              src={article.image_url} 
              alt={article.title}
              className="w-full border-round"
              style={{ 
                height: '140px',
                objectFit: 'cover',
                marginBottom: '0.5rem'
              }}
              onError={handleImageError}
              data-testid="article-image"
            />
          )}
          <div className="text-lg font-bold text-900 line-clamp-2 mb-1" data-testid="article-title">
            {article.title}
          </div>
          
          <div className="flex gap-2 text-xs text-500 mb-2" data-testid="article-metadata">
            {renderAuthor(article.author, article.author_url)}
            <span className="flex align-items-center gap-1">
              <i className="pi pi-calendar"></i>
              {formatShortDate(article.published_at)}
            </span>
            <span className="flex align-items-center gap-1">
              <i className="pi pi-clock"></i>
              {readingTime} min read
            </span>
          </div>

          <div className="text-sm text-500 line-clamp-2 mb-2" data-testid="article-summary">
            {article.summary}
          </div>
          
          <div className="flex justify-content-between align-items-center mt-auto">
            <div className="flex gap-2" data-testid="article-badges">
              <Badge value={article.section} severity="info" size="small" />
              <Badge value={article.sentiment} severity={getSentimentColor(article.sentiment)} size="small" />
            </div>
            <Button 
              icon="pi pi-arrow-right"
              label="Read"
              className="p-button-text p-button-sm"
              onClick={() => onArticleSelect(article)}
              data-testid="read-article-button"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    content: PropTypes.string,
    author: PropTypes.string,
    author_url: PropTypes.string,
    published_at: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    section: PropTypes.string,
    sentiment: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onArticleSelect: PropTypes.func.isRequired,
  renderAuthor: PropTypes.func.isRequired,
  getSentimentColor: PropTypes.func.isRequired
};

export default ArticleCard;
