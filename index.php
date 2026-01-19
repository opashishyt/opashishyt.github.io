<?php
include 'config.php';

// Get apps from database
$sql = "SELECT * FROM apps ORDER BY id DESC LIMIT 6";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OP ASHISH YT - MOD APK Download</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: #f5f5f5;
            color: #333;
        }
        
        .container {
            width: 95%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }
        
        /* Header */
        header {
            background: linear-gradient(135deg, #ff4757, #3742fa);
            color: white;
            padding: 15px 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo h1 {
            font-size: 24px;
            font-weight: 800;
        }
        
        .logo i {
            font-size: 28px;
            color: #ffd700;
        }
        
        /* Navigation */
        nav {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        nav a {
            color: white;
            text-decoration: none;
            padding: 8px 15px;
            border-radius: 5px;
            transition: 0.3s;
            font-weight: 500;
        }
        
        nav a:hover {
            background: rgba(255,255,255,0.1);
        }
        
        .admin-link {
            background: #ffd700;
            color: #333 !important;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3');
            background-size: cover;
            background-position: center;
            color: white;
            text-align: center;
            padding: 80px 20px;
            margin-bottom: 40px;
            border-radius: 0 0 20px 20px;
        }
        
        .hero h2 {
            font-size: 36px;
            margin-bottom: 20px;
            color: white;
        }
        
        .hero p {
            font-size: 18px;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        
        .btn {
            display: inline-block;
            background: #ff4757;
            color: white;
            padding: 12px 30px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
        }
        
        /* Apps Grid */
        .section-title {
            text-align: center;
            margin: 40px 0;
            font-size: 32px;
            color: #333;
        }
        
        .apps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 50px;
        }
        
        .app-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }
        
        .app-card:hover {
            transform: translateY(-5px);
        }
        
        .app-image {
            height: 150px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 40px;
        }
        
        .app-info {
            padding: 20px;
        }
        
        .app-title {
            font-size: 20px;
            margin-bottom: 10px;
            color: #333;
        }
        
        .app-details {
            color: #666;
            margin-bottom: 15px;
        }
        
        .download-btn {
            display: block;
            text-align: center;
            background: #27ae60;
            color: white;
            padding: 10px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        
        /* Footer */
        footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 30px 0;
            margin-top: 50px;
        }
        
        .copyright {
            margin-top: 20px;
            color: #bbb;
            font-size: 14px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                text-align: center;
            }
            
            nav {
                margin-top: 15px;
                justify-content: center;
            }
            
            .hero h2 {
                font-size: 28px;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <i class="fas fa-download"></i>
                    <h1>OP ASHISH YT</h1>
                </div>
                
                <nav>
                    <a href="index.php"><i class="fas fa-home"></i> Home</a>
                    <a href="#"><i class="fas fa-gamepad"></i> Games</a>
                    <a href="#"><i class="fas fa-app-store-ios"></i> Apps</a>
                    <a href="admin/login.php" class="admin-link">
                        <i class="fas fa-user-shield"></i> Admin
                    </a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h2>Download Premium MOD APKs</h2>
            <p>Unlocked Features • No Ads • 100% Safe • Free Download</p>
            <a href="#apps" class="btn">Browse Apps</a>
        </div>
    </section>

    <!-- Apps Section -->
    <section class="container" id="apps">
        <h2 class="section-title">Featured MOD APKs</h2>
        
        <div class="apps-grid">
            <?php if ($result->num_rows > 0): ?>
                <?php while($app = $result->fetch_assoc()): ?>
                <div class="app-card">
                    <div class="app-image">
                        <?php if(!empty($app['app_logo'])): ?>
                            <img src="uploads/images/<?php echo $app['app_logo']; ?>" 
                                 alt="<?php echo $app['app_name']; ?>"
                                 style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                        <?php else: ?>
                            <i class="fas fa-mobile-alt"></i>
                        <?php endif; ?>
                    </div>
                    
                    <div class="app-info">
                        <h3 class="app-title"><?php echo $app['app_name']; ?></h3>
                        <div class="app-details">
                            <p><strong>Version:</strong> <?php echo $app['app_version']; ?></p>
                            <p><strong>Size:</strong> <?php echo $app['app_size']; ?></p>
                            <p><strong>Category:</strong> <?php echo $app['category']; ?></p>
                        </div>
                        
                        <a href="download.php?id=<?php echo $app['id']; ?>" class="download-btn">
                            <i class="fas fa-download"></i> Download Now
                        </a>
                    </div>
                </div>
                <?php endwhile; ?>
            <?php else: ?>
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>No apps available yet.</h3>
                    <p>Admin से apps add करवाएं</p>
                </div>
            <?php endif; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <h3>OP ASHISH YT</h3>
            <p>Your trusted source for MOD APK downloads</p>
            
            <div class="copyright">
                <p>&copy; 2023 OP ASHISH YT. All rights reserved.</p>
                <p>Made with <i class="fas fa-heart" style="color: #ff4757;"></i> for Android users</p>
            </div>
        </div>
    </footer>
</body>
</html>
<?php $conn->close(); ?>