// Additional User Guide Documentation Articles
// These articles cover admin portal features and advanced functionality

import { DocArticle } from './index';

// ============================================================================
// NEW USER GUIDE ARTICLES
// ============================================================================

export const adminPortalOverview: DocArticle = {
  title: 'Admin Portal Overview',
  description: 'Your complete guide to navigating and understanding the admin interface',
  category: 'user',
  slug: 'admin-portal',
  order: 0,
  tags: ['admin', 'dashboard', 'navigation', 'overview', 'getting started'],
  lastUpdated: '2025-01-15',
  content: `
# Admin Portal Overview

Welcome to the Admin Portal — your command center for managing every aspect of your website. This guide will help you understand the interface, navigate efficiently, and make the most of all available features.

---

## What You'll Learn

- How to navigate the admin portal
- Understanding the dashboard and metrics
- Role-based access and what each role can do
- Quick links to common tasks

---

## Interface Layout

The admin portal is organized into three main areas:

### Left Sidebar — Main Navigation

The collapsible sidebar contains all major sections:

| Menu Item | Description |
|-----------|-------------|
| **Dashboard** | Overview metrics and system status |
| **Manage Pages** | Create, edit, and organize all pages |
| **Packages** | Manage pricing plans and packages |
| **Languages** | Configure supported languages |
| **Currencies** | Set up currency options |
| **Users** | Manage admin users and roles |
| **Activity** | View system activity logs |
| **Settings** | Configure site-wide settings |
| **Documentation** | You are here! |

> 💡 **Pro Tip:** Click the collapse button at the bottom of the sidebar to minimize it and gain more screen space when editing.

### Top Bar — Context & Actions

The top bar shows:

- Current page title
- User profile menu (top right)
- Quick actions for the current view

### Main Content Area

This is where all the action happens. The content changes based on which section you've selected from the sidebar.

---

## Dashboard Overview

The dashboard is your home base. Here's what you'll find:

### Key Metrics Cards

| Metric | What It Shows |
|--------|---------------|
| **Total Pages** | Number of pages on your site |
| **Active Languages** | Languages currently enabled |
| **Active Currencies** | Currencies available to visitors |
| **Translation Coverage** | Overall translation completeness |

### System Status Monitor

The system status panel shows real-time health of all services:

- **Database** — Supabase connection status
- **Storage** — File storage availability
- **Auth** — Authentication service status
- **Functions** — Edge functions health

Green indicators mean everything is working. Yellow or red indicators require attention.

### Recent Activity

See the latest actions taken in the system:

- Page edits and publications
- User logins
- Setting changes
- Translation updates

---

## User Roles & Permissions

The admin portal uses role-based access control (RBAC). Different roles have different permissions:

### Available Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Admin** | Full system access | Everything — use carefully |
| **Manager** | Team oversight | Manage users, view all content, approve changes |
| **SEO Manager** | SEO and publishing | Edit SEO settings, publish pages, manage translations |
| **Content Writer** | Content editing | Edit page content, manage sections, upload images |
| **User** | Basic access | View-only access to assigned areas |

### Checking Your Role

Your current role is shown in:

1. The user dropdown menu (top right)
2. Your profile page

### What You Can't See

If a menu item or action isn't visible, you may not have permission for it. Contact your administrator to request additional access.

> ⚠️ **Warning:** The Admin role has complete access to delete pages, remove users, and change critical settings. Assign this role sparingly.

---

## Quick Start Tasks

Here are the most common tasks and where to find them:

### Creating Content

1. **New Page** — Manage Pages → Create Page button
2. **Edit Existing Page** — Manage Pages → Click page name
3. **Add Sections** — In page editor, press \`B\` or click "Add Section"

### Managing Settings

1. **Site Logo** — Settings → Website Customization
2. **Languages** — Languages menu item
3. **Currencies** — Currencies menu item

### User Management

1. **Add User** — Users → Add Admin button
2. **Change Role** — Users → Edit user → Select role
3. **View Activity** — Activity menu item

---

## Customizing Your Experience

### Collapsing the Sidebar

Click the chevron icon at the bottom of the sidebar to collapse it. This gives you more room for content editing. Click again to expand.

### Profile Settings

Access your profile from the user menu (top right):

- Update your display name
- Change your profile picture
- View your assigned roles
- Log out

---

## Navigating Between Sections

### Breadcrumbs

When you're deep in a section, breadcrumbs at the top show your location and let you quickly jump back:

\`\`\`
Dashboard > Manage Pages > Homepage > Edit
\`\`\`

### Back Buttons

Most detail views have a back button or arrow to return to the list view.

### Keyboard Navigation

- \`Tab\` — Move between elements
- \`Enter\` — Activate buttons and links
- \`Escape\` — Close dialogs and dropdowns

---

## Getting Help

### In-App Documentation

You're reading it! The Documentation section contains comprehensive guides for every feature.

### Tooltips

Hover over icons and buttons to see helpful tooltips explaining what they do.

### Error Messages

When something goes wrong, error messages appear as toast notifications. They include:

- What went wrong
- Suggested actions to fix it

---

## What's Next?

Now that you understand the admin portal, explore specific features:

- **[Getting Started](/admin/documentation/user/getting-started)** — Create your first page
- **[Managing Pages](/admin/documentation/user/managing-pages)** — Deep dive into page management
- **[User & Role Management](/admin/documentation/user/user-management)** — Learn about user administration
  `
};

