import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Loader2,
  Code2,
  Terminal,
  Braces
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface DocAPIPlaygroundProps {
  functionName: string;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  fields: FieldConfig[];
  description?: string;
  className?: string;
}

export function DocAPIPlayground({
  functionName,
  endpoint,
  method = 'POST',
  fields,
  description,
  className,
}: DocAPIPlaygroundProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach(field => {
      initial[field.name] = field.defaultValue || '';
    });
    return initial;
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const buildRequestBody = useCallback(() => {
    const body: Record<string, any> = {};
    fields.forEach(field => {
      const value = formData[field.name];
      if (value) {
        if (field.type === 'number') {
          body[field.name] = Number(value);
        } else if (value.startsWith('[') || value.startsWith('{')) {
          try {
            body[field.name] = JSON.parse(value);
          } catch {
            body[field.name] = value;
          }
        } else {
          body[field.name] = value;
        }
      }
    });
    return body;
  }, [fields, formData]);

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const body = buildRequestBody();
      const { data, error: invokeError } = await supabase.functions.invoke(functionName, {
        body,
      });

      if (invokeError) {
        setError(invokeError.message);
        toast.error('Request failed', { description: invokeError.message });
      } else {
        setResponse(data);
        toast.success('Request successful');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      toast.error('Request failed', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCurlCommand = () => {
    const body = buildRequestBody();
    const url = `${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/functions/v1/${functionName}`;
    return `curl -X ${method} '${url}' \\
  -H 'Authorization: Bearer YOUR_ANON_KEY' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(body, null, 2)}'`;
  };

  const generateTypeScriptCode = () => {
    const body = buildRequestBody();
    return `const { data, error } = await supabase.functions.invoke('${functionName}', {
  body: ${JSON.stringify(body, null, 2)}
});

if (error) {
  console.error('Error:', error.message);
} else {
  console.log('Response:', data);
}`;
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={cn(
      'rounded-xl border border-border/60 bg-card/50 overflow-hidden',
      'backdrop-blur-sm',
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3',
          'bg-muted/30 hover:bg-muted/50 transition-colors',
          'text-left'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-primary/10">
            <Terminal className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-sm text-foreground">
              API Playground
            </h4>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 border-t border-border/40">
              {/* Form Fields */}
              <div className="grid gap-3">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <Label htmlFor={field.name} className="text-xs font-medium">
                      {field.label}
                      {field.required && <span className="text-destructive ml-0.5">*</span>}
                    </Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        id={field.name}
                        value={formData[field.name]}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="min-h-[80px] text-sm font-mono"
                      />
                    ) : field.type === 'select' && field.options ? (
                      <select
                        id={field.name}
                        value={formData[field.name]}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className={cn(
                          'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1',
                          'text-sm shadow-sm transition-colors',
                          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                        )}
                      >
                        <option value="">Select...</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={formData[field.name]}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="text-sm font-mono"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Execute Button */}
              <Button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full"
                size="sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Execute Request
                  </>
                )}
              </Button>

              {/* Response / Error */}
              {(response || error) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                      {error ? 'Error Response' : 'Response'}
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => handleCopy(
                        JSON.stringify(error || response, null, 2),
                        'response'
                      )}
                    >
                      {copied === 'response' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <pre className={cn(
                    'p-3 rounded-lg text-xs font-mono overflow-x-auto',
                    'max-h-[200px] overflow-y-auto',
                    error 
                      ? 'bg-destructive/10 text-destructive border border-destructive/20' 
                      : 'bg-muted/50 text-foreground border border-border/40'
                  )}>
                    {error ? error : JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}

              {/* Code Examples */}
              <Tabs defaultValue="typescript" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="typescript" className="text-xs gap-1.5">
                    <Code2 className="h-3.5 w-3.5" />
                    TypeScript
                  </TabsTrigger>
                  <TabsTrigger value="curl" className="text-xs gap-1.5">
                    <Terminal className="h-3.5 w-3.5" />
                    cURL
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="typescript" className="mt-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-7 px-2 z-10"
                      onClick={() => handleCopy(generateTypeScriptCode(), 'typescript')}
                    >
                      {copied === 'typescript' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto border border-border/40">
                      {generateTypeScriptCode()}
                    </pre>
                  </div>
                </TabsContent>
                <TabsContent value="curl" className="mt-2">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-7 px-2 z-10"
                      onClick={() => handleCopy(generateCurlCommand(), 'curl')}
                    >
                      {copied === 'curl' ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <pre className="p-3 rounded-lg bg-muted/50 text-xs font-mono overflow-x-auto border border-border/40 whitespace-pre-wrap">
                      {generateCurlCommand()}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DocAPIPlayground;
