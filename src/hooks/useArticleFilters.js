import { useState, useMemo } from 'react';

export const useArticleFilters = (articles) => {
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'recent',
    search: ''
  });

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // Category filter
      if (filters.category !== 'all' && article.category?.toLowerCase() !== filters.category) {
        return false;
      }
      
      // Search filter
      if (filters.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [articles, filters.category, filters.search]);

  return {
    filters,
    setFilters,
    filteredArticles
  };
};

export default useArticleFilters;
