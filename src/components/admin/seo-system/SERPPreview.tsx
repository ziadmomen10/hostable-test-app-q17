/**
 * SERPPreview
 * 
 * Google search result simulation with mobile/desktop toggle.
 * Shows how the page appears in search.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlertCircle, CheckCircle2, Globe, Monitor, Smartphone } from 'lucide-react';

interface SERPPreviewProps {
  title: string;
  description: string;
  url: string;
  favicon?: string;
}

type DeviceMode = 'desktop' | 'mobile';

export function SERPPreview({ title, description, url, favicon }: SERPPreviewProps) {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  
  // Different character limits per device
  const limits = {
    desktop: { title: 60, description: 160, optimalTitleMin: 30, optimalDescMin: 120 },
    mobile: { title: 55, description: 120, optimalTitleMin: 25, optimalDescMin: 100 },
  };
  
  const currentLimits = limits[deviceMode];
  
  const titleLength = title.length;
  const descLength = description.length;
  
  const titleOk = titleLength > 0 && titleLength <= currentLimits.title;
  const descOk = descLength > 0 && descLength <= currentLimits.description;
  
  // Truncate for display
  const displayTitle = titleLength > currentLimits.title ? title.slice(0, currentLimits.title) + '...' : title;
  const displayDesc = descLength > currentLimits.description ? description.slice(0, currentLimits.description) + '...' : description;
  
  // Format URL for display
  const formatUrl = (url: string) => {
    try {
      const baseUrl = window.location.origin;
      const fullUrl = url.startsWith('/') ? baseUrl + url : url;
      const parsed = new URL(fullUrl);
      return `${parsed.hostname} › ${url.replace(/^\//, '').replace(/\//g, ' › ') || 'home'}`;
    } catch {
      return url;
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/20 p-4 overflow-auto">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Google Search Preview
            </CardTitle>
            
            {/* Device Toggle */}
            <ToggleGroup type="single" value={deviceMode} onValueChange={(v) => v && setDeviceMode(v as DeviceMode)}>
              <ToggleGroupItem value="desktop" className="h-7 px-2 text-xs">
                <Monitor className="h-3 w-3 mr-1" />
                Desktop
              </ToggleGroupItem>
              <ToggleGroupItem value="mobile" className="h-7 px-2 text-xs">
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* SERP Preview Card */}
          <div className={`bg-white dark:bg-gray-900 rounded-lg p-4 border ${deviceMode === 'mobile' ? 'max-w-[360px] mx-auto' : ''}`}>
            {/* URL Row */}
            <div className="flex items-center gap-2 mb-1">
              {favicon ? (
                <img src={favicon} alt="" className="w-4 h-4 rounded-sm" />
              ) : (
                <div className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center">
                  <Globe className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
              <span className="text-xs text-muted-foreground truncate">
                {formatUrl(url)}
              </span>
            </div>
            
            {/* Title */}
            <h3 className={`text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-normal mb-1 leading-snug ${deviceMode === 'mobile' ? 'text-base' : 'text-lg'}`}>
              {displayTitle || 'Page Title'}
            </h3>
            
            {/* Description */}
            <p className={`text-muted-foreground leading-relaxed ${deviceMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>
              {displayDesc || 'Add a meta description to improve your search appearance.'}
            </p>
          </div>

          {/* Character Length Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <CharacterIndicator
              label="Title"
              current={titleLength}
              min={currentLimits.optimalTitleMin}
              max={currentLimits.title}
              optimal={`${currentLimits.optimalTitleMin}-${currentLimits.title}`}
              isOk={titleOk && titleLength >= currentLimits.optimalTitleMin}
            />
            <CharacterIndicator
              label="Description"
              current={descLength}
              min={currentLimits.optimalDescMin}
              max={currentLimits.description}
              optimal={`${currentLimits.optimalDescMin}-${currentLimits.description}`}
              isOk={descOk && descLength >= currentLimits.optimalDescMin}
            />
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <h4 className="text-xs font-medium">Quick Tips</h4>
            <ul className="text-[11px] text-muted-foreground space-y-0.5">
              <li>• Keep titles under {currentLimits.title} chars to avoid truncation</li>
              <li>• Include your main keyword near the beginning</li>
              <li>• Write descriptions that encourage clicks</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface CharacterIndicatorProps {
  label: string;
  current: number;
  min: number;
  max: number;
  optimal: string;
  isOk: boolean;
}

function CharacterIndicator({ label, current, min, max, optimal, isOk }: CharacterIndicatorProps) {
  const getStatus = () => {
    if (current === 0) return 'empty';
    if (current >= min && current <= max) return 'good';
    if (current > max) return 'over';
    return 'short';
  };
  
  const status = getStatus();
  
  return (
    <div className={`p-2.5 rounded-lg border ${
      status === 'good' ? 'bg-green-500/10 border-green-500/30' :
      status === 'over' ? 'bg-red-500/10 border-red-500/30' :
      status === 'short' ? 'bg-yellow-500/10 border-yellow-500/30' :
      'bg-muted border-border'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium">{label}</span>
        {status === 'good' ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        ) : status !== 'empty' && (
          <AlertCircle className={`h-3.5 w-3.5 ${status === 'over' ? 'text-red-500' : 'text-yellow-500'}`} />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-base font-bold">{current}</span>
        <span className="text-[10px] text-muted-foreground">/ {max}</span>
      </div>
      <div className="text-[10px] text-muted-foreground">
        Optimal: {optimal}
      </div>
      {status === 'over' && (
        <Badge variant="destructive" className="mt-1.5 text-[9px] h-4 px-1">
          Will be truncated
        </Badge>
      )}
    </div>
  );
}
