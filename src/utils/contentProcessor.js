import { countries } from 'countries-list';

// List of major cities and their coordinates
const majorCities = {
    'new york': { lat: 40.7128, lng: -74.0060 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'beijing': { lat: 39.9042, lng: 116.4074 },
    'moscow': { lat: 55.7558, lng: 37.6173 },
    // Add more cities as needed
};

// Regular expressions for location detection
const countryRegex = new RegExp(Object.keys(countries).join('|'), 'gi');
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
    const foundCountries = new Set();
    const foundCities = new Set();

    // Find countries
    const countryMatches = content.match(countryRegex) || [];
    countryMatches.forEach(match => {
        const country = match.toLowerCase();
        if (!foundCountries.has(country)) {
            foundCountries.add(country);
            locations.push({
                type: 'country',
                name: countries[country.toUpperCase()]?.name || match,
                code: country.toUpperCase()
            });
        }
    });

    // Find cities
    const cityMatches = content.match(cityRegex) || [];
    cityMatches.forEach(match => {
        const city = match.toLowerCase();
        if (!foundCities.has(city) && majorCities[city]) {
            foundCities.add(city);
            locations.push({
                type: 'city',
                name: match,
                coordinates: majorCities[city]
            });
        }
    });

    // Process content with enhanced styling
    let html = content
        // Convert markdown-style headings
        .replace(headingRegex, (_, level, text) => 
            `<h${level.length}>${text}</h${level.length}>`)
        
        // Convert markdown-style lists
        .replace(listRegex, '<li>$1</li>')
        .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
        
        // Convert markdown-style links
        .replace(linkRegex, '<a href="$2" class="external-link" target="_blank" rel="noopener noreferrer">$1</a>')
        
        // Convert inline code
        .replace(codeRegex, '<code>$1</code>')
        
        // Convert bold text
        .replace(emphasisRegex, '<strong>$1</strong>')
        
        // Convert italic text
        .replace(italicRegex, '<em>$1</em>')
        
        // Convert newlines to paragraphs
        .split('\n\n')
        .map(para => para.trim())
        .filter(para => para)
        .map(para => `<p>${para}</p>`)
        .join('')
        
        // Style quotes
        .replace(/"([^"]+)"/g, '<q class="styled-quote">$1</q>')
        
        // Highlight locations
        .replace(countryRegex, match => 
            `<span class="location-highlight country">${match}</span>`)
        .replace(cityRegex, match => 
            `<span class="location-highlight city">${match}</span>`)
        
        // Style numbers and statistics
        .replace(/(\d+(?:\.\d+)?%)/g, '<span class="statistic">$1</span>')
        .replace(/(\$\d+(?:\.\d+)?(?:[ ]?(?:billion|million|thousand))?)/gi, 
            '<span class="monetary">$1</span>')
        
        // Style dates
        .replace(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})/g, 
            '<span class="date">$1</span>')
        
        // Style organization names
        .replace(/([A-Z][A-Za-z]+ (?:Corporation|Inc\.|Ltd\.|LLC|Group|Organization))/g, 
            '<span class="organization">$1</span>')
        
        // Add paragraph spacing
        .replace(/<\/p><p>/g, '</p>\n<p>')
        
        // Style bullet points
        .replace(/•/g, '<span class="bullet-point">•</span>');

    return { html, locations };
};

export const getLocationSummary = (locations) => {
    if (!locations || locations.length === 0) return 'Location not specified';

    const summary = locations.map(loc => {
        if (loc.type === 'country') {
            return loc.name;
        } else if (loc.type === 'city') {
            return `${loc.name}${loc.coordinates ? ` (${loc.coordinates.lat.toFixed(2)}, ${loc.coordinates.lng.toFixed(2)})` : ''}`;
        }
        return loc.name;
    }).join(', ');

    return summary;
};
