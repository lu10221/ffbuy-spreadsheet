# 配置系统使用指南

## 概述

本项目已经优化为使用集中配置管理系统，所有API地址、分类信息、站点配置都统一在 `config.js` 文件中管理。

## 核心文件

### 1. `config.js` - 主配置文件
包含所有项目配置：
- 🌐 **API配置**: 基础URL、超时设置、重试机制
- 📂 **分类配置**: 所有产品分类的完整信息
- 🎨 **站点配置**: 站点名称、Logo等
- 💳 **支付方式**: 支持的支付方式和图标
- 🔒 **信任信息**: 安全提示和平台信息
- ⚙️ **其他配置**: 分页、缓存、错误消息等

### 2. `config-manager.js` - 配置管理器
提供便捷的配置访问和管理方法：
```javascript
// 获取配置值
const apiUrl = configManager.getConfig('API.BASE_URL');

// 获取分类信息
const category = configManager.getCategoryByName('Shoes');

// 获取当前页面分类
const currentCategory = configManager.getCurrentPageCategory();
```

### 3. `navigation-generator.js` - 导航生成器
基于配置自动生成页面导航和组件：
- 自动生成导航菜单
- 自动生成支付方式显示
- 自动生成信任信息栏
- 自动更新页面标题

## 🔧 如何使用配置系统

### 在HTML中使用

```html
<!-- 必须按顺序加载 -->
<script src="config.js"></script>
<script src="config-manager.js"></script>
<script src="navigation-generator.js"></script>
```

### 在JavaScript中使用

```javascript
// 获取API配置
const apiUrl = CONFIG.API.BASE_URL;
const timeout = CONFIG.API.TIMEOUT;

// 获取分类信息
const categories = CONFIG.categories;
const shoesCategory = CONFIG.categories.find(c => c.name === 'Shoes');

// 获取站点信息
const siteName = CONFIG.SITE.NAME;
const defaultCategory = CONFIG.SITE.DEFAULT_CATEGORY;

// 🆕 使用新的工具函数
// 生成分类API URL（推荐）
const categoryUrl = CONFIG.UTILS.getCategoryUrl('Shoes');

// 根据分类名获取分类对象
const category = CONFIG.UTILS.getCategoryByName('Shoes');

// 根据文件名获取分类对象
const categoryByFile = CONFIG.UTILS.getCategoryByFileName('Shoes.html');

// 获取默认分类对象
const defaultCategoryObj = CONFIG.SITE.defaultCategory;
```

## 使用方法

### 在HTML页面中引入

```html
<!-- 🔥 核心配置文件 - 必须最先加载 -->
<script src="config.js"></script>

<!-- 🔥 配置管理器 - 提供配置相关工具 -->
<script src="config-manager.js"></script>

<!-- 🔥 导航生成器 - 基于配置自动生成导航 -->
<script src="navigation-generator.js"></script>
```

### 在JavaScript中使用配置

```javascript
// 方法1: 直接访问全局CONFIG对象
const categories = CONFIG.categories;
const apiBaseUrl = CONFIG.API.BASE_URL;

// 方法2: 使用配置管理器（推荐）
const categories = configManager.getAllCategories();
const apiUrl = configManager.getApiUrl('Shoes');

// 方法3: 使用全局便捷方法
const category = getCategoryByName('Shoes');
const apiUrl = getApiUrl('Shoes');
```

### 获取分类信息

```javascript
// 获取所有分类
const allCategories = configManager.getAllCategories();

// 根据名称获取分类
const shoesCategory = configManager.getCategoryByName('Shoes');

// 根据文件名获取分类
const category = configManager.getCategoryByFileName('Shoes.html');

// 获取分类的API URL
const apiUrl = configManager.getCategoryApiUrl('Shoes');
```

### 自动导航生成

