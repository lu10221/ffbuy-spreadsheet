// 分类导航优化脚本 - 防止滑块刷新

// 分类配置 - 使用全局CONFIG
function getCategories() {
    // 如果CONFIG已加载，使用CONFIG中的分类配置
    if (typeof CONFIG !== 'undefined' && CONFIG.categories) {
        return CONFIG.categories;
    }
    
    // 后备分类配置
    return [
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
    ];
}

const categories = getCategories();

// 分类导航命名空间，避免变量冲突
const CategoryNav = {
    currentCategory: 'HOTPRODUCTS',
    categoryProducts: {}, // 缓存各分类的产品数据
    isLoadingCategory: false,
    // 懒加载相关变量
    allCategoryProducts: [], // 当前分类的所有产品
    currentPage: 1,
    productsPerPage: 20,
    allProductsLoaded: false,
    isLoading: false
};

// 初始化分类导航
function initCategoryNavigation() {
    // 检测当前页面的分类
    detectCurrentCategory();
    
    // 检查是否在专门的分类页面（如CheapShoes.html）
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    const isSpecificCategoryPage = categories.some(cat => 
        fileName === `${cat.name}.html` || fileName === `${cat.endpoint}.html`
    );
    
    // 如果不在专门的分类页面，才启用动态导航功能
    if (!isSpecificCategoryPage) {
        // 转换导航链接为按钮
        convertNavigationToButtons();
        
        // 设置导航点击事件
        setupNavigationEvents();
        
        // 保存滚动位置
        saveScrollPosition();
    } else {
        // 在专门页面只更新导航状态，不干扰原有功能
        updateNavigationStateForCurrentPage();
    }
}

// 检测当前页面分类
function detectCurrentCategory() {
    const currentPath = window.location.pathname;
    let fileName = currentPath.split('/').pop().replace('.html', '');
    
    // 解码URL编码的文件名（如HOT%20PRODUCTS -> HOT PRODUCTS）
    fileName = decodeURIComponent(fileName);
    
    // 根据文件名确定当前分类 - 使用精确匹配
    const category = categories.find(cat => {
        // 精确匹配文件名，避免CheapShoes被误认为Shoes
        return cat.name === fileName || cat.endpoint === fileName;
    });
    
    if (category) {
        CategoryNav.currentCategory = category.name;
    }
    
    console.log('当前分类:', CategoryNav.currentCategory, '文件名:', fileName);
}

// 转换导航链接为按钮
function convertNavigationToButtons() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        // 获取分类名称
        const href = link.getAttribute('href');
        const categoryName = href.replace('.html', '').replace(/[\s\/]/g, ' ').trim();
        
        // 找到对应的分类配置 - 使用精确匹配避免CheapShoes被误认为Shoes
        const category = categories.find(cat => {
            const catName = cat.name.replace(/[\s\/]/g, ' ').trim();
            const fileName = href.replace('.html', '');
            // 精确匹配文件名，避免部分匹配导致的错误
            return catName === categoryName || cat.name === fileName || cat.endpoint === fileName;
        });
        
        if (category) {
            // 移除原有的href，防止页面跳转
            link.removeAttribute('href');
            
            // 添加数据属性
            link.setAttribute('data-category', category.name);
            link.setAttribute('data-endpoint', category.endpoint);
            
            // 设置样式
            link.style.cursor = 'pointer';
            
            // 设置当前活动状态
            if (category.name === CategoryNav.currentCategory) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// 设置导航事件
function setupNavigationEvents() {
    const navLinks = document.querySelectorAll('nav a[data-category]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const categoryName = this.getAttribute('data-category');
            const endpoint = this.getAttribute('data-endpoint');
            
            if (categoryName !== CategoryNav.currentCategory && !CategoryNav.isLoadingCategory) {
                switchCategory(categoryName, endpoint, this);
            }
        });
    });
}

