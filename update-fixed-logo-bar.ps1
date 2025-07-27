# 更新所有HTML文件，添加固定的logo栏

# 获取所有HTML文件
$htmlFiles = Get-ChildItem -Path . -Filter *.html

# 遍历每个HTML文件
foreach ($file in $htmlFiles) {
    Write-Host "Processing file: $($file.Name)"
    
    # 读取文件内容
    $content = Get-Content -Path $file.FullName -Raw
    
    # 检查文件是否已经包含fixed-logo-bar
    if ($content -match '<div class="fixed-logo-bar">') {
        Write-Host "File already contains fixed-logo-bar, skipping..."
        continue
    }
    
    # 替换header部分
    $newContent = $content -replace '(<div class="top-info-bar">.*?</div>)\s*<header>\s*<div class="header-top">\s*<a href="index.html" class="logo">\$FFBuy SpreadSheet</a>', '$1
    <div class="fixed-logo-bar">
        <a href="index.html" class="logo">$FFBuy SpreadSheet</a>
    </div>
    <header>
        <div class="header-top">' -replace '\$', '$$'
    
    # 写入文件
    Set-Content -Path $file.FullName -Value $newContent
    
    Write-Host "Updated file: $($file.Name)"
}

Write-Host "All HTML files updated successfully!"