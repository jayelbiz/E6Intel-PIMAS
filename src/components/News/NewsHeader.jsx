import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import CategoryFilter from './CategoryFilter';

const NewsHeader = ({ 
  filters, 
  setFilters, 
  viewMode, 
  setViewMode, 
  viewOptions 
}) => {
  const viewOptionTemplate = (option) => {
    return <i className={option.icon} />;
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category
    }));
  };

  return (
    <div className="flex justify-content-between align-items-center mb-3" data-testid="news-header">
      <div className="flex gap-2">
        <span className="p-input-icon-left w-20rem">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search articles..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full"
            data-testid="search-input"
          />
        </span>
        <CategoryFilter
          selectedCategory={filters.category}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      <SelectButton
        value={viewMode}
        options={viewOptions}
        onChange={(e) => setViewMode(e.value)}
        itemTemplate={viewOptionTemplate}
        className="p-buttonset-sm"
        data-testid="view-mode-selector"
      />
    </div>
  );
};

NewsHeader.propTypes = {
  filters: PropTypes.shape({
    category: PropTypes.shape({
      group: PropTypes.string.isRequired,
      subcategory: PropTypes.string.isRequired
    }).isRequired,
    search: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  setViewMode: PropTypes.func.isRequired,
  viewOptions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired
};

export default NewsHeader;