// 切换分类
function switchCategory(categoryName, endpoint, clickedLink) {
    if (CategoryNav.isLoadingCategory) return;
    
    CategoryNav.isLoadingCategory = true;
    
    // 移除之前的滚动事件监听器
    window.removeEventListener('scroll', handleCategoryScroll);
    
    // 重置懒加载状态
    CategoryNav.allCategoryProducts = [];
    CategoryNav.currentPage = 1;
    CategoryNav.allProductsLoaded = false;
    CategoryNav.isLoading = false;
    
    // 保存当前滚动位置
    const currentScrollPosition = getCurrentScrollPosition();
    
    // 更新导航状态
    updateNavigationState(clickedLink);
    
    // 显示加载状态
    showCategoryLoading();
    
    // 加载分类产品
    loadCategoryProducts(categoryName, endpoint)
        .then(products => {
            // 渲染产品
            renderCategoryProducts(products, categoryName);
            
            // 恢复滚动位置（保持滑块位置）
            restoreScrollPosition(currentScrollPosition);
            
            // 更新当前分类
            CategoryNav.currentCategory = categoryName;
            
            // 更新页面标题
            updatePageTitle(categoryName);
            
            // 更新URL（不刷新页面）
            updateURL(categoryName);
            
            CategoryNav.isLoadingCategory = false;
        })
        .catch(error => {
            console.error('加载分类失败:', error);
            showCategoryError(error.message);
            CategoryNav.isLoadingCategory = false;
        });
}

// 获取当前滚动位置
function getCurrentScrollPosition() {
    const nav = document.querySelector('nav');
    return {
        page: window.pageYOffset || document.documentElement.scrollTop,
        nav: nav ? nav.scrollLeft : 0
    };
}

// 恢复滚动位置
function restoreScrollPosition(position) {
    // 恢复导航滑块位置
    const nav = document.querySelector('nav');
    if (nav && position.nav !== undefined) {
        nav.scrollLeft = position.nav;
    }
    
    // 保持页面滚动位置在顶部（新分类内容）
    window.scrollTo(0, 0);
}

// 保存滚动位置
function saveScrollPosition() {
    const nav = document.querySelector('nav');
    if (nav) {
        // 监听导航滚动，保存位置
        nav.addEventListener('scroll', function() {
            sessionStorage.setItem('navScrollPosition', this.scrollLeft);
        });
        
        // 页面加载时恢复位置
        const savedPosition = sessionStorage.getItem('navScrollPosition');
        if (savedPosition) {
            nav.scrollLeft = parseInt(savedPosition);
        }
    }
}

// 更新导航状态
function updateNavigationState(activeLink) {
    // 移除所有活动状态
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 设置新的活动状态
    activeLink.classList.add('active');
}

// 为专门页面更新导航状态
function updateNavigationStateForCurrentPage() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href) {
            const linkCategory = href.replace('.html', '');
            if (linkCategory === CategoryNav.currentCategory) {
                link.classList.add('active');
            }
        }
    });
}

// 显示分类加载状态
function showCategoryLoading() {
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = `
        <div class="category-loading">
            <i class="fas fa-spinner fa-spin"></i>Switching category...
        </div>
    `;
    }
}

// 显示分类错误
function showCategoryError(message) {
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        productsContainer.innerHTML = `
            <div class="category-error">
                <i class="fas fa-exclamation-triangle"></i>Loading failed: ${message}
                <button class="retry-btn" onclick="CategoryNavigation.switchCategory('${currentCategory}')">Retry</button>
            </div>
        `;
    }
}

// 加载分类产品
function loadCategoryProducts(categoryName, endpoint) {
    // 检查缓存
    if (CategoryNav.categoryProducts[categoryName]) {
        return Promise.resolve(CategoryNav.categoryProducts[categoryName]);
    }
    
    // 构建API URL
    const apiUrl = `https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A/${endpoint}`;
    
    // 设置超时
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Request timeout, please check network connection'));
        }, 10000);
    });
    
    return Promise.race([fetch(apiUrl), timeoutPromise])
        .then(response => {
            if (!response.ok) {
                throw new Error('Network request failed');
            }
            return response.json();
        })
        .then(data => {
            // 缓存数据
            CategoryNav.categoryProducts[categoryName] = data;
            return data;
        });
}

