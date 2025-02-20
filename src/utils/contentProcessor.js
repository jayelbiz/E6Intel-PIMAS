// List of major cities and their coordinates
const majorCities = {
    'new york': { lat: 40.7128, lng: -74.0060, country: 'USA' },
    'london': { lat: 51.5074, lng: -0.1278, country: 'UK' },
    'paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
    'tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan' },
    'beijing': { lat: 39.9042, lng: 116.4074, country: 'China' },
    'moscow': { lat: 55.7558, lng: 37.6173, country: 'Russia' },
    // Add more cities as needed
};

// Regular expressions for location detection
const cityRegex = new RegExp(Object.keys(majorCities).join('|'), 'gi');

// Regular expressions for content styling
const headingRegex = /^(#{1,6})\s+(.+)$/gm;
const listRegex = /^[-*]\s+(.+)$/gm;
const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
const codeRegex = /`([^`]+)`/g;
const emphasisRegex = /\*\*([^*]+)\*\*/g;
const italicRegex = /\_([^_]+)\_/g;

export const processContent = (content) => {
    if (!content) return { html: '', locations: [] };

    // Extract locations
    const locations = [];
    const foundCities = new Set();

    // Find cities
    const cityMatches = content.match(cityRegex) || [];
    cityMatches.forEach(match => {
        const city = match.toLowerCase();
        if (!foundCities.has(city)) {
            foundCities.add(city);
            locations.push({
                type: 'city',
                name: match,
                coordinates: majorCities[city],
                country: majorCities[city].country
            });
        }
    });

    // Process markdown-style formatting
    let html = content
        .replace(headingRegex, (_, level, text) => `<h${level.length}>${text}</h${level.length}>`)
        .replace(listRegex, '<li>$1</li>')
        .replace(linkRegex, '<a href="$2">$1</a>')
        .replace(codeRegex, '<code>$1</code>')
        .replace(emphasisRegex, '<strong>$1</strong>')
        .replace(italicRegex, '<em>$1</em>');

    // Wrap lists in <ul> tags
    html = html.replace(/(<li>.*?<\/li>)+/g, match => `<ul>${match}</ul>`);

    return {
        html,
        locations
    };
};

export const getLocationSummary = (locations) => {
    if (!locations || locations.length === 0) return '';

    const locationStrings = locations.map(loc => {
        if (loc.type === 'city') {
            return `${loc.name}, ${loc.country}`;
        }
        return loc.name;
    });

    return locationStrings.join('; ');
};

/**
 * Utility functions for processing content
 */

/**
 * Format a date string into a readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Calculate estimated reading time for content
 * @param {string} content - Article content
 * @returns {number} Estimated reading time in minutes
 */
export const calculateReadingTime = (content) => {
  if (!content) return 1;
  
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return Math.max(1, readingTime);
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

/**
 * Clean HTML content from text
 * @param {string} html - HTML content
 * @returns {string} Clean text
 */
export const stripHtml = (html) => {
  if (!html) return '';
  
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Format a short date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted short date string
 */
export const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // If less than 60 minutes ago
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  // If less than 24 hours ago
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  // If less than 7 days ago
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  // Otherwise show short date
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};
