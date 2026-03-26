// Documentation Content Registry & Search Index
// Comprehensive documentation for the Page Builder system

// Import additional articles from separate files
import {
  adminPortalOverview,
  managingPagesGuide,
  userRoleManagementGuide,
  currencyLocalizationGuide,
  announcementsBannersGuide,
  systemSettingsGuide,
  activityLogsGuide,
  workingWithImagesGuide,
} from './user-guide-articles';

import {
  authenticationGuide,
  userPresenceGuide,
  adminComponentsGuide,
  completeHooksGuide,
  edgeFunctionsDeepDiveGuide,
} from './developer-guide-articles';

import {
  infrastructureOverviewGuide,
  cicdPipelineGuide,
  environmentSyncGuide,
  databaseMigrationsGuide,
  edgeFunctionsDeploymentGuide,
  secretsManagementGuide,
  troubleshootingDeploymentsGuide,
} from './devops-guide-articles';

export interface DocArticle {
  title: string;
  description: string;
  category: 'user' | 'developer' | 'devops';
  slug: string;
  order: number;
  tags: string[];
  content: string;
  lastUpdated: string;
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  icon: 'user' | 'code' | 'server';
  articles: DocArticle[];
}

// ============================================================================
// USER GUIDE ARTICLES
// ============================================================================

const gettingStarted: DocArticle = {
  title: 'Getting Started',
  description: 'Learn the basics of the page builder and create your first page in under 5 minutes',
  category: 'user',
  slug: 'getting-started',
  order: 1,
  tags: ['basics', 'introduction', 'quick start', 'tutorial', 'first page'],
  lastUpdated: '2025-01-15',
  content: `
# Getting Started

Welcome to the Page Builder — the intuitive, no-code tool that lets you create stunning, professional web pages in minutes. Whether you're a marketer launching a campaign, a business owner updating your site, or a content editor managing page updates, this guide will have you publishing beautiful pages in no time.

---

## Who Is This For?

The page builder is designed for:

- **Marketers** who need to launch landing pages quickly
- **Business owners** who want control over their website content
- **Content editors** who need to make frequent page updates
- **Developers** who want to extend functionality with custom sections
- **Anyone** who wants to build pages without writing code

No technical experience required. If you can use a word processor, you can use this page builder.

---

## 5-Minute Quick Start

Let's create your first page. Follow these steps and you'll have a published page in under 5 minutes.

### Step 1: Navigate to Manage Pages

From the admin dashboard, click **"Manage Pages"** in the left sidebar. This is your command center for all pages on your site.

### Step 2: Create a New Page

Click the **"Create Page"** button in the top right corner. Give your page a name (like "Summer Sale Landing Page") and a URL slug (like "summer-sale").

### Step 3: Add Your First Section

Once the editor opens, you'll see an empty canvas. Click the **"+ Add Section"** button or press the \`B\` key to open the Block Library. Choose **"Hero"** to add a stunning header section.

### Step 4: Customize Your Content

Click directly on any text in the canvas to edit it. The text becomes editable immediately — just type your new content. Click on images to replace them, and use the settings panel on the right to adjust colors and styling.

### Step 5: Publish Your Page

When you're happy with your page, click the **"Publish"** button in the toolbar. Your page is now live and accessible to visitors!

> 💡 **Pro Tip:** Changes are saved automatically as you work. You'll see a "Saved" indicator in the toolbar. No need to worry about losing your work!

---

## Interface Overview

The page builder interface is divided into three main areas:

![Full page editor interface showing the sections list on the left, canvas in the center, and settings panel on the right](/docs/screenshots/editor-full-interface.png)

*The page editor interface with three main areas: Sections list (left), Canvas (center), and Settings panel (right)*

### Left Sidebar — Navigation & Blocks

This panel contains two tabs:

- **Sections Tab** — Shows all sections currently on your page in a sortable list. Drag sections here to reorder them.
- **Blocks Tab** — The library of all 27 available section types you can add, organized by category.

### Canvas — Your Page Preview

The center area shows your page exactly as it will appear to visitors. This is where you:

- Click to select sections
- Edit text inline by clicking directly on it
- Drag sections to reorder them
- Preview your design in real-time across desktop, tablet, and mobile views

![Hero section selected on canvas with toolbar and drag handle visible](/docs/screenshots/section-canvas-selected.png)

*When you select a section, it shows a green border, floating toolbar, and drag handle*

### Right Panel — Settings & Styling

When you select a section, this panel shows:

- **Content Tab** — Edit all text, images, buttons, and content arrays
- **Style Tab** — Adjust backgrounds, colors, spacing, borders, and shadows
- **Translation Tab** — Link content to translation keys for multi-language support

![Settings panel showing 'No section selected' message](/docs/screenshots/settings-panel-empty.png)

*Before selecting a section, the settings panel shows instructions to click on a section*

---

## Key Terminology

Understanding these terms will help you navigate the page builder:

| Term | Definition |
|------|------------|
| **Section** | A building block of your page (Hero, Features, Pricing, etc.) |
| **Canvas** | The central editing area where you see and edit your page |
| **Block Library** | The collection of all 27 available section types |
| **Settings Panel** | The right sidebar for editing section properties |
| **Props** | The configurable properties of a section (title, subtitle, items, etc.) |
| **Translation Key** | A reference that links content to multiple languages |
| **Autosave** | Automatic saving of changes every few seconds |
| **Grid System** | The underlying layout structure (Section → Column → Widget) |

---

## Tips for Success

Here are some best practices to help you create great pages:

- **Start with your goal** — What action do you want visitors to take?
- **Keep it focused** — Fewer sections often means more impact
- **Use consistent styling** — Stick to your brand colors and fonts
- **Preview on mobile** — Always check how your page looks on phones using the device toggle
- **Use keyboard shortcuts** — Speed up your workflow significantly

> ⚠️ **Warning:** Be careful when deleting sections. While you can undo changes during your session with \`Ctrl + Z\`, deleted sections cannot be recovered after you leave the editor.

---

## Complete Keyboard Shortcuts Reference

Master these shortcuts to work faster:

### Editing Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl + S\` / \`⌘S\` | Save page manually |
| \`Ctrl + Z\` / \`⌘Z\` | Undo last action |
| \`Ctrl + Shift + Z\` / \`⌘⇧Z\` | Redo |
| \`Ctrl + Y\` / \`⌘Y\` | Redo (alternative) |
| \`Ctrl + D\` / \`⌘D\` | Duplicate selected component |
| \`Delete\` / \`Backspace\` | Delete selected component |

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Escape\` | Deselect / Close panel |
| \`B\` | Open Block Library |

### View Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Ctrl + P\` / \`⌘P\` | Open preview |
| \`Ctrl + /\` / \`⌘/\` | Toggle code viewer |
| \`?\` | Show keyboard shortcuts dialog |

---

## Troubleshooting First Steps

### "The editor won't load"

1. Refresh the page
2. Clear your browser cache
3. Try a different browser (Chrome recommended)
4. Check your internet connection

### "My changes aren't saving"

1. Look for the save indicator in the toolbar
2. Check your internet connection
3. Try pressing \`Ctrl + S\` to force a manual save
4. If it shows an error, refresh and try again

### "I accidentally deleted something"

1. Immediately press \`Ctrl + Z\` to undo
2. You can undo multiple times to go back further
3. Check Version History for previous saves

---

## What's Next?

Now that you know the basics, dive deeper into specific topics:

- **[Working with Sections](/admin/documentation/user/sections)** — Master all 27 section types and their properties
- **[Styling Your Pages](/admin/documentation/user/styling)** — Learn to customize colors, spacing, and backgrounds
- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Understand SEO settings and going live

Ready to build something amazing? Let's go!
  `
};

const sectionsGuide: DocArticle = {
  title: 'Working with Sections',
  description: 'Master adding, editing, and organizing all 27 section types on your pages',
  category: 'user',
  slug: 'sections',
  order: 2,
  tags: ['sections', 'blocks', 'editing', 'drag and drop', 'reorder'],
  lastUpdated: '2025-01-15',
  content: `
# Working with Sections

Sections are the building blocks of your pages. Each section serves a specific purpose — from grabbing attention with a Hero, to displaying pricing plans, to collecting leads with a contact form. The page builder includes **27 professionally designed section types**. Master sections and you can build any page you can imagine.

---

## What You'll Learn

In this comprehensive guide, you'll learn:

- All methods to add new sections
- Complete reference for all 27 section types with their properties
- How to edit section content and settings
- How to reorder, duplicate, and delete sections
- How to work with array items (features, testimonials, FAQs, etc.)

---

## Adding Sections

There are three ways to add new sections to your page:

### Method 1: The Add Button

1. Look for the **"+ Add Section"** button at the bottom of any section or on an empty page
2. Click it to open the Block Library
3. Browse by category or search for the section type you want
4. Click to add it to your page

### Method 2: Keyboard Shortcut (Fastest)

1. Press the \`B\` key anywhere in the editor
2. The Block Library opens immediately
3. Type to search (e.g., "hero" or "pricing")
4. Press \`Enter\` or click to add

> 💡 **Pro Tip:** The \`B\` shortcut is the fastest way to add sections. With practice, you can add a new section in under 2 seconds!

### Method 3: Click Between Sections

1. Hover between any two existing sections
2. A blue "+" indicator appears
3. Click it to open the Block Library
4. The new section inserts exactly where you clicked

---

## Complete Section Types Reference

The page builder includes **27 professionally designed section types**, organized into categories:

### 🎯 Headers & Layout

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **Hero** | \`badge\`, \`title\`, \`highlightedText\`, \`subtitle\`, \`primaryButtonText\`, \`services[]\` | Page headers, main value propositions, call-to-action |
| **Announcement Banner** | \`text\`, \`link\`, \`dismissible\`, \`backgroundColor\` | Promotions, alerts, important news |
| **Bento Grid** | \`badge\`, \`title\`, \`subtitle\`, \`items[{title, description, size, icon}]\` | Modern asymmetric feature showcase |

### ⭐ Features & Content

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **Features** | \`badge\`, \`title\`, \`subtitle\`, \`buttonText\`, \`features[{icon, title, description, highlights[]}]\` | Product/service features with highlights |
| **Icon Features** | \`badge\`, \`title\`, \`subtitle\`, \`columns\`, \`features[{icon, title, description}]\` | Visual feature highlights in grid |
| **Alternating Features** | \`badge\`, \`title\`, \`blocks[{title, description, image, imagePosition, bullets[], buttonText}]\` | Detailed feature explanation with images |
| **Why Choose** | \`badge\`, \`title\`, \`subtitle\`, \`reasons[{icon, title, description}]\` | Competitive advantages, USPs |
| **Steps** | \`badge\`, \`title\`, \`subtitle\`, \`layout\`, \`steps[{number, title, description, icon}]\` | Process explanations, how-it-works |

### 💬 Social Proof

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **Testimonials** | \`badge\`, \`title\`, \`subtitle\`, \`testimonials[{name, role, avatar, rating, text}]\` | Customer reviews, quotes |
| **Logo Carousel** | \`logos[{name, image}]\`, \`speed\`, \`grayscale\` | Client/partner logos |
| **Trusted By** | \`badge\`, \`title\`, \`companies[{name, logo}]\` | Trust indicators, "As seen in" |
| **Stats Counter** | \`badge\`, \`title\`, \`subtitle\`, \`stats[{value, label, suffix, icon}]\` | Impressive numbers, metrics |
| **Awards** | \`badge\`, \`title\`, \`awards[{title, organization, year, icon}]\` | Recognition, certifications |

### 💰 Pricing & Commerce

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **Pricing** | \`title\`, \`subtitle\`, \`planCount\`, \`useCarousel\`, \`plans[{name, description, price, originalPrice, discount, period, buttonText, isHighlighted, features[]}]\` | Pricing tables with feature lists |
| **Plans Comparison** | \`title\`, \`subtitle\`, \`plans[]\`, \`features[]\` | Detailed plan comparison matrix |
| **Server Specs** | \`title\`, \`subtitle\`, \`specs[{name, value}]\` | Technical specifications |
| **Hosting Services** | \`badge\`, \`title\`, \`subtitle\`, \`services[{name, icon, description, price, features[]}]\` | Service packages, tiered offerings |

### 🎯 Engagement & Conversion

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **CTA** | \`badge\`, \`title\`, \`subtitle\`, \`benefits[{text}]\`, \`primaryButtonText\`, \`primaryButtonUrl\`, \`secondaryButtonText\` | Call-to-action blocks, conversion |
| **Contact** | \`badge\`, \`title\`, \`subtitle\`, \`channels[{icon, type, title, description, value, buttonText}]\` | Contact information, support options |
| **FAQ** | \`badge\`, \`title\`, \`subtitle\`, \`faqs[{question, answer}]\` | Frequently asked questions |
| **Need Help** | \`badge\`, \`title\`, \`subtitle\`, \`options[{title, description, icon, action}]\` | Support options, help resources |

### 📰 Information & Media

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **Blog Grid** | \`badge\`, \`title\`, \`posts[{title, excerpt, image, date, category, author}]\` | Article listings, news |
| **Video** | \`title\`, \`subtitle\`, \`videoUrl\`, \`thumbnail\` | Video content, demos |
| **Team Members** | \`badge\`, \`title\`, \`members[{name, role, image, bio, social[]}]\` | Staff profiles |
| **Careers** | \`badge\`, \`title\`, \`subtitle\`, \`jobs[{title, department, location, type, applyUrl}]\` | Job listings |
| **Data Center** | \`badge\`, \`title\`, \`locations[{name, flag, specs[]}]\` | Location information |

### 🖥️ Technical

| Section Type | Key Properties | Best For |
|--------------|----------------|----------|
| **OS Selector** | \`title\`, \`options[{os, icon, downloadUrl}]\` | Software downloads by OS |

---

## Section Types Gallery

See what each section type looks like when rendered. Screenshots are organized by category:

### Content Sections

#### Features Section
![Features section with 6 feature cards in a 3x2 grid layout](/docs/screenshots/sections/features-section.png)
*Features section displays capabilities in a clean grid with icons and descriptions*

#### Icon Features Section
![Icon Features section with 5 feature cards arranged in a grid](/docs/screenshots/sections/icon-features-section.png)
*Icon Features display key capabilities in a clean grid layout with icons*

#### Alternating Features / Why Choose Section
![Alternating Features section with two-column layout and bullet points](/docs/screenshots/sections/alternating-features-section.png)
*Alternating Features present key benefits in a visually balanced layout*

![Why Choose section with text, bullet points, and image in two-column layout](/docs/screenshots/sections/why-choose-section.png)
*Why Choose sections highlight competitive advantages with supporting imagery*

#### Steps Section
![Steps section with 3-step horizontal timeline connected by lines](/docs/screenshots/sections/steps-section.png)
*The Steps section guides users through a process with numbered steps and connecting lines*

#### Stats Counter Section
![Stats Counter section showing 4 animated statistics with icons](/docs/screenshots/sections/stats-counter-section.png)
*Stats Counter displays key metrics with animated numbers, icons, and labels*

#### FAQ Section
![FAQ section with expandable accordion-style questions](/docs/screenshots/sections/faq-section.png)
*FAQ sections use an accordion pattern to keep content organized and scannable*

#### Blog Grid Section
![Blog Grid section with 3 article cards including images and metadata](/docs/screenshots/sections/blog-grid-section.png)
*Blog Grid displays articles with featured images, categories, and read times*

#### Video Section
![Video section with embedded video player and play button overlay](/docs/screenshots/sections/video-section.png)
*Video section embeds media content with a clean player interface*

### Commerce Sections

#### Pricing Section
![Pricing section showing three-tier pricing cards with features and CTA buttons](/docs/screenshots/sections/pricing-section.png)
*The Pricing section displays plan options with prices, features, and call-to-action buttons*

#### Plans Comparison Section
![Plans Comparison table showing feature matrix across 4 plans](/docs/screenshots/sections/plans-comparison-section.png)
*Plans Comparison provides a detailed feature matrix for comparing options*

#### Hosting Services Section
![Hosting Services section with 6 service cards showing icons and pricing](/docs/screenshots/sections/hosting-services-section.png)
*Hosting Services showcase different service offerings with descriptions and starting prices*

#### Server Specs Section
![Server Specs table showing VPS tiers with CPU, RAM, and storage details](/docs/screenshots/sections/server-specs-section.png)
*Server Specs display technical specifications in a clear table format*

### Trust & Social Proof Sections

#### Testimonials Section
![Testimonials section with 3 customer reviews including ratings and photos](/docs/screenshots/sections/testimonials-section.png)
*Testimonials build trust by showcasing customer feedback with star ratings*

#### Trusted By Section
![Trusted By section showing review platform ratings and company logos](/docs/screenshots/sections/trusted-by-section.png)
*Trusted By sections display social proof through review scores and partner logos*

#### Awards Section
![Awards section with 4 recognition cards showing trophy icons and years](/docs/screenshots/sections/awards-section.png)
*Awards section showcases recognition and achievements with dates*

#### Data Center Section
![Data Center section showing global locations with region badges](/docs/screenshots/sections/data-center-section.png)
*Data Center section displays server locations with region tags and performance stats*

### Engagement Sections

#### CTA Section
![CTA section with dark background, headline, benefits, and action buttons](/docs/screenshots/sections/cta-section.png)
*CTA sections drive conversions with compelling headlines and clear action buttons*

#### Contact Section
![Contact section with 4 contact method cards showing icons and details](/docs/screenshots/sections/contact-section.png)
*Contact section provides multiple ways to reach out with action buttons*

#### Need Help Section
![Need Help section with 4 support cards showing Live Chat, Phone, Email, and Knowledge Base options](/docs/screenshots/sections/need-help-section.png)
*The Need Help section displays support contact options with availability info and action buttons*

---

## Editing Sections

Once a section is on your page, you can customize every aspect of it.

### Selecting a Section

Click anywhere on a section in the canvas to select it. You'll see:

- A green border around the selected section
- A toolbar with section actions (duplicate, delete, move, settings)
- The Settings Panel on the right updates to show that section's options

![Hero section selected on canvas with toolbar visible](/docs/screenshots/section-canvas-selected.png)

*A selected section shows a green border and floating toolbar with quick actions*

### The Three Settings Tabs

Every section has tabs in the Settings Panel:

**Content Tab**

This is where you edit all the actual content:

- Headlines and body text
- Button labels and URLs
- Images and icons
- List items and arrays (features, testimonials, FAQs, etc.)

![Section settings showing Content tab with editable fields](/docs/screenshots/section-selected-content.png)

*The Content tab shows all editable fields for the selected section*

![Content tab fields showing Badge Text, Main Title, and other properties](/docs/screenshots/content-tab-fields.png)

*Each field has a link icon for translation key binding*

**Style Tab**

Control the visual appearance:

- Background (solid color, gradient, or image with overlay)
- Text colors for headings and body
- Padding and spacing (responsive for different devices)
- Border and shadow effects
- Container width and visibility settings

![Style tab showing Grid Layout, Background, and Spacing options](/docs/screenshots/style-tab-layout.png)

*The Style tab provides controls for layout, background, and spacing*

**Translation Tab** (if enabled)

Link content to translation keys for multi-language support.

![Translations panel showing Arabic translations with bound keys](/docs/screenshots/translations-panel-arabic.png)

*The Translations panel shows translation status and individual entries with AI translate buttons*

### Inline Text Editing

For quick text edits, you don't need the Settings Panel:

1. Click directly on any text in the canvas
2. The text becomes editable immediately
3. Type your new content
4. Click outside to save

> 💡 **Pro Tip:** Inline editing is perfect for quick typo fixes. For more control over formatting and translation keys, use the Content tab in the Settings Panel.

---

## Working with Array Items

Many sections contain arrays of items (features, testimonials, FAQ questions, pricing plans). Here's how to manage them:

### The Item List Editor

When a section has array items, you'll see the Item List Editor in the Content tab. It provides:

- **Add Item** — Click the "+ Add" button to create a new item
- **Reorder Items** — Drag and drop using the grip handle, or use the arrow buttons
- **Duplicate Items** — Click the copy icon to duplicate an item
- **Delete Items** — Click the trash icon to remove an item
- **Expand/Collapse** — Click on an item header to expand or collapse its settings

### Adding Items

1. Find the item list in the Content tab
2. Click **"+ Add Item"** at the bottom
3. Fill in the new item's details
4. The item is added and expanded for editing

### Reordering Items

Two methods:

1. **Drag and Drop:** Hover over an item, grab the grip handle (⋮⋮), and drag to reorder
2. **Arrow Buttons:** Click the up/down arrows on each item

### Editing Items

1. Click on an item header to expand it
2. Edit any field within the item
3. Changes save automatically

### Deleting Items

1. Find the item you want to remove
2. Click the trash icon
3. If confirmation is required, confirm the deletion

> ⚠️ **Warning:** Deleting array items cannot be undone after you leave the editor. Make sure you really want to remove an item before deleting.

### Bulk Actions

When you have multiple items, use the Actions dropdown:

- **Expand All** — Show all items expanded
- **Collapse All** — Collapse all items for a compact view

---

## Reordering Sections

Change the order of sections on your page using drag and drop:

1. **Hover** over the section you want to move
2. **Find the drag handle** — it appears at the top of the section
3. **Click and hold** the drag handle
4. **Drag** the section to its new position — a blue line shows where it will drop
5. **Release** to place the section

Alternatively, use the **Sections** tab in the left sidebar — drag sections in the list to reorder them instantly.

---

## Duplicating Sections

Need another section just like one you already have?

1. **Select** the section you want to copy
2. Click the **Duplicate icon** in the section toolbar (or press \`Ctrl + D\`)
3. A new identical section appears directly below
4. Edit the copy as needed

> 💡 **Pro Tip:** Duplicating is much faster than adding a new section and re-entering all the content. Use it liberally when building pages with similar sections.

---

## Deleting Sections

To remove a section:

1. **Select** the section
2. Click the **Delete icon** (trash can) in the section toolbar, or press \`Delete\`
3. The section is removed

> ⚠️ **Warning:** Section deletion can be undone with \`Ctrl + Z\` during your session. After you save or leave the editor, deleted sections cannot be recovered.

---

## Section-Specific Tips

### Hero Section

- Use \`highlightedText\` to emphasize key phrases (appears in a different color)
- Add \`services[]\` items to show what you offer at a glance
- Set a compelling \`primaryButtonText\` with action words like "Get Started" or "Try Free"

### Pricing Section

- Set \`isHighlighted: true\` on your recommended plan
- Use \`originalPrice\` and \`discount\` to show savings
- Include at least 3 features per plan for comparison value

### FAQ Section

- Order questions by importance/frequency
- Keep answers concise but complete
- Use 5-10 questions for optimal engagement

### Testimonials Section

- Include author name, role, and company for credibility
- Add ratings (1-5 stars) when available
- Use real customer photos when possible

---

## Troubleshooting

### "I can't edit some text"

The text might be linked to a translation key. Check the Translations panel to see if the content is translation-managed. Edit through the translation system instead.

### "My changes aren't saving"

Check the save indicator in the toolbar. If it shows an error:
1. Refresh the page
2. Check your internet connection
3. Try pressing \`Ctrl + S\` to manually save

### "A section looks different in preview"

The preview shows exactly what visitors see. If a section looks different:
1. Check responsive settings in the Style tab for the current device
2. Clear your browser cache
3. Try a hard refresh (\`Ctrl + Shift + R\`)

### "I can't delete an item from a list"

Check if there's a minimum item requirement. Some sections require at least 1 item. The delete button will be disabled if you're at the minimum.

---

## Best Practices

### Keep It Focused

Every section should have a clear purpose. If you can't explain why a section is on your page in one sentence, consider removing it.

### Maintain Visual Hierarchy

Organize sections in a logical flow:

1. **Hero** — Grab attention, state your value proposition
2. **Features/Benefits** — Explain what you offer
3. **Social Proof** — Build trust with testimonials and logos
4. **Pricing** — Show the investment
5. **FAQ** — Address concerns
6. **CTA** — Close with a strong call to action

### Test on Mobile

Always preview your page on mobile before publishing. Use the device toggle to check all breakpoints.

### Use Section Backgrounds Strategically

Alternating background colors creates visual separation and makes your page easier to scan. Try alternating between white and a light gray or your brand's secondary color.

---

## What's Next?

- **[Styling Your Pages](/admin/documentation/user/styling)** — Master colors, backgrounds, and visual design
- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Learn about SEO settings and going live
  `
};

const stylingGuide: DocArticle = {
  title: 'Styling Your Pages',
  description: 'Customize colors, backgrounds, typography, and spacing for beautiful, on-brand pages',
  category: 'user',
  slug: 'styling',
  order: 3,
  tags: ['styling', 'colors', 'typography', 'spacing', 'design', 'backgrounds', 'responsive'],
  lastUpdated: '2025-01-15',
  content: `
# Styling Your Pages

Great content deserves great design. The page builder's styling system gives you complete control over how your pages look — from colors and backgrounds to spacing and typography. This guide covers the complete \`SectionStyleProps\` system that powers all section styling.

---

## Understanding the Style Tab

Every section has a **Style** tab in the Settings Panel. This is your design control center with organized sections for different styling aspects.

![Style tab showing Grid Layout, Background, and Spacing options](/docs/screenshots/style-tab-layout.png)

*The Style tab provides controls for layout, background, and spacing*

### Accessing Style Settings

1. **Select** any section on your page
2. Click the **Style** tab in the right Settings Panel
3. You'll see options organized into logical groups

---

## Background Options

Backgrounds set the visual tone for each section. The \`BackgroundStyle\` system supports four types:

### Background Types

| Type | Description | Properties |
|------|-------------|------------|
| **Solid** | Single flat color | \`color\` (HSL value) |
| **Gradient** | Smooth color transition | \`startColor\`, \`endColor\`, \`angle\`, \`type\` (linear/radial) |
| **Image** | Photo or graphic | \`url\`, \`position\`, \`size\`, \`repeat\`, \`overlay\` |
| **Transparent** | No background | None |

### Solid Color Backgrounds

1. Click on the **Background Color** field
2. Use the color picker to choose your color
3. Adjust opacity if needed (slide left for transparency)

> 💡 **Pro Tip:** For a clean, professional look, alternate between white and a light gray for consecutive sections.

### Gradient Backgrounds

1. Select **"Gradient"** as your background type
2. Choose your starting color
3. Choose your ending color
4. Adjust the angle (0° = left to right, 90° = top to bottom)

**Popular Gradient Angles:**

| Angle | Direction | Best For |
|-------|-----------|----------|
| **0°** | Left to right | Horizontal flow |
| **90°** | Top to bottom | Natural, like sky to ground |
| **135°** | Diagonal (top-left to bottom-right) | Modern feel |
| **180°** | Bottom to top | Reverse natural |

### Background Images

1. Select **"Image"** as your background type
2. Upload your image or enter a URL
3. Configure positioning:
   - **Position** — Where the image anchors (center, top, bottom, etc.)
   - **Size** — \`cover\` (fills section) or \`contain\` (shows full image)
   - **Repeat** — Enable tiling for patterns

### Image Overlays

Make text readable over images:

1. Add your background image
2. Enable **"Overlay"**
3. Choose overlay color (usually black or your brand color)
4. Adjust overlay opacity (60-80% usually works well)

> ⚠️ **Warning:** Always check that text is readable over background images. White text on a dark overlay is the safest approach.

---

## Responsive Spacing System

The page builder uses a responsive spacing system that adapts to different screen sizes.

![Spacing controls with padding and margin inputs and responsive breakpoints](/docs/screenshots/spacing-controls.png)

*Padding and margin controls with responsive breakpoints for desktop, tablet, and mobile*

### SpacingValue Structure

Each spacing value can have different settings per device:

\`\`\`
{
  desktop: "80px",
  tablet: "60px",    // Optional - falls back to desktop
  mobile: "40px"     // Optional - falls back to tablet
}
\`\`\`

### Section Padding

Padding is the space inside a section, between the edge and the content:

| Spacing Area | Typical Desktop | Typical Mobile |
|--------------|-----------------|----------------|
| **Hero sections** | 120-160px | 80px |
| **Standard sections** | 80px | 40-60px |
| **CTA sections** | 60px | 40px |
| **Compact sections** | 40px | 24px |

### Section Margin

Margin is the space outside a section, between sections:

- **Top Margin** — Space above the section
- **Bottom Margin** — Space below the section

> 💡 **Pro Tip:** Use consistent spacing across your page. If one section has 80px padding, all similar sections should too.

---

## Border & Shadow Options

Add depth and definition with borders and shadows.

### Border Configuration

The \`BorderStyle\` interface supports:

| Property | Values | Description |
|----------|--------|-------------|
| **Width** | Any CSS value | e.g., "1px", "2px" |
| **Style** | solid, dashed, dotted, none | Border line style |
| **Color** | Any color | Border color |
| **Radius** | Any CSS value | Corner rounding ("8px", "full", etc.) |

### Shadow Presets

The builder includes predefined shadow presets:

| Preset | CSS Value | Best For |
|--------|-----------|----------|
| **none** | none | Flat design |
| **sm** | 0 1px 2px | Subtle lift |
| **md** | 0 4px 6px -1px | Cards, buttons |
| **lg** | 0 10px 15px -3px | Modals, popups |
| **xl** | 0 20px 25px -5px | Hero elements |
| **2xl** | 0 25px 50px -12px | Dramatic emphasis |

---

## Device Visibility & Advanced Options

Control which elements appear on different devices and access advanced styling features.

![Advanced style options including Layout, Border & Shadow, and Device Visibility](/docs/screenshots/style-advanced-options.png)

*Advanced styling options for container width, z-index, borders, and device-specific visibility*

### DeviceVisibility Settings

| Device | Description |
|--------|-------------|
| **Desktop** | Show/hide on screens > 1024px |
| **Tablet** | Show/hide on screens 768-1024px |
| **Mobile** | Show/hide on screens < 768px |

**Common Use Cases:**

- Hide complex navigation on mobile
- Show simplified content on smaller screens
- Display mobile-specific CTAs

---

## Working with Colors

Consistent colors build brand recognition. Here's how to use them effectively.

### The Color Picker

When you click any color field, you'll see:

- **Preset colors** — Quick access to your theme colors
- **Color wheel** — Click anywhere to choose a color
- **HSL input** — Enter exact color values
- **Opacity slider** — Make colors transparent

### Using Theme Colors (Semantic Tokens)

Your site has predefined theme colors that should be used consistently:

| Token | CSS Variable | Typical Use |
|-------|--------------|-------------|
| **Primary** | \`--primary\` | Buttons, links, key accents |
| **Secondary** | \`--secondary\` | Supporting elements |
| **Background** | \`--background\` | Page and section backgrounds |
| **Foreground** | \`--foreground\` | Main text color |
| **Muted** | \`--muted\` | Subtle backgrounds, secondary text |
| **Accent** | \`--accent\` | Highlights, badges |
| **Destructive** | \`--destructive\` | Errors, delete actions |

> 💡 **Pro Tip:** Always use semantic tokens rather than hardcoded colors. This ensures consistency and makes theme changes easy.

### Color Best Practices

- **Limit your palette** — Stick to 3-5 colors maximum
- **Ensure contrast** — Text should have 4.5:1 contrast ratio minimum
- **Be consistent** — Use the same colors for the same purposes
- **Consider accessibility** — Some visitors may be colorblind

---

## Typography

Text styling affects readability and brand perception.

### Text Colors

Adjust text colors in the Style tab:

- **Heading Color** — For titles and headers
- **Text Color** — For body paragraphs
- **Link Color** — For clickable text
- **Muted Color** — For secondary/helper text

### Text Alignment

Control how text aligns:

| Alignment | Best For |
|-----------|----------|
| **Left** | Body text, descriptions (most readable) |
| **Center** | Headings, CTAs, short content |
| **Right** | Specific designs, RTL languages |

### Typography Hierarchy

| Element | Style | Purpose |
|---------|-------|---------|
| **H1** | Large, bold | Page title (one per page) |
| **H2** | Medium-large, bold | Section headings |
| **H3** | Medium, semibold | Subsection headings |
| **Body** | Regular weight | Paragraphs and descriptions |
| **Small** | Smaller, muted color | Captions and fine print |

---

## Responsive Design

Your pages need to look great on all devices.

### Device Preview

Test your design on different screen sizes:

1. Click the **device icons** in the toolbar
2. Choose Desktop (default), Tablet, or Mobile view
3. Check that everything looks correct at each size

### What to Check on Mobile

- [ ] Text is readable without zooming (16px minimum)
- [ ] Buttons are large enough to tap (44px minimum)
- [ ] Images don't overflow the screen
- [ ] Spacing isn't too tight or too loose
- [ ] Nothing important is hidden or cut off
- [ ] Forms are easy to complete

### Responsive Adjustments

Many style properties support per-device values:

- **Padding/Margin** — Reduce on smaller screens
- **Font sizes** — Scale down appropriately
- **Visibility** — Hide complex elements on mobile
- **Column layouts** — Stack on mobile

---

## Container Width Options

Control the maximum width of section content:

| Width | Pixels | Best For |
|-------|--------|----------|
| **Narrow** | 768px | Text-heavy content, articles |
| **Default** | 1280px | Most sections |
| **Wide** | 1440px | Feature grids, galleries |
| **Full** | 100% | Hero sections, edge-to-edge |

---

## Visual Design Best Practices

### Create Visual Rhythm

Alternate between section styles:

1. Hero with image background
2. White section with features
3. Light gray section with testimonials
4. White section with pricing
5. Primary color CTA section

This creates a visual flow that guides readers down the page.

### Use Shadows Strategically

| Shadow Level | Effect | When to Use |
|--------------|--------|-------------|
| **None** | Flat design | Minimal, modern look |
| **Subtle (sm)** | Slight lift | Cards, subtle separation |
| **Medium (md)** | Noticeable depth | Important elements |
| **Large (lg+)** | Dramatic | Hero elements, modals |

### Mind the Details

Small touches that make a big difference:

- Rounded corners on images and cards (8px is popular)
- Consistent icon styles throughout
- Matching button styles
- Adequate line height for readability (1.5-1.7)

---

## Common Styling Mistakes

### Too Many Colors

❌ Using 8+ colors creates visual chaos

✅ Stick to your brand palette (3-5 colors)

### Poor Contrast

❌ Light gray text on white background

✅ Ensure a contrast ratio of at least 4.5:1 for body text

### Inconsistent Spacing

❌ Different padding values for each section

✅ Use consistent spacing throughout

### Ignoring Mobile

❌ Only checking desktop view

✅ Always preview on mobile before publishing

---

## Troubleshooting

### "My background color isn't showing"

Check if there's a background image set. Images display on top of colors. Remove the image or set it to transparent.

### "Text is hard to read"

Add or darken the overlay on background images. Ensure sufficient contrast between text and background.

### "Spacing looks different on the live site"

Clear your browser cache. If the issue persists, check that you're viewing the same device breakpoint.

### "Changes aren't applying"

1. Make sure the section is selected
2. Check that you're in the correct tab (Style vs Content)
3. Try refreshing the page

---

## What's Next?

- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Learn about SEO settings and going live
- **[Frequently Asked Questions](/admin/documentation/user/faq)** — Find answers to common questions
  `
};

