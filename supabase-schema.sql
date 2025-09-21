-- Supabase Database Schema for Skylers Website
-- Run these commands in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER TABLE IF EXISTS site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;

-- Site Content Table
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    section_id VARCHAR(50) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Photos Table
CREATE TABLE IF NOT EXISTS site_photos (
    id SERIAL PRIMARY KEY,
    section_id VARCHAR(50) UNIQUE NOT NULL,
    photo_data TEXT NOT NULL, -- Base64 encoded image data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials Table (for future use)
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    testimonial TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
-- Allow public read access to all tables
CREATE POLICY "Allow public read access" ON site_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON site_photos FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON testimonials FOR SELECT USING (true);

-- Allow public insert/update access (for owner interface)
CREATE POLICY "Allow public insert" ON site_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON site_content FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON site_photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON site_photos FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON blog_posts FOR UPDATE USING (true);

CREATE POLICY "Allow public insert" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON testimonials FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_content_section_id ON site_content(section_id);
CREATE INDEX IF NOT EXISTS idx_site_photos_section_id ON site_photos(section_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);

-- Insert some sample data (optional)
INSERT INTO site_content (section_id, content) VALUES 
('about', 'With over 10 years of experience in canine behavior and training, I believe that every dog has the potential to be their best self. My approach combines positive reinforcement techniques with understanding each dog''s unique personality and needs.\n\nI specialize in basic training, behavioral modification, and puppy classes, always prioritizing the bond between you and your dog. Every training session is tailored to your dog''s specific challenges and your family''s lifestyle.')
ON CONFLICT (section_id) DO NOTHING;

INSERT INTO blog_posts (title, content) VALUES 
('Welcome to Canine Coaching!', 'Welcome to our new website! We''re excited to share our passion for dog training with you. Stay tuned for helpful tips and training advice.')
ON CONFLICT DO NOTHING;

-- Update the updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON site_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_photos_updated_at BEFORE UPDATE ON site_photos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
