-- Seed sample data for testing members
INSERT INTO members (fname, lname, mobile, email, password, status_id) VALUES 
('Sandeepa', 'S.K.M.', '0703747474', 'md@civitech.lk', 'admin123', 1),
('Aruna', 'Perera', '0771234567', 'technical@civitech.lk', 'admin123', 1),
('Admin', 'User', '0112263059', 'admin@civitech.lk', 'admin123', 1);

-- Also add profiles for them
INSERT INTO member_profile (path, members_id) VALUES
('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop', 1),
('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop', 2),
('https://picsum.photos/seed/admin/400/400', 3);
