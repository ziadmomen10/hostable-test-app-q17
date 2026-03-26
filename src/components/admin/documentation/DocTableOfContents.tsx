import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { List } from 'lucide-react';
import { motion } from 'framer-motion';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocTableOfContentsProps {
  content: string;
  className?: string;
}

function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2]
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/`/g, '')    // Remove code markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .trim();
    
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    headings.push({ id, text, level });
  }

  return headings;
}

export const DocTableOfContents: React.FC<DocTableOfContentsProps> = ({
  content,
  className,
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const headings = useMemo(() => extractHeadings(content), [content]);

  // Track scroll progress
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
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  // Track active heading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  if (headings.length < 3) {
    return null; // Don't show TOC for short pages
  }

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-28 p-5 rounded-xl border border-border bg-card/50 backdrop-blur-sm max-h-[calc(100vh-160px)] overflow-y-auto",
        className
      )}
    >
      {/* Header with Progress */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">On this page</h4>
        </div>
        <span className="text-xs text-muted-foreground font-medium tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-muted rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      {/* TOC Items with Visual Indicator */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border rounded-full" />
        
        <ul className="space-y-0.5 max-h-[calc(100vh-280px)] overflow-y-auto pl-3">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id;
            const isPassed = headings.findIndex(h => h.id === activeId) > index;
            
            return (
              <li
                key={heading.id}
                className="relative"
                style={{ paddingLeft: `${(heading.level - 1) * 10}px` }}
              >
                {/* Active/Passed Indicator Dot */}
                <div 
                  className={cn(
                    "absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-200",
                    isActive ? "bg-primary scale-125" : isPassed ? "bg-primary/50" : "bg-transparent"
                  )}
                />
                
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={cn(
                    "block py-1.5 text-sm transition-all duration-200 rounded-md px-2",
                    "hover:text-primary",
                    isActive
                      ? "text-primary font-medium"
                      : isPassed
                      ? "text-muted-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
};

export default DocTableOfContents;
