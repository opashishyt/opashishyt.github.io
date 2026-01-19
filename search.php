<?php
require_once 'config.php';

$search_results = [];
$query = '';

if(isset($_GET['q']) && !empty($_GET['q'])) {
    $query = $_GET['q'];
    $search_term = '%' . $query . '%';
    $stmt = $pdo->prepare("SELECT * FROM apps WHERE name LIKE ? OR description LIKE ? ORDER BY created_at DESC");
    $stmt->execute([$search_term, $search_term]);
    $search_results = $stmt->fetchAll();
}
?>

<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title>Search - OP ASHISH YT</title>
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
                <a href="index.php#apps">Apps</a>
                <a href="index.php#games">Games</a>
                <a href="search.php">Search</a>
            </div>
        </nav>
    </header>

    <section class="search-section">
        <h1>Search Apps</h1>
        <form method="GET" class="search-form">
            <input type="text" name="q" placeholder="Search for apps or games..." value="<?= htmlspecialchars($query) ?>" required>
            <button type="submit">Search</button>
        </form>

        <?php if($query): ?>
            <h2>Search Results for "<?= htmlspecialchars($query) ?>"</h2>
            
            <?php if(count($search_results) > 0): ?>
                <div class="search-results">
                    <?php foreach($search_results as $app): ?>
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
            <?php else: ?>
                <p class="no-results">No apps found matching your search.</p>
            <?php endif; ?>
        <?php endif; ?>
    </section>

    <footer>
        <p class="copyright">© 2024 OP ASHISH YT. All rights reserved.</p>
    </footer>
</body>
</html><?php
require_once 'config.php';

$search_results = [];
$query = '';

if(isset($_GET['q']) && !empty($_GET['q'])) {
    $query = $_GET['q'];
    $search_term = '%' . $query . '%';
    $stmt = $pdo->prepare("SELECT * FROM apps WHERE name LIKE ? OR description LIKE ? ORDER BY created_at DESC");
    $stmt->execute([$search_term, $search_term]);
    $search_results = $stmt->fetchAll();
}
?>

<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title>Search - OP ASHISH YT</title>
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
                <a href="index.php#apps">Apps</a>
                <a href="index.php#games">Games</a>
                <a href="search.php">Search</a>
            </div>
        </nav>
    </header>

    <section class="search-section">
        <h1>Search Apps</h1>
        <form method="GET" class="search-form">
            <input type="text" name="q" placeholder="Search for apps or games..." value="<?= htmlspecialchars($query) ?>" required>
            <button type="submit">Search</button>
        </form>

        <?php if($query): ?>
            <h2>Search Results for "<?= htmlspecialchars($query) ?>"</h2>
            
            <?php if(count($search_results) > 0): ?>
                <div class="search-results">
                    <?php foreach($search_results as $app): ?>
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
            <?php else: ?>
                <p class="no-results">No apps found matching your search.</p>
            <?php endif; ?>
        <?php endif; ?>
    </section>

    <footer>
        <p class="copyright">© 2024 OP ASHISH YT. All rights reserved.</p>
    </footer>
</body>
</html>