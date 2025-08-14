# FFBuy SpreadSheet

一个现代化的单页应用（SPA）电子商务网站，从Google Sheets数据源动态加载产品信息，支持URL参数路由的分类切换。

## 功能特点

- **单页应用架构** - 无需页面刷新的流畅分类切换体验
- **URL参数路由** - 支持 `?category=分类名` 的直链访问
- **多个产品分类** - HOTPRODUCTS、T-Shirt、Pants、Shoes、CheapShoes、Set、Accessories、Hoodie-Sweatshirt、ELECTRONICOS、PERFUME
- **动态数据加载** - 从Google Sheets API实时获取产品数据
- **双币种价格显示** - 美元和人民币价格对比
- **响应式设计** - 完美适配桌面端和移动端
- **全局产品搜索** - 跨分类的智能搜索过滤功能
- **产品详情模态框** - 点击查看详细信息
- **信任信息展示** - 支付方式和平台安全提示
- **浮动操作按钮** - 返回顶部和帮助功能

## 技术栈

- **前端架构**: 单页应用（SPA）
- **核心技术**: HTML5, CSS3, 原生JavaScript
- **配置管理**: 集中化配置系统
- **数据源**: OpenSheet API (Google Sheets)
- **路由**: URL参数路由

## 项目结构

- `index.html` - SPA主页面，所有分类都在此页面展示
- `config.js` - 核心配置文件，管理所有分类和API设置
- `config-manager.js` - 配置管理器，提供配置访问方法
- `navigation-generator.js` - 导航生成器，基于配置自动生成导航
- `product-service.js` - 产品数据服务
- `product-renderer.js` - 产品渲染器
- `global-search.js` - 全局搜索功能
- `styles.css` - 主样式文件

## 使用方法

1. 克隆仓库到本地
2. 启动本地服务器：`python -m http.server 8000`
3. 访问 `http://localhost:8000/` 查看默认分类
4. 使用URL参数切换分类：`http://localhost:8000/?category=T-Shirt`

## 分类访问

通过URL参数访问不同分类：
- `?category=HOTPRODUCTS` - 热门产品
- `?category=T-Shirt` - T恤
- `?category=Pants` - 裤子
- `?category=Shoes` - 鞋子
- `?category=CheapShoes` - 特价鞋
- `?category=Set` - 套装
- `?category=Accessories` - 配饰
- `?category=Hoodie-Sweatshirt` - 卫衣/运动衫
- `?category=ELECTRONICOS` - 电子产品
- `?category=PERFUME` - 香水

## 许可证

MIT
