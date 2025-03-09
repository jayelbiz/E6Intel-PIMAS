import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { NEWS_CATEGORIES } from '@/constants/categories';
import '@/styles/animations.css';

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

  const categoryColor = category.color || 'var(--primary-color)';

  return (
    <Card 
      className="mt-2 category-details shadow-3 border-round-xl" 
      data-testid="category-details"
      pt={{
        content: { className: 'p-4' },
        body: { className: 'p-0' }
      }}
    >
      <div className="flex align-items-center gap-2 mb-2">
        <div 
          className="w-1rem h-1rem border-circle flex-shrink-0" 
          style={{ backgroundColor: categoryColor }}
        ></div>
        <div className="text-xl font-bold">
          {category.label}
        </div>
      </div>
      
      <div className="text-600 mb-3 line-height-3 p-2 surface-ground border-round">
        {category.description}
      </div>
      
      <Divider className="my-3" />
      
      <div className="grid">
        {Object.values(category.subcategories).map(sub => (
          <div key={sub.id} className="col-12 md:col-6 p-2">
            <div 
              className="surface-card p-3 border-round shadow-2 h-full hover:shadow-4 transition-shadow transition-duration-300"
              style={{ borderLeft: `4px solid ${sub.color || categoryColor}` }}
            >
              <div className="flex align-items-center justify-content-between mb-2">
                <div className="flex align-items-center gap-2">
                  <span 
                    className="w-0.5rem h-0.5rem border-circle flex-shrink-0" 
                    style={{ backgroundColor: sub.color || categoryColor }}
                  ></span>
                  <span className="text-lg font-medium">{sub.label}</span>
                </div>
                <Tag 
                  value={getSeverityLabel(sub.severity)}
                  severity={getSeverityColor(sub.severity)}
                  className="text-xs font-medium"
                />
              </div>
              <div className="text-600 line-height-3 p-1">
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
