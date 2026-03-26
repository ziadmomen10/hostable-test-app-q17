/**
 * ReadabilityCard
 * 
 * Compact Flesch-Kincaid readability analysis with inline stat strip,
 * merged progress bar, and collapsible tips.
 * 
 * Optimized for narrow right panel (~320-420px).
 */

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReadabilityCardProps {
  content: string;
  className?: string;
}

interface ReadabilityResult {
  grade: number;
  ease: number;
  avgSentenceLength: number;
  avgSyllablesPerWord: number;
  complexPercent: number;
  wordCount: number;
  sentenceCount: number;
}

export function ReadabilityCard({ content, className }: ReadabilityCardProps) {
  const [tipsOpen, setTipsOpen] = useState(false);
  
  const readability = useMemo(() => {
    return calculateReadability(content);
  }, [content]);

  const gradeLabel = getGradeLabel(readability.grade);
  const isGood = readability.grade >= 6 && readability.grade <= 10;
  const tips = getImprovementTips(readability);

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Compact Inline Stats Row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge 
          variant="outline" 
          className={cn(
            "text-[10px] h-5 gap-1",
            isGood ? "border-green-500/50 text-green-600" : "border-yellow-500/50 text-yellow-600"
          )}
        >
          {isGood ? (
            <CheckCircle2 className="h-2.5 w-2.5" />
          ) : (
            <AlertTriangle className="h-2.5 w-2.5" />
          )}
          Grade {readability.grade}
        </Badge>
        <Badge variant="secondary" className="text-[10px] h-5">
          Flesch: {readability.ease}
        </Badge>
        <Badge variant="secondary" className="text-[10px] h-5">
          {readability.avgSentenceLength}w/sent
        </Badge>
      </div>

      {/* Inline Progress + Complex % Row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground shrink-0">Ease</span>
          <Progress 
            value={readability.ease} 
            className="h-1 flex-1"
          />
          <span className={cn(
            "text-[10px] font-medium shrink-0",
            readability.ease >= 60 ? "text-green-500" : "text-yellow-500"
          )}>
            {readability.ease}
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground shrink-0 border-l pl-2">
          Complex: <span className={cn(
            "font-medium",
            readability.complexPercent <= 15 ? "text-green-500" : "text-yellow-500"
          )}>
            {readability.complexPercent.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Compact Improvement Tips */}
      <Collapsible open={tipsOpen} onOpenChange={setTipsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-between h-6 text-[10px] text-muted-foreground hover:text-foreground px-1"
          >
            <span className="flex items-center gap-1">
              <Lightbulb className="h-2.5 w-2.5" />
              Tips: {tips[0]?.slice(0, 30)}...
            </span>
            <ChevronDown className={cn(
              "h-2.5 w-2.5 transition-transform",
              tipsOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-1">
          <div className="space-y-0.5">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground p-1 rounded bg-muted/20">
                <span className="text-primary shrink-0">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// Calculate Flesch-Kincaid readability
function calculateReadability(content: string): ReadabilityResult {
  let textContent = '';
  try {
    const parsed = JSON.parse(content);
    textContent = extractText(parsed);
  } catch {
    textContent = content;
  }
  
  // Clean and split
  const cleanText = textContent.replace(/[^\w\s.!?]/g, ' ').trim();
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  
  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  
  // Calculate syllables
  let totalSyllables = 0;
  let complexWords = 0;
  
  for (const word of words) {
    const syllables = countSyllables(word);
    totalSyllables += syllables;
    if (syllables >= 3) complexWords++;
  }
  
  const avgSentenceLength = Math.round(wordCount / sentenceCount);
  const avgSyllablesPerWord = totalSyllables / Math.max(wordCount, 1);
  const complexPercent = (complexWords / Math.max(wordCount, 1)) * 100;
  
  // Flesch-Kincaid Grade Level
  const grade = Math.round(
    0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59
  );
  
  // Flesch Reading Ease (0-100, higher is easier)
  const ease = Math.round(
    206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord
  );
  
  return {
    grade: Math.max(0, Math.min(grade, 18)),
    ease: Math.max(0, Math.min(ease, 100)),
    avgSentenceLength,
    avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
    complexPercent,
    wordCount,
    sentenceCount,
  };
}

// Count syllables in a word
function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  // Remove silent e at end
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(syllables.length, 1) : 1;
}

// Get grade level description
function getGradeLabel(grade: number): string {
  if (grade <= 5) return 'Elementary';
  if (grade <= 8) return 'Middle School';
  if (grade <= 12) return 'High School';
  return 'College';
}

// Generate improvement tips based on metrics
function getImprovementTips(readability: ReadabilityResult): string[] {
  const tips: string[] = [];
  
  if (readability.avgSentenceLength > 20) {
    tips.push('Break up long sentences (aim for 15-20 words)');
  }
  
  if (readability.complexPercent > 15) {
    tips.push('Replace complex words with simpler alternatives');
  }
  
  if (readability.ease < 60) {
    tips.push('Use more common vocabulary');
  }
  
  if (readability.grade > 10) {
    tips.push('Simplify for broader accessibility');
  }
  
  if (tips.length === 0) {
    tips.push('Great job! Content is easy to read');
  }
  
  return tips;
}

function extractText(obj: any): string {
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(extractText).join(' ');
  if (obj && typeof obj === 'object') {
    return Object.values(obj).map(extractText).join(' ');
  }
  return '';
}
