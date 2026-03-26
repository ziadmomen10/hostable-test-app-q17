import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, Plus } from 'lucide-react';

interface ActionButton {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  loading?: boolean;
}

interface AdminSectionHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: ActionButton[];
  showRefresh?: boolean;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  lastUpdated?: string;
}

const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
  title,
  subtitle,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  actions = [],
  showRefresh = false,
  onRefresh,
  refreshLoading = false,
  lastUpdated,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-white/[0.08] backdrop-blur-xl p-6 mb-6 shadow-xl shadow-primary/5">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        {/* Top row - Title and last updated */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Last synced: {lastUpdated}</span>
            </div>
          )}
        </div>
        
        {/* Bottom row - Search and actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          {onSearchChange && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-background/70 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl h-10"
              />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {showRefresh && onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={refreshLoading}
                className="rounded-xl bg-background/70 backdrop-blur-sm border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all duration-200"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
            
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={action.onClick}
                disabled={action.loading}
                className="rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {action.icon || <Plus className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSectionHeader;
