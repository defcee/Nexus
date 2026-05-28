-- ============================================================================
-- Nexus Global Parcel Services - Complete Database Schema
-- ============================================================================
-- This script creates all necessary tables and sample data for the 
-- Nexus Global Parcel application. Run this script on a fresh MySQL database.
-- ============================================================================

-- Create Database
DROP DATABASE IF EXISTS nexus_global_parcel;
CREATE DATABASE nexus_global_parcel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexus_global_parcel;

-- ============================================================================
-- 1. USERS TABLE - Stores registered customer accounts
-- ============================================================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL COMMENT 'International format: +[country_code][number] e.g., +234XXXXXXXXXX, +1XXXXXXXXXX, +44XXXXXXXXXX',
  country_code VARCHAR(5) COMMENT 'Country code prefix (e.g., +234, +1, +44)',
  password VARCHAR(255) NOT NULL COMMENT 'Hashed password using bcrypt',
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. ADMINS TABLE - Stores admin user accounts
-- ============================================================================
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL COMMENT 'Hashed password using bcrypt',
  email VARCHAR(150) UNIQUE,
  full_name VARCHAR(150),
  role VARCHAR(50) DEFAULT 'admin' COMMENT 'admin, moderator, support',
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin (password should be hashed in production)
INSERT INTO admins (username, password, email, full_name, role) 
VALUES ('admin', '$2b$10$E9rnMU.ZkL1zFGhyL.cVOeVHrMPcbwvfJfFfZqKxGFZ.N7XZfXWvK', 'admin@nexusglobalparcel.com', 'Admin User', 'admin')
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- ============================================================================
-- 3. PACKAGES TABLE - Stores all shipment records
-- ============================================================================
CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(100) UNIQUE NOT NULL COMMENT 'e.g., NEX1234567890',
  user_id INT COMMENT 'Sender user ID if registered',
  sender_name VARCHAR(150) NOT NULL,
  sender_phone VARCHAR(20),
  sender_email VARCHAR(150),
  sender_address TEXT,
  sender_city VARCHAR(100),
  sender_state VARCHAR(100),
  sender_country VARCHAR(100),
  receiver_name VARCHAR(150) NOT NULL,
  receiver_phone VARCHAR(20) NOT NULL,
  receiver_email VARCHAR(150),
  receiver_address TEXT NOT NULL,
  receiver_city VARCHAR(100),
  receiver_state VARCHAR(100),
  receiver_country VARCHAR(100),
  receiver_postal_code VARCHAR(20),
  package_type VARCHAR(100) NOT NULL COMMENT 'Document, Parcel, Fragile, Perishable, etc.',
  package_description TEXT,
  weight DECIMAL(10,2) NOT NULL COMMENT 'Weight in kg',
  width DECIMAL(10,2) COMMENT 'Dimensions in cm',
  height DECIMAL(10,2),
  depth DECIMAL(10,2),
  declared_value DECIMAL(10,2) COMMENT 'For insurance purposes',
  insurance_selected BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2) NOT NULL COMMENT 'Shipping cost',
  status VARCHAR(50) DEFAULT 'Pending' COMMENT 'Pending, In Transit, Out for Delivery, Delivered, Cancelled, Returned',
  current_location VARCHAR(255),
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  eta DATETIME,
  proof_photo_url VARCHAR(255),
  signature_required BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_status (status),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_receiver_email (receiver_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. TRACKING HISTORY TABLE - Stores location and status updates
-- ============================================================================
CREATE TABLE tracking_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status VARCHAR(100) NOT NULL,
  notes TEXT,
  updated_by INT COMMENT 'Admin ID who created this update',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_number) REFERENCES packages(tracking_number) ON DELETE CASCADE,
  FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL,
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_updated_at (updated_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. INVOICES TABLE - Stores generated invoices
-- ============================================================================
CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  tracking_number VARCHAR(100),
  user_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2),
  insurance_cost DECIMAL(10,2) DEFAULT 0,
  invoice_file_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'Generated' COMMENT 'Generated, Sent, Paid, Cancelled',
  payment_method VARCHAR(50),
  payment_date DATETIME,
  due_date DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tracking_number) REFERENCES packages(tracking_number) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_invoice_number (invoice_number),
  INDEX idx_user_id (user_id),
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_created_at (created_at),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. CHATS TABLE - Stores customer support chat messages
-- ============================================================================
CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  session_id VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  sender ENUM('user','bot','agent') DEFAULT 'user',
  attachments JSON COMMENT 'Array of attachment URLs',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_session_id (session_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. NOTIFICATIONS TABLE - Stores user notifications
-- ============================================================================
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  tracking_number VARCHAR(100),
  type VARCHAR(50) NOT NULL COMMENT 'status_update, delivery_scheduled, invoice, alert',
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  sms_sent BOOLEAN DEFAULT FALSE,
  read_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tracking_number) REFERENCES packages(tracking_number) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. SERVICE COVERAGE TABLE - Tracks which locations are served
