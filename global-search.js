// Global search functionality for FFBuy SpreadSheet

// 获取分类配置 - 使用全局CONFIG
function getSearchCategories() {
    // 如果CONFIG已加载，使用CONFIG中的分类配置
    if (typeof CONFIG !== 'undefined' && CONFIG.categories) {
        return CONFIG.categories.map(cat => ({
            name: cat.name,
            endpoint: cat.endpoint
        }));
    }
    
    // 后备分类配置
    return [
        { name: 'HOTPRODUCTS', endpoint: 'HOTPRODUCTS' },
        { name: 'T-Shirt', endpoint: 'T-Shirt' },
        { name: 'Pants', endpoint: 'Pants' },
        { name: 'Shoes', endpoint: 'Shoes' },
        { name: 'Set', endpoint: 'Set' },
        { name: 'Accessories', endpoint: 'Accessories' },
        { name: 'Hoodie Sweatshirt', endpoint: 'Hoodie.Sweatshirt' }
    ];
}

// 移除重复的categories声明，直接使用getSearchCategories()函数

// Global products storage
let globalProducts = [];
let isGlobalSearchActive = true; // Default to global search
let isLoadingGlobalProducts = false;

// Function to initialize global search
function initGlobalSearch() {
    const searchBox = document.querySelector('.search-box');
    const searchIcon = document.querySelector('.search-icon');
    const isSearchPage = document.body.classList.contains('search-page');
    const isMobile = (typeof window !== 'undefined' && (
        window.matchMedia && window.matchMedia('(max-width: 768px)').matches
    )) || (typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent));

    if (!searchBox) return;

    if (isSearchPage) {
        // 搜索页：不绑定首页的切换与实时搜索，改为点击按钮触发
        // 在 search.html 中，点击按钮与回车触发已单独绑定

        // 搜索页显示“Global”标识，仅作为状态提示
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.querySelector('.global-search-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'global-search-indicator active';
            indicator.textContent = 'Global';
            searchContainer.appendChild(indicator);
        }

        // 预加载全局数据，提升首次搜索速度；不显示任何加载提示
        if (isGlobalSearchActive && globalProducts.length === 0 && !isLoadingGlobalProducts) {
            loadAllProducts();
        }
    } else {
        if (isMobile) {
            // 移动端首页：点击或聚焦跳转到专用搜索页
            searchBox.addEventListener('focus', () => {
                window.location.href = 'search.html';
            });
            searchBox.addEventListener('click', () => {
                window.location.href = 'search.html';
            });
            if (searchIcon) {
                searchIcon.addEventListener('click', function() {
                    window.location.href = 'search.html';
                });
            }
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.querySelector('.global-search-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'global-search-indicator active';
                indicator.textContent = 'Global';
                searchContainer.appendChild(indicator);
            }
        } else {
            // 桌面端首页：沿用旧版搜索（实时输入 + 图标切换全局/本地）
            if (searchIcon) {
                searchIcon.addEventListener('click', function() {
                    toggleGlobalSearch();
                });
            }
            searchBox.addEventListener('keyup', function() {
                const searchTerm = this.value.toLowerCase();
                if (isGlobalSearchActive) {
                    performGlobalSearch(searchTerm);
                } else {
                    performLocalSearch(searchTerm);
                }
            });
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.querySelector('.global-search-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'global-search-indicator active';
                indicator.textContent = 'Global';
                searchContainer.appendChild(indicator);
            }
            if (isGlobalSearchActive && globalProducts.length === 0 && !isLoadingGlobalProducts) {
                loadAllProducts();
            }
        }
    }
}

