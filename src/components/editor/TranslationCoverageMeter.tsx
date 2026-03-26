/**
 * TranslationCoverageMeter Component
 * 
 * Displays translation coverage in the editor toolbar.
 */

import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useOptionalTranslationEngine } from '@/contexts/TranslationEngineContext';
import { cn } from '@/lib/utils';

interface TranslationCoverageMeterProps {
  className?: string;
}

export function TranslationCoverageMeter({ className }: TranslationCoverageMeterProps) {
  const engine = useOptionalTranslationEngine();
  
  if (!engine || engine.coverage.length === 0) {
    return null;
  }
  
  // Calculate overall coverage (average across languages)
  const overallCoverage = engine.coverage.length > 0
    ? Math.round(
        engine.coverage.reduce((sum, c) => sum + c.coveragePercentage, 0) / engine.coverage.length
      )
    : 0;
  
  // Get color based on coverage
  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2 h-8", className)}>
          <Globe className="w-4 h-4" />
          <span className={cn("text-xs font-medium", getCoverageColor(overallCoverage))}>
            {overallCoverage}%
          </span>
          <ChevronDown className="w-3 h-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Translation Coverage</span>
            <Badge variant="outline" className="text-xs">
              {engine.translationKeys.length} keys
            </Badge>
          </div>
          
          <div className="space-y-2">
            {engine.coverage.map(langCoverage => (
              <div key={langCoverage.languageCode} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{langCoverage.languageName}</span>
                  <span className={getCoverageColor(langCoverage.coveragePercentage)}>
                    {langCoverage.translatedKeys}/{langCoverage.totalKeys}
                  </span>
                </div>
                <Progress value={langCoverage.coveragePercentage} className="h-1.5" />
                
                {/* Status breakdown */}
                <div className="flex gap-2 text-[10px] text-muted-foreground">
                  {langCoverage.aiTranslatedCount > 0 && (
                    <span>AI: {langCoverage.aiTranslatedCount}</span>
                  )}
                  {langCoverage.editedCount > 0 && (
                    <span>Edited: {langCoverage.editedCount}</span>
                  )}
                  {langCoverage.reviewedCount > 0 && (
                    <span>Reviewed: {langCoverage.reviewedCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {engine.translationKeys.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2">
              No translation keys registered yet.
              <br />
              Bind props to keys in the settings panel.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default TranslationCoverageMeter;
