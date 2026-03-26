import React, { useState, useRef, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { 
  Undo2, Redo2, Copy, Maximize2, Minimize2, Search, 
  WrapText, Map, Sun, Moon, Code2, FileCode, 
  Download, Upload, Columns, RotateCcw, Check, Braces
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'json';
  height?: string;
  saving?: boolean;
}

export const ProCodeEditor: React.FC<ProCodeEditorProps> = ({
  value,
  onChange,
  language,
  height = "500px",
  saving = false
}) => {
  const editorRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [wordWrap, setWordWrap] = useState(true);
  const [showMinimap, setShowMinimap] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [copied, setCopied] = useState(false);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      toast.success('Changes auto-saved');
    });
  };

  const handleUndo = useCallback(() => {
    editorRef.current?.trigger('keyboard', 'undo', null);
  }, []);

  const handleRedo = useCallback(() => {
    editorRef.current?.trigger('keyboard', 'redo', null);
  }, []);

  const handleFormat = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
    toast.success('Code formatted');
  }, []);

  const handleCopy = useCallback(async () => {
    const selection = editorRef.current?.getSelection();
    const model = editorRef.current?.getModel();
    
    let textToCopy = value;
    if (selection && !selection.isEmpty()) {
      textToCopy = model?.getValueInRange(selection) || value;
    }
    
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  const handleSearch = useCallback(() => {
    editorRef.current?.getAction('actions.find')?.run();
  }, []);

  const handleReplace = useCallback(() => {
    editorRef.current?.getAction('editor.action.startFindReplaceAction')?.run();
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
  }, [theme]);

  const toggleWordWrap = useCallback(() => {
    setWordWrap(!wordWrap);
    editorRef.current?.updateOptions({ wordWrap: !wordWrap ? 'on' : 'off' });
  }, [wordWrap]);

  const toggleMinimap = useCallback(() => {
    setShowMinimap(!showMinimap);
    editorRef.current?.updateOptions({ minimap: { enabled: !showMinimap } });
  }, [showMinimap]);

  const handleFoldAll = useCallback(() => {
    editorRef.current?.getAction('editor.foldAll')?.run();
  }, []);

  const handleUnfoldAll = useCallback(() => {
    editorRef.current?.getAction('editor.unfoldAll')?.run();
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  }, [value, language]);

  const lineCount = (value || '').split('\n').length;
  const charCount = (value || '').length;

  const containerClasses = isFullscreen 
    ? 'fixed inset-0 z-50 bg-background flex flex-col' 
    : 'flex flex-col rounded-lg border-2 border-slate-700/50 overflow-hidden';

  return (
    <div className={containerClasses}>
      {/* Professional Toolbar */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${theme === 'vs-dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-300'}`}>
        {/* Left Section - File Info */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-2 py-1 rounded ${theme === 'vs-dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <FileCode className={`h-4 w-4 ${language === 'html' ? 'text-orange-500' : language === 'css' ? 'text-blue-500' : 'text-yellow-500'}`} />
            <span className={`text-xs font-medium uppercase ${theme === 'vs-dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              {language}
            </span>
          </div>
          {saving && (
            <div className="flex items-center gap-1.5 text-xs text-blue-400">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              Saving...
            </div>
          )}
        </div>

        {/* Center Section - Main Actions */}
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1">
            {/* Undo/Redo Group */}
            <div className={`flex items-center rounded-md ${theme === 'vs-dark' ? 'bg-slate-800' : 'bg-white'} p-0.5`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleUndo} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                    <Undo2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Undo (Ctrl+Z)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleRedo} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                    <Redo2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Redo (Ctrl+Y)</p></TooltipContent>
              </Tooltip>
            </div>

            <div className={`w-px h-5 ${theme === 'vs-dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />

            {/* Format & Copy */}
            <div className={`flex items-center rounded-md ${theme === 'vs-dark' ? 'bg-slate-800' : 'bg-white'} p-0.5`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleFormat} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                    <Braces className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Format (Shift+Alt+F)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleCopy} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                    {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Copy All</p></TooltipContent>
              </Tooltip>
            </div>

            <div className={`w-px h-5 ${theme === 'vs-dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />

            {/* Search */}
            <div className={`flex items-center rounded-md ${theme === 'vs-dark' ? 'bg-slate-800' : 'bg-white'} p-0.5`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleSearch} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Find (Ctrl+F)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleReplace} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                    <Columns className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Find & Replace (Ctrl+H)</p></TooltipContent>
              </Tooltip>
            </div>

            <div className={`w-px h-5 ${theme === 'vs-dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />

            {/* View Options Dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className={`h-7 px-2 gap-1 ${theme === 'vs-dark' ? 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700' : 'bg-white text-slate-700 hover:text-slate-900'}`}>
                      <Code2 className="h-3.5 w-3.5" />
                      <span className="text-xs">View</span>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent><p>View Options</p></TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={toggleWordWrap}>
                  <WrapText className="h-4 w-4 mr-2" />
                  Word Wrap
                  {wordWrap && <Check className="h-4 w-4 ml-auto text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleMinimap}>
                  <Map className="h-4 w-4 mr-2" />
                  Minimap
                  {showMinimap && <Check className="h-4 w-4 ml-auto text-green-500" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleFoldAll}>
                  <Code2 className="h-4 w-4 mr-2" />
                  Fold All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUnfoldAll}>
                  <Code2 className="h-4 w-4 mr-2" />
                  Unfold All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>

        {/* Right Section - Theme & Fullscreen */}
        <TooltipProvider delayDuration={300}>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleTheme} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                  {theme === 'vs-dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Toggle Theme</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleFullscreen} className={`h-7 w-7 p-0 ${theme === 'vs-dark' ? 'text-slate-200 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900'}`}>
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</p></TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height={isFullscreen ? "calc(100vh - 80px)" : height}
          defaultLanguage={language}
          value={value}
          onChange={(val) => onChange(val || '')}
          theme={theme}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: showMinimap },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: wordWrap ? 'on' : 'off',
            formatOnPaste: true,
            formatOnType: true,
            folding: true,
            lineHeight: 22,
            fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, Consolas, monospace',
            fontLigatures: true,
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: true,
              bracketPairs: true
            },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            renderWhitespace: 'selection',
            renderLineHighlight: 'all',
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            stickyScroll: { enabled: true },
          }}
        />
      </div>

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-3 py-1.5 text-xs border-t ${theme === 'vs-dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'}`}>
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          <span className={`w-px h-3 ${theme === 'vs-dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />
          <span>{lineCount} lines</span>
          <span>{charCount.toLocaleString()} characters</span>
        </div>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span className="uppercase">{language}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${theme === 'vs-dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
            {wordWrap ? 'Wrap: On' : 'Wrap: Off'}
          </span>
        </div>
      </div>
    </div>
  );
};
