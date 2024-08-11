<?php
require '../vendor/autoload.php'; // Adjust the path if necessary

use Predis\Client;

// Initialize Redis client
$redis = new Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1',
    'port'   => 6379,
]);

// Configure PHP to use Redis for session management
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', "tcp://127.0.0.1:6379");

session_start();

// Make sure nothing is printed here. Use error_log() for any debugging.
