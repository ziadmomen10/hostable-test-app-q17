/**
 * CodeViewerDialog Component
 * 
 * VS Code-style dialog for viewing the page's HTML and CSS source code.
 */

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code2, Copy } from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';
import { toast } from 'sonner';

export interface CodeViewerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  css: string;
}

export const CodeViewerDialog: React.FC<CodeViewerDialogProps> = ({
  isOpen,
  onOpenChange,
  html,
  css,
}) => {
  const handleCopy = (type: 'html' | 'css') => {
    const code = type === 'css' ? css : html;
    navigator.clipboard.writeText(code);
    toast.success(`${type.toUpperCase()} copied to clipboard`);
  };

  const monacoOptions = {
    readOnly: true,
    minimap: { enabled: true },
    fontSize: 13,
    lineNumbers: 'on' as const,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Consolas, monospace',
    renderLineHighlight: 'all' as const,
    folding: true,
    lineDecorationsWidth: 10,
    padding: { top: 10 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 gap-0 overflow-hidden border-0 bg-[#1e1e1e]">
        {/* VS Code Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#323233] border-b border-[#3c3c3c]">
          <DialogTitle className="text-[#cccccc] flex items-center gap-2 text-sm font-normal">
            <Code2 className="h-4 w-4 text-[#75beff]" />
            Page Source Code
          </DialogTitle>
        </div>
        
        <Tabs defaultValue="html" className="w-full">
          {/* VS Code File Tabs */}
          <div className="bg-[#252526] flex items-center border-b border-[#3c3c3c]">
            <TabsList className="bg-transparent h-auto p-0 gap-0 rounded-none">
              <TabsTrigger 
                value="html" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#007acc] data-[state=active]:bg-[#1e1e1e] bg-[#2d2d2d] text-[#969696] data-[state=active]:text-[#ffffff] px-4 py-2 text-sm"
              >
                <HtmlIcon />
                index.html
              </TabsTrigger>
              <TabsTrigger 
                value="css" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#007acc] data-[state=active]:bg-[#1e1e1e] bg-[#2d2d2d] text-[#969696] data-[state=active]:text-[#ffffff] px-4 py-2 text-sm"
              >
                <CssIcon />
                styles.css
              </TabsTrigger>
            </TabsList>
            
            {/* Copy Button in Header */}
            <div className="ml-auto pr-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-[#cccccc] hover:bg-[#3c3c3c] hover:text-white"
                onClick={() => {
                  const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('value');
                  handleCopy(activeTab === 'css' ? 'css' : 'html');
                }}
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
            </div>
          </div>
          
          <TabsContent value="html" className="mt-0 data-[state=inactive]:hidden">
            <MonacoEditor
              height="65vh"
              language="html"
              value={html}
              theme="vs-dark"
              options={monacoOptions}
            />
          </TabsContent>
          
          <TabsContent value="css" className="mt-0 data-[state=inactive]:hidden">
            <MonacoEditor
              height="65vh"
              language="css"
              value={css}
              theme="vs-dark"
              options={monacoOptions}
            />
          </TabsContent>
        </Tabs>
        
        {/* VS Code Status Bar */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-xs">
          <div className="flex items-center gap-4">
            <span>Ln {html.split('\n').length}, Col 1</span>
            <span>Spaces: 2</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>HTML</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * HTML file icon
 */
const HtmlIcon: React.FC = () => (
  <svg className="h-4 w-4 mr-2 text-[#e37933]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
  </svg>
);

/**
 * CSS file icon
 */
const CssIcon: React.FC = () => (
  <svg className="h-4 w-4 mr-2 text-[#42a5f5]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/>
  </svg>
);

export default CodeViewerDialog;
