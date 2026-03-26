import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DocAccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

interface DocAccordionProps {
  children: React.ReactNode;
  className?: string;
  type?: 'single' | 'multiple';
}

export const DocAccordionItem: React.FC<DocAccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border last:border-b-0">
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "flex items-center justify-between px-4 py-4 text-left transition-colors",
          "hover:bg-muted/50",
          isOpen && "bg-muted/30"
        )}>
          <div className="flex items-center gap-3">
            {icon && (
              <span className="text-primary">{icon}</span>
            )}
            <span className="font-medium text-foreground">{title}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-4 pt-2 text-muted-foreground"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const DocAccordion: React.FC<DocAccordionProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "my-6 rounded-xl border border-border bg-card/50 overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
};

export default DocAccordion;
