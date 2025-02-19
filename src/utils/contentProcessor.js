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
