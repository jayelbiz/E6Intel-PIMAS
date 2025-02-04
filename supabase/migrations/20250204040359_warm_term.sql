/*
  # Initial Schema Setup for ProphecyWatch

  1. New Tables
    - users
      - Custom user profile data
      - Extends Supabase auth.users
    - events
      - Stores prophetic events and occurrences
    - alerts
      - User alert preferences and notifications
    - news_articles
      - Analyzed news articles and their classifications
    - locations
      - Geographic locations of interest
    - keywords
      - Trending keywords and their associations

  2. Security
    - RLS policies for all tables
    - User-specific data protection
    - Public read access where appropriate

  3. Relationships
    - Users to alerts (1:many)
    - Events to locations (many:many)
    - Events to keywords (many:many)
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  timezone TEXT DEFAULT 'UTC',
  email_preferences JSONB DEFAULT '{"alerts": true, "digest": true, "news": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('prophecy', 'disaster', 'miracle', 'endTimes')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Event locations (junction table)
CREATE TABLE IF NOT EXISTS event_locations (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, location_id)
);

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event keywords (junction table)
CREATE TABLE IF NOT EXISTS event_keywords (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, keyword_id)
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_types TEXT[] DEFAULT ARRAY['prophecy', 'disaster', 'miracle', 'endTimes'],
  min_severity TEXT DEFAULT 'low',
  locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- News articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  classification TEXT NOT NULL CHECK (classification IN ('prophecy', 'disaster', 'miracle', 'endTimes')),
  confidence DECIMAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  summary TEXT,
  keywords TEXT[],
  analyzed_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Events are readable by all
CREATE POLICY "Events are readable by all"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

-- Events can be created by authenticated users
CREATE POLICY "Events can be created by authenticated users"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Event creators can update their events
CREATE POLICY "Event creators can update their events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Locations are readable by all
CREATE POLICY "Locations are readable by all"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Keywords are readable by all
CREATE POLICY "Keywords are readable by all"
  ON keywords
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can manage their own alerts
CREATE POLICY "Users can manage their alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- News articles are readable by all
CREATE POLICY "News articles are readable by all"
  ON news_articles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS events_severity_idx ON events(severity);
CREATE INDEX IF NOT EXISTS events_occurred_at_idx ON events(occurred_at);
CREATE INDEX IF NOT EXISTS keywords_text_idx ON keywords(text);
CREATE INDEX IF NOT EXISTS locations_coords_idx ON locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS news_articles_classification_idx ON news_articles(classification);
CREATE INDEX IF NOT EXISTS news_articles_analyzed_at_idx ON news_articles(analyzed_at);