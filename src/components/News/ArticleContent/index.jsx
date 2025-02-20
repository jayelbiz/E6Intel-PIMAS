import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from 'primereact/dialog';
import { getCategoryHierarchy } from '@/constants/categories';
import { calculateReadingTime, stripHtml, formatDate } from '@/utils/contentProcessor';

import ArticleHeader from './ArticleHeader';
import ArticleFooter from './ArticleFooter';
import ArticleMetadata from './ArticleMetadata';
import AiInsights from './AiInsights';

const ArticleContent = ({ article, visible, onHide }) => {
  const [showAiInsights, setShowAiInsights] = useState(false);
  const contentRef = useRef(null);
  
  if (!article) return null;

  const category = getCategoryHierarchy(article.category);
  const readingTime = calculateReadingTime(article.content);
  
  // Process article content
  const processContent = useCallback((content) => {
    if (!content) return [];
    const cleanContent = stripHtml(content);
    return cleanContent
      .split('\n')
      .filter(para => para.trim().length > 0)
      .map(para => para.trim());
  }, []);

  const paragraphs = processContent(article.content);

  // Mock AI analysis data (replace with real API call)
  const mockAnalysis = {
    sentiment: {
      positive: 75,
      neutral: 20,
      negative: 5
    },
    themes: ['Economy', 'Politics', 'Technology'],
    bias: {
      detected: true,
      label: 'Potential Bias Detected',
      description: 'This article may contain biased language or perspective.'
    }
  };

  const handleSave = useCallback(() => {
    // Implement save functionality
    console.log('Saving article:', article.title);
  }, [article.title]);

  const handleShare = useCallback(() => {
    // Implement share functionality
    console.log('Sharing article:', article.title);
  }, [article.title]);

  const toggleAiInsights = useCallback(() => {
    setShowAiInsights(prev => !prev);
  }, []);

  // Reset scroll position when modal opens
  const onShow = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <Dialog
      header={
        <ArticleHeader
          title={article.title}
          showAiInsights={showAiInsights}
          onToggleInsights={toggleAiInsights}
        />
      }
      visible={visible}
      onHide={onHide}
      onShow={onShow}
      footer={
        <ArticleFooter
          readingTime={readingTime}
          url={article.url}
          onSave={handleSave}
          onShare={handleShare}
        />
      }
      className="article-dialog"
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
      style={{ width: '60vw' }}
      maximizable
    >
      <div ref={contentRef} className="article-content">
        {/* Article Metadata */}
        <ArticleMetadata
          publishedAt={article.publishedAt}
          author={article.author}
          source={article.source}
          category={category}
        />

        {/* Article Image */}
        {article.urlToImage && (
          <div className="mb-4 article-image-container">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full border-round"
              loading="lazy"
            />
            {article.source?.name && (
              <div className="image-source">
                Source: {article.source.name}
              </div>
            )}
          </div>
        )}

        {/* Article Description */}
        {article.description && (
          <div className="mb-4">
            <p className="text-xl line-height-3 font-medium text-primary">
              {article.description}
            </p>
          </div>
        )}

        {/* Article Content */}
        <div className="article-body">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="line-height-3 mb-3">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="p-3 surface-ground border-round">
              <p className="text-500 m-0">
                Full article content is available at the source. Click "Read Full Article" to view.
              </p>
            </div>
          )}
        </div>

        {/* Source Attribution */}
        <div className="mt-4 pt-3 border-top-1 surface-border">
          <div className="flex justify-content-between align-items-center">
            <small className="text-500">
              {article.source?.name ? `Source: ${article.source.name}` : 'Source not available'}
            </small>
            <small className="text-500">
              Last updated: {formatDate(article.updatedAt || article.publishedAt)}
            </small>
          </div>
        </div>

        {/* AI Insights at the bottom */}
        <AiInsights visible={showAiInsights} analysis={mockAnalysis} />
      </div>
    </Dialog>
  );
};

ArticleContent.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    content: PropTypes.string,
    url: PropTypes.string,
    urlToImage: PropTypes.string,
    publishedAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    author: PropTypes.string,
    source: PropTypes.shape({
      name: PropTypes.string
    }),
    category: PropTypes.string
  }),
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired
};

export default ArticleContent;
