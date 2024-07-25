<?php
// Database credentials
$mongoHost = 'localhost';
$mongoPort = 27017;
$mongoDb = 'user_management'; // MongoDB database

// Create MongoDB connection
$mongoManager = new MongoDB\Driver\Manager("mongodb://$mongoHost:$mongoPort");
$mongoCollection = 'profiles';

// Get username from query parameter
$username = isset($_GET['username']) ? $_GET['username'] : null;

if ($username) {
    // Fetch from MongoDB
    $filter = ['username' => $username];
    $query = new MongoDB\Driver\Query($filter);
    $rows = $mongoManager->executeQuery("$mongoDb.$mongoCollection", $query)->toArray();
    $mongoUser = isset($rows[0]) ? (array)$rows[0] : null;

    if ($mongoUser) {
        $response = [
            'status' => 'success',
            'data' => [
                'username' => $mongoUser['username'],
                'email' => $mongoUser['email'],
                'dob' => $mongoUser['dob'],
                'age' => $mongoUser['age'],
                'contact_number' => $mongoUser['contact_number']
            ]
        ];
    } else {
        $response = [
            'status' => 'error',
            'message' => 'User not found.'
        ];
    }

    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Username not provided.']);
}
?>