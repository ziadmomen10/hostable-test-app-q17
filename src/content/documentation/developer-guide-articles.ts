// Additional Developer Guide Documentation Articles
// These articles cover authentication, advanced components, and hooks reference

import { DocArticle } from './index';

// ============================================================================
// NEW DEVELOPER GUIDE ARTICLES
// ============================================================================

export const authenticationGuide: DocArticle = {
  title: 'Authentication & Authorization',
  description: 'Complete guide to the auth system, roles, and access control',
  category: 'developer',
  slug: 'authentication',
  order: 3,
  tags: ['auth', 'authentication', 'authorization', 'roles', 'RBAC', 'security'],
  lastUpdated: '2025-01-15',
  content: `
# Authentication & Authorization

The page builder uses a robust authentication system built on Supabase Auth with Role-Based Access Control (RBAC). This guide covers the complete authentication architecture, from user login to permission checks.

---

## What You'll Learn

- Authentication architecture and flow
- Using the \`useAuth\` hook
- Role-based access control (RBAC)
- Protected route patterns
- Session management

---

## Architecture Overview

\`\`\`mermaid
graph TD
    A[User] --> B[Login Form]
    B --> C[Supabase Auth]
    C --> D{Valid?}
    D -->|Yes| E[Create Session]
    D -->|No| F[Show Error]
    E --> G[Fetch User Roles]
    G --> H[AuthContext Updated]
    H --> I[App Re-renders]
    I --> J[Protected Routes Check Roles]
\`\`\`

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **AuthContext** | \`src/contexts/AuthContext.tsx\` | Global auth state provider |
| **useAuth** | \`src/contexts/AuthContext.tsx\` | Hook to access auth state |
| **AdminRoute** | \`src/components/AdminRoute.tsx\` | Protected route wrapper |
| **AdminLogin** | \`src/components/AdminLogin.tsx\` | Login form component |

---

## AuthContext

The \`AuthContext\` provides authentication state throughout the application.

### Context Type Definition

\`\`\`typescript
interface AuthContextType {
  // State
  user: User | null;              // Current Supabase user
  session: Session | null;        // Current session
  loading: boolean;               // Initial load state
  isAdmin: boolean;               // Has admin role
  userRoles: string[];            // All assigned roles
  
  // Methods
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
\`\`\`

### Wrapping Your App

\`\`\`tsx
// In App.tsx or main.tsx
import { AuthProvider } from '@/contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
\`\`\`

---

## useAuth Hook

Access authentication state anywhere in your app:

\`\`\`typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user, 
    session, 
    loading, 
    isAdmin, 
    userRoles,
    signIn,
    signOut,
    refreshProfile 
  } = useAuth();

  if (loading) return <LoadingSpinner />;
  
  if (!user) return <LoginPrompt />;
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <p>Roles: {userRoles.join(', ')}</p>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
\`\`\`

---

## Sign In Flow

### Basic Sign In

\`\`\`typescript
const { signIn } = useAuth();

const handleLogin = async (email: string, password: string) => {
  const result = await signIn(email, password);
  
  if (result.success) {
    // User is now logged in
    // Redirect to dashboard
    navigate('/admin');
  } else {
    // Show error
    toast.error(result.error);
  }
};
\`\`\`

### What Happens on Sign In

1. Credentials sent to Supabase Auth
2. If valid, session created
3. User roles fetched from \`user_roles\` table
4. \`isAdmin\` computed from roles
5. Context updates, components re-render
6. Protected routes become accessible

---

## Role-Based Access Control (RBAC)

### Database Schema

Roles are stored in a dedicated table (NEVER on the user or profile table):

\`\`\`sql
-- Role enum
CREATE TYPE public.app_role AS ENUM (
  'admin', 
  'manager', 
  'seo_manager', 
  'content_writer', 
  'user'
);

-- Roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);
\`\`\`

### Role Hierarchy

| Role | Level | Inherits From |
|------|-------|---------------|
| **admin** | 5 | All permissions |
| **manager** | 4 | seo_manager, content_writer |
| **seo_manager** | 3 | content_writer |
| **content_writer** | 2 | user |
| **user** | 1 | None |

### Checking Roles in Components

\`\`\`typescript
const { userRoles, isAdmin } = useAuth();

// Check for specific role
const canEdit = userRoles.includes('content_writer') || isAdmin;

// Check for any of multiple roles
const canPublish = userRoles.some(role => 
  ['admin', 'manager', 'seo_manager'].includes(role)
);
\`\`\`

---

## Database Security Function

Use this security definer function to check roles in RLS policies:

\`\`\`sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
\`\`\`

### Using in RLS Policies

\`\`\`sql
-- Only admins can select all rows
CREATE POLICY "Admins can select all"
ON public.some_table
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Content writers can edit their own content
CREATE POLICY "Writers can edit own content"
ON public.pages
FOR UPDATE
TO authenticated
USING (
  created_by = auth.uid() 
  OR public.has_role(auth.uid(), 'admin')
);
\`\`\`

---

## Protected Routes

### AdminRoute Component

Wrap admin pages with \`AdminRoute\` for protection:

\`\`\`tsx
import { AdminRoute } from '@/components/AdminRoute';

// In your router
{
  path: '/admin',
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  ),
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'pages', element: <PagesPage /> },
  ]
}
\`\`\`

### How AdminRoute Works

\`\`\`tsx
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  
  // Wait for auth to initialize
  if (loading) return <LoadingSpinner />;
  
  // Not logged in - show login
  if (!user) return <AdminLogin />;
  
  // Not admin - show access denied
  if (!isAdmin) return <AccessDenied />;
  
  // All good - render children
  return <>{children}</>;
}
\`\`\`

### Role-Specific Routes

For more granular control:

\`\`\`tsx
function ProtectedRoute({ 
  children, 
  requiredRoles 
}: { 
  children: React.ReactNode; 
  requiredRoles: string[];
}) {
  const { userRoles, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  const hasAccess = requiredRoles.some(role => userRoles.includes(role));
  
  if (!hasAccess) return <AccessDenied />;
  
  return <>{children}</>;
}

// Usage
<ProtectedRoute requiredRoles={['admin', 'seo_manager']}>
  <SEOSettings />
</ProtectedRoute>
\`\`\`

---

## Session Management

### Session Persistence

Sessions are automatically:

- Stored in localStorage
- Refreshed before expiration
- Restored on page reload

### Checking Session Status

\`\`\`typescript
const { session } = useAuth();

if (session) {
  console.log('Expires at:', session.expires_at);
  console.log('Access token:', session.access_token);
}
\`\`\`

### Force Session Refresh

\`\`\`typescript
const { refreshProfile } = useAuth();

// After updating user roles in database
await updateUserRoles(userId, newRoles);
await refreshProfile(); // Re-fetch roles
\`\`\`

---

## Sign Out

\`\`\`typescript
const { signOut } = useAuth();

const handleLogout = async () => {
  await signOut();
  navigate('/');
};
\`\`\`

### What Happens on Sign Out

1. Supabase session destroyed
2. Local storage cleared
3. Auth state reset
4. User redirected to login

---

## Security Best Practices

### Never Trust Client-Side Role Checks

Client-side checks are for UI only. Always enforce in:

- RLS policies (database level)
- Edge functions (server level)

\`\`\`typescript
// Client-side: Only for UI
const showAdminButton = isAdmin;

// Server-side: Actually enforced
// RLS policy: USING (public.has_role(auth.uid(), 'admin'))
\`\`\`

### Common Security Mistakes

| Mistake | Why It's Bad | Fix |
|---------|--------------|-----|
| Roles in profile table | Easy to escalate | Use separate user_roles table |
| Client-only role checks | Easily bypassed | Use RLS policies |
| Storing roles in localStorage | Can be modified | Fetch from database |
| Hardcoded admin emails | Inflexible, insecure | Use proper role system |

---

## Troubleshooting

### "User logged in but isAdmin is false"

1. Check \`user_roles\` table for the user
2. Verify role is exactly 'admin'
3. Call \`refreshProfile()\` to re-fetch

### "Protected route flashes login"

Add loading state check:

\`\`\`tsx
if (loading) return <LoadingSpinner />;
// Then check auth state
\`\`\`

### "Session expired unexpectedly"

Check Supabase project settings for JWT expiry time. Default is 1 hour, configurable in dashboard.

---

## Next Steps

- **[API Reference](/admin/documentation/developer/api)** — Auth-related API functions
- **[Best Practices](/admin/documentation/developer/best-practices)** — Security patterns
- **[User Presence System](/admin/documentation/developer/presence)** — Real-time user tracking
  `
};

