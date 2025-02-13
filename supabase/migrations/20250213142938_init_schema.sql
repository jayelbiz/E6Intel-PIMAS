-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Article Categories enum
CREATE TYPE article_category AS ENUM (
  'geopolitical',
  'security_alerts',
  'natural_disasters',
  'social_movements',
  'financial_economic'
);

-- Sentiment Score enum
CREATE TYPE sentiment_type AS ENUM (
  'positive',
  'negative',
  'neutral'
);

-- Bias Indicator enum
CREATE TYPE bias_type AS ENUM (
  'left',
  'right',
  'neutral'
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  category article_category NOT NULL,
  location GEOGRAPHY(POINT),
  reliability_score NUMERIC(3,2) CHECK (reliability_score >= 0 AND reliability_score <= 1),
  event_severity INTEGER CHECK (event_severity >= 1 AND event_severity <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article Analysis table
CREATE TABLE article_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  sentiment_score sentiment_type NOT NULL,
  bias_indicator bias_type NOT NULL,
  misinformation_detected BOOLEAN DEFAULT false,
  key_themes TEXT[] NOT NULL,
  spiritual_context TEXT,
  constitutional_impact TEXT,
  financial_implications TEXT,
  analysis_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- News Cache table
CREATE TABLE news_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- API Logs table
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time INTEGER, -- in milliseconds
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Alert Preferences table
CREATE TABLE user_alert_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT,
  location GEOGRAPHY(POINT),
  radius INTEGER, -- in miles
  is_muted BOOLEAN DEFAULT false,
  muted_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX articles_category_idx ON articles(category);
CREATE INDEX articles_published_at_idx ON articles(published_at);
CREATE INDEX articles_location_idx ON articles USING GIST(location);
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX news_cache_expires_at_idx ON news_cache(expires_at);
CREATE INDEX api_logs_created_at_idx ON api_logs(created_at);

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_article_analysis_updated_at
    BEFORE UPDATE ON article_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_alert_preferences_updated_at
    BEFORE UPDATE ON user_alert_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
