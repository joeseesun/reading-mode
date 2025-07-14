// Site-specific configuration for reading mode
const SITE_CONFIG = {
  // Discussion platforms - preserve comments and interactions
  'reddit.com': {
    type: 'discussion',
    selectors: {
      main: '[data-testid="post-content"], .Post, [class*="Post"]',
      comments: '[data-testid="comment"], .Comment, [class*="Comment"]',
      commentsContainer: '[class*="comments"], [data-testid="comments-page-link-num-comments"]'
    },
    preserveComments: true,
    customExtractor: (selectors) => {
      const post = document.querySelector(selectors.main);
      const commentsContainer = document.querySelector(selectors.comments)?.closest(selectors.commentsContainer);
      
      if (post) {
        const container = document.createElement('div');
        container.appendChild(post.cloneNode(true));
        
        if (commentsContainer) {
          const commentsSection = document.createElement('div');
          commentsSection.innerHTML = '<h2>Comments</h2>';
          commentsSection.appendChild(commentsContainer.cloneNode(true));
          container.appendChild(commentsSection);
        }
        
        return container;
      }
      return null;
    }
  },

  'twitter.com': {
    type: 'discussion',
    selectors: {
      main: '[data-testid="tweetText"], [data-testid="tweet"]',
      comments: '[data-testid="reply"], [data-testid="tweetText"]',
      commentsContainer: '[aria-label*="replies"], [data-testid="primaryColumn"]'
    },
    preserveComments: true,
    customExtractor: (selectors) => {
      // Find the main tweet
      const mainTweet = document.querySelector('[data-testid="tweet"]');
      if (!mainTweet) return null;
      
      const container = document.createElement('div');
      
      // Add main tweet
      container.appendChild(mainTweet.cloneNode(true));
      
      // Find replies/comments
      const replies = document.querySelectorAll('[data-testid="tweet"]');
      if (replies.length > 1) {
        const repliesSection = document.createElement('div');
        repliesSection.innerHTML = '<h2>Replies</h2>';
        
        // Skip the first tweet (main tweet) and add replies
        Array.from(replies).slice(1).forEach(reply => {
          repliesSection.appendChild(reply.cloneNode(true));
        });
        
        container.appendChild(repliesSection);
      }
      
      return container;
    }
  },

  'x.com': {
    // X.com uses same structure as Twitter
    type: 'discussion',
    selectors: {
      main: '[data-testid="tweetText"], [data-testid="tweet"]',
      comments: '[data-testid="reply"], [data-testid="tweetText"]',
      commentsContainer: '[aria-label*="replies"], [data-testid="primaryColumn"]'
    },
    preserveComments: true,
    customExtractor: (selectors) => {
      // Same as Twitter
      const mainTweet = document.querySelector('[data-testid="tweet"]');
      if (!mainTweet) return null;
      
      const container = document.createElement('div');
      container.appendChild(mainTweet.cloneNode(true));
      
      const replies = document.querySelectorAll('[data-testid="tweet"]');
      if (replies.length > 1) {
        const repliesSection = document.createElement('div');
        repliesSection.innerHTML = '<h2>Replies</h2>';
        
        Array.from(replies).slice(1).forEach(reply => {
          repliesSection.appendChild(reply.cloneNode(true));
        });
        
        container.appendChild(repliesSection);
      }
      
      return container;
    }
  },

  'news.ycombinator.com': {
    type: 'discussion',
    selectors: {
      main: '.fatitem, .athing',
      comments: '.comment-tree, .commtext'
    },
    preserveComments: true,
    customExtractor: (selectors) => {
      const main = document.querySelector(selectors.main);
      const comments = document.querySelector(selectors.comments);
      
      if (main) {
        const container = document.createElement('div');
        container.appendChild(main.cloneNode(true));
        
        if (comments) {
          const commentsSection = document.createElement('div');
          commentsSection.innerHTML = '<h2>Comments</h2>';
          commentsSection.appendChild(comments.cloneNode(true));
          container.appendChild(commentsSection);
        }
        
        return container;
      }
      return null;
    }
  },

  'stackoverflow.com': {
    type: 'discussion',
    selectors: {
      main: '.question, #question',
      comments: '.answer, .comments'
    },
    preserveComments: true
  },

  'quora.com': {
    type: 'discussion',
    selectors: {
      main: '.q-text, .QuestionText',
      comments: '.Answer, .AnswerBase'
    },
    preserveComments: true
  },

  // Article sites - clean reading experience without comments
  '36kr.com': {
    type: 'article',
    selectors: {
      main: '.article-detail-bd, .article-content, .kr-content'
    },
    preserveComments: false,
    removeSelectors: ['.kr-aside', '.kr-nav', '.article-actions', '.share-box']
  },

  'paulgraham.com': {
    type: 'article',
    selectors: {
      main: 'body'
    },
    preserveComments: false,
    removeSelectors: ['img[src*="arc.png"]', 'img[width="12"]'],
    customExtractor: (selectors) => {
      const body = document.body;
      if (body && body.textContent.length > 1000) {
        return body.cloneNode(true);
      }
      return null;
    }
  },

  'medium.com': {
    type: 'article',
    selectors: {
      main: 'article, .postArticle-content, [data-testid="post-content"]'
    },
    preserveComments: false
  },

  'substack.com': {
    type: 'article',
    selectors: {
      main: '.post-content, .markup, article'
    },
    preserveComments: false
  },

  'techcrunch.com': {
    type: 'article',
    selectors: {
      main: '.article-content, .post-content, .entry-content'
    },
    preserveComments: false
  },

  'arstechnica.com': {
    type: 'article',
    selectors: {
      main: '.post-content, .article-content'
    },
    preserveComments: false
  },

  'theverge.com': {
    type: 'article',
    selectors: {
      main: '.c-entry-content, .article-content'
    },
    preserveComments: false
  },

  // Generic fallback configuration
  'default': {
    type: 'article',
    selectors: {
      main: [
        'article', '[role="main"]', 'main', '.post-content', '.entry-content',
        '.content', '#content', '.article-content', '.post-body', '.post',
        '.entry', '.story', '.article', '.blog-post'
      ]
    },
    preserveComments: false
  }
};

// Get configuration for a specific hostname
function getSiteConfig(hostname) {
  // Remove www. prefix
  const cleanHostname = hostname.replace(/^www\./, '');
  
  // Check for exact match
  if (SITE_CONFIG[cleanHostname]) {
    return SITE_CONFIG[cleanHostname];
  }
  
  // Check for partial matches (for subdomains)
  for (const [domain, config] of Object.entries(SITE_CONFIG)) {
    if (domain !== 'default' && cleanHostname.includes(domain)) {
      return config;
    }
  }
  
  // Return default configuration
  return SITE_CONFIG.default;
}

// Export for use in content script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SITE_CONFIG, getSiteConfig };
} else {
  // Browser environment
  window.SITE_CONFIG = SITE_CONFIG;
  window.getSiteConfig = getSiteConfig;
}