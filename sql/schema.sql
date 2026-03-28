-- Database Schema for Pragyan EduSec Contact Form
-- Hostinger compatible MySQL schema
-- 
-- HOW TO USE:
-- 1. Log in to Hostinger hPanel → Databases → MySQL Databases
-- 2. Create a new database and database user
-- 3. Open phpMyAdmin from hPanel
-- 4. Select your database and run this SQL in the SQL tab

CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) DEFAULT NULL,
    `subject` VARCHAR(100) DEFAULT NULL,
    `institution` VARCHAR(255) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `inquiry_type` ENUM('institutional', 'student') DEFAULT 'institutional',
    `status` ENUM('new', 'read', 'replied') DEFAULT 'new',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index for faster lookups
CREATE INDEX idx_status ON contact_messages(status);
CREATE INDEX idx_created_at ON contact_messages(created_at);