export const managingPagesGuide: DocArticle = {
  title: 'Managing Pages',
  description: 'Create, organize, clone, and manage all your website pages',
  category: 'user',
  slug: 'managing-pages',
  order: 3,
  tags: ['pages', 'create', 'clone', 'delete', 'organize', 'management'],
  lastUpdated: '2025-01-15',
  content: `
# Managing Pages

The page management system is your central hub for creating, organizing, and maintaining all pages on your website. This guide covers everything from creating your first page to advanced operations like cloning and bulk actions.

---

## What You'll Learn

- How to view and navigate the page list
- Creating new pages with proper settings
- Cloning pages for variations
- Managing page settings and metadata
- Deleting and archiving pages
- Understanding translation coverage indicators

---

## The Page List

Access the page list by clicking **"Manage Pages"** in the sidebar.

### Page List Columns

| Column | Description |
|--------|-------------|
| **Page Title** | Name of the page (click to edit) |
| **URL** | The page's web address |
| **Status** | Active (🟢) or Inactive (⚪) |
| **Languages** | Supported languages for this page |
| **Coverage** | Translation completion percentage |
| **Updated** | Last modification date |
| **Actions** | Edit, clone, delete buttons |

### Sorting and Filtering

- **Search** — Use the search box to find pages by title or URL
- **Sort** — Click column headers to sort
- **Filter** — Filter by status (active/inactive)

---

## Creating a New Page

### Step 1: Click Create Page

Find the **"Create Page"** button in the top right corner of the page list.

### Step 2: Fill in Basic Information

| Field | Required | Description |
|-------|----------|-------------|
| **Page Title** | Yes | Internal name (shown in admin) |
| **Page URL** | Yes | Web address (e.g., \`/about-us\`) |
| **Description** | No | Meta description for SEO |
| **Keywords** | No | SEO keywords (comma-separated) |

### Step 3: Configure Settings

| Setting | Description |
|---------|-------------|
| **Is Active** | Whether the page is publicly accessible |
| **Supported Languages** | Which languages this page supports |
| **Country Targeting** | Optional country-specific targeting |
| **Default Currency** | Currency shown on this page |

### Step 4: Save and Edit

Click **"Create"** to save your page. You'll be taken to the page editor to add content.

> 💡 **Pro Tip:** Start with a descriptive page title. You can always change the URL later, but a clear title helps you find pages quickly.

---

## Page URL Best Practices

### URL Format

- Use lowercase letters only
- Separate words with hyphens: \`/about-us\` not \`/about_us\`
- Keep URLs short and descriptive
- Avoid special characters

### Good URLs

- \`/pricing\`
- \`/about-us\`
- \`/contact\`
- \`/products/web-hosting\`

### Bad URLs

- \`/Page123\` (not descriptive)
- \`/about us\` (spaces not allowed)
- \`/contact_form_2023_v2\` (too complex)

---

## Cloning Pages

Cloning creates an exact copy of an existing page, including all sections and content.

### When to Clone

- Creating regional variations (same content, different language)
- A/B testing different designs
- Seasonal campaigns based on existing pages
- Creating templates from successful pages

### How to Clone

1. Find the page you want to clone in the list
2. Click the **three-dot menu** (⋮) on that row
3. Select **"Clone"**
4. Enter a new title and URL for the copy
5. Click **"Clone Page"**

The cloned page includes:

- All sections and their content
- All styling settings
- Translation key bindings
- Section order and visibility

The clone does NOT include:

- The original page's URL (you set a new one)
- Publication status (clones start as inactive)
- Version history (starts fresh)

> 💡 **Pro Tip:** After cloning, immediately rename the page and update its URL to avoid confusion.

---

## Editing Page Settings

### Accessing Page Settings

1. Click on the page title to open the editor
2. In the editor toolbar, click **"Page Settings"** (gear icon)

### Editable Settings

#### Basic Info

- **Page Title** — Change the display name
- **Page URL** — Update the web address (use with caution)
- **Description** — Update meta description
- **Keywords** — Modify SEO keywords

#### Display Options

- **Is Active** — Toggle page visibility
- **Show Price Switcher** — Display currency toggle
- **Country** — Set country targeting

#### Language Settings

- **Supported Languages** — Select which languages this page supports
- Removing a language hides the page for users browsing in that language

#### Images

- **Header Image** — Fallback header/hero image
- **OG Image** — Social sharing preview image

---

## Understanding Translation Coverage

Each page shows a translation coverage indicator:

### Coverage Indicators

| Percentage | Color | Meaning |
|------------|-------|---------|
| 100% | 🟢 Green | Fully translated |
| 75-99% | 🟡 Yellow | Nearly complete |
| 50-74% | 🟠 Orange | Partially translated |
| 0-49% | 🔴 Red | Needs attention |

### Improving Coverage

1. Open the page editor
2. Go to the Translation tab in settings
3. Use batch translation for missing keys
4. Review AI translations for accuracy

---

## Page Status

### Active vs Inactive

| Status | Meaning | Icon |
|--------|---------|------|
| **Active** | Publicly accessible | 🟢 |
| **Inactive** | Hidden from visitors | ⚪ |

### Changing Status

1. Quick toggle: Click the status indicator in the page list
2. In editor: Update in Page Settings

### When to Deactivate

- Page is under construction
- Seasonal content (out of season)
- Replaced by newer version
- Testing before launch

> ⚠️ **Warning:** Deactivating a page makes it immediately inaccessible. Make sure you don't have active links pointing to it.

---

## Deleting Pages

### How to Delete

1. Click the three-dot menu (⋮) on the page row
2. Select **"Delete"**
3. Confirm the deletion

### What Gets Deleted

- The page and all its sections
- All version history
- All translation key bindings
- SEO settings

### What's Preserved

- Translation content (keys remain in database)
- Activity log entries
- References in other pages' links (they'll become broken)

> ⚠️ **Warning:** Page deletion is permanent. Consider deactivating instead if you might need the page later.

---

## Bulk Actions

### Selecting Multiple Pages

1. Check the boxes next to pages you want to modify
2. The bulk action bar appears at the top

### Available Bulk Actions

| Action | Description |
|--------|-------------|
| **Activate** | Make selected pages live |
| **Deactivate** | Hide selected pages |
| **Delete** | Remove selected pages |

---

## Page Version History

Every page maintains a version history:

- Automatic snapshots on publish
- Manual version saves
- Ability to restore previous versions

See **[Version History](/admin/documentation/user/version-history)** for details.

---

## Troubleshooting

### "URL already exists"

Another page is using that URL. Either:
- Choose a different URL
- Find and update/delete the existing page

### "Page not showing on site"

Check:
1. Is the page status "Active"?
2. Is the URL correct?
3. Are you on the correct language?
4. Clear your browser cache

### "Can't delete page"

You may not have permission. Contact an administrator with the "Admin" role.

---

## What's Next?

- **[Working with Sections](/admin/documentation/user/sections)** — Add content to your pages
- **[Publishing Your Pages](/admin/documentation/user/publishing)** — Go live with confidence
- **[Version History](/admin/documentation/user/version-history)** — Track and restore changes
  `
};

