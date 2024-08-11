<?php
header('Content-Type: application/json');
error_reporting(0);

session_start();

// Database credentials
$mysqlHost = 'localhost';
$mysqlUser = 'root';
$mysqlPass = '';
$mysqlDb = 'user_management';

// MongoDB credentials
$mongoHost = 'localhost';
$mongoPort = 27017;
$mongoDb = 'user_management';

// Create MySQL connection
$mysqli = new mysqli($mysqlHost, $mysqlUser, $mysqlPass, $mysqlDb);

// Check connection
if ($mysqli->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'MySQL connection failed: ' . $mysqli->connect_error]);
    exit;
}

// Create MongoDB connection
$mongoManager = new MongoDB\Driver\Manager("mongodb://$mongoHost:$mongoPort");
$mongoCollection = 'profiles';

// Get POST data
$username = $_POST['username'];
$email = $_POST['email'];
$dob = $_POST['dob'];
$age = $_POST['age'];
$contact_number = $_POST['contact_number'];

// Validate email existence
$mysqlEmailCheck = $mysqli->prepare("SELECT * FROM users WHERE email = ? AND username != ?");
$mysqlEmailCheck->bind_param('ss', $email, $username);
$mysqlEmailCheck->execute();
$mysqlEmailCheckResult = $mysqlEmailCheck->get_result();

$mongoEmailCheck = new MongoDB\Driver\Query(['email' => $email, 'username' => ['$ne' => $username]]);
$mongoEmailCheckResult = $mongoManager->executeQuery("$mongoDb.$mongoCollection", $mongoEmailCheck)->toArray();

if ($mysqlEmailCheckResult->num_rows > 0 || !empty($mongoEmailCheckResult)) {
    echo json_encode(['status' => 'error', 'message' => 'Email already exists']);
    exit;
}

// Validate age
if (!is_numeric($age) || $age < 0 || $age > 999) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid age']);
    exit;
}

// Validate contact number
if (!preg_match('/^\d{10}$/', $contact_number)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid contact number']);
    exit;
}

// Update MySQL
$stmt = $mysqli->prepare("UPDATE users SET email = ? WHERE username = ?");
$stmt->bind_param('ss', $email, $username);

if ($stmt->execute()) {
    // Update MongoDB
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->update(
        ['username' => $username],
        ['$set' => ['email' => $email, 'dob' => $dob, 'age' => $age, 'contact_number' => $contact_number]],
        ['multi' => false, 'upsert' => false]
    );

    try {
        $result = $mongoManager->executeBulkWrite("$mongoDb.$mongoCollection", $bulk);
        if ($result->getModifiedCount() === 1) {
            echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update profile in MongoDB']);
        }
    } catch (MongoDB\Driver\Exception\Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'MongoDB Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update profile in MySQL']);
}

$mysqli->close();

// Catch-all block to ensure valid JSON response
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['status' => 'error', 'message' => 'JSON encoding error: ' . json_last_error_msg()]);
}
?>