// Toggle between global and local search
function toggleGlobalSearch() {
    isGlobalSearchActive = !isGlobalSearchActive;
    
    // Update indicator
    const indicator = document.querySelector('.global-search-indicator');
    if (indicator) {
        indicator.textContent = isGlobalSearchActive ? 'Global' : 'Local';
        indicator.classList.toggle('active', isGlobalSearchActive);
    }
    
    // If switching to global search and we haven't loaded global products yet
    if (isGlobalSearchActive && globalProducts.length === 0 && !isLoadingGlobalProducts) {
        loadAllProducts();
    }

    // 切换到全局搜索时，恢复无限滚动
    if (isGlobalSearchActive && typeof productRenderer !== 'undefined') {
        productRenderer.searchActive = false;
    }
    
    // Apply current search term to new search mode
    const searchBox = document.querySelector('.search-box');
    if (searchBox && searchBox.value.trim() !== '') {
        const searchTerm = searchBox.value.toLowerCase();
        if (isGlobalSearchActive) {
            performGlobalSearch(searchTerm);
        } else {
            performLocalSearch(searchTerm);
        }
    }
}

// Load products from all categories - 使用统一产品服务
function loadAllProducts() {
    isLoadingGlobalProducts = true;
    const productsContainer = document.getElementById('products-container');
    
    // 移除所有现有的全局加载指示器，确保只有一个
    const existingIndicators = document.querySelectorAll('.global-loading-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // 检查是否已经有其他加载指示器
    const otherLoadingIndicator = document.querySelector('.loading-indicator');
    
    // 仅在首页创建全局加载指示器；搜索页与结果页不显示“Loading all products...”
    if (!otherLoadingIndicator && !document.body.classList.contains('search-page') && !document.body.classList.contains('results-page') && productsContainer) {
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'global-loading-indicator';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading all products...';
        productsContainer.appendChild(loadingIndicator);
    }
    
    // Create promises for all category fetches
    const fetchPromises = getSearchCategories().map(category => {
        console.log(`Fetching category: ${category.name}, endpoint: ${category.endpoint}`);
        
        // 使用统一产品服务（如果可用）
        if (typeof productService !== 'undefined') {
            return productService.fetchProducts(category.endpoint)
                .then(data => {
                    return data.map(product => ({
                        ...product,
                        category: category.name,
                        categoryUrl: `${category.endpoint}.html`
                    }));
                })
                .catch(error => {
                    console.error(`Error fetching ${category.name}:`, error);
                    return [];
                });
        }
        
        // 后备方案：直接API调用 - 使用CONFIG
        const apiUrl = (typeof CONFIG !== 'undefined' && CONFIG.UTILS) 
            ? CONFIG.UTILS.getCategoryUrl(category.endpoint)
            : `https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A/${encodeURIComponent(category.endpoint)}`;
        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${category.name}`);
                }
                return response.json();
            })
            .then(data => {
                // Filter valid products and add category info
                return data
                    .filter(product => product.spbt && product.ztURL && product.spURL)
                    .map(product => ({
                        ...product,
                        category: category.name,
                        categoryUrl: `${category.endpoint}.html`
                    }));
            })
            .catch(error => {
                console.error(`Error fetching ${category.name}:`, error);
                return []; // Return empty array on error
            });
    });
    
    // Wait for all fetches to complete
    return Promise.all(fetchPromises)
        .then(results => {
            // Combine all results and remove duplicates (based on spURL)
            const allProducts = [];
            const uniqueUrls = new Set();
            
            results.flat().forEach(product => {
                if (!uniqueUrls.has(product.spURL)) {
                    uniqueUrls.add(product.spURL);
                    allProducts.push(product);
                }
            });
            
            globalProducts = allProducts;
            isLoadingGlobalProducts = false;
            
            // 只移除全局加载指示器，不影响其他加载指示器
            const globalLoadingIndicator = document.querySelector('.global-loading-indicator');
            if (globalLoadingIndicator) {
                globalLoadingIndicator.remove();
            }
            
            // If there's an active search term, perform search with loaded data
            const searchBox = document.querySelector('.search-box');
            const isSearchPage = document.body.classList.contains('search-page');
            const isResultsPage = document.body.classList.contains('results-page');
            // 首页（非搜索页/结果页）才自动渲染；搜索页仅预加载、结果页由自身脚本触发
            if (searchBox && searchBox.value.trim() !== '' && isGlobalSearchActive && !isSearchPage && !isResultsPage) {
                performGlobalSearch(searchBox.value.toLowerCase());
            }
        });
}

// Perform global search across all products
function performGlobalSearch(searchTerm) {
    // 搜索页不直接渲染结果，如被意外调用则改为跳转到结果页
    if (document.body.classList.contains('search-page')) {
        const term = (searchTerm || '').toLowerCase().trim();
        if (term) {
            window.location.href = `results.html?q=${encodeURIComponent(term)}`;
        }
        return;
    }
    // 搜索期间暂停分类的无限滚动，并取消在途加载
    if (typeof productRenderer !== 'undefined') {
        productRenderer.searchActive = true;
        if (typeof productRenderer.cancelLoad === 'function') {
            productRenderer.cancelLoad();
        }
    }

    if (globalProducts.length === 0) {
        if (!isLoadingGlobalProducts) {
            loadAllProducts();
        }
        return;
    }
    
    const productsContainer = document.getElementById('products-container');
    
    // Clear current products if we're showing search results
    if (searchTerm.trim() !== '') {
        // 保存原始内容（首次搜索）
        if (!productsContainer.hasAttribute('data-original-content')) {
            productsContainer.setAttribute('data-original-content', productsContainer.innerHTML);
        }

        // 清空容器并确保为统一的5列栅格
        productsContainer.innerHTML = '';
        productsContainer.classList.add('products-grid');

        // 过滤匹配的商品
        const matchingProducts = globalProducts.filter(product =>
            product.spbt && product.spbt.toLowerCase().includes(searchTerm)
        );

        // 使用统一产品渲染器的卡片结构，保证样式一致
        if (matchingProducts.length === 0) {
            productsContainer.innerHTML = `<div class="no-products">${(typeof CONFIG !== 'undefined' && CONFIG.ERROR_MESSAGES) ? CONFIG.ERROR_MESSAGES.NO_PRODUCTS : 'No products found'}</div>`;
        } else {
            matchingProducts.forEach((product, i) => {
                if (typeof productRenderer !== 'undefined' && typeof productRenderer.createProductCard === 'function') {
                    const card = productRenderer.createProductCard(product, i);
                    productsContainer.appendChild(card);
                } else {
                    // 后备：最简卡片结构
                    const card = document.createElement('div');
                    card.className = 'product-card';
                    card.innerHTML = `
                        <a href="${product.spURL}" target="_blank" rel="noopener noreferrer">
                            <img src="${product.ztURL}" class="product-image" alt="${product.spbt}">
                            <div class="product-info">
                                <div class="product-title">${product.spbt}</div>
                                <div class="product-price">
                                    <span class="us-price">${product.US || '--'}</span>
                                    <span class="eur-price">${product.EUR || '--'}</span>
                                </div>
                            </div>
                        </a>`;
                    productsContainer.appendChild(card);
                }
            });
        }

        // 搜索页与结果页不需要“返回当前分类”按钮；仅在首页的本地搜索模式使用
        if (!document.body.classList.contains('search-page') && !document.body.classList.contains('results-page')) {
            const containerWrapper = document.querySelector('.container');
            if (containerWrapper && !document.getElementById('back-to-results-btn')) {
                const backButton = document.createElement('button');
                backButton.id = 'back-to-results-btn';
                backButton.className = 'back-to-results-btn';
                backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Current Category';
                backButton.addEventListener('click', function() {
                    const searchBox = document.querySelector('.search-box');
                    if (searchBox) searchBox.value = '';
                    if (productsContainer.hasAttribute('data-original-content')) {
                        productsContainer.innerHTML = productsContainer.getAttribute('data-original-content');
                        productsContainer.removeAttribute('data-original-content');
                    }
                    backButton.remove();
                });
                const anchorNode = containerWrapper.querySelector('#loading-indicator') || containerWrapper.firstChild;
                containerWrapper.insertBefore(backButton, anchorNode);
            }
        }
        
        // 滚动到顶部，便于查看搜索结果
        window.scrollTo(0, 0);
    } else {
        // If search is cleared, restore original content
        if (productsContainer.hasAttribute('data-original-content')) {
            productsContainer.innerHTML = productsContainer.getAttribute('data-original-content');
            productsContainer.removeAttribute('data-original-content');
        }
        if (typeof productRenderer !== 'undefined') {
            productRenderer.searchActive = false;
        }
        const backBtn = document.getElementById('back-to-results-btn');
        if (backBtn) backBtn.remove();
    }
}

// Perform local search (current page only)
function performLocalSearch(searchTerm) {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    const term = (searchTerm || '').toLowerCase();
    const canUseRenderer = typeof productRenderer !== 'undefined' && Array.isArray(productRenderer.allProducts) && productRenderer.allProducts.length > 0;

    if (term.trim() !== '' && canUseRenderer) {
        productRenderer.searchActive = true;

        // 保存原始内容（首次搜索）
        if (!productsContainer.hasAttribute('data-original-content')) {
            productsContainer.setAttribute('data-original-content', productsContainer.innerHTML);
        }
        productsContainer.innerHTML = '';
        productsContainer.classList.add('products-grid');

        const matching = productRenderer.allProducts.filter(p => p.spbt && p.spbt.toLowerCase().includes(term));

        if (matching.length === 0) {
            productsContainer.innerHTML = `<div class="no-products">${(typeof CONFIG !== 'undefined' && CONFIG.ERROR_MESSAGES) ? CONFIG.ERROR_MESSAGES.NO_PRODUCTS : '没有找到商品'}</div>`;
        } else {
            matching.forEach((product, i) => {
                const card = (typeof productRenderer.createProductCard === 'function')
                    ? productRenderer.createProductCard(product, i)
                    : createFallbackCard(product);
                productsContainer.appendChild(card);
            });
        }

        // 添加“返回当前分类”按钮
        const containerWrapper = document.querySelector('.container');
        if (containerWrapper && !document.getElementById('back-to-results-btn')) {
            const backButton = document.createElement('button');
            backButton.id = 'back-to-results-btn';
            backButton.className = 'back-to-results-btn';
            backButton.innerHTML = '<i class="fas fa-arrow-left"></i> 返回当前分类';
            backButton.addEventListener('click', function() {
                const searchBox = document.querySelector('.search-box');
                if (searchBox) searchBox.value = '';
                if (productsContainer.hasAttribute('data-original-content')) {
                    productsContainer.innerHTML = productsContainer.getAttribute('data-original-content');
                    productsContainer.removeAttribute('data-original-content');
                }
                productRenderer.searchActive = false;
                backButton.remove();
            });
            const anchorNode = containerWrapper.querySelector('#loading-indicator') || containerWrapper.firstChild;
            containerWrapper.insertBefore(backButton, anchorNode);
        }

        window.scrollTo(0, 0);
    } else if (term.trim() === '' && canUseRenderer) {
        // 清空搜索时恢复
        productRenderer.searchActive = false;
        if (productsContainer.hasAttribute('data-original-content')) {
            productsContainer.innerHTML = productsContainer.getAttribute('data-original-content');
            productsContainer.removeAttribute('data-original-content');
        }
        const backBtn = document.getElementById('back-to-results-btn');
        if (backBtn) backBtn.remove();
    } else {
        // 后备方案：DOM级过滤（仅当前已渲染的卡片）
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const titleEl = card.querySelector('.product-title');
            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    }

    function createFallbackCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="${product.spURL}" target="_blank" rel="noopener noreferrer">
                <img src="${product.ztURL}" class="product-image" alt="${product.spbt}">
                <div class="product-info">
                    <div class="product-title">${product.spbt}</div>
                    <div class="product-price">
                        <span class="us-price">${product.US || '--'}</span>
                        <span class="eur-price">${product.EUR || '--'}</span>
                    </div>
                </div>
            </a>`;
        return card;
    }
}

// Initialize global search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initGlobalSearch();
});