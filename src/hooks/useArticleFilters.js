import { useState, useMemo } from 'react';
import { getCategoryHierarchy } from '@/constants/categories';

export const useArticleFilters = (articles) => {
  const [filters, setFilters] = useState({
    category: {
      group: 'all',
      subcategory: 'all'
    },
    sortBy: 'recent',
    search: ''
  });

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Category filter
      if (filters.category.group !== 'all') {
        const articleCategory = getCategoryHierarchy(article.category);
        if (!articleCategory) return false;

        if (filters.category.group !== articleCategory.group.id) {
          return false;
        }

        if (filters.category.subcategory !== 'all' && 
            filters.category.subcategory !== articleCategory.subcategory?.id) {
          return false;
        }
      }
      
      // Search filter
      if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [articles, filters.category.group, filters.category.subcategory, filters.search]);

  return {
    filters,
    setFilters,
    filteredArticles
  };
};

export default useArticleFilters;
