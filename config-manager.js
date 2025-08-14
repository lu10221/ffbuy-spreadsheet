// 配置管理器 - 提供配置相关的实用工具和方法
class ConfigManager {
    constructor() {
        this.config = window.CONFIG || {};
        this.initialized = false;
    }

    // 初始化配置管理器
    init() {
        if (this.initialized) return;
        
        this.validateConfig();
        this.setupGlobalMethods();
        this.initialized = true;
        
        console.log('ConfigManager initialized with', this.config.categories?.length || 0, 'categories');
    }

    // 验证配置完整性
    validateConfig() {
        const requiredSections = ['API', 'categories'];
        const missingSections = requiredSections.filter(section => !this.config[section]);
        
        if (missingSections.length > 0) {
            console.warn('Missing config sections:', missingSections);
        }

        // 验证分类配置
        if (this.config.categories) {
            this.config.categories.forEach((category, index) => {
                const requiredFields = ['name', 'endpoint', 'icon', 'displayName'];
                const missingFields = requiredFields.filter(field => !category[field]);
                
                if (missingFields.length > 0) {
                    console.warn(`Category ${index} missing fields:`, missingFields, category);
                }
            });
        }
    }

    // 设置全局方法
    setupGlobalMethods() {
        // 全局获取配置的便捷方法
        window.getConfig = (path) => this.getConfig(path);
        window.getCategoryByName = (name) => this.getCategoryByName(name);
        window.getApiUrl = (endpoint) => this.getApiUrl(endpoint);
    }

    // 获取配置值（支持点号路径）
    getConfig(path) {
        if (!path) return this.config;
        
        return path.split('.').reduce((obj, key) => {
            return obj && obj[key] !== undefined ? obj[key] : undefined;
        }, this.config);
    }

    // 根据名称获取分类
    getCategoryByName(name) {
        return this.config.categories?.find(cat => cat.name === name);
    }



    // 根据端点获取分类
    getCategoryByEndpoint(endpoint) {
        return this.config.categories?.find(cat => cat.endpoint === endpoint);
    }

    // 获取所有分类
    getAllCategories() {
        return this.config.categories || [];
    }

    // 获取API完整URL
    getApiUrl(endpoint) {
        const baseUrl = this.getConfig('API.BASE_URL');
        if (!baseUrl) {
            console.error('API.BASE_URL not configured');
            return null;
        }
        return `${baseUrl}/${endpoint}`;
    }

    // 获取分类的API URL
    getCategoryApiUrl(categoryName) {
        const category = this.getCategoryByName(categoryName);
        if (!category) {
            console.error('Category not found:', categoryName);
            return null;
        }
        return this.getApiUrl(category.endpoint);
    }

    // 生成分类导航数据
    getNavigationData(currentCategory = '') {
        return this.getAllCategories().map(category => ({
            ...category,
            isActive: category.name === currentCategory,
            url: `?category=${encodeURIComponent(category.name)}`
        }));
    }

    // 获取支付方式数据
    getPaymentMethods() {
        return this.getConfig('PAYMENT_METHODS') || [];
    }

    // 获取信任信息
    getTrustInfo() {
        return this.getConfig('TRUST_INFO') || {};
    }

    // 获取站点信息
    getSiteInfo() {
        return this.getConfig('SITE') || {};
    }

    // 获取分页配置
    getPaginationConfig() {
        return this.getConfig('PAGINATION') || { PRODUCTS_PER_PAGE: 20, SCROLL_THRESHOLD: 200 };
    }

    // 获取缓存配置
    getCacheConfig() {
        return this.getConfig('CACHE') || { ENABLED: true, EXPIRY_TIME: 300000, MAX_SIZE: 50 };
    }

    // 获取错误消息
    getErrorMessage(type) {
        const messages = this.getConfig('ERROR_MESSAGES') || {};
        return messages[type] || 'An error occurred';
    }

    // 获取Analytics配置
    getAnalyticsConfig() {
        return this.getConfig('ANALYTICS') || {};
    }

    // 调试方法：打印配置信息
    debugConfig() {
        console.group('🔧 Configuration Debug Info');
        console.log('Full Config:', this.config);
        console.log('Categories Count:', this.getAllCategories().length);
        console.log('API Base URL:', this.getConfig('API.BASE_URL'));
        console.log('Current Page Category:', this.getCurrentPageCategory());
        console.log('Site Info:', this.getSiteInfo());
        console.groupEnd();
    }

    // 验证分类名称是否存在
    isValidCategory(categoryName) {
        return !!this.getCategoryByName(categoryName);
    }

    // 获取默认分类
    getDefaultCategory() {
        const defaultName = this.getConfig('SITE.DEFAULT_CATEGORY');
        if (defaultName && this.isValidCategory(defaultName)) {
            return this.getCategoryByName(defaultName);
        }
        // 如果没有配置默认分类或默认分类无效，返回第一个分类
        const categories = this.getAllCategories();
        return categories.length > 0 ? categories[0] : null;
    }

    // 更新配置（运行时）
    updateConfig(path, value) {
        const keys = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        console.log(`Config updated: ${path} =`, value);
    }

    // 重置配置到默认值
    resetConfig() {
        this.config = window.CONFIG || {};
        this.initialized = false;
        console.log('Config reset to default values');
    }
}

// 创建全局实例
const configManager = new ConfigManager();

// 导出到全局
if (typeof window !== 'undefined') {
    window.configManager = configManager;
    window.ConfigManager = ConfigManager;
}

// 模块导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConfigManager, configManager };
}

// 自动初始化
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            configManager.init();
        });
    } else {
        configManager.init();
    }
}

// 开发环境下提供调试命令
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.debugConfig = () => configManager.debugConfig();
    console.log('💡 Debug tip: Use debugConfig() in console to inspect configuration');
}