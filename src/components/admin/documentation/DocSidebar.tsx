import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, User, Code, Home, Search, X, Sparkles, BookOpen, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { documentationCategories, type DocCategory } from '@/content/documentation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface DocSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

// New articles to show badges (articles added in the last 7 days)
const newArticles = [
  'zustand-store',
  'data-wrapper-pattern',
  'element-registry',
  'logger-system',
  'database-schema',
  'section-dnd-config',
  'collaborative-editing',
  'translation-dashboard',
  'infrastructure',
  'cicd-pipeline',
  'environment-sync',
  'database-migrations',
  'edge-functions-deployment',
  'secrets-management',
  'troubleshooting',
];

export const DocSidebar: React.FC<DocSidebarProps> = ({ 
  className,
  isCollapsed: controlledCollapsed,
  onToggleCollapse 
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use internal state if not controlled
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    const saved = localStorage.getItem('doc-sidebar-collapsed');
    return saved === 'true';
  });
  
  const isCollapsed = controlledCollapsed ?? internalCollapsed;
  
  // Track admin sidebar collapsed state for positioning
  const [adminSidebarCollapsed, setAdminSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    return saved === 'true';
  });
  
  // Listen for admin sidebar changes
  useEffect(() => {
    const checkAdminSidebar = () => {
      const saved = localStorage.getItem('admin-sidebar-collapsed');
      setAdminSidebarCollapsed(saved === 'true');
    };
    
    // Check on mount and listen for storage changes
    checkAdminSidebar();
    window.addEventListener('storage', checkAdminSidebar);
    
    // Also poll for changes since storage events don't fire in same window
    const interval = setInterval(checkAdminSidebar, 100);
    
    return () => {
      window.removeEventListener('storage', checkAdminSidebar);
      clearInterval(interval);
    };
  }, []);
  
  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };
  
  // Persist collapsed state
  useEffect(() => {
    if (controlledCollapsed === undefined) {
      localStorage.setItem('doc-sidebar-collapsed', String(internalCollapsed));
    }
  }, [internalCollapsed, controlledCollapsed]);
  
  // Determine which category should be open based on current path
  const getDefaultOpen = (categoryId: string): boolean => {
    return currentPath.includes(`/documentation/${categoryId}`);
  };

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'user':
        return User;
      case 'code':
        return Code;
      case 'server':
        return Server;
      default:
        return BookOpen;
    }
  };

  // Filter articles based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return documentationCategories;
    
    const query = searchQuery.toLowerCase();
    return documentationCategories.map(category => ({
      ...category,
      articles: category.articles.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      )
    })).filter(category => category.articles.length > 0);
  }, [searchQuery]);

  return (
    <aside className={cn(
      "shrink-0 border-r border-border bg-gradient-to-b from-muted/30 to-background transition-all duration-300",
      "fixed top-0 h-screen z-40",
      adminSidebarCollapsed ? "left-16" : "left-72",
      isCollapsed ? "w-14" : "w-72",
      className
    )}>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Collapse Toggle Button - inside sticky container */}
        <button
          onClick={handleToggle}
          className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-md"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </motion.div>
        </button>
        {/* Header */}
        <div className={cn(
          "border-b border-border bg-background/80 backdrop-blur-sm transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/a93jf02kd92ms71x8qp4/documentation"
                className={cn(
                  "flex items-center rounded-xl text-sm font-medium transition-all",
                  "hover:bg-primary/10",
                  isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5",
                  currentPath === '/a93jf02kd92ms71x8qp4/documentation'
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground"
                )}
              >
                <div className={cn(
                  "p-1.5 rounded-lg flex-shrink-0",
                  currentPath === '/a93jf02kd92ms71x8qp4/documentation'
                    ? "bg-primary-foreground/20"
                    : "bg-primary/10"
                )}>
                  <Home className="h-4 w-4" />
                </div>
                {!isCollapsed && <span>Documentation</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Documentation Home</p>
              </TooltipContent>
            )}
          </Tooltip>
          
          {/* Search - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-9 bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Navigation */}
        {isCollapsed ? (
          // Collapsed view - icons outside ScrollArea to stay visible
          <nav className="p-2 space-y-2">
            {documentationCategories.map((category) => {
              const Icon = getCategoryIcon(category.icon);
              const isActive = currentPath.includes(`/documentation/${category.id}`);
              
              return (
                <Tooltip key={category.id}>
                  <TooltipTrigger asChild>
                    <Link
                      to={`/a93jf02kd92ms71x8qp4/documentation/${category.id}`}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-xl transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{category.title}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        ) : (
          // Expanded view - with ScrollArea for long content
          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  currentPath={currentPath}
                  defaultOpen={getDefaultOpen(category.id) || !!searchQuery}
                  getCategoryIcon={getCategoryIcon}
                  searchQuery={searchQuery}
                />
              ))}
              
              {filteredCategories.length === 0 && searchQuery && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results for "{searchQuery}"</p>
                </motion.div>
              )}
            </nav>
          </ScrollArea>
        )}
        
        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border bg-muted/20">
            <div className="text-xs text-muted-foreground text-center">
              <span className="font-medium">{documentationCategories.reduce((acc, cat) => acc + cat.articles.length, 0)}</span> articles
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

interface CategorySectionProps {
  category: DocCategory;
  currentPath: string;
  defaultOpen: boolean;
  getCategoryIcon: (icon: string) => React.ComponentType<{ className?: string }>;
  searchQuery: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  currentPath,
  defaultOpen,
  getCategoryIcon,
  searchQuery,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const Icon = getCategoryIcon(category.icon);
  
  // Count new articles in this category
  const newCount = category.articles.filter(a => newArticles.includes(a.slug)).length;

  return (
    <Collapsible open={isOpen || !!searchQuery} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            "hover:bg-muted/70",
            isOpen && "bg-muted/50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-foreground">{category.title}</span>
            {newCount > 0 && !searchQuery && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                <Sparkles className="h-2.5 w-2.5" />
                {newCount} new
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isOpen || searchQuery ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <motion.div 
          initial={false}
          className="ml-5 mt-1 space-y-0.5 border-l-2 border-border/50 pl-3"
        >
          {category.articles.map((article, index) => {
            const articlePath = `/a93jf02kd92ms71x8qp4/documentation/${category.id}/${article.slug}`;
            const isActive = currentPath === articlePath;
            const isNew = newArticles.includes(article.slug);

            return (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={articlePath}
                  className={cn(
                    "group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-[2px] pl-[14px]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="truncate">{article.title}</span>
                  {isNew && !searchQuery && (
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DocSidebar;