export const userPresenceGuide: DocArticle = {
  title: 'User Presence System',
  description: 'Real-time online user tracking and collaborative presence features',
  category: 'developer',
  slug: 'presence',
  order: 4,
  tags: ['presence', 'realtime', 'collaboration', 'online', 'users'],
  lastUpdated: '2025-01-15',
  content: `
# User Presence System

The presence system enables real-time tracking of online users, supporting collaborative editing features like "who's editing this page" indicators. This guide covers the architecture and implementation.

---

## What You'll Learn

- Presence architecture using Supabase Realtime
- The \`UserPresenceProvider\` component
- Using the \`useUserPresence\` hook
- Building presence indicators
- Performance considerations

---

## Architecture Overview

\`\`\`mermaid
sequenceDiagram
    participant User as User Browser
    participant Provider as PresenceProvider
    participant Channel as Supabase Channel
    participant Others as Other Users
    
    User->>Provider: Mount component
    Provider->>Channel: Subscribe to presence
    Channel-->>Provider: Sync current presence
    Provider->>Channel: Track user state
    Channel-->>Others: Broadcast presence
    Others-->>Channel: Their presence
    Channel-->>Provider: Presence updates
    Provider->>User: Update UI
\`\`\`

### Key Components

| Component | File | Purpose |
|-----------|------|---------|
| **UserPresenceProvider** | \`src/components/UserPresenceProvider.tsx\` | Context provider |
| **useUserPresence** | \`src/hooks/useUserPresence.tsx\` | Hook to access presence |

---

## UserPresenceProvider

The provider manages the presence channel and state:

### Setup

\`\`\`tsx
import { UserPresenceProvider } from '@/components/UserPresenceProvider';

function App() {
  return (
    <AuthProvider>
      <UserPresenceProvider>
        <RouterProvider router={router} />
      </UserPresenceProvider>
    </AuthProvider>
  );
}
\`\`\`

### Provider Features

- Automatically subscribes on mount
- Tracks current user's presence
- Receives other users' presence updates
- Cleans up on unmount

---

## useUserPresence Hook

Access presence data anywhere in your app:

\`\`\`typescript
import { useUserPresence } from '@/hooks/useUserPresence';

function OnlineUsers() {
  const { 
    onlineUsers,        // Array of online user info
    isConnected,        // Channel connection status
    currentUserId,      // Current user's ID
    updatePresence,     // Update current user's state
  } = useUserPresence();
  
  return (
    <div className="flex gap-2">
      {onlineUsers.map(user => (
        <Avatar 
          key={user.id}
          src={user.avatar}
          alt={user.name}
        />
      ))}
      <span>{onlineUsers.length} online</span>
    </div>
  );
}
\`\`\`

---

## Presence Data Structure

Each online user's presence includes:

\`\`\`typescript
interface UserPresence {
  id: string;           // User ID
  email: string;        // User email
  name?: string;        // Display name
  avatar?: string;      // Profile picture URL
  currentPage?: string; // Page they're viewing
  lastSeen: Date;       // Last activity timestamp
  status: 'online' | 'away' | 'busy';
}
\`\`\`

---

## Updating Presence

### Automatic Updates

The provider automatically updates presence when:

- User opens the app
- User navigates to a different page
- User goes idle (status changes to 'away')
- User closes the app (presence removed)

### Manual Updates

\`\`\`typescript
const { updatePresence } = useUserPresence();

// Update current page
updatePresence({ currentPage: '/admin/pages/123' });

// Update status
updatePresence({ status: 'busy' });

// Update multiple fields
updatePresence({ 
  currentPage: '/admin/editor/456',
  status: 'online'
});
\`\`\`

---

## Building Presence Indicators

### Online Users List

\`\`\`tsx
function OnlineUsersList() {
  const { onlineUsers, isConnected } = useUserPresence();
  
  if (!isConnected) {
    return <div className="text-muted">Connecting...</div>;
  }
  
  return (
    <div className="space-y-2">
      <h3>Online Now ({onlineUsers.length})</h3>
      {onlineUsers.map(user => (
        <div key={user.id} className="flex items-center gap-2">
          <div className="relative">
            <Avatar src={user.avatar} />
            <span 
              className={\`absolute bottom-0 right-0 w-3 h-3 rounded-full 
                \${user.status === 'online' ? 'bg-green-500' : 
                  user.status === 'away' ? 'bg-yellow-500' : 'bg-red-500'}\`}
            />
          </div>
          <span>{user.name || user.email}</span>
        </div>
      ))}
    </div>
  );
}
\`\`\`

### "Editing This Page" Indicator

\`\`\`tsx
function PageEditors({ pageId }: { pageId: string }) {
  const { onlineUsers, currentUserId } = useUserPresence();
  
  const editingUsers = onlineUsers.filter(
    user => user.currentPage === \`/admin/editor/\${pageId}\`
      && user.id !== currentUserId
  );
  
  if (editingUsers.length === 0) return null;
  
  return (
    <div className="flex items-center gap-2 text-sm text-amber-600">
      <AlertTriangle className="h-4 w-4" />
      <span>
        {editingUsers.map(u => u.name || 'Someone').join(', ')} 
        {editingUsers.length === 1 ? ' is' : ' are'} editing this page
      </span>
    </div>
  );
}
\`\`\`

### Page Lock Integration

Combine presence with page locks:

\`\`\`tsx
function PageLockStatus({ pageId }: { pageId: string }) {
  const { onlineUsers } = useUserPresence();
  const lock = usePageLock(pageId);
  
  if (!lock) return null;
  
  // Check if lock holder is online
  const lockHolder = onlineUsers.find(u => u.id === lock.lockedBy);
  
  return (
    <div className="flex items-center gap-2">
      <Lock className="h-4 w-4 text-amber-500" />
      <span>
        Locked by {lockHolder?.name || 'Unknown'}
        {lockHolder ? ' (online)' : ' (offline)'}
      </span>
    </div>
  );
}
\`\`\`

---

## Supabase Channel Configuration

The presence system uses Supabase Realtime Presence:

\`\`\`typescript
// Inside UserPresenceProvider
const channel = supabase.channel('admin-presence', {
  config: {
    presence: {
      key: userId,
    },
  },
});

// Subscribe to presence events
channel
  .on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    setOnlineUsers(Object.values(state).flat());
  })
  .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    console.log('User joined:', key);
  })
  .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    console.log('User left:', key);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await channel.track(userPresence);
    }
  });
\`\`\`

---

## Performance Considerations

### Minimize Updates

Don't update presence too frequently:

\`\`\`typescript
// Bad: Updates on every keystroke
onKeyDown={() => updatePresence({ lastActivity: Date.now() })}

// Good: Throttled updates
const throttledUpdate = useMemo(
  () => throttle(() => updatePresence({ lastActivity: Date.now() }), 30000),
  [updatePresence]
);
\`\`\`

### Cleanup

The provider automatically cleans up on unmount, but ensure proper cleanup in your components:

\`\`\`typescript
useEffect(() => {
  // Setup
  return () => {
    // Cleanup - provider handles channel cleanup
  };
}, []);
\`\`\`

### Channel Limits

Supabase Realtime has connection limits. For high-traffic apps:

- Consider presence rooms per page
- Implement connection pooling
- Monitor Supabase dashboard

---

## Idle Detection

Automatic away status after inactivity:

\`\`\`typescript
// Inside provider or custom hook
useEffect(() => {
  let idleTimer: NodeJS.Timeout;
  
  const resetTimer = () => {
    clearTimeout(idleTimer);
    updatePresence({ status: 'online' });
    
    idleTimer = setTimeout(() => {
      updatePresence({ status: 'away' });
    }, 5 * 60 * 1000); // 5 minutes
  };
  
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keydown', resetTimer);
  
  return () => {
    clearTimeout(idleTimer);
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keydown', resetTimer);
  };
}, [updatePresence]);
\`\`\`

---

## Troubleshooting

### "Users not appearing online"

1. Check Supabase Realtime is enabled
2. Verify channel subscription status
3. Check browser console for errors
4. Ensure user is authenticated

### "Presence updates delayed"

- Normal: Updates batch every ~1 second
- Check network conditions
- Monitor Supabase Realtime status

### "Duplicate user entries"

Ensure unique presence key:

\`\`\`typescript
// Use user ID as key, not email
.channel('presence', { config: { presence: { key: userId } } })
\`\`\`

---

## Next Steps

- **[Realtime Guide](/admin/documentation/developer/realtime)** — More realtime patterns
- **[Collaborative Editing](/admin/documentation/user/collaborative)** — User-facing docs
  `
};

