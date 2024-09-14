<?php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Content-Type: application/json');
require '../includes/predis_session.php'; // Include the Redis session handler

// Database connection
$conn = new mysqli("localhost", "root", "", "user_management");

// Check connection
if ($conn->connect_error) {
    echo json_encode(["status" => "Error: Failed to connect to database", "error" => $conn->connect_error]);
    exit;
}

// Get POST data
$username_email = isset($_POST['username_email']) ? $_POST['username_email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// Validate input
if (empty($username_email) || empty($password)) {
    echo json_encode(["status" => "Error: All fields are required."]);
    exit;
}

// Prepare and bind
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
if ($stmt === false) {
    echo json_encode(["status" => "Error: Failed to prepare statement", "error" => $conn->error]);
    exit;
}
$stmt->bind_param("ss", $username_email, $username_email);

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists and verify password
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        // Regenerate session ID to prevent session fixation attacks
        session_regenerate_id(true);

        // Store username in session
        $_SESSION['user'] = $user['username'];

        // Return success response
        echo json_encode(["status" => "Login successful!", "user" => $user['username']]);
    } else {
        echo json_encode(["status" => "Error: Invalid credentials."]);
    }
} else {
    echo json_encode(["status" => "Error: Invalid credentials."]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
