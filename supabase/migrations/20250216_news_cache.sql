-- Create news categories enum
CREATE TYPE news_category AS ENUM (
    'geopolitical',
    'security_alerts',
    'natural_disasters',
    'social_movements',
    'financial_economic'
);

-- Create news_cache table
CREATE TABLE IF NOT EXISTS public.news_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    summary TEXT,
    url TEXT UNIQUE NOT NULL,
    image_url TEXT,
    source_name TEXT NOT NULL,
    source_id TEXT,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    category news_category,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes'),
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT valid_cache_period CHECK (expires_at > cached_at)
);

-- Create news_analysis table for AI processing results
CREATE TABLE IF NOT EXISTS public.news_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID REFERENCES public.news_cache(id) ON DELETE CASCADE,
    sentiment_score FLOAT CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    bias_indicator TEXT CHECK (bias_indicator IN ('left', 'right', 'neutral')),
    misinformation_flag BOOLEAN DEFAULT false,
    key_themes TEXT[],
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_version TEXT,
    confidence_score FLOAT CHECK (confidence_score >= 0 AND confidence_score <= 1),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create api_logs table
CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_name TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_status INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    request_metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_news_cache_expires_at ON public.news_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_news_cache_category ON public.news_cache(category);
CREATE INDEX IF NOT EXISTS idx_news_cache_source ON public.news_cache(source_name);
CREATE INDEX IF NOT EXISTS idx_news_analysis_sentiment ON public.news_analysis(sentiment_score);
CREATE INDEX IF NOT EXISTS idx_api_logs_timestamp ON public.api_logs(request_timestamp);

-- Enable RLS
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can read news_cache"
    ON public.news_cache FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Everyone can read news_analysis"
    ON public.news_analysis FOR SELECT
    TO public
    USING (true);

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_news_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.news_cache
    WHERE expires_at < NOW();
END;
$$;

-- Create a scheduled job to clean expired cache
SELECT cron.schedule(
    'clean_expired_news_cache',
    '*/5 * * * *', -- Run every 5 minutes
    $$
    SELECT clean_expired_news_cache();
    $$
);
