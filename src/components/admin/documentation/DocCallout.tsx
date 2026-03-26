import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  AlertTriangle, 
  Info, 
  AlertCircle,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DocCalloutProps {
  type?: 'tip' | 'warning' | 'note' | 'important' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig = {
  tip: {
    icon: Lightbulb,
    defaultTitle: 'Pro Tip',
    containerClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    titleClass: 'text-emerald-800 dark:text-emerald-300',
    gradientClass: 'from-emerald-500/20 to-transparent',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: 'Warning',
    containerClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    iconClass: 'text-amber-600 dark:text-amber-400',
    titleClass: 'text-amber-800 dark:text-amber-300',
    gradientClass: 'from-amber-500/20 to-transparent',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50',
  },
  note: {
    icon: Info,
    defaultTitle: 'Note',
    containerClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    iconClass: 'text-blue-600 dark:text-blue-400',
    titleClass: 'text-blue-800 dark:text-blue-300',
    gradientClass: 'from-blue-500/20 to-transparent',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
  },
  important: {
    icon: AlertCircle,
    defaultTitle: 'Important',
    containerClass: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    iconClass: 'text-purple-600 dark:text-purple-400',
    titleClass: 'text-purple-800 dark:text-purple-300',
    gradientClass: 'from-purple-500/20 to-transparent',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
  },
  danger: {
    icon: Flame,
    defaultTitle: 'Danger',
    containerClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    iconClass: 'text-red-600 dark:text-red-400',
    titleClass: 'text-red-800 dark:text-red-300',
    gradientClass: 'from-red-500/20 to-transparent',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
  },
};

export const DocCallout: React.FC<DocCalloutProps> = ({
  type = 'note',
  title,
  children,
  className,
}) => {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative my-8 rounded-xl border-2 p-6 overflow-hidden",
        config.containerClass,
        className
      )}
    >
      {/* Gradient overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r pointer-events-none",
          config.gradientClass
        )} 
      />
      
      <div className="relative flex gap-4">
        {/* Icon with animation */}
        <motion.div 
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
            config.iconBg
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className={cn("h-5 w-5", config.iconClass)} />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          {displayTitle && (
            <h5 className={cn(
              "font-semibold text-base mb-2",
              config.titleClass
            )}>
              {displayTitle}
            </h5>
          )}
          <div className="text-sm leading-relaxed text-muted-foreground [&>p]:mb-0 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocCallout;