const publishingGuide: DocArticle = {
  title: 'Publishing Your Pages',
  description: 'Learn how to preview, publish, and manage page visibility with SEO best practices',
  category: 'user',
  slug: 'publishing',
  order: 4,
  tags: ['publishing', 'preview', 'seo', 'domains', 'live', 'visibility', 'autosave'],
  lastUpdated: '2025-01-15',
  content: `
# Publishing Your Pages

You've built a beautiful page — now it's time to share it with the world. This guide covers everything from previewing your work to understanding the autosave system and optimizing for search engines.

---

## Understanding the Save System

The page builder uses an intelligent autosave system that keeps your work safe.

### How Autosave Works

The \`useAutosave\` hook manages automatic saving:

1. **Debounced Saving** — Changes are batched and saved every 2 seconds of inactivity
2. **Status Indicators** — The toolbar shows current save status
3. **Conflict Prevention** — Only one user can edit a page at a time (page locking)

### Save Status Indicators

| Status | Icon | Meaning |
|--------|------|---------|
| **Saved** | ✓ Checkmark | All changes are saved |
| **Saving** | Spinner | Save in progress |
| **Unsaved** | Yellow dot | Changes pending |
| **Error** | Red indicator | Save failed, retry needed |

### When Saves Occur

- **Automatic:** Every 2 seconds after you stop making changes
- **Manual:** Press \`Ctrl + S\` / \`⌘S\` anytime
- **Before Navigate:** Prompted to save when leaving with unsaved changes

> ⚠️ **Warning:** If you see "Error" when saving, don't leave the page! Check your internet connection and try saving again.

---

## Preview Mode

Always preview before publishing. Preview mode shows exactly what visitors will see.

### How to Preview

1. Click the **Preview** button in the editor toolbar
2. Your page opens in a new view
3. Interact with the page as a visitor would
4. Use device toggle to check mobile/tablet views

### Device Testing

Test on multiple devices using the toolbar icons:

| Device | Screen Width | What to Check |
|--------|--------------|---------------|
| **Desktop** | > 1024px | Full layout, all features |
| **Tablet** | 768-1024px | Responsive layouts, touch targets |
| **Mobile** | < 768px | Stacked layouts, readability |

> 💡 **Pro Tip:** Over 60% of web traffic is mobile. Always check mobile view before publishing!

---

## Publishing a Page

Publishing makes your page accessible to visitors.

### How to Publish

1. Ensure all content is finalized
2. Review the preview one more time
3. Click the **Publish** button in the toolbar
4. Confirm when prompted
5. Your page is now live!

### What Happens When You Publish

- The page becomes accessible at its URL
- Search engines can index it (unless set to noindex)
- Any previous version is replaced
- Cache is updated (may take a few minutes for CDN)

### First-Time Publishing Checklist

Before publishing a page for the first time:

- [ ] URL slug is what you want (can't easily change later)
- [ ] Page title is set and descriptive
- [ ] Meta description is configured
- [ ] Social share image is uploaded
- [ ] Page is set to "Active"
- [ ] Tested on desktop, tablet, and mobile

---

## SEO Settings

Search Engine Optimization helps your page appear in Google and other search engines.

### Essential SEO Fields

**Page Title (Meta Title)**

| Requirement | Guideline |
|-------------|-----------|
| Length | Under 60 characters |
| Content | Include main keyword |
| Format | "Topic - Brand Name" |

Example: "VPS Hosting Plans | Reliable Cloud Servers - HostOnce"

**Meta Description**

| Requirement | Guideline |
|-------------|-----------|
| Length | 150-160 characters |
| Content | Summarize page enticingly |
| Action | Include a call to action |

Example: "Get powerful VPS hosting with 99.9% uptime. Choose from flexible plans starting at $5/mo. Free migration and 24/7 support included."

**URL Slug**

| Do | Don't |
|-----|-------|
| Use lowercase | Use uppercase |
| Use hyphens | Use underscores or spaces |
| Keep it short | Make it long |
| Be descriptive | Use random characters |

Example: ✅ "vps-hosting" ❌ "virtual-private-server-hosting-plans-2024"

### Social Sharing Settings (Open Graph)

Control how your page appears when shared on social media:

| Field | Purpose | Size |
|-------|---------|------|
| **OG Title** | Title on social shares | 60-90 chars |
| **OG Description** | Description on social | 150-200 chars |
| **OG Image** | Preview image | 1200 x 630 px |

### Twitter Card Settings

Similar to Open Graph but for Twitter:

- **Twitter Card Type** — Usually "summary_large_image"
- **Twitter Title** — Can differ from OG title
- **Twitter Description** — Can differ from OG description

### Advanced SEO Options

**Canonical URL**

Tells search engines the "official" version of a page. Use when:
- Content exists on multiple URLs
- You want to consolidate ranking signals
- Leave blank for most pages

**No Index / No Follow**

| Setting | Effect | Use For |
|---------|--------|---------|
| **No Index** | Page won't appear in search results | Thank you pages, private pages |
| **No Follow** | Search engines won't follow links | Limited-access areas |

> 💡 **Pro Tip:** SEO changes take time. After publishing, it may take days or weeks for Google to re-index your page.

---

## Managing Published Pages

After publishing, you can still make changes and manage visibility.

### Making Updates

To update a published page:

1. Open the page in the editor
2. Make your changes
3. Changes are auto-saved
4. The live page updates automatically after save

Changes go live immediately after saving — no need to "republish."

### Unpublishing a Page

To take a page offline:

1. Go to the **Pages** list in admin
2. Find the page you want to unpublish
3. Toggle off **"Active"** or click "Deactivate"
4. The page is now inaccessible to visitors (shows 404)

### Archiving vs. Deleting

| Action | Effect | Reversible? |
|--------|--------|-------------|
| **Deactivating** | Hides page, keeps all data | Yes |
| **Deleting** | Permanently removes page | No |

> ⚠️ **Warning:** Deleting a page is permanent. All content, versions, and settings will be lost. Consider deactivating instead.

---

## Version History

The page builder maintains version history for recovery.

### Accessing Version History

1. Click the **Version History** button in the editor toolbar
2. See a list of previous versions with timestamps
3. Click a version to preview it
4. Click "Restore" to revert to that version

### What's Saved in Versions

- All section content and properties
- Section order and visibility
- SEO settings
- Style configurations

### Version Limits

- Versions are created on significant changes
- Older versions may be automatically cleaned up
- Always manually save important milestones

---

## Multi-Language Publishing

If your site supports multiple languages:

### Translation Coverage

Before publishing, check translation coverage:

1. Open the Translation panel
2. Review coverage percentage for each language
3. Ensure critical content is translated
4. Use AI translation for missing keys if needed

### Per-Language SEO

Each language should have:

- Translated page title
- Translated meta description
- Language-appropriate keywords
- Localized social share images (if applicable)

---

## Pre-Publish Checklist

Use this checklist before every publish:

### Content

- [ ] All text is finalized and proofread
- [ ] No placeholder content remains ("Lorem ipsum", etc.)
- [ ] All images are high quality and properly sized
- [ ] Links go to correct destinations
- [ ] Forms are tested and working

### Design

- [ ] Page looks good on desktop
- [ ] Page looks good on tablet
- [ ] Page looks good on mobile
- [ ] Consistent styling throughout
- [ ] All images load properly
- [ ] Buttons and CTAs are visible

### SEO

- [ ] Page title is set (under 60 characters)
- [ ] Meta description is set (150-160 characters)
- [ ] URL slug is clean and descriptive
- [ ] Social share image is uploaded (1200x630)
- [ ] No Index is OFF (unless intentional)

### Performance

- [ ] Images are optimized (WebP, compressed)
- [ ] Page loads in under 3 seconds
- [ ] No console errors
- [ ] All fonts are loading

---

## Troubleshooting

### "My page isn't showing after publishing"

1. Is the page set to "Active"?
2. Is the URL correct?
3. Clear your browser cache
4. Try accessing from a different browser/device
5. Check if there are any DNS propagation delays

### "Search engines aren't finding my page"

1. Verify the page isn't set to "noindex"
2. Submit the URL to Google Search Console
3. Create internal links to the page
4. Wait 1-2 weeks for indexing
5. Check robots.txt isn't blocking the page

### "The old version is still showing"

This is usually a caching issue:

1. Clear your browser cache
2. Try a hard refresh (\`Ctrl + Shift + R\`)
3. Try an incognito/private window
4. Wait a few minutes for CDN cache to update
5. If persistent, try purging CDN cache from settings

### "Changes aren't going live"

1. Check the save status indicator
2. Ensure autosave completed (shows "Saved")
3. Refresh the live page
4. Clear CDN cache if available

---

## What's Next?

Congratulations — you know everything about publishing! Check out:

- **[Frequently Asked Questions](/admin/documentation/user/faq)** — Find answers to common questions
- **[Working with Sections](/admin/documentation/user/sections)** — Master all 27 section types
  `
};

const faqGuide: DocArticle = {
  title: 'Frequently Asked Questions',
  description: 'Answers to the most common questions about the page builder',
  category: 'user',
  slug: 'faq',
  order: 5,
  tags: ['faq', 'help', 'troubleshooting', 'common issues', 'support'],
  lastUpdated: '2025-01-15',
  content: `
# Frequently Asked Questions

Find quick answers to the most common questions about using the page builder. Can't find what you're looking for? Check the detailed guides or contact support.

---

## General Questions

### How do I undo a change?

Press \`Ctrl + Z\` (Windows) or \`⌘Z\` (Mac) to undo your last action. You can undo multiple times to go back further. To redo an undone action, press \`Ctrl + Shift + Z\` or \`⌘⇧Z\`.

The undo/redo system is powered by the \`historySlice\` in the editor store, which maintains a stack of previous states.

### Can I duplicate a page?

Yes! From the Pages list:
1. Find the page you want to copy
2. Click the menu icon (⋮) on that page
3. Select **"Clone Page"**
4. A copy is created with "-copy" added to the name
5. Edit the URL slug to something unique

### How do I change the page URL?

1. Open the page in the editor
2. Click the **Settings** icon in the toolbar
3. Find the **"URL Slug"** field
4. Enter your new URL (lowercase, hyphens only)
5. Save the page

> ⚠️ **Warning:** Changing a URL breaks any existing links to the old URL. Set up a redirect if the page has been live for a while.

### What's the difference between Save and Publish?

| Action | Effect | Visibility |
|--------|--------|------------|
| **Save** | Stores changes in database | Only in editor |
| **Publish** | Makes page accessible | Visible to visitors |

The page builder auto-saves continuously, so you mainly just need to ensure the page is set to "Active" and published when ready.

### Is there version history?

Yes! Click the **Version History** button in the editor toolbar. You can:
- See past versions with timestamps
- Preview any version
- Restore to a previous version if needed

### How many sections can I add to a page?

There's no hard limit, but for performance and user experience:
- **Recommended:** 8-15 sections
- **Maximum practical:** 25-30 sections
- Pages with 50+ sections may experience slower load times

---

## Sections

### How do I add a new section?

Three ways:
1. Press \`B\` to open the Block Library (fastest)
2. Click the **"+ Add Section"** button on the canvas
3. Click between two sections to add one there

### How many section types are available?

The page builder includes **27 professionally designed section types**:
- 3 Headers & Layout sections
- 7 Features & Content sections
- 5 Social Proof sections
- 4 Pricing & Commerce sections
- 4 Engagement & Conversion sections
- 4 Information & Media sections

### Why can't I edit some text?

Text might be linked to translation keys if your site uses multiple languages. Check the **Translations** panel to edit translation-managed content. You can:
- Edit the source text (default language)
- Edit translations for other languages
- Unlink the translation key if needed

### How do I add custom sections?

Custom sections require developer implementation. See the [Developer Guide: Creating Sections](/admin/documentation/developer/sections) for technical details. The process involves:
1. Creating a section definition
2. Building a display component
3. Creating a settings component
4. Registering in the section registry

### Can I save a section as a template?

Not yet built-in, but you can:
1. Duplicate the page containing the section
2. Delete unwanted sections from the copy
3. Use that page as a template

Template library is planned for a future update!

### How do I reorder sections?

**Method 1: Drag and Drop**
1. Hover over the section
2. Grab the drag handle at the top
3. Drag to new position
4. Release to drop

**Method 2: Left Sidebar**
1. Open the Sections tab
2. Drag sections in the list
3. Canvas updates in real-time

### Can I copy sections between pages?

Currently, you would need to:
1. Clone the entire source page
2. Delete unwanted sections from the clone
3. Or manually recreate the section

Section copy/paste is planned for a future update.

### What are the translatable props?

Each section type has specific translatable properties. Common patterns:
- \`title\`, \`subtitle\`, \`badge\` — Header text
- \`buttonText\`, \`buttonUrl\` — CTAs
- \`items.*.title\`, \`items.*.description\` — Array item text

---

## Translation System

### How does the translation system work?

The page builder uses a key-based translation system:

1. **Translation Keys** are created in the \`translation_keys\` table
2. **Translations** are stored per-language in the \`translations\` table
3. Content can be linked to keys via the Translation panel
4. The \`useTranslationEngine\` hook manages everything

### How do I translate content?

1. Select a section
2. Open the Translation panel
3. Click "Link" next to any text field
4. Choose or create a translation key
5. Add translations for each language

### What is AI translation?

The builder includes AI-powered translation:
1. Select untranslated content
2. Click "AI Translate"
3. Choose target languages
4. Review and approve translations

AI translations are marked with "AI Translated" status until reviewed.

### How do I check translation coverage?

The Translation Coverage Meter shows:
- Total translatable elements
- Elements with translation keys
- Percentage complete per language

Aim for 100% coverage before publishing multilingual pages.

---

## Grid System

### What is the grid system?

The page builder uses an **Elementor-style 3-level hierarchy**:

\`\`\`
Section → Column → Widget
\`\`\`

This provides:
- Predictable drag-and-drop behavior
- Responsive layouts
- Consistent styling boundaries

### How do column layouts work?

Columns within a section can have:
- **Flexible widths** — Responsive percentages per device
- **Alignment** — Start, center, end, or stretch
- **Gap** — Space between columns

### Can I resize columns?

Yes! In the grid editor:
1. Select a column
2. Drag the resize handle
3. Width updates in real-time
4. Set per-device widths in column settings

### What are widgets?

Widgets are the atomic content units within columns:
- Feature cards
- Pricing plan cards
- Testimonial cards
- FAQ items
- And 20+ more types

---

## Styling

### How do I match my brand colors?

Use the design system's semantic tokens:
1. Colors are defined in \`index.css\` as CSS variables
2. Tailwind config maps these to utility classes
3. Components use tokens like \`bg-primary\`, \`text-muted-foreground\`
4. Change the token values to update the entire site

### Why do my changes look different on mobile?

The page builder uses responsive design:
- Layouts adapt to screen size
- Some elements may be hidden on mobile
- Spacing often reduces on smaller screens

Use the device preview toggle to see how sections respond.

### How do I add a background image?

1. Select the section
2. Go to the **Style** tab
3. Set Background Type to **"Image"**
4. Upload an image or enter a URL
5. Adjust position, size, and overlay
6. Add overlay for text readability if needed

### What shadow presets are available?

| Preset | Effect |
|--------|--------|
| **none** | No shadow |
| **sm** | Subtle lift |
| **md** | Standard card shadow |
| **lg** | Prominent shadow |
| **xl** | Strong emphasis |
| **2xl** | Dramatic shadow |

### Can I use custom fonts?

Custom fonts require developer configuration:
1. Add font files to the project
2. Update Tailwind config
3. Create font-family CSS variables
4. Fonts become available in the editor

---

## Images & Media

### What image sizes should I use?

| Image Type | Recommended Size |
|------------|------------------|
| Hero backgrounds | 1920 x 1080 px |
| Section backgrounds | 1920 x 800 px |
| Feature icons | 64 x 64 px (SVG preferred) |
| Team member photos | 400 x 400 px |
| Blog thumbnails | 800 x 450 px |
| Social share (OG) image | 1200 x 630 px |
| Logo images | Height: 40-60px |

### What file formats are supported?

| Format | Best For | Notes |
|--------|----------|-------|
| **WebP** | Photos | Smallest file size |
| **JPG** | Photos | Wide compatibility |
| **PNG** | Graphics with transparency | Larger files |
| **SVG** | Logos, icons | Infinite scaling |
| **GIF** | Simple animations | Limited colors |

### How do I optimize images for speed?

1. **Compress** images before uploading (TinyPNG, Squoosh)
2. **Resize** to appropriate dimensions
3. **Use WebP** format when possible
4. **Enable lazy loading** (default behavior)
5. **Use appropriate resolution** — don't use 4000px for 400px display

---

## Publishing

### Why isn't my page showing?

Check these items in order:
1. ✓ Page is set to "Active"
2. ✓ URL is correct
3. ✓ Page was saved successfully
4. ✓ Browser cache is cleared
5. ✓ Try incognito/private window

### How long until changes are live?

Changes are live **immediately** after saving. If you don't see updates:
1. Clear browser cache
2. Hard refresh (\`Ctrl + Shift + R\`)
3. Wait 1-2 minutes for CDN cache
4. Try a different browser

### Can I schedule pages to publish later?

Scheduling is planned but not currently available. Workaround:
1. Create the page ahead of time
2. Set it to "Inactive"
3. Manually activate when ready to publish

### How do I hide a page from the public?

1. Go to the Pages list
2. Find your page
3. Toggle off "Active"
4. The page returns 404 to visitors

---

## Troubleshooting

### The editor is slow or freezing

1. Refresh the page
2. Clear browser cache and cookies
3. Close other browser tabs
4. Try Chrome (recommended browser)
5. Check internet connection
6. Disable browser extensions temporarily
7. If page has 50+ sections, consider splitting

### I lost my changes

Changes auto-save every 2 seconds. If you lost work:
1. Check Version History for recent saves
2. Look for "Saved" indicator in toolbar
3. Don't panic — most changes are saved within seconds
4. Contact support for recovery of specific versions

### A section is broken or looks wrong

1. Check if all required fields are filled
2. Try selecting and re-saving the section
3. Check the browser console for errors (F12)
4. Delete and re-add the section
5. Compare behavior in preview vs editor

### Text is overlapping or cut off

This usually means content is too long:
1. Shorten the text
2. Adjust padding/spacing in Style tab
3. Check responsive settings for current device
4. Enable text wrapping if available

### Forms aren't submitting

1. Check all required fields are filled
2. Verify form action/endpoint is configured
3. Check browser console for errors (F12)
4. Test in preview mode
5. Verify CORS and security settings

---

## Keyboard Shortcuts

### Complete Reference

| Category | Shortcut | Action |
|----------|----------|--------|
| **Editing** | \`Ctrl/⌘ + S\` | Save page |
| | \`Ctrl/⌘ + Z\` | Undo |
| | \`Ctrl/⌘ + Shift + Z\` | Redo |
| | \`Ctrl/⌘ + Y\` | Redo (alt) |
| | \`Ctrl/⌘ + D\` | Duplicate |
| | \`Delete/Backspace\` | Delete selected |
| **Navigation** | \`Escape\` | Deselect / Close |
| | \`B\` | Open Block Library |
| **View** | \`Ctrl/⌘ + P\` | Preview |
| | \`Ctrl/⌘ + /\` | Toggle code viewer |
| | \`?\` | Show shortcuts |

### How do I see all keyboard shortcuts?

Press the \`?\` key anywhere in the editor to open the keyboard shortcuts dialog.

---

## Getting Help

### How do I contact support?

1. Click the **Help** button in the admin header
2. Use the chat widget in the bottom right corner
3. Email the support team
4. Check this documentation first!

### Where can I suggest new features?

Feature suggestions can be submitted through:
- The Help menu → "Suggest Feature"
- Email to the product team
- User feedback surveys

### Is there video training available?

Video tutorials are in development. For now, this documentation covers all features in comprehensive detail.

---

## Still Have Questions?

If you can't find the answer you need:

1. **Search this documentation** — Use the search bar at the top
2. **Check the detailed guides** — Each topic has an in-depth guide
3. **Developer Guide** — For technical implementation questions
4. **Contact support** — We're here to help!

> 💡 **Pro Tip:** When contacting support, include screenshots and steps to reproduce the issue. This helps solve your problem faster!
  `
};

// ============================================================================
// DEVELOPER GUIDE ARTICLES
// ============================================================================

const architectureGuide: DocArticle = {
  title: 'Architecture Overview',
  description: 'Understand the complete system architecture, state management, and core patterns',
  category: 'developer',
  slug: 'architecture',
  order: 1,
  tags: ['architecture', 'data flow', 'state management', 'technical', 'zustand', 'store'],
  lastUpdated: '2025-01-15',
  content: `
# Architecture Overview

This comprehensive guide explains the page builder's technical architecture, data structures, and patterns. Understanding these fundamentals is essential before making modifications or building custom sections.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x | Type-safe development |
| **Zustand** | 5.x | State management with slices |
| **Supabase** | Latest | Database, auth, storage, edge functions |
| **Tailwind CSS** | 3.x | Utility-first styling with semantic tokens |
| **React Query** | 5.x | Server state management and caching |
| **Vite** | 5.x | Build tool and dev server |
| **dnd-kit** | 6.x | Drag and drop functionality |

---

## Project Structure

\`\`\`
src/
├── components/
│   ├── admin/                 # Admin panel UI
│   │   ├── sections/          # Section settings components (27 files)
│   │   │   └── shared/        # Shared settings components
│   │   ├── editor/            # Editor toolbar, panels
│   │   └── documentation/     # Documentation components
│   ├── editor/                # Canvas and editing components
│   │   ├── grid/              # Grid system components
│   │   ├── settings/          # Element settings panels
│   │   ├── slate/             # Slate.js rich text editor
│   │   └── tiptap/            # Tiptap editor integration
│   ├── landing/               # Section display components (27 files)
│   │   └── shared/            # Shared display components
│   ├── live/                  # Live page rendering
│   └── ui/                    # shadcn/ui base components
├── content/
│   └── documentation/         # Documentation content (this file)
├── contexts/                  # React contexts
├── hooks/
│   ├── queries/               # React Query hooks
│   └── ...                    # Custom hooks
├── lib/
│   ├── sections/              # Section registry and definitions
│   │   └── definitions/       # Individual section definitions (27 files)
│   └── ...                    # Utilities
├── pages/                     # Route pages
│   └── admin/                 # Admin pages
├── stores/
│   └── editor/                # Zustand store slices
│       └── slices/            # Individual store slices (6 files)
├── types/                     # TypeScript type definitions
└── services/                  # Service layer (autosave, etc.)
\`\`\`

---

## Core Data Model

### PageData Structure

\`\`\`typescript
interface PageData {
  id: string;
  pageTitle: string;
  pageUrl: string;
  sections: SectionInstance[];
  content?: string;           // JSON-serialized sections
  hiddenSections?: string[];  // IDs of hidden sections
  metadata?: PageMetadata;
  version?: number;
}
\`\`\`

### SectionInstance

\`\`\`typescript
interface SectionInstance {
  id: string;                   // UUID - unique identifier
  type: SectionType;            // e.g., "hero", "features", "pricing"
  props: Record<string, any>;   // Section-specific properties
  order: number;                // Position on page
  visible: boolean;             // Visibility toggle
  translationKeys?: TranslationKeyMap;  // Translation key mappings
  grid?: SectionGrid;           // Grid layout (if using grid system)
  style?: SectionStyleProps;    // Section styling overrides
}
\`\`\`

### SectionType Union (All 27 Types)

\`\`\`typescript
type SectionType =
  // Headers & Layout
  | 'hero'
  | 'announcement-banner'
  | 'bento-grid'
  // Features & Content
  | 'features'
  | 'icon-features'
  | 'alternating-features'
  | 'why-choose'
  | 'steps'
  | 'awards'
  | 'video'
  // Social Proof
  | 'testimonials'
  | 'logo-carousel'
  | 'trusted-by'
  | 'stats-counter'
  // Pricing & Commerce
  | 'pricing'
  | 'plans-comparison'
  | 'server-specs'
  | 'hosting-services'
  // Engagement
  | 'cta'
  | 'contact'
  | 'faq'
  | 'need-help'
  // Information
  | 'blog-grid'
  | 'team-members'
  | 'careers'
  | 'data-center'
  // Technical
  | 'os-selector';
\`\`\`

---

## State Management: Zustand Store Architecture

The editor uses Zustand with a modular **slice pattern** for maintainable state management. All slices are composed into a single store.

### Store Slices Overview

\`\`\`typescript
// Main store composition
const useEditorStore = create<EditorStoreState & EditorStoreActions>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createDocumentSlice(...a),
      ...createGridSlice(...a),
      ...createHistorySlice(...a),
      ...createSelectionSlice(...a),
      ...createUISlice(...a),
      ...createStatusSlice(...a),
    }))
  )
);
\`\`\`

### 1. Document Slice (\`documentSlice.ts\`)

Manages core document data and section CRUD operations.

**State:**
\`\`\`typescript
interface DocumentState {
  pageId: string | null;
  pageData: PageData | null;
  originalPageData: PageData | null;  // For dirty checking
  sectionVersions: Record<string, number>;  // For reactive updates
}
\`\`\`

**Key Actions:**
| Action | Parameters | Description |
|--------|------------|-------------|
| \`initializeEditor\` | \`(pageId, pageData)\` | Initialize with page data |
| \`resetEditor\` | — | Clear all state |
| \`addSection\` | \`(type, index?)\` | Add new section |
| \`updateSectionProps\` | \`(sectionId, props)\` | Update section properties |
| \`updateSectionStyle\` | \`(sectionId, style)\` | Update section styling |
| \`deleteSection\` | \`(sectionId)\` | Remove section |
| \`reorderSections\` | \`(sourceIndex, destIndex)\` | Move section |
| \`duplicateSection\` | \`(sectionId)\` | Clone section |
| \`toggleSectionVisibility\` | \`(sectionId)\` | Show/hide section |
| \`updateElementValue\` | \`(sectionId, path, value)\` | Update nested element |
| \`setTranslationKey\` | \`(sectionId, propPath, key)\` | Link translation key |

### 2. Grid Slice (\`gridSlice.ts\`)

Manages Elementor-style grid operations (Section → Column → Widget).

**Key Actions:**
| Action | Parameters | Description |
|--------|------------|-------------|
| \`setSectionGrid\` | \`(sectionId, grid)\` | Set grid layout |
| \`addColumn\` | \`(sectionId, column, index?)\` | Add column |
| \`removeColumn\` | \`(sectionId, columnId)\` | Remove column |
| \`reorderColumn\` | \`(sectionId, srcIdx, destIdx)\` | Move column |
| \`updateColumnWidth\` | \`(sectionId, columnId, width)\` | Resize column |
| \`addWidgetToColumn\` | \`(sectionId, columnId, widget, index?)\` | Add widget |
| \`removeWidget\` | \`(sectionId, columnId, widgetIndex)\` | Remove widget |
| \`moveWidgetBetweenColumns\` | \`(...params)\` | Move widget to different column |

### 3. Selection Slice (\`selectionSlice.ts\`)

Manages selection state and interaction modes.

**State:**
\`\`\`typescript
interface SelectionState {
  selection: ElementSelection;
  selectedSectionId: string | null;
  hoveredElement: HoveredElement | null;
}

interface ElementSelection {
  type: 'none' | 'section' | 'column' | 'element';
  sectionId: string | null;
  columnId: string | null;
  elementPath: string | null;
  isInlineEditing: boolean;
  translationKey?: string;
}
\`\`\`

**Key Actions:**
| Action | Description |
|--------|-------------|
| \`selectSection(id)\` | Select a section |
| \`selectColumn(sectionId, columnId)\` | Select a column |
| \`selectElement(sectionId, path)\` | Select an element |
| \`clearSelection()\` | Deselect all |
| \`startInlineEdit()\` / \`stopInlineEdit()\` | Toggle inline editing |
| \`setHoveredElement(sectionId, path)\` | Track hover state |

### 4. History Slice (\`historySlice.ts\`)

Manages undo/redo functionality.

**State:**
\`\`\`typescript
interface HistoryState {
  history: PageData[];      // Stack of previous states
  historyIndex: number;     // Current position
}
\`\`\`

**Key Actions:**
| Action | Description |
|--------|-------------|
| \`pushHistory()\` | Save current state to history |
| \`undo()\` | Revert to previous state |
| \`redo()\` | Reapply undone state |

### 5. UI Slice (\`uiSlice.ts\`)

Manages UI state and editor modes.

**State:**
\`\`\`typescript
interface UIState {
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  activeTab: 'sections' | 'blocks';
  isDragging: boolean;
  editorMode: EditorMode;  // 'idle' | 'selecting' | 'dragging' | 'resizing' | 'inline-editing'
  dragContext: DragContext | null;
  resizeContext: ResizeContext | null;
  dropTarget: DropTarget | null;
}
\`\`\`

### 6. Status Slice (\`statusSlice.ts\`)

Manages loading, saving, and autosave status.

**State:**
\`\`\`typescript
interface StatusState {
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  autosaveStatus: AutosaveStatus;
  lastSavedAt: string | null;
}
\`\`\`

---

## Grid System (Section → Column → Widget)

The editor uses an Elementor-style 3-level layout hierarchy:

### Grid Data Model

\`\`\`typescript
interface SectionGrid {
  columns: GridColumn[];
  gap?: string;                    // e.g., "1rem"
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: {
    tablet?: { columns: number };
    mobile?: { columns: number };
  };
}

interface GridColumn {
  id: string;
  width: ResponsiveWidth;          // { desktop, tablet?, mobile? }
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  gap?: string;
  widgets: GridWidget[];
}

interface GridWidget {
  id: string;
  type: GridWidgetType;            // 27+ widget types
  props: Record<string, any>;
  sourcePath?: string;             // Back-reference for denormalization
}

interface ResponsiveWidth {
  desktop: string;    // e.g., "33.33%", "1fr"
  tablet?: string;
  mobile?: string;
}
\`\`\`

### Widget Types (GridWidgetType)

\`\`\`typescript
type GridWidgetType =
  | 'feature-card' | 'pricing-plan-card' | 'testimonial-card'
  | 'faq-item' | 'stat-card' | 'step-card' | 'icon-feature-card'
  | 'team-member-card' | 'award-card' | 'service-card'
  | 'blog-post-card' | 'job-card' | 'location-card'
  | 'bento-item' | 'logo-item' | 'company-logo'
  | 'alternating-block' | 'why-choose-reason' | 'contact-channel'
  | 'need-help-option' | 'os-option' | 'hero-service'
  // ...and more
\`\`\`

### Grid Normalization

The \`gridNormalizer.ts\` converts existing section data to grid format at runtime:

\`\`\`typescript
// Normalize a section
const normalized = normalizeSection(section);
// Returns: { id, type, grid, headerProps, originalProps, isNormalized }

// Convert back for saving
const legacyProps = denormalizeGrid(normalized, section.type);
\`\`\`

---

## Data Flow

### Editing Flow

\`\`\`mermaid
flowchart TD
    A[User Action<br/>click, type, drag] --> B[Store Action<br/>updateSectionProps, reorderSections, etc.]
    B --> C[Zustand State Update<br/>immutable]
    C --> D[UI Re-render<br/>React]
    C --> E[Push to History Stack]
    D --> F[Canvas Updates]
    E --> G[Enable Undo/Redo]
    F --> H[Autosave Trigger<br/>debounced 2s]
    H --> I[Supabase Database Update]
    I --> J[Status: Saved]
\`\`\`

### Rendering Flow

\`\`\`mermaid
flowchart TD
    A[EditorCanvas] --> B[Read sections from useEditorStore]
    B --> C[Map sections to SectionWrapper components]
    C --> D[SectionWrapper]
    D --> E[Look up definition in registry]
    D --> F[Get display component from registry]
    E --> G[DisplayComponent<br/>e.g., HeroSection]
    F --> G
    G --> H[Receive props from section.props]
    G --> I[Wrap editable elements with EditableElement]
    H --> J[Rendered Section with edit capabilities]
    I --> J
\`\`\`

---

## The Registry Pattern

Sections are registered in a central registry for dynamic loading and discovery.

### Section Registry

\`\`\`typescript
// lib/sections/registry.ts
const sectionRegistry = new Map<string, SectionDefinition>();

export function registerSection(definition: SectionDefinition) {
  sectionRegistry.set(definition.type, definition);
}

export function getSectionDefinition(type: string): SectionDefinition | undefined {
  return sectionRegistry.get(type);
}

export function getAllSectionDefinitions(): SectionDefinition[] {
  return Array.from(sectionRegistry.values());
}
\`\`\`

### Registration Example

\`\`\`typescript
// lib/sections/definitions/hero.ts
registerSection({
  type: 'hero',
  displayName: 'Hero Section',
  icon: Layout,
  category: 'layout',
  component: HeroSection,
  settingsComponent: createSettingsWrapper(HeroSettingsContent),
  defaultProps: defaultHeroProps,
  description: 'A hero section with title, subtitle, and CTA',
  translatableProps: [
    'badge', 'title', 'highlightedText', 'subtitle',
    'primaryButtonText', 'services.*.label',
  ],
});
\`\`\`

---

## Component Architecture

### The Three-Component Pattern

Each section type requires three components:

| Component | Location | Purpose |
|-----------|----------|---------|
| **Definition** | \`lib/sections/definitions/\` | Metadata, default props, registration |
| **Display** | \`components/landing/\` | Renders on canvas |
| **Settings** | \`components/admin/sections/\` | Property editor UI |

### Component Hierarchy

\`\`\`mermaid
flowchart TD
    subgraph Editor Context
        EP[EditorProvider] --> EC[EditorCanvas]
        EC --> SW[SectionWrapper<br/>for each section]
        SW --> SO[SectionOverlay<br/>selection UI, toolbar]
        SW --> DC[DisplayComponent<br/>e.g., HeroSection]
        DC --> ET[EditableText<br/>inline text editing]
        DC --> EE[EditableElement<br/>other editable elements]
    end
    
    subgraph Settings Panel
        SP[SettingsPanel<br/>right sidebar] --> SC[SettingsContent<br/>based on section type]
        SC --> SHF[SectionHeaderFields]
        SC --> ILE[ItemListEditor<br/>for arrays]
    end
\`\`\`

---

## Key Design Principles

### 1. Single Source of Truth

All section data lives in the Zustand store. The canvas and settings panel both read from and write to the same state.

### 2. Immutable Updates

State updates always create new objects rather than mutating existing ones.

\`\`\`typescript
// ✅ Correct: Create new object
updateSectionProps(id, { 
  ...section.props, 
  title: 'New Title' 
});

// ❌ Wrong: Direct mutation
section.props.title = 'New Title';
\`\`\`

### 3. Use Selectors

Always use selectors when reading from the store to prevent unnecessary re-renders:

\`\`\`typescript
// ✅ Correct: Selector - only re-renders when value changes
const title = useEditorStore(state => 
  state.pageData?.sections.find(s => s.id === id)?.props.title
);

// ❌ Avoid: Gets entire store - re-renders on ANY change
const store = useEditorStore();
const title = store.pageData?.sections[0]?.props.title;
\`\`\`

### 4. Type Safety

All props, state, and actions are fully typed with TypeScript.

### 5. Separation of Concerns

- **Store** handles state and business logic
- **Components** handle rendering and user interaction
- **Hooks** handle side effects and subscriptions
- **Services** handle external integrations (autosave, API)

---

## Key Hooks Reference

| Hook | Purpose |
|------|---------|
| \`useEditorStore\` | Access editor state and actions |
| \`usePageData\` | Get current page data |
| \`useSectionById(id)\` | Get specific section |
| \`useSelectedSection()\` | Get currently selected section |
| \`useAutosave\` | Manage autosave behavior |
| \`useTranslationEngine\` | Translation key management |
| \`useArrayItems\` | Array drag-and-drop |
| \`useElementBounds\` | Track element dimensions |

---

## Next Steps

Now that you understand the architecture:

- **[Creating Sections](/admin/documentation/developer/sections)** — Build custom section types
- **[API Reference](/admin/documentation/developer/api)** — Complete API documentation
- **[Best Practices](/admin/documentation/developer/best-practices)** — Coding standards and patterns
- **[Grid System Guide](/admin/documentation/developer/grid)** — Deep dive into the grid system
  `
};

