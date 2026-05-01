-- Add role and bio columns to members table
ALTER TABLE members ADD COLUMN role VARCHAR(100);
ALTER TABLE members ADD COLUMN bio TEXT;

-- Update sample data with roles and bios
UPDATE members SET role = 'Managing Director', bio = 'Visionary leader with 22+ years of experience in the construction industry.' WHERE email = 'md@civitech.lk';
UPDATE members SET role = 'Technical Director', bio = 'Engineering mastermind specializing in complex structural designs.' WHERE email = 'technical@civitech.lk';
UPDATE members SET role = 'General Admin', bio = 'Managing administrative operations and team coordination.' WHERE email = 'admin@civitech.lk';
