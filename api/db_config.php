<?php
/**
 * Database Configuration for Hostinger
 */

// ===== HOSTINGER DATABASE CREDENTIALS =====
define('DB_HOST', 'localhost');
define('DB_NAME', 'u734784864_pragyan_db');
define('DB_USER', 'u734784864_admin');
define('DB_PASS', 'Pragyanedusec@888');
// ==========================================

function get_db_connection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4;connect_timeout=5";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 5,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        error_log("Database connection failed: " . $e->getMessage());
        return null;
    }
}
?>
