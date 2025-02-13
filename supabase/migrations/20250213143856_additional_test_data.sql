-- Add more diverse test articles
INSERT INTO articles (
  title,
  content,
  url,
  source,
  published_at,
  category,
  location,
  reliability_score,
  event_severity
) VALUES
(
  'Prophecy and Technology: AI''s Role in Biblical Interpretation',
  'New AI systems are being used to analyze ancient texts and prophecies...',
  'https://e6intel.com/news/prophecy-ai-2025',
  'E6 Intel Spiritual',
  NOW() - INTERVAL '3 days',
  'social_movements',
  ST_GeographyFromText('POINT(-91.7337 31.5505)'), -- Jerusalem coordinates
  0.85,
  2
),
(
  'Global Financial Reset: Biblical Perspectives on Digital Currency',
  'Analysis of cryptocurrency and central bank digital currencies through biblical lens...',
  'https://e6intel.com/news/biblical-finance-2025',
  'E6 Intel Financial',
  NOW() - INTERVAL '4 days',
  'financial_economic',
  ST_GeographyFromText('POINT(-77.0369 38.9072)'), -- Washington DC
  0.90,
  3
),
(
  'Natural Disasters and Prophecy: Pattern Analysis',
  'AI system identifies correlations between prophetic texts and natural events...',
  'https://e6intel.com/news/prophecy-patterns-2025',
  'E6 Intel Analysis',
  NOW() - INTERVAL '5 days',
  'natural_disasters',
  ST_GeographyFromText('POINT(-118.2437 34.0522)'), -- Los Angeles
  0.87,
  4
);

-- Add corresponding analysis
INSERT INTO article_analysis (
  article_id,
  sentiment_score,
  bias_indicator,
  misinformation_detected,
  key_themes,
  spiritual_context,
  constitutional_impact,
  financial_implications,
  analysis_summary
)
SELECT 
  id,
  'neutral',
  'neutral',
  false,
  ARRAY['prophecy', 'technology', 'interpretation'],
  'Direct implications for prophetic understanding and spiritual discernment',
  'First Amendment considerations regarding religious freedom and technology',
  'Investment implications for AI companies in religious sector',
  'Analysis of AI''s role in biblical interpretation with focus on prophetic implications'
FROM articles
WHERE title LIKE '%Prophecy and Technology%';

INSERT INTO article_analysis (
  article_id,
  sentiment_score,
  bias_indicator,
  misinformation_detected,
  key_themes,
  spiritual_context,
  constitutional_impact,
  financial_implications,
  analysis_summary
)
SELECT 
  id,
  'neutral',
  'neutral',
  false,
  ARRAY['finance', 'cryptocurrency', 'biblical economics'],
  'Biblical principles of sound money and financial stewardship',
  'Constitutional authority for digital currency implementation',
  'Major implications for global financial system and biblical prophecy',
  'Comprehensive analysis of digital currency through biblical and constitutional lens'
FROM articles
WHERE title LIKE '%Global Financial Reset%';

INSERT INTO article_analysis (
  article_id,
  sentiment_score,
  bias_indicator,
  misinformation_detected,
  key_themes,
  spiritual_context,
  constitutional_impact,
  financial_implications,
  analysis_summary
)
SELECT 
  id,
  'negative',
  'neutral',
  false,
  ARRAY['natural disasters', 'prophecy', 'patterns'],
  'Biblical prophecies regarding end-time events and natural phenomena',
  'Federal emergency response authority and state rights',
  'Economic impact of disaster preparation and response',
  'Pattern analysis connecting prophetic texts with natural disaster occurrences'
FROM articles
WHERE title LIKE '%Natural Disasters%';

-- Add test user alert preferences
INSERT INTO user_alert_preferences (
  user_id,
  topic,
  location,
  radius,
  is_muted,
  muted_until
)
SELECT 
  auth.uid(),
  'prophecy',
  ST_GeographyFromText('POINT(-77.0369 38.9072)'),
  50,
  false,
  NULL
FROM auth.users
LIMIT 1;

INSERT INTO user_alert_preferences (
  user_id,
  topic,
  location,
  radius,
  is_muted,
  muted_until
)
SELECT 
  auth.uid(),
  'financial_reset',
  ST_GeographyFromText('POINT(-77.0369 38.9072)'),
  100,
  false,
  NULL
FROM auth.users
LIMIT 1;

-- Add test cache entries
INSERT INTO news_cache (
  cache_key,
  data,
  expires_at
) VALUES
(
  'prophecy_articles',
  '{"articles": [{"id": "1", "title": "Prophecy Analysis"}], "timestamp": "2025-02-13T09:38:38-05:00"}',
  NOW() + INTERVAL '5 minutes'
),
(
  'financial_articles',
  '{"articles": [{"id": "2", "title": "Financial Analysis"}], "timestamp": "2025-02-13T09:38:38-05:00"}',
  NOW() + INTERVAL '5 minutes'
);
