import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'primereact/tag';
import { formatDate } from '@/utils/contentProcessor';

const ArticleMetadata = ({ publishedAt, author, source, category }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Publication Date */}
      <div className="flex align-items-center gap-2">
        <i className="pi pi-calendar text-500"></i>
        <span className="text-500">{formatDate(publishedAt)}</span>
      </div>

      {/* Author */}
      {author && (
        <div className="flex align-items-center gap-2">
          <i className="pi pi-user text-500"></i>
          <span className="text-500">{author}</span>
        </div>
      )}

      {/* Source */}
      {source?.name && (
        <div className="flex align-items-center gap-2">
          <i className="pi pi-globe text-500"></i>
          <span className="text-500">{source.name}</span>
        </div>
      )}

      {/* Categories */}
      {category && (
        <div className="flex align-items-center gap-2">
          <Tag value={category.main} severity="info" />
          {category.sub && (
            <Tag value={category.sub} severity={category.severity || 'info'} />
          )}
        </div>
      )}
    </div>
  );
};

ArticleMetadata.propTypes = {
  publishedAt: PropTypes.string.isRequired,
  author: PropTypes.string,
  source: PropTypes.shape({
    name: PropTypes.string
  }),
  category: PropTypes.shape({
    main: PropTypes.string.isRequired,
    sub: PropTypes.string,
    severity: PropTypes.string
  })
};

export default ArticleMetadata;
