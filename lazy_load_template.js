// 全局变量，用于懒加载功能
let allProducts = [];
let currentPage = 1;
const productsPerPage = 20;
let isLoading = false;
let allProductsLoaded = false;

// 通用的产品加载函数
function fetchProductsWithLazyLoad(apiEndpoint) {
    const productsContainer = document.getElementById('products-container');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const apiUrl = `https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A/${apiEndpoint}`;
    
    // 创建一个单独的加载指示器，不会阻止页面交互
    if (!loadingIndicator) {
        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        indicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在加载产品数据...';
        productsContainer.appendChild(indicator);
    }
    
    // 设置超时，如果API请求时间过长，显示部分UI
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('请求超时，请检查网络连接'));
        }, 10000); // 10秒超时
    });
    
    // 标记为正在加载
    isLoading = true;
    
    // 使用Promise.race在超时和正常请求之间竞争
    Promise.race([fetch(apiUrl), timeoutPromise])
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 移除加载指示器，保留其他内容
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            // 保存所有产品数据
            allProducts = data.filter(product => product.spbt && product.ztURL && product.spURL);
            
            // 如果没有产品数据，显示提示信息
            if (allProducts.length === 0) {
                productsContainer.innerHTML = '<div class="no-products">暂无产品数据</div>';
                allProductsLoaded = true;
            } else {
                // 加载第一页产品
                loadMoreProducts();
                
                // 添加滚动事件监听器，实现懒加载
                window.addEventListener('scroll', handleScroll);
            }
            
            // 标记为加载完成
            isLoading = false;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            productsContainer.innerHTML = `<div class="error-message">加载产品数据失败: ${error.message}</div>`;
            isLoading = false;
        });
}

// 加载更多产品的函数
function loadMoreProducts() {
    if (isLoading || allProductsLoaded) return;
    
    isLoading = true;
    const productsContainer = document.getElementById('products-container');
    
    // 计算当前页的起始和结束索引
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, allProducts.length);
    
    // 如果已经加载了所有产品，则不再加载
    if (startIndex >= allProducts.length) {
        allProductsLoaded = true;
        isLoading = false;
        return;
    }
    
    // 创建加载指示器
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-more-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载更多产品...';
    productsContainer.appendChild(loadingIndicator);
    
    // 模拟网络延迟，实际使用时可以移除
    setTimeout(() => {
        // 加载当前页的产品
        for (let i = startIndex; i < endIndex; i++) {
            const product = allProducts[i];
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.style.animationDelay = `${(i - startIndex) * 0.03}s`;
            productCard.classList.add('fade-in');
            
            // Create product HTML
            productCard.innerHTML = `
                <a href="${product.spURL}" target="_blank">
                    <img src="${product.ztURL}" class="product-image" alt="${product.spbt}">
                    <div class="product-info">
                        <div class="product-title">${product.spbt}</div>
                        <div class="product-subtitle">${product.category || 'Premium'} | ${product.brand || 'Quality Product'}</div>
                        
                        <div class="product-note">
                          <i class="fas fa-external-link-alt"></i> Click to visit <strong>CNFANS</strong> official ordering page
                        </div>
                        
                        <div class="product-price">
                            <div>
                                <span class="us-price">${product.US || '--'}</span>
                                <span class="eur-price">${product.EUR || '--'}</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
            
            // 移除加载指示器
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
            
            productsContainer.appendChild(productCard);
        }
        
        // 增加页码
        currentPage++;
        
        // 检查是否已加载所有产品
        if (endIndex >= allProducts.length) {
            allProductsLoaded = true;
            // 可以添加一个提示，表示已加载所有产品
            const endMessage = document.createElement('div');
            endMessage.className = 'end-message';
            endMessage.textContent = '已加载全部产品';
            productsContainer.appendChild(endMessage);
        }
        
        isLoading = false;
    }, 300); // 300毫秒延迟，模拟网络请求
}

// 处理滚动事件的函数
function handleScroll() {
    // 如果正在加载或已加载所有产品，则不处理
    if (isLoading || allProductsLoaded) return;
    
    // 计算滚动位置
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 当滚动到页面底部附近时，加载更多产品
    if (scrollTop + windowHeight >= documentHeight - 200) {
        loadMoreProducts();
    }
}