export const adminComponentsGuide: DocArticle = {
  title: 'Admin Portal Components',
  description: 'Architecture and usage of admin layout and navigation components',
  category: 'developer',
  slug: 'admin-components',
  order: 12,
  tags: ['admin', 'layout', 'components', 'navigation', 'sidebar'],
  lastUpdated: '2025-01-15',
  content: `
# Admin Portal Components

The admin portal is built on a modular component architecture that provides consistent layout, navigation, and user experience. This guide covers the key components and patterns for extending the admin interface.

---

## What You'll Learn

- AdminLayout structure and customization
- Sidebar navigation patterns
- Admin page conventions
- Adding new admin pages
- Shared admin components

---

## AdminLayout Component

The main layout wrapper for all admin pages.

### Location

\`src/components/AdminLayout.tsx\`

### Structure

\`\`\`tsx
<AdminLayout>
  ├── <Sidebar>
  │   ├── Logo
  │   ├── Navigation items
  │   └── User profile section
  ├── <MainContent>
  │   ├── Header (optional)
  │   └── Page content (children)
  └── <Toaster />
</AdminLayout>
\`\`\`

### Usage

\`\`\`tsx
// In router configuration
{
  path: '/admin',
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  ),
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'pages', element: <PagesPage /> },
  ]
}
\`\`\`

---

## Sidebar Navigation

### Menu Items Configuration

Navigation items are defined in the layout:

\`\`\`typescript
const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/admin/dashboard',
  },
  {
    icon: FileText,
    label: 'Manage Pages',
    path: '/admin/pages',
  },
  {
    icon: Package,
    label: 'Packages',
    path: '/admin/packages',
  },
  // ... more items
];
\`\`\`

### Menu Item Type

\`\`\`typescript
interface MenuItem {
  icon: LucideIcon;       // Icon component
  label: string;          // Display text
  path: string;           // Route path
  badge?: string;         // Optional badge
  children?: MenuItem[];  // Submenu items
  requiredRole?: string;  // Role check
}
\`\`\`

### Adding a Menu Item

1. Add to the \`menuItems\` array in AdminLayout
2. Create the corresponding page component
3. Add route to router configuration

\`\`\`typescript
// Add to menuItems
{
  icon: Webhook,
  label: 'Webhooks',
  path: '/admin/webhooks',
  requiredRole: 'admin', // Optional: only show for admins
}
\`\`\`

### Collapsible Sidebar

The sidebar supports collapse/expand:

\`\`\`typescript
const [isCollapsed, setIsCollapsed] = useState(false);

// Toggle button
<Button onClick={() => setIsCollapsed(!isCollapsed)}>
  {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
</Button>

// Sidebar width
<aside className={\`
  \${isCollapsed ? 'w-16' : 'w-64'}
  transition-all duration-300
\`}>
\`\`\`

---

## AdminSectionHeader

Consistent header component for admin pages.

### Location

\`src/components/admin/AdminSectionHeader.tsx\`

### Usage

\`\`\`tsx
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';

function MyAdminPage() {
  return (
    <div>
      <AdminSectionHeader 
        title="User Management"
        description="Manage admin users and their roles"
        icon={Users}
      />
      
      {/* Page content */}
    </div>
  );
}
\`\`\`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| \`title\` | string | Yes | Page title |
| \`description\` | string | No | Subtitle/description |
| \`icon\` | LucideIcon | No | Header icon |
| \`actions\` | ReactNode | No | Action buttons |
| \`breadcrumbs\` | Breadcrumb[] | No | Navigation breadcrumbs |

### With Actions

\`\`\`tsx
<AdminSectionHeader 
  title="Pages"
  description="Manage your website pages"
  icon={FileText}
  actions={
    <Button onClick={() => navigate('/admin/pages/new')}>
      <Plus className="h-4 w-4 mr-2" />
      Create Page
    </Button>
  }
/>
\`\`\`

---

## Creating New Admin Pages

### Step 1: Create Page Component

\`\`\`tsx
// src/pages/admin/AdminWebhooksPage.tsx
import { AdminSectionHeader } from '@/components/admin/AdminSectionHeader';
import { Webhook } from 'lucide-react';

export default function AdminWebhooksPage() {
  return (
    <div className="space-y-6">
      <AdminSectionHeader 
        title="Webhooks"
        description="Configure outgoing webhook notifications"
        icon={Webhook}
      />
      
      <div className="rounded-lg border bg-card">
        {/* Page content */}
      </div>
    </div>
  );
}
\`\`\`

### Step 2: Add Route

\`\`\`tsx
// In router configuration
{
  path: 'webhooks',
  element: <AdminWebhooksPage />,
}
\`\`\`

### Step 3: Add Navigation

\`\`\`typescript
// In AdminLayout menuItems
{
  icon: Webhook,
  label: 'Webhooks',
  path: '/admin/webhooks',
}
\`\`\`

---

## Common Admin Patterns

### Data Table Pattern

\`\`\`tsx
function DataTablePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="space-y-6">
      <AdminSectionHeader 
        title="Items"
        actions={<CreateButton />}
      />
      
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <Filters />
        </CardContent>
      </Card>
      
      {/* Data Table */}
      <Card>
        {loading ? (
          <TableSkeleton />
        ) : (
          <DataTable data={data} columns={columns} />
        )}
      </Card>
    </div>
  );
}
\`\`\`

### Detail/Edit Pattern

\`\`\`tsx
function DetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  
  return (
    <div className="space-y-6">
      <AdminSectionHeader 
        title="Edit Item"
        breadcrumbs={[
          { label: 'Items', path: '/admin/items' },
          { label: item?.name || 'Loading...' },
        ]}
      />
      
      <Card>
        <CardContent className="p-6">
          <ItemForm item={item} onSave={handleSave} />
        </CardContent>
      </Card>
    </div>
  );
}
\`\`\`

---

## Shared Components

### Card Layout

\`\`\`tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
\`\`\`

### Loading States

\`\`\`tsx
import { Skeleton } from '@/components/ui/skeleton';

// Table skeleton
function TableSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
\`\`\`

### Empty States

\`\`\`tsx
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action}
    </div>
  );
}
\`\`\`

---

## Responsive Design

### Mobile Sidebar

On mobile, the sidebar becomes a drawer:

\`\`\`tsx
const [mobileOpen, setMobileOpen] = useState(false);

// Desktop: always visible
// Mobile: drawer triggered by hamburger menu
<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
  <SheetContent side="left" className="w-64 p-0">
    <SidebarContent />
  </SheetContent>
</Sheet>
\`\`\`

### Responsive Tables

Use horizontal scroll on mobile:

\`\`\`tsx
<div className="overflow-x-auto">
  <Table className="min-w-[600px]">
    {/* Table content */}
  </Table>
</div>
\`\`\`

---

## Best Practices

### Consistent Spacing

Use the design system spacing scale:

\`\`\`tsx
// Page container
<div className="space-y-6">
  
// Card content
<CardContent className="p-6">

// Between sections
<div className="mt-8">
\`\`\`

### Loading Feedback

Always show loading states:

\`\`\`tsx
function AdminPage() {
  const { data, isLoading, error } = useQuery();
  
  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState error={error} />;
  
  return <PageContent data={data} />;
}
\`\`\`

### Action Feedback

Provide feedback for actions:

\`\`\`tsx
const handleDelete = async () => {
  try {
    await deleteItem(id);
    toast.success('Item deleted successfully');
    navigate('/admin/items');
  } catch (error) {
    toast.error('Failed to delete item');
  }
};
\`\`\`

---

## Next Steps

- **[Architecture Overview](/admin/documentation/developer/architecture)** — Overall system design
- **[API Reference](/admin/documentation/developer/api)** — Admin API methods
  `
};

