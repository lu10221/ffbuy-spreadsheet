# 更新浮动按钮脚本

# 需要更新的HTML文件列表（排除已更新的文件和模板文件）
$filesToUpdate = @(
    "Accessories.html",
    "ELECTRONICOS.html",
    "Hoodie Sweatshirt.html",
    "Set.html",
    "Shoes.html"
)

# 浮动按钮HTML结构
$newButtonsHTML = @"
<div class="floating-buttons" id="floatingButtons">
    <div class="float-btn toggle-btn" id="toggleFloatingBtn"><i class="fas fa-headset"></i></div>
    <div class="floating-content" id="floatingContent">
        <img src="img/telegram.png" alt="Telegram" class="telegram-icon">
        <img src="img/ws.png" alt="WhatsApp" class="whatsapp-icon">
    </div>
</div>
<div class="float-btn back-to-top"><i class="fas fa-arrow-up"></i></div>

<script src="floating-buttons.js"></script>
"@

# 旧的浮动按钮HTML结构的正则表达式模式
$oldButtonsPattern = '<div class="floating-buttons">\s*<img src="img/telegram.png" alt="Telegram" class="telegram-icon">\s*<img src="img/ws.png" alt="WhatsApp" class="whatsapp-icon">\s*<div class="float-btn back-to-top"><i class="fas fa-arrow-up"></i></div>\s*</div>\s*\n<script>'

# 旧的WhatsApp图标功能代码的正则表达式模式
$whatsAppPattern = '\s*// WhatsApp icon functionality\s*const whatsappIcon = document\.querySelector\(\'\.\'\);\s*if \(whatsappIcon\) {\s*whatsappIcon\.addEventListener\(\'click\', function\(\) {\s*window\.open\(\'https://wa\.me/message/INCWNKPORGSSN1\?utm_source=facebook&utm_medium=ads&utm_campaign=ffbuywhatsapp_autojoin\', \'_blank\'\);\s*}\);\s*}'

# 旧的浮动按钮功能代码的正则表达式模式
$floatingButtonsPattern = '\s*// Back to top button functionality\s*const backToTopBtn = document\.querySelector\(\'\.\'\);\s*\n\s*backToTopBtn\.addEventListener\(\'click\', function\(\) {\s*window\.scrollTo\({\s*top: 0,\s*behavior: \'smooth\'\s*}\);\s*}\);\s*\n\s*// Show/hide back to top button based on scroll position\s*window\.addEventListener\(\'scroll\', function\(\) {\s*if \(window\.pageYOffset > 300\) {\s*backToTopBtn\.style\.opacity = \'1\';\s*} else {\s*backToTopBtn\.style\.opacity = \'0\.7\';\s*}\s*}\);\s*\n\s*// Telegram icon functionality\s*const telegramIcon = document\.querySelector\(\'\.\'\);\s*\n\s*telegramIcon\.addEventListener\(\'click\', function\(\) {\s*window\.open\(\'https://t\.me/cnw2cfind\', \'_blank\'\);\s*}\);'

# 替换WhatsApp图标功能代码
$whatsAppReplacement = "\n        // WhatsApp图标功能已移至floating-buttons.js"

# 替换浮动按钮功能代码
$floatingButtonsReplacement = "\n        // 浮动按钮功能已移至floating-buttons.js"

# 遍历文件并更新
foreach ($file in $filesToUpdate) {
    $filePath = "e:\\demo\\FFBuy SpreadSheet\\$file"
    
    # 读取文件内容
    $content = Get-Content -Path $filePath -Raw
    
    # 替换浮动按钮HTML结构
    $content = $content -replace $oldButtonsPattern, "$newButtonsHTML\n<script>"
    
    # 替换WhatsApp图标功能代码
    $content = $content -replace $whatsAppPattern, $whatsAppReplacement
    
    # 替换浮动按钮功能代码
    $content = $content -replace $floatingButtonsPattern, $floatingButtonsReplacement
    
    # 写入更新后的内容
    Set-Content -Path $filePath -Value $content
    
    Write-Host "已更新文件: $file"
}

Write-Host "所有文件更新完成！"