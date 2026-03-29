<?php
/**
 * API Endpoint: Contact Form Submission
 * Handles POST requests from the contact form.
 * Stores data in Hostinger MySQL database.
 */

// Set max execution time to 10 seconds - prevents hanging forever
set_time_limit(10);

header('Content-Type: application/json');

// Allow CORS for same-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'db_config.php';

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$institution = trim($_POST['institution'] ?? '');
$message = trim($_POST['message'] ?? '');

// Server-side validation
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address.']);
    exit;
}

// Sanitize inputs
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$institution = htmlspecialchars($institution, ENT_QUOTES, 'UTF-8');

// Determine inquiry type based on subject
$institutional_subjects = ['fdp', 'sdp', 'mou', 'innovation-lab', 'hackathon-host'];
$inquiry_type = in_array($subject, $institutional_subjects) ? 'institutional' : 'student';

// Database Connection
$pdo = get_db_connection();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed. Please try again later.']);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO contact_messages (full_name, email, phone, subject, institution, message, inquiry_type) 
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$name, $email, $phone, $subject, $institution, $message, $inquiry_type]);

    // NOTE: mail() removed — was blocking PHP and causing form to hang.
    // View submissions at: hPanel → Databases → Enter phpMyAdmin → contact_messages table

    echo json_encode(['status' => 'success', 'message' => 'Thank you for your message! We will get back to you soon.']);
} catch (PDOException $e) {
    error_log("DB Insert Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save message. Please try again later.']);
}
?>
