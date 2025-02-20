import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { NEWS_CATEGORIES } from '@/constants/categories';

const CategoryDetails = ({ selectedGroup }) => {
  if (selectedGroup === 'all' || !selectedGroup) return null;

  const category = Object.values(NEWS_CATEGORIES).find(cat => cat.id === selectedGroup);
  if (!category) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'high':
        return 'High Impact';
      case 'medium':
        return 'Medium Impact';
      case 'low':
        return 'Low Impact';
      default:
        return 'Info';
    }
  };

  return (
    <Card className="mt-2 category-details surface-ground" data-testid="category-details">
      <div className="text-xl font-bold mb-2">
        {category.label}
      </div>
      <div className="text-500 mb-3">
        {category.description}
      </div>
      <div className="grid">
        {Object.values(category.subcategories).map(sub => (
          <div key={sub.id} className="col-12 md:col-6">
            <div className={`surface-card p-3 border-round shadow-1 h-full ${sub.severity}-severity`}>
              <div className="flex align-items-center justify-content-between mb-2">
                <span className="text-lg font-medium">{sub.label}</span>
                <Tag 
                  value={getSeverityLabel(sub.severity)}
                  severity={getSeverityColor(sub.severity)}
                  className="text-xs"
                />
              </div>
              <div className="text-500">
                {sub.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

CategoryDetails.propTypes = {
  selectedGroup: PropTypes.string
};

export default CategoryDetails;