-- ============================================================================
CREATE TABLE service_coverage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  is_covered BOOLEAN DEFAULT TRUE,
  delivery_days INT DEFAULT 2 COMMENT 'Estimated delivery days',
  shipping_cost_per_kg DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_location (state, city, country, postal_code),
  INDEX idx_country (country),
  INDEX idx_is_covered (is_covered),
  INDEX idx_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SAMPLE DATA - Service Coverage for Nigeria
-- ============================================================================
INSERT INTO service_coverage (state, country, city, postal_code, is_covered, delivery_days, shipping_cost_per_kg) VALUES
('Rivers State', 'Nigeria', 'Port Harcourt', '500001', TRUE, 1, 500),
('Rivers State', 'Nigeria', 'Port Harcourt', '500002', TRUE, 1, 500),
('Rivers State', 'Nigeria', 'Port Harcourt', '500003', TRUE, 1, 500),
('Lagos State', 'Nigeria', 'Lagos', '100001', TRUE, 1, 400),
('Lagos State', 'Nigeria', 'Lagos', '100242', TRUE, 1, 400),
('Lagos State', 'Nigeria', 'Lagos', '100271', TRUE, 1, 400),
('Lagos State', 'Nigeria', 'Ikorodu', '100001', TRUE, 2, 450),
('Lagos State', 'Nigeria', 'Lekki', '106104', TRUE, 1, 400),
('Enugu State', 'Nigeria', 'Enugu', '400001', TRUE, 2, 550),
('Enugu State', 'Nigeria', 'Enugu', '400242', TRUE, 2, 550),
('Abuja', 'Nigeria', 'Abuja', '900001', TRUE, 2, 450),
('Abuja', 'Nigeria', 'Abuja', '900211', TRUE, 2, 450),
('Kano State', 'Nigeria', 'Kano', '700001', TRUE, 3, 600),
('Kano State', 'Nigeria', 'Kano', '700247', TRUE, 3, 600),
('Kaduna State', 'Nigeria', 'Kaduna', '800001', TRUE, 2, 500),
('Kaduna State', 'Nigeria', 'Kaduna', '800213', TRUE, 2, 500),
('Oyo State', 'Nigeria', 'Ibadan', '200001', TRUE, 2, 500),
('Oyo State', 'Nigeria', 'Ibadan', '200284', TRUE, 2, 500),
('Delta State', 'Nigeria', 'Warri', '534102', TRUE, 2, 550),
('Delta State', 'Nigeria', 'Benin City', '300001', TRUE, 2, 550)
ON DUPLICATE KEY UPDATE is_covered=VALUES(is_covered);

-- ============================================================================
-- 9. SESSIONS TABLE - For session management (optional)
-- ============================================================================
CREATE TABLE sessions (
  id VARCHAR(128) PRIMARY KEY,
  user_id INT,
  session_data JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. AUDIT LOG TABLE - For tracking important actions
-- ============================================================================
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) COMMENT 'users, packages, invoices, admins',
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_admin_id (admin_id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ============================================================================
CREATE INDEX idx_packages_status_date ON packages(status, created_at DESC);
CREATE INDEX idx_packages_user_created ON packages(user_id, created_at DESC);
CREATE INDEX idx_tracking_history_number_date ON tracking_history(tracking_number, updated_at DESC);
CREATE INDEX idx_chats_session_date ON chats(session_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_invoices_user_status ON invoices(user_id, status, created_at DESC);

-- ============================================================================
-- VIEWS FOR COMMON REPORTING QUERIES (Optional)
-- ============================================================================

-- View for package delivery stats
CREATE OR REPLACE VIEW package_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_packages,
  SUM(price) as total_revenue,
  COUNT(CASE WHEN status = 'Delivered' THEN 1 END) as delivered,
  COUNT(CASE WHEN status = 'In Transit' THEN 1 END) as in_transit,
  COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending
FROM packages
GROUP BY DATE(created_at);

-- View for user statistics
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as new_users
FROM users
GROUP BY DATE(created_at);

-- ============================================================================
-- DATABASE PERMISSIONS
-- ============================================================================
-- Create application user (adjust username and password)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON nexus_global_parcel.* TO 'nexus_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- FLUSH PRIVILEGES;

-- ============================================================================
-- END OF SCHEMA CREATION
-- ============================================================================
-- Total tables created: 10 (users, admins, packages, tracking_history, invoices, 
--                          chats, notifications, service_coverage, sessions, audit_logs)
-- Total views created: 2 (package_stats, user_stats)
-- ============================================================================
