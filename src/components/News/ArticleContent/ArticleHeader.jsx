import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';

const ArticleHeader = ({ title, showAiInsights, onToggleInsights }) => {
  const scrollToAnalysis = () => {
    const analysisSection = document.getElementById('ai-analysis-section');
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: 'smooth' });
      if (!showAiInsights) {
        onToggleInsights();
      }
    }
  };

  return (
    <div className="flex align-items-center justify-content-between w-full">
      <h2 className="text-xl font-bold m-0 pr-4">{title}</h2>
      <div className="flex align-items-center gap-2">
        <Button
          icon="pi pi-chart-bar"
          className="p-button-text p-button-rounded"
          tooltip="Jump to Analysis"
          onClick={scrollToAnalysis}
        />
        <Button
          icon={showAiInsights ? "pi pi-minus-circle" : "pi pi-plus-circle"}
          className="p-button-text p-button-rounded"
          tooltip={showAiInsights ? "Hide AI Insights" : "Show AI Insights"}
          onClick={onToggleInsights}
        />
      </div>
    </div>
  );
};

ArticleHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showAiInsights: PropTypes.bool.isRequired,
  onToggleInsights: PropTypes.func.isRequired
};

export default ArticleHeader;
