/**
 * SEO Overlay Scanner Script
 * 
 * This script is injected into the iframe to scan and highlight SEO elements.
 * It's a string that will be executed in the iframe context.
 */

export const OVERLAY_CSS = `
/* Base highlight styles */
.seo-highlight {
  position: relative !important;
}

/* Headings */
.seo-highlight-h1 {
  outline: 3px solid #3b82f6 !important;
  outline-offset: 3px;
}
.seo-highlight-h2,
.seo-highlight-h3,
.seo-highlight-h4,
.seo-highlight-h5,
.seo-highlight-h6 {
  outline: 2px solid #14b8a6 !important;
  outline-offset: 2px;
}

/* Duplicate H1 warning */
.seo-highlight-h1-duplicate {
  outline: 3px solid #ef4444 !important;
  outline-offset: 3px;
}

/* Images */
.seo-highlight-img-ok {
  outline: 2px solid #22c55e !important;
  outline-offset: 2px;
}
.seo-highlight-img-missing {
  outline: 3px solid #ef4444 !important;
  outline-offset: 2px;
}
.seo-highlight-img-lazy {
  box-shadow: inset 0 0 0 2px rgba(234, 179, 8, 0.5) !important;
}
.seo-highlight-img-broken {
  outline: 3px dashed #ef4444 !important;
  outline-offset: 2px;
}

/* Links */
.seo-highlight-link-internal {
  background: rgba(59, 130, 246, 0.15) !important;
  text-decoration: underline !important;
  text-decoration-color: #3b82f6 !important;
  text-underline-offset: 2px !important;
}
.seo-highlight-link-external {
  background: rgba(168, 85, 247, 0.15) !important;
  text-decoration: underline !important;
  text-decoration-color: #a855f7 !important;
  text-underline-offset: 2px !important;
}
.seo-highlight-link-external-nofollow {
  background: rgba(168, 85, 247, 0.25) !important;
  text-decoration: underline wavy !important;
  text-decoration-color: #a855f7 !important;
}
.seo-highlight-link-empty {
  outline: 2px dashed #f59e0b !important;
  outline-offset: 1px;
}

/* Schema */
.seo-highlight-schema {
  outline: 2px dashed #eab308 !important;
  outline-offset: 4px;
  background: rgba(234, 179, 8, 0.05) !important;
}

/* Meta indicators */
.seo-meta-indicator {
  position: fixed !important;
  top: 8px !important;
  right: 8px !important;
  z-index: 10001 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  pointer-events: none !important;
}

/* Accessibility */
.seo-highlight-a11y-issue {
  outline: 2px dotted #9333ea !important;
  outline-offset: 2px;
}

/* Badges */
.seo-badge {
  position: absolute !important;
  font-size: 9px !important;
  font-weight: 600 !important;
  padding: 2px 6px !important;
  border-radius: 3px !important;
  z-index: 10000 !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  line-height: 1.3 !important;
  pointer-events: auto !important;
  cursor: pointer !important;
  white-space: nowrap !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease !important;
}
.seo-badge:hover {
  transform: scale(1.05) !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
}

/* Badge positions */
.seo-badge-top {
  top: -22px !important;
  left: 0 !important;
}
.seo-badge-corner {
  top: 4px !important;
  left: 4px !important;
}
.seo-badge-inline {
  display: inline-block !important;
  position: relative !important;
  margin-left: 4px !important;
  vertical-align: middle !important;
}

/* Badge colors */
.seo-badge-h1 { background: #3b82f6 !important; color: white !important; }
.seo-badge-h1-duplicate { background: #ef4444 !important; color: white !important; }
.seo-badge-h2 { background: #14b8a6 !important; color: white !important; }
.seo-badge-h3 { background: #14b8a6 !important; color: white !important; }
.seo-badge-h4 { background: #0d9488 !important; color: white !important; }
.seo-badge-h5 { background: #0d9488 !important; color: white !important; }
.seo-badge-h6 { background: #0d9488 !important; color: white !important; }
.seo-badge-img-ok { background: #22c55e !important; color: white !important; }
.seo-badge-img-missing { background: #ef4444 !important; color: white !important; }
.seo-badge-img-lazy { background: #eab308 !important; color: #1a1a1a !important; }
.seo-badge-link-internal { background: #3b82f6 !important; color: white !important; }
.seo-badge-link-external { background: #a855f7 !important; color: white !important; }
.seo-badge-link-nofollow { background: #6b21a8 !important; color: white !important; }
.seo-badge-link-empty { background: #f59e0b !important; color: #1a1a1a !important; }
.seo-badge-schema { background: #eab308 !important; color: #1a1a1a !important; }
.seo-badge-meta-ok { background: #22c55e !important; color: white !important; }
.seo-badge-meta-warning { background: #f59e0b !important; color: #1a1a1a !important; }
.seo-badge-meta-error { background: #ef4444 !important; color: white !important; }
.seo-badge-a11y { background: #9333ea !important; color: white !important; }

/* Tooltips */
.seo-tooltip {
  position: absolute !important;
  z-index: 10002 !important;
  background: #1a1a1a !important;
  color: white !important;
  padding: 8px 12px !important;
  border-radius: 6px !important;
  font-size: 11px !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  line-height: 1.5 !important;
  max-width: 280px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
  pointer-events: none !important;
  opacity: 0 !important;
  transition: opacity 0.2s ease !important;
}
.seo-tooltip.visible {
  opacity: 1 !important;
}
.seo-tooltip-row {
  display: flex !important;
  justify-content: space-between !important;
  gap: 12px !important;
  margin-bottom: 4px !important;
}
.seo-tooltip-label {
  color: #9ca3af !important;
}
.seo-tooltip-value {
  font-weight: 500 !important;
  text-align: right !important;
  max-width: 180px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
.seo-tooltip-ok { color: #22c55e !important; }
.seo-tooltip-warning { color: #f59e0b !important; }
.seo-tooltip-error { color: #ef4444 !important; }
.seo-tooltip-divider {
  border-top: 1px solid #333 !important;
  margin: 6px 0 !important;
}

/* Heatmap overlays */
.seo-heatmap-overlay {
  position: absolute !important;
  pointer-events: none !important;
  opacity: 0.4 !important;
  mix-blend-mode: multiply !important;
}
.seo-heatmap-high { background: #22c55e !important; }
.seo-heatmap-medium { background: #eab308 !important; }
.seo-heatmap-low { background: #ef4444 !important; }

/* Word count indicators */
.seo-word-count-badge {
  position: absolute !important;
  top: 4px !important;
  right: 4px !important;
  background: rgba(0,0,0,0.7) !important;
  color: white !important;
  font-size: 9px !important;
  padding: 2px 6px !important;
  border-radius: 3px !important;
  font-family: system-ui, sans-serif !important;
}
`;

