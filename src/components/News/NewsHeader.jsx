import React from 'react';
import PropTypes from 'prop-types';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';

const NewsHeader = ({ 
  filters, 
  setFilters, 
  viewMode, 
  setViewMode, 
  categories,
  viewOptions 
}) => {
  const viewOptionTemplate = (option) => {
    return <i className={option.icon} />;
  };

  return (
    <div className="flex justify-content-between align-items-center mb-3" data-testid="news-header">
      <div className="flex gap-2">
        <span className="p-input-icon-left w-20rem">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search articles..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full"
            data-testid="search-input"
          />
        </span>
        <Dropdown
          value={filters.category}
          options={[
            { label: 'All Categories', value: 'all' },
            ...categories.map(category => ({ 
              label: category, 
              value: category.toLowerCase() 
            }))
          ]}
          onChange={(e) => setFilters({...filters, category: e.value})}
          placeholder="Select Category"
          className="w-10rem"
          data-testid="category-dropdown"
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
    category: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  setViewMode: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  viewOptions: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired
};

export default NewsHeader;