export const userRoleManagementGuide: DocArticle = {
  title: 'User & Role Management',
  description: 'Manage admin users, assign roles, and control access permissions',
  category: 'user',
  slug: 'user-management',
  order: 13,
  tags: ['users', 'roles', 'permissions', 'access control', 'admin'],
  lastUpdated: '2025-01-15',
  content: `
# User & Role Management

Effective user management ensures the right people have access to the right features. This guide covers adding users, assigning roles, and understanding the permission system.

---

## What You'll Learn

- How to add new admin users
- Understanding the role system
- Assigning and changing roles
- Best practices for access control
- Managing user profiles

---

## Accessing User Management

1. Click **"Users"** in the admin sidebar
2. You'll see a list of all admin users

> ⚠️ **Note:** Only users with Admin or Manager roles can access user management.

---

## User List

### User Information Displayed

| Column | Description |
|--------|-------------|
| **User** | Name/email and profile picture |
| **Email** | Login email address |
| **Role** | Assigned permission level |
| **Last Login** | Most recent login timestamp |
| **Created** | Account creation date |
| **Actions** | Edit, delete options |

### Filtering Users

- **Search** — Find users by name or email
- **Role Filter** — Show only users with specific roles
- **Status Filter** — Active or inactive accounts

---

## Understanding Roles

The system uses Role-Based Access Control (RBAC) with five permission levels:

### Admin

**Full system access** — Can do everything

| Can Do | Can't Do |
|--------|----------|
| ✅ Manage all pages | (No restrictions) |
| ✅ Manage all users | |
| ✅ Change system settings | |
| ✅ Delete content permanently | |
| ✅ Access all features | |

> ⚠️ **Warning:** Limit Admin accounts to essential personnel only. With great power comes great responsibility.

### Manager

**Team oversight** — Supervise content and users

| Can Do | Can't Do |
|--------|----------|
| ✅ View all pages | ❌ Delete other admins |
| ✅ Approve content | ❌ Change system settings |
| ✅ Manage regular users | ❌ Access billing |
| ✅ View activity logs | |

### SEO Manager

**SEO and publishing focus**

| Can Do | Can't Do |
|--------|----------|
| ✅ Edit SEO settings | ❌ Manage users |
| ✅ Publish pages | ❌ Delete pages |
| ✅ Manage translations | ❌ Change system settings |
| ✅ View analytics | |

### Content Writer

**Content creation focus**

| Can Do | Can't Do |
|--------|----------|
| ✅ Edit page content | ❌ Publish pages |
| ✅ Add/modify sections | ❌ Edit SEO settings |
| ✅ Upload images | ❌ Manage users |
| ✅ Edit translations | ❌ Delete pages |

### User

**Basic access**

| Can Do | Can't Do |
|--------|----------|
| ✅ View assigned content | ❌ Edit content |
| ✅ Access documentation | ❌ Manage anything |

---

## Adding a New User

### Step 1: Open Add User Form

Click the **"Add Admin"** button in the top right of the Users page.

### Step 2: Enter User Details

| Field | Required | Description |
|-------|----------|-------------|
| **Email** | Yes | Must be a valid email address |
| **Password** | Yes | Minimum 8 characters, mix of letters and numbers |
| **Username** | No | Display name for the user |
| **Gender** | No | Optional profile information |

### Step 3: Assign Role

Select the appropriate role from the dropdown:

- Start with the most restrictive role needed
- Users can be upgraded later if needed
- Avoid giving Admin unless absolutely necessary

### Step 4: Create User

Click **"Create Admin"** to finish. The user will receive login credentials.

> 💡 **Pro Tip:** When onboarding new team members, start with Content Writer and upgrade to SEO Manager or Manager as they demonstrate competence.

---

## Changing User Roles

### How to Change a Role

1. Find the user in the list
2. Click the **"Edit"** button or the user row
3. Select a new role from the dropdown
4. Save changes

### When to Upgrade

- User demonstrates competence at current level
- Job responsibilities change
- Temporary elevation for specific projects

### When to Downgrade

- Role no longer needed
- User leaving position
- Security concerns

> ⚠️ **Warning:** Changing roles takes effect immediately. The user's access changes on their next page load.

---

## Removing Users

### How to Remove

1. Click the trash icon next to the user
2. Confirm the deletion

### What Happens

- User can no longer log in
- Their activity history remains
- Content they created remains
- They can be re-added with a new account

### Alternatives to Deletion

- **Downgrade to User role** — Limits access without deletion
- **Change password** — Blocks access while preserving account

---

## User Profiles

### Viewing Profiles

Click on a user to view their full profile:

- Profile picture
- Username and email
- Assigned roles
- Last login timestamp
- Account creation date

### Profile Updates

Users can update their own profile:

- Display name
- Profile picture
- Password (requires current password)

Admins can update any profile:

- All user-editable fields
- Role assignment
- Account status

---

## Best Practices

### Principle of Least Privilege

Give users the minimum access they need to do their job:

1. Start new users with the Content Writer role
2. Upgrade only when proven necessary
3. Regularly review and downgrade unused privileges

### Regular Audits

Monthly, review:

- Who has Admin access (keep minimal)
- Inactive accounts (remove or downgrade)
- Role appropriateness (matches job function?)

### Password Policies

Encourage users to:

- Use unique passwords
- Change passwords quarterly
- Never share login credentials

### Onboarding Process

For new team members:

1. Create account with appropriate role
2. Send credentials securely (not via email body)
3. Have them change password on first login
4. Provide documentation links
5. Assign a mentor for questions

---

## Activity Tracking

All user actions are logged. See **[Activity Logs](/admin/documentation/user/activity-logs)** for monitoring user behavior and troubleshooting issues.

---

## Troubleshooting

### "User can't log in"

Check:
1. Is the email correct?
2. Is the account active?
3. Has the password been reset recently?
4. Is there an IP ban affecting them?

### "User sees too much/too little"

Review their role assignment. Permissions are role-based, not custom per-user.

### "Can't create new user"

- You may not have Admin or Manager role
- Email might already exist in system
- Check for validation errors

---

## What's Next?

- **[Activity Logs](/admin/documentation/user/activity-logs)** — Monitor user actions
- **[System Settings](/admin/documentation/user/system-settings)** — Configure security options
- **[Admin Portal Overview](/admin/documentation/user/admin-portal)** — Understand the full interface
  `
};

