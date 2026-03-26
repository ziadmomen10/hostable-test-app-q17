/**
 * SEOOverlayIssuesList
 * 
 * Prioritized scrollable list of detected SEO issues with jump-to functionality.
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SEOOverlayIssue, IssueSeverity } from './types';

interface SEOOverlayIssuesListProps {
  issues: SEOOverlayIssue[];
  onJumpTo: (elementId: string) => void;
  onFix?: (issue: SEOOverlayIssue) => void;
  maxHeight?: number;
  className?: string;
}

const SEVERITY_CONFIG: Record<IssueSeverity, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}> = {
  critical: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    label: 'Critical'
  },
  high: {
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    label: 'High'
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    label: 'Medium'
  },
  low: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    label: 'Low'
  }
};

export function SEOOverlayIssuesList({ 
  issues, 
  onJumpTo, 
  onFix,
  maxHeight = 200,
  className 
}: SEOOverlayIssuesListProps) {
  // Group issues by severity
  const groupedIssues = React.useMemo(() => {
    const groups: Record<IssueSeverity, SEOOverlayIssue[]> = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };
    
    issues.forEach(issue => {
      groups[issue.severity].push(issue);
    });
    
    return groups;
  }, [issues]);

  if (issues.length === 0) {
    return (
      <div className={cn("text-center py-4 text-[10px] text-muted-foreground", className)}>
        <div className="text-green-600 font-medium">✓ No issues found!</div>
        <div className="mt-1">This page passes all SEO checks.</div>
      </div>
    );
  }

  return (
    <ScrollArea className={className} style={{ maxHeight }}>
      <div className="space-y-2 pr-2">
        {(['critical', 'high', 'medium', 'low'] as IssueSeverity[]).map(severity => {
          const severityIssues = groupedIssues[severity];
          if (severityIssues.length === 0) return null;
          
          const config = SEVERITY_CONFIG[severity];
          const Icon = config.icon;
          
          return (
            <div key={severity} className="space-y-1">
              {/* Severity Header */}
              <div className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-semibold",
                config.bgColor,
                config.color
              )}>
                <Icon className="h-3 w-3" />
                <span>{config.label}</span>
                <span className="text-[8px] opacity-70">({severityIssues.length})</span>
              </div>
              
              {/* Issues */}
              <div className="space-y-0.5 pl-2">
                {severityIssues.map(issue => (
                  <div 
                    key={issue.id}
                    className="group flex items-center justify-between gap-2 py-1 px-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-medium truncate">
                        {issue.title}
                      </div>
                      <div className="text-[9px] text-muted-foreground truncate">
                        {issue.description}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {issue.elementId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-[8px]"
                          onClick={() => onJumpTo(issue.elementId!)}
                        >
                          <ArrowRight className="h-2.5 w-2.5 mr-0.5" />
                          Jump
                        </Button>
                      )}
                      {issue.fix && onFix && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-5 px-1.5 text-[8px]"
                          onClick={() => onFix(issue)}
                        >
                          Fix
                          <ChevronRight className="h-2.5 w-2.5 ml-0.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