const creatingSectionsGuide: DocArticle = {
  title: 'Creating Sections',
  description: 'Step-by-step guide to building custom sections with complete prop reference',
  category: 'developer',
  slug: 'sections',
  order: 2,
  tags: ['sections', 'components', 'development', 'custom', 'tutorial', 'props'],
  lastUpdated: '2025-01-15',
  content: `
# Creating Custom Sections

This comprehensive guide walks you through creating a new section type from scratch. Follow these steps **exactly** and you'll have a fully functional section with DnD, translations, settings, and state management.

---

## Architecture Overview

\`\`\`mermaid
flowchart TD
    subgraph "Step 0: Type Interface"
        A[src/types/newSectionTypes.ts]
    end
    
    subgraph "Step 1: Definition"
        B[src/lib/sections/definitions/my-section.ts]
    end
    
    subgraph "Step 2: Display"
        C[src/components/landing/MySectionSection.tsx]
    end
    
    subgraph "Step 3: Settings"
        D[src/components/admin/sections/MySectionSettingsContent.tsx]
    end
    
    subgraph "Step 4-6: Registration"
        E[src/lib/sections/index.ts - Add import]
        F[src/types/pageEditor.ts - Add to SectionType]
        G[src/lib/sectionDndConfig.ts - Add DnD config]
    end
    
    A --> B
    B --> C
    B --> D
    C --> E
    D --> E
    E --> F
    F --> G
    G --> H[Section Available in Editor]
\`\`\`

---

## Files You Will Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| \`src/types/newSectionTypes.ts\` | **Modify** | Add TypeScript interface for section data |
| \`src/lib/sections/definitions/[name].ts\` | **Create** | Section registration with metadata |
| \`src/components/landing/[Name]Section.tsx\` | **Create** | Display component (canvas rendering) |
| \`src/components/admin/sections/[Name]SettingsContent.tsx\` | **Create** | Settings panel component |
| \`src/lib/sections/index.ts\` | **Modify** | Add import for definition |
| \`src/types/pageEditor.ts\` | **Modify** | Add type to \`SectionType\` union |
| \`src/lib/sectionDndConfig.ts\` | **Modify** | Register DnD configuration |

---

## Step 0: Create Type Interface

First, define TypeScript interfaces for your section's data structure.

\`\`\`typescript
// src/types/newSectionTypes.ts

import type { BaseSectionData } from './baseSectionTypes';

// Define your item interface (for arrays)
export interface StatItem {
  id?: string;        // Optional - used for DnD key
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
}

// Define your section data interface
export interface StatsCounterSectionData extends BaseSectionData {
  badge?: string;
  title: string;
  subtitle?: string;
  stats: StatItem[];
}
\`\`\`

> 💡 **TIP:** Always extend \`BaseSectionData\` to get common properties like \`styleProps\`.

---

## Step 1: Create Definition File

Register your section with the registry. This is the central configuration file.

\`\`\`typescript
// src/lib/sections/definitions/stats-counter.ts

import { BarChart3 } from 'lucide-react';
import StatsCounterSection from '@/components/landing/StatsCounterSection';
import StatsCounterSettingsContent from '@/components/admin/sections/StatsCounterSettingsContent';
import { registerSection, createSettingsWrapper } from '../registry';

const defaultProps = {
  badge: 'BY THE NUMBERS',
  title: 'Trusted Worldwide',
  subtitle: 'See our impact in numbers',
  stats: [
    { id: crypto.randomUUID(), value: '99.9', label: 'Uptime', suffix: '%', icon: 'TrendingUp' },
    { id: crypto.randomUUID(), value: '10', label: 'Data Centers', suffix: '+', icon: 'Server' },
    { id: crypto.randomUUID(), value: '1M', label: 'Customers', suffix: '+', icon: 'Users' },
    { id: crypto.randomUUID(), value: '24/7', label: 'Support', suffix: '', icon: 'Headphones' },
  ],
};

registerSection({
  type: 'stats-counter',
  displayName: 'Stats Counter',
  icon: BarChart3,
  category: 'content',
  component: StatsCounterSection,
  settingsComponent: createSettingsWrapper(StatsCounterSettingsContent),
  defaultProps,
  description: 'Display impressive statistics with animated counters',
  
  // Translation keys - use .* for array item properties
  translatableProps: [
    'badge', 
    'title', 
    'subtitle',
    'stats.*.label', 
    'stats.*.value',
    'stats.*.prefix',
    'stats.*.suffix'
  ],
  
  // CRITICAL: Enable data wrapper for proper props handling
  usesDataWrapper: true,
  
  // CRITICAL: Define DnD arrays with strategy
  dndArrays: [{ path: 'stats', strategy: 'grid' }],
});
\`\`\`

### Key Properties Explained

| Property | Required | Description |
|----------|----------|-------------|
| \`type\` | ✅ | Unique identifier (kebab-case) |
| \`displayName\` | ✅ | Name shown in Block Library |
| \`icon\` | ✅ | Lucide icon component |
| \`category\` | ✅ | 'content' \\| 'commerce' \\| 'engagement' \\| 'layout' |
| \`component\` | ✅ | Display component reference |
| \`settingsComponent\` | ✅ | Settings component (wrapped) |
| \`defaultProps\` | ✅ | Initial values when added |
| \`usesDataWrapper\` | ✅ | Set \`true\` for \`data\` prop pattern |
| \`dndArrays\` | ➖ | Array DnD configuration |
| \`translatableProps\` | ➖ | Props that can be translated |

---

## Step 2: Create Display Component

This component renders on the canvas. It must support:
- DnD reordering with \`useArrayItems\` and \`SortableItem\`
- Proper TypeScript types
- Responsive styling with Tailwind semantic tokens

\`\`\`tsx
// src/components/landing/StatsCounterSection.tsx

import { SectionContainer, SectionHeader } from '@/components/landing/shared';
import { useArrayItems } from '@/hooks/useArrayItems';
import { SortableItem } from '@/components/editor/SortableItem';
import { ICON_MAP } from '@/components/admin/sections/shared/iconConstants';
import { getGridColsClass, getGapClass } from '@/lib/gridUtils';
import type { BaseSectionProps, BaseLayoutProps } from '@/types/baseSectionTypes';
import type { StatsCounterSectionData } from '@/types/newSectionTypes';

interface StatsCounterSectionProps extends BaseSectionProps {
  data: StatsCounterSectionData;
  layoutProps?: BaseLayoutProps;  // REQUIRED for Style tab settings
}

const StatsCounterSection = ({ 
  data, 
  sectionId, 
  isEditing = false,
  styleOverrides,
  layoutProps  // Destructure layoutProps
}: StatsCounterSectionProps) => {
  // Get DnD utilities for the stats array
  const { items, getItemProps, SortableWrapper } = useArrayItems(
    'stats', 
    data.stats || []
  );
  
  // Apply layout settings from Style tab
  const columns = layoutProps?.columns ?? 4;
  const gridColsClass = getGridColsClass(columns);
  const gapClass = getGapClass(layoutProps?.gap);
  
  return (
    <SectionContainer styleOverrides={styleOverrides}>
      {/* Use SectionHeader for consistent header rendering */}
      <SectionHeader 
        sectionId={sectionId}
        badge={data.badge} 
        title={data.title}
        subtitle={data.subtitle}
      />
      
      {/* Wrap sortable items in SortableWrapper */}
      <SortableWrapper>
        <div className={\`grid grid-cols-1 md:grid-cols-2 \${gridColsClass} \${gapClass || 'gap-6'}\`}>
          {items.map((stat, index) => {
            // Get icon from registry
            const Icon = stat.icon ? ICON_MAP[stat.icon] : null;
            
            return (
              // SortableItem enables drag-and-drop
              <SortableItem 
                key={stat.id || index} 
                {...getItemProps(index)}
              >
                <div className="text-center p-6 bg-muted/50 rounded-2xl border border-border/50 hover:border-primary/20 transition-colors">
                  {Icon && (
                    <div className="flex justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </SortableItem>
            );
          })}
        </div>
      </SortableWrapper>
    </SectionContainer>
  );
};

export default StatsCounterSection;
\`\`\`

### Critical Display Component Patterns

| Pattern | Purpose | Required |
|---------|---------|----------|
| \`useArrayItems(path, items)\` | DnD support for arrays | ✅ for array sections |
| \`SortableWrapper\` | Wraps sortable container | ✅ for DnD |
| \`SortableItem\` | Makes items draggable | ✅ for DnD |
| \`getItemProps(index)\` | Provides DnD props | ✅ for DnD |
| \`key={item.id \\|\\| index}\` | Unique key for React | ✅ |
| \`layoutProps?: BaseLayoutProps\` | Enables Style tab settings | ✅ |
| \`getGridColsClass(columns)\` | Dynamic column layout | ✅ for grid layouts |
| \`getGapClass(gap)\` | Dynamic spacing | ✅ for grid layouts |
| \`ICON_MAP[iconName]\` | Dynamic icon lookup | ➖ if using icons |

> ⚠️ **LAYOUT SETTINGS:** To enable layout settings (columns, gap) from the Style tab, you MUST:
> 1. Accept \`layoutProps?: BaseLayoutProps\` as a prop
> 2. Import and use \`getGridColsClass()\` and \`getGapClass()\` from \`@/lib/gridUtils\`
> 3. Apply dynamic classes to your grid container: \`className={\\\`grid grid-cols-1 md:grid-cols-2 \${gridColsClass} \${gapClass || 'gap-6'}\\\`}\`

---

## Step 3: Create Settings Component

This component renders in the right sidebar when the section is selected.

\`\`\`tsx
// src/components/admin/sections/StatsCounterSettingsContent.tsx

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SectionHeaderFields, ItemListEditor, IconPicker } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';
import type { StatsCounterSectionData, StatItem } from '@/types/newSectionTypes';

interface StatsCounterSettingsContentProps {
  data: StatsCounterSectionData;
  onChange: (data: StatsCounterSectionData) => void;
}

const StatsCounterSettingsContent = ({ 
  data, 
  onChange 
}: StatsCounterSettingsContentProps) => {
  // CRITICAL: Use this hook to prevent stale closure bugs
  const { updateField, updateArray } = useDataChangeHandlers(data, onChange);
  
  return (
    <div className="space-y-6 p-3">
      {/* Reusable header fields component */}
      <SectionHeaderFields
        badge={data.badge}
        title={data.title}
        subtitle={data.subtitle}
        onBadgeChange={(value) => updateField('badge', value)}
        onTitleChange={(value) => updateField('title', value)}
        onSubtitleChange={(value) => updateField('subtitle', value)}
      />
      
      {/* Array item editor - NOTE: Do NOT use generic syntax <ItemListEditor<T>> */}
      <ItemListEditor
        items={data.stats || []}
        onItemsChange={(stats) => updateArray('stats', stats)}
        getItemTitle={(item) => \`\${item.prefix || ''}\${item.value}\${item.suffix || ''} - \${item.label}\`}
        createNewItem={() => ({
          id: crypto.randomUUID(),
          value: '0',
          label: 'New Stat',
          prefix: '',
          suffix: '',
          icon: 'Star',
        })}
        addItemLabel="Add Stat"
        renderItem={(item, index, onUpdate) => (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prefix</Label>
                <Input
                  value={item.prefix || ''}
                  onChange={(e) => onUpdate({ prefix: e.target.value })}
                  placeholder="e.g. $"
                />
              </div>
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={item.value}
                  onChange={(e) => onUpdate({ value: e.target.value })}
                  placeholder="e.g. 99.9"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Suffix</Label>
                <Input
                  value={item.suffix || ''}
                  onChange={(e) => onUpdate({ suffix: e.target.value })}
                  placeholder="e.g. %"
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <IconPicker
                  value={item.icon || ''}
                  onChange={(icon) => onUpdate({ icon })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={item.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                placeholder="e.g. Uptime"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default StatsCounterSettingsContent;
\`\`\`

> ⚠️ **CRITICAL:** Always use \`useDataChangeHandlers(data, onChange)\` to prevent stale closure bugs. Direct mutation or using stale \`data\` references will cause settings changes to not persist.

> ⚠️ **BUILD ERROR WARNING:** Do NOT use explicit generic syntax \`<ItemListEditor<StatItem>>\`. TypeScript will infer the type from the \`items\` prop. Explicit generics break the build system's code instrumentation and cause "Expected >" errors.

> ⚠️ **REQUIRED PADDING:** The root container MUST include \`p-3\` padding class (\`className="space-y-6 p-3"\`) to prevent content from overflowing and touching the settings panel edges.

---

## Step 4: Add Import to Registry

Add a side-effect import to make the section available.

\`\`\`typescript
// src/lib/sections/index.ts

// ... existing imports
import './definitions/stats-counter';  // ADD THIS LINE
\`\`\`

---

## Step 5: Add Type to Union

Add your section type to the \`SectionType\` union.

\`\`\`typescript
// src/types/pageEditor.ts

export type SectionType = 
  | 'hero'
  | 'features'
  | 'pricing'
  | 'testimonials'
  // ... existing types
  | 'stats-counter';  // ADD YOUR TYPE HERE
\`\`\`

---

## Step 6: Register DnD Configuration

**CRITICAL STEP** — This enables drag-and-drop reordering for array items.

\`\`\`typescript
// src/lib/sectionDndConfig.ts

export const sectionDndRegistry: Record<string, SectionDndConfig> = {
  // ... existing entries
  
  // ADD YOUR SECTION
  'stats-counter': {
    arrays: [{ 
      path: 'stats',           // Array property name in data
      strategy: 'grid',        // 'grid' | 'vertical' | 'horizontal'
      handlePosition: 'top-left'  // 'left' | 'top-left' | 'top-right'
    }]
  },
};
\`\`\`

### DnD Strategy Guide

| Strategy | Use When | Example Sections |
|----------|----------|------------------|
| \`grid\` | Items in multi-column layout | Pricing, Features, Stats |
| \`vertical\` | Items stacked vertically | FAQ, Alternating Features |
| \`horizontal\` | Items in a row | Steps, Logo Carousel, CTA benefits |

---

## Step 7: Add Widget Type (Optional)

If your section items should be individually editable as grid widgets, add your widget type to the union.

\`\`\`typescript
// src/types/grid.ts

export type WidgetType = 
  | 'text'
  | 'image'
  | 'button'
  // ... existing types
  | 'stat-card';  // ADD YOUR WIDGET TYPE
\`\`\`

> 💡 **When to add a widget type:** Only needed if you want individual items within your section to be selectable and editable as separate widgets on the canvas.

---

## Step 8: Add Normalization Rule

Add a rule to normalize your section data into the grid structure. This is required for proper grid functionality.

\`\`\`typescript
// src/lib/gridNormalizer.ts - Add to NORMALIZATION_RULES array

{
  sectionType: 'stats-counter',
  arrays: [{
    path: 'stats',           // Array property in section data
    widgetType: 'stat-card', // Widget type from Step 7
  }],
},
\`\`\`

### Normalization Configuration

| Property | Purpose | Example |
|----------|---------|---------|
| \`sectionType\` | Section to normalize | \`'stats-counter'\` |
| \`arrays\` | Array mappings | \`[{ path: 'stats', widgetType: 'stat-card' }]\` |
| \`path\` | Property path to array | \`'stats'\`, \`'features'\`, \`'items'\` |
| \`widgetType\` | Widget type for items | \`'stat-card'\`, \`'feature-card'\` |

---

## ⚠️ Understanding \`usesDataWrapper\`

The \`usesDataWrapper: true\` flag in section definitions is **ONLY for component rendering**, not data storage!

| Aspect | Behavior |
|--------|----------|
| **Data Storage** | Props are ALWAYS flat: \`section.props = { title, items }\` |
| **Settings Panel** | Receives flat props: \`data = section.props\` |
| **Translation Engine** | Reads flat props from \`section.props\` |
| **Component Rendering** | Wraps in \`data\` prop: \`<Component data={props} />\` |

> ⚠️ **CRITICAL:** Do NOT expect \`section.props.data\` to exist — it never does! Props are stored flat regardless of \`usesDataWrapper\`. This flag only affects how the renderer passes props to your display component.

### When to use \`usesDataWrapper: true\`

Use it when your display component expects all content props wrapped in a single \`data\` prop:

\`\`\`tsx
// With usesDataWrapper: true, component receives:
const MySection = ({ data, sectionId }: { data: MySectionData; sectionId: string }) => {
  return <h1>{data.title}</h1>;
};

// Without usesDataWrapper (or false), component receives:
const MySection = ({ title, sectionId }: { title: string; sectionId: string }) => {
  return <h1>{title}</h1>;
};
\`\`\`

---

## Verification Checklist

After completing all steps, verify each item:

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | ✅ No TypeScript errors | Run \`npx tsc --noEmit\` |
| 2 | ✅ No build errors | Check build output |
| 3 | ✅ Type interface exists | Check \`src/types/newSectionTypes.ts\` |
| 4 | ✅ Section in Block Library | Press \`B\` in editor |
| 5 | ✅ Default content renders | Add section to page |
| 6 | ✅ Settings panel shows fields | Select section |
| 7 | ✅ Settings changes update canvas | Edit any field |
| 8 | ✅ DnD reordering works | Drag an array item |
| 9 | ✅ Grid normalization works | Widget selection on canvas |
| 10 | ✅ Page saves without errors | Check autosave indicator |
| 11 | ✅ Page reload restores data | Refresh and verify |
| 12 | ✅ Translations work (if applicable) | Test with another language |
| 13 | ✅ Translation keys generated | Open Translations panel, click Generate — keys should appear |

---

## Troubleshooting

| Issue | Likely Cause | Solution |
|-------|--------------|----------|
| Section not in Block Library | Missing import | Add import to \`src/lib/sections/index.ts\` |
| TypeScript error on section type | Type not in union | Add to \`SectionType\` in \`src/types/pageEditor.ts\` |
| TypeScript error on data shape | No interface defined | Create interface in \`src/types/newSectionTypes.ts\` |
| Settings don't update canvas | Stale closure | Use \`useDataChangeHandlers\` hook |
| DnD not working | Missing DnD registry | Add entry to \`sectionDndRegistry\` in \`src/lib/sectionDndConfig.ts\` |
| DnD drags wrong items | Wrong array path | Verify \`path\` matches prop name exactly |
| Items don't render | Data not accessed correctly | Check \`usesDataWrapper: true\` and use \`data.stats\` not \`stats\` |
| **Build fails with "Expected >"** | Generic syntax on JSX | Remove \`<T>\` from \`<ItemListEditor<T>>\` — TypeScript infers type |
| **Grid widgets not selectable** | Missing normalization | Add rule to \`src/lib/gridNormalizer.ts\` |
| **Generate Keys does nothing** | Props stored flat but code expects \`props.data\` | Props are ALWAYS flat. \`getSectionPropsContainer()\` returns \`section.props\` directly. |
| **Translation keys not detected** | Array items missing \`id\` field | Ensure all array items have \`id: crypto.randomUUID()\` in \`defaultProps\` |

---

## Complete File Checklist

Before considering your section complete, ensure all 9 files are properly configured:

\`\`\`
✅ src/types/newSectionTypes.ts              → Interface added
✅ src/lib/sections/definitions/[x].ts       → Created with registerSection()
✅ src/components/landing/[X]Section.tsx     → Display component created
✅ src/components/admin/sections/[X]SettingsContent.tsx → Settings created
✅ src/lib/sections/index.ts                 → Import added
✅ src/types/pageEditor.ts                   → Type added to union
✅ src/lib/sectionDndConfig.ts               → DnD config added
✅ src/types/grid.ts                         → Widget type added (optional)
✅ src/lib/gridNormalizer.ts                 → Normalization rule added
\`\`\`

---

## Next Steps

- **[API Reference](/admin/documentation/developer/api)** — Complete store actions and hooks
- **[Best Practices](/admin/documentation/developer/best-practices)** — Coding standards and patterns
- **[Grid System](/admin/documentation/developer/grid)** — Widget and column layouts
  `
};