export const currencyLocalizationGuide: DocArticle = {
  title: 'Currency & Localization',
  description: 'Configure currencies, exchange rates, and regional settings',
  category: 'user',
  slug: 'currency-localization',
  order: 14,
  tags: ['currency', 'localization', 'exchange rates', 'regional', 'pricing'],
  lastUpdated: '2025-01-15',
  content: `
# Currency & Localization

Support international visitors by offering prices in their local currency. This guide covers setting up currencies, managing exchange rates, and configuring regional display options.

---

## What You'll Learn

- How to add and manage currencies
- Understanding exchange rate updates
- Configuring currency display
- Setting per-page currency defaults
- Best practices for international pricing

---

## Accessing Currency Management

Click **"Currencies"** in the admin sidebar to open the currency management panel.

---

## Currency List

### Currency Information

| Column | Description |
|--------|-------------|
| **Name** | Currency name (e.g., "US Dollar") |
| **Code** | ISO code (e.g., "USD") |
| **Symbol** | Display symbol (e.g., "$") |
| **Status** | Active or inactive |
| **Default** | Is this the base currency? |

---

## Adding a Currency

### Step 1: Click Add Currency

Find the **"Add Currency"** button at the top of the list.

### Step 2: Enter Currency Details

| Field | Example | Description |
|-------|---------|-------------|
| **Name** | Euro | Full currency name |
| **Code** | EUR | 3-letter ISO code |
| **Symbol** | € | Display symbol |
| **Active** | Yes | Show to visitors |

### Step 3: Save

The currency is now available for use.

> 💡 **Pro Tip:** Add only currencies you actively support. Too many options can overwhelm visitors.

---

## Default Currency

One currency is designated as the "default" or base currency:

- All prices are stored in this currency
- Exchange rates are relative to this currency
- Typically USD or your primary market currency

### Changing the Default

1. Click the star icon next to the currency
2. Confirm the change

> ⚠️ **Warning:** Changing the default currency requires recalculating all prices. Do this only during initial setup.

---

## Exchange Rates

### Automatic Rate Updates

The system can automatically fetch current exchange rates:

1. Click **"Fetch Rates"** button
2. Rates are retrieved from a reliable financial API
3. All active currencies are updated

### Manual Rate Entry

For specific rate overrides:

1. Click the edit button next to a currency
2. Enter the exchange rate manually
3. Save changes

### Rate Display

| Currency | Rate vs USD | Display Price |
|----------|-------------|---------------|
| USD | 1.00 | $100.00 |
| EUR | 0.92 | €92.00 |
| GBP | 0.79 | £79.00 |
| JPY | 149.50 | ¥14,950 |

---

## Currency Display on Pages

### Price Switcher

Visitors can toggle between currencies using the price switcher:

- Appears on pages with \`showPriceSwitcher\` enabled
- Shows all active currencies
- Remembers visitor's preference

### Enabling the Switcher

In page settings:

1. Open Page Settings
2. Toggle **"Show Price Switcher"** to On
3. Save

### Per-Page Default Currency

Set a different default currency for specific pages:

- Useful for country-targeted landing pages
- Override in Page Settings → Default Currency

---

## Formatting Options

Currencies display differently by locale:

| Locale | Format |
|--------|--------|
| US | $1,234.56 |
| UK | £1,234.56 |
| Germany | 1.234,56 € |
| Japan | ¥1,235 |

The system automatically formats based on the currency's standard conventions.

---

## Best Practices

### Currency Selection

| Do | Don't |
|----|-------|
| ✅ Include currencies for your main markets | ❌ Add every possible currency |
| ✅ Keep the list focused (5-10 currencies) | ❌ Include obsolete currencies |
| ✅ Update rates regularly | ❌ Set rates once and forget |

### Pricing Strategy

- **Round up** slightly after conversion (covers exchange fluctuation)
- **Consider psychological pricing** (€99 vs €97.23)
- **Review converted prices** make sense in each market

### Rate Updates

- Update rates at least weekly for accuracy
- More frequent updates for volatile currencies
- Document when you last updated rates

---

## Troubleshooting

### "Exchange rates not fetching"

- Check internet connection
- The rate API might be temporarily unavailable
- Try again in a few minutes

### "Wrong currency showing"

- Check the page's default currency setting
- Clear browser cache
- Verify the currency is active

### "Price formatting looks wrong"

- Verify the currency symbol is correct
- Check that the code matches standard ISO codes

---

## What's Next?

- **[Multi-Language Guide](/admin/documentation/user/translations)** — Combine currencies with translations
- **[Pricing Section](/admin/documentation/user/sections)** — Display prices beautifully
- **[Publishing](/admin/documentation/user/publishing)** — Launch international pages
  `
};

