import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

type BadgeType = 'new' | 'updated' | 'deprecated' | 'beta' | 'stable' | 'experimental';

interface DocVersionBadgeProps {
  version?: string;
  type?: BadgeType;
  className?: string;
  size?: 'sm' | 'md';
}

const badgeConfig = {
  new: {
    icon: Sparkles,
    label: 'New',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  },
  updated: {
    icon: Zap,
    label: 'Updated',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  },
  deprecated: {
    icon: AlertTriangle,
    label: 'Deprecated',
    className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  },
  beta: {
    icon: Clock,
    label: 'Beta',
    className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  },
  stable: {
    icon: CheckCircle,
    label: 'Stable',
    className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  },
  experimental: {
    icon: Sparkles,
    label: 'Experimental',
    className: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  },
};

export const DocVersionBadge: React.FC<DocVersionBadgeProps> = ({
  version,
  type = 'stable',
  className,
  size = 'sm',
}) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        config.className,
        className
      )}
    >
      <Icon className={size === 'sm' ? "h-3 w-3" : "h-4 w-4"} />
      <span>{version || config.label}</span>
    </motion.span>
  );
};

// Inline badge for use in markdown content
export const DocBadge: React.FC<{ children: string; type?: BadgeType }> = ({ children, type = 'new' }) => {
  const config = badgeConfig[type];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border",
      config.className
    )}>
      {children}
    </span>
  );
};

export default DocVersionBadge;