const apiReferenceGuide: DocArticle = {
  title: 'API Reference',
  description: 'Complete reference for store actions, hooks, selectors, and utilities',
  category: 'developer',
  slug: 'api',
  order: 3,
  tags: ['api', 'hooks', 'store', 'reference', 'actions', 'selectors'],
  lastUpdated: '2025-01-15',
  content: `
# API Reference

Complete reference documentation for the page builder's APIs, hooks, store actions, selectors, and utilities.

---

## Store: useEditorStore

The main Zustand store for all editor state and actions.

### Basic Usage

\`\`\`typescript
import { useEditorStore } from '@/stores/editorStore';

// With selector (recommended - prevents unnecessary re-renders)
const sections = useEditorStore(state => state.pageData?.sections);
const selectedId = useEditorStore(state => state.selectedSectionId);

// Get an action
const addSection = useEditorStore(state => state.addSection);
const updateProps = useEditorStore(state => state.updateSectionProps);

// Call actions
addSection('hero');
updateProps(sectionId, { title: 'New Title' });
\`\`\`

---

## Selector Hooks

Pre-built hooks for common state access:

| Hook | Returns | Type |
|------|---------|------|
| \`usePageData()\` | Current page data | \`PageData \\| null\` |
| \`useSelection()\` | Selection state | \`ElementSelection\` |
| \`useSectionById(id)\` | Specific section | \`SectionInstance \\| undefined\` |
| \`useSelectedSection()\` | Selected section | \`SectionInstance \\| null\` |
| \`useSelectedSectionId()\` | Selected section ID | \`string \\| null\` |
| \`useSectionByIdFresh(id)\` | Section with reactive updates | \`SectionInstance \\| undefined\` |
| \`useDeviceMode()\` | Current device | \`'desktop' \\| 'tablet' \\| 'mobile'\` |
| \`useEditorMode()\` | Editor mode | \`EditorMode\` |
| \`useIsLoading()\` | Loading state | \`boolean\` |
| \`useIsSaving()\` | Saving state | \`boolean\` |
| \`useHasUnsavedChanges()\` | Dirty state | \`boolean\` |
| \`useCanUndo()\` | Undo available | \`boolean\` |
| \`useCanRedo()\` | Redo available | \`boolean\` |

### Usage Examples

\`\`\`typescript
// Get selected section with reactive updates
const section = useSelectedSection();

// Check if a specific section exists
const heroSection = useSectionById('section-123');

// Get device mode for responsive logic
const deviceMode = useDeviceMode();
if (deviceMode === 'mobile') {
  // Mobile-specific logic
}
\`\`\`

---

## Document Actions

### initializeEditor

Initialize the editor with page data.

\`\`\`typescript
initializeEditor(pageId: string, pageData: PageData | null): void
\`\`\`

### resetEditor

Clear all editor state.

\`\`\`typescript
resetEditor(): void
\`\`\`

### addSection

Add a new section to the page.

\`\`\`typescript
addSection(type: SectionType, index?: number): void
\`\`\`

| Parameter | Type | Description |
|-----------|------|-------------|
| \`type\` | \`SectionType\` | Section type (e.g., "hero", "features") |
| \`index\` | \`number?\` | Position to insert (default: end) |

### updateSectionProps

Update properties of a section.

\`\`\`typescript
updateSectionProps(sectionId: string, props: Record<string, any>): void
\`\`\`

\`\`\`typescript
// Example: Update title and subtitle
updateSectionProps('section-123', {
  title: 'New Title',
  subtitle: 'Updated subtitle',
});

// Example: Update array item
updateSectionProps('section-123', {
  features: [
    ...existingFeatures,
    { id: 'new', title: 'New Feature', description: '' }
  ],
});
\`\`\`

### updateSectionStyle

Update styling of a section.

\`\`\`typescript
updateSectionStyle(sectionId: string, style: Partial<SectionStyleProps>): void
\`\`\`

### deleteSection

Remove a section from the page.

\`\`\`typescript
deleteSection(sectionId: string): void
\`\`\`

### duplicateSection

Create a copy of a section.

\`\`\`typescript
duplicateSection(sectionId: string): void
\`\`\`

### reorderSections

Change section order.

\`\`\`typescript
reorderSections(sourceIndex: number, destinationIndex: number): void
\`\`\`

### toggleSectionVisibility

Show/hide a section.

\`\`\`typescript
toggleSectionVisibility(sectionId: string): void
\`\`\`

### updateElementValue

Update a nested value using dot-path notation.

\`\`\`typescript
updateElementValue(sectionId: string, elementPath: string, value: any): void
\`\`\`

\`\`\`typescript
// Update a specific array item
updateElementValue('section-123', 'features.0.title', 'Updated Title');

// Update nested property
updateElementValue('section-123', 'cta.button.text', 'Click Me');
\`\`\`

### setTranslationKey

Link a property to a translation key.

\`\`\`typescript
setTranslationKey(sectionId: string, propPath: string, translationKey: string): void
\`\`\`

### removeTranslationKey

Unlink a translation key from a property.

\`\`\`typescript
removeTranslationKey(sectionId: string, propPath: string): void
\`\`\`

---

## Grid Actions

### setSectionGrid

Set the grid layout for a section.

\`\`\`typescript
setSectionGrid(sectionId: string, grid: SectionGrid): void
\`\`\`

### addColumn

Add a column to a section.

\`\`\`typescript
addColumn(sectionId: string, column: GridColumn, index?: number): void
\`\`\`

### removeColumn

Remove a column from a section.

\`\`\`typescript
removeColumn(sectionId: string, columnId: string): void
\`\`\`

### updateColumnWidth

Update column width.

\`\`\`typescript
updateColumnWidth(sectionId: string, columnId: string, width: ResponsiveWidth): void
\`\`\`

### addWidgetToColumn

Add a widget to a column.

\`\`\`typescript
addWidgetToColumn(
  sectionId: string,
  columnId: string,
  widget: GridWidget,
  index?: number
): void
\`\`\`

### removeWidget

Remove a widget from a column.

\`\`\`typescript
removeWidget(sectionId: string, columnId: string, widgetIndex: number): void
\`\`\`

### moveWidgetBetweenColumns

Move a widget to a different column.

\`\`\`typescript
moveWidgetBetweenColumns(
  sectionId: string,
  sourceColumnId: string,
  sourceIndex: number,
  destColumnId: string,
  destIndex: number
): void
\`\`\`

---

## Selection Actions

### selectSection

Select a section.

\`\`\`typescript
selectSection(sectionId: string | null): void
\`\`\`

### selectColumn

Select a column within a section.

\`\`\`typescript
selectColumn(sectionId: string, columnId: string): void
\`\`\`

### selectElement

Select an element within a section.

\`\`\`typescript
selectElement(sectionId: string, elementPath: string): void
\`\`\`

### clearSelection

Clear all selection.

\`\`\`typescript
clearSelection(): void
\`\`\`

### startInlineEdit / stopInlineEdit

Toggle inline editing mode.

\`\`\`typescript
startInlineEdit(): void
stopInlineEdit(): void
\`\`\`

---

## History Actions

### undo

Revert to previous state.

\`\`\`typescript
undo(): void
\`\`\`

### redo

Reapply undone state.

\`\`\`typescript
redo(): void
\`\`\`

### pushHistory

Manually save state to history.

\`\`\`typescript
pushHistory(): void
\`\`\`

> 💡 Most actions automatically push to history. Only use \`pushHistory()\` for custom operations.

---

## UI Actions

### setDeviceMode

Change device preview.

\`\`\`typescript
setDeviceMode(mode: 'desktop' | 'tablet' | 'mobile'): void
\`\`\`

### setActiveTab

Change left panel tab.

\`\`\`typescript
setActiveTab(tab: 'sections' | 'blocks'): void
\`\`\`

### setEditorMode

Change editor interaction mode.

\`\`\`typescript
setEditorMode(mode: EditorMode): void

type EditorMode = 'idle' | 'selecting' | 'dragging' | 'resizing' | 'inline-editing';
\`\`\`

### Drag Operations

\`\`\`typescript
startDrag(context: DragContext): void
endDrag(): void
setDropTarget(target: DropTarget | null): void
\`\`\`

### Resize Operations

\`\`\`typescript
startResize(context: ResizeContext): void
endResize(): void
\`\`\`

---

## Status Actions

### setLoading / setSaving

Update loading/saving state.

\`\`\`typescript
setLoading(isLoading: boolean): void
setSaving(isSaving: boolean): void
\`\`\`

### markSaved

Mark document as saved.

\`\`\`typescript
markSaved(): void
\`\`\`

### setHasUnsavedChanges

Set dirty state.

\`\`\`typescript
setHasUnsavedChanges(hasChanges: boolean): void
\`\`\`

---

## Custom Hooks

### useAutosave

Manage autosave behavior.

\`\`\`typescript
import { useAutosave } from '@/hooks/queries/useAutosave';

const {
  save,          // () => Promise<void> - Trigger immediate save
  isSaving,      // boolean - Save in progress
  lastSavedAt,   // string | null - Timestamp
  status,        // AutosaveStatus - 'idle' | 'saving' | 'saved' | 'error'
} = useAutosave(pageId);
\`\`\`

### usePageData

Fetch and cache page data.

\`\`\`typescript
import { usePageData } from '@/hooks/queries/usePageData';

const {
  data,       // PageData | undefined
  isLoading,  // boolean
  error,      // Error | null
  refetch,    // () => void
} = usePageData(pageId);
\`\`\`

### useTranslationEngine

Access translation functionality.

\`\`\`typescript
import { useTranslationEngine } from '@/hooks/useTranslationEngine';

const {
  // Key management
  registerKey,        // (key, sourceText, context) => void
  getKey,             // (key) => TranslationKeyRecord | undefined
  getAllKeys,         // () => TranslationKeyRecord[]
  
  // Translation CRUD
  getTranslation,     // (key, languageCode) => TranslationEntry | undefined
  setTranslation,     // (key, languageCode, value, status) => void
  
  // AI translation
  translateWithAI,    // (key, targetLanguages) => Promise<void>
  
  // Coverage
  getCoverage,        // (languageCode) => TranslationCoverage
  
  // Languages
  languages,          // Language[]
  defaultLanguage,    // string
} = useTranslationEngine();
\`\`\`

### useArrayItems

Drag-and-drop for array items.

\`\`\`typescript
import { useArrayItems } from '@/hooks/useArrayItems';

const {
  items,           // T[] - Current items
  addItem,         // (item) => void
  removeItem,      // (index) => void
  updateItem,      // (index, updates) => void
  moveItem,        // (fromIndex, toIndex) => void
  duplicateItem,   // (index) => void
} = useArrayItems(sectionId, arrayPath, initialItems);
\`\`\`

### useElementBounds

Track element position and size.

\`\`\`typescript
import { useElementBounds } from '@/hooks/useElementBounds';

const {
  ref,      // RefObject<HTMLElement>
  bounds,   // { top, left, width, height, bottom, right }
} = useElementBounds();
\`\`\`

---

## Utility Functions

### Section Utilities

\`\`\`typescript
import {
  getSectionDefinition,
  getAllSectionDefinitions,
  getSectionsByCategory,
  createSectionInstance,
} from '@/lib/sectionUtils';

// Get single definition
const heroDef = getSectionDefinition('hero');

// Get all definitions
const allSections = getAllSectionDefinitions();

// Get by category
const contentSections = getSectionsByCategory('content');

// Create instance with defaults
const newSection = createSectionInstance('hero', { title: 'Custom' });
\`\`\`

### Grid Utilities

\`\`\`typescript
import {
  normalizeSection,
  denormalizeGrid,
  generateWidgetId,
  generateColumnId,
  hasExplicitGrid,
} from '@/lib/gridUtils';

// Normalize section to grid format
const normalized = normalizeSection(section);

// Convert back for saving
const legacyProps = denormalizeGrid(normalized, section.type);

// Generate IDs
const widgetId = generateWidgetId();  // 'widget-xxx'
const columnId = generateColumnId();  // 'col-xxx'
\`\`\`

### Translation Utilities

\`\`\`typescript
import { resolveTranslation } from '@/lib/translationResolver';

// Resolve a value (may be key or plain text)
const displayText = resolveTranslation(
  value,          // The value
  translations,   // Translation dictionary
  fallback        // Fallback if not found
);
\`\`\`

### Class Name Utilities

\`\`\`typescript
import { cn } from '@/lib/utils';

// Merge class names conditionally
const className = cn(
  'base-class',
  isActive && 'active-class',
  variant === 'dark' ? 'bg-dark' : 'bg-light',
  customClassName
);
\`\`\`

---

## TypeScript Interfaces

### Core Types

\`\`\`typescript
// Page data structure
interface PageData {
  id: string;
  pageTitle: string;
  pageUrl: string;
  sections: SectionInstance[];
  content?: string;
  hiddenSections?: string[];
  metadata?: PageMetadata;
  version?: number;
}

// Section instance
interface SectionInstance {
  id: string;
  type: SectionType;
  props: Record<string, any>;
  order: number;
  visible: boolean;
  translationKeys?: TranslationKeyMap;
  grid?: SectionGrid;
  style?: SectionStyleProps;
}

// Selection state
interface ElementSelection {
  type: 'none' | 'section' | 'column' | 'element';
  sectionId: string | null;
  columnId: string | null;
  elementPath: string | null;
  isInlineEditing: boolean;
  translationKey?: string;
}
\`\`\`

### Grid Types

\`\`\`typescript
interface SectionGrid {
  columns: GridColumn[];
  gap?: string;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: {
    tablet?: { columns: number };
    mobile?: { columns: number };
  };
}

interface GridColumn {
  id: string;
  width: ResponsiveWidth;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  gap?: string;
  widgets: GridWidget[];
}

interface GridWidget {
  id: string;
  type: GridWidgetType;
  props: Record<string, any>;
  sourcePath?: string;
}

interface ResponsiveWidth {
  desktop: string;
  tablet?: string;
  mobile?: string;
}
\`\`\`

### Style Types

\`\`\`typescript
interface SectionStyleProps {
  background?: BackgroundStyle;
  padding?: ResponsiveSpacing;
  margin?: ResponsiveSpacing;
  containerWidth?: 'narrow' | 'default' | 'wide' | 'full';
  zIndex?: number;
  visibility?: DeviceVisibility;
  border?: BorderStyle;
  shadow?: ShadowPreset;
}

interface BackgroundStyle {
  type: 'solid' | 'gradient' | 'image' | 'transparent';
  color?: string;
  gradient?: GradientStyle;
  image?: BackgroundImageStyle;
}

type ShadowPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
\`\`\`

---

## Next Steps

- **[Best Practices](/admin/documentation/developer/best-practices)** — Coding standards
- **[Creating Sections](/admin/documentation/developer/sections)** — Build custom sections
  `
};

const bestPracticesGuide: DocArticle = {
  title: 'Best Practices',
  description: 'Guidelines for efficient, maintainable, and secure development',
  category: 'developer',
  slug: 'best-practices',
  order: 4,
  tags: ['best practices', 'guidelines', 'patterns', 'optimization', 'security', 'testing'],
  lastUpdated: '2025-01-15',
  content: `
# Best Practices

Follow these guidelines to write maintainable, performant, and secure code for the page builder.

---

## The 10 Architecture Rules

### 1. Single Source of Truth

All section data must live in the Zustand store. Never duplicate in component state.

\`\`\`typescript
// ✅ Good: Read from store
const title = useEditorStore(state => 
  state.pageData?.sections.find(s => s.id === id)?.props.title
);

// ❌ Bad: Duplicate in local state
const [title, setTitle] = useState(section.props.title);
\`\`\`

### 2. Immutable Updates

Never mutate state directly. Always create new objects.

\`\`\`typescript
// ✅ Good: Spread operator creates new object
updateSectionProps(id, { 
  ...section.props, 
  title: 'New Title' 
});

// ❌ Bad: Direct mutation breaks React/Zustand
section.props.title = 'New Title';
\`\`\`

### 3. Use Selectors

Always use selectors to prevent unnecessary re-renders.

\`\`\`typescript
// ✅ Good: Only re-renders when this specific value changes
const title = useEditorStore(state => 
  state.pageData?.sections[0]?.props.title
);

// ❌ Bad: Re-renders on ANY store change
const store = useEditorStore();
const title = store.pageData?.sections[0]?.props.title;
\`\`\`

### 4. Type Everything

All props, state, and function parameters must have TypeScript types.

\`\`\`typescript
// ✅ Good: Explicit interface
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  link 
}) => { /* ... */ };

// ❌ Bad: Implicit any
const FeatureCard = ({ icon, title, description, link }) => { /* ... */ };
\`\`\`

### 5. Provide Default Values

All optional props must have sensible defaults.

\`\`\`typescript
// ✅ Good: Defaults for optional props
const { 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  items = [],
} = props;

// ❌ Bad: No defaults - leads to undefined errors
const { variant, size, disabled, items } = props;
\`\`\`

### 6. Handle Loading & Error States

Every async operation needs proper state handling.

\`\`\`typescript
// ✅ Good: Handle all states
if (isLoading) return <Skeleton className="h-32" />;
if (error) return <ErrorMessage message={error.message} />;
if (!data) return <EmptyState />;
return <Content data={data} />;

// ❌ Bad: Assumes data exists
return <Content data={data} />;
\`\`\`

### 7. Use Consistent Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | \`HeroSection\`, \`FeatureCard\` |
| Files (components) | PascalCase | \`HeroSection.tsx\` |
| Files (definitions) | kebab-case | \`hero.ts\`, \`stats-counter.ts\` |
| Hooks | camelCase with \`use\` | \`usePageData\`, \`useAutosave\` |
| Utilities | camelCase | \`getSectionDefinition\` |
| Constants | SCREAMING_SNAKE_CASE | \`DEFAULT_PADDING\`, \`MAX_SECTIONS\` |
| Types/Interfaces | PascalCase | \`SectionProps\`, \`PageData\` |
| Section types | kebab-case | \`'hero'\`, \`'stats-counter'\` |

### 8. Keep Components Focused

Each component should do one thing well. If over 200 lines, split it.

### 9. Document Complex Logic

Explain WHY, not WHAT. Code shows what; comments explain why.

\`\`\`typescript
// ✅ Good: Explains the reasoning
// Use requestAnimationFrame to batch DOM measurements 
// and prevent layout thrashing during drag operations
requestAnimationFrame(() => updateBounds(newRect));

// ❌ Bad: States the obvious
// Update bounds with new rect
updateBounds(newRect);
\`\`\`

### 10. Test Critical Paths

Write tests for:
- Section rendering with various props
- Store actions (add, update, delete)
- User interactions (click, drag, type)
- Edge cases (empty arrays, missing data)

---

## Performance Best Practices

### Memoize Expensive Computations

\`\`\`typescript
// ✅ Good: Memoized - only recalculates when items change
const sortedItems = useMemo(() => 
  items.sort((a, b) => a.order - b.order),
  [items]
);

// ❌ Bad: Recalculates every render
const sortedItems = items.sort((a, b) => a.order - b.order);
\`\`\`

### Memoize Callbacks

\`\`\`typescript
// ✅ Good: Stable callback reference
const handleClick = useCallback((id: string) => {
  selectSection(id);
}, [selectSection]);

// ❌ Bad: New function every render - breaks memo
const handleClick = (id: string) => {
  selectSection(id);
};
\`\`\`

### Use React.memo for Pure Components

\`\`\`typescript
// ✅ Good: Prevents re-renders if props unchanged
const FeatureCard = React.memo(({ title, description, icon }) => (
  <div className="p-4 border rounded-lg">
    <Icon name={icon} />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));
\`\`\`

### Virtualize Long Lists

For lists with 50+ items:

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => containerRef.current,
  estimateSize: () => 50,
});
\`\`\`

### Lazy Load Heavy Components

\`\`\`typescript
const CodeEditor = React.lazy(() => 
  import('@monaco-editor/react')
);

// Use with Suspense
<Suspense fallback={<Skeleton />}>
  <CodeEditor />
</Suspense>
\`\`\`

---

## Translation Best Practices

### Define All Translatable Props

\`\`\`typescript
translatableProps: [
  'badge', 'title', 'subtitle',           // Header text
  'buttonText', 'buttonUrl',               // CTAs
  'features.*.title',                      // Array item titles
  'features.*.description',                // Array item descriptions
  'features.*.highlights.*.text',          // Nested arrays
]
\`\`\`

### Use Semantic Key Names

\`\`\`typescript
// ✅ Good: Semantic, hierarchical keys
'homepage.hero.title'
'homepage.hero.cta_button'
'pricing.plan_starter.name'

// ❌ Bad: Generic or unclear
'text1'
'button'
'title'
\`\`\`

### Handle Missing Translations

\`\`\`typescript
// ✅ Good: Fallback chain
const displayText = 
  getTranslation(key, currentLanguage) ||
  getTranslation(key, defaultLanguage) ||
  originalValue;

// ❌ Bad: No fallback
const displayText = getTranslation(key, currentLanguage);
\`\`\`

---

## Security Best Practices

### Sanitize User Input

Never render user input directly as HTML.

\`\`\`typescript
// ✅ Good: React escapes by default
return <p>{userInput}</p>;

// ⚠️ Careful: Sanitize if using dangerouslySetInnerHTML
import DOMPurify from 'dompurify';
return <div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(html) 
}} />;

// ❌ Bad: XSS vulnerability
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
\`\`\`

### Validate File Uploads

\`\`\`typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function validateFile(file: File): boolean {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large (max 5MB)');
  }
  return true;
}
\`\`\`

### Use Environment Variables

Never hardcode secrets or API keys.

\`\`\`typescript
// ✅ Good: Use environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// ❌ Bad: Hardcoded secret
const apiKey = 'sk_live_xxxxx';
\`\`\`

---

## Accessibility Guidelines

### Semantic HTML

\`\`\`typescript
// ✅ Good: Semantic elements
<article>
  <header>
    <h2>{title}</h2>
  </header>
  <main>{content}</main>
  <footer>{author}</footer>
</article>

// ❌ Bad: Div soup
<div className="article">
  <div className="header">
    <div className="title">{title}</div>
  </div>
  <div className="main">{content}</div>
</div>
\`\`\`

### Keyboard Navigation

\`\`\`typescript
// ✅ Good: Keyboard accessible
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  aria-label="Delete section"
>
  <TrashIcon />
</button>
\`\`\`

### Color Contrast

| Element | Minimum Contrast |
|---------|------------------|
| Normal text | 4.5:1 |
| Large text (18px+) | 3:1 |
| UI components | 3:1 |

### Alt Text for Images

\`\`\`typescript
// ✅ Good: Descriptive alt text
<img 
  src={author.photo} 
  alt={\`Photo of \${author.name}, \${author.title} at \${author.company}\`}
/>

// ✅ Good: Decorative image
<img src={decorativeBg} alt="" role="presentation" />

// ❌ Bad: Non-descriptive
<img src={author.photo} alt="photo" />
\`\`\`

---

## Code Organization

### File Structure for Sections

\`\`\`
src/
├── lib/sections/definitions/
│   └── my-section.ts
├── components/landing/
│   └── MySectionSection.tsx
└── components/admin/sections/
    └── MySectionSettingsContent.tsx
\`\`\`

### Import Order

\`\`\`typescript
// 1. React and external libraries
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Internal utilities, hooks, and stores
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/stores/editorStore';
import { useAutosave } from '@/hooks/queries/useAutosave';

// 3. Components
import { Button } from '@/components/ui/button';
import { SectionContainer, SectionHeader } from '../shared';

// 4. Types (use import type for type-only imports)
import type { SectionProps, FeatureItem } from '@/types';
\`\`\`

---

## Common Anti-Patterns

### ❌ Prop Drilling

\`\`\`typescript
// Bad: Passing through many levels
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <UserMenu user={user} />
    </Sidebar>
  </Layout>
</App>

// Good: Use store or context
const user = useUserStore(state => state.user);
\`\`\`

### ❌ God Components

\`\`\`typescript
// Bad: 500+ line component
const PageEditor = () => {
  // 200 lines of state
  // 150 lines of handlers
  // 150 lines of JSX
};

// Good: Split into focused components
const PageEditor = () => (
  <EditorProvider>
    <EditorToolbar />
    <EditorCanvas />
    <SettingsPanel />
  </EditorProvider>
);
\`\`\`

### ❌ Magic Strings

\`\`\`typescript
// Bad: Repeated string literals
if (section.type === 'hero') { /* ... */ }
if (section.type === 'hero') { /* ... */ }

// Good: Use constants or types
const SECTION_TYPES = {
  HERO: 'hero',
  FEATURES: 'features',
} as const;

if (section.type === SECTION_TYPES.HERO) { /* ... */ }
\`\`\`

---

## Testing Guidelines

### Component Tests

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('HeroSection', () => {
  it('renders title and subtitle', () => {
    render(
      <HeroSection 
        title="Welcome" 
        subtitle="Hello world" 
      />
    );
    
    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('calls onButtonClick when CTA clicked', async () => {
    const handleClick = vi.fn();
    render(
      <HeroSection 
        title="Welcome"
        buttonText="Get Started"
        onButtonClick={handleClick}
      />
    );
    
    await userEvent.click(screen.getByRole('button', { name: /get started/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
\`\`\`

### Store Tests

\`\`\`typescript
import { useEditorStore } from '@/stores/editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.setState({ pageData: null, selectedSectionId: null });
  });

  it('adds section correctly', () => {
    const store = useEditorStore.getState();
    store.initializeEditor('page-1', { id: 'page-1', sections: [] });
    store.addSection('hero');
    
    expect(store.pageData?.sections).toHaveLength(1);
    expect(store.pageData?.sections[0].type).toBe('hero');
  });

  it('maintains history on updates', () => {
    const store = useEditorStore.getState();
    store.initializeEditor('page-1', { id: 'page-1', sections: [] });
    store.addSection('hero');
    
    expect(store.history.length).toBeGreaterThan(0);
    expect(useEditorStore.getState().canUndo).toBe(true);
  });
});
\`\`\`

---

## Pre-Commit Checklist

- [ ] TypeScript compiles without errors (\`tsc --noEmit\`)
- [ ] No console errors or warnings
- [ ] Components handle loading/error states
- [ ] Responsive design tested (desktop, tablet, mobile)
- [ ] Accessibility checked (keyboard nav, alt text, contrast)
- [ ] Tests written for new functionality
- [ ] Code follows naming conventions
- [ ] No hardcoded strings (use constants)
- [ ] Performance considered (memoization where needed)
- [ ] Security reviewed (no XSS, validated inputs)
- [ ] All translations defined
  `
};

// ============================================================================
// NEW DEVELOPER ARTICLES
// ============================================================================

const gridSystemGuide: DocArticle = {
  title: 'Grid System Guide',
  description: 'Deep dive into the Elementor-style 3-level grid system for advanced layouts',
  category: 'developer',
  slug: 'grid',
  order: 5,
  tags: ['grid', 'columns', 'widgets', 'layout', 'responsive', 'drag-drop'],
  lastUpdated: '2025-01-15',
  content: `
# Grid System Guide

The page builder uses an Elementor-style 3-level grid system that provides predictable layouts and intuitive drag-and-drop behavior. This guide covers the complete grid architecture, data model, and implementation patterns.

---

## Understanding the Hierarchy

The grid follows a strict **Section → Column → Widget** hierarchy:

\`\`\`mermaid
flowchart TD
    A[Section<br/>Container] --> B[Column 1]
    A --> C[Column 2]
    A --> D[Column N...]
    B --> E[Widget 1]
    B --> F[Widget 2]
    C --> G[Widget 3]
    C --> H[Widget 4]
    D --> I[Widget 5]
\`\`\`

### Why This Hierarchy?

| Level | Responsibility | Example |
|-------|---------------|---------|
| **Section** | Full-width container, background, spacing | Hero, Features, Pricing |
| **Column** | Width control, responsive breakpoints | 33%/33%/33% or 50%/50% |
| **Widget** | Individual content item | Feature card, testimonial, FAQ item |

This provides:
- **Predictable drag-and-drop** — Widgets stay within columns
- **Responsive layouts** — Columns can have per-device widths
- **Consistent styling** — Each level has clear styling boundaries
- **Simpler mental model** — Users understand the structure

---

## Grid Data Model

### SectionGrid Interface

\`\`\`typescript
interface SectionGrid {
  columns: GridColumn[];
  gap?: string;                    // e.g., "1rem", "24px"
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: {
    tablet?: { columns: number };  // Stack columns on tablet
    mobile?: { columns: number };  // Stack columns on mobile
  };
}
\`\`\`

### GridColumn Interface

\`\`\`typescript
interface GridColumn {
  id: string;                      // Unique ID (e.g., "col-abc123")
  width: ResponsiveWidth;          // Width per device
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  gap?: string;                    // Gap between widgets
  widgets: GridWidget[];           // Content units
}

interface ResponsiveWidth {
  desktop: string;    // e.g., "33.33%", "1fr", "300px"
  tablet?: string;    // Falls back to desktop if not set
  mobile?: string;    // Falls back to tablet if not set
}
\`\`\`

### GridWidget Interface

\`\`\`typescript
interface GridWidget {
  id: string;                      // Unique ID (e.g., "widget-xyz789")
  type: GridWidgetType;            // Widget type identifier
  props: Record<string, any>;      // Widget-specific properties
  sourcePath?: string;             // Back-reference for denormalization
}
\`\`\`

---

## Widget Types Reference

The system supports 27+ widget types:

### Content Widgets

| Type | Source Section | Properties |
|------|---------------|------------|
| \`feature-card\` | Features | icon, title, description, highlights[] |
| \`icon-feature-card\` | Icon Features | icon, title, description |
| \`testimonial-card\` | Testimonials | name, role, avatar, rating, text |
| \`stat-card\` | Stats Counter | value, label, suffix, icon |
| \`step-card\` | Steps | number, title, description, icon |
| \`faq-item\` | FAQ | question, answer |

### Commerce Widgets

| Type | Source Section | Properties |
|------|---------------|------------|
| \`pricing-plan-card\` | Pricing | name, price, features[], isHighlighted |
| \`service-card\` | Hosting Services | name, icon, description, price |
| \`spec-row\` | Server Specs | name, value |

### People & Places

| Type | Source Section | Properties |
|------|---------------|------------|
| \`team-member-card\` | Team Members | name, role, image, bio, social[] |
| \`job-card\` | Careers | title, department, location, type |
| \`location-card\` | Data Center | name, flag, specs[] |

### Media & Branding

| Type | Source Section | Properties |
|------|---------------|------------|
| \`blog-post-card\` | Blog Grid | title, excerpt, image, date, category |
| \`logo-item\` | Logo Carousel | name, image |
| \`company-logo\` | Trusted By | name, logo |
| \`award-card\` | Awards | title, organization, year |

### Interactive

| Type | Source Section | Properties |
|------|---------------|------------|
| \`contact-channel\` | Contact | icon, type, title, description, value |
| \`need-help-option\` | Need Help | title, description, icon, action |
| \`os-option\` | OS Selector | os, icon, downloadUrl |

---

## Grid Normalization

Existing section data is automatically converted to grid format at runtime using the normalization system.

### How It Works

\`\`\`typescript
import { normalizeSection, denormalizeGrid } from '@/lib/gridNormalizer';

// 1. Normalize a section for grid editing
const normalized = normalizeSection(section);
// Returns: {
//   id: string,
//   type: SectionType,
//   grid: SectionGrid,
//   headerProps: { badge, title, subtitle },
//   originalProps: Record<string, any>,
//   isNormalized: boolean
// }

// 2. Convert back for saving
const legacyProps = denormalizeGrid(normalized, section.type);
\`\`\`

### Example: Features Section

**Original props:**
\`\`\`typescript
{
  badge: 'Features',
  title: 'Why Choose Us',
  features: [
    { icon: 'Star', title: 'Fast', description: '...' },
    { icon: 'Shield', title: 'Secure', description: '...' },
  ]
}
\`\`\`

**Normalized grid:**
\`\`\`typescript
{
  columns: [
    {
      id: 'col-1',
      width: { desktop: '50%' },
      widgets: [
        { id: 'w-1', type: 'feature-card', props: { icon: 'Star', title: 'Fast', ... } }
      ]
    },
    {
      id: 'col-2',
      width: { desktop: '50%' },
      widgets: [
        { id: 'w-2', type: 'feature-card', props: { icon: 'Shield', title: 'Secure', ... } }
      ]
    }
  ]
}
\`\`\`

---

## Store Actions for Grid

### Column Operations

\`\`\`typescript
// Add a column
addColumn(sectionId: string, column: GridColumn, index?: number): void

// Remove a column
removeColumn(sectionId: string, columnId: string): void

// Reorder columns
reorderColumn(sectionId: string, sourceIndex: number, destIndex: number): void

// Resize a column
updateColumnWidth(sectionId: string, columnId: string, width: ResponsiveWidth): void
\`\`\`

### Widget Operations

\`\`\`typescript
// Add widget to column
addWidgetToColumn(
  sectionId: string,
  columnId: string,
  widget: GridWidget,
  index?: number
): void

// Remove widget
removeWidget(sectionId: string, columnId: string, widgetIndex: number): void

// Move widget between columns
moveWidgetBetweenColumns(
  sectionId: string,
  sourceColumnId: string,
  sourceIndex: number,
  destColumnId: string,
  destIndex: number
): void
\`\`\`

---

## Column Resizing

Columns can be resized by dragging the resize handles between them.

### Resize Logic

1. User drags the resize handle
2. Calculate new width based on mouse position
3. Ensure minimum width (10%) and maximum width (90%)
4. Update both affected columns proportionally
5. Trigger store action with new ResponsiveWidth

### Implementation Pattern

\`\`\`typescript
// In ColumnResizeHandle component
const handleResize = useCallback((deltaX: number) => {
  const containerWidth = containerRef.current?.offsetWidth || 0;
  const deltaPercent = (deltaX / containerWidth) * 100;
  
  // Calculate new widths
  const leftNewWidth = Math.max(10, Math.min(90, leftWidth + deltaPercent));
  const rightNewWidth = 100 - leftNewWidth;
  
  // Update store
  updateColumnWidth(sectionId, leftColumnId, { desktop: \`\${leftNewWidth}%\` });
  updateColumnWidth(sectionId, rightColumnId, { desktop: \`\${rightNewWidth}%\` });
}, [leftWidth, sectionId, leftColumnId, rightColumnId]);
\`\`\`

---

## Drag and Drop

The grid system uses @dnd-kit for drag and drop operations.

### Widget DnD

\`\`\`typescript
// Widgets can be:
// 1. Reordered within a column
// 2. Moved to a different column
// 3. Moved to a different section (if compatible)

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (!over) return;
  
  const sourceWidget = active.data.current;
  const targetColumn = over.data.current;
  
  if (sourceWidget.columnId === targetColumn.columnId) {
    // Reorder within column
    reorderWidgetsInColumn(sectionId, columnId, oldIndex, newIndex);
  } else {
    // Move between columns
    moveWidgetBetweenColumns(
      sectionId,
      sourceWidget.columnId, sourceWidget.index,
      targetColumn.columnId, targetColumn.index
    );
  }
};
\`\`\`

### Drop Indicators

Visual indicators show where widgets will drop:

- **Blue line** — Drop position between widgets
- **Blue highlight** — Drop target column
- **Ghost widget** — Preview of widget being dragged

---

## Responsive Behavior

### Per-Device Widths

Columns can have different widths on each device:

\`\`\`typescript
const column: GridColumn = {
  id: 'col-1',
  width: {
    desktop: '33.33%',  // 3-column layout
    tablet: '50%',      // 2-column layout
    mobile: '100%',     // Stack vertically
  },
  widgets: [...]
};
\`\`\`

### Column Stacking

The \`responsive\` property on SectionGrid controls stacking:

\`\`\`typescript
const grid: SectionGrid = {
  columns: [...],
  responsive: {
    tablet: { columns: 2 },  // Max 2 columns on tablet
    mobile: { columns: 1 },  // Stack all on mobile
  }
};
\`\`\`

---

## Grid Components

### GridSection

Container component that renders the grid structure:

\`\`\`tsx
<GridSection
  sectionId={section.id}
  grid={section.grid}
  headerProps={headerProps}
  isSelected={isSelected}
/>
\`\`\`

### GridColumn

Renders a single column with its widgets:

\`\`\`tsx
<GridColumn
  sectionId={sectionId}
  column={column}
  isSelected={selectedColumnId === column.id}
  onSelect={() => selectColumn(sectionId, column.id)}
/>
\`\`\`

### GridWidget

Renders individual widgets with selection overlay:

\`\`\`tsx
<GridWidget
  sectionId={sectionId}
  columnId={columnId}
  widget={widget}
  index={index}
/>
\`\`\`

### ColumnResizeHandle

Interactive resize handle between columns:

\`\`\`tsx
<ColumnResizeHandle
  sectionId={sectionId}
  leftColumnId={columns[i].id}
  rightColumnId={columns[i + 1].id}
  onResize={handleResize}
/>
\`\`\`

---

## Best Practices

### 1. Preserve Widget IDs

When duplicating or moving widgets, generate new IDs:

\`\`\`typescript
const duplicateWidget = (widget: GridWidget): GridWidget => ({
  ...widget,
  id: generateWidgetId(),  // New ID!
  props: { ...widget.props },
});
\`\`\`

### 2. Validate Grid Structure

Before saving, ensure grid integrity:

\`\`\`typescript
function validateGrid(grid: SectionGrid): boolean {
  return grid.columns.every(col => 
    col.id && 
    col.width?.desktop && 
    Array.isArray(col.widgets)
  );
}
\`\`\`

### 3. Handle Empty Columns

Allow empty columns for flexible layouts:

\`\`\`tsx
{column.widgets.length === 0 ? (
  <EmptyColumnPlaceholder 
    onAddWidget={() => openWidgetPicker(column.id)} 
  />
) : (
  column.widgets.map(widget => <GridWidget ... />)
)}
\`\`\`

---

## Troubleshooting

### "Widgets not appearing"

1. Check if \`grid\` property exists on section
2. Verify widget \`type\` is registered in widget registry
3. Check console for rendering errors

### "Drag and drop not working"

1. Ensure DndContext wraps the grid components
2. Check that \`useDraggable\` and \`useDroppable\` hooks are correct
3. Verify event handlers are attached

### "Column widths not updating"

1. Check if width is in correct format (percentage or CSS value)
2. Verify the store action is being called
3. Check for CSS conflicts

---

## Next Steps

- **[API Reference](/admin/documentation/developer/api)** — Complete grid API documentation
- **[Creating Sections](/admin/documentation/developer/sections)** — Add grid support to sections
  `
};

