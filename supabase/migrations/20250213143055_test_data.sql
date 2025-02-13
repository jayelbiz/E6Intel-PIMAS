-- Insert test articles
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
  'Global Economic Summit Addresses Cryptocurrency Regulations',
  'World leaders gathered to discuss the future of digital currency regulation...',
  'https://e6intel.com/news/crypto-summit-2025',
  'E6 Intel News',
  NOW() - INTERVAL '2 days',
  'financial_economic',
  ST_GeographyFromText('POINT(-74.006 40.7128)'), -- New York
  0.95,
  2
),
(
  'Major Cyber Attack Targets Critical Infrastructure',
  'A sophisticated cyber attack has been detected targeting energy facilities...',
  'https://e6intel.com/news/cyber-attack-2025',
  'E6 Intel Security',
  NOW() - INTERVAL '1 day',
  'security_alerts',
  ST_GeographyFromText('POINT(-77.0369 38.9072)'), -- Washington DC
  0.88,
  4
),
(
  'Constitutional Challenge to AI Surveillance Law',
  'Supreme Court to hear arguments on the constitutionality of AI-powered surveillance...',
  'https://e6intel.com/news/ai-law-challenge',
  'E6 Intel Legal',
  NOW() - INTERVAL '12 hours',
  'social_movements',
  ST_GeographyFromText('POINT(-77.0369 38.9072)'), -- Washington DC
  0.92,
  3
);

-- Insert test article analysis
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
  ARRAY['economics', 'regulation', 'cryptocurrency'],
  'Implications for financial stewardship and ethical wealth management',
  'Regulatory framework within constitutional bounds of commerce clause',
  'Potential impact on global financial markets and digital currency adoption',
  'A balanced discussion of cryptocurrency regulation with significant economic and constitutional implications'
FROM articles
WHERE title LIKE '%Cryptocurrency%';

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
  ARRAY['cybersecurity', 'infrastructure', 'national security'],
  'Protection of critical resources and societal stability',
  'National security implications and executive authority',
  'Potential economic impact from infrastructure disruption',
  'Critical security alert highlighting vulnerabilities in national infrastructure'
FROM articles
WHERE title LIKE '%Cyber Attack%';

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
  ARRAY['privacy', 'surveillance', 'constitutional rights'],
  'Balance between security and individual rights',
  'Fourth Amendment implications and privacy rights',
  'Economic impact on technology sector and compliance costs',
  'Analysis of constitutional challenges to modern surveillance technology'
FROM articles
WHERE title LIKE '%Constitutional%';

-- Insert test news cache
INSERT INTO news_cache (
  cache_key,
  data,
  expires_at
) VALUES (
  'latest_financial_news',
  '{"articles": [{"id": "1", "title": "Test Article"}]}',
  NOW() + INTERVAL '5 minutes'
);

-- Insert test API logs
INSERT INTO api_logs (
  endpoint,
  method,
  status_code,
  response_time,
  error_message
) VALUES (
  '/api/articles',
  'GET',
  200,
  150,
  null
),
(
  '/api/analysis',
  'POST',
  201,
  300,
  null
),
(
  '/api/articles',
  'GET',
  500,
  450,
  'Internal server error during article fetch'
);
