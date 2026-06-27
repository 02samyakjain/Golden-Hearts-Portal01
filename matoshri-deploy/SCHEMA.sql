-- =============================================
-- MATOSHRI ANANDASHRAM - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISITORS TABLE
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  date_of_birth DATE,
  profession TEXT NOT NULL,
  address TEXT NOT NULL,
  reference TEXT,
  reason_for_visit TEXT NOT NULL,
  consent BOOLEAN DEFAULT true,
  volunteer_interest BOOLEAN DEFAULT false,
  volunteer_date DATE,
  volunteer_time TEXT,
  volunteer_skills TEXT,
  visit_date DATE DEFAULT CURRENT_DATE,
  visit_time TIME DEFAULT CURRENT_TIME,
  device TEXT,
  browser TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DONATIONS TABLE
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donation_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  date_of_birth DATE,
  profession TEXT NOT NULL,
  address TEXT NOT NULL,
  reference TEXT,
  donation_amount NUMERIC NOT NULL DEFAULT 7500,
  occasion TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  special_message TEXT,
  pan_number TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  driving_licence TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Pending',
  receipt_status TEXT DEFAULT 'Not Generated',
  receipt_number TEXT,
  declaration BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RECEIPTS TABLE
CREATE TABLE IF NOT EXISTS receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  receipt_number TEXT UNIQUE NOT NULL,
  donation_id TEXT REFERENCES donations(donation_id),
  receipt_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  skills TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details TEXT,
  performed_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_visitors_visit_date ON visitors(visit_date);
CREATE INDEX IF NOT EXISTS idx_visitors_mobile ON visitors(mobile);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_payment_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_preferred_date ON donations(preferred_date);

-- ROW LEVEL SECURITY
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- PUBLIC INSERT POLICIES (for visitor/donation forms)
CREATE POLICY "Allow public insert visitors" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert volunteers" ON volunteers FOR INSERT WITH CHECK (true);

-- ADMIN READ/UPDATE POLICIES (authenticated users can read all)
CREATE POLICY "Allow auth read visitors" ON visitors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth update visitors" ON visitors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow auth delete visitors" ON visitors FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow auth read donations" ON donations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth update donations" ON donations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow auth delete donations" ON donations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow auth read receipts" ON receipts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth insert receipts" ON receipts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow auth read volunteers" ON volunteers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth read logs" ON activity_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow insert logs" ON activity_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow auth read admins" ON admins FOR SELECT TO authenticated USING (true);

-- =============================================
-- IMPORTANT: After running this schema,
-- go to Supabase > Authentication > Users
-- and create your admin user with email/password.
-- Then add the same email to the admins table:
-- INSERT INTO admins (email, name) VALUES ('your@email.com', 'Admin Name');
-- =============================================
