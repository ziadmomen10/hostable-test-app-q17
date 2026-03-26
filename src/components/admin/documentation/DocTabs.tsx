import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DocTabProps {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

interface DocTabsProps {
  children: React.ReactElement<DocTabProps>[];
  defaultTab?: number;
  className?: string;
}

export const DocTab: React.FC<DocTabProps> = ({ children }) => {
  return <>{children}</>;
};

export const DocTabs: React.FC<DocTabsProps> = ({ children, defaultTab = 0, className }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = React.Children.toArray(children) as React.ReactElement<DocTabProps>[];

  return (
    <div className={cn("my-6 rounded-xl border border-border bg-card/50 overflow-hidden", className)}>
      {/* Tab Headers */}
      <div className="flex border-b border-border bg-muted/30">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              "hover:text-foreground",
              activeTab === index 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            {tab.props.icon}
            {tab.props.label}
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="p-4"
      >
        {tabs[activeTab]}
      </motion.div>
    </div>
  );
};

export default DocTabs;