export const completeHooksGuide: DocArticle = {
  title: 'Complete Hooks Reference',
  description: 'Comprehensive documentation for all custom React hooks',
  category: 'developer',
  slug: 'hooks-reference',
  order: 9,
  tags: ['hooks', 'react', 'reference', 'API', 'utilities'],
  lastUpdated: '2025-01-15',
  content: `
# Complete Hooks Reference

This reference documents all custom React hooks available in the page builder. Each hook includes its purpose, API signature, and usage examples.

---

## Authentication & User Hooks

### useAuth

Access authentication state and methods.

\`\`\`typescript
import { useAuth } from '@/contexts/AuthContext';

const { 
  user,           // User | null
  session,        // Session | null
  loading,        // boolean
  isAdmin,        // boolean
  userRoles,      // string[]
  signIn,         // (email, password) => Promise
  signUp,         // (email, password, metadata?) => Promise
  signOut,        // () => Promise
  refreshProfile, // () => Promise
} = useAuth();
\`\`\`

### useCurrentUserProfile

Fetch current user's profile data.

\`\`\`typescript
import { useCurrentUserProfile } from '@/hooks/useCurrentUserProfile';

const { 
  profile,    // Profile | null
  loading,    // boolean
  error,      // Error | null
  refetch,    // () => void
} = useCurrentUserProfile();

// Profile type
interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  profile_picture_url: string | null;
  roles: string[] | null;
  created_at: string;
  updated_at: string;
}
\`\`\`

### useUserPresence

Access real-time online user tracking.

\`\`\`typescript
import { useUserPresence } from '@/hooks/useUserPresence';

const { 
  onlineUsers,      // UserPresence[]
  isConnected,      // boolean
  currentUserId,    // string
  updatePresence,   // (data) => void
} = useUserPresence();
\`\`\`

---

## Page & Data Hooks

### usePageData

Fetch and manage page data with caching.

\`\`\`typescript
import { usePageData } from '@/hooks/queries/usePageData';

const { 
  page,         // Page | null
  isLoading,    // boolean
  error,        // Error | null
  refetch,      // () => void
} = usePageData(pageId);
\`\`\`

### usePageMutations

CRUD operations for pages.

\`\`\`typescript
import { usePageMutations } from '@/hooks/queries/usePageMutations';

const { 
  updatePage,   // (id, updates) => Promise
  deletePage,   // (id) => Promise
  clonePage,    // (id, newTitle, newUrl) => Promise
} = usePageMutations();
\`\`\`

### useAutosave

Automatic saving with debouncing.

\`\`\`typescript
import { useAutosave } from '@/hooks/queries/useAutosave';

const { 
  save,         // (data) => void - triggers debounced save
  isSaving,     // boolean
  lastSaved,    // Date | null
  error,        // Error | null
} = useAutosave(pageId, {
  debounceMs: 2000,
  onSave: (data) => console.log('Saved:', data),
  onError: (err) => console.error(err),
});
\`\`\`

---

## Editor Hooks

### useEditorStore

Access the editor Zustand store.

\`\`\`typescript
import { useEditorStore } from '@/stores/editor';

// Select specific state
const sections = useEditorStore(state => state.document.sections);

// Select actions
const addSection = useEditorStore(state => state.addSection);
const updateProps = useEditorStore(state => state.updateSectionProps);

// Combine multiple selectors
const { selectedId, selectSection } = useEditorStore(state => ({
  selectedId: state.selection.selectedSectionId,
  selectSection: state.selectSection,
}));
\`\`\`

### useReactEditorShortcuts

Register keyboard shortcuts in the editor.

\`\`\`typescript
import { useReactEditorShortcuts } from '@/hooks/useReactEditorShortcuts';

// Register shortcuts
useReactEditorShortcuts({
  save: () => handleSave(),
  undo: () => undo(),
  redo: () => redo(),
  delete: () => deleteSelected(),
  duplicate: () => duplicateSelected(),
});
\`\`\`

### useElementBounds

Track element position and dimensions.

\`\`\`typescript
import { useElementBounds } from '@/hooks/useElementBounds';

const [ref, bounds] = useElementBounds();

// bounds: { top, left, width, height, bottom, right }

<div ref={ref}>
  <Overlay style={{ 
    top: bounds.top,
    left: bounds.left,
    width: bounds.width,
    height: bounds.height,
  }} />
</div>
\`\`\`

---

## Translation Hooks

### useTranslation

Simple translation lookup.

\`\`\`typescript
import { useTranslation } from '@/hooks/useTranslation';

const { t, locale, setLocale } = useTranslation();

// Usage
<h1>{t('homepage.hero.title')}</h1>
\`\`\`

### useEditorTranslations

Translation resolution in editor context.

\`\`\`typescript
import { useEditorTranslations } from '@/hooks/useEditorTranslations';

const { 
  resolveTranslatedProps,  // (section) => props
  currentLanguage,         // string
  isDefaultLanguage,       // boolean
} = useEditorTranslations();

const translatedProps = resolveTranslatedProps(section);
\`\`\`

### useLiveTranslations

Translation resolution for public pages.

\`\`\`typescript
import { useLiveTranslations } from '@/hooks/useLiveTranslations';

const { 
  resolveTranslatedProps,  // (section) => props
  currentLanguage,         // string
  isDefaultLanguage,       // boolean
} = useLiveTranslations();
\`\`\`

### useTranslationEngine

Complete translation management.

\`\`\`typescript
import { useTranslationEngine } from '@/hooks/useTranslationEngine';

const {
  registerKey,
  getTranslation,
  setTranslation,
  translateWithAI,
  batchTranslate,
  getCoverage,
  languages,
  currentLanguage,
} = useTranslationEngine();
\`\`\`

### useTranslationStatus

Visual status indicators for translations.

\`\`\`typescript
import { useTranslationStatus } from '@/hooks/useTranslationStatus';

const status = useTranslationStatus(sectionId, propPath);
// Returns: { status: 'translated' | 'stale' | 'missing' | 'unbound', tooltip: string }
\`\`\`

---

## Array & CRUD Hooks

### useArrayCRUD

Manage array operations with proper state updates.

\`\`\`typescript
import { useArrayCRUD } from '@/hooks/useArrayCRUD';

const {
  items,              // T[]
  addItem,            // (item: T) => void
  updateItem,         // (index: number, updates: Partial<T>) => void
  removeItem,         // (index: number) => void
  moveItem,           // (fromIndex: number, toIndex: number) => void
  duplicateItem,      // (index: number) => void
} = useArrayCRUD(initialItems, onChange);
\`\`\`

### useNestedArrayCRUD

Manage nested array structures.

\`\`\`typescript
import { useNestedArrayCRUD } from '@/hooks/useNestedArrayCRUD';

const {
  addItem,
  updateItem,
  removeItem,
  moveItem,
} = useNestedArrayCRUD(
  data,
  setData,
  'items.0.children' // Path to nested array
);
\`\`\`

### useArrayItems

Drag-and-drop array management for sections.

\`\`\`typescript
import { useArrayItems } from '@/hooks/useArrayItems';

const { 
  items,            // Processed items with IDs
  itemIds,          // string[] for DnD
  isDndEnabled,     // boolean
  getItemProps,     // (index) => props
  SortableWrapper,  // React component
} = useArrayItems('features', section.props.features);
\`\`\`

---

## Navigation & Admin Hooks

### useAdminRoute

Navigate within admin section.

\`\`\`typescript
import { useAdminRoute } from '@/hooks/useAdminRoute';

const { 
  navigate,         // (path) => void - prefixes with admin path
  currentPath,      // string
  isActive,         // (path) => boolean
} = useAdminRoute();

navigate('pages'); // Goes to /admin/pages
\`\`\`

### useMobile

Detect mobile viewport.

\`\`\`typescript
import { useMobile } from '@/hooks/use-mobile';

const isMobile = useMobile();

return isMobile ? <MobileNav /> : <DesktopNav />;
\`\`\`

---

## System Hooks

### useSystemStatus

Monitor system service health.

\`\`\`typescript
import { useSystemStatus } from '@/hooks/useSystemStatus';

const { 
  status,       // Record<string, ServiceStatus>
  isHealthy,    // boolean - all services OK
  refresh,      // () => void
  lastChecked,  // Date
} = useSystemStatus();

// ServiceStatus: 'healthy' | 'degraded' | 'down'
\`\`\`

---

## Utility Hooks

### useLatestRef

Keep a ref updated with latest value.

\`\`\`typescript
import { useLatestRef } from '@/hooks/useLatestRef';

const callbackRef = useLatestRef(callback);

// Use in effects without dependency issues
useEffect(() => {
  const handler = () => callbackRef.current();
  window.addEventListener('click', handler);
  return () => window.removeEventListener('click', handler);
}, []); // No callback in deps!
\`\`\`

### useAutoKeyGeneration

Generate translation keys automatically.

\`\`\`typescript
import { useAutoKeyGeneration } from '@/hooks/useAutoKeyGeneration';

const { generateKey, generateKeysForSection } = useAutoKeyGeneration();

const key = generateKey({
  pageUrl: '/pricing',
  sectionType: 'features',
  sectionId: 'abc123',
  propPath: 'title',
});
// Returns: "pricing.features.abc123.title"
\`\`\`

---

## Query Hooks (React Query)

### useLanguages

Fetch available languages.

\`\`\`typescript
import { useLanguages } from '@/hooks/queries/useLanguages';

const { 
  languages,     // Language[]
  defaultLang,   // Language
  isLoading,     // boolean
} = useLanguages();
\`\`\`

### useTranslationsQuery

Query translations for a page/language.

\`\`\`typescript
import { useTranslationsQuery } from '@/hooks/queries/useTranslationsQuery';

const { 
  translations,  // Translation[]
  isLoading,     // boolean
  refetch,       // () => void
} = useTranslationsQuery(pageId, languageCode);
\`\`\`

### useOtherPages

Fetch pages other than current.

\`\`\`typescript
import { useOtherPages } from '@/hooks/queries/useOtherPages';

const { 
  pages,         // Page[]
  isLoading,     // boolean
} = useOtherPages(currentPageId);
\`\`\`

---

## Best Practices

### Selector Optimization

\`\`\`typescript
// Bad: Re-renders on any state change
const state = useEditorStore();

// Good: Only re-renders when specific state changes
const sections = useEditorStore(state => state.document.sections);
\`\`\`

### Avoiding Infinite Loops

\`\`\`typescript
// Bad: Creates new callback every render
useEffect(() => {
  onSomething(value);
}, [onSomething, value]);

// Good: Use useLatestRef for callbacks
const callbackRef = useLatestRef(onSomething);
useEffect(() => {
  callbackRef.current(value);
}, [value]);
\`\`\`

### Custom Hook Patterns

\`\`\`typescript
// Combine related logic into custom hooks
function usePageEditor(pageId: string) {
  const { page, isLoading } = usePageData(pageId);
  const { save, isSaving } = useAutosave(pageId);
  const { resolveTranslatedProps } = useEditorTranslations();
  
  return {
    page,
    isLoading,
    save,
    isSaving,
    resolveTranslatedProps,
  };
}
\`\`\`

---

## Next Steps

- **[Advanced Hooks](/admin/documentation/developer/advanced-hooks)** — Complex hook patterns
- **[API Reference](/admin/documentation/developer/api)** — API documentation
  `
};