const translationEngineGuide: DocArticle = {
  title: 'Translation Engine Guide',
  description: 'Complete guide to the multi-language translation system with AI support',
  category: 'developer',
  slug: 'translations',
  order: 6,
  tags: ['translation', 'i18n', 'localization', 'multilingual', 'AI translation'],
  lastUpdated: '2025-01-15',
  content: `
# Translation Engine Guide

The page builder includes a powerful translation system that supports multiple languages, AI-powered translation, and seamless integration with the editing experience. This guide covers the complete translation architecture and implementation patterns.

---

## Translation Architecture

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Translation Key** | Unique identifier linking content across languages |
| **Source Text** | The original text in the default language |
| **Translation** | The translated text in a target language |
| **Coverage** | Percentage of keys with translations |
| **Namespace** | Grouping for translation keys (usually page-based) |

### Database Tables

\`\`\`mermaid
erDiagram
    PAGES ||--o{ TRANSLATION_KEYS : contains
    TRANSLATION_KEYS ||--o{ TRANSLATIONS : "has translations"
    LANGUAGES ||--o{ TRANSLATIONS : "provides"
    
    TRANSLATION_KEYS {
        uuid id PK
        string key UK
        string source_text
        string source_language
        uuid page_id FK
        string section_id
        string section_type
        string prop_path
        string context
        boolean is_active
    }
    
    TRANSLATIONS {
        uuid id PK
        string key FK
        uuid language_id FK
        string value
        string status
        string ai_provider
        timestamp ai_translated_at
        timestamp manually_edited_at
        integer version
    }
    
    LANGUAGES {
        uuid id PK
        string code UK
        string name
        string native_name
        boolean is_default
        boolean is_active
        string direction
    }
\`\`\`

---

## useTranslationEngine Hook

The primary hook for translation operations:

\`\`\`typescript
import { useTranslationEngine } from '@/hooks/useTranslationEngine';

const {
  // Key management
  registerKey,        // Create/update translation key
  getKey,             // Get key by ID
  getAllKeys,         // Get all keys
  deleteKey,          // Remove a key
  
  // Translation CRUD
  getTranslation,     // Get translation for key+language
  setTranslation,     // Create/update translation
  deleteTranslation,  // Remove translation
  
  // Bulk operations
  getTranslationsForSection,  // All translations for a section
  getUntranslatedKeys,        // Keys missing translations
  
  // AI translation
  translateWithAI,    // AI translate key(s)
  batchTranslate,     // Batch AI translation
  
  // Coverage
  getCoverage,        // Coverage stats for language
  getTotalCoverage,   // Overall coverage stats
  
  // Languages
  languages,          // Available languages[]
  defaultLanguage,    // Default language code
  currentLanguage,    // Currently active language
} = useTranslationEngine();
\`\`\`

---

## Registering Translation Keys

### Key Format

Keys follow a hierarchical naming convention:

\`\`\`
{namespace}.{section_type}.{section_id_short}.{prop_path}
\`\`\`

Examples:
- \`homepage.hero.abc123.title\`
- \`pricing.features.def456.items.0.title\`
- \`contact.faq.ghi789.faqs.2.answer\`

### Registration

\`\`\`typescript
// Register a new translation key
registerKey({
  key: 'homepage.hero.abc123.title',
  sourceText: 'Welcome to Our Platform',
  sourceLanguage: 'en',
  context: 'Main hero headline',
  pageId: 'page-uuid',
  sectionId: 'section-uuid',
  sectionType: 'hero',
  propPath: 'title',
});
\`\`\`

### Auto-Generation

The \`useAutoKeyGeneration\` hook generates keys automatically:

\`\`\`typescript
import { useAutoKeyGeneration } from '@/hooks/useAutoKeyGeneration';

const { generateKey } = useAutoKeyGeneration();

// Auto-generate based on context
const key = generateKey({
  pageUrl: '/pricing',
  sectionType: 'features',
  sectionId: 'abc123',
  propPath: 'items.0.title',
});
// Returns: "pricing.features.abc123.items_0_title"
\`\`\`

---

## Translation Key Mapping

Sections store their translation key bindings in \`translationKeys\`:

\`\`\`typescript
interface SectionInstance {
  id: string;
  type: SectionType;
  props: Record<string, any>;
  translationKeys?: TranslationKeyMap;  // Key bindings
}

// TranslationKeyMap structure
type TranslationKeyMap = Record<string, string>;
// Example:
{
  'title': 'homepage.hero.abc123.title',
  'subtitle': 'homepage.hero.abc123.subtitle',
  'features.0.title': 'homepage.hero.abc123.features_0_title',
  'features.1.title': 'homepage.hero.abc123.features_1_title',
}
\`\`\`

### Setting Translation Keys

\`\`\`typescript
// Via store action
const setTranslationKey = useEditorStore(state => state.setTranslationKey);

setTranslationKey(sectionId, 'title', 'homepage.hero.abc123.title');
setTranslationKey(sectionId, 'features.0.title', 'homepage.hero.abc123.features_0_title');
\`\`\`

---

## AI Translation

### Single Key Translation

\`\`\`typescript
const { translateWithAI } = useTranslationEngine();

await translateWithAI({
  key: 'homepage.hero.abc123.title',
  sourceText: 'Welcome to Our Platform',
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr', 'de'],
});
\`\`\`

### Batch Translation

\`\`\`typescript
await batchTranslate({
  pageId: 'page-uuid',
  targetLanguages: ['es', 'fr'],
  onProgress: (completed, total) => {
    console.log(\`\${completed}/\${total} translations complete\`);
  },
});
\`\`\`

### Translation Status

| Status | Meaning |
|--------|---------|
| \`untranslated\` | No translation exists |
| \`ai_translated\` | AI-generated, not reviewed |
| \`reviewed\` | Reviewed by human |
| \`edited\` | Manually edited after AI |

---

## Live Translation Resolution

### Editor Mode

In the editor, use \`useEditorTranslations\`:

\`\`\`typescript
import { useEditorTranslations } from '@/hooks/useEditorTranslations';

const { resolveTranslatedProps } = useEditorTranslations();

// Get section props with translations applied
const translatedProps = resolveTranslatedProps(section);
\`\`\`

### Public Pages

For live/public pages, use \`useLiveTranslations\`:

\`\`\`typescript
import { useLiveTranslations } from '@/hooks/useLiveTranslations';

const { resolveTranslatedProps, currentLanguage, isDefaultLanguage } = useLiveTranslations();

// Resolve section props for current language
const props = resolveTranslatedProps(section);
\`\`\`

### Resolution Logic

1. Check if prop has a translation key binding
2. Look up translation for current language
3. If found, use translation
4. If not found, fall back to default language
5. If still not found, use original prop value

\`\`\`typescript
function resolveValue(section, propPath, currentLang, defaultLang) {
  const key = section.translationKeys?.[propPath];
  if (!key) return getNestedValue(section.props, propPath);
  
  const translation = getTranslation(key, currentLang);
  if (translation) return translation;
  
  const defaultTranslation = getTranslation(key, defaultLang);
  if (defaultTranslation) return defaultTranslation;
  
  return getNestedValue(section.props, propPath);
}
\`\`\`

---

## Translation Status Indicators

The \`useTranslationStatus\` hook provides visual status:

\`\`\`typescript
import { useTranslationStatus } from '@/hooks/useTranslationStatus';

const status = useTranslationStatus(sectionId, propPath);
// Returns: {
//   status: 'translated' | 'stale' | 'missing' | 'unbound',
//   tooltip: string
// }
\`\`\`

### Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| \`translated\` | Green | Translation exists and is current |
| \`stale\` | Orange | Source text changed, translation may be outdated |
| \`missing\` | Red | Key bound but no translation for language |
| \`unbound\` | Gray | No translation key assigned |

---

## Coverage Calculation

### Per-Language Coverage

\`\`\`typescript
const coverage = getCoverage('es');
// Returns: {
//   totalKeys: 45,
//   translatedCount: 32,
//   percentage: 71.1,
//   missingKeys: ['homepage.hero.abc123.title', ...]
// }
\`\`\`

### Page-Level Coverage

The \`TranslationCoverageMeter\` component displays coverage:

\`\`\`tsx
<TranslationCoverageMeter
  pageId={pageId}
  showLanguages={true}
  compact={false}
/>
\`\`\`

---

## Translatatable Props Configuration

Each section defines which props support translation:

\`\`\`typescript
registerSection({
  type: 'hero',
  // ...
  translatableProps: [
    'badge',
    'title',
    'highlightedText',
    'subtitle',
    'primaryButtonText',
    'services.*.label',  // Array items
  ],
});
\`\`\`

### Array Notation

- \`items.*\` — All items in array
- \`items.*.title\` — Title of each item
- \`items.*.nested.*.text\` — Nested arrays

---

## Translation Panel UI

The Translation Panel provides the user interface:

\`\`\`tsx
<TranslationPanel
  sectionId={selectedSectionId}
  onClose={() => setShowPanel(false)}
/>
\`\`\`

Features:
- List of translatable props with status
- Bind/unbind translation keys
- Edit translations per language
- Trigger AI translation
- View coverage stats

---

## Best Practices

### 1. Use Semantic Keys

\`\`\`typescript
// ✅ Good
'homepage.hero.main.title'
'pricing.plan_pro.features.0.label'

// ❌ Bad
'text_1'
'heading'
\`\`\`

### 2. Provide Context

\`\`\`typescript
registerKey({
  key: 'homepage.hero.main.cta_button',
  sourceText: 'Get Started',
  context: 'Primary CTA button in hero section, should be action-oriented',
});
\`\`\`

### 3. Handle Fallbacks

\`\`\`typescript
const displayText = 
  getTranslation(key, currentLanguage) ||
  getTranslation(key, defaultLanguage) ||
  originalValue ||
  '[Missing Translation]';
\`\`\`

### 4. Track Source Changes

When source text changes, mark translations as stale:

\`\`\`typescript
async function updateSourceText(key: string, newText: string) {
  await updateTranslationKey(key, { sourceText: newText });
  // Mark all translations as needing review
  await markTranslationsStale(key);
}
\`\`\`

---

## Troubleshooting

### "Translations not showing"

1. Check language is active in languages table
2. Verify translation key binding exists
3. Check translation value is not empty
4. Ensure correct language is selected

### "AI translation failing"

1. Check OPENAI_API_KEY is set
2. Verify source text is not empty
3. Check target language is valid
4. Review edge function logs

### "Coverage not updating"

1. Trigger coverage recalculation
2. Check for orphaned keys
3. Verify page_id is correct

---

## Next Steps

- **[API Reference](/admin/documentation/developer/api)** — Translation API documentation
- **[Best Practices](/admin/documentation/developer/best-practices)** — Translation patterns
  `
};

const realtimeGuide: DocArticle = {
  title: 'Realtime & Collaboration',
  description: 'Guide to realtime updates, page locking, and collaborative editing',
  category: 'developer',
  slug: 'realtime',
  order: 7,
  tags: ['realtime', 'collaboration', 'supabase', 'websockets', 'locking', 'presence'],
  lastUpdated: '2025-01-15',
  content: `
# Realtime & Collaboration Guide

The page builder leverages Supabase Realtime for live updates and collaborative features. This guide covers the realtime architecture, page locking, and user presence systems.

---

## Realtime Architecture

### Supabase Realtime

The system uses Supabase's Realtime feature for:
- **Database changes** — Live updates when data changes
- **Presence** — Track who's online and what they're viewing
- **Broadcast** — Send messages between clients

### Channel Setup

\`\`\`typescript
import { supabase } from '@/integrations/supabase/client';

// Subscribe to page changes
const channel = supabase
  .channel('page-updates')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'pages',
      filter: \`id=eq.\${pageId}\`,
    },
    (payload) => {
      console.log('Page changed:', payload);
      handlePageUpdate(payload);
    }
  )
  .subscribe();
\`\`\`

---

## usePageRealtime Hook

Primary hook for page-level realtime subscriptions:

\`\`\`typescript
import { usePageRealtime } from '@/hooks/queries/usePageRealtime';

const { 
  isSubscribed,
  lastUpdate,
  conflictDetected,
  otherEditors,
} = usePageRealtime(pageId, {
  onExternalUpdate: (payload) => {
    // Handle updates from other users
    refreshPageData();
  },
  onConflict: (localVersion, remoteVersion) => {
    // Handle version conflicts
    showConflictDialog();
  },
});
\`\`\`

### Events Handled

| Event | Description | Handler |
|-------|-------------|---------|
| \`INSERT\` | New section added | Add to local state |
| \`UPDATE\` | Section modified | Merge or flag conflict |
| \`DELETE\` | Section removed | Remove from local state |

---

## Page Locking

To prevent editing conflicts, the system uses page locks.

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Supabase RPC
    participant D as Database
    
    U->>C: Open Page Editor
    C->>S: acquire_page_lock(pageId, userId)
    S->>D: Check existing lock
    alt No lock exists
        D-->>S: Lock available
        S->>D: Create lock record
        S-->>C: {success: true}
        C-->>U: Edit enabled
        loop Every 5 minutes
            C->>S: Refresh lock expiry
        end
    else Lock exists
        D-->>S: Locked by other user
        S-->>C: {success: false, locked_by: "username"}
        C-->>U: Show lock indicator
    end
    
    U->>C: Close Editor
    C->>S: release_page_lock(pageId, userId)
    S->>D: Delete lock record
\`\`\`

### Lock Mechanism

\`\`\`sql
-- page_locks table
CREATE TABLE page_locks (
  id UUID PRIMARY KEY,
  page_id UUID REFERENCES pages(id),
  locked_by UUID NOT NULL,
  locked_by_username TEXT,
  locked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT now() + interval '30 minutes'
);
\`\`\`

### Acquiring a Lock

\`\`\`typescript
const acquireLock = async (pageId: string, userId: string, username: string) => {
  const { data, error } = await supabase
    .rpc('acquire_page_lock', {
      p_page_id: pageId,
      p_user_id: userId,
      p_username: username,
    });
    
  if (data?.success) {
    console.log('Lock acquired');
    startLockHeartbeat(pageId, userId);
  } else {
    console.log('Page locked by:', data?.locked_by_username);
  }
  
  return data;
};
\`\`\`

### Releasing a Lock

\`\`\`typescript
const releaseLock = async (pageId: string, userId: string) => {
  await supabase.rpc('release_page_lock', {
    p_page_id: pageId,
    p_user_id: userId,
  });
};
\`\`\`

### Lock Heartbeat

Locks expire after 30 minutes. Keep them alive with a heartbeat:

\`\`\`typescript
const startLockHeartbeat = (pageId: string, userId: string) => {
  const interval = setInterval(async () => {
    await supabase
      .from('page_locks')
      .update({ expires_at: new Date(Date.now() + 30 * 60000).toISOString() })
      .eq('page_id', pageId)
      .eq('locked_by', userId);
  }, 5 * 60000); // Every 5 minutes
  
  return () => clearInterval(interval);
};
\`\`\`

---

## PageLockIndicator Component

Visual indicator for lock status:

\`\`\`tsx
import { PageLockIndicator } from '@/components/admin/PageLockIndicator';

<PageLockIndicator pageId={pageId} />
\`\`\`

States:
- **Unlocked** — Green, you can edit
- **Locked by you** — Blue, you have the lock
- **Locked by other** — Red, shows who has the lock

---

## User Presence

Track who's viewing or editing pages.

### useUserPresence Hook

\`\`\`typescript
import { useUserPresence } from '@/hooks/useUserPresence';

const { 
  currentUsers,      // Users viewing this page
  setUserStatus,     // Update your status
  broadcastCursor,   // Share cursor position
} = useUserPresence(pageId);

// Update your status
setUserStatus({
  status: 'editing',
  currentSection: selectedSectionId,
});

// Share cursor (for collaborative editing)
broadcastCursor({ x: mouseX, y: mouseY });
\`\`\`

### Presence State

\`\`\`typescript
interface UserPresence {
  id: string;
  username: string;
  avatar?: string;
  status: 'viewing' | 'editing' | 'idle';
  currentSection?: string;
  cursor?: { x: number; y: number };
  lastSeen: string;
}
\`\`\`

---

## Conflict Resolution

When multiple users try to edit, conflicts can occur.

### Detection

\`\`\`typescript
// Track document version
const [localVersion, setLocalVersion] = useState(0);

// On external update
const handleExternalUpdate = (payload) => {
  const remoteVersion = payload.new.version;
  
  if (remoteVersion > localVersion && hasLocalChanges) {
    // Conflict detected
    setConflictState({ local: localData, remote: payload.new });
    showConflictDialog();
  } else {
    // No conflict, apply update
    applyRemoteUpdate(payload.new);
    setLocalVersion(remoteVersion);
  }
};
\`\`\`

### Resolution Strategies

| Strategy | When to Use |
|----------|-------------|
| **Last Write Wins** | Simple, may lose data |
| **User Choice** | Show both versions, let user decide |
| **Merge** | Combine changes (complex) |
| **Lock First** | Prevent conflicts with page locking |

### Conflict Dialog

\`\`\`tsx
<ConflictDialog
  localVersion={localData}
  remoteVersion={remoteData}
  onKeepLocal={() => {
    forceSave(localData);
    dismissConflict();
  }}
  onUseRemote={() => {
    applyRemoteUpdate(remoteData);
    dismissConflict();
  }}
  onMerge={() => {
    openMergeEditor(localData, remoteData);
  }}
/>
\`\`\`

---

## Optimistic Updates

For responsive UX, update local state immediately:

\`\`\`typescript
const updateSection = async (sectionId: string, updates: any) => {
  // 1. Optimistic update
  updateLocalState(sectionId, updates);
  
  try {
    // 2. Persist to database
    await saveSectionToDatabase(sectionId, updates);
  } catch (error) {
    // 3. Rollback on failure
    revertLocalState(sectionId);
    showError('Failed to save changes');
  }
};
\`\`\`

### With React Query

\`\`\`typescript
const mutation = useMutation({
  mutationFn: updateSection,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['page', pageId]);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['page', pageId]);
    
    // Optimistically update
    queryClient.setQueryData(['page', pageId], (old) => ({
      ...old,
      sections: updateSections(old.sections, newData),
    }));
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback
    queryClient.setQueryData(['page', pageId], context.previous);
  },
});
\`\`\`

---

## Best Practices

### 1. Always Release Locks

\`\`\`typescript
// Use cleanup in useEffect
useEffect(() => {
  acquireLock(pageId, userId, username);
  
  return () => {
    releaseLock(pageId, userId);
  };
}, [pageId, userId]);

// Handle page unload
useEffect(() => {
  const handleUnload = () => releaseLock(pageId, userId);
  window.addEventListener('beforeunload', handleUnload);
  return () => window.removeEventListener('beforeunload', handleUnload);
}, []);
\`\`\`

### 2. Handle Network Issues

\`\`\`typescript
// Reconnection logic
channel
  .on('system', { event: 'disconnect' }, () => {
    console.log('Disconnected from realtime');
    setConnectionStatus('disconnected');
  })
  .on('system', { event: 'reconnect' }, () => {
    console.log('Reconnected to realtime');
    setConnectionStatus('connected');
    refreshData();
  });
\`\`\`

### 3. Debounce Presence Updates

\`\`\`typescript
const debouncedCursorBroadcast = useMemo(
  () => debounce((cursor) => broadcastCursor(cursor), 50),
  [broadcastCursor]
);
\`\`\`

---

## Troubleshooting

### "Realtime not connecting"

1. Check Supabase Realtime is enabled
2. Verify WebSocket connections aren't blocked
3. Check authentication status
4. Review browser console for errors

### "Lock not releasing"

1. Verify user ID matches lock owner
2. Check lock hasn't already expired
3. Call release_page_lock RPC manually
4. Check for error in lock release response

### "Missing updates"

1. Verify channel subscription is active
2. Check filter matches the page ID
3. Ensure event types are correct
4. Check for subscription errors

---

## Next Steps

- **[API Reference](/admin/documentation/developer/api)** — Realtime API documentation
- **[Best Practices](/admin/documentation/developer/best-practices)** — Collaboration patterns
  `
};

const advancedHooksGuide: DocArticle = {
  title: 'Advanced Hooks Reference',
  description: 'Complete reference for all custom hooks with usage examples',
  category: 'developer',
  slug: 'hooks',
  order: 8,
  tags: ['hooks', 'react', 'custom hooks', 'state', 'side effects'],
  lastUpdated: '2025-01-15',
  content: `
# Advanced Hooks Reference

This guide provides complete documentation for all custom hooks in the page builder, with detailed usage examples and best practices.

---

## Data Fetching Hooks

### usePageData

Fetch and cache page data with React Query:

\`\`\`typescript
import { usePageData } from '@/hooks/queries/usePageData';

const {
  data,          // PageData | undefined
  isLoading,     // boolean
  isError,       // boolean
  error,         // Error | null
  refetch,       // () => Promise<...>
  isFetching,    // boolean (background refetch)
} = usePageData(pageId);
\`\`\`

**Options:**
\`\`\`typescript
usePageData(pageId, {
  enabled: true,           // Fetch immediately
  staleTime: 5 * 60000,   // Consider fresh for 5 minutes
  refetchOnWindowFocus: true,
});
\`\`\`

### useLanguages

Fetch available languages:

\`\`\`typescript
import { useLanguages } from '@/hooks/queries/useLanguages';

const {
  languages,        // Language[]
  defaultLanguage,  // Language | undefined
  isLoading,
} = useLanguages();
\`\`\`

### useTranslationsQuery

Fetch translations for a page:

\`\`\`typescript
import { useTranslationsQuery } from '@/hooks/queries/useTranslationsQuery';

const {
  translations,     // Translation[]
  isLoading,
  refetch,
} = useTranslationsQuery(pageId, languageCode);
\`\`\`

---

## Editor State Hooks

### useAutosave

Debounced autosave with status tracking:

\`\`\`typescript
import { useAutosave } from '@/hooks/queries/useAutosave';

const {
  save,             // () => Promise<void> - Trigger immediate save
  isSaving,         // boolean
  lastSavedAt,      // Date | null
  status,           // 'idle' | 'saving' | 'saved' | 'error'
  error,            // Error | null
} = useAutosave(pageId, {
  debounceMs: 2000,           // Wait 2s after last change
  enabled: hasUnsavedChanges,  // Only save when dirty
});
\`\`\`

**Behavior:**
- Debounces saves to prevent excessive API calls
- Tracks save status for UI feedback
- Retries on failure with exponential backoff
- Prevents save during active editing

### useArrayItems

Manage array items with drag-and-drop:

\`\`\`typescript
import { useArrayItems } from '@/hooks/useArrayItems';

const {
  items,           // T[]
  addItem,         // (item: T) => void
  removeItem,      // (index: number) => void
  updateItem,      // (index: number, updates: Partial<T>) => void
  moveItem,        // (fromIndex: number, toIndex: number) => void
  duplicateItem,   // (index: number) => void
  setItems,        // (items: T[]) => void
} = useArrayItems<FeatureItem>(sectionId, 'features', initialItems);
\`\`\`

**Integration with DnD:**
\`\`\`tsx
import { DndContext } from '@dnd-kit/core';

<DndContext onDragEnd={({ active, over }) => {
  if (active.id !== over?.id) {
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over?.id);
    moveItem(oldIndex, newIndex);
  }
}}>
  {items.map((item, index) => (
    <SortableItem key={item.id} id={item.id} item={item} />
  ))}
</DndContext>
\`\`\`

### useArrayCRUD

Lower-level CRUD operations for arrays:

\`\`\`typescript
import { useArrayCRUD } from '@/hooks/useArrayCRUD';

const {
  add,       // (item: T) => void
  remove,    // (predicate: (item: T) => boolean) => void
  update,    // (predicate: (item: T) => boolean, updates: Partial<T>) => void
  find,      // (predicate: (item: T) => boolean) => T | undefined
  findAll,   // (predicate: (item: T) => boolean) => T[]
} = useArrayCRUD(sectionId, 'features');
\`\`\`

### useNestedArrayCRUD

For nested arrays (e.g., highlights within features):

\`\`\`typescript
import { useNestedArrayCRUD } from '@/hooks/useNestedArrayCRUD';

const {
  addNested,       // (parentIndex: number, item: T) => void
  removeNested,    // (parentIndex: number, childIndex: number) => void
  updateNested,    // (parentIndex: number, childIndex: number, updates: Partial<T>) => void
} = useNestedArrayCRUD(sectionId, 'features', 'highlights');

// Add highlight to feature at index 0
addNested(0, { text: 'New highlight', icon: 'Star' });
\`\`\`

---

## Translation Hooks

### useTranslationEngine

Core translation functionality (see Translation Engine Guide for details):

\`\`\`typescript
import { useTranslationEngine } from '@/hooks/useTranslationEngine';

const {
  registerKey,
  getTranslation,
  setTranslation,
  translateWithAI,
  getCoverage,
  languages,
  currentLanguage,
} = useTranslationEngine();
\`\`\`

### useEditorTranslations

Translation resolution for editor mode:

\`\`\`typescript
import { useEditorTranslations } from '@/hooks/useEditorTranslations';

const {
  resolveTranslatedProps,   // (section) => translatedProps
  currentLanguage,
  isDefaultLanguage,
} = useEditorTranslations();
\`\`\`

### useLiveTranslations

Translation resolution for public pages:

\`\`\`typescript
import { useLiveTranslations } from '@/hooks/useLiveTranslations';

const {
  resolveTranslatedProps,
  currentLanguage,
  isDefaultLanguage,
} = useLiveTranslations();
\`\`\`

### useTranslationStatus

Get translation status for a property:

\`\`\`typescript
import { useTranslationStatus } from '@/hooks/useTranslationStatus';

const status = useTranslationStatus(sectionId, 'title');
// Returns: { status: 'translated' | 'stale' | 'missing' | 'unbound', tooltip: string }
\`\`\`

### useAutoKeyGeneration

Auto-generate translation keys:

\`\`\`typescript
import { useAutoKeyGeneration } from '@/hooks/useAutoKeyGeneration';

const { generateKey, generateKeysForSection } = useAutoKeyGeneration();

const key = generateKey({
  pageUrl: '/pricing',
  sectionType: 'hero',
  sectionId: 'abc123',
  propPath: 'title',
});
\`\`\`

---

## UI & Interaction Hooks

### useElementBounds

Track element position and dimensions:

\`\`\`typescript
import { useElementBounds } from '@/hooks/useElementBounds';

const { ref, bounds } = useElementBounds();
// bounds: { top, left, width, height, bottom, right }

<div ref={ref}>
  Content at {bounds.top}, {bounds.left}
</div>
\`\`\`

**With Throttling:**
\`\`\`typescript
const { ref, bounds } = useElementBounds({
  throttleMs: 100,  // Update at most every 100ms
  observeResize: true,
});
\`\`\`

### useLatestRef

Keep a ref to the latest value (for callbacks):

\`\`\`typescript
import { useLatestRef } from '@/hooks/useLatestRef';

const onSaveRef = useLatestRef(onSave);

// In callback, always gets latest onSave
const handleSave = useCallback(() => {
  onSaveRef.current?.(data);
}, []);  // No need to include onSave in deps
\`\`\`

### useMobile

Detect mobile viewport:

\`\`\`typescript
import { useMobile } from '@/hooks/use-mobile';

const isMobile = useMobile();
// true when viewport < 768px
\`\`\`

---

## Admin & Auth Hooks

### useAdminRoute

Check if current route is admin:

\`\`\`typescript
import { useAdminRoute } from '@/hooks/useAdminRoute';

const { isAdminRoute, adminPath } = useAdminRoute();
\`\`\`

### useCurrentUserProfile

Get current user profile:

\`\`\`typescript
import { useCurrentUserProfile } from '@/hooks/useCurrentUserProfile';

const {
  profile,      // Profile | null
  isLoading,
  isAdmin,
  roles,
} = useCurrentUserProfile();
\`\`\`

---

## Editor Shortcuts

### useReactEditorShortcuts

Register keyboard shortcuts:

\`\`\`typescript
import { useReactEditorShortcuts } from '@/hooks/useReactEditorShortcuts';

useReactEditorShortcuts({
  onSave: handleSave,
  onUndo: handleUndo,
  onRedo: handleRedo,
  onDuplicate: handleDuplicate,
  onDelete: handleDelete,
  onOpenBlockLibrary: () => setShowBlockLibrary(true),
  enabled: isEditorFocused,
});
\`\`\`

**Default Shortcuts:**
| Key | Action |
|-----|--------|
| Ctrl+S | Save |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+D | Duplicate |
| Delete/Backspace | Delete |
| B | Open Block Library |
| Escape | Clear selection |
| ? | Show shortcuts dialog |

---

## System Hooks

### useSystemStatus

Monitor system health:

\`\`\`typescript
import { useSystemStatus } from '@/hooks/useSystemStatus';

const {
  status,        // 'healthy' | 'degraded' | 'down'
  services,      // { database, storage, functions, realtime }
  lastChecked,
} = useSystemStatus();
\`\`\`

### useUserPresence

Track user presence (see Realtime Guide):

\`\`\`typescript
import { useUserPresence } from '@/hooks/useUserPresence';

const {
  currentUsers,
  setUserStatus,
  broadcastCursor,
} = useUserPresence(pageId);
\`\`\`

---

## Creating Custom Hooks

### Pattern: Derived State

\`\`\`typescript
function useSectionStats(sectionId: string) {
  const section = useSectionById(sectionId);
  
  return useMemo(() => {
    if (!section) return null;
    
    const arrayProps = Object.entries(section.props)
      .filter(([, v]) => Array.isArray(v));
    
    return {
      totalItems: arrayProps.reduce((sum, [, arr]) => sum + arr.length, 0),
      hasContent: Boolean(section.props.title || section.props.subtitle),
      isTranslated: Object.keys(section.translationKeys || {}).length > 0,
    };
  }, [section]);
}
\`\`\`

### Pattern: Side Effect

\`\`\`typescript
function useScrollToSection(sectionId: string | null) {
  useEffect(() => {
    if (!sectionId) return;
    
    const element = document.querySelector(\`[data-section-id="\${sectionId}"]\`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [sectionId]);
}
\`\`\`

### Pattern: Composition

\`\`\`typescript
function useSectionWithTranslations(sectionId: string) {
  const section = useSectionById(sectionId);
  const { resolveTranslatedProps } = useEditorTranslations();
  const status = useTranslationStatus(sectionId, 'title');
  
  return useMemo(() => ({
    section,
    translatedProps: section ? resolveTranslatedProps(section) : null,
    translationStatus: status,
  }), [section, resolveTranslatedProps, status]);
}
\`\`\`

---

## Best Practices

### 1. Memoize Selectors

\`\`\`typescript
// ✅ Good: Stable selector
const selectSectionById = useCallback(
  (state) => state.pageData?.sections.find(s => s.id === id),
  [id]
);
const section = useEditorStore(selectSectionById);

// ❌ Bad: New function every render
const section = useEditorStore(
  state => state.pageData?.sections.find(s => s.id === id)
);
\`\`\`

### 2. Clean Up Effects

\`\`\`typescript
useEffect(() => {
  const subscription = subscribe(pageId, handleUpdate);
  
  return () => {
    subscription.unsubscribe();
  };
}, [pageId]);
\`\`\`

### 3. Handle Null States

\`\`\`typescript
const { data: page, isLoading } = usePageData(pageId);

if (isLoading) return <Skeleton />;
if (!page) return <NotFound />;

return <Editor page={page} />;
\`\`\`

---

## Next Steps

- **[API Reference](/admin/documentation/developer/api)** — Complete API documentation
- **[Architecture](/admin/documentation/developer/architecture)** — System overview
  `
};

