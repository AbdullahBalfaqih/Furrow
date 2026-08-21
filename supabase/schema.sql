-- Furrow Chain Production Supabase Database Schema (Includes Users & Roles)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xtzxxxdjphahxskgalgw/sql/new

-- 1. Create Users & Role Profile Table
CREATE TABLE IF NOT EXISTS public.users (
  wallet_address TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'buyer', -- 'merchant' or 'buyer'
  name TEXT,
  email TEXT,
  phone TEXT,
  shipping_address TEXT,
  city TEXT,
  created_at BIGINT NOT NULL
);

-- 2. Create Crops Table
CREATE TABLE IF NOT EXISTS public.crops (
  id BIGSERIAL PRIMARY KEY,
  farmer TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  storage_cid TEXT NOT NULL,
  metadata_hash TEXT NOT NULL,
  harvest_date BIGINT NOT NULL,
  created_at BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Registered'
);

-- 3. Create AI Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id BIGSERIAL PRIMARY KEY,
  crop_id BIGINT REFERENCES public.crops(id),
  quality_score INT NOT NULL,
  grade TEXT NOT NULL,
  estimated_value TEXT NOT NULL,
  model_version TEXT NOT NULL,
  assessment_hash TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  assessor TEXT NOT NULL
);

-- 4. Create Marketplace Listings Table
CREATE TABLE IF NOT EXISTS public.listings (
  listing_id BIGSERIAL PRIMARY KEY,
  crop_id BIGINT REFERENCES public.crops(id),
  farmer TEXT NOT NULL,
  minimum_price TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Create Buyer Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
  offer_id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT REFERENCES public.listings(listing_id),
  buyer TEXT NOT NULL,
  amount TEXT NOT NULL,
  created_at BIGINT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. Create Cybersecurity Logs Table
CREATE TABLE IF NOT EXISTS public.security_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  ip TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Disable RLS for seamless API access
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.crops DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs DISABLE ROW LEVEL SECURITY;
