import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Search as SearchIcon, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import NotificationCenter from './NotificationCenter';
import type { AlertItem } from '@/components/dashboard/CriticalAlertsCard';

const ROUTE_LABELS: Record<string, string> = {
  'a93jf02kd92ms71x8qp4': 'Dashboard',
  users: 'User Management',
  currencies: 'Manage Currencies',
  pages: 'Manage Pages',
  packages: 'Manage Packages',
  seo: 'SEO Studio',
  settings: 'System Settings',
  documentation: 'Documentation',
  profile: 'Profile',
  edit: 'Edit',
};

interface AdminTopBarProps {
  onOpenCommandPalette: () => void;
  alerts: AlertItem[];
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ onOpenCommandPalette, alerts }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] || seg,
    path: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <div className="sticky top-0 z-30 h-14 flex items-center justify-between px-6 bg-background/60 backdrop-blur-xl border-b border-border/30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.path}>
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
            {crumb.isLast ? (
              <span className="font-medium text-foreground">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-2 text-muted-foreground hover:text-foreground rounded-xl px-3 dark:hover:bg-white/[0.06] hover:bg-black/[0.04]"
          onClick={onOpenCommandPalette}
        >
          <SearchIcon className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground dark:hover:bg-white/[0.06] hover:bg-black/[0.04]"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <NotificationCenter alerts={alerts} />
      </div>
    </div>
  );
};

export default AdminTopBar;
