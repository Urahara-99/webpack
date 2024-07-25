<?php
require '../vendor/autoload.php'; // Adjust the path if necessary

use Predis\Client;

$redis = new Client([
    'scheme' => 'tcp',
    'host'   => '127.0.0.1',
    'port'   => 6379,
]);

ini_set('session.save_handler', 'redis');
ini_set('session.save_path', "tcp://127.0.0.1:6379");

session_start();
?>
