# Development Principles

## 1. File Replacement Strategy
Instead of doing an "in-file" replacement, just write a new copy of the file from scratch, keeping the full content except for the segment you need to replace, and write that in accordingly.

This approach:
- Reduces complexity and potential formatting issues
- Ensures cleaner, more predictable results
- Avoids problems with whitespace, newlines, and character encoding
- Makes debugging easier when edits fail
- Provides better version control and change tracking

## 2. Configuration-Driven Architecture
Use external configuration files to manage site-specific behavior rather than hardcoding rules in the main logic.

Benefits:
- Easy to add support for new websites without changing core code
- Clear separation of configuration from logic
- Makes the system more maintainable and extensible
- Allows for different behavior patterns (discussion vs article sites)

## 3. Reading Mode Content Strategy
Reading mode behavior should be context-aware:

### Discussion Platforms (preserve comments):
- Reddit, Twitter/X, Hacker News, Stack Overflow
- Comments and replies are valuable content
- Remove only ads, sidebars, and navigation

### Article Sites (clean reading):
- News sites, blogs, personal websites
- Focus on main article content only
- Remove comments, related articles, and all distractions

## 4. Debugging and Logging
Always include console.log statements for debugging complex functionality, especially content extraction and user interactions.

## 5. Progressive Enhancement
Start with simple, working solutions and add complexity only when needed. Prefer readable, maintainable code over clever optimizations.

## 6. Browser Extension Best Practices
- Handle edge cases gracefully (missing elements, different site structures)
- Avoid conflicts with existing page JavaScript
- Provide clear user feedback for actions
- Test across different website structures

## 7. Site-Specific Customization
When adding support for new websites:
1. Add configuration to `site-config.js`
2. Specify site type (discussion/article)
3. Define content selectors
4. Add custom extraction logic if needed
5. Test on actual site content

## 8. Fallback Strategies
Always provide multiple levels of fallback:
1. Site-specific custom extractors
2. Configured selectors
3. Generic content selectors
4. Body content as last resort