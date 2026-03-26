import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserProfile } from '@/hooks/useCurrentUserProfile';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import LoadingBar from '@/components/LoadingBar';
import AdminLogin from '@/components/AdminLogin';
import AdminTopBar from '@/components/admin/AdminTopBar';
import CommandPalette from '@/components/admin/CommandPalette';
import { Home, Users, Settings, LogOut, FileText, Package, DollarSign, BookOpen, ChevronLeft, ChevronRight, Search, FlaskConical, Shield, Briefcase } from 'lucide-react';
import { config } from '@/lib/config';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { AlertItem } from '@/components/dashboard/CriticalAlertsCard';

const AdminLayout: React.FC = () => {
  const {
    user,
    signOut,
    userRoles,
    loading: authLoading,
    rolesLoaded,
    isAdmin
  } = useAuth();
  const {
    profile,
    getAvatarSrc,
    getInitials
  } = useCurrentUserProfile();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [adminLogo, setAdminLogo] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved === 'true';
  });

  // Persist collapsed state
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for alerts from dashboard
  useEffect(() => {
    const handleAlerts = (e: CustomEvent<AlertItem[]>) => {
      setAlerts(e.detail);
    };
    window.addEventListener('dashboardAlerts', handleAlerts as EventListener);
    return () => window.removeEventListener('dashboardAlerts', handleAlerts as EventListener);
  }, []);
  
  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };
  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed Out', {
      description: 'You have been successfully signed out.',
    });
  };

  // Load admin logo on mount
  useEffect(() => {
    const loadAdminLogo = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .list('website/', { 
            limit: 10,
            search: 'admin-logo'
          });

        if (!error && data && data.length > 0) {
          const logoFile = data.find(file => file.name.startsWith('admin-logo.'));
          if (logoFile) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(`website/${logoFile.name}`);
            setAdminLogo(`${publicUrl}?t=${Date.now()}`);
          }
        }
      } catch (error) {
        console.error('Error loading admin logo:', error);
      }
    };

    loadAdminLogo();

    // Listen for logo updates
    const handleLogoUpdate = (event: CustomEvent) => {
      setAdminLogo(event.detail);
    };

    window.addEventListener('adminLogoUpdated', handleLogoUpdate as EventListener);
    return () => {
      window.removeEventListener('adminLogoUpdated', handleLogoUpdate as EventListener);
    };
  }, []);

  // Handle loading state on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Show loading screen while auth or roles are loading
  if (authLoading || (user && !rolesLoaded)) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>;
  }

  // Show login form if not authenticated
  if (!user) {
    return <AdminLogin />;
  }

  if (!isAdmin) {
    return <AdminLogin errorMessage="Your account does not have admin access. Please try with a different account." />;
  }
  const navigationItems = [{
    id: 'dashboard',
    path: '/a93jf02kd92ms71x8qp4',
    icon: Home,
    label: 'Dashboard'
  }, {
    id: 'users',
    path: '/a93jf02kd92ms71x8qp4/users',
    icon: Users,
    label: 'User Management',
    adminOnly: true
  }, {
    id: 'currencies',
    path: '/a93jf02kd92ms71x8qp4/currencies',
    icon: DollarSign,
    label: 'Manage Currencies'
  }, {
    id: 'pages',
    path: '/a93jf02kd92ms71x8qp4/pages',
    icon: FileText,
    label: 'Manage Pages'
  }, {
    id: 'packages',
    path: '/a93jf02kd92ms71x8qp4/packages',
    icon: Package,
    label: 'Manage Packages'
  }, {
    id: 'careers',
    path: '/a93jf02kd92ms71x8qp4/careers',
    icon: Briefcase,
    label: 'Career Management'
  }, {
    id: 'seo',
    path: '/a93jf02kd92ms71x8qp4/seo',
    icon: Search,
    label: 'SEO Studio'
  }, {
    id: 'roles',
    path: '/a93jf02kd92ms71x8qp4/roles',
    icon: Shield,
    label: 'Role Management',
    adminOnly: true
  }, {
    id: 'settings',
    path: '/a93jf02kd92ms71x8qp4/settings',
    icon: Settings,
    label: 'System Settings'
  }, {
    id: 'documentation',
    path: '/a93jf02kd92ms71x8qp4/documentation',
    icon: BookOpen,
    label: 'Documentation'
  }, {
    id: 'e2e-test',
    path: '/a93jf02kd92ms71x8qp4/e2e-test',
    icon: FlaskConical,
    label: 'E2E Tests',
    adminOnly: true
  }];
  const isActivePath = (path: string): boolean => {
    if (path === '/a93jf02kd92ms71x8qp4') {
      return location.pathname === path;
    }
    return location.pathname === path;
  };

  const isSEORoute = location.pathname.includes(`/${config.adminHashPath}/seo`);
  return <div className="min-h-screen bg-background flex">
      <LoadingBar isLoading={isLoading} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      
      {/* Left Sidebar - Theme-aware */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-gradient-to-b flex flex-col z-50 shadow-2xl transition-all duration-300",
        "dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 from-white via-slate-50 to-slate-100",
        isCollapsed ? "w-16" : "w-72"
      )}>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br dark:from-primary/20 dark:via-primary/5 from-transparent via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-tr dark:from-primary/10 from-primary/5 to-transparent" />
        
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border transition-colors shadow-lg"
        >
          {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
        
        {/* Logo Section */}
        <div className={cn(
          "relative border-b dark:border-white/10 border-slate-200 transition-all duration-300 bg-black",
          isCollapsed ? "p-3" : "p-6"
        )}>
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0 rounded-xl p-2">
              <img 
                src={adminLogo || `${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/storage/v1/object/public/avatars/website/admin-logo.png`} 
                alt="Admin Logo"
                className={cn(
                  "object-contain relative z-10 transition-all duration-300 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] dark:drop-shadow-none",
                  isCollapsed ? "h-8 w-8" : "h-10 w-auto"
                )} 
                onError={e => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }} 
              />
              <div className={cn(
                "hidden items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white font-bold shadow-lg shadow-primary/30",
                isCollapsed ? "h-8 w-8 text-sm" : "h-10 w-10 text-lg"
              )}>
                H
              </div>
            </div>
          </div>
          {!isCollapsed && (
            <p className="text-xs text-slate-300 dark:text-slate-400 mt-2 font-medium tracking-wider uppercase">Admin Portal</p>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "relative flex-1 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          {!isCollapsed && (
            <p className="text-[10px] dark:text-slate-500 text-slate-400 font-semibold tracking-widest uppercase px-3 py-2">Main Menu</p>
          )}
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);

            if (item.adminOnly && !hasRole('admin')) {
              return null;
            }

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "group relative flex items-center rounded-xl transition-all duration-300",
                      isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                      isActive 
                        ? 'dark:bg-gradient-to-r dark:from-primary/25 dark:to-primary/10 bg-primary/10 text-foreground shadow-lg dark:shadow-primary/20 shadow-primary/10 backdrop-blur-sm border dark:border-white/[0.08] border-primary/20' 
                        : 'dark:text-slate-400 text-slate-600 hover:text-foreground dark:hover:bg-white/[0.06] hover:bg-black/[0.04] hover:backdrop-blur-sm'
                    )}
                  >
                    {/* Active indicator line */}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-lg shadow-primary/50" />
                    )}
                    
                    {/* Icon with glow effect on active */}
                    <div className={`relative ${isActive ? '' : 'group-hover:scale-110'} transition-transform duration-200`}>
                      {isActive && <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />}
                      <Icon className={`h-5 w-5 flex-shrink-0 relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary'}`} />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <span className="font-medium text-sm">{item.label}</span>
                        
                        {/* Hover arrow indicator */}
                        {!isActive && (
                          <svg 
                            className="w-4 h-4 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white bg-white border-slate-200 text-slate-800">
                  <p className="font-medium">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* User Section */}
        <div className={cn(
          "relative border-t dark:border-white/10 border-slate-200 space-y-2 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link 
                to="/a93jf02kd92ms71x8qp4/profile" 
                className={cn(
                  "group flex items-center rounded-xl transition-all duration-300 dark:text-slate-400 text-slate-600 hover:text-foreground dark:hover:bg-white/[0.06] hover:bg-black/[0.04]",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-4 py-3"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Avatar className={cn(
                    "ring-2 dark:ring-white/10 ring-slate-200 group-hover:ring-primary/50 transition-all",
                    isCollapsed ? "h-8 w-8" : "h-9 w-9"
                  )}>
                    <AvatarImage src={getAvatarSrc()} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-xs font-semibold">
                      {getInitials(profile.username || 'User')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{profile.username || 'User'}</p>
                    <p className="text-[10px] dark:text-slate-500 text-slate-400 truncate">{profile.email || 'Admin'}</p>
                  </div>
                )}
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white bg-white border-slate-200 text-slate-800">
                <p className="font-medium">{profile.username || 'User'}</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={handleSignOut} 
                className={cn(
                  "group flex items-center rounded-xl transition-all duration-300 dark:text-slate-400 text-slate-500 hover:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 hover:bg-red-50 w-full",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-4 py-3"
                )}
              >
                <LogOut className="h-5 w-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
                {!isCollapsed && <span className="font-medium text-sm">Sign Out</span>}
              </button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="dark:bg-slate-800 dark:border-slate-700 dark:text-white bg-white border-slate-200 text-slate-800">
                <p className="font-medium">Sign Out</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-72"
      )}>
        <AdminTopBar onOpenCommandPalette={() => setCommandOpen(true)} alerts={alerts} />
        <div className={cn("flex-1 min-h-0", isSEORoute ? "overflow-hidden" : "overflow-auto container mx-auto p-6")}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: isSEORoute ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>;
};
export default AdminLayout;
