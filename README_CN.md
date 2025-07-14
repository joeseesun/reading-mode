# 阅读模式浏览器扩展

一款强大的浏览器扩展，将网页转换为简洁、无干扰的阅读体验，具备智能内容检测和网站特定优化功能。

![阅读模式演示](https://img.shields.io/badge/Chrome-Extension-green)
![许可证](https://img.shields.io/badge/license-MIT-blue)

## 功能特色

🎯 **智能内容检测**
- 自动识别任何网站的主要内容
- 针对特定网站的内容提取规则，确保最佳效果
- 为未知网站提供智能回退策略

💬 **上下文感知的内容过滤**
- **讨论平台**：保留评论和回复（Reddit、Twitter/X、Hacker News、Stack Overflow）
- **文章网站**：提供纯净的阅读体验（新闻网站、博客、文档）

🧹 **高级内容清理**
- 移除广告、侧边栏和导航栏
- 清除社交分享按钮和小工具
- 去除跟踪属性，同时保留重要链接

🎨 **美观的阅读体验**
- 简洁、专注于排版的设计
- 支持深色模式
- 适配所有屏幕尺寸的响应式布局
- 针对中文和国际内容优化

## 快速开始

### 安装

1. 克隆此仓库：
   ```bash
   git clone https://github.com/joeseesun/reading-mode.git
   ```

2. 打开Chrome浏览器，访问 `chrome://extensions/`

3. 在右上角启用"开发者模式"

4. 点击"加载已解压的扩展程序"，选择克隆的目录

### 使用方法

**键盘快捷键**：在任何网页上按 `aa` 切换阅读模式

**备选方法**：点击浏览器工具栏中的扩展图标

## 支持的网站

### 讨论平台（保留评论）
- Reddit - 帖子和评论串
- Twitter/X - 推文和回复
- Hacker News - 文章和讨论
- Stack Overflow - 问题和答案
- Quora - 问题和回复
- 知乎 - 问题和回答

### 文章网站（纯净阅读）
- 36氪 - 中文科技新闻
- Medium - 博客文章
- Paul Graham 的文章
- TechCrunch、Ars Technica、The Verge
- 个人博客和文档网站

## 架构设计

### 配置驱动设计
扩展采用模块化、配置驱动的架构，使添加新网站支持变得简单：

```javascript
// site-config.js
'example.com': {
  type: 'discussion',           // 或 'article'
  selectors: {
    main: '.content-selector',
    comments: '.comments'
  },
  preserveComments: true,
  customExtractor: (selectors) => {
    // 自定义提取逻辑
  }
}
```

### 核心组件

- **`content.js`** - 主内容脚本，包含提取逻辑
- **`site-config.js`** - 网站特定配置规则
- **`reading-mode.css`** - 简洁、响应式样式
- **`manifest.json`** - 扩展配置

## 开发

### 添加新网站支持

1. 在 `site-config.js` 中添加配置：
   ```javascript
   'newsite.com': {
     type: 'article',  // 或 'discussion'
     selectors: { main: '.article-content' },
     preserveComments: false
   }
   ```

2. 在目标网站上测试
3. 细化选择器，如需要可添加自定义提取逻辑

### 开发原则

本项目遵循 [`DEVELOPMENT_PRINCIPLES.md`](./DEVELOPMENT_PRINCIPLES.md) 中记录的特定开发原则，包括：

- 配置驱动架构
- 文件替换而非就地编辑
- 上下文感知内容策略
- 渐进增强方法

## 浏览器兼容性

- ✅ Chrome (Manifest V3)
- ✅ Edge (基于Chromium)
- 🔄 Firefox (计划中 - 需要 Manifest V2 版本)
- 🔄 Safari (计划中)

## 贡献

欢迎贡献！你可以：

1. 通过 [Issues](https://github.com/joeseesun/reading-mode/issues) 报告Bug和请求功能
2. 提交改进的Pull Request
3. 通过更新 `site-config.js` 添加新网站支持

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/joeseesun/reading-mode.git
cd reading-mode

# 在Chrome中加载扩展进行测试
# 1. 打开 chrome://extensions/
# 2. 启用开发者模式
# 3. 点击"加载已解压的扩展程序"，选择此目录
```

## 使用场景

### 📰 新闻阅读
在36氪、TechCrunch等新闻网站上获得纯净的阅读体验，去除广告和侧边栏干扰。

### 💬 社区讨论
在Reddit、知乎、Hacker News上保留有价值的评论和讨论，同时移除无关元素。

### 📝 博客文章
在Medium、个人博客上专注于文章内容，享受优雅的排版。

### 🐦 社交媒体
在Twitter/X上查看推文串和回复，过滤掉广告和推荐内容。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 致谢

- 内容提取策略受 [SimpleRead](https://github.com/Kenshin/simpread) 启发
- 使用现代Web扩展API（Manifest V3）构建
- 为全球可访问性和多语言内容而设计

---

**用 ❤️ 为更好的网络阅读体验而制作**