-- MySQL Database Schema for Skylers Website
-- Run these commands in your SiteWorks phpMyAdmin or MySQL database

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS `sondraha_skylers-site` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sondraha_skylers-site`;

-- Site Content Table
CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id VARCHAR(50) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Site Photos Table
CREATE TABLE IF NOT EXISTS site_photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id VARCHAR(50) UNIQUE NOT NULL,
    photo_data TEXT NOT NULL, -- Base64 encoded image data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    testimonial TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Training Sessions Table (for scheduler form)
CREATE TABLE IF NOT EXISTS training_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dog_name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age VARCHAR(50) NOT NULL,
    training_goals TEXT,
    behavioral_issues TEXT,
    time_slot VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_content_section_id ON site_content(section_id);
CREATE INDEX IF NOT EXISTS idx_site_photos_section_id ON site_photos(section_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_sessions_submitted_at ON training_sessions(submitted_at DESC);

-- Insert sample data
INSERT INTO site_content (section_id, content) VALUES 
('about', 'With over 10 years of experience in canine behavior and training, I believe that every dog has the potential to be their best self. My approach combines positive reinforcement techniques with understanding each dog''s unique personality and needs.\n\nI specialize in basic training, behavioral modification, and puppy classes, always prioritizing the bond between you and your dog. Every training session is tailored to your dog''s specific challenges and your family''s lifestyle.')
ON DUPLICATE KEY UPDATE content = VALUES(content);

INSERT INTO blog_posts (title, content) VALUES 
('Welcome to Canine Coaching!', 'Welcome to our new website! We''re excited to share our passion for dog training with you. Stay tuned for helpful tips and training advice.')
ON DUPLICATE KEY UPDATE content = VALUES(content);

-- Insert sample testimonials
INSERT INTO testimonials (name, testimonial, rating) VALUES 
('Jennifer and Max', 'Skyler transformed our rescue dog from anxious and reactive to confident and calm. The techniques she taught us have been life-changing!', 5),
('Mike and Luna', 'Our puppy was a handful, but Skyler''s patience and expertise helped us establish good habits from the start. Highly recommend!', 5),
('Lisa and Charlie', 'The behavioral modification program worked wonders for our dog''s separation anxiety. Skyler''s approach is both effective and compassionate.', 5)
ON DUPLICATE KEY UPDATE testimonial = VALUES(testimonial);
