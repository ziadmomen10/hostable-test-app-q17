import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface LoadingBarProps {
  isLoading: boolean;
  duration?: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ isLoading, duration = 800 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90; // Stop at 90% until loading is complete
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      // Complete the loading
      setProgress(100);
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress 
        value={progress} 
        className="h-1 rounded-none border-none bg-transparent" 
      />
    </div>
  );
};

export default LoadingBar;