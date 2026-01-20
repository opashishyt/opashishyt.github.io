# 📁 Uploads Directory

## Purpose
This directory stores user-uploaded files for portfolio projects.

## Security Measures
- File type restrictions applied
- Size limits enforced (10MB max)
- PHP execution disabled
- Directory listing prevented

## File Types Allowed
- Images: .jpg, .jpeg, .png, .gif
- Documents: .pdf, .doc, .docx, .xls, .xlsx, .txt

## File Types Blocked
- Executables: .php, .exe, .sh, .bat
- Scripts: .js, .py, .pl, .rb
- Archives: .zip, .rar, .tar.gz

## Maintenance
- Regular cleanup of old files recommended
- Monitor disk usage
- Backup important files

## Permissions
- Directory: 755 (rwxr-xr-x)
- Files: 644 (rw-r--r--)

## Notes
- Files are automatically named to prevent conflicts
- Uploads are logged for security
- Maximum file size: 10MB per file