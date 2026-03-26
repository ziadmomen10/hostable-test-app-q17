/**
 * BatchTranslateProgressDialog Component
 * 
 * Shows progress and results for batch translation operations.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages, Loader2, CheckCircle, XCircle } from 'lucide-react';

export interface BatchLogEntry {
  key: string;
  text: string;
  status: 'success' | 'failed';
  reason?: string;
}

export interface BatchProgress {
  current: number;
  total: number;
  currentKey: string;
}

export interface BatchComplete {
  success: number;
  failed: number;
  total: number;
}

export interface BatchTranslateProgressDialogProps {
  isTranslating: boolean;
  progress: BatchProgress;
  complete: BatchComplete | null;
  log: BatchLogEntry[];
  logTab: 'all' | 'success' | 'failed';
  namespace: string;
  targetLanguageCount: number;
  onLogTabChange: (tab: 'all' | 'success' | 'failed') => void;
  onClose: () => void;
}

export const BatchTranslateProgressDialog: React.FC<BatchTranslateProgressDialogProps> = ({
  isTranslating,
  progress,
  complete,
  log,
  logTab,
  namespace,
  targetLanguageCount,
  onLogTabChange,
  onClose,
}) => {
  const isOpen = isTranslating || complete !== null;

  const filteredLog = log.filter(entry => 
    logTab === 'all' || entry.status === logTab
  );

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => !open && complete && onClose()}
    >
      <DialogContent 
        className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col" 
        onPointerDownOutside={(e) => isTranslating && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            {complete ? 'Batch Translation Complete' : 'Batch Translation in Progress'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 flex-1 overflow-hidden flex flex-col">
          {complete ? (
            <CompletionView
              complete={complete}
              log={log}
              filteredLog={filteredLog}
              logTab={logTab}
              onLogTabChange={onLogTabChange}
              onClose={onClose}
            />
          ) : (
            <ProgressView
              progress={progress}
              namespace={namespace}
              targetLanguageCount={targetLanguageCount}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Progress View
 */
interface ProgressViewProps {
  progress: BatchProgress;
  namespace: string;
  targetLanguageCount: number;
}

const ProgressView: React.FC<ProgressViewProps> = ({ 
  progress, 
  namespace, 
  targetLanguageCount 
}) => (
  <>
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">
          {progress.current} of {progress.total} elements
        </span>
      </div>
      <Progress 
        value={progress.total > 0 ? (progress.current / progress.total) * 100 : 0} 
        className="h-3"
      />
    </div>
    
    {progress.currentKey && (
      <div className="p-3 bg-muted rounded-lg space-y-2">
        <p className="text-xs text-muted-foreground">Currently translating:</p>
        <code className="text-xs bg-foreground/10 px-2 py-1 rounded font-mono text-foreground block truncate">
          {namespace}.{progress.currentKey}
        </code>
      </div>
    )}
    
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>Generating AI translations for {targetLanguageCount} languages...</span>
    </div>
  </>
);

/**
 * Completion View
 */
interface CompletionViewProps {
  complete: BatchComplete;
  log: BatchLogEntry[];
  filteredLog: BatchLogEntry[];
  logTab: 'all' | 'success' | 'failed';
  onLogTabChange: (tab: 'all' | 'success' | 'failed') => void;
  onClose: () => void;
}

const CompletionView: React.FC<CompletionViewProps> = ({
  complete,
  log,
  filteredLog,
  logTab,
  onLogTabChange,
  onClose,
}) => (
  <>
    <div className="flex items-center justify-center py-2">
      <div className={`rounded-full p-2 ${complete.failed === 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
        <CheckCircle className={`h-8 w-8 ${complete.failed === 0 ? 'text-green-600' : 'text-yellow-600'}`} />
      </div>
    </div>
    
    <div className="text-center space-y-1">
      <h3 className="text-lg font-semibold text-foreground">
        {complete.failed === 0 ? 'All Translations Complete!' : 'Translation Complete'}
      </h3>
      <p className="text-sm text-muted-foreground">
        {complete.success} succeeded, {complete.failed} failed of {complete.total} elements
      </p>
      <p className="text-xs text-green-600">
        ✓ Coverage statistics saved to database
      </p>
    </div>
    
    {/* Detailed Log */}
    <div className="flex-1 overflow-hidden flex flex-col border rounded-lg">
      <div className="flex border-b bg-muted/50">
        <LogTab
          active={logTab === 'all'}
          onClick={() => onLogTabChange('all')}
          label={`All (${log.length})`}
        />
        <LogTab
          active={logTab === 'success'}
          onClick={() => onLogTabChange('success')}
          label={
            <span className="flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Success ({log.filter(l => l.status === 'success').length})
            </span>
          }
        />
        <LogTab
          active={logTab === 'failed'}
          onClick={() => onLogTabChange('failed')}
          label={
            <span className="flex items-center justify-center gap-1">
              <XCircle className="h-3 w-3 text-red-600" />
              Failed ({log.filter(l => l.status === 'failed').length})
            </span>
          }
        />
      </div>
      
      <ScrollArea className="flex-1 max-h-[200px]">
        <div className="p-2 space-y-1">
          {filteredLog.map((entry, idx) => (
            <LogEntry key={idx} entry={entry} />
          ))}
          {filteredLog.length === 0 && (
            <p className="text-center text-muted-foreground py-4 text-xs">No entries</p>
          )}
        </div>
      </ScrollArea>
    </div>
    
    <Button onClick={onClose} className="w-full">Close</Button>
  </>
);

/**
 * Log Tab Button
 */
interface LogTabProps {
  active: boolean;
  onClick: () => void;
  label: React.ReactNode;
}

const LogTab: React.FC<LogTabProps> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
      active 
        ? 'bg-background text-foreground border-b-2 border-primary' 
        : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    {label}
  </button>
);

/**
 * Log Entry
 */
interface LogEntryProps {
  entry: BatchLogEntry;
}

const LogEntry: React.FC<LogEntryProps> = ({ entry }) => (
  <div 
    className={`p-2 rounded text-xs ${
      entry.status === 'success' 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-red-50 border border-red-200'
    }`}
  >
    <div className="flex items-start gap-2">
      {entry.status === 'success' ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-red-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <code className="font-mono text-foreground block truncate">{entry.key}</code>
        <p className="text-muted-foreground truncate mt-0.5">
          "{entry.text}{entry.text.length >= 50 ? '...' : ''}"
        </p>
        {entry.reason && (
          <p className="text-red-600 mt-1 text-[10px]">Reason: {entry.reason}</p>
        )}
      </div>
    </div>
  </div>
);

export default BatchTranslateProgressDialog;
