import React from 'react';
import { Copy, Check, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocFlowchartProps {
  content: string;
  title?: string;
  className?: string;
}

const DocFlowchart: React.FC<DocFlowchartProps> = ({ 
  content, 
  title = 'Flowchart',
  className = '' 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`my-6 rounded-xl overflow-hidden border border-border bg-[#1e1e2e] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-b border-border/50">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#f38ba8]" />
            <div className="w-3 h-3 rounded-full bg-[#f9e2af]" />
            <div className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
          </div>
          
          {/* Title */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <GitBranch className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wide">{title}</span>
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Flowchart content */}
      <div className="p-6 overflow-x-auto">
        <pre className="font-mono text-sm text-[#cdd6f4] leading-relaxed whitespace-pre">
          {content}
        </pre>
      </div>
    </motion.div>
  );
};

export default DocFlowchart;