export const announcementsBannersGuide: DocArticle = {
  title: 'Announcements & Banners',
  description: 'Create and manage site-wide announcements and promotional banners',
  category: 'user',
  slug: 'announcements',
  order: 15,
  tags: ['announcements', 'banners', 'promotions', 'notifications', 'alerts'],
  lastUpdated: '2025-01-15',
  content: `
# Announcements & Banners

Keep your visitors informed with site-wide announcements. From promotional sales to important updates, announcements grab attention at the top of every page.

---

## What You'll Learn

- Creating and editing announcements
- Styling and customization options
- Activating and deactivating announcements
- Best practices for effective messaging

---

## Accessing Announcements

There are two places to manage announcements:

1. **Admin Dashboard** → Announcements section
2. **Settings** → Announcements tab

---

## Announcement List

### Information Displayed

| Column | Description |
|--------|-------------|
| **Title** | Internal name for reference |
| **Message** | The actual announcement text |
| **Status** | Active (showing) or Inactive (hidden) |
| **Created** | When it was created |
| **Actions** | Edit, activate/deactivate, delete |

---

## Creating an Announcement

### Step 1: Click Add Announcement

Find the **"Add Announcement"** button.

### Step 2: Enter Content

| Field | Description |
|-------|-------------|
| **Title** | Internal reference name (not shown publicly) |
| **Message** | The text visitors will see |
| **Link** | Optional URL for "Learn More" or CTA |
| **Link Text** | Text for the clickable link |

### Step 3: Customize Appearance

| Option | Description |
|--------|-------------|
| **Background Color** | Banner background (hex or color picker) |
| **Text Color** | Message text color |
| **Dismissible** | Can visitors close the banner? |

### Step 4: Save

The announcement is created (but not yet active).

---

## Activating Announcements

### Quick Toggle

Click the status toggle in the list to activate/deactivate instantly.

### In Edit Mode

1. Open the announcement
2. Toggle **"Is Active"**
3. Save changes

### Only One Active

> 💡 **Note:** Only one announcement can be active at a time. Activating a new one may deactivate the previous one.

---

## Writing Effective Announcements

### Message Guidelines

| Do | Don't |
|----|-------|
| ✅ Keep it short (under 100 characters) | ❌ Write paragraphs |
| ✅ Include a clear call to action | ❌ Be vague |
| ✅ Create urgency when appropriate | ❌ Always use urgency (becomes ignored) |
| ✅ Be specific about offers | ❌ Overpromise |

### Example Announcements

**Promotional:**
> "🎉 Summer Sale! 30% off all hosting plans. Use code SUMMER30"

**Informational:**
> "📅 Scheduled maintenance on Jan 20th, 2-4am EST. Learn more"

**Urgent:**
> "⚠️ New security update available. Update your password"

---

## Color Recommendations

### Standard Colors

| Type | Background | Text |
|------|------------|------|
| **Info** | #3B82F6 (blue) | #FFFFFF |
| **Success** | #10B981 (green) | #FFFFFF |
| **Warning** | #F59E0B (amber) | #000000 |
| **Promotion** | #8B5CF6 (purple) | #FFFFFF |
| **Urgent** | #EF4444 (red) | #FFFFFF |

### Contrast is Key

Always ensure sufficient contrast between background and text colors for readability.

---

## Dismissible Banners

When **"Dismissible"** is enabled:

- A close (×) button appears
- Visitors can hide the banner
- Their preference is remembered (until cleared)

### When to Make Dismissible

- Promotional announcements
- Non-urgent information
- Recurring visitors might find it annoying

### When NOT to Make Dismissible

- Critical security updates
- Mandatory legal notices
- Time-sensitive urgent information

---

## Scheduling (Coming Soon)

Future versions will support:

- Start and end dates
- Automatic activation/deactivation
- Timezone-aware scheduling

For now, manually toggle announcements on the desired dates.

---

## Troubleshooting

### "Announcement not showing"

Check:
1. Is the status set to Active?
2. Clear browser cache
3. Check if another announcement is taking priority

### "Banner looks different on mobile"

The banner automatically adjusts for mobile screens:
- Text may wrap
- Longer messages become scrollable
- Test on actual mobile devices

### "Link not working"

- Verify the URL is complete (include https://)
- Check for typos
- Test the link in a new tab

---

## Best Practices Summary

1. **One message at a time** — Don't overwhelm visitors
2. **Short and clear** — Get to the point
3. **Strong contrast** — Ensure readability
4. **Clear CTA** — What should they do?
5. **Remove promptly** — Don't leave stale announcements

---

## What's Next?

- **[System Settings](/admin/documentation/user/system-settings)** — Configure more display options
- **[Publishing](/admin/documentation/user/publishing)** — Make announcements live
  `
};

