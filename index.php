<?php
require_once 'config.php';

// Get featured apps
$stmt = $pdo->query("SELECT * FROM apps ORDER BY downloads DESC LIMIT 6");
$featured_apps = $stmt->fetchAll();

// Get all apps
$stmt = $pdo->query("SELECT * FROM apps ORDER BY created_at DESC");
$all_apps = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OP ASHISH YT - MOD APK Downloads</title>
    <meta name="description" content="Download MOD APK Games and Apps for free">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo">
                <img src="assets/img/logo.png" alt="OP ASHISH YT Logo">
                <span>OP ASHISH YT</span>
            </div>
            <div class="nav-links">
                <a href="index.php">Home</a>
                <a href="#apps">Apps</a>
                <a href="#games">Games</a>
                <a href="search.php">Search</a>
                <?php if(isset($_SESSION['admin_logged_in'])): ?>
                    <a href="admin/dashboard.php">Dashboard</a>
                <?php endif; ?>
            </div>
        </nav>
    </header>

    <section class="hero">
        <div class="hero-content">
            <h1>Download MOD APK Apps & Games</h1>
            <p>Unlocked Features • Premium Content • Free Downloads</p>
            <a href="#featured" class="btn-primary">Explore Apps</a>
        </div>
    </section>

    <section id="featured" class="featured-apps">
        <h2>Featured Apps</h2>
        <div class="apps-grid">
            <?php foreach($featured_apps as $app): ?>
            <div class="app-card">
                <img src="<?= $app['logo'] ?: 'assets/img/default-logo.png' ?>" alt="<?= $app['name'] ?>">
                <h3><?= htmlspecialchars($app['name']) ?></h3>
                <p><?= substr($app['description'], 0, 100) ?>...</p>
                <div class="app-info">
                    <span>Version: <?= $app['version'] ?></span>
                    <span>Size: <?= $app['size'] ?></span>
                </div>
                <a href="download.php?id=<?= $app['id'] ?>" class="btn-download">Download APK</a>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <section id="apps" class="all-apps">
        <h2>All Apps & Games</h2>
        <div class="apps-list">
            <?php foreach($all_apps as $app): ?>
            <div class="app-item">
                <img src="<?= $app['logo'] ?: 'assets/img/default-logo.png' ?>" alt="<?= $app['name'] ?>">
                <div class="app-details">
                    <h3><?= htmlspecialchars($app['name']) ?></h3>
                    <p><?= $app['description'] ?></p>
                    <div class="meta">
                        <span>Version: <?= $app['version'] ?></span>
                        <span>Size: <?= $app['size'] ?></span>
                        <span>Downloads: <?= $app['downloads'] ?></span>
                    </div>
                    <a href="download.php?id=<?= $app['id'] ?>" class="btn-download">Download Now</a>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <div class="footer-logo">
                <h3>OP ASHISH YT</h3>
                <p>Your trusted source for MOD APK downloads</p>
            </div>
            <div class="footer-links">
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="admin/login.php">Admin Login</a>
            </div>
        </div>
        <p class="copyright">© 2024 OP ASHISH YT. All rights reserved.</p>
    </footer>

    <script src="assets/js/script.js"></script>
</body>
</html>