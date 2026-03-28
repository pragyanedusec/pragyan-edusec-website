<?php
/**
 * Database Configuration for Hostinger
 * =====================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Log in to Hostinger hPanel: https://hpanel.hostinger.com
 * 2. Go to: Databases → MySQL Databases
 * 3. Create a new database:
 *    - Database Name: (you choose, e.g., pragyan_contact)
 *    - Username: (you choose, e.g., pragyan_admin)
 *    - Password: (use a strong password)
 * 4. After creation, Hostinger prefixes your username to the names:
 *    - DB Name becomes: u123456789_pragyan_contact  
 *    - DB User becomes: u123456789_pragyan_admin
 * 5. Open phpMyAdmin from hPanel
 * 6. Select your database and go to SQL tab
 * 7. Paste the contents of sql/schema.sql and run it
 * 8. Replace the placeholder values below with your actual credentials
 * 
 * NOTE: DB_HOST for Hostinger shared hosting is always 'localhost'
 */

// ===== UPDATE THESE VALUES WITH YOUR HOSTINGER DATABASE CREDENTIALS =====
define('DB_HOST', 'localhost');                    // Keep as 'localhost' for Hostinger
define('DB_NAME', 'u734784864_pragyan_db');        // Actual database name
define('DB_USER', 'u734784864_admin');             // Actual database username  
define('DB_PASS', 'PragyanDb@2026!');              // Actual database password
// ========================================================================

function get_db_connection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // Log error and return null
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}
?>
