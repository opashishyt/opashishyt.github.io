<?php
$host = 'localhost';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database
    $sql = "CREATE DATABASE IF NOT EXISTS op_ashish_yt";
    $conn->exec($sql);
    
    // Use database
    $conn->exec("USE op_ashish_yt");
    
    // Create apps table
    $sql = "CREATE TABLE IF NOT EXISTS apps (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        version VARCHAR(50),
        size VARCHAR(20),
        logo VARCHAR(255),
        apk_file VARCHAR(255),
        downloads INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $conn->exec($sql);
    
    // Create admin table
    $sql = "CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $conn->exec($sql);
    
    // Default admin (username: admin, password: admin123)
    $hashed_password = password_hash('admin123', PASSWORD_DEFAULT);
    $sql = "INSERT IGNORE INTO admin (username, password) VALUES ('admin', '$hashed_password')";
    $conn->exec($sql);
    
    echo "Database setup completed successfully!<br>";
    echo "Admin Login: <strong>admin</strong><br>";
    echo "Password: <strong>admin123</strong><br>";
    echo '<a href="index.php">Go to Website</a>';
    
} catch(PDOException $e) {
    die("Setup failed: " . $e->getMessage());
}
?>