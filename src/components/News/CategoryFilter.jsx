import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { NEWS_CATEGORIES } from '@/constants/categories';
import CategoryDetails from './CategoryDetails';
import '@/styles/animations.css';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [op] = useState(React.createRef());

  const handleGroupChange = (e) => {
    setSelectedGroup(e.value);
    onCategoryChange({ group: e.value, subcategory: 'all' });
  };

  const handleSubcategoryChange = (e) => {
    onCategoryChange({ group: selectedGroup, subcategory: e.value });
  };

  const groupOptions = [
    { label: 'All Categories', value: 'all' },
    ...Object.values(NEWS_CATEGORIES).map(category => ({
      label: category.label,
      value: category.id,
      color: category.color || 'var(--primary-color)'
    }))
  ];

  const getSubcategoryOptions = () => {
    if (selectedGroup === 'all') return [];
    
    const category = NEWS_CATEGORIES[Object.keys(NEWS_CATEGORIES).find(key => 
      NEWS_CATEGORIES[key].id === selectedGroup
    )];
    
    if (!category) return [];

    return [
      { label: `All ${category.label}`, value: 'all' },
      ...Object.values(category.subcategories).map(sub => ({
        label: sub.label,
        value: sub.id,
        description: sub.description,
        color: sub.color || category.color || 'var(--primary-color)'
      }))
    ];
  };

  const subcategoryOptions = getSubcategoryOptions();
  const selectedSubcategory = selectedCategory.subcategory || 'all';

  const groupItemTemplate = (option) => {
    if (option.value === 'all') return option.label;
    return (
      <div className="flex align-items-center gap-2 py-1">
        {option.color && (
          <span className="w-1rem h-1rem border-circle" style={{ backgroundColor: option.color }}></span>
        )}
        <span className="font-medium">{option.label}</span>
        {option.value !== 'all' && (
          <Button
            icon="pi pi-info-circle"
            className="p-button-text p-button-rounded p-button-sm ml-auto hover:bg-primary-50 transition-colors transition-duration-200"
            onClick={(e) => {
              op.current.toggle(e);
              e.stopPropagation();
            }}
          />
        )}
      </div>
    );
  };

  const subcategoryItemTemplate = (option) => (
    <div className="flex flex-column gap-1 py-1 hover:bg-primary-50 transition-colors transition-duration-200">
      <div className="flex align-items-center gap-2">
        {option.color && (
          <span className="w-0.5rem h-0.5rem border-circle" style={{ backgroundColor: option.color }}></span>
        )}
        <span className="font-medium">{option.label}</span>
      </div>
      {option.description && (
        <small className="text-600 pl-2">{option.description}</small>
      )}
    </div>
  );

  const selectedItemTemplate = (option, props) => {
    if (!option) return props.placeholder;
    
    if (option.value === 'all') {
      return <span className="font-medium">{option.label}</span>;
    }
    
    return (
      <div className="flex align-items-center gap-2">
        {option.color && (
          <span className="w-0.75rem h-0.75rem border-circle" style={{ backgroundColor: option.color }}></span>
        )}
        <span className="font-medium">{option.label}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-column gap-2" data-testid="category-filter">
      <div className="flex flex-column md:flex-row gap-2">
        <Dropdown
          value={selectedGroup}
          options={groupOptions}
          onChange={handleGroupChange}
          placeholder="Select Category"
          className="w-full md:w-15rem shadow-2 hover:shadow-3 transition-all transition-duration-300"
          itemTemplate={groupItemTemplate}
          valueTemplate={selectedItemTemplate}
          data-testid="category-group-dropdown"
          pt={{
            item: { className: 'hover:surface-hover transition-colors transition-duration-200' }
          }}
        />
        {selectedGroup !== 'all' && (
          <Dropdown
            value={selectedSubcategory}
            options={subcategoryOptions}
            onChange={handleSubcategoryChange}
            placeholder="Select Subcategory"
            className="w-full md:w-15rem shadow-2 hover:shadow-3 transition-all transition-duration-300"
            itemTemplate={subcategoryItemTemplate}
            valueTemplate={selectedItemTemplate}
            data-testid="category-subcategory-dropdown"
            pt={{
              item: { className: 'hover:surface-hover transition-colors transition-duration-200' }
            }}
          />
        )}
      </div>

      <OverlayPanel ref={op} showCloseIcon className="shadow-4">
        <CategoryDetails selectedGroup={selectedGroup} />
      </OverlayPanel>
    </div>
  );
};

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.shape({
    group: PropTypes.string.isRequired,
    subcategory: PropTypes.string.isRequired
  }).isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default CategoryFilter;