export const SCANNER_SCRIPT = `
(function() {
  // Generate unique IDs for elements
  let elementCounter = 0;
  const generateId = () => 'seo-el-' + (++elementCounter);
  
  // Store all highlighted elements
  let highlightedElements = [];
  let issues = [];
  let currentTooltip = null;
  
  // Helper: Get element position
  function getElementPosition(el) {
    const rect = el.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  }
  
  // Helper: Get domain from URL
  function getDomain(url) {
    try {
      return new URL(url, window.location.origin).hostname;
    } catch {
      return null;
    }
  }
  
  // Helper: Count words in text
  function countWords(text) {
    return text.trim().split(/\\s+/).filter(w => w.length > 0).length;
  }
  
  // Helper: Create badge element
  function createBadge(text, className, position = 'top') {
    const badge = document.createElement('span');
    badge.className = 'seo-badge seo-badge-' + className + ' seo-badge-' + position;
    badge.textContent = text;
    badge.dataset.seoElement = 'true';
    return badge;
  }
  
  // Helper: Show tooltip
  function showTooltip(el, content, event) {
    hideTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'seo-tooltip';
    tooltip.innerHTML = content;
    tooltip.dataset.seoElement = 'true';
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = el.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.top - tooltipRect.height - 8;
    let left = rect.left;
    
    // Flip if off screen
    if (top < 8) top = rect.bottom + 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    
    tooltip.style.top = (top + window.scrollY) + 'px';
    tooltip.style.left = left + 'px';
    
    requestAnimationFrame(() => tooltip.classList.add('visible'));
    currentTooltip = tooltip;
  }
  
  function hideTooltip() {
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }
  
  // Main scan function
  function scanPageForSEO(filters, focusKeyword) {
    // Clear previous
    clearOverlay();
    highlightedElements = [];
    issues = [];
    elementCounter = 0;
    
    const stats = {
      h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0,
      headingHierarchyValid: true,
      duplicateH1: false,
      imgOk: 0, imgMissing: 0, imgLazy: 0, imgBroken: 0,
      internal: 0, external: 0, externalNofollow: 0, emptyLinks: 0,
      hasTitle: false, titleLength: 0, titleContent: '',
      hasDescription: false, descriptionLength: 0, descriptionContent: '',
      hasCanonical: false, canonicalUrl: null,
      robotsDirective: null, isNoindex: false, isNofollow: false,
      schema: [], hasOpenGraph: false, hasTwitterCard: false,
      hreflangCount: 0, hasLangAttr: false, langAttr: null, hasViewport: false,
      missingFormLabels: 0, duplicateIds: 0, ariaLandmarks: [],
      wordCount: 0, paragraphCount: 0
    };
    
    const hostname = window.location.hostname;
    let lastHeadingLevel = 0;
    const h1Elements = [];
    
    // === HEADINGS ===
    if (filters.h1 || filters.h2h6) {
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
        const level = parseInt(tag.charAt(1));
        const shouldShow = (tag === 'h1' && filters.h1) || (tag !== 'h1' && filters.h2h6);
        
        document.querySelectorAll(tag).forEach(el => {
          if (!shouldShow) return;
          
          const id = generateId();
          el.dataset.seoId = id;
          el.classList.add('seo-highlight', 'seo-highlight-' + tag);
          
          // Check hierarchy
          if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
            stats.headingHierarchyValid = false;
            issues.push({
              id: 'issue-' + id,
              type: 'heading-skip',
              severity: 'medium',
              title: 'Heading Level Skip',
              description: 'Jumped from H' + lastHeadingLevel + ' to H' + level,
              elementId: id,
              fix: { tab: 'content', section: 'readability' }
            });
          }
          lastHeadingLevel = level;
          
          // Track H1s
          if (tag === 'h1') {
            h1Elements.push({ el, id });
          }
          
          // Create badge
          const badge = createBadge(tag.toUpperCase(), tag, 'top');
          badge.addEventListener('click', () => handleElementClick(id));
          el.style.position = 'relative';
          el.appendChild(badge);
          
          // Add hover tooltip
          el.addEventListener('mouseenter', (e) => {
            const text = el.textContent || '';
            const charCount = text.length;
            const hasKeyword = focusKeyword && text.toLowerCase().includes(focusKeyword.toLowerCase());
            
            showTooltip(el, \`
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">Type</span>
                <span class="seo-tooltip-value">\${tag.toUpperCase()} Heading</span>
              </div>
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">Length</span>
                <span class="seo-tooltip-value \${charCount > 70 ? 'seo-tooltip-warning' : 'seo-tooltip-ok'}">\${charCount} chars</span>
              </div>
              \${focusKeyword ? \`
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">Keyword</span>
                <span class="seo-tooltip-value \${hasKeyword ? 'seo-tooltip-ok' : 'seo-tooltip-warning'}">\${hasKeyword ? '✓ Present' : '✗ Missing'}</span>
              </div>\` : ''}
              <div class="seo-tooltip-divider"></div>
              <div style="color:#9ca3af;font-size:10px;">Click badge to navigate →</div>
            \`, e);
          });
          el.addEventListener('mouseleave', hideTooltip);
          
          highlightedElements.push({
            id,
            type: tag,
            text: el.textContent?.slice(0, 100) || '',
            tagName: tag.toUpperCase(),
            details: { charCount: el.textContent?.length || 0, level },
            position: getElementPosition(el)
          });
          
          stats[tag]++;
        });
      });
    }
    
    // Check for duplicate H1
    if (h1Elements.length > 1) {
      stats.duplicateH1 = true;
      h1Elements.forEach(({ el, id }, index) => {
        if (index > 0) {
          el.classList.add('seo-highlight-h1-duplicate');
          const badge = el.querySelector('.seo-badge');
          if (badge) {
            badge.classList.remove('seo-badge-h1');
            badge.classList.add('seo-badge-h1-duplicate');
            badge.textContent = 'H1 ⚠ Duplicate';
          }
        }
      });
      issues.push({
        id: 'issue-duplicate-h1',
        type: 'duplicate-h1',
        severity: 'high',
        title: 'Multiple H1 Tags',
        description: h1Elements.length + ' H1 tags found. Pages should have exactly one H1.',
        elementId: h1Elements[1]?.id,
        fix: { tab: 'content', section: 'readability' }
      });
    }
    
    // Check for missing H1
    if (stats.h1 === 0 && filters.h1) {
      issues.push({
        id: 'issue-missing-h1',
        type: 'missing-h1',
        severity: 'critical',
        title: 'Missing H1 Tag',
        description: 'No H1 tag found. Every page needs exactly one H1.',
        fix: { tab: 'content', section: 'readability' }
      });
    }
    
    // === IMAGES ===
    if (filters.images) {
      document.querySelectorAll('img').forEach(img => {
        const id = generateId();
        img.dataset.seoId = id;
        
        const wrapper = img.parentElement;
        if (wrapper) wrapper.style.position = 'relative';
        
        const isLazy = img.loading === 'lazy' || img.dataset.lazy;
        const isBroken = img.complete && img.naturalWidth === 0;
        const hasAlt = img.alt && img.alt.trim().length > 0;
        
        let badgeText = '';
        let badgeClass = '';
        let highlightClass = '';
        let issueType = null;
        let severity = null;
        
        if (isBroken) {
          highlightClass = 'seo-highlight-img-broken';
          badgeClass = 'img-missing';
          badgeText = '✗ Broken';
          stats.imgBroken++;
          issueType = 'broken-image';
          severity = 'high';
        } else if (!hasAlt) {
          highlightClass = 'seo-highlight-img-missing';
          badgeClass = 'img-missing';
          badgeText = '⚠ No Alt';
          stats.imgMissing++;
          issueType = 'missing-alt';
          severity = 'high';
        } else {
          highlightClass = 'seo-highlight-img-ok';
          badgeClass = 'img-ok';
          badgeText = '✓ Alt';
          stats.imgOk++;
        }
        
        if (isLazy) {
          stats.imgLazy++;
          badgeText += ' ⚡';
        }
        
        img.classList.add('seo-highlight', highlightClass);
        
        const badge = createBadge(badgeText, badgeClass, 'corner');
        badge.addEventListener('click', () => handleElementClick(id));
        if (wrapper && wrapper !== document.body) {
          wrapper.appendChild(badge);
        }
        
        // Tooltip
        img.addEventListener('mouseenter', (e) => {
          const src = img.src || img.dataset.src || '';
          const filename = src.split('/').pop()?.split('?')[0] || 'Unknown';
          
          showTooltip(img, \`
            <div class="seo-tooltip-row">
              <span class="seo-tooltip-label">File</span>
              <span class="seo-tooltip-value">\${filename}</span>
            </div>
            <div class="seo-tooltip-row">
              <span class="seo-tooltip-label">Dimensions</span>
              <span class="seo-tooltip-value">\${img.naturalWidth || '?'}×\${img.naturalHeight || '?'}</span>
            </div>
            <div class="seo-tooltip-row">
              <span class="seo-tooltip-label">Alt Text</span>
              <span class="seo-tooltip-value \${hasAlt ? 'seo-tooltip-ok' : 'seo-tooltip-error'}">\${hasAlt ? (img.alt.slice(0, 30) + (img.alt.length > 30 ? '...' : '')) : '✗ Missing'}</span>
            </div>
            <div class="seo-tooltip-row">
              <span class="seo-tooltip-label">Lazy Load</span>
              <span class="seo-tooltip-value \${isLazy ? 'seo-tooltip-ok' : ''}">\${isLazy ? '✓ Yes' : 'No'}</span>
            </div>
            \${issueType ? '<div class="seo-tooltip-divider"></div><div style="color:#ef4444;font-size:10px;">⚠ Click to fix in SEO Tools</div>' : ''}
          \`, e);
        });
        img.addEventListener('mouseleave', hideTooltip);
        
        if (issueType) {
          issues.push({
            id: 'issue-' + id,
            type: issueType,
            severity: severity,
            title: issueType === 'missing-alt' ? 'Missing Alt Text' : 'Broken Image',
            description: 'Image: ' + (img.src?.split('/').pop()?.slice(0, 40) || 'unknown'),
            elementId: id,
            fix: { tab: 'content', section: 'images' }
          });
        }
        
        highlightedElements.push({
          id,
          type: hasAlt ? 'img-ok' : 'img-missing',
          text: img.alt || img.src?.split('/').pop() || '',
          tagName: 'IMG',
          details: {
            alt: img.alt,
            src: img.src,
            width: img.naturalWidth,
            height: img.naturalHeight,
            isLazy
          },
          issue: issueType,
          severity,
          position: getElementPosition(img)
        });
      });
    }
    
    // === LINKS ===
    if (filters.linksInternal || filters.linksExternal) {
      document.querySelectorAll('a[href]').forEach(a => {
        const id = generateId();
        a.dataset.seoId = id;
        
        const href = a.getAttribute('href') || '';
        const text = a.textContent?.trim() || '';
        const rel = a.getAttribute('rel') || '';
        const target = a.getAttribute('target') || '';
        const isNofollow = rel.includes('nofollow');
        const isEmpty = !text && !a.querySelector('img') && !a.getAttribute('aria-label');
        
        const isInternal = href.startsWith('/') || href.startsWith('#') || href.includes(hostname);
        const isExternal = href.startsWith('http') && !href.includes(hostname);
        
        let highlightClass = '';
        let badgeClass = '';
        let badgeText = '';
        let issueType = null;
        
        if (isEmpty) {
          highlightClass = 'seo-highlight-link-empty';
          badgeClass = 'link-empty';
          badgeText = '⚠ Empty';
          stats.emptyLinks++;
          issueType = 'empty-link';
          issues.push({
            id: 'issue-' + id,
            type: 'empty-link',
            severity: 'medium',
            title: 'Empty Link',
            description: 'Link has no accessible text',
            elementId: id,
            fix: { tab: 'content', section: 'links' }
          });
        } else if (isInternal && filters.linksInternal) {
          highlightClass = 'seo-highlight-link-internal';
          badgeClass = 'link-internal';
          badgeText = '🔗';
          stats.internal++;
        } else if (isExternal && filters.linksExternal) {
          highlightClass = isNofollow ? 'seo-highlight-link-external-nofollow' : 'seo-highlight-link-external';
          badgeClass = isNofollow ? 'link-nofollow' : 'link-external';
          badgeText = isNofollow ? '🌐 nofollow' : '🌐';
          stats.external++;
          if (isNofollow) stats.externalNofollow++;
        }
        
        if (highlightClass) {
          a.classList.add('seo-highlight', highlightClass);
          
          // Tooltip
          a.addEventListener('mouseenter', (e) => {
            const domain = getDomain(href);
            showTooltip(a, \`
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">Type</span>
                <span class="seo-tooltip-value">\${isInternal ? 'Internal' : 'External'} Link</span>
              </div>
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">URL</span>
                <span class="seo-tooltip-value">\${href.slice(0, 35)}\${href.length > 35 ? '...' : ''}</span>
              </div>
              \${isExternal ? \`
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">Domain</span>
                <span class="seo-tooltip-value">\${domain}</span>
              </div>\` : ''}
              <div class="seo-tooltip-row">
                <span class="seo-tooltip-label">Anchor</span>
                <span class="seo-tooltip-value">\${text.slice(0, 30) || '(empty)'}</span>
              </div>
              \${isNofollow ? '<div class="seo-tooltip-row"><span class="seo-tooltip-label">Rel</span><span class="seo-tooltip-value seo-tooltip-warning">nofollow</span></div>' : ''}
              \${target === '_blank' ? '<div class="seo-tooltip-row"><span class="seo-tooltip-label">Target</span><span class="seo-tooltip-value">New tab</span></div>' : ''}
            \`, e);
          });
          a.addEventListener('mouseleave', hideTooltip);
          
          highlightedElements.push({
            id,
            type: isInternal ? 'link-internal' : 'link-external',
            text: text || href,
            tagName: 'A',
            details: { href, rel, target, isNofollow, domain: getDomain(href) },
            issue: issueType,
            position: getElementPosition(a)
          });
        }
      });
    }
    
    // === META TAGS ===
    if (filters.meta) {
      // Title
      const title = document.querySelector('title');
      stats.hasTitle = !!title;
      stats.titleContent = title?.textContent || '';
      stats.titleLength = stats.titleContent.length;
      
      if (!stats.hasTitle) {
        issues.push({
          id: 'issue-missing-title',
          type: 'missing-title',
          severity: 'critical',
          title: 'Missing Title Tag',
          description: 'Page has no <title> tag',
          fix: { tab: 'meta' }
        });
      } else if (stats.titleLength < 30) {
        issues.push({
          id: 'issue-title-short',
          type: 'title-too-short',
          severity: 'medium',
          title: 'Title Too Short',
          description: stats.titleLength + ' chars (recommended: 50-60)',
          fix: { tab: 'meta' }
        });
      } else if (stats.titleLength > 60) {
        issues.push({
          id: 'issue-title-long',
          type: 'title-too-long',
          severity: 'low',
          title: 'Title May Truncate',
          description: stats.titleLength + ' chars (recommended: 50-60)',
          fix: { tab: 'meta' }
        });
      }
      
      // Description
      const metaDesc = document.querySelector('meta[name="description"]');
      stats.hasDescription = !!metaDesc;
      stats.descriptionContent = metaDesc?.getAttribute('content') || '';
      stats.descriptionLength = stats.descriptionContent.length;
      
      if (!stats.hasDescription) {
        issues.push({
          id: 'issue-missing-desc',
          type: 'missing-description',
          severity: 'high',
          title: 'Missing Meta Description',
          description: 'No meta description found',
          fix: { tab: 'meta' }
        });
      } else if (stats.descriptionLength < 120) {
        issues.push({
          id: 'issue-desc-short',
          type: 'description-too-short',
          severity: 'low',
          title: 'Description Too Short',
          description: stats.descriptionLength + ' chars (recommended: 150-160)',
          fix: { tab: 'meta' }
        });
      }
      
      // Canonical
      const canonical = document.querySelector('link[rel="canonical"]');
      stats.hasCanonical = !!canonical;
      stats.canonicalUrl = canonical?.getAttribute('href') || null;
      
      // Robots
      const robotsMeta = document.querySelector('meta[name="robots"]');
      stats.robotsDirective = robotsMeta?.getAttribute('content') || null;
      stats.isNoindex = stats.robotsDirective?.includes('noindex') || false;
      stats.isNofollow = stats.robotsDirective?.includes('nofollow') || false;
      
      if (stats.isNoindex) {
        issues.push({
          id: 'issue-noindex',
          type: 'noindex',
          severity: 'critical',
          title: 'Page Set to Noindex',
          description: 'This page will not be indexed by search engines',
          fix: { tab: 'technical' }
        });
      }
      
      // OpenGraph
      stats.hasOpenGraph = !!document.querySelector('meta[property^="og:"]');
      if (!stats.hasOpenGraph) {
        issues.push({
          id: 'issue-missing-og',
          type: 'missing-og',
          severity: 'low',
          title: 'Missing OpenGraph Tags',
          description: 'Add og: tags for better social sharing',
          fix: { tab: 'meta', section: 'social' }
        });
      }
      
      // Twitter
      stats.hasTwitterCard = !!document.querySelector('meta[name^="twitter:"]');
      
      // Hreflang
      stats.hreflangCount = document.querySelectorAll('link[rel="alternate"][hreflang]').length;
      
      // Viewport
      stats.hasViewport = !!document.querySelector('meta[name="viewport"]');
      
      // Lang
      const html = document.documentElement;
      stats.hasLangAttr = !!html.getAttribute('lang');
      stats.langAttr = html.getAttribute('lang');
      
      if (!stats.hasLangAttr) {
        issues.push({
          id: 'issue-missing-lang',
          type: 'missing-lang',
          severity: 'medium',
          title: 'Missing Lang Attribute',
          description: 'Add lang attribute to <html> tag',
          fix: { tab: 'technical' }
        });
      }
    }
    
    // === SCHEMA ===
    if (filters.schema) {
      document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          const schemaType = data['@type'] || (Array.isArray(data['@graph']) ? 'Graph' : 'Unknown');
          stats.schema.push(schemaType);
          
          const id = generateId();
          highlightedElements.push({
            id,
            type: 'schema',
            text: schemaType,
            tagName: 'SCHEMA',
            details: { schemaType, content: script.textContent?.slice(0, 200) },
            position: { top: 0, left: 0, width: 0, height: 0 }
          });
        } catch (e) {
          // Invalid JSON
        }
      });
    }
    
    // === ACCESSIBILITY ===
    if (filters.accessibility) {
      // Missing form labels
      document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select').forEach(input => {
        const hasLabel = input.id && document.querySelector('label[for="' + input.id + '"]');
        const hasAriaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
        
        if (!hasLabel && !hasAriaLabel) {
          stats.missingFormLabels++;
          const id = generateId();
          input.dataset.seoId = id;
          input.classList.add('seo-highlight', 'seo-highlight-a11y-issue');
          
          issues.push({
            id: 'issue-' + id,
            type: 'missing-label',
            severity: 'medium',
            title: 'Missing Form Label',
            description: 'Input field has no associated label',
            elementId: id
          });
        }
      });
      
      // Duplicate IDs
      const ids = {};
      document.querySelectorAll('[id]').forEach(el => {
        const elId = el.id;
        if (ids[elId]) {
          stats.duplicateIds++;
        }
        ids[elId] = true;
      });
      
      // ARIA landmarks
      ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section'].forEach(role => {
        if (document.querySelector(role) || document.querySelector('[role="' + role + '"]')) {
          stats.ariaLandmarks.push(role);
        }
      });
    }
    
    // === CONTENT STATS ===
    const bodyText = document.body.innerText || '';
    stats.wordCount = countWords(bodyText);
    stats.paragraphCount = document.querySelectorAll('p').length;
    
    // Sort issues by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    // Post results to parent
    window.parent.postMessage({ 
      type: 'seo-overlay-stats', 
      stats, 
      elements: highlightedElements,
      issues
    }, '*');
  }
  
  function clearOverlay() {
    // Remove all SEO elements
    document.querySelectorAll('[data-seo-element="true"]').forEach(el => el.remove());
    document.querySelectorAll('.seo-badge').forEach(el => el.remove());
    document.querySelectorAll('[class*="seo-highlight"]').forEach(el => {
      el.className = el.className.replace(/seo-highlight[\\w-]*/g, '').trim();
    });
    document.querySelectorAll('[data-seo-id]').forEach(el => {
      delete el.dataset.seoId;
    });
    hideTooltip();
  }
  
  function handleElementClick(elementId) {
    const el = document.querySelector('[data-seo-id="' + elementId + '"]');
    if (el) {
      const element = highlightedElements.find(e => e.id === elementId);
      if (element) {
        window.parent.postMessage({ 
          type: 'seo-overlay-element-click', 
          element 
        }, '*');
      }
    }
  }
  
  function scrollToElement(elementId) {
    const el = document.querySelector('[data-seo-id="' + elementId + '"]');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Flash effect
      el.style.transition = 'box-shadow 0.3s ease';
      el.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      setTimeout(() => {
        el.style.boxShadow = '';
        window.parent.postMessage({ type: 'seo-overlay-scroll-complete' }, '*');
      }, 1000);
    }
  }
  
  // Listen for commands from parent
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'seo-overlay-enable') {
      scanPageForSEO(event.data.filters || {
        h1: true, h2h6: true, images: true, 
        linksInternal: true, linksExternal: true,
        schema: true, meta: true, accessibility: true,
        issuesOnly: false, keywordFocused: false
      }, event.data.focusKeyword);
    } else if (event.data?.type === 'seo-overlay-disable') {
      clearOverlay();
    } else if (event.data?.type === 'seo-overlay-update-filters') {
      scanPageForSEO(event.data.filters, event.data.focusKeyword);
    } else if (event.data?.type === 'seo-overlay-scroll-to') {
      scrollToElement(event.data.elementId);
    }
  });
  
  // Gap F3: MutationObserver for dynamic content detection
  let rescanTimeout = null;
  const dynamicObserver = new MutationObserver((mutations) => {
    // Debounce rescans
    if (rescanTimeout) clearTimeout(rescanTimeout);
    rescanTimeout = setTimeout(() => {
      // Only rescan if mutations affect significant SEO elements
      const hasRelevantChanges = mutations.some(m => 
        m.type === 'childList' && 
        m.addedNodes.length > 0 &&
        Array.from(m.addedNodes).some(n => 
          n.nodeType === 1 && 
          (n.matches && n.matches('h1,h2,h3,h4,h5,h6,img,a,[itemtype],script[type="application/ld+json"]') || 
           n.querySelector && n.querySelector('h1,h2,h3,h4,h5,h6,img,a,[itemtype],script[type="application/ld+json"]'))
        )
      );
      if (hasRelevantChanges) {
        window.postMessage({ 
          type: 'SEO_SCANNER_RESCAN_NEEDED' 
        }, '*');
      }
    }, 500);
  });

  // Start observing once DOM is ready
  if (document.body) {
    dynamicObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      dynamicObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    });
  }
  
  // Expose globally
  window.scanPageForSEO = scanPageForSEO;
  window.clearSEOOverlay = clearOverlay;
  window.scrollToSEOElement = scrollToElement;
})();
`;
