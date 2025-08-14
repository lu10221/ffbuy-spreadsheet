# CONFIG系统使用指南

## 概述

现在所有页面的API调用都已经统一使用CONFIG系统，这意味着：
- ✅ **API地址修改**：只需修改 `config.js` 中的 `CONFIG.API.BASE_URL`
- ✅ **分类管理**：只需修改 `config.js` 中的 `CONFIG.categories` 数组
- ✅ **全站生效**：一处修改，全站更新

## 核心文件结构

```
├── config.js              # 🎯 核心配置文件
├── product-service.js     # 统一的产品服务
├── category-navigation.js # 分类导航功能
├── global-search.js       # 全局搜索功能
└── [分类页面].html        # 各分类页面
```

## 1. 修改API地址

### 当前配置
```javascript
CONFIG.API.BASE_URL = 'https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A'
```

### 修改方法
1. 打开 `config.js`
2. 找到 `CONFIG.API.BASE_URL`
3. 修改为新的API地址
4. 保存文件

**示例：**
```javascript
// 修改前
CONFIG.API.BASE_URL = 'https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A'

// 修改后
CONFIG.API.BASE_URL = 'https://new-api-provider.com/your-spreadsheet-id'
```

## 2. 管理分类

### 添加新分类

在 `config.js` 的 `CONFIG.categories` 数组中添加：

```javascript
CONFIG.categories.push({
    name: 'NewCategory',           // 分类名称
    endpoint: 'NewCategory',       // API端点
    icon: 'fas fa-star',          // 图标类名
    fileName: 'NewCategory.html',  // 对应的HTML文件名
    displayName: 'New Category'    // 显示名称
});
```

### 修改现有分类

找到对应的分类对象并修改：

```javascript
// 修改T-Shirt分类的显示名称
{
    name: 'T-Shirt',
    endpoint: 'T-Shirt',
    icon: 'fas fa-tshirt',
    fileName: 'T-Shirt.html',
    displayName: 'T恤衫'  // 修改这里
}
```

### 删除分类

从 `CONFIG.categories` 数组中移除对应的对象。

## 3. 页面如何使用CONFIG

### 自动化的部分

所有页面都已经配置为自动使用CONFIG：

```html
<!-- 每个页面都引入了config.js -->
<script src="config.js"></script>
<script src="product-service.js"></script>
<script src="product-renderer.js"></script>

<script>
// 页面自动根据文件名加载对应分类的数据
document.addEventListener('DOMContentLoaded', async function() {
    await productRenderer.loadProducts('T-Shirt'); // 自动使用CONFIG
});
</script>
```

### API调用流程

1. **页面调用** → `productRenderer.loadProducts('T-Shirt')`
2. **服务层** → `productService.fetchProducts('T-Shirt')`
3. **URL生成** → `CONFIG.UTILS.getCategoryUrl('T-Shirt')`
4. **最终URL** → `https://opensheet.elk.sh/.../T-Shirt`

## 4. 实际使用场景

### 场景1：更换数据源

```javascript
// 从Google Sheets切换到其他API
CONFIG.API.BASE_URL = 'https://api.example.com/products'
```

### 场景2：添加新产品分类

```javascript
// 1. 在config.js中添加分类
CONFIG.categories.push({
    name: 'Watches',
    endpoint: 'Watches',
    icon: 'fas fa-clock',
    fileName: 'Watches.html',
    displayName: '手表'
});

// 2. 复制现有页面创建Watches.html
// 3. 页面会自动使用新配置
```

### 场景3：修改分类端点

```javascript
// 如果后端API的端点名称改变了
{
    name: 'T-Shirt',
    endpoint: 'TShirts',  // 从'T-Shirt'改为'TShirts'
    icon: 'fas fa-tshirt',
    fileName: 'T-Shirt.html',
    displayName: 'T-Shirt'
}
```

## 5. 测试和验证

### 使用测试页面

访问 `config-test.html` 来验证配置：

```
http://localhost:8000/config-test.html
```

### 检查控制台

打开浏览器开发者工具，检查：
- 是否有CONFIG相关错误
- API请求是否使用了正确的URL
- 分类数据是否正确加载

## 6. 最佳实践

### ✅ 推荐做法

1. **修改前备份** `config.js`
2. **逐步测试** 修改一个分类后先测试
3. **保持一致性** 确保 `name`、`endpoint`、`fileName` 的对应关系
4. **使用工具函数** 利用 `CONFIG.UTILS` 中的辅助函数

### ❌ 避免的做法

1. **直接修改其他文件** 不要在HTML或JS文件中硬编码API地址
2. **不一致的命名** 确保分类名称在各处保持一致
3. **忘记测试** 修改后务必测试相关功能

## 7. 故障排除

### 常见问题

**问题1：页面显示"Failed to load products"**
- 检查 `CONFIG.API.BASE_URL` 是否正确
- 检查网络连接
- 查看浏览器控制台的错误信息

**问题2：分类导航不显示新分类**
- 确认已在 `CONFIG.categories` 中添加
- 检查 `fileName` 是否与实际文件名匹配
- 刷新页面缓存

**问题3：API调用使用了旧地址**
- 确认所有页面都引入了最新的 `config.js`
- 清除浏览器缓存
- 检查是否有文件仍在使用硬编码URL

### 调试技巧

```javascript
// 在浏览器控制台中检查CONFIG
console.log('CONFIG:', CONFIG);
console.log('API Base URL:', CONFIG.API.BASE_URL);
console.log('Categories:', CONFIG.categories);

// 测试URL生成
console.log('T-Shirt URL:', CONFIG.UTILS.getCategoryUrl('T-Shirt'));
```

## 总结

通过CONFIG系统，现在可以：

- 🎯 **一处修改，全站生效**
- 🔧 **轻松管理API地址和分类**
- 🚀 **快速添加新分类**
- 🛡️ **避免硬编码带来的维护问题**

所有的API调用都已经统一使用CONFIG，确保了配置的一致性和可维护性。