// ============================================================================
// NEW USER ARTICLES
// ============================================================================

const multiLanguageGuide: DocArticle = {
  title: 'Multi-Language Guide',
  description: 'Set up and manage multiple languages for your pages',
  category: 'user',
  slug: 'translations',
  order: 6,
  tags: ['translation', 'multilingual', 'languages', 'i18n', 'localization'],
  lastUpdated: '2025-01-15',
  content: `
# Multi-Language Guide

Create pages that speak to audiences around the world. This guide shows you how to set up multiple languages, link content to translations, and ensure complete coverage across all your target languages.

---

## Understanding Multi-Language Support

The page builder uses a **key-based translation system**:

1. **Default Language** — Your primary content language (usually English)
2. **Translation Keys** — Unique identifiers that link content across languages
3. **Translations** — The actual translated text for each language
4. **Coverage** — How much of your content has been translated

> 💡 **Pro Tip:** Always create your content in the default language first, then translate. This ensures consistency and makes AI translation more effective.

---

## Setting Up Languages

Languages are managed by your administrator. Once enabled, you'll see them in the language selector.

### Checking Available Languages

1. Look at the **language selector** in the editor toolbar
2. Click to see all active languages
3. The default language is marked with a star

![Language dropdown showing available languages including Arabic, Chinese, Czech, and more](/docs/screenshots/language-dropdown.png)

*The language selector in the toolbar shows all configured languages for your page*

### Switching Languages

1. Click the **language selector** in the toolbar
2. Choose your target language
3. The preview updates to show translations
4. Content without translations shows in the default language

---

## Linking Content to Translation Keys

### What Gets Translated?

Not all content needs translation. Common translatable items:

| Always Translate | Usually Translate | Rarely Translate |
|-----------------|-------------------|------------------|
| Headlines | Button text | Image URLs |
| Body text | Labels | Numbers |
| Descriptions | Menu items | Email addresses |
| CTAs | Error messages | Proper nouns |

### How to Link Content

1. **Select** the section containing the text
2. Open the **Translations** panel (tab in settings)
3. Find the property you want to translate
4. Click **"Link"** to create or select a translation key
5. The content is now translation-enabled

### The Translation Panel

The panel shows:

- **Property name** — Which text field
- **Current value** — The text in default language
- **Translation key** — The linked key (if any)
- **Status** — Translated, missing, or stale

![Translations panel showing Arabic translations with 346/346 keys bound and translated](/docs/screenshots/translations-panel-arabic.png)

*The Translations panel shows translation status, bound keys, and individual translation entries with AI translate buttons*

### Translation Status Icons

| Icon | Status | Meaning |
|------|--------|---------|
| ✓ Green | Translated | Translation exists |
| ○ Orange | Stale | Source changed, may need update |
| ✗ Red | Missing | No translation for this language |
| — Gray | Unbound | Not linked to a key |

---

## Adding Translations

### Manual Translation

1. Link content to a translation key
2. Select your target language from the dropdown
3. Enter the translated text in the field
4. Save — the translation is now active

### AI Translation

Let AI translate your content:

1. Link content to a translation key
2. Click the **"AI Translate"** button
3. Select target languages (one or multiple)
4. Review the suggested translations
5. Edit if needed, then confirm

AI translations are marked as "AI Translated" until you review them.

### Batch Translation

Translate many items at once:

1. Open the **Batch Translate** dialog from the toolbar
2. Select the languages to translate into
3. Choose what to translate:
   - All untranslated content
   - Specific sections
   - Stale translations only
4. Start translation
5. Review and approve results

---

## Translation Coverage

### What is Coverage?

Coverage measures how much of your translatable content has translations for each language.

- **100%** — All content is translated
- **75-99%** — Most content translated, some gaps
- **50-74%** — Significant content missing
- **Below 50%** — Major translation work needed

### Checking Coverage

1. Open the **Translation Coverage** panel
2. See percentage for each language
3. Click a language to see what's missing
4. Prioritize high-traffic content first

### Coverage Tips

- Start with critical pages (home, pricing, contact)
- Focus on headings and CTAs first
- Use AI translation to speed up the process
- Always review AI translations for accuracy

---

## Previewing Translations

### In the Editor

1. Use the language selector to switch languages
2. The canvas shows translated content
3. Missing translations show original text
4. Stale translations are highlighted

### Live Preview

1. Click **Preview** to open live preview
2. Use the language selector
3. Test navigation and links
4. Check all sections display correctly

> ⚠️ **Warning:** Always preview your page in each language before publishing. Translations may affect layout, especially for languages that are longer or shorter than English.

---

## Common Translation Challenges

### Different Text Lengths

German and French often need 20-30% more space than English.

**Solutions:**
- Design with flexible layouts
- Use shorter phrases when possible
- Test in longest language first

### Right-to-Left Languages

Arabic, Hebrew, and Persian read right-to-left (RTL). The page editor fully supports RTL languages with automatic layout mirroring.

**Handled Automatically:**
- Text alignment flips to the right
- Layout mirrors for proper reading flow
- Numbers and special characters stay left-to-right
- All section types adapt correctly

#### RTL Layout Examples

**Hero Section in Arabic:**

![Hero section displayed in Arabic with RTL layout, showing right-aligned text and announcement banner](/docs/screenshots/rtl-hero-arabic.png)

*The hero section in Arabic - text aligns to the right, and layout elements mirror for proper RTL reading flow*

**Icon Features in Arabic:**

![Icon Features section with 6 feature cards in Arabic, properly aligned for RTL](/docs/screenshots/rtl-icon-features-arabic.png)

*Icon Features display with Arabic text - icons appear on the correct side for RTL reading*

**Pricing Section in Arabic:**

![Pricing section with 3 plan cards in Arabic showing RTL-aligned content](/docs/screenshots/rtl-pricing-arabic.png)

*Pricing cards in Arabic - prices, features, and buttons all align correctly for RTL*

#### How RTL Works

1. **Automatic Detection**: When you select an RTL language (Arabic, Hebrew, etc.), the editor automatically enables RTL mode
2. **RTL Indicator**: You can see the "RTL" indicator in the toolbar when RTL mode is active
3. **Content Alignment**: Text aligns to the right, lists reverse order, and layouts mirror appropriately
4. **Preview Accuracy**: The canvas preview shows exactly how RTL content will appear to visitors

### Character Sets

Languages like Chinese, Japanese, and Korean need different fonts.

**Ensure:**
- Your theme includes appropriate fonts
- Font sizes work for all scripts
- Line heights are adequate

---

## Best Practices

### 1. Write for Translation

- Use simple, clear language
- Avoid idioms and slang
- Keep sentences short
- Be consistent with terminology

### 2. Provide Context

When creating translation keys, add context:

- "CTA button in hero section"
- "Heading for pricing table"
- "Error message when form fails"

This helps translators and AI produce better results.

### 3. Review AI Translations

AI translations are good but not perfect:

- Check for accuracy
- Verify tone matches your brand
- Ensure technical terms are correct
- Test with native speakers if possible

### 4. Keep Translations Updated

When you change source content:

- Check if translations need updating
- Mark stale translations for review
- Re-translate changed content

---

## Troubleshooting

### "My translations aren't showing"

1. Check the language is active
2. Verify translation key is linked
3. Confirm translation exists for that language
4. Clear browser cache and refresh

### "AI translation failed"

1. Check your internet connection
2. Try translating smaller batches
3. Report persistent errors to support
4. Use manual translation as backup

### "Text is cut off in some languages"

1. Check container has flexible height
2. Reduce source text length
3. Adjust padding for longer text
4. Test all languages before publishing

---

## What's Next?

- **[Working with Sections](/admin/documentation/user/sections)** — Master all section types
- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Go live in multiple languages
  `
};

const versionHistoryGuide: DocArticle = {
  title: 'Version History & Recovery',
  description: 'Understand version history, compare versions, and recover previous states',
  category: 'user',
  slug: 'versions',
  order: 7,
  tags: ['version history', 'recovery', 'backup', 'restore', 'undo'],
  lastUpdated: '2025-01-15',
  content: `
# Version History & Recovery

Never lose your work. The page builder automatically saves versions of your pages, letting you review changes over time and restore previous states if needed.

---

## How Version History Works

### Automatic Versioning

The system automatically creates versions:

- **On significant changes** — When you add/remove sections, or make major edits
- **Before destructive actions** — Before bulk operations or imports
- **On manual save** — When you press Ctrl+S
- **At regular intervals** — Periodic snapshots during editing sessions

### What's Saved

Each version captures:

| Saved | Not Saved |
|-------|-----------|
| All section content | Unsaved changes |
| Section order | Browser undo history |
| Styling and settings | Draft translations |
| Translation key bindings | User preferences |
| SEO metadata | Session-specific state |

---

## Accessing Version History

### Opening the Panel

1. Click the **clock icon** in the editor toolbar
2. Or press \`Ctrl + H\` / \`⌘H\`
3. The Version History panel opens

### Understanding the Timeline

The panel shows versions from newest to oldest:

- **Version number** — Sequential identifier
- **Timestamp** — When the version was created
- **Change summary** — Brief description of changes
- **Author** — Who made the changes

---

## Comparing Versions

### Side-by-Side View

1. Click a version to select it
2. Click **"Compare"** button
3. See current vs. selected version side by side
4. Differences are highlighted:
   - 🟢 **Green** — Added content
   - 🔴 **Red** — Removed content
   - 🟡 **Yellow** — Modified content

### Quick Preview

1. Hover over a version
2. A preview tooltip appears
3. See section count and key changes
4. Click to expand details

---

## Restoring a Version

### Full Restore

To completely restore a previous version:

1. Select the version you want
2. Click **"Restore"**
3. Confirm the action
4. Your page reverts to that state

> ⚠️ **Warning:** Restoring replaces your current page content. Your current state is saved as a new version, so you can undo the restore if needed.

### Partial Restore

To restore just specific sections:

1. Select the version
2. Click **"Selective Restore"**
3. Choose which sections to restore
4. Confirm the action

This is useful when you want to recover a deleted section without losing other changes.

---

## Best Practices

### Create Manual Checkpoints

Before major changes:

1. Press \`Ctrl + S\` to force a save
2. Add a descriptive change summary
3. This creates a named checkpoint you can easily find later

### Review Before Publishing

Before going live:

1. Check version history for unintended changes
2. Compare current version with last published
3. Ensure all changes are intentional

### Regular Reviews

Periodically:

1. Review old versions to track evolution
2. Clean up if you have many similar versions
3. Note important milestones

---

## Version Retention

### How Long Versions Are Kept

| Version Type | Retention |
|--------------|-----------|
| Recent (last 24 hours) | All kept |
| This week | Hourly snapshots |
| This month | Daily snapshots |
| Older | Weekly snapshots |
| Published versions | Kept indefinitely |

### Storage Limits

- Maximum versions per page varies by plan
- Older versions are automatically cleaned up
- Published versions are never deleted

---

## Recovery Scenarios

### "I accidentally deleted a section"

1. Open Version History
2. Find a version before the deletion
3. Use Selective Restore
4. Choose just the deleted section

### "I want to undo many changes"

1. Open Version History
2. Browse to find the good state
3. Preview to confirm
4. Use Full Restore

### "I need content from an old version"

1. Open Version History
2. Find the version with the content
3. Click to view
4. Copy the content you need
5. Paste into current version

### "Something broke and I don't know when"

1. Open Version History
2. Use Compare view
3. Work backwards through versions
4. Find when the problem was introduced
5. Restore the version before the issue

---

## Troubleshooting

### "I don't see recent changes"

1. Changes must be saved to appear in history
2. Check the save indicator — is it showing "Saved"?
3. Minor text edits may be bundled together
4. Wait a few seconds and refresh the panel

### "Cannot restore version"

1. Check your permissions
2. The page may be locked by another user
3. The version may be corrupted (rare)
4. Contact support for assistance

### "Version history is empty"

1. New pages start with no history
2. The first version is created on first save
3. Check if you're on the correct page

---

## What's Next?

- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Go live with confidence
- **[Frequently Asked Questions](/admin/documentation/user/faq)** — Common questions answered
  `
};

// ============================================================================
// NEW USER GUIDE ARTICLES - Translation Key Binding, Rich Text, SEO
// ============================================================================

const translationKeyBindingGuide: DocArticle = {
  title: 'Translation Key Binding',
  description: 'Complete guide to the Translation Key Picker and binding workflow',
  category: 'user',
  slug: 'translation-keys',
  order: 8,
  tags: ['translation', 'keys', 'binding', 'picker', 'multilingual', 'i18n'],
  lastUpdated: '2025-01-15',
  content: `
# Translation Key Binding

The Translation Key Picker is the bridge between your content and multi-language support. This guide shows you how to bind content to translation keys, understand status indicators, and use AI translation effectively.

---

## What Are Translation Keys?

A **translation key** is a unique identifier that links a piece of content across all languages.

\`\`\`mermaid
flowchart LR
    A[homepage] --> B[hero]
    B --> C[main]
    C --> D[title]
    
    style A fill:#4f46e5,color:#fff
    style B fill:#6366f1,color:#fff
    style C fill:#818cf8,color:#fff
    style D fill:#a5b4fc,color:#fff
\`\`\`

The key format follows: \`{page}.{section_type}.{section_id}.{property}\`

**Why use keys?**

- **Separation of concerns** — Content lives separately from translation
- **Reusability** — Same key can be used in multiple places
- **Tracking** — Know what's translated and what's missing
- **AI integration** — Keys enable batch AI translation

---

## The Translation Key Picker

### Accessing the Picker

1. **Select** any section in the editor
2. Open the **Content** tab in settings
3. Look for the **link icon** next to text fields
4. Click the icon to open the picker

![Content tab fields showing Badge Text, Main Title, and other properties with link icons](/docs/screenshots/content-tab-fields.png)

*Each field has a link icon for translation key binding*

### Picker Interface

The picker has several elements:

| Element | Purpose |
|---------|---------|
| **Current Binding** | Shows linked key (if any) |
| **Auto-Generate** | Creates key automatically |
| **Search** | Find existing keys |
| **Create Custom** | Make a custom key name |
| **Unbind** | Remove key binding |

---

## Binding Content to Keys

### Auto-Generate (Recommended)

The fastest way to bind content:

1. Click the globe icon 🌐
2. Click **"Auto-Generate Key"**
3. A key is created based on page, section, and property
4. Content is now translation-ready

> 💡 **Pro Tip:** Auto-generated keys follow a consistent naming convention, making them easy to manage at scale.

### Use Existing Key

Link to a key already in the system:

1. Click the globe icon 🌐
2. Search for the key name
3. Click to select
4. Content now uses that key's translations

### Create Custom Key

For special cases:

1. Click the globe icon 🌐
2. Type your custom key name
3. Click **"Create"**
4. Use semantic names like \`common.cta.get_started\`

### Unbind Key

Remove a key binding:

1. Click the globe icon 🌐 (shows current key)
2. Click **"Unbind"** button
3. Confirm the action
4. Content returns to using the raw value

---

## Translation Status Indicators

Each bound field shows a status indicator:

### Status Badge Colors

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 **Green** | Translated | Translation exists for current language |
| 🟠 **Orange/Yellow** | Stale | Source text changed, translation may be outdated |
| 🔴 **Red** | Missing | Key bound but no translation for this language |
| ⚪ **Gray** | Unbound | No translation key assigned |

### Understanding Stale Status

A translation becomes **stale** when:

1. You change the source text (default language)
2. The translated text was created from the old source
3. The translation may no longer be accurate

**To fix stale translations:**

1. Click the status badge
2. Review the translation
3. Either update manually or re-run AI translation
4. Mark as reviewed when done

---

## AI Translation Button

Many fields have an **AI Translate** button:

### Single Field Translation

1. Bind content to a translation key
2. Click the **AI Translate** (✨) button
3. Select target language(s)
4. AI generates translation
5. Review and confirm

### Batch Translation

For many fields at once:

1. Open the **Batch Translate** dialog (toolbar)
2. Select which sections to translate
3. Choose target languages
4. Click **"Translate All"**
5. Review results

---

## The Translation Panel

Access the full Translation Panel for a section:

### Opening the Panel

1. Select a section
2. Click the **Translations** tab
3. See all translatable properties

### Panel Features

| Feature | Description |
|---------|-------------|
| **Property List** | All translatable fields with status |
| **Language Selector** | Switch viewing language |
| **Coverage Stats** | Percentage translated |
| **Bulk Actions** | Generate all keys, translate all |

### Bulk Operations

**Generate All Keys:**
- Click "Generate Keys" at top
- All unbound properties get keys
- Saves time on new sections

**Translate All:**
- Click "AI Translate All"
- All bound keys get translated
- Good for initial setup

---

## Translation Key Format

Translation keys now use **stable section IDs** instead of volatile section indices:

\`\`\`
NEW FORMAT (stable):  page.{slug}.{sectionId_8chars}.{propPath}
OLD FORMAT (deprecated): page.{slug}.{sectionType}_{index}.{propPath}
\`\`\`

**Examples:**
- \`page.home.a1b2c3d4.title\` ← NEW (stable)
- \`page.home.hero_0.title\` ← OLD (breaks on reorder)

> ⚠️ **Why this matters:** The old format used section indices which change when sections are reordered, breaking existing translations. The new format uses the first 8 characters of the section UUID, keeping keys stable regardless of section order.

---

## TranslationKeyPicker Component

For developers, the picker is available as a component:

\`\`\`tsx
import { TranslationKeyPicker } from '@/components/editor/TranslationKeyPicker';

<TranslationKeyPicker
  sectionId={section.id}
  propPath="title"
  propLabel="Title"
  currentValue={section.props.title}
  sectionType={section.type}
  className="my-2"
/>
\`\`\`

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| \`sectionId\` | string | The section UUID (used for stable key generation) |
| \`propPath\` | string | Dot-notation path to property |
| \`propLabel\` | string | Human-readable label |
| \`currentValue\` | string | Current text value |
| \`sectionType\` | string | Section type for context |

---

## TranslationStatusIndicator

Shows translation coverage for a section:

\`\`\`tsx
import { TranslationStatusIndicator } from '@/components/editor/TranslationKeyPicker';

<TranslationStatusIndicator
  sectionId={section.id}
  className="ml-2"
/>
\`\`\`

Displays a badge like:

- ✅ **"5/5 translated"** — All done
- ⚠️ **"3/5 translated"** — Some missing

---

## useTranslationStatus Hook

Get translation status programmatically:

\`\`\`typescript
import { useTranslationStatus } from '@/hooks/useTranslationStatus';

const status = useTranslationStatus(sectionId, 'title');
// Returns:
// {
//   status: 'translated' | 'stale' | 'missing' | 'unbound',
//   tooltip: 'Translated to es' | 'Source text changed...' | ...
// }
\`\`\`

---

## TranslatableField Component

A convenience component combining input + key picker:

\`\`\`tsx
import { TranslatableField } from '@/components/editor/TranslatableField';

<TranslatableField
  sectionId={section.id}
  propPath="title"
  label="Section Title"
  value={config.title}
  onChange={(value) => onUpdate({ title: value })}
  maxLength={60}
  placeholder="Enter title..."
/>
\`\`\`

This renders:
- A label with translation key picker
- An input field with debouncing
- Character count (if maxLength provided)

---

## Best Practices

### 1. Bind Early

Link translation keys when creating content, not later:

\`\`\`
✅ Create section → Bind keys → Add content → Translate
❌ Create section → Add content → Publish → Try to translate later
\`\`\`

### 2. Use Auto-Generate

Let the system create consistent key names:

\`\`\`
✅ homepage.hero.abc123.title
❌ my_custom_hero_title_1
\`\`\`

### 3. Review Stale Translations

Don't ignore stale status:

- Source changed = translation needs update
- Run AI translation or review manually
- Mark as reviewed when done

### 4. Check Coverage Before Publishing

Incomplete translations are jarring:

- Open Translation Panel
- Check coverage for target languages
- Fill gaps before going live

---

## Troubleshooting

### "No translation key picker appears"

1. Check that multi-language is enabled
2. Verify the property is in \`translatableProps\`
3. Ensure the section definition includes it

### "AI translation not working"

1. Verify OPENAI_API_KEY is configured
2. Check internet connection
3. Try smaller batches
4. Review edge function logs

### "Translation not showing on live page"

1. Confirm key is bound in section
2. Check translation exists for language
3. Verify language is active
4. Clear browser cache

### "Status shows 'missing' but I added translation"

1. Check you translated for correct language
2. Verify the translation was saved
3. Refresh the editor
4. Check translation key matches

---

## What's Next?

- **[Multi-Language Guide](/admin/documentation/user/translations)** — Complete translation workflow
- **[Working with Sections](/admin/documentation/user/sections)** — Section-specific content editing
  `
};

const richTextEditingGuide: DocArticle = {
  title: 'Rich Text Editing',
  description: 'Master inline editing with formatting, links, and rich content',
  category: 'user',
  slug: 'rich-text',
  order: 9,
  tags: ['rich text', 'editing', 'formatting', 'inline', 'tiptap', 'text'],
  lastUpdated: '2025-01-15',
  content: `
# Rich Text Editing

Create beautifully formatted content with the rich text editor. This guide covers inline editing, formatting options, keyboard shortcuts, and advanced features.

---

## Inline Editing Basics

The page builder supports **click-to-edit** text editing directly in the canvas.

### How to Start Editing

1. **Click** on any editable text in the canvas
2. The text becomes highlighted and a cursor appears
3. Type to replace or edit the content
4. Click outside or press **Enter** to save

### What's Editable?

| Element | Editable | Method |
|---------|----------|--------|
| Headlines (H1-H6) | ✅ Yes | Click to edit |
| Paragraphs | ✅ Yes | Click to edit |
| Button text | ✅ Yes | Click to edit |
| List items | ✅ Yes | Click to edit |
| Image alt text | Via settings | Settings panel |
| URLs | Via settings | Settings panel |

---

## The Formatting Toolbar

When editing rich text, a floating toolbar appears with formatting options.

### Available Formatting

| Button | Shortcut | Action |
|--------|----------|--------|
| **B** | Ctrl+B | Bold |
| *I* | Ctrl+I | Italic |
| <u>U</u> | Ctrl+U | Underline |
| ~~S~~ | — | Strikethrough |
| 🔗 | Ctrl+K | Add link |
| 🎨 | — | Text color |
| ✨ | — | Highlight |
| </> | — | Code formatting |
| ◀ | — | Align left |
| ▬ | — | Align center |
| ▶ | — | Align right |

### Using Bold and Italic

1. Select the text you want to format
2. Click the **B** or *I* button
3. Or use keyboard shortcuts: Ctrl+B / Ctrl+I

### Adding Links

1. Select the text to link
2. Click the link button 🔗 or press Ctrl+K
3. Enter the URL
4. Toggle "Open in new tab" if needed
5. Click "Apply"

### Removing Links

1. Click anywhere in the linked text
2. The link toolbar appears
3. Click "Remove" to unlink

### Text Colors

1. Select text
2. Click the color button 🎨
3. Choose from preset colors or use picker
4. Click to apply

### Highlighting

1. Select text
2. Click highlight button ✨
3. Choose highlight color
4. Great for emphasizing key phrases

---

## Keyboard Shortcuts for Editing

### Text Formatting

| Shortcut | Action |
|----------|--------|
| Ctrl+B / ⌘B | Bold |
| Ctrl+I / ⌘I | Italic |
| Ctrl+U / ⌘U | Underline |
| Ctrl+K / ⌘K | Insert link |

### Editing Actions

| Shortcut | Action |
|----------|--------|
| Enter | Save and close editor |
| Escape | Cancel editing (discard changes) |
| Ctrl+Z / ⌘Z | Undo (within text) |
| Ctrl+Shift+Z | Redo (within text) |

### Selection

| Shortcut | Action |
|----------|--------|
| Ctrl+A / ⌘A | Select all text |
| Shift+Arrow | Extend selection |
| Double-click | Select word |
| Triple-click | Select paragraph |

---

## TipTap Rich Text Editor

The page builder uses **TipTap** for rich text editing, providing a modern, extensible editing experience.

### TipTap Features

- **Collaborative-ready** — Built for real-time editing
- **Extensible** — Custom extensions possible
- **Accessible** — Keyboard navigation support
- **Mobile-friendly** — Touch support

### JSON Content Format

TipTap stores content as JSON, not HTML:

\`\`\`json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "text", "text": "Welcome to " },
        { "type": "text", "marks": [{ "type": "bold" }], "text": "our platform" }
      ]
    }
  ]
}
\`\`\`

This format:
- Is more structured than HTML
- Easier to validate
- Better for transformations

---

## The Bubble Menu

When you select text, a bubble menu appears:

### Bubble Menu Features

- Floats above selected text
- Contains formatting buttons
- Disappears when clicking outside
- Touch-friendly on mobile

### Customization (Developer)

\`\`\`tsx
import { TiptapBubbleMenu } from '@/components/editor/tiptap/TiptapBubbleMenu';

<TiptapEditor
  content={value}
  onChange={onChange}
  showBubbleMenu={true}
  bubbleMenuOptions={{
    bold: true,
    italic: true,
    link: true,
    color: true,
    // Disable specific options
    underline: false,
    strikethrough: false,
  }}
/>
\`\`\`

---

## RichTextRenderer Component

For displaying rich text content outside the editor:

\`\`\`tsx
import { RichTextRenderer } from '@/components/ui/RichTextRenderer';

<RichTextRenderer
  content={section.props.description}
  className="prose prose-lg"
/>
\`\`\`

The renderer handles:
- TipTap JSON → HTML conversion
- HTML string passthrough
- XSS sanitization
- Custom styling

---

## Working with Different Field Types

### Short Text (Titles, Headlines)

- Single line editing
- No paragraph breaks
- Limited formatting (bold, italic)

### Long Text (Descriptions, Bodies)

- Multi-line editing
- Full formatting support
- Paragraph breaks allowed

### Plain Text

- No formatting allowed
- Just raw text input
- Used for URLs, IDs, etc.

---

## Best Practices

### Keep Formatting Minimal

\`\`\`
✅ Use bold for key terms
✅ Italic for emphasis
✅ Links for navigation

❌ Multiple colors in one paragraph
❌ Excessive formatting
❌ All caps text
\`\`\`

### Maintain Consistency

- Same heading styles throughout
- Consistent link colors
- Uniform button text tone

### Consider Translation

Rich text is translatable, but:
- Keep formatting structure simple
- Avoid language-specific idioms
- Test that translated text fits layout

---

## Troubleshooting

### "Formatting toolbar not appearing"

1. Make sure text is selected
2. Click and drag to select text
3. Check if field supports rich text

### "Links not working"

1. Verify URL is complete (https://...)
2. Check if new tab is needed
3. Test in preview mode

### "Text looks different on published page"

1. Preview renders exact output
2. Check for CSS overrides
3. Verify responsive styles

### "Can't exit editing mode"

1. Click outside the text area
2. Press Escape key
3. Click on another section

---

## What's Next?

- **[Working with Sections](/admin/documentation/user/sections)** — Section content editing
- **[Styling Your Pages](/admin/documentation/user/styling)** — Visual design
  `
};

const seoOptimizationGuide: DocArticle = {
  title: 'SEO Optimization',
  description: 'Complete guide to SEO settings, meta tags, and social sharing',
  category: 'user',
  slug: 'seo',
  order: 10,
  tags: ['seo', 'meta', 'social', 'opengraph', 'twitter', 'search', 'optimization'],
  lastUpdated: '2025-01-15',
  content: `
# SEO Optimization

Help search engines and social platforms understand your content. This guide covers all SEO settings, best practices for meta tags, and social media optimization.

---

## Accessing SEO Settings

### Where to Find SEO Options

1. Open any page in the editor
2. Click **"SEO"** in the toolbar (or settings menu)
3. The SEO Editor panel opens
4. Configure settings per language

### Per-Language SEO

SEO settings can be different for each language:

1. Select the language from the dropdown
2. Configure meta title, description, etc.
3. Save — settings apply only to that language

---

## Basic SEO Settings

### Meta Title

The page title that appears in:
- Browser tabs
- Search engine results
- Social shares (fallback)

**Guidelines:**

| Requirement | Value |
|-------------|-------|
| **Length** | 30-60 characters (optimal) |
| **Format** | Primary Keyword - Secondary | Brand |
| **Uniqueness** | Each page needs unique title |

**Character Counter:**
- 🟢 Green: Within optimal range
- 🟡 Yellow: Slightly outside range
- 🔴 Red: Too long or too short

**Example:**
\`\`\`
✅ "VPS Hosting Plans | Enterprise Cloud Servers - HostOnce"
❌ "VPS" (too short)
❌ "The Best VPS Hosting Plans for Enterprise Businesses..." (too long)
\`\`\`

### Meta Description

Appears below the title in search results.

**Guidelines:**

| Requirement | Value |
|-------------|-------|
| **Length** | 120-160 characters (optimal) |
| **Content** | Compelling summary with keywords |
| **Call to action** | Include when appropriate |

**Example:**
\`\`\`
✅ "Get reliable VPS hosting with 99.9% uptime. Deploy in 
   seconds with our enterprise cloud infrastructure. 
   Starting at $9.99/month."
\`\`\`

---

## Social Media Settings

### Open Graph (Facebook, LinkedIn)

Control how your page appears when shared on social media.

| Field | Purpose | Length |
|-------|---------|--------|
| **OG Title** | Social share title | ≤60 chars |
| **OG Description** | Social share description | ≤200 chars |
| **OG Image** | Share image | 1200×630px |
| **OG Type** | Content type | website, article, product |

### OG Image Requirements

| Requirement | Value |
|-------------|-------|
| **Recommended size** | 1200 × 630 pixels |
| **Minimum size** | 600 × 315 pixels |
| **Aspect ratio** | 1.91:1 |
| **File types** | JPG, PNG, WebP |
| **Max file size** | < 5MB |

> 💡 **Pro Tip:** Create a unique OG image for each important page. Generic images get less engagement.

### Twitter Card Settings

Twitter can use different settings:

| Field | Purpose |
|-------|---------|
| **Card Type** | summary, summary_large_image, app |
| **Title** | Twitter-specific title |
| **Description** | Twitter-specific description |

**Card Types:**

| Type | Display |
|------|---------|
| \`summary\` | Small square image + text |
| \`summary_large_image\` | Large image above text |

---

## Advanced SEO Settings

### Canonical URL

Tells search engines the "official" URL for duplicate content.

**When to use:**

- Same content accessible via multiple URLs
- Tracking parameters in URLs
- Print-friendly versions
- Mobile versions (if separate)

**Example:**
\`\`\`
Page URL: /products?utm_source=email
Canonical: /products
\`\`\`

### No-Index / No-Follow

Control search engine behavior:

| Setting | Effect |
|---------|--------|
| **No-Index** | Don't show in search results |
| **No-Follow** | Don't follow links on this page |

**Use for:**
- Thank you pages
- Internal admin pages
- Duplicate content pages
- Temporary pages

### Structured Data (JSON-LD)

Add structured data for rich results:

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "VPS Hosting Pro",
  "description": "Enterprise VPS hosting solution",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  }
}
\`\`\`

**Common Types:**

| Schema Type | Use For |
|-------------|---------|
| \`Article\` | Blog posts, news |
| \`Product\` | Products with prices |
| \`FAQPage\` | FAQ sections |
| \`Organization\` | Company info |
| \`LocalBusiness\` | Physical locations |
| \`BreadcrumbList\` | Navigation breadcrumbs |

---

## SEO Preview

### Search Result Preview

See how your page appears in Google:

\`\`\`
VPS Hosting Plans | Cloud Servers - HostOnce
https://hostonce.com/vps-hosting
Get reliable VPS hosting with 99.9% uptime. Deploy in 
seconds with our enterprise cloud infrastructure...
\`\`\`

### Social Share Preview

See how your page appears when shared:

- Facebook preview card
- Twitter card preview
- LinkedIn post preview

---

## SEO Score

The SEO Editor calculates a score based on:

| Factor | Weight |
|--------|--------|
| Meta title length | 15% |
| Meta description | 15% |
| OG image set | 10% |
| Page has H1 | 10% |
| Content length | 10% |
| Internal links | 10% |
| Image alt texts | 10% |
| Mobile friendly | 10% |
| Page speed | 10% |

### Improving Your Score

1. Review each warning
2. Fix critical issues first
3. Optimize medium-priority items
4. Re-check after changes

---

## Per-Page SEO Checklist

### Before Publishing

- [ ] Meta title set (30-60 chars)
- [ ] Meta description set (120-160 chars)
- [ ] OG image uploaded (1200×630)
- [ ] Single H1 heading
- [ ] Alt text on images
- [ ] Internal links to related pages
- [ ] Mobile preview checked
- [ ] Page loads quickly

### For Multi-Language

- [ ] SEO settings for each language
- [ ] Translated meta titles/descriptions
- [ ] Language-appropriate keywords
- [ ] Localized OG images (if needed)

---

## Common SEO Mistakes

### Duplicate Titles

❌ Same title on multiple pages

✅ Unique, descriptive title per page

### Missing Meta Descriptions

❌ Empty description (Google generates one)

✅ Crafted description with keywords and CTA

### Poor OG Images

❌ No image or wrong dimensions

✅ Custom 1200×630 image per page

### Keyword Stuffing

❌ "VPS hosting VPS servers VPS plans VPS pricing"

✅ Natural language with one primary keyword

---

## Troubleshooting

### "Social share shows wrong image"

1. Check OG image is set
2. Verify image URL is public
3. Use Facebook Debugger to clear cache
4. Wait for platforms to re-fetch

### "Meta description not showing in Google"

Google sometimes:
- Generates its own description
- Uses content from the page
- Ignores description if not relevant

This is normal — keep descriptions optimized anyway.

### "Changes not reflected in search results"

1. Search engines re-crawl periodically
2. Use Google Search Console to request indexing
3. Changes can take days to weeks

### "Structured data errors"

1. Validate with Google's Rich Results Test
2. Check required fields are present
3. Ensure values are correct types

---

## What's Next?

- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Go live with optimized pages
- **[Multi-Language Guide](/admin/documentation/user/translations)** — SEO for multiple languages
  `
};

