import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileJson, FileType, File, FileText, Cog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  comment?: string;
}

interface DocFileTreeProps {
  content: string;
  title?: string;
  className?: string;
}

// Parse tree structure from text
function parseTreeContent(content: string): FileTreeNode[] {
  const lines = content.trim().split('\n');
  const root: FileTreeNode[] = [];
  const stack: { node: FileTreeNode; depth: number }[] = [];

  lines.forEach((line) => {
    if (!line.trim()) return;

    // Calculate depth based on tree characters
    const depthMatch = line.match(/^[\s│├└─]*(\s*)/);
    const depth = depthMatch ? Math.floor(depthMatch[0].replace(/[│├└─]/g, ' ').length / 2) : 0;

    // Extract name and comment
    let cleanLine = line.replace(/^[\s│├└─]+/, '').trim();
    let comment = '';
    
    if (cleanLine.includes('#')) {
      const parts = cleanLine.split('#');
      cleanLine = parts[0].trim();
      comment = parts.slice(1).join('#').trim();
    }

    const isFolder = cleanLine.endsWith('/') || !cleanLine.includes('.');
    const name = cleanLine.replace(/\/$/, '');

    const node: FileTreeNode = {
      name,
      type: isFolder ? 'folder' : 'file',
      comment,
      children: isFolder ? [] : undefined,
    };

    // Find parent based on depth
    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      if (parent.children) {
        parent.children.push(node);
      }
    }

    if (node.type === 'folder') {
      stack.push({ node, depth });
    }
  });

  return root;
}

// Get file icon based on extension
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'ts':
    case 'tsx':
      return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'js':
    case 'jsx':
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <FileType className="h-4 w-4 text-pink-400" />;
    case 'json':
      return <FileJson className="h-4 w-4 text-yellow-500" />;
    case 'md':
    case 'mdx':
      return <FileText className="h-4 w-4 text-slate-400" />;
    case 'config':
    case 'toml':
    case 'yaml':
    case 'yml':
      return <Cog className="h-4 w-4 text-slate-500" />;
    default:
      return <File className="h-4 w-4 text-slate-400" />;
  }
}

interface TreeNodeProps {
  node: FileTreeNode;
  depth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';

  return (
    <div className="select-none">
      <motion.div
        className={cn(
          "flex items-center gap-2 py-1 px-2 rounded-md cursor-pointer transition-colors",
          "hover:bg-slate-700/50",
          depth > 0 && "ml-4"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.1 }}
      >
        {isFolder ? (
          <>
            <span className="text-slate-400">
              {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </span>
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-amber-400" />
            ) : (
              <Folder className="h-4 w-4 text-amber-400" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            {getFileIcon(node.name)}
          </>
        )}
        
        <span className={cn(
          "font-mono text-sm",
          isFolder ? "text-slate-200 font-medium" : "text-slate-300"
        )}>
          {node.name}
        </span>
        
        {node.comment && (
          <span className="text-slate-500 text-xs ml-2 italic">
            {node.comment}
          </span>
        )}
      </motion.div>

      <AnimatePresence initial={false}>
        {isFolder && isOpen && node.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-slate-700/50 ml-5"
          >
            {node.children.map((child, index) => (
              <TreeNode key={`${child.name}-${index}`} node={child} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DocFileTree: React.FC<DocFileTreeProps> = ({ content, title, className }) => {
  const nodes = parseTreeContent(content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "my-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        {title && (
          <span className="text-sm text-slate-400 font-medium">{title}</span>
        )}
        {!title && (
          <span className="text-sm text-slate-500">File Structure</span>
        )}
      </div>
      
      {/* Tree content */}
      <div className="p-3 overflow-x-auto">
        {nodes.map((node, index) => (
          <TreeNode key={`${node.name}-${index}`} node={node} depth={0} />
        ))}
      </div>
    </motion.div>
  );
};

export default DocFileTree;
