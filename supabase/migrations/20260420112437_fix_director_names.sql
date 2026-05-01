-- Fix Director Names and Roles
UPDATE members SET 
    fname = 'Sandeepa', 
    lname = 'S.K.M.', 
    role = 'Managing Director' 
WHERE email = 'md@civitech.lk';

UPDATE members SET 
    fname = 'Eng.', 
    lname = 'Aruna Perera', 
    role = 'Technical Director' 
WHERE email = 'technical@civitech.lk';