导航生成器会自动：
1. 根据当前页面文件名确定活跃分类
2. 生成完整的导航菜单HTML
3. 更新页面标题
4. 生成支付方式显示
5. 生成信任信息栏

## 配置结构

### 分类配置示例
```javascript
{
    name: 'Shoes',              // 分类名称（用于程序识别）
    endpoint: 'Shoes',          // API端点
    icon: 'fas fa-shoe-prints', // 图标类名
    fileName: 'Shoes.html',     // 对应的HTML文件名
    displayName: 'Shoes'        // 显示名称
}
```

### API配置示例
```javascript
API: {
    BASE_URL: 'https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A',
    TIMEOUT: 10000,
    RETRY_COUNT: 3,
    RETRY_DELAY: 1000
}
```

## 添加新分类

1. 在 `config.js` 的 `categories` 数组中添加新分类：
```javascript
{
    name: 'NewCategory',
    endpoint: 'NewCategory',
    icon: 'fas fa-new-icon',
    fileName: 'NewCategory.html',
    displayName: 'New Category'
}
```

2. 创建对应的HTML文件，引入必要的脚本

3. 导航会自动更新，无需手动修改其他文件

## 修改API地址

只需在 `config.js` 中修改 `API.BASE_URL`：
```javascript
API: {
    BASE_URL: 'https://your-new-api-url.com/endpoint'
}
```

所有页面会自动使用新的API地址。



## 🚀 新增优化功能

### 1. 统一API URL生成
```javascript
// ❌ 旧方式 - 硬编码拼接
const apiUrl = `https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A/${endpoint}`;

// ✅ 新方式 - 使用工具函数
const apiUrl = CONFIG.UTILS.getCategoryUrl(endpoint);
```

### 2. 自动URL编码
```javascript
// 自动处理带空格的endpoint
CONFIG.UTILS.getCategoryUrl('Hoodie Sweatshirt'); // 自动编码为 'Hoodie%20Sweatshirt'
```

### 3. 智能默认分类
```javascript
// 自动获取默认分类对象
const defaultCat = CONFIG.SITE.defaultCategory;
console.log(defaultCat.name, defaultCat.endpoint, defaultCat.fileName);
```

### 4. 配置驱动的导航
- 导航菜单完全基于 `CONFIG.categories` 自动生成
- 新增分类只需修改配置文件，无需手动更新HTML
- 支持图标、显示名称、文件名的独立配置

## 最佳实践

1. **始终使用配置管理器**：避免直接访问CONFIG对象
2. **保持配置一致性**：确保分类的name、endpoint、fileName等字段正确对应
3. **使用语义化命名**：分类名称应该清晰易懂
4. **及时更新文档**：添加新配置时更新相关文档

## 迁移现有页面

对于现有的HTML页面，按以下步骤迁移：

1. 添加新的脚本引用（config-manager.js, navigation-generator.js）
2. 移除硬编码的导航HTML（可选，导航生成器会自动覆盖）
3. 使用新的工具函数替换URL拼接
4. 更新JavaScript代码使用配置管理器获取API URL
5. 测试页面功能正常

## 调试工具

在开发环境中，可以使用以下调试命令：

```javascript
// 在浏览器控制台中
debugConfig(); // 显示完整配置信息
configManager.debugConfig(); // 详细调试信息

// 检查配置是否加载
console.log('CONFIG loaded:', typeof CONFIG !== 'undefined');

// 查看所有分类
console.table(CONFIG.categories);

// 测试导航生成
console.log(navigationGenerator.generateNavigation());

// 测试工具函数
console.log('API URL:', CONFIG.UTILS.getCategoryUrl('Shoes'));
console.log('Default category:', CONFIG.SITE.defaultCategory);
```

## 示例文件

- `page-template.html` - 新页面的标准模板
- `Shoes.html` - 已更新使用新配置系统的示例页面

通过这个配置系统，项目的维护变得更加简单，添加新分类或修改API地址只需要修改一个文件即可。