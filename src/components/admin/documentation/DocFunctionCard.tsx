import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Shield, 
  Server, 
  BarChart3,
  LucideIcon,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FunctionInfo {
  name: string;
  description: string;
  anchor: string;
}

interface DocFunctionCardProps {
  category: string;
  description: string;
  icon: 'globe' | 'shield' | 'server' | 'chart';
  functions: FunctionInfo[];
  colorClass?: string;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  globe: Globe,
  shield: Shield,
  server: Server,
  chart: BarChart3,
};

const colorMap: Record<string, { bg: string; border: string; icon: string; hover: string }> = {
  translation: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-500',
    hover: 'hover:border-blue-500/40 hover:bg-blue-500/15',
  },
  authentication: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-500',
    hover: 'hover:border-emerald-500/40 hover:bg-emerald-500/15',
  },
  infrastructure: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-500',
    hover: 'hover:border-purple-500/40 hover:bg-purple-500/15',
  },
  analytics: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: 'text-amber-500',
    hover: 'hover:border-amber-500/40 hover:bg-amber-500/15',
  },
};

export function DocFunctionCard({
  category,
  description,
  icon,
  functions,
  colorClass = 'translation',
  className,
}: DocFunctionCardProps) {
  const Icon = iconMap[icon] || Globe;
  const colors = colorMap[colorClass] || colorMap.translation;

  const handleFunctionClick = (anchor: string) => {
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-xl border p-5 transition-all duration-200',
        colors.bg,
        colors.border,
        colors.hover,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', colors.bg)}>
          <Icon className={cn('h-5 w-5', colors.icon)} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base">{category}</h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Function List */}
      <div className="space-y-1.5 mt-4">
        {functions.map((func, index) => (
          <button
            key={index}
            onClick={() => handleFunctionClick(func.anchor)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-lg transition-colors',
              'bg-background/50 hover:bg-background/80',
              'border border-transparent hover:border-border/50',
              'group flex items-center justify-between gap-2'
            )}
          >
            <div className="min-w-0 flex-1">
              <code className="text-xs font-mono text-foreground/90 group-hover:text-foreground">
                {func.name}
              </code>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {func.description}
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-foreground/70 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Grid component for displaying multiple cards
interface DocFunctionCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function DocFunctionCardGrid({ children, className }: DocFunctionCardGridProps) {
  return (
    <div className={cn(
      'grid gap-4',
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      className
    )}>
      {children}
    </div>
  );
}

export default DocFunctionCard;