// ============================================================================
// NEW DEVELOPER GUIDE ARTICLES - Shared Components, Element Settings, Edge Functions
// ============================================================================

const sharedComponentsGuide: DocArticle = {
  title: 'Shared Components Reference',
  description: 'Complete reference for ItemListEditor, IconPicker, and other shared components',
  category: 'developer',
  slug: 'shared-components',
  order: 9,
  tags: ['components', 'ItemListEditor', 'IconPicker', 'shared', 'settings'],
  lastUpdated: '2025-01-15',
  content: `
# Shared Components Reference

The page builder includes a set of reusable components for building section settings. This reference covers all shared components and how to use them effectively.

---

## ItemListEditor

The primary component for managing array items (features, testimonials, FAQs, etc.).

### Basic Usage

\`\`\`tsx
import { ItemListEditor } from '@/components/admin/sections/shared/ItemListEditor';

<ItemListEditor
  items={config.features || []}
  onItemsChange={(features) => onUpdate({ features })}
  getItemTitle={(item, index) => item.title || \`Feature \${index + 1}\`}
  createNewItem={() => ({
    id: crypto.randomUUID(),
    icon: 'Star',
    title: 'New Feature',
    description: '',
  })}
  renderItem={(item, index, onItemUpdate) => (
    <div className="space-y-4">
      <Input
        value={item.title}
        onChange={(e) => onItemUpdate({ title: e.target.value })}
        placeholder="Feature title"
      />
      <Textarea
        value={item.description}
        onChange={(e) => onItemUpdate({ description: e.target.value })}
        placeholder="Description"
      />
    </div>
  )}
  addItemLabel="Add Feature"
/>
\`\`\`

### Complete Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`items\` | \`T[]\` | Required | Array of items |
| \`onItemsChange\` | \`(items: T[]) => void\` | Required | Change handler |
| \`renderItem\` | \`(item, index, onUpdate) => ReactNode\` | Required | Item renderer |
| \`getItemTitle\` | \`(item, index) => string\` | Required | Title for collapsed state |
| \`getItemSubtitle\` | \`(item, index) => string?\` | — | Subtitle text |
| \`getItemIcon\` | \`(item, index) => ReactNode?\` | — | Icon for item header |
| \`createNewItem\` | \`() => T\` | Required | Factory for new items |
| \`addItemLabel\` | \`string\` | "Add Item" | Add button text |
| \`emptyMessage\` | \`string\` | "No items" | Empty state message |
| \`minItems\` | \`number\` | 0 | Minimum items required |
| \`maxItems\` | \`number?\` | — | Maximum items allowed |
| \`collapsible\` | \`boolean\` | true | Enable item collapse |
| \`defaultCollapsed\` | \`boolean\` | true | Start collapsed |
| \`showDuplicateButton\` | \`boolean\` | true | Show duplicate |
| \`showMoveButtons\` | \`boolean\` | true | Show up/down arrows |
| \`confirmDelete\` | \`boolean\` | false | Confirm before delete |
| \`showItemIndex\` | \`boolean\` | false | Show item numbers |
| \`showBulkActions\` | \`boolean\` | false | Show expand/collapse all |
| \`className\` | \`string\` | — | Additional classes |

### The renderItem Callback

\`\`\`tsx
renderItem={(item, index, onItemUpdate, isExpanded, onToggle) => (
  <div>
    {/* onItemUpdate merges updates into the item */}
    <Input
      value={item.title}
      onChange={(e) => onItemUpdate({ title: e.target.value })}
    />
    
    {/* Full item access */}
    <p>Item {index + 1} of {items.length}</p>
    
    {/* Toggle expanded state */}
    <Button onClick={() => onToggle(!isExpanded)}>
      {isExpanded ? 'Collapse' : 'Expand'}
    </Button>
  </div>
)}
\`\`\`

### Drag and Drop

ItemListEditor includes built-in drag-and-drop:

- Uses dnd-kit for smooth reordering
- Grip handle on each item
- Keyboard accessible
- Visual drop indicator

---

## SectionHeaderFields

Standardized fields for section headers (badge, title, subtitle).

### Usage

\`\`\`tsx
import { SectionHeaderFields } from '@/components/admin/sections/shared/SectionHeaderFields';

<SectionHeaderFields
  badge={config.badge}
  title={config.title || ''}
  subtitle={config.subtitle}
  onBadgeChange={(badge) => onUpdate({ badge })}
  onTitleChange={(title) => onUpdate({ title })}
  onSubtitleChange={(subtitle) => onUpdate({ subtitle })}
  sectionId={sectionId}
  sectionType={sectionType}
  sectionIndex={sectionIndex}
/>
\`\`\`

### Props

| Prop | Type | Description |
|------|------|-------------|
| \`badge\` | \`string?\` | Badge text value |
| \`title\` | \`string\` | Title text (required) |
| \`subtitle\` | \`string?\` | Subtitle text |
| \`onBadgeChange\` | \`(value: string) => void\` | Badge change handler |
| \`onTitleChange\` | \`(value: string) => void\` | Title change handler |
| \`onSubtitleChange\` | \`(value: string) => void\` | Subtitle change handler |
| \`sectionId\` | \`string?\` | For translation keys |
| \`sectionType\` | \`string?\` | For translation keys |
| \`sectionIndex\` | \`number?\` | For translation keys |
| \`showBadge\` | \`boolean\` | Show badge field (default: true) |
| \`showSubtitle\` | \`boolean\` | Show subtitle field (default: true) |
| \`titleLabel\` | \`string\` | Custom title label |
| \`titlePlaceholder\` | \`string\` | Custom placeholder |

Includes translation key pickers when sectionId is provided.

---

## IconPicker

Select from 50+ Lucide icons.

### Usage

\`\`\`tsx
import { IconPicker } from '@/components/admin/sections/shared/IconPicker';

<IconPicker
  value={config.icon}
  onChange={(icon) => onUpdate({ icon })}
  label="Icon"
/>
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`value\` | \`string\` | — | Current icon name |
| \`onChange\` | \`(icon: string) => void\` | Required | Change handler |
| \`label\` | \`string\` | "Icon" | Field label |
| \`placeholder\` | \`string\` | "Select icon" | Placeholder |
| \`className\` | \`string\` | — | Additional classes |

### Available Icons

The picker includes icons from these categories:

| Category | Examples |
|----------|----------|
| **General** | Star, Heart, Check, X, Plus, Minus |
| **Navigation** | ArrowRight, ArrowLeft, ChevronDown |
| **Communication** | Mail, Phone, MessageCircle |
| **Files** | File, Folder, Download, Upload |
| **UI** | Menu, Settings, Search, Filter |
| **Status** | AlertCircle, CheckCircle, Info |
| **Devices** | Monitor, Smartphone, Tablet |
| **Data** | BarChart, PieChart, TrendingUp |
| **Social** | Github, Twitter, Linkedin |

See \`iconConstants.ts\` for the full list.

---

## CTAButtonSettings

Configure button text and URL together.

### Usage

\`\`\`tsx
import { CTAButtonSettings } from '@/components/admin/sections/shared/CTAButtonSettings';

<CTAButtonSettings
  buttonText={config.buttonText}
  buttonUrl={config.buttonUrl}
  onTextChange={(text) => onUpdate({ buttonText: text })}
  onUrlChange={(url) => onUpdate({ buttonUrl: url })}
  textLabel="Button Text"
  urlLabel="Button URL"
  sectionId={sectionId}
  propPathPrefix="primary"
/>
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`buttonText\` | \`string\` | — | Button label |
| \`buttonUrl\` | \`string\` | — | Button link URL |
| \`onTextChange\` | \`(text: string) => void\` | Required | Text change |
| \`onUrlChange\` | \`(url: string) => void\` | Required | URL change |
| \`textLabel\` | \`string\` | "Button Text" | Text field label |
| \`urlLabel\` | \`string\` | "Button URL" | URL field label |
| \`textPlaceholder\` | \`string\` | — | Text placeholder |
| \`urlPlaceholder\` | \`string\` | "https://..." | URL placeholder |
| \`sectionId\` | \`string?\` | — | For translation |
| \`propPathPrefix\` | \`string?\` | — | Translation path prefix |

---

## ItemFieldRenderers

Utility functions for rendering common field patterns.

### renderTextField

\`\`\`tsx
import { renderTextField } from '@/components/admin/sections/shared/ItemFieldRenderers';

{renderTextField({
  label: 'Title',
  value: item.title,
  onChange: (value) => onItemUpdate({ title: value }),
  placeholder: 'Enter title',
  maxLength: 60,
})}
\`\`\`

### renderTextareaField

\`\`\`tsx
{renderTextareaField({
  label: 'Description',
  value: item.description,
  onChange: (value) => onItemUpdate({ description: value }),
  placeholder: 'Enter description',
  rows: 3,
})}
\`\`\`

### renderSelectField

\`\`\`tsx
{renderSelectField({
  label: 'Position',
  value: item.position,
  onChange: (value) => onItemUpdate({ position: value }),
  options: [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
    { value: 'center', label: 'Center' },
  ],
})}
\`\`\`

### renderSwitchField

\`\`\`tsx
{renderSwitchField({
  label: 'Is Featured',
  checked: item.isFeatured,
  onChange: (checked) => onItemUpdate({ isFeatured: checked }),
})}
\`\`\`

---

## ColorPickerPopover

Color selection with presets and custom picker.

### Usage

\`\`\`tsx
import { ColorPickerPopover } from '@/components/editor/settings/shared/ColorPickerPopover';

<ColorPickerPopover
  value={config.backgroundColor}
  onChange={(color) => onUpdate({ backgroundColor: color })}
  label="Background Color"
  showAlpha={true}
/>
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`value\` | \`string\` | — | Current color (HSL or hex) |
| \`onChange\` | \`(color: string) => void\` | Required | Change handler |
| \`label\` | \`string?\` | — | Field label |
| \`showAlpha\` | \`boolean\` | true | Show opacity slider |
| \`presets\` | \`string[]\` | Theme colors | Preset swatches |
| \`className\` | \`string\` | — | Additional classes |

---

## ResponsiveSpacingInput

Configure spacing per device.

### Usage

\`\`\`tsx
import { ResponsiveSpacingInput } from '@/components/editor/settings/shared/ResponsiveSpacingInput';

<ResponsiveSpacingInput
  value={config.padding}
  onChange={(padding) => onUpdate({ padding })}
  label="Padding"
/>
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| \`value\` | \`ResponsiveSpacing\` | — | Current spacing |
| \`onChange\` | \`(spacing) => void\` | Required | Change handler |
| \`label\` | \`string\` | — | Field label |
| \`sides\` | \`'all' | 'vertical' | 'horizontal'\` | 'all' | Which sides |

### Value Format

\`\`\`typescript
interface ResponsiveSpacing {
  desktop: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  tablet?: { ... };
  mobile?: { ... };
}
\`\`\`

---

## ShadowPresetPicker

Select from predefined shadow values.

### Usage

\`\`\`tsx
import { ShadowPresetPicker } from '@/components/editor/settings/shared/ShadowPresetPicker';

<ShadowPresetPicker
  value={config.shadow}
  onChange={(shadow) => onUpdate({ shadow })}
/>
\`\`\`

### Presets

| Preset | CSS Value | Visual |
|--------|-----------|--------|
| \`none\` | \`none\` | Flat |
| \`sm\` | \`0 1px 2px\` | Subtle |
| \`md\` | \`0 4px 6px -1px\` | Standard |
| \`lg\` | \`0 10px 15px -3px\` | Prominent |
| \`xl\` | \`0 20px 25px -5px\` | Strong |
| \`2xl\` | \`0 25px 50px -12px\` | Dramatic |

---

## BorderSettings

Complete border configuration.

### Usage

\`\`\`tsx
import { BorderSettings } from '@/components/editor/settings/shared/BorderSettings';

<BorderSettings
  value={config.border}
  onChange={(border) => onUpdate({ border })}
/>
\`\`\`

### Value Format

\`\`\`typescript
interface BorderStyle {
  width?: string;    // "1px", "2px"
  style?: 'solid' | 'dashed' | 'dotted' | 'none';
  color?: string;    // HSL or hex
  radius?: string;   // "4px", "full"
}
\`\`\`

---

## LinkSettings

Configure link behavior.

### Usage

\`\`\`tsx
import { LinkSettings } from '@/components/editor/settings/shared/LinkSettings';

<LinkSettings
  url={config.linkUrl}
  newTab={config.linkNewTab}
  onUrlChange={(url) => onUpdate({ linkUrl: url })}
  onNewTabChange={(newTab) => onUpdate({ linkNewTab: newTab })}
/>
\`\`\`

---

## Best Practices

### Consistent Layouts

\`\`\`tsx
// Wrap settings in consistent structure
<div className="space-y-6">
  <SectionHeaderFields ... />
  
  <Separator />
  
  <div className="space-y-4">
    <Label>Features</Label>
    <ItemListEditor ... />
  </div>
  
  <Separator />
  
  <CTAButtonSettings ... />
</div>
\`\`\`

### Handle Empty States

\`\`\`tsx
<ItemListEditor
  items={config.items || []}  // Default to empty array
  emptyMessage="No items yet. Click 'Add' to create your first item."
  minItems={0}  // Allow empty
/>
\`\`\`

### Provide Good Defaults

\`\`\`tsx
createNewItem={() => ({
  id: crypto.randomUUID(),  // Always include ID
  title: 'New Item',        // Sensible default
  description: '',          // Empty but defined
  icon: 'Star',             // Common default
})}
\`\`\`

---

## What's Next?

- **[Creating Sections](/admin/documentation/developer/sections)** — Use these components
- **[API Reference](/admin/documentation/developer/api)** — Full API docs
  `
};

const elementSettingsGuide: DocArticle = {
  title: 'Element Settings Reference',
  description: 'Complete reference for ImageSettings, TextSettings, ButtonSettings, and more',
  category: 'developer',
  slug: 'element-settings',
  order: 10,
  tags: ['settings', 'image', 'text', 'button', 'element', 'configuration'],
  lastUpdated: '2025-01-15',
  content: `
# Element Settings Reference

Element settings components provide fine-grained control over individual content elements. This reference covers ImageSettings, TextSettings, ButtonSettings, and related components.

---

## ImageSettings

Comprehensive image configuration panel.

### Usage

\`\`\`tsx
import { ImageSettings } from '@/components/editor/settings/ImageSettings';

<ImageSettings
  settings={element.settings}
  onChange={(settings) => updateElement(elementId, settings)}
  imageUrl={element.src}
  onImageChange={(src) => updateElement(elementId, { src })}
/>
\`\`\`

### Available Settings

| Setting | Options | Default |
|---------|---------|---------|
| **Aspect Ratio** | auto, 1:1, 4:3, 3:2, 16:9, 2:1, 3:4, 9:16 | auto |
| **Object Fit** | cover, contain, fill, none, scale-down | cover |
| **Object Position** | center, top, bottom, left, right, custom | center |
| **Border Radius** | none, sm, md, lg, xl, 2xl, full | none |
| **Shadow** | none, sm, md, lg, xl, 2xl | none |
| **Link URL** | string | — |
| **Open in New Tab** | boolean | false |
| **Lazy Loading** | boolean | true |
| **Priority** | boolean | false |
| **Alt Text** | string | — |

### Aspect Ratio Options

| Value | Ratio | Use Case |
|-------|-------|----------|
| \`auto\` | Natural | Keep original aspect |
| \`1:1\` | Square | Profile photos |
| \`4:3\` | Standard | Product images |
| \`3:2\` | Photo | Photography |
| \`16:9\` | Widescreen | Videos, banners |
| \`2:1\` | Panoramic | Hero images |
| \`3:4\` | Portrait | Mobile screens |
| \`9:16\` | Story | Stories, mobile |

### Object Fit Options

| Value | Behavior |
|-------|----------|
| \`cover\` | Fill container, crop if needed |
| \`contain\` | Fit inside, may letterbox |
| \`fill\` | Stretch to fill |
| \`none\` | Original size |
| \`scale-down\` | \`none\` or \`contain\`, whichever is smaller |

### Object Position Options

| Value | Description |
|-------|-------------|
| \`center\` | Center of image |
| \`top\` | Top edge |
| \`bottom\` | Bottom edge |
| \`left\` | Left edge |
| \`right\` | Right edge |
| \`top-left\` | Top-left corner |
| \`top-right\` | Top-right corner |
| \`bottom-left\` | Bottom-left corner |
| \`bottom-right\` | Bottom-right corner |

### ImageSettings Props

| Prop | Type | Description |
|------|------|-------------|
| \`settings\` | \`ImageElementSettings\` | Current settings |
| \`onChange\` | \`(settings) => void\` | Settings change handler |
| \`imageUrl\` | \`string?\` | Current image URL |
| \`onImageChange\` | \`(url: string) => void\` | Image URL change |
| \`showUpload\` | \`boolean\` | Show upload button |
| \`showLink\` | \`boolean\` | Show link settings |
| \`showAlt\` | \`boolean\` | Show alt text field |
| \`showLazyLoad\` | \`boolean\` | Show lazy load toggle |

---

## TextSettings

Typography and text styling panel.

### Usage

\`\`\`tsx
import { TextSettings } from '@/components/editor/settings/TextSettings';

<TextSettings
  settings={element.settings}
  onChange={(settings) => updateElement(elementId, settings)}
/>
\`\`\`

### Available Settings

| Setting | Options | Default |
|---------|---------|---------|
| **Font Size** | xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl | base |
| **Font Weight** | light, normal, medium, semibold, bold, extrabold | normal |
| **Text Color** | Any color | foreground |
| **Text Alignment** | left, center, right, justify | left |
| **Line Height** | tight, normal, relaxed, loose | normal |
| **Letter Spacing** | tighter, tight, normal, wide, wider | normal |
| **Text Transform** | none, uppercase, lowercase, capitalize | none |
| **Max Width** | none, xs, sm, md, lg, xl, prose | none |

### Font Size Scale

| Value | Size | Use Case |
|-------|------|----------|
| \`xs\` | 0.75rem | Fine print |
| \`sm\` | 0.875rem | Captions |
| \`base\` | 1rem | Body text |
| \`lg\` | 1.125rem | Intro text |
| \`xl\` | 1.25rem | H4 |
| \`2xl\` | 1.5rem | H3 |
| \`3xl\` | 1.875rem | H2 |
| \`4xl\` | 2.25rem | H1 |
| \`5xl\` | 3rem | Display |

### TextSettings Props

| Prop | Type | Description |
|------|------|-------------|
| \`settings\` | \`TextElementSettings\` | Current settings |
| \`onChange\` | \`(settings) => void\` | Settings change |
| \`showColor\` | \`boolean\` | Show color picker |
| \`showAlignment\` | \`boolean\` | Show alignment |
| \`showTransform\` | \`boolean\` | Show text transform |
| \`responsive\` | \`boolean\` | Per-device settings |

---

## ButtonSettings

Button appearance and behavior configuration.

### Usage

\`\`\`tsx
import { ButtonSettings } from '@/components/editor/settings/ButtonSettings';

<ButtonSettings
  settings={element.settings}
  onChange={(settings) => updateElement(elementId, settings)}
/>
\`\`\`

### Available Settings

| Setting | Options | Default |
|---------|---------|---------|
| **Variant** | default, primary, secondary, outline, ghost, link, destructive | primary |
| **Size** | sm, md, lg | md |
| **Full Width** | boolean | false |
| **Icon** | Any Lucide icon | — |
| **Icon Position** | left, right | left |
| **Link URL** | string | — |
| **Open in New Tab** | boolean | false |
| **Disabled** | boolean | false |

### Button Variants

| Variant | Appearance |
|---------|------------|
| \`default\` | Neutral background |
| \`primary\` | Primary brand color |
| \`secondary\` | Secondary/muted |
| \`outline\` | Transparent with border |
| \`ghost\` | Transparent, no border |
| \`link\` | Like a text link |
| \`destructive\` | Red/danger color |

### ButtonSettings Props

| Prop | Type | Description |
|------|------|-------------|
| \`settings\` | \`ButtonElementSettings\` | Current settings |
| \`onChange\` | \`(settings) => void\` | Settings change |
| \`showIcon\` | \`boolean\` | Show icon picker |
| \`showLink\` | \`boolean\` | Show link settings |

---

## IconSettings

Icon selection and styling.

### Usage

\`\`\`tsx
import { IconSettings } from '@/components/editor/settings/IconSettings';

<IconSettings
  settings={element.settings}
  onChange={(settings) => updateElement(elementId, settings)}
  icon={element.icon}
  onIconChange={(icon) => updateElement(elementId, { icon })}
/>
\`\`\`

### Available Settings

| Setting | Options | Default |
|---------|---------|---------|
| **Icon** | Lucide icons | — |
| **Size** | xs, sm, md, lg, xl | md |
| **Color** | Any color | currentColor |
| **Stroke Width** | 1, 1.5, 2, 2.5, 3 | 2 |
| **Background** | none, circle, square, rounded | none |
| **Background Color** | Any color | muted |

### Icon Size Scale

| Value | Size | Use Case |
|-------|------|----------|
| \`xs\` | 16px | Inline with text |
| \`sm\` | 20px | Buttons, small UI |
| \`md\` | 24px | Default |
| \`lg\` | 32px | Features |
| \`xl\` | 48px | Hero icons |

---

## SectionStyleSettings

Section-level styling configuration.

### Usage

\`\`\`tsx
import { SectionStyleSettings } from '@/components/editor/settings/SectionStyleSettings';

<SectionStyleSettings
  style={section.style}
  onChange={(style) => updateSectionStyle(sectionId, style)}
/>
\`\`\`

### Available Settings

| Setting | Type | Description |
|---------|------|-------------|
| **Background** | BackgroundStyle | Solid, gradient, or image |
| **Padding** | ResponsiveSpacing | Inner spacing |
| **Margin** | ResponsiveSpacing | Outer spacing |
| **Container Width** | narrow, default, wide, full | Content max-width |
| **Border** | BorderStyle | Border configuration |
| **Shadow** | ShadowPreset | Drop shadow |
| **Z-Index** | number | Stacking order |
| **Visibility** | DeviceVisibility | Per-device show/hide |

### BackgroundStyle Interface

\`\`\`typescript
interface BackgroundStyle {
  type: 'solid' | 'gradient' | 'image' | 'transparent';
  color?: string;
  gradient?: {
    startColor: string;
    endColor: string;
    angle: number;
    type: 'linear' | 'radial';
  };
  image?: {
    url: string;
    position: string;
    size: 'cover' | 'contain' | 'auto';
    repeat: boolean;
    overlay?: {
      color: string;
      opacity: number;
    };
  };
}
\`\`\`

---

## ElementSettings Types

### ImageElementSettings

\`\`\`typescript
interface ImageElementSettings {
  aspectRatio?: AspectRatio;
  objectFit?: ObjectFit;
  objectPosition?: ObjectPosition;
  borderRadius?: BorderRadius;
  shadow?: ShadowPreset;
  link?: {
    url: string;
    newTab: boolean;
  };
  lazyLoad?: boolean;
  priority?: boolean;
  alt?: string;
}
\`\`\`

### TextElementSettings

\`\`\`typescript
interface TextElementSettings {
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  color?: string;
  alignment?: TextAlignment;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  textTransform?: TextTransform;
  maxWidth?: MaxWidth;
  responsive?: {
    tablet?: Partial<TextElementSettings>;
    mobile?: Partial<TextElementSettings>;
  };
}
\`\`\`

### ButtonElementSettings

\`\`\`typescript
interface ButtonElementSettings {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  link?: {
    url: string;
    newTab: boolean;
  };
  disabled?: boolean;
}
\`\`\`

---

## Best Practices

### Provide Sensible Defaults

\`\`\`typescript
const defaultImageSettings: ImageElementSettings = {
  aspectRatio: 'auto',
  objectFit: 'cover',
  objectPosition: 'center',
  borderRadius: 'md',
  shadow: 'none',
  lazyLoad: true,
  priority: false,
};
\`\`\`

### Handle Responsive Settings

\`\`\`tsx
// Merge desktop and device-specific settings
const effectiveSettings = {
  ...settings,
  ...(deviceMode === 'tablet' && settings.responsive?.tablet),
  ...(deviceMode === 'mobile' && settings.responsive?.mobile),
};
\`\`\`

### Validate Settings

\`\`\`typescript
function validateImageSettings(settings: ImageElementSettings): boolean {
  if (settings.aspectRatio && !validAspectRatios.includes(settings.aspectRatio)) {
    return false;
  }
  // ... more validation
  return true;
}
\`\`\`

---

## What's Next?

- **[Shared Components](/admin/documentation/developer/shared-components)** — Reusable settings components
- **[Creating Sections](/admin/documentation/developer/sections)** — Use settings in sections
  `
};

