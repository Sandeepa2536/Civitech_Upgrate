-- Schema Fixes for missing tables and columns observed in the database
-- --------------------------------------------------------------------------

-- 1. Add missing social columns to members if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='linkedin_url') THEN
        ALTER TABLE members ADD COLUMN linkedin_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='github_url') THEN
        ALTER TABLE members ADD COLUMN github_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='twitter_url') THEN
        ALTER TABLE members ADD COLUMN twitter_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='members' AND column_name='job_role_id') THEN
        ALTER TABLE members ADD COLUMN job_role_id INTEGER REFERENCES job_role(id);
    END IF;
END $$;

-- 2. Define missing tables that exist in DB but not in tracking
CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo TEXT DEFAULT NULL,
    status_id INTEGER REFERENCES status(id) DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    date VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    cover_image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES gallery_events(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Seed Essential Data
-- --------------------------------------------------------------------------

-- Ensure project_scope has data
INSERT INTO project_scope (scope, status_id) VALUES 
('Full Turnkey', 1),
('Civil & Structural', 1),
('Renovation', 1),
('Steel Construction', 1),
('Interior & Fit-out', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert missing clients from civitech_db.txt
INSERT INTO clients (name, status_id) VALUES 
('Ansell Lanka (Pvt) Ltd.', 1),
('Earth Foam (Pvt) Ltd.', 1),
('Grand Gain Industries (Pvt) Ltd.', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed partners from app/page.tsx
INSERT INTO partners (name, status_id) VALUES 
('Brandix Apparel Solutions', 1),
('Lanka Tiles PLC', 1),
('HDFC Bank', 1),
('Mahaweli Authority', 1),
('Noritake Porcelain', 1),
('Ansell Lanka', 1),
('CCS Lanka', 1),
('NWSDB', 1),
('Lanka Walltiles PLC', 1),
('Ceylon Beverage', 1),
('DSI Tyres', 1),
('Shiratha Garments', 1),
('Yuk Ryong Threads', 1),
('Grand Gain Industrial', 1),
('Elsuma (Pvt) Ltd', 1),
('Legends Trading', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed site_content defaults
INSERT INTO site_content (key, value) VALUES 
('quality_video_id', 'dQw4w9WgXcQ'),
('gallery_image_1', 'https://picsum.photos/800/600?random=1'),
('gallery_image_2', 'https://picsum.photos/800/600?random=2'),
('gallery_image_3', 'https://picsum.photos/800/600?random=3'),
('gallery_image_4', 'https://picsum.photos/800/600?random=4'),
('gallery_image_5', 'https://picsum.photos/800/600?random=5'),
('gallery_image_6', 'https://picsum.photos/800/600?random=6')
ON CONFLICT (key) DO NOTHING;