// 渲染分类产品
function renderCategoryProducts(products, categoryName) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    if (!products || products.length === 0) {
        productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-box-open"></i>No products in this category
                </div>
            `;
        return;
    }
    
    // 重置懒加载状态
    CategoryNav.allCategoryProducts = products;
    CategoryNav.currentPage = 1;
    CategoryNav.allProductsLoaded = false;
    CategoryNav.isLoading = false;
    
    // 清空容器
    productsContainer.innerHTML = '';
    
    // 渲染第一页产品
    renderProductPage();
    
    // 添加滚动事件监听器
    window.removeEventListener('scroll', handleCategoryScroll);
    window.addEventListener('scroll', handleCategoryScroll);
}

// 渲染产品页面
function renderProductPage() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    const startIndex = (CategoryNav.currentPage - 1) * CategoryNav.productsPerPage;
    const endIndex = Math.min(startIndex + CategoryNav.productsPerPage, CategoryNav.allCategoryProducts.length);
    
    // 渲染当前页产品
    for (let i = startIndex; i < endIndex; i++) {
        const product = CategoryNav.allCategoryProducts[i];
        const productCard = createProductCard(product, i);
        productsContainer.appendChild(productCard);
    }
    
    // 检查是否加载完所有产品
    if (endIndex >= CategoryNav.allCategoryProducts.length) {
        CategoryNav.allProductsLoaded = true;
        // 添加结束提示
        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.textContent = 'All products loaded';
        productsContainer.appendChild(endMessage);
    }
    
    // 添加淡入动画
    setTimeout(() => {
        const cards = productsContainer.querySelectorAll('.product-card:not(.fade-in)');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 50);
        });
    }, 100);
    
    CategoryNav.currentPage++;
}

// 加载更多分类产品
function loadMoreCategoryProducts() {
    if (CategoryNav.isLoading || CategoryNav.allProductsLoaded) return;
    
    CategoryNav.isLoading = true;
    const productsContainer = document.getElementById('products-container');
    
    // 计算当前页的开始和结束索引
    const startIndex = (CategoryNav.currentPage - 1) * CategoryNav.productsPerPage;
    const endIndex = Math.min(startIndex + CategoryNav.productsPerPage, CategoryNav.allCategoryProducts.length);
    
    // 如果已经加载了所有产品，则不再加载
    if (startIndex >= CategoryNav.allCategoryProducts.length) {
        CategoryNav.allProductsLoaded = true;
        CategoryNav.isLoading = false;
        return;
    }
    
    // 创建加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-more-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more products...';
    productsContainer.appendChild(loadingIndicator);
    
    // 模拟网络延迟
    setTimeout(() => {
        // 加载当前页的产品
        for (let i = startIndex; i < endIndex; i++) {
            const product = CategoryNav.allCategoryProducts[i];
            const productCard = createProductCard(product, i);
            productCard.style.animationDelay = `${(i - startIndex) * 0.03}s`;
            productCard.classList.add('fade-in');
            productsContainer.appendChild(productCard);
        }
        
        // 移除加载指示器
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // 增加页码
        CategoryNav.currentPage++;
        
        // 检查是否已加载所有产品
        if (endIndex >= CategoryNav.allCategoryProducts.length) {
            CategoryNav.allProductsLoaded = true;
            // 添加一个提示，表示已加载所有产品
            const endMessage = document.createElement('div');
            endMessage.className = 'end-message';
            endMessage.textContent = 'All products loaded';
            productsContainer.appendChild(endMessage);
        }
        
        CategoryNav.isLoading = false;
    }, 300); // 300ms延迟模拟网络请求
}

// 处理分类滚动事件
function handleCategoryScroll() {
    // 如果正在加载或已加载所有产品，则不处理
    if (CategoryNav.isLoading || CategoryNav.allProductsLoaded) return;
    
    // 计算滚动位置
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 当滚动到页面底部附近时，加载更多产品
    if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMoreCategoryProducts();
    }
}

// 创建产品卡片
function createProductCard(product, index) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.style.opacity = '0';
    productCard.style.transform = 'translateY(20px)';
    productCard.style.transition = 'all 0.3s ease';
    
    productCard.innerHTML = `
        <a href="${product.spURL}" target="_blank">
            <img src="${product.ztURL}" class="product-image" alt="${product.spbt}" loading="lazy">
            <div class="product-info">
                <div class="product-title">${product.spbt}</div>
                <div class="product-subtitle">Premium | Quality Product</div>
                <div class="product-note">
                    <i class="fas fa-external-link-alt"></i> 
                    Click to view <strong style="color: #2476db; font-weight:600;">product details</strong>
                </div>
                <div class="product-price">
                    <div>
                        <span class="us-price">US $${(Math.random() * 50 + 10).toFixed(2)}</span>
                        <span class="eur-price">EUR €${(Math.random() * 45 + 9).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </a>
    `;
    
    return productCard;
}

// 更新页面标题
function updatePageTitle(categoryName) {
    document.title = `$FFBuy SpreadSheet - ${categoryName}`;
}

// 更新URL（不刷新页面）
function updateURL(categoryName) {
    const fileName = categoryName.replace(/[\s\/]/g, ' ').trim() + '.html';
    
    try {
        // 检查是否为本地文件协议
        if (window.location.protocol === 'file:') {
            // 在本地文件协议下，只更新页面标题，不修改URL
            return;
        }
        
        const newURL = window.location.origin + window.location.pathname.replace(/[^/]*$/, fileName);
        
        // 使用 History API 更新 URL
        if (window.history && window.history.pushState) {
            window.history.pushState({ category: categoryName }, '', newURL);
        }
    } catch (error) {
        console.error('URL更新失败:', error);
        // 如果pushState失败，继续执行其他逻辑
    }
}

// 处理浏览器后退/前进
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.category) {
        const category = categories.find(cat => cat.name === event.state.category);
        if (category) {
            // 找到对应的导航链接
            const navLink = document.querySelector(`nav a[data-category="${category.name}"]`);
            if (navLink) {
                switchCategory(category.name, category.endpoint, navLink);
            }
        }
    }
});

// 添加CSS样式
function addCategoryNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .category-loading,
        .category-error,
        .no-products {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 25px;
            text-align: center;
            color: #666;
            font-size: 15px;
            min-height: 300px;
            width: 100%;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
            margin: 10px 0;
            grid-column: 1 / -1;
        }
        
        .category-error {
            flex-direction: column;
            gap: 15px;
        }
        
        /* 移动端优化 */
        @media (max-width: 768px) {
            .category-loading,
            .category-error,
            .no-products {
                padding: 20px 15px;
                min-height: 250px;
                font-size: 14px;
                border-radius: 8px;
                margin: 5px 0;
            }
            
            .category-loading i,
            .category-error i,
            .no-products i {
                font-size: 20px;
                margin-right: 10px;
            }
        }
        
        .category-loading i,
        .category-error i,
        .no-products i {
            font-size: 18px;
            margin-right: 12px;
            color: #ff6347;
        }
        
        .category-loading i {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
        
        .retry-btn {
            margin-top: 15px;
            padding: 10px 20px;
            background-color: #ff6347;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }
        
        .retry-btn:hover {
            background-color: #ff4500;
        }
        
        .product-card.fade-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* 导航滑块平滑滚动 */
        nav {
            scroll-behavior: smooth;
        }
        
        /* 防止导航按钮选中文本 */
        nav a {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
    `;
    
    document.head.appendChild(style);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加样式
    addCategoryNavigationStyles();
    
    // 延迟初始化，确保其他脚本加载完成
    setTimeout(() => {
        initCategoryNavigation();
    }, 100);
});

// 页面卸载时清理事件监听器
window.addEventListener('beforeunload', function() {
    window.removeEventListener('scroll', handleCategoryScroll);
});

// 清理函数，供外部调用
function cleanupCategoryNavigation() {
    window.removeEventListener('scroll', handleCategoryScroll);
    CategoryNav.allCategoryProducts = [];
    CategoryNav.currentPage = 1;
    CategoryNav.allProductsLoaded = false;
    CategoryNav.isLoading = false;
}

// 导出函数供其他脚本使用
window.CategoryNavigation = {
    switchCategory,
    getCurrentCategory: () => CategoryNav.currentCategory,
    clearCache: () => { CategoryNav.categoryProducts = {}; },
    getCategories: () => categories
};