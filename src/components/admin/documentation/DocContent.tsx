import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { DocCallout } from './DocCallout';
import { DocFileTree } from './DocFileTree';
import DocMermaid from './DocMermaid';
import { DocVersionBadge } from './DocVersionBadge';
import { Check, Copy, Link as LinkIcon, File, Terminal, FileCode, FileJson, FileType, Cog } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface DocContentProps {
  content: string;
  className?: string;
}

// Enhanced code block header with file icons
const CodeBlockHeader: React.FC<{ 
  language?: string; 
  filename?: string;
  code: string;
}> = ({ language, filename, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (name?: string) => {
    if (!name) return <Terminal className="h-4 w-4 text-slate-400" />;
    const ext = name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'ts':
      case 'tsx':
        return <FileCode className="h-4 w-4 text-blue-400" />;
      case 'js':
      case 'jsx':
        return <FileCode className="h-4 w-4 text-yellow-400" />;
      case 'css':
      case 'scss':
        return <FileType className="h-4 w-4 text-pink-400" />;
      case 'json':
        return <FileJson className="h-4 w-4 text-amber-400" />;
      default:
        return <File className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        {/* Traffic light dots */}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
          <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
        </div>
        
        {filename ? (
          <div className="flex items-center gap-2">
            {getFileIcon(filename)}
            <span className="text-sm font-mono text-slate-300">{filename}</span>
          </div>
        ) : language ? (
          <span className="text-xs text-slate-500 uppercase tracking-wider font-medium px-2 py-0.5 bg-slate-700/50 rounded">
            {language}
          </span>
        ) : null}
      </div>
      
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
          copied 
            ? "bg-emerald-500/20 text-emerald-400" 
            : "bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-slate-200"
        )}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

// Anchor link button for headings
const AnchorLink: React.FC<{ id: string }> = ({ id }) => (
  <a
    href={`#${id}`}
    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-muted-foreground hover:text-primary"
    aria-label="Link to this section"
  >
    <LinkIcon className="h-4 w-4 inline-block" />
  </a>
);

// Content type detection - simplified to only detect file trees
// All diagrams should use explicit ```mermaid syntax
type ContentType = 'file-tree' | 'plain-text';

function detectContentType(code: string): ContentType {
  const lines = code.trim().split('\n');
  
  // Tree structure patterns - specific to file trees
  const treePatterns = ['├──', '└──', '│   ', '│  '];
  const hasTreeStructure = lines.filter(line =>
    treePatterns.some(pattern => line.includes(pattern))
  ).length >= 2;
  
  // File-like names (extensions or trailing slash for folders)
  const fileExtensions = /\.(tsx?|jsx?|css|scss|json|md|html|yml|yaml|toml|config|ts|js|py|rb|go|rs|sh|bash|sql|env|lock|gitignore)$/;
  const folderPattern = /\/\s*$/;
  const hasFileNames = lines.some(line => {
    const cleanLine = line.replace(/[├└│─\s]+/g, '').trim();
    return fileExtensions.test(cleanLine) || folderPattern.test(cleanLine) || cleanLine.endsWith('/');
  });
  
  // Root folder pattern (like "src/", "components/", etc.)
  const hasRootFolder = lines.length > 0 && /^[\w-]+\/\s*$/.test(lines[0].trim());
  
  // Only detect file trees - everything else is plain text
  // Authors should use ```mermaid for diagrams
  if (hasTreeStructure && (hasFileNames || hasRootFolder)) {
    return 'file-tree';
  }
  
  return 'plain-text';
}

// Legacy function for backwards compatibility
function isFileTreeContent(code: string): boolean {
  return detectContentType(code) === 'file-tree';
}

// Extract filename from code fence (e.g., ```tsx title="filename.tsx")
function extractFilename(className?: string, metastring?: string): string | undefined {
  if (metastring) {
    const match = metastring.match(/(?:title|filename)=["']?([^"'\s]+)["']?/);
    if (match) return match[1];
  }
  return undefined;
}

export const DocContent: React.FC<DocContentProps> = ({ content, className }) => {
  // Process content to handle custom syntax like callouts and badges
  const processedContent = useMemo(() => {
    let result = content;
    
    // Convert > 💡 **Pro Tip:** to callout syntax
    result = result.replace(/^>\s*💡\s*\*\*Pro Tip:\*\*\s*/gm, ':::tip\n');
    result = result.replace(/^>\s*⚠️\s*\*\*Warning:\*\*\s*/gm, ':::warning\n');
    result = result.replace(/^>\s*ℹ️\s*\*\*Note:\*\*\s*/gm, ':::note\n');
    result = result.replace(/^>\s*🚨\s*\*\*Danger:\*\*\s*/gm, ':::danger\n');
    
    return result;
  }, [content]);

  return (
    <div className={cn("doc-prose max-w-[768px]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          // Headings with anchor links - Professional typography scale
          h1: ({ children, id }) => (
            <h1 
              id={id}
              className="group text-4xl md:text-[2.5rem] font-extrabold tracking-tight text-foreground mb-6 mt-2 leading-[1.1] scroll-mt-24"
            >
              {children}
              {id && <AnchorLink id={id} />}
            </h1>
          ),
          h2: ({ children, id }) => (
            <h2 
              id={id}
              className="group text-2xl md:text-[1.75rem] font-bold text-foreground mt-16 mb-4 pb-4 border-b border-border leading-tight scroll-mt-24"
            >
              {children}
              {id && <AnchorLink id={id} />}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3 
              id={id}
              className="group text-xl md:text-[1.375rem] font-semibold text-foreground mt-12 mb-3 leading-snug scroll-mt-24"
            >
              {children}
              {id && <AnchorLink id={id} />}
            </h3>
          ),
          h4: ({ children, id }) => (
            <h4 
              id={id}
              className="group text-lg md:text-[1.125rem] font-semibold text-foreground mt-8 mb-2 scroll-mt-24"
            >
              {children}
              {id && <AnchorLink id={id} />}
            </h4>
          ),
          
          // Paragraphs with lead styling for first paragraph
          p: ({ children }) => {
            // Check if this is a callout marker
            const textContent = String(children);
            if (textContent.startsWith(':::tip')) {
              return (
                <DocCallout type="tip" title="Pro Tip">
                  {textContent.replace(':::tip', '').trim()}
                </DocCallout>
              );
            }
            if (textContent.startsWith(':::warning')) {
              return (
                <DocCallout type="warning" title="Warning">
                  {textContent.replace(':::warning', '').trim()}
                </DocCallout>
              );
            }
            if (textContent.startsWith(':::note')) {
              return (
                <DocCallout type="note" title="Note">
                  {textContent.replace(':::note', '').trim()}
                </DocCallout>
              );
            }
            if (textContent.startsWith(':::danger')) {
              return (
                <DocCallout type="danger" title="Danger">
                  {textContent.replace(':::danger', '').trim()}
                </DocCallout>
              );
            }
            
            // Check for inline badge syntax {badge:type}
            const hasBadge = /\{badge:(new|updated|beta|deprecated)\}/g.test(textContent);
            if (hasBadge) {
              const processedChildren = React.Children.map(children, (child) => {
                if (typeof child === 'string') {
                  return child.replace(/\{badge:(new|updated|beta|deprecated)\}/g, (_, type) => {
                    return `<DocVersionBadge type="${type}" />`;
                  });
                }
                return child;
              });
              return (
                <p className="text-base leading-[1.75] text-muted-foreground mb-5">
                  {processedChildren}
                </p>
              );
            }
            
            return (
              <p className="text-base leading-[1.75] text-muted-foreground mb-5">
                {children}
              </p>
            );
          },
          
          // Blockquotes as callouts
          blockquote: ({ children }) => {
            const textContent = String(children);
            
            if (textContent.includes('💡') || textContent.includes('Pro Tip')) {
              return (
                <DocCallout type="tip" title="Pro Tip">
                  {children}
                </DocCallout>
              );
            }
            if (textContent.includes('⚠️') || textContent.includes('Warning')) {
              return (
                <DocCallout type="warning" title="Warning">
                  {children}
                </DocCallout>
              );
            }
            if (textContent.includes('ℹ️') || textContent.includes('Note')) {
              return (
                <DocCallout type="note" title="Note">
                  {children}
                </DocCallout>
              );
            }
            
            return (
              <DocCallout type="note">
                {children}
              </DocCallout>
            );
          },
          
          // Enhanced code blocks with syntax highlighting and file tree detection
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match?.[1];
            const codeString = String(children).replace(/\n$/, '');
            
            // FIXED: Detect inline code by checking for newlines
            // Block code has newlines, inline code doesn't
            const hasNewlines = codeString.includes('\n');
            const isInline = !hasNewlines && !className;
            
            // Inline code (single backticks, no newlines)
            if (isInline) {
              return (
                <code 
                  className="px-1.5 py-0.5 rounded-md bg-muted text-primary font-mono text-sm border border-border"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            // Detect content type for unlabeled or text blocks
            const contentType = detectContentType(codeString);
            
            // Explicit language tags
            if (language === 'tree') {
              return <DocFileTree content={codeString} />;
            }
            if (language === 'mermaid') {
              return <DocMermaid content={codeString} />;
            }
            
            // Auto-detect file trees for unlabeled or text/plaintext blocks
            // All diagrams should use explicit ```mermaid syntax
            if (!language || language === 'text' || language === 'plaintext') {
              if (contentType === 'file-tree') {
                return <DocFileTree content={codeString} />;
              }
              // Plain text - preserve whitespace
              return (
                <div className="relative group my-8 rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-slate-900">
                  <CodeBlockHeader language="text" code={codeString} />
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-300 whitespace-pre leading-relaxed">
                      {codeString}
                    </code>
                  </pre>
                </div>
              );
            }
            
            // Syntax highlighted code
            return (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative group my-8 rounded-xl overflow-hidden border border-slate-700/80 shadow-xl"
              >
                <CodeBlockHeader language={language} code={codeString} />
                <SyntaxHighlighter
                  style={oneDark}
                  language={language || 'typescript'}
                  PreTag="div"
                  showLineNumbers={codeString.split('\n').length > 5}
                  customStyle={{
                    margin: 0,
                    padding: '1.25rem',
                    fontSize: '0.875rem',
                    lineHeight: '1.7',
                    borderRadius: 0,
                    background: '#1e1e2e',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                    },
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </motion.div>
            );
          },
          
          // Pre wrapper
          pre: ({ children }) => (
            <div className="relative">
              {children}
            </div>
          ),
          
          // Tables with enhanced styling
          table: ({ children }) => (
            <div className="my-10 overflow-x-auto rounded-xl border border-border shadow-sm">
              <table className="w-full text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/70 border-b border-border">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-muted/30 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-5 py-4 text-left font-semibold text-foreground whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-5 py-4 text-muted-foreground">
              {children}
            </td>
          ),
          
          // Lists with better styling
          ul: ({ children }) => (
            <ul className="my-6 ml-6 space-y-3 list-none">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === 'li') {
                  return React.cloneElement(child as React.ReactElement, {
                    className: cn(
                      "relative pl-6 text-muted-foreground",
                      "before:absolute before:left-0 before:top-2.5 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary"
                    )
                  });
                }
                return child;
              })}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 ml-6 space-y-3 list-decimal list-outside marker:text-primary marker:font-semibold">
              {children}
            </ol>
          ),
          li: ({ children, className: liClassName }) => (
            <li className={cn(
              "text-muted-foreground leading-relaxed",
              liClassName
            )}>
              {children}
            </li>
          ),
          
          // Task lists (checkboxes)
          input: ({ type, checked }) => {
            if (type === 'checkbox') {
              return (
                <span className={cn(
                  "inline-flex items-center justify-center w-5 h-5 rounded border-2 mr-3",
                  checked 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "border-muted-foreground/30"
                )}>
                  {checked && <Check className="h-3 w-3" />}
                </span>
              );
            }
            return null;
          },
          
          // Links with better styling
          a: ({ href, children }) => (
            <a 
              href={href}
              className="text-emerald-700 dark:text-primary font-medium hover:underline underline-offset-4 hover:text-emerald-800 dark:hover:text-lime-400 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          
          // Horizontal rule
          hr: () => (
            <hr className="my-10 border-t-2 border-border" />
          ),
          
          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground">
              {children}
            </em>
          ),
          
          // Images
          img: ({ src, alt }) => (
            <figure className="my-8">
              <div className="overflow-hidden rounded-xl border border-border shadow-lg">
                <img 
                  src={src} 
                  alt={alt || ''} 
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {alt && (
                <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default DocContent;
