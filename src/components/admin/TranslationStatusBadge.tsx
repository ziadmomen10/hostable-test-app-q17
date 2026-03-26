import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CheckCircle, Clock, FileEdit, ThumbsDown, Bot, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type TranslationStatus = 'draft' | 'reviewed' | 'approved' | 'rejected' | 'ai_generated' | 'missing';

interface TranslationStatusBadgeProps {
  status: TranslationStatus;
  translationId?: string;
  onStatusChange?: (newStatus: TranslationStatus) => void;
  editable?: boolean;
  size?: 'xs' | 'sm' | 'default';
  showIcon?: boolean;
}

const statusConfig: Record<TranslationStatus, { 
  icon: React.ElementType; 
  label: string; 
  shortLabel: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  className: string;
  description: string;
}> = {
  missing: {
    icon: AlertCircle,
    label: 'Missing',
    shortLabel: '—',
    variant: 'outline',
    className: 'bg-gray-50 text-gray-500 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200',
    description: 'No translation exists for this language'
  },
  ai_generated: {
    icon: Bot,
    label: 'AI Generated',
    shortLabel: 'AI',
    variant: 'outline',
    className: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    description: 'Auto-translated by AI. Review before publishing.'
  },
  draft: {
    icon: FileEdit,
    label: 'Draft',
    shortLabel: 'Draft',
    variant: 'secondary',
    className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200'  ,
    description: 'Saved but pending review'
  },
  reviewed: {
    icon: Clock,
    label: 'Reviewed',
    shortLabel: 'Reviewed',
    variant: 'outline',
    className: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200',
    description: 'Reviewed but not yet approved'
  },
  approved: {
    icon: CheckCircle,
    label: 'Approved',
    shortLabel: '✓',
    variant: 'default',
    className: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border-green-200',
    description: 'Ready for production'
  },
  rejected: {
    icon: ThumbsDown,
    label: 'Rejected',
    shortLabel: '✗',
    variant: 'destructive',
    className: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    description: 'Needs revision'
  }
};

export const TranslationStatusBadge: React.FC<TranslationStatusBadgeProps> = ({
  status,
  translationId,
  onStatusChange,
  editable = false,
  size = 'default',
  showIcon = true
}) => {
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;

  const handleStatusChange = async (newStatus: TranslationStatus) => {
    if (newStatus === 'missing') return; // Can't set to missing
    
    if (!translationId) {
      onStatusChange?.(newStatus);
      return;
    }

    try {
      const updateData: Record<string, any> = { status: newStatus };
      
      if (newStatus === 'reviewed') {
        updateData.reviewed_at = new Date().toISOString();
      } else if (newStatus === 'approved') {
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('translations')
        .update(updateData)
        .eq('id', translationId);

      if (error) throw error;

      onStatusChange?.(newStatus);
      toast.success(`Translation marked as ${config.label}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const sizeClasses = {
    xs: 'text-[9px] px-1 py-0 h-4',
    sm: 'text-[10px] px-1.5 py-0 h-5',
    default: 'text-xs px-2 py-0.5'
  };

  const iconSizes = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    default: 'h-3.5 w-3.5'
  };

  const badge = (
    <Badge 
      variant="outline" 
      className={`${config.className} ${sizeClasses[size]} gap-1`}
    >
      {showIcon && <Icon className={`${iconSizes[size]}`} />}
      {size !== 'xs' ? config.label : config.shortLabel}
    </Badge>
  );

  if (!editable) return badge;

  // Filter out statuses that shouldn't be selectable
  const selectableStatuses = Object.entries(statusConfig).filter(
    ([key]) => key !== 'missing'
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          {badge}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1" align="end">
        <div className="space-y-0.5">
          {selectableStatuses.map(([key, cfg]) => {
            const StatusIcon = cfg.icon;
            return (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-xs ${status === key ? 'bg-accent' : ''}`}
                onClick={() => handleStatusChange(key as TranslationStatus)}
              >
                <StatusIcon className="h-3.5 w-3.5 mr-2" />
                <div className="flex flex-col items-start">
                  <span>{cfg.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TranslationStatusBadge;
