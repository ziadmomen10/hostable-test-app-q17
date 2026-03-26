import React from 'react';
import { cn } from '@/lib/utils';
import { Code, ArrowRight, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { DocVersionBadge } from './DocVersionBadge';

interface Parameter {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  default?: string;
}

interface DocAPIReferenceProps {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint?: string;
  functionName?: string;
  signature?: string;
  description?: string;
  parameters?: Parameter[];
  returnType?: string;
  returnDescription?: string;
  example?: string;
  version?: string;
  className?: string;
}

const methodColors = {
  GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  POST: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  PUT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  DELETE: 'bg-red-500/10 text-red-600 dark:text-red-400',
  PATCH: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

export const DocAPIReference: React.FC<DocAPIReferenceProps> = ({
  method,
  endpoint,
  functionName,
  signature,
  description,
  parameters = [],
  returnType,
  returnDescription,
  example,
  version,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const textToCopy = signature || `${method} ${endpoint}`;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "my-6 rounded-xl border border-border bg-card overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3 flex-wrap">
          {method && (
            <span className={cn(
              "px-2 py-1 rounded-md text-xs font-bold uppercase",
              methodColors[method]
            )}>
              {method}
            </span>
          )}
          
          {endpoint && (
            <code className="text-sm font-mono text-foreground bg-muted px-2 py-1 rounded">
              {endpoint}
            </code>
          )}
          
          {functionName && (
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <code className="text-sm font-mono font-semibold text-foreground">
                {functionName}
              </code>
            </div>
          )}
          
          {version && (
            <DocVersionBadge version={version} type="stable" size="sm" />
          )}
        </div>
        
        <button
          onClick={handleCopy}
          className={cn(
            "p-2 rounded-md transition-colors",
            copied 
              ? "bg-emerald-500/10 text-emerald-600" 
              : "hover:bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Signature */}
      {signature && (
        <div className="px-4 py-3 bg-slate-900 border-b border-border">
          <code className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
            {signature}
          </code>
        </div>
      )}
      
      {/* Description */}
      {description && (
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
      
      {/* Parameters */}
      {parameters.length > 0 && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Parameters
          </h4>
          <div className="space-y-3">
            {parameters.map((param) => (
              <div 
                key={param.name} 
                className="flex flex-wrap items-start gap-2 p-3 rounded-lg bg-muted/30"
              >
                <code className="text-sm font-mono font-semibold text-primary">
                  {param.name}
                </code>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {param.type}
                </span>
                {param.required && (
                  <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                    required
                  </span>
                )}
                {param.default && (
                  <span className="text-xs text-muted-foreground">
                    = {param.default}
                  </span>
                )}
                <p className="w-full text-sm text-muted-foreground mt-1">
                  {param.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Return Type */}
      {returnType && (
        <div className="p-4 border-b border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary rotate-180" />
            Returns
          </h4>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
              {returnType}
            </code>
            {returnDescription && (
              <span className="text-sm text-muted-foreground">— {returnDescription}</span>
            )}
          </div>
        </div>
      )}
      
      {/* Example */}
      {example && (
        <div className="p-4 bg-slate-900">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Example</h4>
          <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto">
            {example}
          </pre>
        </div>
      )}
    </motion.div>
  );
};

export default DocAPIReference;
