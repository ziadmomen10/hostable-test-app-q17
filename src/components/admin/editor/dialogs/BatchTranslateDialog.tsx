/**
 * BatchTranslateDialog Component
 * 
 * Multi-step dialog for batch translating page elements with AI.
 * Step 1: Choose mode (new elements only or re-translate all)
 * Step 2: Select elements to translate
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages } from 'lucide-react';

export interface BatchTranslateElement {
  component: any;
  content: string;
  tagName: string;
  section: string;
  key: string;
  hasExistingKey: boolean;
  selected: boolean;
}

export interface BatchTranslateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  step: 'mode' | 'select';
  forceReTranslate: boolean;
  elements: BatchTranslateElement[];
  targetLanguageCount: number;
  onForceReTranslateChange: (value: boolean) => void;
  onProceedToSelection: () => void;
  onBackToMode: () => void;
  onToggleElement: (index: number) => void;
  onSelectAll: (selected: boolean) => void;
  onStartTranslation: () => void;
  onReset: () => void;
}

export const BatchTranslateDialog: React.FC<BatchTranslateDialogProps> = ({
  isOpen,
  onOpenChange,
  step,
  forceReTranslate,
  elements,
  targetLanguageCount,
  onForceReTranslateChange,
  onProceedToSelection,
  onBackToMode,
  onToggleElement,
  onSelectAll,
  onStartTranslation,
  onReset,
}) => {
  const selectedCount = elements.filter(e => e.selected).length;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onReset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {step === 'mode' ? 'Batch Translate Options' : 'Select Elements to Translate'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'mode' && (
          <ModeSelectionStep
            forceReTranslate={forceReTranslate}
            targetLanguageCount={targetLanguageCount}
            onForceReTranslateChange={onForceReTranslateChange}
            onCancel={() => onOpenChange(false)}
            onProceed={onProceedToSelection}
          />
        )}
        
        {step === 'select' && (
          <ElementSelectionStep
            elements={elements}
            selectedCount={selectedCount}
            onSelectAll={onSelectAll}
            onToggleElement={onToggleElement}
            onBack={onBackToMode}
            onStart={onStartTranslation}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * Mode Selection Step
 */
interface ModeSelectionStepProps {
  forceReTranslate: boolean;
  targetLanguageCount: number;
  onForceReTranslateChange: (value: boolean) => void;
  onCancel: () => void;
  onProceed: () => void;
}

const ModeSelectionStep: React.FC<ModeSelectionStepProps> = ({
  forceReTranslate,
  targetLanguageCount,
  onForceReTranslateChange,
  onCancel,
  onProceed,
}) => (
  <div className="space-y-4 py-4">
    <p className="text-sm text-muted-foreground">
      Choose how you want to translate the page content:
    </p>
    
    <div className="space-y-3">
      <ModeOption
        selected={!forceReTranslate}
        onClick={() => onForceReTranslateChange(false)}
        title="Translate New Elements Only"
        description="Only translate elements that don't have translation keys yet. Existing translations will be kept."
      />
      
      <ModeOption
        selected={forceReTranslate}
        onClick={() => onForceReTranslateChange(true)}
        title="Re-translate All Elements"
        description="Translate ALL text elements on the page, including those with existing translations. This will overwrite existing translations."
      />
    </div>
    
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
      <p className="text-xs text-amber-600 dark:text-amber-400">
        <strong>Note:</strong> This will use AI to generate translations for {targetLanguageCount} languages. 
        The process may take a few minutes depending on the number of elements.
      </p>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button onClick={onProceed} className="gap-2">Next →</Button>
    </DialogFooter>
  </div>
);

/**
 * Mode Option Component
 */
interface ModeOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}

const ModeOption: React.FC<ModeOptionProps> = ({ selected, onClick, title, description }) => (
  <div 
    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
      selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
        selected ? 'border-primary' : 'border-muted-foreground'
      }`}>
        {selected && <div className="h-2 w-2 rounded-full bg-primary" />}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </div>
);

/**
 * Element Selection Step
 */
interface ElementSelectionStepProps {
  elements: BatchTranslateElement[];
  selectedCount: number;
  onSelectAll: (selected: boolean) => void;
  onToggleElement: (index: number) => void;
  onBack: () => void;
  onStart: () => void;
}

const ElementSelectionStep: React.FC<ElementSelectionStepProps> = ({
  elements,
  selectedCount,
  onSelectAll,
  onToggleElement,
  onBack,
  onStart,
}) => (
  <div className="space-y-4 py-4">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {selectedCount} of {elements.length} elements selected
      </span>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => onSelectAll(true)}>
          Select All
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onSelectAll(false)}>
          Deselect All
        </Button>
      </div>
    </div>
    
    <ScrollArea className="h-[350px] border rounded-lg">
      <div className="p-2 space-y-1">
        {elements.map((element, index) => (
          <div 
            key={index}
            className={`flex items-start gap-3 p-3 rounded cursor-pointer transition-colors ${
              element.selected 
                ? 'bg-primary/5 border border-primary/30' 
                : 'hover:bg-muted/50 border border-transparent'
            }`}
            onClick={() => onToggleElement(index)}
          >
            <Checkbox 
              checked={element.selected}
              onCheckedChange={() => onToggleElement(index)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-mono">
                  {element.tagName}
                </Badge>
                {element.section && (
                  <span className="text-xs text-muted-foreground">
                    {element.section}
                  </span>
                )}
                {element.hasExistingKey && (
                  <Badge variant="secondary" className="text-xs">
                    Has key
                  </Badge>
                )}
              </div>
              <p className="text-sm mt-1.5 text-foreground line-clamp-2">
                {element.content.length > 100 
                  ? element.content.substring(0, 100) + '...' 
                  : element.content}
              </p>
            </div>
          </div>
        ))}
        
        {elements.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">
            No elements found to translate
          </p>
        )}
      </div>
    </ScrollArea>
    
    <DialogFooter className="flex-col sm:flex-row gap-2">
      <Button variant="outline" onClick={onBack} className="sm:mr-auto">
        ← Back
      </Button>
      <Button 
        onClick={onStart}
        disabled={selectedCount === 0}
        className="gap-2"
      >
        <Languages className="h-4 w-4" />
        Start Translation ({selectedCount})
      </Button>
    </DialogFooter>
  </div>
);

export default BatchTranslateDialog;
