# PowerShell script: Update CNFANS color in all HTML files

$htmlFiles = Get-ChildItem -Path . -Filter *.html

foreach ($file in $htmlFiles) {
    Write-Host "Processing file: $($file.Name)"
    
    # Read file content
    $content = Get-Content -Path $file.FullName -Raw
    
    # Replace CNFANS color in top info bar
    $newContent = $content -replace '<strong>CNFANS Platform</strong>', '<strong style="color:#2476db; font-weight:600;">CNFANS Platform</strong>'
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $newContent
}

Write-Host "All HTML files updated successfully!"