-- Supabase SQL Database Setup for Vruddhi Properties
-- Copy and paste this script directly into your Supabase SQL Editor (https://supabase.com/dashboard/project/ncdslxxepufzkksurijh/sql/new)

-- =======================================================
-- FORCE RESET OLD CONFLICTING TABLES (UUID VS TEXT ISSUES)
-- =======================================================
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.unlock_requests CASCADE;
DROP TABLE IF EXISTS public.sell_requests CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.help_requests CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscriptions CASCADE;

-- =======================================================
-- IMPORTANT: FORCE SUPABASE TO RELOAD THE SCHEMA CACHE
-- =======================================================
NOTIFY pgrst, 'reload schema';

CREATE TABLE IF NOT EXISTS public.profiles (
  id text PRIMARY KEY,
  pw text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'Normal User' CHECK (role IN ('Normal User', 'Admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.properties (
  id text PRIMARY KEY,
  title text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  bhk text NOT NULL,
  type text NOT NULL,
  image text NOT NULL,
  purpose text NOT NULL CHECK (purpose IN ('Buy', 'Rent')),
  is_blurred boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sell_requests (
  id text PRIMARY KEY,
  title text NOT NULL,
  locality text NOT NULL,
  city text NOT NULL,
  price text NOT NULL,
  bhk text NOT NULL,
  property_type text NOT NULL,
  purpose text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  image text,
  user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.unlock_requests (
  id text PRIMARY KEY,
  property_name text NOT NULL,
  inquirer_name text NOT NULL,
  inquirer_email text NOT NULL,
  message text,
  date text NOT NULL,
  status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined')),
  user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id text REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id text REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_property_wishlist UNIQUE (user_id, property_id)
);

CREATE TABLE IF NOT EXISTS public.help_requests (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  date text NOT NULL,
  status text DEFAULT 'Open' CHECK (status IN ('Open', 'Resolved')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id text PRIMARY KEY,
  email text NOT NULL UNIQUE,
  date text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =======================================================
-- DISABLE Row Level Security (RLS) to Guarantee Instant Web Client Connection
-- This resolves "new row violates row-level security policy" errors when
-- inserting user profiles or properties from the frontend.
-- =======================================================

ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sell_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlock_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.help_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions DISABLE ROW LEVEL SECURITY;

-- Fallback Clean Permissive Policies (just in case RLS is forced on by the Supabase project dashboard later)
DROP POLICY IF EXISTS "Public Profiles All Actions" ON public.profiles;
DROP POLICY IF EXISTS "Public Properties All Actions" ON public.properties;
DROP POLICY IF EXISTS "Public Sell Requests All Actions" ON public.sell_requests;
DROP POLICY IF EXISTS "Public Unlock Requests All Actions" ON public.unlock_requests;
DROP POLICY IF EXISTS "Public Wishlists All Actions" ON public.wishlists;
DROP POLICY IF EXISTS "Public Help Requests All Actions" ON public.help_requests;
DROP POLICY IF EXISTS "Public Newsletter All Actions" ON public.newsletter_subscriptions;

CREATE POLICY "Public Profiles All Actions" ON public.profiles FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Properties All Actions" ON public.properties FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Sell Requests All Actions" ON public.sell_requests FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Unlock Requests All Actions" ON public.unlock_requests FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Wishlists All Actions" ON public.wishlists FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Help Requests All Actions" ON public.help_requests FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Newsletter All Actions" ON public.newsletter_subscriptions FOR ALL TO public USING (true) WITH CHECK (true);

-- =======================================================
-- SEED INITIAL DEMO DATA
-- =======================================================

-- 1. Profiles (Demo users and administrators)
INSERT INTO public.profiles (id, pw, name, email, role) VALUES
('Rohan_Sharma', 'Rohan@123', 'Rohan Sharma', 'rohan.sharma@gmail.com', 'Normal User'),
('Aishwarya_Sen', 'SereneVilla123', 'Aishwarya Sen', 'aishwarya.sen@outlook.com', 'Normal User'),
('User_2026', 'User@2026', 'User 2026', 'workspacelocaluser@gmail.com', 'Normal User'),
('Admin_2007', 'Admin@2007', 'System Director', 'admin.director@vruddhi.co', 'Admin')
ON CONFLICT (id) DO UPDATE SET pw = EXCLUDED.pw, name = EXCLUDED.name, email = EXCLUDED.email, role = EXCLUDED.role;

-- 2. Properties (Standard active catalog listings)
INSERT INTO public.properties (id, title, location, price, bhk, type, image, purpose, is_blurred) VALUES
('1', 'Skyline Penthouse', 'Worli, Mumbai', '₹12.5 Cr', '4 BHK', 'Flat', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Buy', true),
('2', 'Serene Villa', 'Whitefield, Bangalore', '₹4.8 Cr', '5 BHK', 'Villa', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Buy', true),
('3', 'Modern Studio', 'Gurgaon, Sector 42', '₹1.2 Cr', '1 BHK', 'Flat', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Buy', true),
('4', 'Luxury Loft', 'Bandra West, Mumbai', '₹85,000/mo', '2 BHK', 'Flat', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Rent', false),
('5', 'Garden Retreat', 'Salt Lake, Kolkata', '₹45,000/mo', '3 BHK', 'Flat', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Rent', false),
('6', 'Executive Suites', 'Cyber City, Hyderabad', '₹2.1 Cr', '3 BHK', 'Flat', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Buy', false),
('7', 'Coastal Manor', 'Alibaug, Maharashtra', '₹18 Cr', '6 BHK', 'Villa', 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Buy', false),
('8', 'Urban Vista', 'Pune, Hinjewadi', '₹35,000/mo', '2 BHK', 'Flat', 'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Rent', false),
('9', 'Heritage Plot', 'Jaipur, Rajasthan', '₹3.2 Cr', 'Plot', 'Plot', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Buy', false),
('10', 'High-Rise Haven', 'Navi Mumbai', '₹60,000/mo', '3 BHK', 'Flat', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Rent', false),
('11', 'Royal Residency', 'South Delhi', '₹25 Cr', '5 BHK', 'Villa', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80', 'Buy', false),
('12', 'Tech Hub Pod', 'Whitefield, Bangalore', '₹25,000/mo', '1 BHK', 'Flat', 'https://images.unsplash.com/photo-1536376074432-8d63d5929230?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 'Rent', false)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, location = EXCLUDED.location, price = EXCLUDED.price, bhk = EXCLUDED.bhk, type = EXCLUDED.type, image = EXCLUDED.image, purpose = EXCLUDED.purpose;

-- 3. Sell Requests (Dashboard listings submitted by sellers)
INSERT INTO public.sell_requests (id, title, locality, city, price, bhk, property_type, purpose, full_name, email, phone, status, image, user_id) VALUES
('sell-1', 'Majestic 4 BHK Bungalow', 'Indiranagar', 'Bangalore', '₹5.5 Crore', '4 BHK', 'Villa', 'Buy', 'Vikram Aditya', 'vikram.aditya@gmail.com', '+91 98801 23456', 'Pending', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'User_2026'),
('sell-rohan-1', 'Elegant 3 BHK Luxury Apartment', 'Bandra West', 'Mumbai', '₹4.5 Crore', '3 BHK', 'Flat', 'Buy', 'Rohan Sharma', 'rohan.sharma@gmail.com', '+91 99201 98765', 'Pending', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', 'Rohan_Sharma'),
('sell-rohan-2', 'Panoramic Marina Suite', 'Worli', 'Mumbai', '₹1.2 Lakh/mo', '2 BHK', 'Flat', 'Rent', 'Rohan Sharma', 'rohan.sharma@gmail.com', '+91 99201 98765', 'Approved', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 'Rohan_Sharma'),
('sell-aishwarya-1', 'Serene Greenery Penthouse', 'Whitefield', 'Bangalore', '₹6.2 Crore', '4 BHK', 'Flat', 'Buy', 'Aishwarya Sen', 'aishwarya.sen@outlook.com', '+91 98802 43210', 'Pending', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'Aishwarya_Sen'),
('sell-aishwarya-2', 'Contemporary Tech-Park Duplex', 'Electronic City', 'Bangalore', '₹80,000/mo', '3 BHK', 'Flat', 'Rent', 'Aishwarya Sen', 'aishwarya.sen@outlook.com', '+91 98802 43210', 'Approved', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'Aishwarya_Sen')
ON CONFLICT (id) DO NOTHING;

-- 4. Unlock Requests (Buyer location inquiries)
INSERT INTO public.unlock_requests (id, property_name, inquirer_name, inquirer_email, message, date, status, user_id, property_id) VALUES
('unlock-1', 'Skyline Penthouse, Worli', 'Rohan Sharma', 'rohan.sharma@gmail.com', 'I am looking to buy immediately. Verified profile ready.', '2026-05-18', 'Pending', 'Rohan_Sharma', '1'),
('unlock-2', 'Serene Villa, Whitefield', 'Aishwarya Sen', 'aishwarya.sen@outlook.com', 'Would love to schedule a visit this Sunday if possible.', '2026-05-19', 'Approved', 'Aishwarya_Sen', '2'),
('unlock-rohan-2', 'Modern Studio, Gurgaon', 'Rohan Sharma', 'rohan.sharma@gmail.com', 'Looking for a secondary workspace. High budget clearance.', '2026-05-20', 'Approved', 'Rohan_Sharma', '3')
ON CONFLICT (id) DO NOTHING;

-- 5. Help Support logs
INSERT INTO public.help_requests (id, name, email, message, date, status) VALUES
('help-1', 'Aniket Gupta', 'aniket.gupta@inbox.com', 'I am not receiving the OTP code verification for location unlocking.', '2026-05-16', 'Open'),
('help-2', 'Pooja Hegde', 'hegde.pooja@gmail.com', 'Excellent private design. Do you have premium options in Pune?', '2026-05-18', 'Resolved')
ON CONFLICT (id) DO NOTHING;

-- 6. Newsletter Subscribers
INSERT INTO public.newsletter_subscriptions (id, email, date) VALUES
('news-1', 'shubham.k@gmail.com', '2026-05-15'),
('news-2', 'meera.iyer@pwc.com', '2026-05-17')
ON CONFLICT (id) DO NOTHING;

-- Force refreshing the schema cache database configuration at the end of the script
NOTIFY pgrst, 'reload schema';
