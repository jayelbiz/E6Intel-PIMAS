-- Create user_profiles table and related schema
BEGIN;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user status enum
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM (
        'active',
        'inactive',
        'suspended',
        'pending_verification'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    status user_status DEFAULT 'pending_verification',
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notification_preferences JSONB DEFAULT '{
        "email": true,
        "push": false,
        "frequency": "daily"
    }',
    ui_preferences JSONB DEFAULT '{
        "theme": "light",
        "language": "en",
        "timezone": "UTC"
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'firstName',
        NEW.raw_user_meta_data->>'lastName'
    );

    -- Create user settings with defaults
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

COMMIT;
