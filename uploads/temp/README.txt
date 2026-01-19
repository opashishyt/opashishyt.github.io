=== TEMPORARY FILES DIRECTORY ===

Purpose: Store temporary uploaded files during processing

Automatic Cleanup:
- Files older than 24 hours are automatically deleted
- Used for file validation before moving to permanent storage

Directory Permissions: 0755

Security: This directory should not be publicly accessible

For Admin: Configure cron job for auto-cleanup:
0 2 * * * find /path/to/uploads/temp -type f -mtime +0 -delete