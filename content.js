class ReadingMode {
  constructor() {
    this.isReadingMode = false;
    this.originalContent = null;
    this.readingModeContainer = null;
    this.keySequence = '';
    this.keyTimeout = null;
    
    this.init();
  }

  init() {
    this.setupKeyListener();
    this.setupCommandListener();
  }

  setupKeyListener() {
    document.addEventListener('keydown', (e) => {
      // Skip if user is typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      
      // Clear timeout if exists
      if (this.keyTimeout) {
        clearTimeout(this.keyTimeout);
      }
      
      // Add key to sequence
      this.keySequence += e.key.toLowerCase();
      console.log('Reading Mode: Key sequence:', this.keySequence);
      
      // Check if sequence matches 'aa'
      if (this.keySequence === 'aa') {
        console.log('Reading Mode: Activating reading mode');
        this.toggleReadingMode();
        this.keySequence = '';
        return;
      }
      
      // Keep only last 2 characters
      if (this.keySequence.length > 2) {
        this.keySequence = this.keySequence.slice(-2);
      }
      
      // Reset sequence after 1 second of inactivity
      this.keyTimeout = setTimeout(() => {
        this.keySequence = '';
      }, 1000);
    });
  }

  setupCommandListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'toggle-reading-mode') {
        this.toggleReadingMode();
      }
    });
  }

  toggleReadingMode() {
    if (this.isReadingMode) {
      this.exitReadingMode();
    } else {
      this.enterReadingMode();
    }
  }

  enterReadingMode() {
    console.log('Reading Mode: Entering reading mode');
    
    // Extract main content
    const content = this.extractMainContent();
    if (!content) {
      console.log('Reading Mode: Could not extract readable content');
      return;
    }

    // Store original state
    this.originalContent = {
      html: document.documentElement.innerHTML,
      title: document.title
    };

    // Create reading mode container
    this.createReadingModeUI(content);
    
    this.isReadingMode = true;
    document.body.classList.add('reading-mode-active');
  }

  exitReadingMode() {
    if (this.readingModeContainer) {
      this.readingModeContainer.remove();
      this.readingModeContainer = null;
    }
    
    document.body.classList.remove('reading-mode-active');
    this.isReadingMode = false;
  }

  extractMainContent() {
    const hostname = window.location.hostname;
    const config = getSiteConfig(hostname);
    
    console.log('Reading Mode: Starting content extraction for', hostname);
    console.log('Using config:', config);
    
    // Try custom extractor first if available
    if (config.customExtractor) {
      try {
        const customContent = config.customExtractor(config.selectors);
        if (customContent && this.hasEnoughText(customContent)) {
          console.log('Reading Mode: Using custom extractor');
          return {
            title: this.extractTitle(),
            content: customContent,
            url: window.location.href
          };
        }
      } catch (error) {
        console.log('Reading Mode: Custom extractor failed:', error);
      }
    }

    // Try configured selectors
    if (config.selectors && config.selectors.main) {
      const selectors = Array.isArray(config.selectors.main) ? config.selectors.main : [config.selectors.main];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element && this.hasEnoughText(element)) {
          console.log('Reading Mode: Found content with configured selector:', selector);
          return {
            title: this.extractTitle(),
            content: element.cloneNode(true),
            url: window.location.href
          };
        }
      }
    }

    // Fallback to body for simple sites
    const bodyContent = document.body;
    if (bodyContent && this.hasEnoughText(bodyContent)) {
      console.log('Reading Mode: Using body content as fallback');
      return {
        title: this.extractTitle(),
        content: bodyContent.cloneNode(true),
        url: window.location.href
      };
    }

    console.log('Reading Mode: No suitable content found');
    return null;
  }

  hasEnoughText(element) {
    const text = element.textContent.trim();
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    
    // Very lenient requirements
    const isEnough = text.length > 300 && wordCount > 50;
    
    if (isEnough) {
      console.log('Found enough text:', {
        element: element.tagName + (element.className ? '.' + element.className : ''),
        textLength: text.length,
        wordCount: wordCount
      });
    }
    
    return isEnough;
  }

  extractTitle() {
    // Try various title selectors
    const titleSelectors = [
      'h1', '.post-title', '.entry-title', '.article-title',
      '.title', '#title', 'meta[property="og:title"]',
      '[data-testid="tweet"] [data-testid="tweetText"]', // Twitter/X specific
      '.QuestionText', '.q-text' // Quora specific
    ];

    for (const selector of titleSelectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          let title = '';
          if (element.tagName === 'META') {
            title = element.getAttribute('content') || '';
          } else {
            title = element.textContent.trim();
          }
          
          if (title && title.length > 5 && title.length < 200) {
            return title;
          }
        }
      } catch (e) {
        // Invalid selector, continue
      }
    }

    // Extract from document title
    let docTitle = document.title;
    const separators = [' - ', ' | ', ' :: ', ' — ', ' – ', ' / '];
    
    for (const sep of separators) {
      if (docTitle.includes(sep)) {
        const parts = docTitle.split(sep);
        if (parts[0].length > 5) {
          return parts[0].trim();
        }
      }
    }

    return docTitle;
  }

  createReadingModeUI(contentData) {
    // Create overlay
    this.readingModeContainer = document.createElement('div');
    this.readingModeContainer.id = 'reading-mode-overlay';
    
    // Clean content based on site configuration
    const cleanContent = this.cleanContent(contentData.content);
    
    this.readingModeContainer.innerHTML = `
      <div class="reading-mode-header">
        <button class="reading-mode-close" title="Exit Reading Mode (press 'aa' again)">×</button>
        <h1 class="reading-mode-title">${contentData.title}</h1>
        <div class="reading-mode-url">${contentData.url}</div>
      </div>
      <div class="reading-mode-content">
        ${cleanContent.innerHTML}
      </div>
    `;

    // Add close button functionality
    const closeBtn = this.readingModeContainer.querySelector('.reading-mode-close');
    closeBtn.addEventListener('click', () => this.exitReadingMode());

    document.body.appendChild(this.readingModeContainer);
  }

  cleanContent(content) {
    const cleaned = content.cloneNode(true);
    const hostname = window.location.hostname;
    const config = getSiteConfig(hostname);
    
    console.log('Cleaning content for site type:', config.type, 'preserveComments:', config.preserveComments);
    
    // Remove site-specific unwanted elements first
    if (config.removeSelectors) {
      config.removeSelectors.forEach(selector => {
        try {
          const elements = cleaned.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        } catch (e) {
          console.log('Invalid selector:', selector);
        }
      });
    }
    
    // Base unwanted selectors that apply to all sites
    const baseUnwantedSelectors = [
      // Scripts and styles
      'script', 'style', 'noscript', 'link[rel="stylesheet"]',
      
      // Navigation and structure
      'nav', 'header', 'footer', '.navbar', '.navigation', '.nav',
      '.menu', '.breadcrumb', '.breadcrumbs',
      
      // Sidebars and widgets (always remove)
      '.sidebar', '.side-bar', '.widget', '.widgets', '[class*="sidebar"]',
      '[id*="sidebar"]', '.column-sidebar', '.secondary',
      
      // Advertisements and promotions
      '.ad', '.ads', '.advertisement', '.advert', '.adsystem', '.ad-banner',
      '[class*="ad-"]', '[id*="ad-"]', '[class*="ads-"]', '[id*="ads-"]',
      '[class*="advert"]', '[id*="advert"]', '.google-ad', '.adsense',
      '.banner', '.promo', '.promotion', '.sponsored', '.sponsor',
      
      // Social and sharing (except for discussion sites)
      '.social-share', '.share-buttons', '.social-buttons', '.sharing',
      '.social-media', '.share-box', '.share-tools', '.social-icons',
      '.follow-us', '.subscribe', '.newsletter',
      
      // UI chrome and overlays
      '.popup', '.modal', '.overlay', '.toast', '.notification',
      '.alert', '.banner-top', '.banner-bottom',
      
      // Generic patterns
      '[class*="widget"]', '[class*="banner"]', '[class*="promo"]',
      '[class*="sponsor"]', '[class*="track"]', '[class*="analytics"]'
    ];
    
    // Additional selectors for article sites (remove comments and related content)
    const articleOnlySelectors = [
      '.comments', '.comment-form', '.comment-section', '.discuss',
      '.disqus', '.livefyre', '.facebook-comments',
      '.related-posts', '.related-articles', '.recommendations',
      '.more-stories', '.you-may-like', '.suggested', '.similar',
      '.next-post', '.prev-post', '.post-navigation',
      '[class*="comment"]', '[class*="related"]', '[class*="recommend"]'
    ];
    
    // Combine selectors based on site configuration
    let unwantedSelectors = [...baseUnwantedSelectors];
    if (!config.preserveComments) {
      unwantedSelectors = unwantedSelectors.concat(articleOnlySelectors);
      unwantedSelectors.push('[class*="social"]', '[class*="share"]');
    }
    
    // Remove unwanted elements
    unwantedSelectors.forEach(selector => {
      try {
        const elements = cleaned.querySelectorAll(selector);
        elements.forEach(el => el.remove());
      } catch (e) {
        // Invalid selector, skip
      }
    });

    // Remove elements with suspicious attributes and content
    const allElements = cleaned.querySelectorAll('*');
    allElements.forEach(el => {
      const className = (el.className || '').toString().toLowerCase();
      const id = (el.id || '').toLowerCase();
      const innerText = el.textContent.toLowerCase();
      
      // Check for suspicious patterns in class/id names
      const suspiciousPatterns = [
        'ad', 'ads', 'advert', 'sponsor', 'promo', 'banner',
        'popup', 'modal', 'subscribe', 'newsletter', 'sidebar', 'widget'
      ];
      
      // For discussion sites, be more conservative about what we remove
      if (!config.preserveComments) {
        suspiciousPatterns.push('social', 'share', 'comment', 'related', 'recommend');
      }
      
      const isSuspicious = suspiciousPatterns.some(pattern => 
        className.includes(pattern) || id.includes(pattern)
      );
      
      // Remove elements that are clearly non-content
      const isNonContent = 
        innerText.includes('advertisement') ||
        innerText.includes('sponsored') ||
        (!config.preserveComments && (
          innerText.includes('related articles') ||
          innerText.includes('you may also like') ||
          innerText.includes('more stories')
        )) ||
        (el.tagName === 'DIV' && el.children.length === 0 && el.textContent.trim().length < 50);
      
      if (isSuspicious || isNonContent) {
        el.remove();
      }
    });

    // Clean attributes to remove tracking and styling
    const cleanedElements = cleaned.querySelectorAll('*');
    const keepAttributes = ['href', 'src', 'alt', 'title', 'colspan', 'rowspan', 'data-testid'];
    
    cleanedElements.forEach(el => {
      const attributes = [...el.attributes];
      attributes.forEach(attr => {
        if (!keepAttributes.includes(attr.name.toLowerCase())) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Remove empty elements
    this.removeEmptyElements(cleaned);

    console.log('Content cleaned, remaining elements:', cleaned.children.length);
    return cleaned;
  }

  removeEmptyElements(container) {
    // Multiple passes to catch nested empty elements
    for (let i = 0; i < 3; i++) {
      const emptyElements = container.querySelectorAll('*:empty');
      emptyElements.forEach(el => {
        const tagName = el.tagName.toLowerCase();
        const keepEmpty = ['img', 'br', 'hr', 'input', 'textarea', 'video', 'audio', 'source', 'track', 'embed', 'iframe'];
        if (!keepEmpty.includes(tagName)) {
          el.remove();
        }
      });
    }
    
    // Remove elements with only whitespace
    const allElements = container.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.children.length === 0 && el.textContent.trim().length === 0) {
        const tagName = el.tagName.toLowerCase();
        const keepEmpty = ['img', 'br', 'hr', 'input', 'textarea', 'video', 'audio'];
        if (!keepEmpty.includes(tagName)) {
          el.remove();
        }
      }
    });
  }
}

// Initialize reading mode
const readingMode = new ReadingMode();

// Listen for commands from popup or shortcuts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle-reading-mode') {
    readingMode.toggleReadingMode();
  }
});