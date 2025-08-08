// 项目配置文件
const CONFIG = {
    // API配置
    API: {
        BASE_URL: 'https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A',
        TIMEOUT: 10000, // 10秒超时
        RETRY_COUNT: 3, // 重试次数
        RETRY_DELAY: 1000 // 重试延迟(毫秒)
    },
    
    // 分页配置
    PAGINATION: {
        PRODUCTS_PER_PAGE: 20,
        SCROLL_THRESHOLD: 200 // 距离底部多少像素时触发加载
    },
    
    // 缓存配置
    CACHE: {
        ENABLED: true,
        EXPIRY_TIME: 5 * 60 * 1000, // 5分钟缓存过期
        MAX_SIZE: 50 // 最大缓存条目数
    },
    
    // 错误消息
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Network connection failed, please check your internet connection',
        TIMEOUT_ERROR: 'Request timeout, please try again later',
        NO_PRODUCTS: 'No products available at the moment',
        LOADING_ERROR: 'Failed to load products, please refresh the page'
    },
    
    // Google Analytics配置
    ANALYTICS: {
        TRACKING_ID: 'G-DZ3110PTYG'
    },
    
    // 分类配置
    categories: [
        { name: 'HOTPRODUCTS', endpoint: 'HOTPRODUCTS', icon: 'fas fa-fire' },
        { name: 'T-Shirt', endpoint: 'T-Shirt', icon: 'fas fa-tshirt' },
        { name: 'Pants', endpoint: 'Pants', icon: 'fas fa-socks' },
        { name: 'Shoes', endpoint: 'Shoes', icon: 'fas fa-shoe-prints' },
        { name: 'CheapShoes', endpoint: 'CheapShoes', icon: 'fas fa-tags' },
        { name: 'Set', endpoint: 'Set', icon: 'fas fa-layer-group' },
        { name: 'Accessories', endpoint: 'Accessories', icon: 'fas fa-gem' },
        { name: 'Hoodie Sweatshirt', endpoint: 'Hoodie.Sweatshirt', icon: 'fas fa-tshirt' },
        { name: 'ELECTRONICOS', endpoint: 'ELECTRONICOS', icon: 'fas fa-laptop' },
        { name: 'PERFUME', endpoint: 'PERFUME', icon: 'fas fa-spray-can' }
    ]
};

// 导出配置（兼容不同的模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}