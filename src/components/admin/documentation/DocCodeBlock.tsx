import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, File, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  caption?: string;
}

export const DocCodeBlock: React.FC<DocCodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  className,
  showLineNumbers = false,
  highlightLines = [],
  caption,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine icon based on filename extension
  const getFileIcon = () => {
    if (!filename) return <Terminal className="h-4 w-4" />;
    if (filename.endsWith('.ts') || filename.endsWith('.tsx')) {
      return <File className="h-4 w-4 text-blue-400" />;
    }
    if (filename.endsWith('.css') || filename.endsWith('.scss')) {
      return <File className="h-4 w-4 text-pink-400" />;
    }
    if (filename.endsWith('.json')) {
      return <File className="h-4 w-4 text-yellow-400" />;
    }
    return <File className="h-4 w-4 text-slate-400" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "my-6 rounded-xl overflow-hidden border border-slate-700 shadow-2xl",
        className
      )}
    >
      {/* Header with filename */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          {filename && (
            <div className="flex items-center gap-2 text-slate-400">
              {getFileIcon()}
              <span className="text-sm font-mono">{filename}</span>
            </div>
          )}
          
          {!filename && (
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              {language}
            </span>
          )}
        </div>
        
        {/* Copy button */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            copied 
              ? "bg-emerald-500/20 text-emerald-400" 
              : "bg-slate-700 hover:bg-slate-600 text-slate-300"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </motion.button>
      </div>
      
      {/* Code content */}
      <div className="relative bg-slate-900">
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          showLineNumbers={showLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber) => ({
            style: {
              backgroundColor: highlightLines.includes(lineNumber) 
                ? 'rgba(139, 92, 246, 0.15)' 
                : undefined,
              display: 'block',
              width: '100%',
            },
          })}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      
      {/* Optional caption */}
      {caption && (
        <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700">
          <p className="text-xs text-slate-400 italic">{caption}</p>
        </div>
      )}
    </motion.div>
  );
};

export default DocCodeBlock;
