import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { calculateReadingTime, formatShortDate } from '@/utils/contentProcessor';
import '@/styles/animations.css';

const ArticleCard = ({ article, viewMode, onArticleSelect, renderAuthor, getSentimentColor }) => {
  const readingTime = calculateReadingTime(article.content);
  
  const handleImageError = (e) => {
    e.target.src = '/assets/images/placeholder-article.png';
    e.target.onerror = null;
  };

  if (viewMode === 'list') {
    return (
      <div className="col-12 p-1" data-testid="article-list-item">
        <Card 
          className="surface-card shadow-2 list-view hover:shadow-4 transition-all transition-duration-300" 
          pt={{ root: { className: 'p-3' }}}
        >
          <div className="flex gap-3">
            {article.image_url && (
              <img 
                src={article.image_url} 
                alt={article.title}
                className="border-round-lg cursor-pointer"
                style={{ 
                  width: '180px',
                  height: '120px',
                  objectFit: 'cover'
                }}
                onError={handleImageError}
                data-testid="article-image"
                onClick={() => onArticleSelect(article)}
              />
            )}
            <div className="flex-1 flex flex-column gap-2">
              <div className="flex-1">
                <div 
                  className="text-xl font-bold text-900 line-clamp-2 mb-2 hover:text-primary transition-colors transition-duration-200 cursor-pointer" 
                  data-testid="article-title"
                  onClick={() => onArticleSelect(article)}
                >
                  {article.title}
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-600 mb-2" data-testid="article-metadata">
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
                <p className="line-clamp-2 text-600 text-sm" data-testid="article-summary">
                  {article.summary || article.content.substring(0, 200)}
                </p>
              </div>

              <div className="flex justify-content-between align-items-center pt-2 mt-2">
                <div className="flex flex-wrap gap-2">
                  {article.sentiment && (
                    <Badge 
                      value={article.sentiment.toUpperCase()} 
                      severity={getSentimentColor(article.sentiment)} 
                      className="font-semibold"
                      data-testid="sentiment-badge"
                    />
                  )}
                </div>
                <Button 
                  label="Read More" 
                  icon="pi pi-arrow-right" 
                  className="p-button-rounded p-button-outlined p-button-sm"
                  onClick={() => onArticleSelect(article)}
                  data-testid="read-more-button"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="col-12 md:col-6 lg:col-4 p-2" data-testid="article-grid-item">
      <Card 
        className="shadow-2 border-round-xl border-none h-full grid-view hover:shadow-4 transition-all transition-duration-300"
        pt={{ 
          body: { className: 'p-0' },
          content: { className: 'p-0' }
        }}
      >
        <div className="image-container relative">
          <img 
            src={article.image_url || '/assets/images/placeholder-article.png'} 
            alt={article.title}
            className="w-full h-12rem border-round-top-xl object-cover cursor-pointer"
            onError={handleImageError}
            data-testid="article-image"
            onClick={() => onArticleSelect(article)}
          />
          {article.sentiment && (
            <Badge 
              value={article.sentiment.toUpperCase()} 
              severity={getSentimentColor(article.sentiment)} 
              className="absolute top-0 right-0 m-2 font-semibold"
              data-testid="sentiment-badge"
            />
          )}
        </div>
        <div className="p-3">
          <div 
            className="text-xl font-bold text-900 mb-2 line-clamp-2 hover:text-primary transition-colors transition-duration-200 cursor-pointer" 
            data-testid="article-title"
            onClick={() => onArticleSelect(article)}
          >
            {article.title}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-600 mb-3" data-testid="article-metadata">
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
          <p className="text-sm text-600 line-clamp-3 mb-3" data-testid="article-summary">
            {article.summary || article.content.substring(0, 200)}
          </p>
          <div className="flex justify-content-end">
            <Button 
              label="Read More" 
              icon="pi pi-arrow-right" 
              className="p-button-rounded p-button-outlined p-button-sm"
              onClick={() => onArticleSelect(article)}
              data-testid="read-more-button"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

ArticleCard.propTypes = {
  article: PropTypes.object.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onArticleSelect: PropTypes.func.isRequired,
  renderAuthor: PropTypes.func.isRequired,
  getSentimentColor: PropTypes.func.isRequired
};

export default ArticleCard;
