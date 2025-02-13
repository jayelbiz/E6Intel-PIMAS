-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create notification tables
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Add notification RLS policies
CREATE POLICY "Users can view their own notifications"
ON user_notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
ON user_notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Function to create user notification
CREATE OR REPLACE FUNCTION create_user_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_data JSONB DEFAULT NULL
)
RETURNS user_notifications AS $$
DECLARE
  v_notification user_notifications;
BEGIN
  INSERT INTO user_notifications (user_id, title, message, type, data)
  VALUES (p_user_id, p_title, p_message, p_type, p_data)
  RETURNING * INTO v_notification;
  
  RETURN v_notification;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for high severity events
CREATE OR REPLACE FUNCTION notify_high_severity_event()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
  alert_pref RECORD;
BEGIN
  -- Only process high severity events (4 or 5)
  IF NEW.event_severity >= 4 THEN
    -- Find users with alert preferences matching the event
    FOR alert_pref IN 
      SELECT DISTINCT uap.user_id, uap.radius
      FROM user_alert_preferences uap
      WHERE 
        uap.is_muted = false 
        AND (uap.muted_until IS NULL OR uap.muted_until < NOW())
        AND (
          -- Match by topic
          uap.topic = ANY(
            SELECT unnest(aa.key_themes)
            FROM article_analysis aa
            WHERE aa.article_id = NEW.id
          )
          -- Match by location if both location and radius are set
          OR (
            uap.location IS NOT NULL 
            AND NEW.location IS NOT NULL
            AND ST_DWithin(
              uap.location::geography,
              NEW.location::geography,
              uap.radius * 1609.34  -- Convert miles to meters
            )
          )
        )
    LOOP
      -- Create notification for each matching user
      PERFORM create_user_notification(
        alert_pref.user_id,
        NEW.title,
        'High severity event detected in your area of interest',
        'high_severity_alert',
        jsonb_build_object(
          'article_id', NEW.id,
          'severity', NEW.event_severity,
          'category', NEW.category
        )
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new articles
CREATE TRIGGER notify_high_severity_event_trigger
  AFTER INSERT ON articles
  FOR EACH ROW
  EXECUTE FUNCTION notify_high_severity_event();

-- Trigger function for new analysis insights
CREATE OR REPLACE FUNCTION notify_analysis_insights()
RETURNS TRIGGER AS $$
DECLARE
  article_record RECORD;
  user_record RECORD;
BEGIN
  -- Get the article details
  SELECT * INTO article_record
  FROM articles
  WHERE id = NEW.article_id;

  -- Find users with matching alert preferences
  FOR user_record IN 
    SELECT DISTINCT uap.user_id
    FROM user_alert_preferences uap
    WHERE 
      uap.is_muted = false 
      AND (uap.muted_until IS NULL OR uap.muted_until < NOW())
      AND (
        -- Match by topic
        uap.topic = ANY(NEW.key_themes)
        -- Match spiritual context alerts
        OR (uap.topic = 'spiritual' AND NEW.spiritual_context IS NOT NULL)
        -- Match constitutional impact alerts
        OR (uap.topic = 'constitutional' AND NEW.constitutional_impact IS NOT NULL)
      )
  LOOP
    -- Create notification
    PERFORM create_user_notification(
      user_record.user_id,
      'New Analysis Available',
      'New insights available for article: ' || article_record.title,
      'analysis_insight',
      jsonb_build_object(
        'article_id', NEW.article_id,
        'sentiment', NEW.sentiment_score,
        'key_themes', NEW.key_themes
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new analysis
CREATE TRIGGER notify_analysis_insights_trigger
  AFTER INSERT ON article_analysis
  FOR EACH ROW
  EXECUTE FUNCTION notify_analysis_insights();

-- Function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  -- Delete notifications older than 30 days
  DELETE FROM user_notifications
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a manual cleanup function since pg_cron is not available
CREATE OR REPLACE FUNCTION manual_cleanup_notifications()
RETURNS void AS $$
BEGIN
  -- This can be called manually or through application logic
  PERFORM cleanup_old_notifications();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
