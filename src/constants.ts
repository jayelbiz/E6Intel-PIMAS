export const NEWS_CATEGORIES = {
    GEOPOLITICAL: 'geopolitical',
    SECURITY_ALERTS: 'security_alerts',
    NATURAL_DISASTERS: 'natural_disasters',
    SOCIAL_MOVEMENTS: 'social_movements',
    FINANCIAL_ECONOMIC: 'financial_economic'
} as const;

export const NEWS_CATEGORY_LABELS = {
    [NEWS_CATEGORIES.GEOPOLITICAL]: 'Geopolitical',
    [NEWS_CATEGORIES.SECURITY_ALERTS]: 'Security Alerts',
    [NEWS_CATEGORIES.NATURAL_DISASTERS]: 'Natural Disasters',
    [NEWS_CATEGORIES.SOCIAL_MOVEMENTS]: 'Social Movements',
    [NEWS_CATEGORIES.FINANCIAL_ECONOMIC]: 'Financial & Economic'
} as const;

export const NEWS_CATEGORY_COLORS = {
    [NEWS_CATEGORIES.GEOPOLITICAL]: 'info',
    [NEWS_CATEGORIES.SECURITY_ALERTS]: 'danger',
    [NEWS_CATEGORIES.NATURAL_DISASTERS]: 'warning',
    [NEWS_CATEGORIES.SOCIAL_MOVEMENTS]: 'success',
    [NEWS_CATEGORIES.FINANCIAL_ECONOMIC]: 'primary'
} as const;

export const SORT_OPTIONS = {
    MOST_RECENT: 'most_recent',
    RELIABILITY: 'reliability',
    SENTIMENT: 'sentiment',
    SEVERITY: 'severity'
} as const;

export const SORT_OPTION_LABELS = {
    [SORT_OPTIONS.MOST_RECENT]: 'Most Recent',
    [SORT_OPTIONS.RELIABILITY]: 'Reliability Score',
    [SORT_OPTIONS.SENTIMENT]: 'AI Sentiment',
    [SORT_OPTIONS.SEVERITY]: 'Event Severity'
} as const;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const API_RETRY_ATTEMPTS = 3;
export const API_TIMEOUT = 10000; // 10 seconds

export const NEWS_ROUTES = {
    INDEX: '/news',
    BOOKMARKS: '/news/bookmarks',
    ALERTS: '/news/alerts',
    SETTINGS: '/news/settings',
    MAP: '/news/map',
    ANALYTICS: '/news/analytics'
} as const;
