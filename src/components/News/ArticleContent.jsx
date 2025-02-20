import React from 'react';
import PropTypes from 'prop-types';

const ArticleContent = ({ content }) => {
  return (
    <div 
      className="article-content" 
      dangerouslySetInnerHTML={{ __html: content }}
      data-testid="article-content"
    />
  );
};

ArticleContent.propTypes = {
  content: PropTypes.string.isRequired
};

export default ArticleContent;
