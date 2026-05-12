-- Nexus Global Parcel Services Database Schema
-- This SQL file creates all necessary tables for the application

-- Create Database
CREATE DATABASE IF NOT EXISTS nexus_global_parcel;
USE nexus_global_parcel;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin
INSERT INTO admins (username, password, email) 
VALUES ('admin', MD5('admin123'), 'admin@nexusparcel.com')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- 3. Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(100) UNIQUE NOT NULL,
  user_id INT,
  sender_name VARCHAR(150) NOT NULL,
  sender_phone VARCHAR(20),
  sender_email VARCHAR(150),
  receiver_name VARCHAR(150) NOT NULL,
  receiver_address TEXT NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_email VARCHAR(150),
  package_type VARCHAR(100) NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(100) DEFAULT 'Pending',
  current_location VARCHAR(255) DEFAULT 'Warehouse',
  eta DATETIME,
  proof_photo VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_status (status),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tracking History Table
CREATE TABLE IF NOT EXISTS tracking_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(100) NOT NULL,
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_number) REFERENCES packages(tracking_number) ON DELETE CASCADE,
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_updated_at (updated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(100),
  user_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  invoice_file VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Generated',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_number) REFERENCES packages(tracking_number) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Chat Messages Table
CREATE TABLE IF NOT EXISTS chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message TEXT NOT NULL,
  sender ENUM('user','bot','agent') DEFAULT 'user',
  session_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session_id (session_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  tracking_number VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tracking_number) REFERENCES packages(tracking_number) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Service Coverage Table
CREATE TABLE IF NOT EXISTS service_coverage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  city VARCHAR(100) NOT NULL,
  is_covered BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_location (state, city, postal_code),
  INDEX idx_country (country),
  INDEX idx_is_covered (is_covered)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample coverage data for Nigeria
INSERT INTO service_coverage (state, country, city, is_covered) VALUES
('Rivers State', 'Nigeria', 'Port Harcourt', TRUE),
('Lagos State', 'Nigeria', 'Lagos', TRUE),
('Enugu State', 'Nigeria', 'Enugu', TRUE),
('Abuja', 'Nigeria', 'Abuja', TRUE),
('Kano State', 'Nigeria', 'Kano', TRUE),
('Kaduna State', 'Nigeria', 'Kaduna', TRUE),
('Oyo State', 'Nigeria', 'Ibadan', TRUE),
('Delta State', 'Nigeria', 'Warri', TRUE)
ON DUPLICATE KEY UPDATE is_covered=VALUES(is_covered);

-- Create indexes for better query performance
CREATE INDEX idx_packages_status_date ON packages(status, created_at);
CREATE INDEX idx_tracking_history_date ON tracking_history(updated_at DESC);
CREATE INDEX idx_chats_date ON chats(created_at DESC);
CREATE INDEX idx_notifications_user_date ON notifications(user_id, created_at DESC);

-- Grant privileges (adjust username/host as needed)
-- GRANT ALL PRIVILEGES ON nexus_global_parcel.* TO 'nexus_user'@'localhost';
-- FLUSH PRIVILEGES;
