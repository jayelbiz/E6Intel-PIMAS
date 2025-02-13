-- Function to get articles within a radius of a point
CREATE OR REPLACE FUNCTION get_articles_within_radius(
  center_point GEOGRAPHY,
  radius_miles FLOAT
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  distance FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    ST_Distance(a.location, center_point) / 1609.34 as distance_miles
  FROM articles a
  WHERE ST_DWithin(a.location, center_point, radius_miles * 1609.34)
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to toggle bookmark
CREATE OR REPLACE FUNCTION toggle_bookmark(
  p_article_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM bookmarks
    WHERE user_id = auth.uid()
    AND article_id = p_article_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM bookmarks
    WHERE user_id = auth.uid()
    AND article_id = p_article_id;
    RETURN false;
  ELSE
    INSERT INTO bookmarks (user_id, article_id)
    VALUES (auth.uid(), p_article_id);
    RETURN true;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's bookmarked articles with analysis
CREATE OR REPLACE FUNCTION get_user_bookmarks()
RETURNS TABLE (
  article_id UUID,
  title TEXT,
  content TEXT,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  category article_category,
  sentiment_score sentiment_type,
  analysis_summary TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.content,
    a.url,
    a.published_at,
    a.category,
    aa.sentiment_score,
    aa.analysis_summary
  FROM bookmarks b
  JOIN articles a ON b.article_id = a.id
  LEFT JOIN article_analysis aa ON a.id = aa.article_id
  WHERE b.user_id = auth.uid()
  ORDER BY a.published_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get articles by category with analysis
CREATE OR REPLACE FUNCTION get_articles_by_category(
  p_category article_category,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  article_id UUID,
  title TEXT,
  content TEXT,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  category article_category,
  sentiment_score sentiment_type,
  analysis_summary TEXT,
  is_bookmarked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.content,
    a.url,
    a.published_at,
    a.category,
    aa.sentiment_score,
    aa.analysis_summary,
    EXISTS (
      SELECT 1 FROM bookmarks b
      WHERE b.article_id = a.id
      AND b.user_id = auth.uid()
    ) as is_bookmarked
  FROM articles a
  LEFT JOIN article_analysis aa ON a.id = aa.article_id
  WHERE a.category = p_category
  ORDER BY a.published_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search articles
CREATE OR REPLACE FUNCTION search_articles(
  search_query TEXT,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  article_id UUID,
  title TEXT,
  content TEXT,
  url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  category article_category,
  sentiment_score sentiment_type,
  analysis_summary TEXT,
  is_bookmarked BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.content,
    a.url,
    a.published_at,
    a.category,
    aa.sentiment_score,
    aa.analysis_summary,
    EXISTS (
      SELECT 1 FROM bookmarks b
      WHERE b.article_id = a.id
      AND b.user_id = auth.uid()
    ) as is_bookmarked
  FROM articles a
  LEFT JOIN article_analysis aa ON a.id = aa.article_id
  WHERE 
    to_tsvector('english', a.title || ' ' || a.content) @@ to_tsquery('english', search_query)
  ORDER BY ts_rank(to_tsvector('english', a.title || ' ' || a.content), to_tsquery('english', search_query)) DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