export const systemSettingsGuide: DocArticle = {
  title: 'System Settings & Security',
  description: 'Configure website customization, security settings, and integrations',
  category: 'user',
  slug: 'system-settings',
  order: 16,
  tags: ['settings', 'security', 'customization', 'integrations', 'configuration'],
  lastUpdated: '2025-01-15',
  content: `
# System Settings & Security

The Settings page is your control center for site-wide configuration, security measures, and third-party integrations. This guide covers every tab and option available.

---

## What You'll Learn

- Website customization options
- Security settings and IP banning
- Integration configuration
- System status monitoring

---

## Accessing Settings

Click **"Settings"** in the admin sidebar. You'll see several tabs:

1. Website Customization
2. Ban Users
3. Integrations
4. System Status

---

## Website Customization

### Logo Management

Upload and manage your site logos:

| Logo Type | Where It Appears | Recommended Size |
|-----------|------------------|------------------|
| **Website Logo** | Public site header | 200×60px |
| **Favicon** | Browser tab icon | 32×32px or 16×16px |
| **Admin Logo** | Admin panel header | 200×60px |

### Uploading a Logo

1. Click the upload area or drag a file
2. Select your image (PNG, JPG, SVG supported)
3. Preview the result
4. Save changes

> 💡 **Pro Tip:** Use SVG format for logos — they scale perfectly on all screen sizes.

### Logo Guidelines

| Do | Don't |
|----|-------|
| ✅ Use transparent backgrounds (PNG/SVG) | ❌ Use JPEG with white background |
| ✅ Ensure adequate contrast | ❌ Use very thin fonts |
| ✅ Test on both light/dark backgrounds | ❌ Upload huge file sizes |

---

## Ban Users (IP Blocking)

Protect your site by blocking malicious IP addresses.

### When to Ban IPs

- Repeated failed login attempts
- Spam or abuse from specific IPs
- Known bot/scraper traffic
- Security threats

### Adding an IP Ban

1. Go to Settings → Ban Users
2. Click **"Add IP Ban"**
3. Enter the IP address
4. Optionally add a reason for the ban
5. Save

### IP Format

| Format | Example | Description |
|--------|---------|-------------|
| Single IP | 192.168.1.100 | Blocks one address |
| CIDR | 192.168.1.0/24 | Blocks range (256 IPs) |

### Managing Bans

- View all banned IPs in the list
- See who banned each IP and when
- Remove bans by clicking the delete button

> ⚠️ **Warning:** Be careful with CIDR ranges — you might accidentally block legitimate visitors. Start with single IPs unless you're certain.

### What Happens to Banned Users

- Blocked from accessing the public site
- Blocked from admin login
- See a generic error page
- No indication they're specifically banned

---

## Integrations

### Cloudflare Integration

Connect Cloudflare for enhanced performance and cache management.

#### Configuration

| Field | Description |
|-------|-------------|
| **API Token** | Your Cloudflare API token |
| **Zone ID** | The zone ID for your domain |

#### Getting Cloudflare Credentials

1. Log into Cloudflare dashboard
2. Go to your domain's overview
3. Find Zone ID in the right sidebar
4. Create an API token with "Cache Purge" permission

#### Cache Purging

With Cloudflare configured:

- Pages can have their cache purged on publish
- Manual cache purge available in page settings
- Ensures visitors see latest content

### Future Integrations

Coming soon:

- Analytics platforms
- Email services
- CRM connections

---

## System Status

Monitor the health of all system components:

### Status Indicators

| Status | Icon | Meaning |
|--------|------|---------|
| **Healthy** | 🟢 | Operating normally |
| **Degraded** | 🟡 | Partial issues |
| **Down** | 🔴 | Service unavailable |

### Monitored Services

| Service | What It Does |
|---------|--------------|
| **Database** | Stores all content and settings |
| **Authentication** | Handles user login |
| **Storage** | Manages file uploads |
| **Edge Functions** | Powers dynamic features |
| **Realtime** | Live collaboration features |

### Manual Status Check

Click **"Refresh Status"** to get the latest status of all services.

### When Services Are Down

If a service shows as down:

1. Check if it's a known outage (check Supabase status page)
2. Wait a few minutes and refresh
3. If persistent, contact support

---

## Security Best Practices

### Regular Tasks

| Task | Frequency |
|------|-----------|
| Review user roles | Monthly |
| Audit IP ban list | Quarterly |
| Update passwords | Quarterly |
| Check activity logs | Weekly |

### Password Policies

Enforce strong passwords:

- Minimum 8 characters
- Mix of letters, numbers, symbols
- No dictionary words
- Unique to this system

### Access Control

- Give minimum necessary permissions
- Remove access when roles change
- Use dedicated accounts (no sharing)

### Monitoring

Review activity logs for:

- Failed login attempts
- Unusual edit patterns
- Access from unexpected locations

---

## Troubleshooting

### "Logo not updating"

1. Clear browser cache
2. Wait a few minutes (CDN caching)
3. Try uploading again
4. Check file size isn't too large

### "IP ban not working"

1. Verify the IP format is correct
2. Check if they're using a VPN
3. Consider banning a wider range

### "Integration not connecting"

1. Double-check credentials
2. Ensure API token has correct permissions
3. Verify the Zone ID matches your domain

### "Status showing false positive"

1. Click refresh to get latest status
2. Brief outages may resolve themselves
3. Check external status pages

---

## What's Next?

- **[Activity Logs](/admin/documentation/user/activity-logs)** — Monitor what's happening
- **[User Management](/admin/documentation/user/user-management)** — Manage access
- **[Publishing](/admin/documentation/user/publishing)** — Put settings into effect
  `
};

