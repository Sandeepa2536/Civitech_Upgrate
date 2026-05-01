CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow public to insert inquiries (Contact form)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Insert" ON inquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin Select" ON inquiries FOR SELECT TO authenticated USING (true);
