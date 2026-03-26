/**
 * ImageSEOChecker
 * 
 * Compact image audit with alt text analysis and AI generation.
 * Follows the compact UI design system (h-6 buttons, text-[9px]/[10px]).
 */

import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Loader2,
  FileWarning,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ImageSEOCheckerProps {
  content: string;
  pageTitle?: string;
  focusKeyword?: string;
  className?: string;
}

interface ImageInfo {
  src: string;
  alt: string;
  hasAlt: boolean;
  altLength: number;
  fileName: string;
}

interface GeneratedAlt {
  imageUrl: string;
  altText: string;
  copied: boolean;
}

export function ImageSEOChecker({ content, pageTitle, focusKeyword, className }: ImageSEOCheckerProps) {
  const [listOpen, setListOpen] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [generatedAlts, setGeneratedAlts] = useState<Record<string, GeneratedAlt>>({});

  const analysis = useMemo(() => {
    return analyzeImages(content);
  }, [content]);

  const missingAltCount = analysis.images.filter(img => !img.hasAlt).length;
  const shortAltCount = analysis.images.filter(img => img.hasAlt && img.altLength < 10).length;
  const goodAltCount = analysis.images.filter(img => img.hasAlt && img.altLength >= 10).length;

  const generateAltForImage = async (imageUrl: string) => {
    setGeneratingFor(imageUrl);
    try {
      const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
        body: {
          action: 'generate_alt_text',
          context: {
            imageUrl,
            pageTitle: pageTitle || '',
            focusKeyword: focusKeyword || '',
          },
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const altText = data?.altText || 'No alt text generated';
      setGeneratedAlts(prev => ({
        ...prev,
        [imageUrl]: { imageUrl, altText, copied: false },
      }));
      toast.success('Alt text generated');
    } catch (err) {
      console.error('Alt text generation error:', err);
      toast.error(`Failed to generate alt text: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingFor(null);
    }
  };

  const generateAllMissingAlts = async () => {
    const missingImages = analysis.images.filter(img => !img.hasAlt && !generatedAlts[img.src]);
    if (missingImages.length === 0) {
      toast.info('All images already have alt text or generated suggestions');
      return;
    }

    setGeneratingAll(true);
    let successCount = 0;

    for (const img of missingImages) {
      try {
        setGeneratingFor(img.src);
        const { data, error } = await supabase.functions.invoke('seo-ai-tools', {
          body: {
            action: 'generate_alt_text',
            context: {
              imageUrl: img.src,
              pageTitle: pageTitle || '',
              focusKeyword: focusKeyword || '',
            },
          },
        });

        if (!error && !data?.error && data?.altText) {
          setGeneratedAlts(prev => ({
            ...prev,
            [img.src]: { imageUrl: img.src, altText: data.altText, copied: false },
          }));
          successCount++;
        }
      } catch {
        // Continue to next image
      }
      // Small delay between calls to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }

    setGeneratingFor(null);
    setGeneratingAll(false);
    toast.success(`Generated alt text for ${successCount}/${missingImages.length} images`);
  };

  const copyAltText = (imageUrl: string) => {
    const gen = generatedAlts[imageUrl];
    if (!gen) return;
    navigator.clipboard.writeText(gen.altText);
    setGeneratedAlts(prev => ({
      ...prev,
      [imageUrl]: { ...prev[imageUrl], copied: true },
    }));
    toast.success('Alt text copied to clipboard');
    setTimeout(() => {
      setGeneratedAlts(prev => ({
        ...prev,
        [imageUrl]: { ...prev[imageUrl], copied: false },
      }));
    }, 2000);
  };

  if (analysis.images.length === 0) {
    return (
      <div className={cn("text-center py-2 text-muted-foreground", className)}>
        <ImageIcon className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
        <p className="text-[10px]">No images detected</p>
        <p className="text-[9px]">Add images to improve engagement</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Stats Row */}
      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
        <Badge variant="secondary" className="h-5 gap-1">
          <ImageIcon className="h-2.5 w-2.5" />
          {analysis.images.length} images
        </Badge>
        {missingAltCount > 0 && (
          <Badge variant="outline" className="h-5 gap-1 text-red-600 border-red-500/50">
            <AlertTriangle className="h-2.5 w-2.5" />
            {missingAltCount} missing alt
          </Badge>
        )}
        {shortAltCount > 0 && (
          <Badge variant="outline" className="h-5 gap-1 text-yellow-600 border-yellow-500/50">
            <FileWarning className="h-2.5 w-2.5" />
            {shortAltCount} short
          </Badge>
        )}
        {goodAltCount > 0 && (
          <Badge variant="outline" className="h-5 gap-1 text-green-600 border-green-500/50">
            <CheckCircle2 className="h-2.5 w-2.5" />
            {goodAltCount} good
          </Badge>
        )}
      </div>

      {/* Health Status */}
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded text-[10px]",
        missingAltCount === 0 ? "bg-green-500/10" : "bg-yellow-500/10"
      )}>
        {missingAltCount === 0 ? (
          <>
            <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
            <span className="text-green-700 dark:text-green-400">All images have alt text</span>
          </>
        ) : (
          <>
            <AlertTriangle className="h-3 w-3 text-yellow-500 shrink-0" />
            <span className="text-yellow-700 dark:text-yellow-400">
              {missingAltCount} image{missingAltCount > 1 ? 's' : ''} need alt text
            </span>
          </>
        )}
      </div>

      {/* Lazy Loading Check */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] bg-muted/30">
        <Zap className="h-3 w-3 text-blue-500 shrink-0" />
        <span className="text-muted-foreground">
          Lazy loading: Check implementation in code
        </span>
      </div>

      {/* Collapsible Image List */}
      <Collapsible open={listOpen} onOpenChange={setListOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-between h-5 text-[9px] px-1 text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <ImageIcon className="h-2.5 w-2.5" />
              View {analysis.images.length} images
            </span>
            <ChevronDown className={cn(
              "h-2.5 w-2.5 transition-transform",
              listOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-0.5">
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-1 pr-1">
              {analysis.images.map((img, i) => (
                <ImageRow 
                  key={i} 
                  image={img}
                  generatedAlt={generatedAlts[img.src]}
                  isGenerating={generatingFor === img.src}
                  onGenerate={() => generateAltForImage(img.src)}
                  onCopy={() => copyAltText(img.src)}
                />
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* AI Generate Alt Text Button */}
      {missingAltCount > 0 && (
        <div className="pt-1 border-t space-y-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full h-6 text-[10px] gap-1"
            onClick={generateAllMissingAlts}
            disabled={generatingAll || generatingFor !== null}
          >
            {generatingAll ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Sparkles className="h-3 w-3" />
            )}
            {generatingAll ? 'Generating...' : `Generate Alt Text (${missingAltCount} images)`}
          </Button>
          <p className="text-[8px] text-muted-foreground text-center">
            Uses AI to generate alt text • Copy results to paste in Page Builder
          </p>
        </div>
      )}

      {/* Show generated results summary */}
      {Object.keys(generatedAlts).length > 0 && (
        <div className="pt-1 border-t">
          <p className="text-[9px] text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {Object.keys(generatedAlts).length} alt text suggestions generated — expand image list to copy
          </p>
        </div>
      )}
    </div>
  );
}

// Image Row Component
function ImageRow({ 
  image, 
  generatedAlt, 
  isGenerating, 
  onGenerate, 
  onCopy 
}: { 
  image: ImageInfo;
  generatedAlt?: GeneratedAlt;
  isGenerating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
}) {
  const statusConfig = {
    good: { color: 'text-green-600 bg-green-500/10', icon: CheckCircle2 },
    short: { color: 'text-yellow-600 bg-yellow-500/10', icon: AlertTriangle },
    missing: { color: 'text-red-600 bg-red-500/10', icon: AlertTriangle },
  };

  const status = !image.hasAlt ? 'missing' : image.altLength < 10 ? 'short' : 'good';
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="p-1 rounded bg-muted/20 space-y-0.5">
      <div className="flex items-center gap-1 text-[8px]">
        <Icon className={cn("h-2.5 w-2.5 shrink-0", config.color)} />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{image.fileName}</div>
          <div className="text-muted-foreground truncate">
            {image.hasAlt ? `Alt: ${image.alt.substring(0, 30)}${image.alt.length > 30 ? '...' : ''}` : 'No alt text'}
          </div>
        </div>
        <Badge variant="outline" className={cn("h-3 text-[7px] px-0.5 shrink-0", config.color)}>
          {status}
        </Badge>
      </div>

      {/* Generated alt text display */}
      {generatedAlt && (
        <div className="flex items-start gap-1 p-1 rounded bg-green-500/5 border border-green-500/20">
          <Sparkles className="h-2.5 w-2.5 text-green-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0 text-[8px] text-green-700 dark:text-green-300">
            {generatedAlt.altText}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 shrink-0"
            onClick={onCopy}
          >
            {generatedAlt.copied ? (
              <Check className="h-2.5 w-2.5 text-green-500" />
            ) : (
              <Copy className="h-2.5 w-2.5 text-muted-foreground" />
            )}
          </Button>
        </div>
      )}

      {/* Generate button for missing alt (only if not already generated) */}
      {!image.hasAlt && !generatedAlt && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 text-[7px] px-1 gap-0.5 text-muted-foreground"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-2 w-2 animate-spin" />
          ) : (
            <Sparkles className="h-2 w-2" />
          )}
          {isGenerating ? 'Generating...' : 'Generate'}
        </Button>
      )}
    </div>
  );
}

// Analyze images in content
function analyzeImages(content: string): { images: ImageInfo[] } {
  const images: ImageInfo[] = [];
  
  const imagePatterns = [
    /"imageUrl"\s*:\s*"([^"]+)"/gi,
    /"image"\s*:\s*"([^"]+)"/gi,
    /"src"\s*:\s*"([^"]+)"/gi,
    /"backgroundImage"\s*:\s*"([^"]+)"/gi,
  ];

  const altPatterns = [
    /"alt"\s*:\s*"([^"]*)"/gi,
    /"imageAlt"\s*:\s*"([^"]*)"/gi,
  ];

  const foundUrls = new Set<string>();

  for (const pattern of imagePatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      const url = match[1];
      if (!url || foundUrls.has(url)) continue;
      if (!url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)/i)) continue;
      
      foundUrls.add(url);
      
      const fileName = url.split('/').pop() || url;
      
      let alt = '';
      const urlIndex = content.indexOf(url);
      const contextStart = Math.max(0, urlIndex - 200);
      const contextEnd = Math.min(content.length, urlIndex + 200);
      const ctx = content.substring(contextStart, contextEnd);
      
      for (const altPattern of altPatterns) {
        const altMatch = ctx.match(altPattern);
        if (altMatch) {
          alt = altMatch[1] || '';
          break;
        }
      }

      images.push({
        src: url,
        alt,
        hasAlt: alt.length > 0,
        altLength: alt.length,
        fileName: fileName.length > 25 ? fileName.substring(0, 22) + '...' : fileName,
      });
    }
  }

  return { images };
}
