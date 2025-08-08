// 统一的产品加载模板 - 使用新的服务架构

// 通用的产品加载函数
async function fetchProductsWithLazyLoad(apiEndpoint) {
    try {
        // 初始化产品渲染器
        if (!productRenderer.init()) {
            console.error('Failed to initialize product renderer');
            return;
        }
        
        // 加载产品数据
        await productRenderer.loadProducts(apiEndpoint);
        
    } catch (error) {
        console.error('Error in fetchProductsWithLazyLoad:', error);
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    }
}

// 兼容性函数 - 保持向后兼容
function loadMoreProducts() {
    if (window.productRenderer) {
        productRenderer.loadMoreProducts();
    }
}

// 兼容性函数 - 处理滚动事件
function handleScroll() {
    if (window.productRenderer) {
        productRenderer.handleScroll();
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保配置和服务已加载
    if (typeof CONFIG === 'undefined') {
        console.error('CONFIG not loaded. Please include config.js');
        return;
    }
    
    if (typeof productService === 'undefined') {
        console.error('productService not loaded. Please include product-service.js');
        return;
    }
    
    if (typeof productRenderer === 'undefined') {
        console.error('productRenderer not loaded. Please include product-renderer.js');
        return;
    }
    
    console.log('Product loading system initialized successfully');
});

// 导出函数以供其他模块使用
if (typeof window !== 'undefined') {
    window.fetchProductsWithLazyLoad = fetchProductsWithLazyLoad;
    window.loadMoreProducts = loadMoreProducts;
    window.handleScroll = handleScroll;
}
// 文件已重构为使用新的服务架构
// 所有功能现在通过 product-service.js 和 product-renderer.js 提供