export const activityLogsGuide: DocArticle = {
  title: 'Activity Logs & Monitoring',
  description: 'Track user actions, monitor system activity, and troubleshoot issues',
  category: 'user',
  slug: 'activity-logs',
  order: 17,
  tags: ['activity', 'logs', 'monitoring', 'audit', 'tracking'],
  lastUpdated: '2025-01-15',
  content: `
# Activity Logs & Monitoring

Activity logs provide a comprehensive record of everything happening in your system. Use them to track changes, audit user behavior, and troubleshoot issues.

---

## What You'll Learn

- Understanding the activity log
- Filtering and searching logs
- Interpreting different activity types
- Using logs for troubleshooting
- Audit and compliance best practices

---

## Accessing Activity Logs

Click **"Activity"** in the admin sidebar to view the activity log.

---

## Activity Log Interface

### Log Entry Information

Each log entry shows:

| Field | Description |
|-------|-------------|
| **Timestamp** | When the action occurred |
| **User** | Who performed the action |
| **Activity Type** | Category of action |
| **Title** | Brief description |
| **Description** | Detailed explanation |
| **Entity** | What was affected |

### Real-Time Updates

The activity log updates in real-time. New entries appear automatically without refreshing.

---

## Activity Types

### Content Activities

| Type | Description |
|------|-------------|
| **page_created** | New page added |
| **page_updated** | Page content modified |
| **page_published** | Page made live |
| **page_unpublished** | Page taken offline |
| **page_deleted** | Page removed |
| **section_added** | New section added to page |
| **section_modified** | Section content changed |
| **section_deleted** | Section removed |

### User Activities

| Type | Description |
|------|-------------|
| **user_login** | User signed in |
| **user_logout** | User signed out |
| **user_created** | New user account |
| **user_updated** | User profile changed |
| **user_role_changed** | Role assignment modified |
| **user_deleted** | User account removed |

### System Activities

| Type | Description |
|------|-------------|
| **settings_updated** | System settings changed |
| **translation_added** | New translation created |
| **translation_modified** | Translation content changed |
| **cache_purged** | CDN cache cleared |
| **ip_banned** | IP address blocked |
| **announcement_created** | New announcement |

---

## Filtering Logs

### By Time Range

Filter logs to specific periods:

- Last hour
- Last 24 hours
- Last 7 days
- Last 30 days
- Custom range

### By Activity Type

Show only specific types:

- Content changes
- User activities
- System events
- Errors only

### By User

Filter to see actions by a specific user — useful for auditing individual behavior.

### Search

Use the search box to find logs containing specific text:

- Page names
- User emails
- Keywords in descriptions

---

## Reading Log Details

### Understanding Entries

**Example Entry:**

\`\`\`
2025-01-15 14:32:15
User: john@example.com
Type: page_updated
Title: Page content updated
Description: Updated 3 sections on "Homepage"
Entity: pages/abc123
\`\`\`

### Metadata

Click on an entry to expand additional details:

- IP address of the user
- Browser/device information
- Before/after values (when applicable)
- Related entity links

---

## Common Use Cases

### "Who changed this page?"

1. Filter by activity type: **page_updated**
2. Filter by entity: [page ID or name]
3. Review the timeline of changes

### "What did this user do?"

1. Filter by user email
2. Set time range
3. Review all their actions

### "When was this setting changed?"

1. Filter by activity type: **settings_updated**
2. Expand entries to see what changed

### "Why isn't this working?"

1. Look for recent error logs
2. Check for recent setting changes
3. Look for delete or unpublish actions

---

## Audit Trail

### Compliance Requirements

Activity logs help meet compliance requirements:

- **Who** did **what**, **when**, and **where**
- Immutable record (can't be edited or deleted)
- Retention for legal/compliance periods

### Exporting Logs

Export logs for external analysis or record-keeping:

1. Set your filter criteria
2. Click **"Export"**
3. Choose format (CSV, JSON)
4. Download the file

### Retention Period

Logs are retained for 90 days by default. Older logs are automatically archived.

---

## Dashboard Activity Widget

The main dashboard shows recent activity in a condensed view:

- Last 5-10 actions
- Quick overview without leaving dashboard
- Click "View All" to open full activity log

---

## Troubleshooting with Logs

### Page Not Displaying Correctly

1. Check for recent page updates
2. Look for unpublish actions
3. Check for section deletions

### User Can't Login

1. Search for their email
2. Look for **user_login** failures
3. Check for **ip_banned** entries
4. Look for **user_deleted** or role changes

### Settings Not Taking Effect

1. Filter for **settings_updated**
2. Verify the change was saved
3. Look for subsequent changes that might have overwritten

---

## Best Practices

### Regular Monitoring

| Task | Frequency |
|------|-----------|
| Quick dashboard check | Daily |
| Review user activity | Weekly |
| Full audit review | Monthly |
| Export for compliance | Quarterly |

### What to Watch For

| Pattern | Possible Issue |
|---------|----------------|
| Multiple failed logins | Brute force attempt |
| Unusual hours | Compromised account |
| Mass deletions | Accidental or malicious |
| Role escalations | Unauthorized access |

### Responding to Issues

1. Identify the user and action
2. Contact the user if legitimate
3. If malicious: ban IP, disable account
4. Document the incident
5. Implement preventive measures

---

## What's Next?

- **[System Settings](/admin/documentation/user/system-settings)** — Configure security settings
- **[User Management](/admin/documentation/user/user-management)** — Manage user access
  `
};

