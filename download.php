<?php
require_once 'config.php';

if(!isset($_GET['id'])) {
    header('Location: index.php');
    exit();
}

$id = $_GET['id'];

// Get app details
$stmt = $pdo->prepare("SELECT * FROM apps WHERE id = ?");
$stmt->execute([$id]);
$app = $stmt->fetch();

if(!$app) {
    header('Location: index.php');
    exit();
}

// Increment download count
$update_stmt = $pdo->prepare("UPDATE apps SET downloads = downloads + 1 WHERE id = ?");
$update_stmt->execute([$id]);

// Serve the file
$file_path = $app['apk_file'];
if(file_exists($file_path)) {
    header('Content-Type: application/vnd.android.package-archive');
    header('Content-Disposition: attachment; filename="' . basename($app['name']) . '.apk"');
    header('Content-Length: ' . filesize($file_path));
    readfile($file_path);
    exit();
} else {
    echo "File not found!";
}
?>