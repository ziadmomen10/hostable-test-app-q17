import React, { useEffect, useState, useId } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ZoomIn, ZoomOut, Maximize2, AlertCircle } from 'lucide-react';

interface DocMermaidProps {
  content: string;
  className?: string;
}

// Detect the type of Mermaid diagram from content
function detectMermaidType(code: string): string {
  const firstLine = code.trim().split('\n')[0].toLowerCase().replace(/\s+/g, '');
  
  if (firstLine.startsWith('graph') || firstLine.startsWith('flowchart')) return 'Flowchart';
  if (firstLine.startsWith('sequencediagram')) return 'Sequence Diagram';
  if (firstLine.startsWith('classdiagram')) return 'Class Diagram';
  if (firstLine.startsWith('erdiagram')) return 'ER Diagram';
  if (firstLine.startsWith('gantt')) return 'Gantt Chart';
  if (firstLine.startsWith('pie')) return 'Pie Chart';
  if (firstLine.startsWith('journey')) return 'User Journey';
  if (firstLine.startsWith('gitgraph')) return 'Git Graph';
  if (firstLine.startsWith('statediagram')) return 'State Diagram';
  if (firstLine.startsWith('mindmap')) return 'Mind Map';
  if (firstLine.startsWith('timeline')) return 'Timeline';
  if (firstLine.startsWith('quadrantchart')) return 'Quadrant Chart';
  if (firstLine.startsWith('requirementdiagram')) return 'Requirement Diagram';
  if (firstLine.startsWith('c4context') || firstLine.startsWith('c4container') || firstLine.startsWith('c4component')) return 'C4 Diagram';
  
  return 'Mermaid Diagram';
}

const DocMermaid: React.FC<DocMermaidProps> = ({ content, className = '' }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const uniqueId = useId().replace(/:/g, '-');
  
  const diagramType = detectMermaidType(content);

  useEffect(() => {
    let cancelled = false;

    const renderDiagram = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Dynamic import to avoid bundling issues with Mermaid's ESM
        const mermaid = (await import('mermaid')).default;
        
        if (cancelled) return;
        
        // Initialize mermaid with dark theme
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#6366f1',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#4f46e5',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#0f172a',
            mainBkg: '#1e293b',
            nodeBorder: '#4f46e5',
            clusterBkg: '#1e293b',
            clusterBorder: '#334155',
            titleColor: '#f1f5f9',
            edgeLabelBackground: '#1e293b',
            actorTextColor: '#e2e8f0',
            actorBkg: '#1e293b',
            actorBorder: '#4f46e5',
            signalColor: '#e2e8f0',
            signalTextColor: '#e2e8f0',
            labelBoxBkgColor: '#1e293b',
            labelBoxBorderColor: '#4f46e5',
            labelTextColor: '#e2e8f0',
            loopTextColor: '#e2e8f0',
            noteBorderColor: '#4f46e5',
            noteBkgColor: '#1e293b',
            noteTextColor: '#e2e8f0',
            activationBorderColor: '#4f46e5',
            activationBkgColor: '#312e81',
            sequenceNumberColor: '#e2e8f0',
            sectionBkgColor: '#1e293b',
            altSectionBkgColor: '#0f172a',
            sectionBkgColor2: '#1e293b',
            taskBorderColor: '#4f46e5',
            taskBkgColor: '#312e81',
            taskTextColor: '#e2e8f0',
            taskTextLightColor: '#e2e8f0',
            taskTextOutsideColor: '#e2e8f0',
            activeTaskBorderColor: '#818cf8',
            activeTaskBkgColor: '#4f46e5',
            gridColor: '#334155',
            doneTaskBkgColor: '#22c55e',
            doneTaskBorderColor: '#16a34a',
            critBorderColor: '#ef4444',
            critBkgColor: '#dc2626',
            todayLineColor: '#f59e0b',
            personBorder: '#4f46e5',
            personBkg: '#1e293b',
          },
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
          },
          sequence: {
            diagramMarginX: 50,
            diagramMarginY: 10,
            actorMargin: 50,
            width: 150,
            height: 65,
            boxMargin: 10,
            boxTextMargin: 5,
            noteMargin: 10,
            messageMargin: 35,
            mirrorActors: true,
            useMaxWidth: true,
          },
        });

        const diagramId = `mermaid-diagram-${uniqueId}`;
        const { svg: renderedSvg } = await mermaid.render(diagramId, content.trim());
        
        if (cancelled) return;
        setSvg(renderedSvg);
      } catch (err) {
        if (cancelled) return;
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderDiagram();
    
    return () => { cancelled = true; };
  }, [content, uniqueId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setZoom(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`my-6 rounded-xl border border-border/50 bg-slate-900 overflow-hidden shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-border/30">
        <div className="flex items-center gap-3">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          {/* Diagram type badge */}
          <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
            {diagramType}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-colors"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          
          <div className="w-px h-4 bg-slate-600 mx-1" />
          
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded transition-colors"
            title="Copy Mermaid code"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Diagram content */}
      <div className="p-6 overflow-auto bg-slate-900/50" style={{ maxHeight: '600px' }}>
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center gap-3">
              <div className="w-48 h-32 bg-slate-700/50 rounded" />
              <span className="text-sm text-slate-500">Rendering diagram...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle size={20} />
              <span className="font-medium">Failed to render diagram</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md text-center">{error}</p>
            
            {/* Show raw code on error */}
            <div className="w-full mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap">
                {content}
              </pre>
            </div>
          </div>
        )}
        
        {!loading && !error && svg && (
          <div 
            className="flex items-center justify-center transition-transform duration-200 origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <div 
              className="mermaid-diagram [&_svg]:max-w-full [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: svg }} 
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DocMermaid;
