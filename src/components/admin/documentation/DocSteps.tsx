import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Step {
  title: string;
  description: string | React.ReactNode;
  image?: string;
  imageAlt?: string;
}

interface DocStepsProps {
  steps: Step[];
  className?: string;
  variant?: 'numbered' | 'checkmark';
}

export const DocSteps: React.FC<DocStepsProps> = ({ 
  steps, 
  className,
  variant = 'numbered' 
}) => {
  return (
    <div className={cn("my-8 relative", className)}>
      {/* Connecting line */}
      <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20" />
      
      <div className="space-y-0">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative flex gap-6 pb-8 last:pb-0"
          >
            {/* Step indicator */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg",
                  variant === 'numbered' 
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                    : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                )}
              >
                {variant === 'numbered' ? (
                  <span>{index + 1}</span>
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </motion.div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pt-1">
              <h4 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h4>
              
              <div className="text-muted-foreground leading-relaxed">
                {typeof step.description === 'string' ? (
                  <p>{step.description}</p>
                ) : (
                  step.description
                )}
              </div>
              
              {/* Optional image */}
              {step.image && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4"
                >
                  <div className="overflow-hidden rounded-xl border border-border shadow-lg">
                    <img 
                      src={step.image} 
                      alt={step.imageAlt || step.title}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                  {step.imageAlt && (
                    <p className="mt-2 text-sm text-muted-foreground italic text-center">
                      {step.imageAlt}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DocSteps;
