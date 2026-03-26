/**
 * TranslateToPagesDialog Component
 * 
 * Dialog for translating content to multiple pages at once.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Languages, Loader2, Check } from 'lucide-react';

export interface MatchingPage {
  pageId: string;
  pageUrl: string;
  pageTitle: string;
  elementContent: string;
  selected: boolean;
}

export interface TranslatePagesElement {
  component: any;
  content: string;
  tagName: string;
  section: string;
  translationKey: string;
}

export interface TranslateToPagesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  element: TranslatePagesElement | null;
  namespace: string;
  matchingPages: MatchingPage[];
  generatedTranslations: Record<string, string>;
  step: 'generate' | 'apply';
  isTranslating: boolean;
  targetLanguageCount: number;
  onTogglePageSelection: (pageId: string) => void;
  onGenerateTranslations: () => void;
  onApplyTranslations: () => void;
}

export const TranslateToPagesDialog: React.FC<TranslateToPagesDialogProps> = ({
  isOpen,
  onOpenChange,
  element,
  namespace,
  matchingPages,
  generatedTranslations,
  step,
  isTranslating,
  targetLanguageCount,
  onTogglePageSelection,
  onGenerateTranslations,
  onApplyTranslations,
}) => {
  const selectedPagesCount = matchingPages.filter(p => p.selected).length;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Translate to Other Pages
          </DialogTitle>
        </DialogHeader>
        
        {element && (
          <div className="space-y-4">
            {/* Element Info */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Content to translate:</p>
              <p className="font-medium">
                "{element.content.substring(0, 100)}{element.content.length > 100 ? '...' : ''}"
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">&lt;{element.tagName}&gt;</Badge>
                <Badge variant="secondary">{element.section}</Badge>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Translation Key:</p>
                <code className="text-xs bg-foreground/10 px-2 py-1 rounded font-mono text-foreground">
                  {namespace}.{element.translationKey}
                </code>
              </div>
            </div>

            {step === 'generate' ? (
              <GenerateStep
                targetLanguageCount={targetLanguageCount}
                isTranslating={isTranslating}
                onGenerate={onGenerateTranslations}
              />
            ) : (
              <ApplyStep
                translationCount={Object.keys(generatedTranslations).length}
                matchingPages={matchingPages}
                onTogglePageSelection={onTogglePageSelection}
              />
            )}
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === 'apply' && (
            <Button onClick={onApplyTranslations} disabled={isTranslating}>
              {isTranslating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  Apply Translations
                  {selectedPagesCount > 0 ? ` to ${selectedPagesCount + 1} Pages` : ''}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Generate Step
 */
interface GenerateStepProps {
  targetLanguageCount: number;
  isTranslating: boolean;
  onGenerate: () => void;
}

const GenerateStep: React.FC<GenerateStepProps> = ({
  targetLanguageCount,
  isTranslating,
  onGenerate,
}) => (
  <div className="space-y-3">
    <p className="text-sm text-muted-foreground">
      Step 1: Generate AI translations for all {targetLanguageCount} languages
    </p>
    <Button onClick={onGenerate} disabled={isTranslating} className="w-full">
      {isTranslating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating translations...
        </>
      ) : (
        <>
          <Languages className="h-4 w-4 mr-2" />
          Generate All Translations
        </>
      )}
    </Button>
  </div>
);

/**
 * Apply Step
 */
interface ApplyStepProps {
  translationCount: number;
  matchingPages: MatchingPage[];
  onTogglePageSelection: (pageId: string) => void;
}

const ApplyStep: React.FC<ApplyStepProps> = ({
  translationCount,
  matchingPages,
  onTogglePageSelection,
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-green-600">
      <Check className="h-4 w-4" />
      <span className="text-sm font-medium">
        Generated {translationCount} translations
      </span>
    </div>
    
    {matchingPages.length > 0 && (
      <div className="border rounded-lg p-3">
        <p className="text-sm font-medium mb-2">Found on other pages:</p>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {matchingPages.map(page => (
            <label 
              key={page.pageId} 
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <Checkbox
                checked={page.selected}
                onCheckedChange={() => onTogglePageSelection(page.pageId)}
              />
              <span>{page.pageTitle}</span>
              <span className="text-muted-foreground">({page.pageUrl})</span>
            </label>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default TranslateToPagesDialog;
