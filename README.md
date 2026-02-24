# 爱诗伦 ACELYNN 公司网站

## 项目简介
这是一个为生物科技公司打造的企业网站，采用蓝色基调设计，支持中英文双语，包含完整的后台管理功能。

## 功能特性

### 前台页面
- 🏠 **首页** - 公司介绍、产品展示、核心优势
- 👥 **关于我们** - 公司简介、使命愿景
- 📦 **产品中心** - 产品列表、分类筛选、搜索
- 📰 **新闻资讯** - 公司新闻动态
- 📞 **联系我们** - 联系方式、在线留言
- 🌐 **双语支持** - 中文/英文一键切换

### 后台管理
- 📦 **产品管理** - 添加、编辑、删除产品
- 📰 **新闻管理** - 添加、编辑、删除新闻
- 📝 **网站内容** - 编辑公司简介、联系方式等
- 📂 **Excel导入** - 批量导入产品数据
- 💾 **数据导出** - 导出产品Excel、完整数据JSON

## 文件结构

```
companywebsite/
├── index.html          # 首页
├── about.html          # 关于我们
├── products.html       # 产品中心
├── news.html           # 新闻资讯
├── contact.html        # 联系我们
├── admin.html          # 后台管理
├── css/
│   ├── style.css       # 前台样式
│   └── admin.css       # 后台样式
├── js/
│   ├── data.js         # 数据管理
│   ├── main.js         # 前台逻辑
│   └── admin.js        # 后台逻辑
├── public/
│   └── images/
│       └── logo.png    # 公司Logo
└── data/               # 数据目录
```

## 快速开始

### 1. 添加Logo
将你的公司Logo图片保存为 `public/images/logo.png`

### 2. 打开网站
直接用浏览器打开 `index.html` 即可查看网站

### 3. 进入后台
点击网站右上角的 🔧 图标，或直接打开 `admin.html`

## Excel导入格式

Excel表格应包含以下列（列名支持中英文）：
- 产品名称 / name / Name
- 英文名称 / nameEn / Name EN
- 分类 / category / Category
- 价格 / price / Price
- 描述 / desc / Description
- 英文描述 / descEn / Description EN

## 数据存储
网站数据保存在浏览器的 localStorage 中，建议定期在后台导出数据备份。

## 技术栈
- 纯 HTML5 + CSS3 + JavaScript
- 无需服务器或数据库
- 使用 SheetJS 库处理Excel
