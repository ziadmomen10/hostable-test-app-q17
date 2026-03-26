import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, ZoomIn, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DocImageProps {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
  fullWidth?: boolean;
  placeholder?: boolean;
}

export const DocImage: React.FC<DocImageProps> = ({
  src,
  alt,
  caption,
  className,
  fullWidth = false,
  placeholder = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showPlaceholder = !src || placeholder || hasError;

  if (showPlaceholder) {
    return (
      <figure className={cn("my-8", className)}>
        <div 
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-12",
            fullWidth ? "w-full" : "max-w-2xl mx-auto"
          )}
        >
          <ImageOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground/70 text-center">
            {alt || "Image placeholder"}
          </p>
          <p className="text-xs text-muted-foreground/50 mt-1">
            Screenshot coming soon
          </p>
        </div>
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <>
      <figure className={cn("my-8 group", className)}>
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "relative overflow-hidden rounded-xl border border-border shadow-lg cursor-zoom-in",
            fullWidth ? "w-full" : "max-w-4xl mx-auto",
            !isLoaded && "animate-pulse bg-muted"
          )}
          onClick={() => setIsOpen(true)}
        >
          {/* Zoom indicator */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
              <ZoomIn className="h-4 w-4 text-foreground" />
            </div>
          </div>
          
          <img 
            src={src} 
            alt={alt}
            className={cn(
              "w-full h-auto transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </motion.div>
        
        {caption && (
          <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-4 right-4 p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </motion.button>
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={src} 
              alt={alt}
              className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {caption && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg"
              >
                {caption}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DocImage;
