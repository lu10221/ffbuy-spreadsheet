# Batch update all HTML pages to use the new configuration system
# PowerShell Script

Write-Host "Starting batch update of HTML pages..." -ForegroundColor Green

# Get all HTML files (exclude templates and test files)
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" | Where-Object {
    $_.Name -notmatch "template|test|debug" -and $_.Name -ne "index.html"
}

Write-Host "Found $($htmlFiles.Count) HTML files to update" -ForegroundColor Yellow

foreach ($file in $htmlFiles) {
    Write-Host "Updating file: $($file.Name)" -ForegroundColor Cyan
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Check if already updated
    if ($content -match "config-manager\.js" -and $content -match "navigation-generator\.js") {
        Write-Host "   File already updated, skipping" -ForegroundColor Green
        continue
    }
    
    # Backup original file
    $backupPath = "$($file.FullName).backup"
    Copy-Item -Path $file.FullName -Destination $backupPath
    Write-Host "   Created backup: $($file.Name).backup" -ForegroundColor Gray
    
    # Update script references
    $oldScript = '<script src="config.js"></script>'
    $newScripts = @"
    <!-- Core configuration file - must load first -->
    <script src="config.js"></script>
    
    <!-- Configuration manager - provides config utilities -->
    <script src="config-manager.js"></script>
    
    <!-- Navigation generator - auto-generates navigation based on config -->
    <script src="navigation-generator.js"></script>
    
    <!-- Other modules -->
"@
    
    if ($content.Contains($oldScript)) {
        $content = $content.Replace($oldScript, $newScripts)
        Write-Host "   Updated script references" -ForegroundColor Green
    } else {
        Write-Host "   Warning: config.js reference not found, check manually" -ForegroundColor Yellow
    }
    
    # Save updated file
    $content | Set-Content -Path $file.FullName -Encoding UTF8
    Write-Host "   File saved" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Batch update completed!" -ForegroundColor Green
Write-Host "Update summary:" -ForegroundColor Yellow
Write-Host "   - Updated $($htmlFiles.Count) HTML files" -ForegroundColor White
Write-Host "   - Added config manager and navigation generator references" -ForegroundColor White
Write-Host "   - Created backup files (.backup suffix)" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "   1. Test updated page functionality" -ForegroundColor White
Write-Host "   2. If everything works, delete backup files" -ForegroundColor White
Write-Host "   3. Check CONFIG-USAGE.md for detailed usage" -ForegroundColor White