<?php
header('Content-Type: application/json');
error_reporting(0);

// Database credentials
$mysqlHost = 'localhost';
$mysqlUser = 'root';
$mysqlPass = '';
$mysqlDb = 'user_management'; // MySQL database

// MongoDB credentials
$mongoHost = 'localhost';
$mongoPort = 27017;
$mongoDb = 'user_management'; // MongoDB database

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
$password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password
$dob = $_POST['dob'];
$age = $_POST['age'];
$contact_number = $_POST['contact_number'];

// Check if username or email already exists
$stmt = $mysqli->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Username or email already exists.']);
    $stmt->close();
    $mysqli->close();
    exit;
}

// Insert into MySQL
$stmt = $mysqli->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $username, $email, $password);

if ($stmt->execute()) {
    // Get the MySQL inserted ID
    $userId = $stmt->insert_id;

    // Prepare user profile data for MongoDB
    $profileData = [
        'userId' => $userId,
        'username' => $username,
        'email' => $email,
        'dob' => $dob,
        'age' => $age,
        'contact_number' => $contact_number
    ];

    // Insert into MongoDB
    $bulk = new MongoDB\Driver\BulkWrite;
    $bulk->insert($profileData);
    
    try {
        $result = $mongoManager->executeBulkWrite("$mongoDb.$mongoCollection", $bulk);
        if ($result->getInsertedCount() === 1) {
            echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create user profile in MongoDB']);
        }
    } catch (MongoDB\Driver\Exception\Exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'MongoDB Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to register user in MySQL']);
}

// Close connections
$stmt->close();
$mysqli->close();
?>
