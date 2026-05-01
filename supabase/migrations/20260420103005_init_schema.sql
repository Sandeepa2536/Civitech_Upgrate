-- CIVITECH CONSTRUCTIONS - FINAL POSTGRESQL SCHEMA (Supabase Optimized)
-- ==========================================================================

-- 1. BASIC LISTS & STATUSES
-- --------------------------------------------------------------------------

CREATE TABLE status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15) NOT NULL
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category VARCHAR(45) NOT NULL,
    status_id INTEGER REFERENCES status(id)
);

CREATE TABLE project_scope (
    id SERIAL PRIMARY KEY,
    scope VARCHAR(50) NOT NULL
);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo VARCHAR(255) DEFAULT NULL,
    status_id INTEGER REFERENCES status(id)
);

CREATE TABLE employment_type (
    id SERIAL PRIMARY KEY,
    type VARCHAR(15) NOT NULL
);

CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE role_category (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL
);


-- 2. PROJECTS MANAGEMENT
-- --------------------------------------------------------------------------

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    started_at DATE DEFAULT NULL,
    end_at DATE DEFAULT NULL,
    location VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES category(id),
    project_scope_id INTEGER REFERENCES project_scope(id),
    status_id INTEGER REFERENCES status(id),
    client_id INTEGER REFERENCES clients(id),
    cover_image TEXT, -- URL from Supabase Storage
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects_image (
    id SERIAL PRIMARY KEY,
    projects_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    path TEXT NOT NULL -- URL from Supabase Storage
);

CREATE TABLE projects_video (
    id SERIAL PRIMARY KEY,
    projects_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    url VARCHAR(255) NOT NULL -- YouTube Video ID
);


-- 3. CAREERS & APPLICATIONS
-- --------------------------------------------------------------------------

CREATE TABLE qualifications (
    id SERIAL PRIMARY KEY,
    experience VARCHAR(15) NOT NULL,
    qualification_1 TEXT NOT NULL,
    qualification_2 TEXT,
    qualification_3 TEXT,
    qualification_4 TEXT,
    status_id INTEGER REFERENCES status(id)
);

CREATE TABLE job_role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status_id INTEGER REFERENCES status(id),
    qualifications_id INTEGER REFERENCES qualifications(id),
    role_category_id INTEGER REFERENCES role_category(id),
    employment_type_id INTEGER REFERENCES employment_type(id),
    location_id INTEGER REFERENCES location(id)
);

CREATE TABLE vacancies (
    id SERIAL PRIMARY KEY,
    job_role_id INTEGER REFERENCES job_role(id) ON DELETE CASCADE,
    open_date TIMESTAMP WITH TIME ZONE NOT NULL,
    closing_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status_id INTEGER REFERENCES status(id)
);

CREATE TABLE application (
    id SERIAL PRIMARY KEY,
    job_role_id INTEGER REFERENCES job_role(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    linkedIn VARCHAR(255) DEFAULT NULL,
    github VARCHAR(255) DEFAULT NULL,
    cv TEXT DEFAULT NULL, -- URL from Supabase Storage
    status_id INTEGER REFERENCES status(id),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 4. TEAM MEMBERS & ADMIN ACCESS
-- --------------------------------------------------------------------------

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(90) NOT NULL,
    lname VARCHAR(90) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) DEFAULT NULL,
    vcode VARCHAR(10) DEFAULT NULL,
    status_id INTEGER REFERENCES status(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE member_profile (
    id SERIAL PRIMARY KEY,
    path TEXT NOT NULL, -- URL to Profile Image
    members_id INTEGER REFERENCES members(id) ON DELETE CASCADE
);


-- 5. SITE CONTENT & DYNAMIC DATA
-- --------------------------------------------------------------------------

CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 6. INITIAL DATA (SEEDING)
-- --------------------------------------------------------------------------

-- Statuses
INSERT INTO status (status) VALUES ('Active'), ('Inactive'), ('Ongoing'), ('Completed');

-- Categories
INSERT INTO category (category, status_id) VALUES 
('Commercial and Industrial Buildings', 1),
('Institutional Projects', 1),
('Steel Structures', 1),
('Road Projects', 1),
('Water Projects', 1),
('Residential Projects', 1);

-- Clients
INSERT INTO clients (name, status_id) VALUES 
('Brandix Apparel Solutions (Pvt) Ltd.', 1),
('M.N Properties (Pvt) Ltd.', 1),
('H.D.F.C BANK', 1),
('Lanka Tiles PLC', 1),
('Mahaweli Authority', 1),
('National Water Supply & Drainage Board.', 1),
('C C S Lanka (Pvt) Ltd.', 1),
('Blue Scope Lysaght Lanka (Pvt) Ltd.', 1),
('Brandix Lingerie (Pvt) Ltd.', 1),
('Sujala Shakthi (Pvt) Ltd.', 1),
('Sri Lanka Cricket', 1),
('Legends Trading International.', 1),
('Mr.Udena Wickramasooriya.', 1),
('Assets & Property Management (Pvt) Ltd.', 1),
('Millennium Information Technologies', 1),
('Business Promoters & Partners (Pvt) Ltd.', 1),
('American & efird Lanka (Pvt) Ltd.', 1),
('Ansell Lanka (Pvt) Ltd.', 1),
('Earth Foam (Pvt) Ltd.', 1),
('Grand Gain Industries (Pvt) Ltd.', 1);

-- Employment Types
INSERT INTO employment_type (type) VALUES ('Full-Time'), ('Part-Time'), ('Contract');

-- Default Site Content
INSERT INTO site_content (key, value) VALUES 
('quality_video_id', 'dQw4w9WgXcQ'),
('gallery_image_1', 'https://picsum.photos/800/600?random=1'),
('gallery_image_2', 'https://picsum.photos/800/600?random=2'),
('gallery_image_3', 'https://picsum.photos/800/600?random=3'),
('gallery_image_4', 'https://picsum.photos/800/600?random=4'),
('gallery_image_5', 'https://picsum.photos/800/600?random=5'),
('gallery_image_6', 'https://picsum.photos/800/600?random=6');