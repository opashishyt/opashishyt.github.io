<?php
// config.php
session_start();

// Database connection for Android (Termux)
$host = 'localhost';
$dbname = 'op_ashish_yt';
$username = 'root';
$password = '';

try {
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Set UTF-8 encoding
    $conn->set_charset("utf8");
    
} catch(Exception $e) {
    die("Database error: " . $e->getMessage());
}

// Admin credentials
$admin_username = "opashishyt";
$admin_password = "Ashish@2006";
?>