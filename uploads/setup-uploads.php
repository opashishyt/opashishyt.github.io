<?php
// setup-uploads.php
// यह स्क्रिप्ट अपलोड फोल्डर्स और परमिशंस सेटअप करेगी

echo '<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <title>Uploads Setup - OP ASHISH YT</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f5f7fb; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; }
        .step { background: #f8fafc; padding: 15px; margin: 10px 0; border-left: 4px solid #2563eb; }
        .success { color: #059669; background: #d1fae5; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: #dc2626; background: #fee2e2; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .btn { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📁 Uploads Folder Setup</h1>';

try {
    // Step 1: Create uploads directory
    echo '<div class="step"><strong>Step 1:</strong> Creating Uploads Directory...</div>';
    
    $folders = [
        'uploads',
        'uploads/images',
        'uploads/apk', 
        'uploads/temp',
        'uploads/backup'
    ];
    
    foreach($folders as $folder) {
        if(!file_exists($folder)) {
            if(mkdir($folder, 0755, true)) {
                echo '<div class="success">✅ Folder created: ' . $folder . '</div>';
                
                // Create .gitkeep file
                file_put_contents($folder . '/.gitkeep', '');
                file_put_contents($folder . '/README.txt', getReadmeContent($folder));
                
                // Create index.html for security
                file_put_contents($folder . '/index.html', '<!DOCTYPE html><html><head><title>403 Forbidden</title></head><body><h1>Access Forbidden</h1></body></html>');
            } else {
                echo '<div class="error">❌ Failed to create: ' . $folder . '</div>';
            }
        } else {
            echo '<div class="success">✅ Already exists: ' . $folder . '</div>';
        }
    }
    
    // Step 2: Set permissions
    echo '<div class="step"><strong>Step 2:</strong> Setting Permissions...</div>';
    
    foreach($folders as $folder) {
        if(chmod($folder, 0755)) {
            echo '<div class="success">✅ Permissions set: ' . $folder . ' (0755)</div>';
        }
    }
    
    // Step 3: Create config files
    echo '<div class="step"><strong>Step 3:</strong> Creating Configuration Files...</div>';
    
    $config_content = json_encode([
        'upload_config' => [
            'max_image_size' => '2MB',
            'max_apk_size' => '200MB',
            'created_at' => date('Y-m-d H:i:s')
        ]
    ], JSON_PRETTY_PRINT);
    
    if(file_put_contents('uploads/config.json', $config_content)) {
        echo '<div class="success">✅ Config file created: uploads/config.json</div>';
    }
    
    // Step 4: Create upload handler
    echo '<div class="step"><strong>Step 4:</strong> Creating Upload Handler...</div>';
    
    $handler_content = '<?php
// Upload Security Check
if (!defined(\'UPLOAD_SECURE\')) {
    die("Direct access not allowed");
}

class UploadHandler {
    // Upload handler class
}
?>';
    
    if(file_put_contents('uploads/upload-handler.php', $handler_content)) {
        echo '<div class="success">✅ Upload handler created</div>';
    }
    
    // Step 5: Create .htaccess for security
    echo '<div class="step"><strong>Step 5:</strong> Adding Security...</div>';
    
    $htaccess_content = 'Options -Indexes
Deny from all

<FilesMatch "\.(jpg|jpeg|png|gif|webp|apk)$">
    Order Allow,Deny
    Deny from all
</FilesMatch>

# Allow access only from server
<Files "config.json|upload-handler.php">
    Order Allow,Deny
    Deny from all
</Files>';
    
    if(file_put_contents('uploads/.htaccess', $htaccess_content)) {
        echo '<div class="success">✅ Security file (.htaccess) created</div>';
    }
    
    echo '<div class="step" style="background: #d1fae5;">
            <h3>✅ Setup Complete!</h3>
            <p><strong>Uploads Directory:</strong> /uploads/</p>
            <p><strong>Total Folders Created:</strong> ' . count($folders) . '</p>
            <p><strong>Next Step:</strong> Add apps using admin panel</p>
          </div>';
    
    echo '<div style="text-align:center; margin-top:30px;">
            <a href="../index.html" class="btn">View Website</a>
            <a href="../admin/login.html" class="btn" style="background:#059669;">Admin Login</a>
          </div>';
    
} catch(Exception $e) {
    echo '<div class="error">❌ Setup Failed: ' . $e->getMessage() . '</div>';
}

echo '</div></body></html>';

function getReadmeContent($folder) {
    $contents = [
        'uploads' => "MAIN UPLOADS DIRECTORY\n\nContains all uploaded files\nDo not modify manually",
        'uploads/images' => "APP LOGOS DIRECTORY\n\nStore app logos here\nFormats: JPG, PNG, GIF, WebP\nMax size: 2MB",
        'uploads/apk' => "APK FILES DIRECTORY\n\nStore Android APK files here\nOnly .apk files allowed\nMax size: 200MB",
        'uploads/temp' => "TEMPORARY FILES\n\nAuto-cleaned every 24 hours\nDo not store permanent files here",
        'uploads/backup' => "BACKUP DIRECTORY\n\nAutomatic backups of uploaded files\nCreated daily at 2 AM"
    ];
    
    return $contents[$folder] ?? "Directory: $folder\nCreated: " . date('Y-m-d H:i:s');
}
?>