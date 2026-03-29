<?php
/**
 * TEMPORARY DIAGNOSTIC FILE - DELETE AFTER TESTING
 * Visit: https://pragyanedusec.in/api/test.php
 */
header('Content-Type: application/json');

$result = [];

// Test 1: PHP is running
$result['php_version'] = phpversion();
$result['php_working'] = true;

// Test 2: db_config.php loads
try {
    require_once 'db_config.php';
    $result['db_config_loaded'] = true;
    $result['db_name'] = DB_NAME;
    $result['db_user'] = DB_USER;
    $result['db_host'] = DB_HOST;
} catch (Exception $e) {
    $result['db_config_loaded'] = false;
    $result['db_config_error'] = $e->getMessage();
}

// Test 3: Database connection
try {
    $pdo = get_db_connection();
    if ($pdo) {
        $result['db_connected'] = true;
        // Test 4: Table exists
        $stmt = $pdo->query("SHOW TABLES LIKE 'contact_messages'");
        $result['table_exists'] = $stmt->rowCount() > 0;
    } else {
        $result['db_connected'] = false;
        $result['db_error'] = 'get_db_connection() returned null - check error log';
    }
} catch (Exception $e) {
    $result['db_connected'] = false;
    $result['db_error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>