export const edgeFunctionsDeepDiveGuide: DocArticle = {
  title: 'Edge Functions Deep Dive',
  description: 'Detailed documentation for all Supabase Edge Functions',
  category: 'developer',
  slug: 'edge-functions-reference',
  order: 11,
  tags: ['edge functions', 'serverless', 'API', 'backend', 'Supabase'],
  lastUpdated: '2025-01-15',
  content: `
# Edge Functions Deep Dive

This guide provides detailed documentation for each Supabase Edge Function in the system, including request/response formats, authentication requirements, and usage examples.

---

## Architecture Overview

\`\`\`mermaid
flowchart TB
    subgraph Client["🖥️ Frontend Application"]
        UI[User Interface]
        SDK[Supabase Client SDK]
    end
    
    subgraph Edge["⚡ Edge Functions"]
        direction TB
        AI[ai-translate]
        AIB[ai-translate-batch]
        FIX[fix-page-translations]
        AUTH[admin-auth]
        CREATE[create-admin-user]
        RATES[get-exchange-rates]
        CACHE[purge-cloudflare-cache]
        ANALYZE[analyze-competitor]
    end
    
    subgraph External["🌐 External Services"]
        OPENAI[OpenAI API]
        CF[Cloudflare CDN]
        FOREX[Exchange Rate API]
    end
    
    subgraph Supabase["💾 Supabase Backend"]
        DB[(Database)]
        SUPA_AUTH[Auth Service]
    end
    
    UI --> SDK
    SDK --> Edge
    AI --> OPENAI
    AIB --> OPENAI
    CACHE --> CF
    RATES --> FOREX
    AUTH --> SUPA_AUTH
    CREATE --> SUPA_AUTH
    FIX --> DB
    CREATE --> DB
\`\`\`

---

## Function Categories

> **💡 Quick Navigation** — Click any function below to jump to its documentation.

<div class="function-cards">

### 🌐 Translation
AI-powered translation services for content localization.
- \`ai-translate\` — Single text translation
- \`ai-translate-batch\` — Bulk translations
- \`fix-page-translations\` — Sync translation keys

### 🛡️ Authentication  
User verification and admin account management.
- \`admin-auth\` — Verify admin sessions
- \`create-admin-user\` — Create admin accounts

### 🔧 Infrastructure
External service integrations and utilities.
- \`get-exchange-rates\` — Currency conversion rates
- \`purge-cloudflare-cache\` — CDN cache invalidation

### 📊 Analytics
Website analysis and competitive intelligence.
- \`analyze-competitor\` — Competitor analysis

</div>

---

## Function Locations

All functions are in \`supabase/functions/\`:

\`\`\`filetree
supabase/functions/
├── admin-auth/
│   └── index.ts
├── ai-translate/
│   └── index.ts
├── ai-translate-batch/
│   └── index.ts
├── analyze-competitor/
│   └── index.ts
├── create-admin-user/
│   └── index.ts
├── fix-page-translations/
│   └── index.ts
├── get-exchange-rates/
│   └── index.ts
└── purge-cloudflare-cache/
    └── index.ts
\`\`\`

---

## AI Translation Functions

### ai-translate

Translate a single text string using AI.

**Endpoint:** \`POST /functions/v1/ai-translate\`

**Request:**
\`\`\`typescript
interface TranslateRequest {
  text: string;           // Text to translate
  sourceLanguage: string; // e.g., 'en'
  targetLanguage: string; // e.g., 'es'
  context?: string;       // Optional context for better translation
}
\`\`\`

**Response:**
\`\`\`typescript
interface TranslateResponse {
  success: boolean;
  translation: string;
  provider: string;       // AI provider used
  confidence?: number;    // Translation confidence
}
\`\`\`

**Example:**
\`\`\`typescript
const response = await supabase.functions.invoke('ai-translate', {
  body: {
    text: 'Welcome to our platform',
    sourceLanguage: 'en',
    targetLanguage: 'es',
    context: 'Website hero section headline'
  }
});
// { success: true, translation: 'Bienvenido a nuestra plataforma', provider: 'openai' }
\`\`\`

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`RATE_LIMIT\` | Too many requests in short period | Implement client-side throttling, wait 60 seconds |
| \`INVALID_LANGUAGE\` | Unsupported language code | Use ISO 639-1 codes (e.g., 'en', 'es', 'fr', 'ar') |
| \`CONTEXT_TOO_LONG\` | Context exceeds 500 characters | Shorten context to key identifying information |
| \`TEXT_TOO_LONG\` | Source text exceeds limit | Break text into smaller chunks |
| \`PROVIDER_ERROR\` | OpenAI API issue | Check API key validity, retry after delay |

> **💡 Pro Tip:** Always provide context for ambiguous terms. "Bank" could mean financial institution or river bank — context helps AI choose correctly.

---

### ai-translate-batch

Translate multiple texts at once for efficiency.

**Endpoint:** \`POST /functions/v1/ai-translate-batch\`

**Request:**
\`\`\`typescript
interface BatchTranslateRequest {
  translations: {
    key: string;          // Translation key
    text: string;         // Source text
    context?: string;     // Optional context
  }[];
  sourceLanguage: string;
  targetLanguage: string;
}
\`\`\`

**Response:**
\`\`\`typescript
interface BatchTranslateResponse {
  success: boolean;
  results: {
    key: string;
    translation: string;
    success: boolean;
    error?: string;
  }[];
  stats: {
    total: number;
    successful: number;
    failed: number;
  };
}
\`\`\`

**Example:**
\`\`\`typescript
const response = await supabase.functions.invoke('ai-translate-batch', {
  body: {
    translations: [
      { key: 'hero.title', text: 'Welcome', context: 'Hero headline' },
      { key: 'hero.subtitle', text: 'Get started today', context: 'Hero subtext' },
    ],
    sourceLanguage: 'en',
    targetLanguage: 'fr'
  }
});
\`\`\`

**Rate Limits:**
- Max 50 translations per batch
- Max 10,000 characters total per batch

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`BATCH_TOO_LARGE\` | Exceeds 50 items | Split into multiple batches |
| \`CONTENT_TOO_LONG\` | Total chars > 10,000 | Reduce batch size or text length |
| \`PARTIAL_FAILURE\` | Some translations failed | Check \`results\` array for individual errors |

#### Real-World Example: Translate Entire Page

\`\`\`typescript
// Translate all content for a page to a new language
async function translatePageContent(pageId: string, targetLang: string) {
  // 1. Get all translation keys for the page
  const { data: keys } = await supabase
    .from('translation_keys')
    .select('key, source_text, context')
    .eq('page_id', pageId)
    .eq('is_active', true);
  
  if (!keys?.length) return { translated: 0 };
  
  // 2. Prepare batch request
  const translations = keys.map(k => ({
    key: k.key,
    text: k.source_text,
    context: k.context || undefined
  }));
  
  // 3. Process in batches of 50
  const batches = chunk(translations, 50);
  let totalTranslated = 0;
  
  for (const batch of batches) {
    const { data } = await supabase.functions.invoke('ai-translate-batch', {
      body: {
        translations: batch,
        sourceLanguage: 'en',
        targetLanguage: targetLang
      }
    });
    
    // 4. Save translations to database
    if (data?.results) {
      for (const result of data.results) {
        if (result.success) {
          await supabase.from('translations').upsert({
            key: result.key,
            language_id: targetLang,
            value: result.translation,
            status: 'ai_translated'
          });
          totalTranslated++;
        }
      }
    }
  }
  
  return { translated: totalTranslated, total: keys.length };
}

// Helper function to split array into chunks
function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
}
\`\`\`

> **Related Functions:**
> - [\`ai-translate\`](#ai-translate) — For single text translation
> - [\`fix-page-translations\`](#fix-page-translations) — To sync translation keys

---

## Authentication Functions

### admin-auth

Verify admin credentials and manage sessions.

**Endpoint:** \`POST /functions/v1/admin-auth\`

**Request:**
\`\`\`typescript
interface AdminAuthRequest {
  action: 'verify' | 'refresh' | 'logout';
  token?: string;
}
\`\`\`

**Response:**
\`\`\`typescript
interface AdminAuthResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
  expiresAt?: string;
}
\`\`\`

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`UNAUTHORIZED\` | Missing or invalid token | Ensure Authorization header is set |
| \`TOKEN_EXPIRED\` | JWT has expired | Use refresh action to get new token |
| \`NOT_ADMIN\` | User lacks admin role | Check user_roles table for correct role |
| \`RATE_LIMITED\` | Too many auth attempts | Wait before retrying (rate: 10 req/min) |

---

### create-admin-user

Create a new admin user account.

**Endpoint:** \`POST /functions/v1/create-admin-user\`

**Authentication:** Requires setup key

**Request:**
\`\`\`typescript
interface CreateAdminRequest {
  email: string;
  password: string;
  username?: string;
  role: 'admin' | 'manager' | 'seo_manager' | 'content_writer';
  setupKey: string;       // Secret key for authorization
}
\`\`\`

**Response:**
\`\`\`typescript
interface CreateAdminResponse {
  success: boolean;
  userId?: string;
  message: string;
}
\`\`\`

**Security:**
- Requires valid \`setupKey\` matching server-side secret
- Creates user in auth.users
- Creates profile entry
- Assigns role in user_roles table

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`INVALID_SETUP_KEY\` | Wrong or missing setupKey | Verify the setup key in environment |
| \`EMAIL_EXISTS\` | Email already registered | Use a different email address |
| \`WEAK_PASSWORD\` | Password doesn't meet requirements | Use 8+ chars with numbers and symbols |
| \`INVALID_ROLE\` | Role not in allowed list | Use one of: admin, manager, seo_manager, content_writer |

---

## Currency & Exchange

### get-exchange-rates

Fetch current exchange rates from external API.

**Endpoint:** \`POST /functions/v1/get-exchange-rates\`

**Request:**
\`\`\`typescript
interface ExchangeRatesRequest {
  currencies: string[];   // ISO codes: ['EUR', 'GBP', 'JPY']
}
\`\`\`

**Response:**
\`\`\`typescript
interface ExchangeRatesResponse {
  base: 'USD';
  rates: Record<string, number>;  // { EUR: 0.92, GBP: 0.79, ... }
  lastUpdated: string;            // ISO timestamp
}
\`\`\`

**Example:**
\`\`\`typescript
const response = await supabase.functions.invoke('get-exchange-rates', {
  body: { currencies: ['EUR', 'GBP', 'JPY', 'CAD'] }
});
// { base: 'USD', rates: { EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.35 } }
\`\`\`

**Caching:**
- Rates are cached for 1 hour
- Stale rates served if API is unavailable

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`INVALID_CURRENCY\` | Unknown currency code | Use valid ISO 4217 codes (USD, EUR, GBP) |
| \`API_UNAVAILABLE\` | Exchange rate API down | Stale cached rates will be served |
| \`EMPTY_REQUEST\` | No currencies specified | Provide at least one currency code |

#### Real-World Example: Price Conversion

\`\`\`typescript
// Convert prices to user's preferred currency
async function convertPrices(
  pricesUSD: number[], 
  targetCurrency: string
): Promise<number[]> {
  const { data } = await supabase.functions.invoke('get-exchange-rates', {
    body: { currencies: [targetCurrency] }
  });
  
  const rate = data?.rates?.[targetCurrency] || 1;
  return pricesUSD.map(price => Math.round(price * rate * 100) / 100);
}

// Usage
const pricesEUR = await convertPrices([9.99, 19.99, 49.99], 'EUR');
// [9.19, 18.39, 45.99]
\`\`\`

---

## Cache Management

### purge-cloudflare-cache

Purge Cloudflare CDN cache for specific URLs.

**Endpoint:** \`POST /functions/v1/purge-cloudflare-cache\`

**Request:**
\`\`\`typescript
interface PurgeCacheRequest {
  pageUrl: string;        // URL to purge
  apiToken: string;       // Cloudflare API token
  zoneId: string;         // Cloudflare zone ID
}
\`\`\`

**Response:**
\`\`\`typescript
interface PurgeCacheResponse {
  success: boolean;
  purgedUrls: string[];
  errors?: string[];
}
\`\`\`

**Example:**
\`\`\`typescript
const response = await supabase.functions.invoke('purge-cloudflare-cache', {
  body: {
    pageUrl: '/pricing',
    apiToken: process.env.CLOUDFLARE_TOKEN,
    zoneId: process.env.CLOUDFLARE_ZONE
  }
});
\`\`\`

**URLs Purged:**
- Base URL: \`https://example.com/pricing\`
- With trailing slash: \`https://example.com/pricing/\`

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`INVALID_TOKEN\` | Cloudflare API token invalid | Regenerate token with Cache Purge permission |
| \`INVALID_ZONE\` | Zone ID doesn't match token | Verify zone ID in Cloudflare dashboard |
| \`PURGE_FAILED\` | Cloudflare API error | Check Cloudflare status, retry after delay |

---

## Translation Utilities

### fix-page-translations

Repair and synchronize page translations.

**Endpoint:** \`POST /functions/v1/fix-page-translations\`

**Request:**
\`\`\`typescript
interface FixTranslationsRequest {
  pageId: string;
  action: 'sync' | 'cleanup' | 'validate';
}
\`\`\`

**Response:**
\`\`\`typescript
interface FixTranslationsResponse {
  success: boolean;
  fixes: {
    keysAdded: number;
    keysRemoved: number;
    keysUpdated: number;
  };
  issues?: string[];
}
\`\`\`

**Actions:**
- \`sync\` — Sync translation keys with page content
- \`cleanup\` — Remove orphaned keys
- \`validate\` — Check for issues without fixing

#### Troubleshooting

| Error Code | Cause | Solution |
|------------|-------|----------|
| \`PAGE_NOT_FOUND\` | Invalid page ID | Verify page exists in database |
| \`NO_CONTENT\` | Page has no content | Add content to page before syncing |
| \`PARSE_ERROR\` | Content structure invalid | Check page content JSON format |

---

## Analytics

### analyze-competitor

Analyze competitor website (coming soon).

**Endpoint:** \`POST /functions/v1/analyze-competitor\`

**Request:**
\`\`\`typescript
interface AnalyzeRequest {
  url: string;            // Competitor URL
  aspects?: string[];     // ['seo', 'design', 'content']
}
\`\`\`

> **🚧 Coming Soon** — This function is under development.

---

## Error Handling

All functions follow consistent error format:

\`\`\`typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;         // e.g., 'VALIDATION_ERROR'
    message: string;      // Human-readable message
    details?: any;        // Additional context
  };
}
\`\`\`

### Common Error Codes

| Code | HTTP Status | Meaning | Common Causes |
|------|-------------|---------|---------------|
| \`UNAUTHORIZED\` | 401 | Missing or invalid auth | No Authorization header, expired token |
| \`FORBIDDEN\` | 403 | Insufficient permissions | User lacks required role |
| \`VALIDATION_ERROR\` | 400 | Invalid request body | Missing required fields, wrong types |
| \`NOT_FOUND\` | 404 | Resource doesn't exist | Invalid ID, deleted resource |
| \`RATE_LIMIT\` | 429 | Too many requests | Exceeded rate limit, retry after delay |
| \`INTERNAL_ERROR\` | 500 | Server error | Bug in function, external API failure |

### Error Handling Best Practices

\`\`\`typescript
async function callEdgeFunction<T>(
  functionName: string, 
  body: any
): Promise<T | null> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, { body });
    
    if (error) {
      console.error(\`[\${functionName}] Error:\`, error.message);
      
      // Handle specific error codes
      if (error.message.includes('RATE_LIMIT')) {
        // Wait and retry
        await delay(60000);
        return callEdgeFunction(functionName, body);
      }
      
      return null;
    }
    
    return data as T;
  } catch (err) {
    console.error(\`[\${functionName}] Unexpected error:\`, err);
    return null;
  }
}
\`\`\`

---

## Authentication

### Service Role

For server-to-server calls (admin operations):

\`\`\`typescript
const { data, error } = await supabase.functions.invoke('ai-translate', {
  headers: {
    Authorization: \`Bearer \${process.env.SUPABASE_SERVICE_ROLE_KEY}\`
  },
  body: { ... }
});
\`\`\`

### User Token

For user-initiated calls (automatically included):

\`\`\`typescript
// Token is automatically included when using the client
const { data, error } = await supabase.functions.invoke('ai-translate', {
  body: { ... }
});
\`\`\`

---

## Local Development

### Running Functions Locally

\`\`\`bash
# Start Supabase local dev
supabase start

# Serve functions with hot reload
supabase functions serve

# Test a specific function
curl -X POST http://localhost:54321/functions/v1/ai-translate \\
  -H "Authorization: Bearer YOUR_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello", "sourceLanguage": "en", "targetLanguage": "es"}'
\`\`\`

### Environment Variables

Set secrets for local development:

\`\`\`bash
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set CLOUDFLARE_TOKEN=...
\`\`\`

---

## Deploying Functions

\`\`\`bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy ai-translate

# Deploy with env vars
supabase functions deploy ai-translate --env-file .env
\`\`\`

---

## Quick Reference

| Function | Method | Auth | Rate Limit |
|----------|--------|------|------------|
| \`ai-translate\` | POST | User/Service | 60/min |
| \`ai-translate-batch\` | POST | User/Service | 10/min |
| \`admin-auth\` | POST | User | 10/min |
| \`create-admin-user\` | POST | Setup Key | 5/hour |
| \`get-exchange-rates\` | POST | None | 100/hour |
| \`purge-cloudflare-cache\` | POST | User | 30/min |
| \`fix-page-translations\` | POST | User | 20/min |
| \`analyze-competitor\` | POST | User | 10/hour |

---

## Next Steps

- **[Authentication Guide](/admin/documentation/developer/authentication)** — Auth patterns
- **[Hooks Reference](/admin/documentation/developer/hooks)** — React hooks for Edge Functions
- **[Admin Components](/admin/documentation/developer/admin-components)** — Building admin UIs
  `
};
