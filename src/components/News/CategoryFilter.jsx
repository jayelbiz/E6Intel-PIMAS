import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { NEWS_CATEGORIES } from '@/constants/categories';
import CategoryDetails from './CategoryDetails';

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
      value: category.id
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
        description: sub.description
      }))
    ];
  };

  const subcategoryOptions = getSubcategoryOptions();
  const selectedSubcategory = selectedCategory.subcategory || 'all';

  const groupItemTemplate = (option) => {
    if (option.value === 'all') return option.label;
    return (
      <div className="flex align-items-center">
        <span>{option.label}</span>
        {option.value !== 'all' && (
          <Button
            icon="pi pi-info-circle"
            className="p-button-text p-button-rounded p-button-sm ml-2"
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
    <div className="flex flex-column">
      <span>{option.label}</span>
      {option.description && (
        <small className="text-500">{option.description}</small>
      )}
    </div>
  );

  return (
    <div className="flex flex-column gap-2" data-testid="category-filter">
      <div className="flex gap-2">
        <Dropdown
          value={selectedGroup}
          options={groupOptions}
          onChange={handleGroupChange}
          placeholder="Select Category Group"
          className="w-15rem"
          itemTemplate={groupItemTemplate}
          data-testid="category-group-dropdown"
        />
        {selectedGroup !== 'all' && (
          <Dropdown
            value={selectedSubcategory}
            options={subcategoryOptions}
            onChange={handleSubcategoryChange}
            placeholder="Select Subcategory"
            className="w-15rem"
            itemTemplate={subcategoryItemTemplate}
            data-testid="category-subcategory-dropdown"
          />
        )}
      </div>

      <OverlayPanel ref={op} showCloseIcon>
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
