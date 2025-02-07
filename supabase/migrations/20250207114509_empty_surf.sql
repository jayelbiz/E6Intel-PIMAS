/*
  # Add Additional Indexes and Constraints

  1. New Indexes
    - Add composite indexes for common query patterns
    - Add partial indexes for filtered queries
    - Add GiST index for location queries

  2. Additional Constraints
    - Add NOT NULL constraints for critical fields
    - Add CHECK constraints for data validation
*/

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS events_type_severity_idx ON events(type, severity);
CREATE INDEX IF NOT EXISTS events_created_by_type_idx ON events(created_by, type);

-- Add partial index for active events
CREATE INDEX IF NOT EXISTS events_active_idx ON events(occurred_at)
WHERE occurred_at > NOW() - INTERVAL '7 days';

-- Add GiST index for location queries
CREATE INDEX IF NOT EXISTS locations_coords_gist_idx ON locations 
USING GIST (ll_to_earth(latitude, longitude));

-- Add additional constraints
ALTER TABLE events
  ALTER COLUMN title SET NOT NULL,
  ADD CONSTRAINT events_title_length CHECK (char_length(title) >= 3);

ALTER TABLE locations
  ADD CONSTRAINT locations_coords_range 
  CHECK (
    latitude BETWEEN -90 AND 90 AND 
    longitude BETWEEN -180 AND 180
  );

-- Add trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add function to calculate distance between coordinates
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 float,
  lon1 float,
  lat2 float,
  lon2 float,
  units varchar DEFAULT 'km'
)
RETURNS float AS $$
DECLARE
  dist float = 0;
  radlat1 float;
  radlat2 float;
  theta float;
  radtheta float;
BEGIN
  IF lat1 = lat2 AND lon1 = lon2
    THEN RETURN 0;
  ELSE
    radlat1 = pi() * lat1 / 180;
    radlat2 = pi() * lat2 / 180;
    theta = lon1 - lon2;
    radtheta = pi() * theta / 180;
    dist = sin(radlat1) * sin(radlat2) + cos(radlat1) * cos(radlat2) * cos(radtheta);

    IF dist > 1 THEN dist = 1; END IF;

    dist = acos(dist);
    dist = dist * 180 / pi();
    dist = dist * 60 * 1.1515;

    IF units = 'km' THEN dist = dist * 1.609344;
    ELSIF units = 'nm' THEN dist = dist * 0.8684;
    END IF;

    RETURN dist;
  END IF;
END;
$$ LANGUAGE plpgsql;