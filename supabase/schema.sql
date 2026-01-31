-- ============================================
-- MyBikeLog Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Profiles Table (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'it',
  units TEXT DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Strava Tokens Table
-- ============================================
CREATE TABLE public.strava_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  athlete_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.strava_tokens ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own tokens"
  ON public.strava_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tokens"
  ON public.strava_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON public.strava_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tokens"
  ON public.strava_tokens FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Bikes Table
-- ============================================
CREATE TABLE public.bikes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  strava_id TEXT UNIQUE,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  total_km NUMERIC DEFAULT 0,
  total_hours NUMERIC DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  frame_type TEXT DEFAULT 'road' CHECK (frame_type IN ('road', 'mtb', 'gravel', 'city', 'ebike', 'other')),
  image_url TEXT,
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own bikes"
  ON public.bikes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bikes"
  ON public.bikes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bikes"
  ON public.bikes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bikes"
  ON public.bikes FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_bikes_user_id ON public.bikes(user_id);
CREATE INDEX idx_bikes_strava_id ON public.bikes(strava_id);

-- ============================================
-- Components Table
-- ============================================
CREATE TABLE public.components (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bike_id UUID REFERENCES public.bikes(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  install_date DATE DEFAULT CURRENT_DATE,
  install_km NUMERIC DEFAULT 0,
  install_hours NUMERIC DEFAULT 0,
  threshold_km NUMERIC,
  threshold_hours NUMERIC,
  current_km NUMERIC DEFAULT 0,
  current_hours NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'warning', 'danger', 'replaced')),
  notes TEXT,
  is_custom BOOLEAN DEFAULT false,
  icon TEXT,
  brand TEXT,
  model TEXT,
  price NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.components ENABLE ROW LEVEL SECURITY;

-- Policies (via bike ownership)
CREATE POLICY "Users can view their own components"
  ON public.components FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bikes 
      WHERE bikes.id = components.bike_id 
      AND bikes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert components to their bikes"
  ON public.components FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bikes 
      WHERE bikes.id = bike_id 
      AND bikes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own components"
  ON public.components FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bikes 
      WHERE bikes.id = components.bike_id 
      AND bikes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own components"
  ON public.components FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.bikes 
      WHERE bikes.id = components.bike_id 
      AND bikes.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_components_bike_id ON public.components(bike_id);
CREATE INDEX idx_components_status ON public.components(status);

-- ============================================
-- Maintenance Logs Table
-- ============================================
CREATE TABLE public.maintenance_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  component_id UUID REFERENCES public.components(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('installed', 'maintained', 'replaced', 'inspected')),
  date DATE DEFAULT CURRENT_DATE,
  km_at_action NUMERIC DEFAULT 0,
  hours_at_action NUMERIC DEFAULT 0,
  notes TEXT,
  cost NUMERIC,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

-- Policies (via component -> bike ownership)
CREATE POLICY "Users can view their own maintenance logs"
  ON public.maintenance_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.components
      JOIN public.bikes ON bikes.id = components.bike_id
      WHERE components.id = maintenance_logs.component_id
      AND bikes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert maintenance logs"
  ON public.maintenance_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.components
      JOIN public.bikes ON bikes.id = components.bike_id
      WHERE components.id = component_id
      AND bikes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their maintenance logs"
  ON public.maintenance_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.components
      JOIN public.bikes ON bikes.id = components.bike_id
      WHERE components.id = maintenance_logs.component_id
      AND bikes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their maintenance logs"
  ON public.maintenance_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.components
      JOIN public.bikes ON bikes.id = components.bike_id
      WHERE components.id = maintenance_logs.component_id
      AND bikes.user_id = auth.uid()
    )
  );

-- Index
CREATE INDEX idx_maintenance_logs_component_id ON public.maintenance_logs(component_id);

-- ============================================
-- Notifications Table
-- ============================================
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('maintenance', 'sync', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- ============================================
-- Functions
-- ============================================

-- Function to update component status based on wear
CREATE OR REPLACE FUNCTION update_component_status()
RETURNS TRIGGER AS $$
DECLARE
  wear_percentage NUMERIC;
BEGIN
  -- Calculate wear percentage
  IF NEW.threshold_km IS NOT NULL AND NEW.threshold_km > 0 THEN
    wear_percentage := (NEW.current_km / NEW.threshold_km) * 100;
  ELSIF NEW.threshold_hours IS NOT NULL AND NEW.threshold_hours > 0 THEN
    wear_percentage := (NEW.current_hours / NEW.threshold_hours) * 100;
  ELSE
    wear_percentage := 0;
  END IF;

  -- Update status based on wear
  IF NEW.status != 'replaced' THEN
    IF wear_percentage >= 100 THEN
      NEW.status := 'danger';
    ELSIF wear_percentage >= 75 THEN
      NEW.status := 'warning';
    ELSE
      NEW.status := 'ok';
    END IF;
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for component status updates
CREATE TRIGGER component_status_update
  BEFORE UPDATE ON public.components
  FOR EACH ROW
  EXECUTE FUNCTION update_component_status();

-- ============================================
-- Updated at triggers
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER strava_tokens_updated_at
  BEFORE UPDATE ON public.strava_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bikes_updated_at
  BEFORE UPDATE ON public.bikes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- STORAGE POLICIES (for receipts bucket)
-- ============================================

-- Nota: Assicurati di creare manualmente il bucket 'receipts' nella dashboard di Supabase
-- prima di applicare queste policy se non esiste già.

CREATE POLICY "Public Receipt Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts');

CREATE POLICY "Authenticated User Upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Authenticated User Delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'receipts');
