# FFBuy SpreadSheet

一个展示各种产品分类的电子商务网站，从Google Sheets数据源动态加载产品信息。

## 功能特点

- 多个产品分类展示（HOT PRODUCTS、T-Shirt、Pants、Shoes等）
- 从Google Sheets API动态加载产品数据
- 双币种价格显示（美元和人民币）
- 响应式设计，适配各种设备
- 产品搜索过滤功能
- 产品卡片动画效果
- 返回顶部和帮助按钮

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- OpenSheet API (用于访问Google Sheets数据)

## 页面说明

- `HOT PRODUCTS.html` - 热门产品页面
- `T-Shirt.html` - T恤分类页面
- `Pants.html` - 裤子分类页面
- `Shoes.html` - 鞋子分类页面
- `Set.html` - 套装分类页面
- `Accessories.html` - 配饰分类页面
- `Hoodie Sweatshirt.html` - 卫衣/运动衫分类页面
- `ELECTRONICOS.html` - 电子产品分类页面

## 使用方法

1. 克隆仓库到本地
2. 直接在浏览器中打开任意HTML文件即可浏览
3. 首页会自动重定向到HOT PRODUCTS页面

## 数据源

所有产品数据通过OpenSheet API从Google Sheets获取：
`https://opensheet.elk.sh/1hs4cXFLQRhdR8MfQ0vt0oMXhXplksGbU9vzkhO46J6A/[分类名称]`

## 许可证

MIT