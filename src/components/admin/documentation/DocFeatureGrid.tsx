import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'primary' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  iconColor?: string;
}

interface DocFeatureGridProps {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/10',
    icon: 'text-primary',
    border: 'border-primary/20',
  },
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    icon: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    icon: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-500',
    border: 'border-purple-500/20',
  },
  rose: {
    bg: 'bg-rose-500/10',
    icon: 'text-rose-500',
    border: 'border-rose-500/20',
  },
};

export const DocFeatureGrid: React.FC<DocFeatureGridProps> = ({
  items,
  columns = 3,
  className,
}) => {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div 
      className={cn(
        "grid gap-4 my-8",
        gridCols[columns],
        className
      )}
    >
      {items.map((item, index) => {
        const colors = colorClasses[item.color || 'primary'];
        const Icon = item.icon;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={cn(
              "group relative p-6 rounded-xl border-2 bg-card transition-all duration-200",
              "hover:shadow-lg hover:border-primary/30",
              colors.border
            )}
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                colors.bg
              )}>
                <Icon 
                  className={cn("h-6 w-6", colors.icon)} 
                  style={item.iconColor ? { color: item.iconColor } : undefined}
                />
              </div>
              
              {/* Title */}
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DocFeatureGrid;
