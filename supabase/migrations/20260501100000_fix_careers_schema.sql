-- Fix for careers schema: update experience column length, remove indexed qualification columns, and create requirements table
-- --------------------------------------------------------------------------

-- Increase 'experience' column length in 'qualifications' table
ALTER TABLE qualifications ALTER COLUMN experience TYPE VARCHAR(50);

-- Remove numbered qualification columns if they exist
ALTER TABLE qualifications DROP COLUMN IF EXISTS qualification_1;
ALTER TABLE qualifications DROP COLUMN IF EXISTS qualification_2;
ALTER TABLE qualifications DROP COLUMN IF EXISTS qualification_3;
ALTER TABLE qualifications DROP COLUMN IF EXISTS qualification_4;

-- Create 'job_requirements' table if not present
CREATE TABLE IF NOT EXISTS job_requirements (
    id SERIAL PRIMARY KEY,
    job_role_id INTEGER REFERENCES job_role(id) ON DELETE CASCADE,
    requirement TEXT NOT NULL
);
