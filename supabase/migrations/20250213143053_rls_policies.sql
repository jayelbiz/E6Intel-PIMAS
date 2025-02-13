-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alert_preferences ENABLE ROW LEVEL SECURITY;

-- Articles policies
CREATE POLICY "Articles are viewable by authenticated users"
ON articles FOR SELECT
TO authenticated
USING (true);

-- Article Analysis policies
CREATE POLICY "Analysis is viewable by authenticated users"
ON article_analysis FOR SELECT
TO authenticated
USING (true);

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookmarks"
ON bookmarks FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- News Cache policies
CREATE POLICY "Cache is viewable by authenticated users"
ON news_cache FOR SELECT
TO authenticated
USING (true);

-- API Logs policies (admin only)
CREATE POLICY "Admins can view logs"
ON api_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email LIKE '%@e6intel.com'
  )
);

-- User Alert Preferences policies
CREATE POLICY "Users can view their own alert preferences"
ON user_alert_preferences FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own alert preferences"
ON user_alert_preferences FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own alert preferences"
ON user_alert_preferences FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own alert preferences"
ON user_alert_preferences FOR DELETE
TO authenticated
USING (user_id = auth.uid());
