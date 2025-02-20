import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';

const ArticleFooter = ({ readingTime, url, onSave, onShare }) => {
  return (
    <div className="flex justify-content-between align-items-center">
      <div className="flex gap-2 align-items-center">
        <span className="text-500">
          {readingTime} min read
        </span>
        <Button
          icon="pi pi-bookmark"
          className="p-button-text p-button-rounded"
          onClick={onSave}
          tooltip="Save Article"
        />
        <Button
          icon="pi pi-share-alt"
          className="p-button-text p-button-rounded"
          onClick={onShare}
          tooltip="Share Article"
        />
      </div>
      <Button
        label="Read Full Article"
        icon="pi pi-external-link"
        className="p-button-text"
        onClick={() => window.open(url, '_blank')}
      />
    </div>
  );
};

ArticleFooter.propTypes = {
  readingTime: PropTypes.number.isRequired,
  url: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired
};

export default ArticleFooter;
