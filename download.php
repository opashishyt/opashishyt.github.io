<?php
// download.php
include 'config.php';

if(isset($_GET['id'])) {
    $id = $_GET['id'];
    
    // Get app details
    $sql = "SELECT * FROM apps WHERE id = '$id'";
    $result = $conn->query($sql);
    
    if($result->num_rows > 0) {
        $app = $result->fetch_assoc();
        
        // Update download count
        $update_sql = "UPDATE apps SET download_count = download_count + 1 WHERE id = '$id'";
        $conn->query($update_sql);
        
        // Redirect to download link
        header("Location: " . $app['download_link']);
        exit();
    }
}

// If no app found, redirect to home
header("Location: index.php");
exit();
?>