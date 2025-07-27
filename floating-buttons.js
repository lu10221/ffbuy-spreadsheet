// 浮动按钮功能处理脚本

// 初始化浮动按钮折叠状态
function initFloatingButtons() {
    const floatingContent = document.querySelector('.floating-content');
    if (floatingContent) {
        // 默认折叠状态
        floatingContent.classList.add('collapsed');
    }
}

// 设置浮动按钮事件监听
function setupFloatingButtons() {
    // WhatsApp图标点击事件
    const whatsappIcon = document.querySelector('.whatsapp-icon');
    if (whatsappIcon) {
        whatsappIcon.addEventListener('click', function() {
            window.open('https://wa.me/message/INCWNKPORGSSN1?utm_source=facebook&utm_medium=ads&utm_campaign=ffbuywhatsapp_autojoin', '_blank');
        });
    }
    
    // Telegram图标点击事件
    const telegramIcon = document.querySelector('.telegram-icon');
    if (telegramIcon) {
        telegramIcon.addEventListener('click', function() {
            window.open('https://t.me/cnw2cfind', '_blank');
        });
    }
    
    // 返回顶部按钮功能
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 根据滚动位置显示/隐藏返回顶部按钮
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
            } else {
                backToTopBtn.style.opacity = '0.7';
            }
        });
    }
    
    // 浮动按钮折叠展开功能
    const toggleBtn = document.querySelector('.toggle-btn');
    const floatingContent = document.querySelector('.floating-content');
    
    if (toggleBtn && floatingContent) {
        toggleBtn.addEventListener('click', function() {
            floatingContent.classList.toggle('collapsed');
            // 切换图标
            const icon = this.querySelector('i');
            if (floatingContent.classList.contains('collapsed')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-headset');
            } else {
                icon.classList.remove('fa-headset');
                icon.classList.add('fa-times');
            }
        });
    }
}

// 文档加载完成后初始化浮动按钮
document.addEventListener('DOMContentLoaded', function() {
    initFloatingButtons();
    setupFloatingButtons();
});