const edgeFunctionsGuide: DocArticle = {
  title: 'Edge Functions Reference',
  description: 'Complete reference for Supabase edge functions used in the page builder',
  category: 'developer',
  slug: 'edge-functions',
  order: 11,
  tags: ['edge functions', 'supabase', 'api', 'backend', 'serverless'],
  lastUpdated: '2025-01-15',
  content: `
# Edge Functions Reference

The page builder uses Supabase Edge Functions for server-side operations. This reference covers all available edge functions, their APIs, and usage patterns.

---

## Overview

### Available Edge Functions

| Function | Purpose |
|----------|---------|
| \`ai-translate\` | Single text AI translation |
| \`ai-translate-batch\` | Batch AI translation |
| \`admin-auth\` | Admin authentication |
| \`create-admin-user\` | Create admin users |
| \`get-exchange-rates\` | Currency conversion rates |
| \`purge-cloudflare-cache\` | Clear CDN cache |
| \`fix-page-translations\` | Repair translation data |

### Calling Edge Functions

\`\`\`typescript
import { supabase } from '@/integrations/supabase/client';

// Basic call
const { data, error } = await supabase.functions.invoke('function-name', {
  body: { param1: 'value1' },
});

// With auth (automatic if user logged in)
const { data, error } = await supabase.functions.invoke('protected-function', {
  body: { ... },
});
\`\`\`

---

## ai-translate

Translate a single text using OpenAI.

### Request

\`\`\`typescript
interface AITranslateRequest {
  text: string;           // Text to translate
  sourceLang: string;     // Source language code (e.g., 'en')
  targetLang: string;     // Target language code (e.g., 'es')
  context?: string;       // Optional context for better translation
}
\`\`\`

### Response

\`\`\`typescript
interface AITranslateResponse {
  translatedText: string;  // The translated text
  provider: string;        // 'openai'
  model: string;           // Model used
}
\`\`\`

### Usage

\`\`\`typescript
const { data, error } = await supabase.functions.invoke('ai-translate', {
  body: {
    text: 'Welcome to our platform',
    sourceLang: 'en',
    targetLang: 'es',
    context: 'Website hero section headline',
  },
});

if (error) {
  console.error('Translation failed:', error);
} else {
  console.log('Translated:', data.translatedText);
  // "Bienvenido a nuestra plataforma"
}
\`\`\`

### Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| \`Missing API key\` | OPENAI_API_KEY not set | Set secret in Supabase |
| \`Rate limit\` | Too many requests | Implement backoff |
| \`Invalid language\` | Unknown language code | Check supported codes |

---

## ai-translate-batch

Translate multiple texts efficiently.

### Request

\`\`\`typescript
interface BatchTranslateRequest {
  items: {
    key: string;         // Translation key
    text: string;        // Source text
    context?: string;    // Optional context
  }[];
  sourceLang: string;    // Source language
  targetLang: string;    // Target language
  pageId?: string;       // Optional page ID for tracking
}
\`\`\`

### Response

\`\`\`typescript
interface BatchTranslateResponse {
  translations: {
    key: string;
    translatedText: string;
    success: boolean;
    error?: string;
  }[];
  successCount: number;
  failureCount: number;
  provider: string;
}
\`\`\`

### Usage

\`\`\`typescript
const { data, error } = await supabase.functions.invoke('ai-translate-batch', {
  body: {
    items: [
      { key: 'hero.title', text: 'Welcome' },
      { key: 'hero.subtitle', text: 'Get started today' },
      { key: 'cta.button', text: 'Sign Up', context: 'Primary action button' },
    ],
    sourceLang: 'en',
    targetLang: 'fr',
    pageId: 'page-uuid',
  },
});

if (data) {
  console.log(\`Translated \${data.successCount} items\`);
  data.translations.forEach(t => {
    console.log(\`\${t.key}: \${t.translatedText}\`);
  });
}
\`\`\`

### Batch Size Limits

| Limit | Value |
|-------|-------|
| Max items per batch | 50 |
| Max text length | 5000 chars |
| Timeout | 30 seconds |

---

## admin-auth

Verify admin authentication.

### Request

\`\`\`typescript
interface AdminAuthRequest {
  action: 'verify' | 'login' | 'logout';
  credentials?: {
    email: string;
    password: string;
  };
}
\`\`\`

### Response

\`\`\`typescript
interface AdminAuthResponse {
  isAdmin: boolean;
  userId?: string;
  roles?: string[];
  error?: string;
}
\`\`\`

### Usage

\`\`\`typescript
// Verify current session
const { data } = await supabase.functions.invoke('admin-auth', {
  body: { action: 'verify' },
});

if (data.isAdmin) {
  console.log('User is admin with roles:', data.roles);
}
\`\`\`

---

## get-exchange-rates

Fetch currency exchange rates.

### Request

\`\`\`typescript
interface ExchangeRatesRequest {
  baseCurrency: string;     // e.g., 'USD'
  targetCurrencies: string[]; // e.g., ['EUR', 'GBP', 'JPY']
}
\`\`\`

### Response

\`\`\`typescript
interface ExchangeRatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}
\`\`\`

### Usage

\`\`\`typescript
const { data } = await supabase.functions.invoke('get-exchange-rates', {
  body: {
    baseCurrency: 'USD',
    targetCurrencies: ['EUR', 'GBP'],
  },
});

// data.rates = { EUR: 0.92, GBP: 0.79 }
\`\`\`

---

## purge-cloudflare-cache

Clear Cloudflare CDN cache.

### Request

\`\`\`typescript
interface PurgeCacheRequest {
  urls?: string[];        // Specific URLs to purge
  purgeEverything?: boolean; // Purge all cached content
}
\`\`\`

### Response

\`\`\`typescript
interface PurgeCacheResponse {
  success: boolean;
  purgedUrls?: string[];
  error?: string;
}
\`\`\`

### Usage

\`\`\`typescript
// Purge specific pages
const { data } = await supabase.functions.invoke('purge-cloudflare-cache', {
  body: {
    urls: [
      'https://example.com/',
      'https://example.com/pricing',
    ],
  },
});

// Purge everything (use carefully!)
const { data } = await supabase.functions.invoke('purge-cloudflare-cache', {
  body: { purgeEverything: true },
});
\`\`\`

### Required Secrets

| Secret | Description |
|--------|-------------|
| \`CLOUDFLARE_ZONE_ID\` | Your Cloudflare zone |
| \`CLOUDFLARE_API_TOKEN\` | API token with cache:purge permission |

---

## fix-page-translations

Repair broken translation data.

### Request

\`\`\`typescript
interface FixTranslationsRequest {
  pageId: string;
  actions: ('remove_orphaned' | 'sync_keys' | 'recalculate_coverage')[];
}
\`\`\`

### Response

\`\`\`typescript
interface FixTranslationsResponse {
  success: boolean;
  actionsPerformed: string[];
  orphanedKeysRemoved?: number;
  keysSynced?: number;
  newCoverage?: number;
}
\`\`\`

### Usage

\`\`\`typescript
const { data } = await supabase.functions.invoke('fix-page-translations', {
  body: {
    pageId: 'page-uuid',
    actions: ['remove_orphaned', 'recalculate_coverage'],
  },
});

console.log(\`Removed \${data.orphanedKeysRemoved} orphaned keys\`);
console.log(\`New coverage: \${data.newCoverage}%\`);
\`\`\`

---

## Creating Edge Functions

### File Structure

\`\`\`
supabase/
└── functions/
    └── my-function/
        └── index.ts
\`\`\`

### Basic Template

\`\`\`typescript
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { param1, param2 } = await req.json();
    
    // Your logic here
    const result = { success: true };
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
\`\`\`

### Using Secrets

\`\`\`typescript
// Access secrets via Deno.env
const apiKey = Deno.env.get('MY_API_KEY');

if (!apiKey) {
  throw new Error('MY_API_KEY secret not configured');
}
\`\`\`

---

## Best Practices

### Always Handle CORS

\`\`\`typescript
// Include in every response
return new Response(data, {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
\`\`\`

### Log Useful Information

\`\`\`typescript
console.log('Processing request:', {
  method: req.method,
  params: sanitizedParams, // Don't log secrets!
  timestamp: new Date().toISOString(),
});
\`\`\`

### Use Proper Error Responses

\`\`\`typescript
// Client error (4xx)
return new Response(JSON.stringify({ error: 'Invalid input' }), {
  status: 400,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

// Server error (5xx)
return new Response(JSON.stringify({ error: 'Internal error' }), {
  status: 500,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
\`\`\`

### Timeout Handling

\`\`\`typescript
// Set timeouts for external calls
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 25000);

try {
  const response = await fetch(url, { signal: controller.signal });
  // ...
} finally {
  clearTimeout(timeoutId);
}
\`\`\`

---

## Debugging

### View Logs

Edge function logs are available in:
- Supabase Dashboard → Edge Functions → Logs
- Or via \`supabase functions logs\` CLI

### Local Development

\`\`\`bash
# Start local functions
supabase functions serve

# Test with curl
curl -X POST http://localhost:54321/functions/v1/my-function \\
  -H "Content-Type: application/json" \\
  -d '{"param": "value"}'
\`\`\`

---

## What's Next?

- **[API Reference](/admin/documentation/developer/api)** — Frontend API docs
- **[Architecture](/admin/documentation/developer/architecture)** — System overview
  `
};

// ============================================================================
// NEW ARTICLES: Zustand Store Architecture
// ============================================================================

const zustandStoreGuide: DocArticle = {
  title: 'Zustand Store Architecture',
  description: 'Complete guide to the Zustand store, slices, state shape, and best practices',
  category: 'developer',
  slug: 'zustand-store',
  order: 12,
  tags: ['zustand', 'store', 'state', 'slices', 'architecture', 'redux'],
  lastUpdated: '2025-01-15',
  content: `
# Zustand Store Architecture

The page builder uses Zustand for state management. This guide explains the complete store architecture, including slices, state shape, actions, and best practices.

---

## Overview

Unlike Redux, Zustand uses a simpler approach with a single store composed of "slices." Each slice manages a related set of state and actions.

The main store (useEditorStore) is composed of:

\`\`\`mermaid
flowchart TD
    subgraph useEditorStore
        A[documentSlice<br/>Page data, section CRUD]
        B[selectionSlice<br/>Selection tracking]
        C[gridSlice<br/>Grid layout management]
        D[historySlice<br/>Undo/redo]
        E[uiSlice<br/>Device mode, active tabs]
        F[statusSlice<br/>Loading, saving, errors]
    end
    
    G[React Components] --> useEditorStore
    useEditorStore --> H[Autosave Service]
    useEditorStore --> I[Supabase Database]
\`\`\`

---

## Slice Breakdown

### documentSlice

Manages page data and section CRUD operations.

| State | Type | Description |
|-------|------|-------------|
| pageId | string or null | Current page ID |
| pageData | PageData or null | Complete page data with sections |
| originalPageData | PageData or null | Snapshot for dirty tracking |
| hasUnsavedChanges | boolean | Whether edits exist |

**Key Actions:**

| Action | Signature | Description |
|--------|-----------|-------------|
| initializeEditor | (pageId, pageData) => void | Load page into editor |
| resetEditor | () => void | Clear all state |
| addSection | (type, index?) => void | Insert new section |
| updateSectionProps | (id, props) => void | Update section props |
| deleteSection | (id) => void | Remove section |
| duplicateSection | (id) => void | Clone section |
| reorderSections | (from, to) => void | Change order |
| updateElementValue | (sectionId, path, value) => void | Update nested value |
| setTranslationKey | (sectionId, propPath, key) => void | Bind translation key |

---

### selectionSlice

Tracks what's currently selected in the editor.

| State | Type | Description |
|-------|------|-------------|
| selectedSectionId | string or null | Selected section |
| selectedColumnId | string or null | Selected column (for grid) |
| selectedElementPath | string or null | Selected element path |
| isInlineEditing | boolean | In text edit mode |

**Key Actions:**

| Action | Signature | Description |
|--------|-----------|-------------|
| selectSection | (id) => void | Select a section |
| selectColumn | (sectionId, columnId) => void | Select a column |
| selectElement | (sectionId, path) => void | Select an element |
| clearSelection | () => void | Deselect all |

---

### gridSlice

Manages the grid layout system (Section → Column → Widget).

| State | Type | Description |
|-------|------|-------------|
| dragContext | DragContext or null | Active drag state |
| dropTarget | DropTarget or null | Current drop target |
| resizeContext | ResizeContext or null | Active resize state |

---

### historySlice

Implements undo/redo functionality.

| State | Type | Description |
|-------|------|-------------|
| history | PageData[] | Stack of previous states |
| historyIndex | number | Current position in history |

**Key Actions:**

| Action | Signature | Description |
|--------|-----------|-------------|
| pushHistory | () => void | Save current state |
| undo | () => void | Go back one state |
| redo | () => void | Go forward one state |

---

## Using the Store

### Basic Usage

Import and use with selectors:

\`\`\`typescript
import { useEditorStore } from '@/stores/editorStore';

// Get state with selector (recommended)
const sections = useEditorStore(state => state.pageData?.sections);

// Get an action
const addSection = useEditorStore(state => state.addSection);
\`\`\`

### Pre-built Selector Hooks

For common patterns, use the pre-built hooks:

\`\`\`typescript
import {
  usePageData,
  useSelectedSection,
  useSectionById,
  useDeviceMode,
  useHasUnsavedChanges,
} from '@/stores/editorStore';

const pageData = usePageData();
const selectedSection = useSelectedSection();
\`\`\`

---

## Best Practices

1. **Use Selectors** — Prevent re-renders by selecting only what you need
2. **Memoize Complex Selectors** — Use shallow comparison for object selectors
3. **Actions Should Be Pure** — No side effects in store actions
4. **Use get() for Current State** — Access current state in actions with get()

---

## What's Next?

- **[API Reference](/admin/documentation/developer/api)** — Complete actions reference
- **[usesDataWrapper Pattern](/admin/documentation/developer/data-wrapper)** — Section data patterns
  `
};

// ============================================================================
// NEW ARTICLES: usesDataWrapper Pattern
// ============================================================================

const dataWrapperGuide: DocArticle = {
  title: 'The usesDataWrapper Pattern',
  description: 'Understanding sections that store props under section.props.data',
  category: 'developer',
  slug: 'data-wrapper',
  order: 13,
  tags: ['usesDataWrapper', 'data', 'pattern', 'props', 'sections'],
  lastUpdated: '2025-01-15',
  content: `
# The usesDataWrapper Pattern

Some sections store their props under section.props.data.* instead of directly under section.props.*. This guide explains why, which sections use it, and how to handle it correctly.

---

## What Is It?

Most sections store props directly:

\`\`\`typescript
section.props.title    // → "Welcome"
section.props.subtitle // → "Get started today"
\`\`\`

But some sections wrap everything in a data object:

\`\`\`typescript
section.props.data.title    // → "Welcome"
section.props.data.subtitle // → "Get started today"
\`\`\`

---

## Which Sections Use It?

The following sections have usesDataWrapper: true:

| Section Type | Primary Arrays |
|--------------|----------------|
| stats-counter | stats[] |
| steps | steps[] |
| icon-features | features[] |
| alternating-features | blocks[] |
| os-selector | options[] |
| data-center | locations[] |
| bento-grid | items[] |
| awards | awards[] |
| plans-comparison | plans[], features[] |
| blog-grid | posts[] |
| contact | channels[] |
| video | — |
| server-specs | specs[] |
| announcement-banner | — |
| team-members | members[] |
| careers | jobs[] |

---

## Accessing Props Safely

### The Problem

Directly accessing props breaks for usesDataWrapper sections:

\`\`\`typescript
// ❌ This breaks for usesDataWrapper sections
const title = section.props.title;  // undefined!
\`\`\`

### The Solution: getSectionPropsContainer

\`\`\`typescript
import { getSectionPropsContainer } from '@/lib/sectionUtils';

// ✅ Works for BOTH patterns
const props = getSectionPropsContainer(section);
const title = props.title;  // Always works!
\`\`\`

---

## Common Mistakes

1. **Not Checking for the Pattern** — Always use getSectionPropsContainer
2. **Overwriting Data Object** — Spread existing data when updating
3. **Inconsistent Paths** — Paths in translationKeys are relative to the container

---

## What's Next?

- **[Creating Sections](/admin/documentation/developer/sections)** — Build new sections
- **[API Reference](/admin/documentation/developer/api)** — Store actions for updates
  `
};

// ============================================================================
// NEW ARTICLES: Element Registry Reference
// ============================================================================

const elementRegistryGuide: DocArticle = {
  title: 'Element Registry Reference',
  description: 'Track and access mounted editable elements for overlays and selection',
  category: 'developer',
  slug: 'element-registry',
  order: 14,
  tags: ['registry', 'elements', 'overlay', 'selection', 'bounds'],
  lastUpdated: '2025-01-15',
  content: `
# Element Registry Reference

The Element Registry provides a centralized way to track mounted editable elements in the editor. This enables fast overlay positioning, selection highlighting, and element queries without expensive DOM traversal.

---

## Element ID Format

Each element has a unique ID combining section and path:

\`\`\`text
{sectionId}::{propPath}
\`\`\`

**Examples:**

\`\`\`text
section-abc::title
section-abc::features.0.title
section-abc::cta.button.text
\`\`\`

---

## Registration Interface

\`\`\`typescript
interface ElementRegistration {
  id: string;              // Unique element ID
  sectionId: string;       // Parent section
  path: string;            // Property path
  type: ElementType;       // 'text' | 'richtext' | 'image' | etc.
  ref: React.RefObject<HTMLElement>;
  bounds: DOMRect | null;  // Cached position/size
  translationKey?: string; // If bound to translation
}

type ElementType = 
  | 'text'
  | 'richtext'
  | 'image'
  | 'button'
  | 'link'
  | 'icon'
  | 'array-item';
\`\`\`

---

## Using useElementRegistration

The primary hook for registering elements:

\`\`\`tsx
import { useElementRegistration } from '@/stores/elementRegistry';

function EditableTitle({ sectionId, value }) {
  const ref = useElementRegistration(sectionId, 'title', 'text');
  
  return (
    <h1 ref={ref} className="editable-text">
      {value}
    </h1>
  );
}
\`\`\`

---

## Registry API

| Function | Returns | Description |
|----------|---------|-------------|
| createElementId(sectionId, path) | string | Generate unique element ID |
| getElement(id) | ElementRegistration or undefined | Get single element |
| getElementBounds(id) | DOMRect or null | Get cached bounds |
| getElementsBySection(sectionId) | ElementRegistration[] | All elements in section |
| getElementsByType(type) | ElementRegistration[] | All elements of type |
| updateElementBounds(id) | void | Refresh single element bounds |
| updateAllBounds() | void | Refresh all bounds |

---

## What's Next?

- **[Grid System](/admin/documentation/developer/grid)** — Widget rendering
- **[API Reference](/admin/documentation/developer/api)** — Selection actions
  `
};

// ============================================================================
// NEW ARTICLES: Logger System
// ============================================================================

const loggerSystemGuide: DocArticle = {
  title: 'Logger System',
  description: 'Environment-aware logging utility with named loggers for debugging',
  category: 'developer',
  slug: 'logger',
  order: 15,
  tags: ['logger', 'logging', 'debug', 'console', 'development'],
  lastUpdated: '2025-01-15',
  content: `
# Logger System

The page builder includes an environment-aware logging utility that provides structured logging in development while remaining silent in production.

---

## Basic Usage

\`\`\`typescript
import { logger } from '@/lib/logger';

// General logging
logger.info('Application started');
logger.debug('Debug information');
logger.warn('Warning message');
logger.error('Error occurred', error);
\`\`\`

---

## Environment Behavior

| Method | Development | Production |
|--------|-------------|------------|
| debug() | ✅ Logs | ❌ Silent |
| info() | ✅ Logs | ❌ Silent |
| warn() | ✅ Logs | ✅ Logs |
| error() | ✅ Logs | ✅ Logs |

---

## Named Loggers

Pre-configured loggers for different modules:

\`\`\`typescript
import { logger } from '@/lib/logger';

// Use module-specific loggers
logger.editor.debug('Section added', { sectionId });
logger.auth.info('User logged in', { userId });
logger.translation.warn('Missing key', { key });
logger.api.error('Request failed', error);
\`\`\`

### Available Named Loggers

| Logger | Purpose |
|--------|---------|
| logger.editor | Editor operations, sections, selection |
| logger.auth | Authentication, authorization |
| logger.api | API calls, Supabase queries |
| logger.translation | Translation engine, keys |
| logger.grid | Grid layout, columns, widgets |
| logger.dnd | Drag and drop operations |
| logger.autosave | Autosave, debouncing |
| logger.presence | Real-time presence |

---

## Best Practices

1. **Use Named Loggers** — Avoid generic console.log
2. **Include Context** — Pass relevant data objects
3. **Use Appropriate Levels** — debug for tracing, error for failures
4. **Don't Log Sensitive Data** — Never log passwords or tokens

---

## What's Next?

- **[Best Practices](/admin/documentation/developer/best-practices)** — Code guidelines
- **[Architecture](/admin/documentation/developer/architecture)** — System overview
  `
};

// ============================================================================
// NEW ARTICLES: Database Schema Reference
// ============================================================================

const databaseSchemaGuide: DocArticle = {
  title: 'Database Schema Reference',
  description: 'Complete Supabase database tables, relationships, and RLS policies',
  category: 'developer',
  slug: 'database',
  order: 16,
  tags: ['database', 'supabase', 'schema', 'tables', 'RLS', 'policies'],
  lastUpdated: '2025-01-15',
  content: `
# Database Schema Reference

Complete reference for the Supabase database tables, relationships, functions, and Row Level Security policies.

---

## Core Tables

### pages

The main table storing page content and metadata.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| page_title | text | Page title |
| page_url | text | URL slug (unique) |
| page_description | text | Meta description |
| content | jsonb | Serialized sections array |
| is_active | boolean | Published status |
| hidden_sections | text[] | Array of hidden section IDs |
| supported_languages | text[] | Enabled language codes |
| default_currency | text | Default currency code |

### page_versions

Version history for pages.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| page_id | uuid | FK to pages |
| version_number | integer | Sequential version |
| content | jsonb | Snapshot of page content |
| change_summary | text | User-provided summary |
| created_by | uuid | User who created version |

### page_locks

Collaborative editing locks.

| Column | Type | Description |
|--------|------|-------------|
| page_id | uuid | FK to pages (unique) |
| locked_by | uuid | User holding lock |
| locked_by_username | text | Username for display |
| expires_at | timestamptz | Lock expiration |

---

## Translation Tables

### languages

Available languages.

| Column | Type | Description |
|--------|------|-------------|
| code | text | Language code (e.g., 'en') |
| name | text | English name |
| native_name | text | Native name |
| is_default | boolean | Is default language |
| direction | text | 'ltr' or 'rtl' |

### translation_keys

Registry of translation keys.

| Column | Type | Description |
|--------|------|-------------|
| key | text | Unique key identifier |
| source_text | text | Original text |
| page_id | uuid | FK to pages |
| section_id | text | Section ID within page |
| prop_path | text | Property path |

### translations

Translated values.

| Column | Type | Description |
|--------|------|-------------|
| key | text | Translation key |
| language_id | uuid | FK to languages |
| value | text | Translated text |
| status | translation_status | 'untranslated', 'ai_translated', 'reviewed', 'edited' |
| ai_provider | text | AI provider used |

---

## User Tables

### profiles

User profile data.

| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | FK to auth.users |
| username | text | Display name |
| email | text | Email address |
| roles | text[] | Role array |

### user_roles

Role assignments.

| Column | Type | Description |
|--------|------|-------------|
| user_id | uuid | FK to auth.users |
| role | app_role | 'admin', 'user', 'seo_manager', etc. |

---

## Helper Functions

| Function | Returns | Description |
|----------|---------|-------------|
| is_admin() | boolean | Check if current user is admin |
| has_role(role, user_id) | boolean | Check if user has role |
| acquire_page_lock(page_id, user_id, username) | record | Acquire page lock |
| release_page_lock(page_id, user_id) | void | Release page lock |
| create_page_version(page_id, summary) | uuid | Create version snapshot |

---

## What's Next?

- **[Edge Functions](/admin/documentation/developer/edge-functions)** — Backend logic
- **[API Reference](/admin/documentation/developer/api)** — Frontend queries
  `
};

// ============================================================================
// NEW ARTICLES: Section DnD Configuration
// ============================================================================

const sectionDndGuide: DocArticle = {
  title: 'Section DnD Configuration',
  description: 'Configure drag-and-drop for array items within sections',
  category: 'developer',
  slug: 'section-dnd',
  order: 17,
  tags: ['dnd', 'drag', 'drop', 'array', 'reorder', 'configuration'],
  lastUpdated: '2025-01-15',
  content: `
# Section DnD Configuration

The page builder automatically enables drag-and-drop reordering for array items within sections. This guide explains how the DnD system works and how to configure it for your sections.

---

## How It Works

Each section type can register which arrays should be draggable. The configuration lives in src/lib/sectionDndConfig.ts.

---

## Configuration Interface

\`\`\`typescript
interface SectionDndConfig {
  arrays: ArrayDndConfig[];
}

interface ArrayDndConfig {
  path: string;                     // Path to array
  strategy: 'vertical' | 'horizontal' | 'grid';
  handlePosition: 'left' | 'right' | 'top-left' | 'top-right' | 'hidden';
  disabled?: boolean;
}
\`\`\`

---

## Strategy Types

| Strategy | Layout | Best For |
|----------|--------|----------|
| vertical | Stacked rows | FAQs, steps, feature lists |
| horizontal | Single row | Logo carousels, icon rows |
| grid | Responsive grid | Pricing plans, testimonials |

---

## Adding DnD to a Section

1. **Identify Arrays** — Find which arrays should be draggable
2. **Add Configuration** — Add entry to sectionDndRegistry
3. **Ensure Items Have IDs** — Each item MUST have a unique id field

\`\`\`typescript
// src/lib/sectionDndConfig.ts
export const sectionDndRegistry = {
  'stats-counter': {
    arrays: [{
      path: 'stats',
      strategy: 'horizontal',
      handlePosition: 'left',
    }],
  },
};
\`\`\`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Items not draggable | Check section has config, verify array path, ensure items have IDs |
| Drag handle not visible | Check handlePosition setting |
| Items jump to wrong position | Verify strategy matches actual layout |

---

## What's Next?

- **[Creating Sections](/admin/documentation/developer/sections)** — Build new sections
- **[Shared Components](/admin/documentation/developer/shared-components)** — ItemListEditor reference
  `
};

// ============================================================================
// NEW USER ARTICLES: Collaborative Editing
// ============================================================================

const collaborativeEditingGuide: DocArticle = {
  title: 'Collaborative Editing',
  description: 'Work together on pages with real-time presence and page locking',
  category: 'user',
  slug: 'collaboration',
  order: 11,
  tags: ['collaboration', 'team', 'locking', 'presence', 'real-time'],
  lastUpdated: '2025-01-15',
  content: `
# Collaborative Editing

The page builder supports team collaboration with real-time presence awareness and page locking to prevent conflicting edits.

---

## How It Works

When you open a page in the editor:

1. **Lock Acquired** — You automatically get a lock on the page
2. **Presence Shown** — Other team members see you're editing
3. **Conflict Prevention** — Others cannot edit while you hold the lock
4. **Auto-Release** — Lock releases when you close the editor

---

## Page Locking

### Lock Indicator

- **Green indicator** — You have the lock (safe to edit)
- **Orange indicator** — Someone else has the lock (view only)
- **Username** — Who currently holds the lock

### Getting the Lock

Locks are acquired automatically when you:
1. Open the page editor
2. Click "Request Edit" when viewing a locked page

### Releasing the Lock

Your lock is released when you:
1. Navigate away from the editor
2. Close the browser tab
3. Click "Release Lock" manually
4. Session times out (after inactivity)

---

## Real-Time Presence

The presence indicator shows:
- **Active editors** — Currently editing pages
- **Viewers** — Looking at pages but not editing
- **Status** — What page each person is on

---

## Best Practices

1. **Communicate** — Let teammates know when you start editing
2. **Keep sessions short** — Don't hold locks longer than needed
3. **Save frequently** — Publish changes to avoid data loss
4. **Check presence** — See who else is working before starting

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't get lock | Wait for current editor or contact them |
| Lock expired while editing | Try to re-acquire immediately |
| Presence not updating | Refresh page, check WebSocket connection |

---

## What's Next?

- **[Version History](/admin/documentation/user/versions)** — Recover previous versions
- **[Publishing](/admin/documentation/user/publishing)** — Publish your changes
  `
};

// ============================================================================
// NEW USER ARTICLES: Translation Dashboard
// ============================================================================

const translationDashboardGuide: DocArticle = {
  title: 'Translation Dashboard',
  description: 'Monitor coverage, batch translate, and manage translations across pages',
  category: 'user',
  slug: 'translation-dashboard',
  order: 12,
  tags: ['translation', 'dashboard', 'coverage', 'batch', 'AI'],
  lastUpdated: '2025-01-15',
  content: `
# Translation Dashboard

The Translation Dashboard provides a bird's-eye view of all translations across your site, with tools for batch translation and quality management.

---

## Coverage Overview

### Site-Wide Stats

View coverage percentages for each language across all pages. The dashboard shows:
- Overall translation percentage per language
- Total keys and translated count
- Per-page breakdown

---

## Understanding Status

### Translation Status Types

| Status | Color | Meaning |
|--------|-------|---------|
| **Translated** | 🟢 Green | Complete and current |
| **AI Translated** | 🔵 Blue | AI-generated, not reviewed |
| **Stale** | 🟡 Yellow | Source text changed |
| **Missing** | 🔴 Red | No translation exists |
| **Unbound** | ⚪ Gray | Not linked to translation key |

---

## Batch Translation

### AI-Powered Batch Translation

Translate multiple keys at once using AI:

1. **Select language** — Choose target language
2. **Select keys** — Pick which keys to translate
3. **Start batch** — AI translates all selected keys
4. **Review results** — Check and edit as needed

---

## Stale Translations

When you edit the source text (usually English), translations in other languages become "stale" because they may no longer be accurate.

### Handling Stale Translations

1. **Review** — Check if translation still works
2. **Mark as Current** — If translation is still valid
3. **Re-translate** — If translation needs updating

---

## Filtering and Searching

### Filter Options

| Filter | Description |
|--------|-------------|
| **All** | Show all keys |
| **Translated** | Only translated keys |
| **Missing** | Only untranslated keys |
| **Stale** | Only stale translations |
| **AI Generated** | Only AI translations |

---

## Quality Workflow

1. **Write in default language** — Create all content in English
2. **Bind translation keys** — Assign keys to all translatable content
3. **Batch AI translate** — Use AI for initial translations
4. **Review and edit** — Human review of AI translations
5. **Mark as reviewed** — Confirm quality
6. **Monitor stale** — Re-translate when source changes

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Translation not appearing | Check key binding, verify translation exists, clear cache |
| AI translation failed | Check connection, try fewer keys at once |
| Coverage percentage wrong | Check for orphaned keys, recalculate if available |

---

## What's Next?

- **[Multi-Language Guide](/admin/documentation/user/translations)** — In-page translation editing
- **[Publishing](/admin/documentation/user/publishing)** — Publish translated pages
  `
};

// ============================================================================
// EXPORTS
// ============================================================================

export const userGuideArticles: DocArticle[] = [
  adminPortalOverview,
  gettingStarted,
  managingPagesGuide,
  sectionsGuide,
  stylingGuide,
  publishingGuide,
  workingWithImagesGuide,
  richTextEditingGuide,
  seoOptimizationGuide,
  multiLanguageGuide,
  translationKeyBindingGuide,
  translationDashboardGuide,
  versionHistoryGuide,
  collaborativeEditingGuide,
  userRoleManagementGuide,
  currencyLocalizationGuide,
  announcementsBannersGuide,
  systemSettingsGuide,
  activityLogsGuide,
  faqGuide,
];

export const developerGuideArticles: DocArticle[] = [
  architectureGuide,
  creatingSectionsGuide,
  authenticationGuide,
  userPresenceGuide,
  apiReferenceGuide,
  gridSystemGuide,
  translationEngineGuide,
  realtimeGuide,
  advancedHooksGuide,
  completeHooksGuide,
  sharedComponentsGuide,
  elementSettingsGuide,
  adminComponentsGuide,
  edgeFunctionsGuide,
  edgeFunctionsDeepDiveGuide,
  zustandStoreGuide,
  dataWrapperGuide,
  elementRegistryGuide,
  loggerSystemGuide,
  databaseSchemaGuide,
  sectionDndGuide,
  bestPracticesGuide,
];

export const devopsGuideArticles: DocArticle[] = [
  infrastructureOverviewGuide,
  cicdPipelineGuide,
  environmentSyncGuide,
  databaseMigrationsGuide,
  edgeFunctionsDeploymentGuide,
  secretsManagementGuide,
  troubleshootingDeploymentsGuide,
];

export const allArticles: DocArticle[] = [
  ...userGuideArticles,
  ...developerGuideArticles,
  ...devopsGuideArticles,
];

// Categories for navigation
export const documentationCategories: DocCategory[] = [
  {
    id: 'user',
    title: 'User Guide',
    description: 'Learn how to use the page builder effectively',
    icon: 'user',
    articles: userGuideArticles,
  },
  {
    id: 'developer',
    title: 'Developer Guide',
    description: 'Extend and customize the page builder',
    icon: 'code',
    articles: developerGuideArticles,
  },
  {
    id: 'devops',
    title: 'DevOps & Infrastructure',
    description: 'CI/CD pipelines, deployments, and server management',
    icon: 'server',
    articles: devopsGuideArticles,
  },
];

// ============================================================================
// SEARCH & UTILITIES
// ============================================================================

export interface SearchResult {
  title: string;
  description: string;
  category: 'user' | 'developer' | 'devops';
  slug: string;
  path: string;
  matches: string[];
}

export function searchDocumentation(query: string): SearchResult[] {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
  const results: SearchResult[] = [];
  
  allArticles.forEach(article => {
    const searchableText = `${article.title} ${article.description} ${article.tags.join(' ')} ${article.content}`.toLowerCase();
    
    const matchingTerms = searchTerms.filter(term => searchableText.includes(term));
    
    if (matchingTerms.length > 0) {
      // Find matching snippets
      const matches: string[] = [];
      const lines = article.content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        const lineLower = line.toLowerCase();
        if (matchingTerms.some(term => lineLower.includes(term))) {
          const cleanLine = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/`/g, '').trim();
          if (cleanLine.length > 10 && cleanLine.length < 150 && !cleanLine.startsWith('|') && !cleanLine.startsWith('```')) {
            matches.push(cleanLine);
            if (matches.length >= 2) break;
          }
        }
      }
      
      results.push({
        title: article.title,
        description: article.description,
        category: article.category,
        slug: article.slug,
        path: `/a93jf02kd92ms71x8qp4/documentation/${article.category}/${article.slug}`,
        matches,
      });
    }
  });
  
  // Sort by relevance (number of matching terms, then by order)
  return results.sort((a, b) => {
    const aArticle = allArticles.find(art => art.slug === a.slug);
    const bArticle = allArticles.find(art => art.slug === b.slug);
    const relevanceDiff = b.matches.length - a.matches.length;
    if (relevanceDiff !== 0) return relevanceDiff;
    return (aArticle?.order ?? 0) - (bArticle?.order ?? 0);
  });
}

export function getArticle(category: string, slug: string): DocArticle | undefined {
  return allArticles.find(a => a.category === category && a.slug === slug);
}

export function getRecentlyUpdatedArticles(count: number = 5): DocArticle[] {
  return [...allArticles]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, count);
}

export function getAdjacentArticles(category: string, slug: string): { prev?: DocArticle; next?: DocArticle } {
  const categoryData = documentationCategories.find(c => c.id === category);
  const categoryArticles = categoryData?.articles ?? [];
  const currentIndex = categoryArticles.findIndex(a => a.slug === slug);
  
  return {
    prev: currentIndex > 0 ? categoryArticles[currentIndex - 1] : undefined,
    next: currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : undefined,
  };
}