export const workingWithImagesGuide: DocArticle = {
  title: 'Working with Images',
  description: 'Upload, manage, and optimize images for your pages',
  category: 'user',
  slug: 'images',
  order: 8,
  tags: ['images', 'upload', 'media', 'optimization', 'storage'],
  lastUpdated: '2025-01-15',
  content: `
# Working with Images

Images make your pages visually engaging and help communicate your message. This guide covers uploading, managing, and optimizing images throughout the page builder.

---

## What You'll Learn

- How to upload images
- Where images can be used
- Image optimization best practices
- Managing your media library
- Accessibility guidelines

---

## Uploading Images

### In the Page Editor

#### Method 1: Image Sections

1. Add or select a section with image properties (Hero, Features, Team, etc.)
2. In the Settings Panel, find the image field
3. Click the image placeholder or "Upload" button
4. Select your image file
5. The image uploads and appears in preview

#### Method 2: Background Images

1. Select any section
2. Go to the **Style** tab
3. Find **Background** settings
4. Choose "Image" as background type
5. Upload your background image
6. Adjust overlay and positioning

### Drag and Drop

Many image fields support drag and drop:

1. Drag an image file from your computer
2. Drop it onto the designated area
3. Wait for upload to complete

---

## Supported Formats

| Format | Extension | Best For |
|--------|-----------|----------|
| **JPEG** | .jpg, .jpeg | Photos, complex images |
| **PNG** | .png | Graphics, transparency |
| **WebP** | .webp | Modern web (best compression) |
| **SVG** | .svg | Logos, icons (scalable) |
| **GIF** | .gif | Simple animations |

> 💡 **Pro Tip:** Use WebP format when possible — it offers the best quality-to-size ratio for web.

---

## Size Guidelines

### Recommended Dimensions

| Image Type | Recommended Size | Max File Size |
|------------|------------------|---------------|
| **Hero Image** | 1920×1080px | 500KB |
| **Section Background** | 1920×1080px | 500KB |
| **Feature Image** | 800×600px | 200KB |
| **Team Photo** | 400×400px (square) | 100KB |
| **Logo** | 400×200px | 50KB |
| **Icon** | 64×64px or SVG | 20KB |
| **Blog Thumbnail** | 600×400px | 150KB |
| **OG Image (Social)** | 1200×630px | 300KB |

### File Size Limits

- Maximum upload size: 5MB per file
- Recommended: Keep images under 500KB
- Smaller is better for performance

---

## Image Optimization

### Before Uploading

1. **Resize** to the actual dimensions needed (not larger)
2. **Compress** using tools like TinyPNG, Squoosh, or ImageOptim
3. **Choose the right format** (see table above)

### Optimization Tools

| Tool | Type | Link |
|------|------|------|
| TinyPNG | Online | tinypng.com |
| Squoosh | Online | squoosh.app |
| ImageOptim | Mac App | imageoptim.com |
| ShortPixel | Online | shortpixel.com |

### Compression Targets

| Image Type | Target Size |
|------------|-------------|
| Large hero/background | Under 300KB |
| Medium content images | Under 150KB |
| Thumbnails | Under 50KB |
| Icons/logos | Under 20KB |

---

## Background Images

### Setting a Background

1. Select the section
2. Open **Style** tab
3. Find **Background** section
4. Select type: **Image**
5. Upload your image
6. Configure options:

| Option | Description |
|--------|-------------|
| **Position** | Where the image anchors (center, top, etc.) |
| **Size** | Cover, contain, or custom |
| **Repeat** | Tile the image or no-repeat |
| **Attachment** | Fixed (parallax) or scroll |
| **Overlay** | Color overlay with opacity |

### Overlay Tips

Add a semi-transparent overlay to:

- Improve text readability
- Create mood/atmosphere
- Match brand colors
- Darken busy images

**Example:** Black overlay at 50% opacity makes white text readable on any image.

---

## Image Alt Text

### Why Alt Text Matters

- **Accessibility:** Screen readers read alt text to visually impaired users
- **SEO:** Search engines use alt text to understand images
- **Fallback:** Shows when images fail to load

### Writing Good Alt Text

| Do | Don't |
|----|-------|
| ✅ Describe what's in the image | ❌ Start with "Image of..." |
| ✅ Be concise (under 125 characters) | ❌ Stuff keywords |
| ✅ Include relevant context | ❌ Leave empty |
| ✅ Describe function for buttons/links | ❌ Write "Photo" or "Picture" |

### Examples

**Good:**
> "Business team collaborating around a conference table"

**Bad:**
> "Image of business, meeting, corporate, teamwork, office"

---

## Image Storage

### Where Images Are Stored

Uploaded images are stored in secure cloud storage (Supabase Storage):

- Automatically backed up
- Served via CDN for fast loading
- Optimized for web delivery

### Organization

Images are organized by:

- Page they belong to
- Section type
- Upload date

### Storage Limits

Check your plan for storage limits. Optimize images to maximize available space.

---

## Common Image Types by Section

### Hero Section

- Large background image (1920×1080)
- High impact, sets the mood
- Consider overlay for text readability

### Features Section

- Feature icons or illustrations
- Consistent style across all features
- SVG preferred for scalability

### Team Section

- Professional headshots
- Consistent size and cropping (square works well)
- Similar lighting/background

### Testimonials

- Customer photos/avatars
- Can be smaller (100-200px)
- Consistent shape (circle or square)

### Blog Grid

- Article thumbnails
- Consistent aspect ratio (16:9 or 4:3)
- Compelling preview images

---

## Troubleshooting

### "Image won't upload"

Check:
1. File size (under 5MB)
2. File format (JPG, PNG, WebP, SVG, GIF)
3. Internet connection
4. Browser permissions

### "Image looks blurry"

- Original image may be too small
- Upload at least 2x the display size
- Use higher quality export settings

### "Image loads slowly"

- Compress the image more
- Reduce dimensions
- Convert to WebP format

### "Background image not covering section"

- Set background size to "Cover"
- Use an image with correct aspect ratio
- Adjust background position

---

## Accessibility Checklist

Before publishing, ensure:

- [ ] All images have descriptive alt text
- [ ] Decorative images have empty alt (alt="")
- [ ] Text over images has sufficient contrast
- [ ] Images are not the only way to convey information
- [ ] Color isn't the only differentiator

---

## What's Next?

- **[Styling Your Pages](/admin/documentation/user/styling)** — Advanced visual customization
- **[Working with Sections](/admin/documentation/user/sections)** — Using images in sections
- **[Publishing](/admin/documentation/user/publishing)** — Optimize for production
  `
};
