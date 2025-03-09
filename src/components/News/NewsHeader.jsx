import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import CategoryFilter from './CategoryFilter';
import '@/styles/animations.css';

const NewsHeader = ({ 
  filters, 
  setFilters, 
  viewMode, 
  setViewMode, 
  viewOptions 
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  
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
    <div className="flex flex-column md:flex-row justify-content-between align-items-center mb-4 gap-3" data-testid="news-header">
      <div className="flex flex-column md:flex-row gap-3 w-full md:w-auto">
        <span className={`p-input-icon-left transition-all transition-duration-300 ${searchFocused ? 'w-full md:w-25rem' : 'w-full md:w-20rem'}`}>
          <i className="pi pi-search" />
          <InputText
            placeholder="Search articles..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full shadow-2 transition-all transition-duration-300 hover:shadow-3 focus:shadow-4"
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
        className="p-buttonset-sm shadow-1 hover:shadow-2 transition-all transition-duration-300"
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
