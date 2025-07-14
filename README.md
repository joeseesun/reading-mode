# Reading Mode Browser Extension

A powerful browser extension that transforms web pages into clean, distraction-free reading experiences with intelligent content detection and site-specific optimizations.

![Reading Mode Demo](https://img.shields.io/badge/Chrome-Extension-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

🎯 **Smart Content Detection**
- Automatically identifies main content on any website
- Site-specific extraction rules for optimal results
- Intelligent fallback strategies for unknown sites

💬 **Context-Aware Content Filtering**
- **Discussion Platforms**: Preserves comments and replies (Reddit, Twitter/X, Hacker News, Stack Overflow)
- **Article Sites**: Provides clean reading experience (news sites, blogs, documentation)

🧹 **Advanced Content Cleaning**
- Removes advertisements, sidebars, and navigation
- Eliminates social sharing buttons and widgets
- Strips tracking attributes while preserving essential links

🎨 **Beautiful Reading Experience**
- Clean, typography-focused design
- Dark mode support
- Responsive layout for all screen sizes
- Optimized for Chinese and international content

## Quick Start

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/joeseesun/reading-mode.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the cloned directory

### Usage

**Keyboard Shortcut**: Press `aa` on any webpage to toggle reading mode

**Alternative**: Click the extension icon in your browser toolbar

## Supported Sites

### Discussion Platforms (Comments Preserved)
- Reddit - Posts and comment threads
- Twitter/X - Tweets and replies  
- Hacker News - Articles and discussions
- Stack Overflow - Questions and answers
- Quora - Questions and responses

### Article Sites (Clean Reading)
- 36kr.com - Chinese tech news
- Medium - Blog posts
- Paul Graham's essays
- TechCrunch, Ars Technica, The Verge
- Personal blogs and documentation sites

## Architecture

### Configuration-Driven Design
The extension uses a modular, configuration-driven architecture that makes it easy to add support for new websites:

```javascript
// site-config.js
'example.com': {
  type: 'discussion',           // or 'article'
  selectors: {
    main: '.content-selector',
    comments: '.comments'
  },
  preserveComments: true,
  customExtractor: (selectors) => {
    // Custom extraction logic
  }
}
```

### Core Components

- **`content.js`** - Main content script with extraction logic
- **`site-config.js`** - Site-specific configuration rules
- **`reading-mode.css`** - Clean, responsive styling
- **`manifest.json`** - Extension configuration

## Development

### Adding New Site Support

1. Add configuration to `site-config.js`:
   ```javascript
   'newsite.com': {
     type: 'article',  // or 'discussion'
     selectors: { main: '.article-content' },
     preserveComments: false
   }
   ```

2. Test on the target website
3. Refine selectors and add custom extraction logic if needed

### Development Principles

This project follows specific development principles documented in [`DEVELOPMENT_PRINCIPLES.md`](./DEVELOPMENT_PRINCIPLES.md), including:

- Configuration-driven architecture
- File replacement over in-place editing
- Context-aware content strategy
- Progressive enhancement approach

## Browser Compatibility

- ✅ Chrome (Manifest V3)
- ✅ Edge (Chromium-based)
- 🔄 Firefox (planned - requires Manifest V2 version)
- 🔄 Safari (planned)

## Contributing

Contributions are welcome! Please feel free to:

1. Report bugs and request features via [Issues](https://github.com/joeseesun/reading-mode/issues)
2. Submit pull requests with improvements
3. Add support for new websites by updating `site-config.js`

### Development Setup

```bash
# Clone the repository
git clone https://github.com/joeseesun/reading-mode.git
cd reading-mode

# Load the extension in Chrome for testing
# 1. Open chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked" and select this directory
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [SimpleRead](https://github.com/Kenshin/simpread) for content extraction strategies
- Built with modern web extension APIs (Manifest V3)
- Designed for global accessibility and multilingual content

---

**Made with ❤️ for better reading experiences on the web**