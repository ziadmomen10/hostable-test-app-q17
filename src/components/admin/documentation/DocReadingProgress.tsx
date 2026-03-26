import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DocReadingProgressProps {
  className?: string;
}

export const DocReadingProgress: React.FC<DocReadingProgressProps> = ({ className }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      
      if (documentHeight > 0) {
        const newProgress = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
        setProgress(newProgress);
      }
    };

    calculateProgress();
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Vertical Progress Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-primary rounded-full origin-top"
          style={{ height: `${progress}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      {/* Percentage Text */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <span className="text-xs text-muted-foreground font-medium">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default DocReadingProgress;
