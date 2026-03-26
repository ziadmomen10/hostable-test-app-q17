/**
 * SocialPreview
 * 
 * Facebook and Twitter/X card preview simulation.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface SocialPreviewProps {
  title: string;
  description: string;
  imageUrl?: string;
  url: string;
}

export function SocialPreview({ title, description, imageUrl, url }: SocialPreviewProps) {
  const [imageError, setImageError] = useState(false);
  
  // Format domain from URL
  const getDomain = (url: string) => {
    try {
      const baseUrl = window.location.origin;
      const fullUrl = url.startsWith('/') ? baseUrl + url : url;
      return new URL(fullUrl).hostname.replace('www.', '');
    } catch {
      return 'example.com';
    }
  };
  
  const domain = getDomain(url);
  const hasImage = imageUrl && !imageError;
  
  // Character limits for social
  const titleLimit = 70;
  const descLimit = 200;
  
  const displayTitle = title.length > titleLimit ? title.slice(0, titleLimit) + '...' : title;
  const displayDesc = description.length > descLimit ? description.slice(0, descLimit) + '...' : description;

  return (
    <div className="h-full flex flex-col bg-muted/20 p-6 overflow-auto">
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Social Media Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="facebook" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="twitter">Twitter / X</TabsTrigger>
            </TabsList>
            
            <TabsContent value="facebook">
              {/* Facebook Card Preview */}
              <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                {/* Image */}
                <div className="aspect-[1.91/1] bg-muted relative">
                  {hasImage ? (
                    <img 
                      src={imageUrl} 
                      alt="OG preview" 
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mb-2" />
                      <span className="text-sm">No OG image set</span>
                      <span className="text-xs">Recommended: 1200×630 pixels</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {domain}
                  </p>
                  <h4 className="font-semibold text-base leading-snug mb-1 line-clamp-2">
                    {displayTitle || 'Page Title'}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {displayDesc || 'Add a meta description for social sharing.'}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="twitter">
              {/* Twitter Card Preview (Summary Large Image) */}
              <div className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
                {/* Image */}
                <div className="aspect-[2/1] bg-muted relative">
                  {hasImage ? (
                    <img 
                      src={imageUrl} 
                      alt="Twitter card preview" 
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mb-2" />
                      <span className="text-sm">No Twitter card image</span>
                      <span className="text-xs">Recommended: 1200×600 pixels</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 border-t">
                  <h4 className="font-semibold text-base leading-snug mb-1 line-clamp-2">
                    {displayTitle || 'Page Title'}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                    {displayDesc || 'Add a meta description for Twitter cards.'}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    {domain}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Status Checklist */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium">Social Optimization Status</h4>
            <div className="grid gap-2">
              <StatusItem 
                label="OG Image" 
                isOk={hasImage} 
                message={hasImage ? '1200×630 recommended' : 'Missing - add an OG image'} 
              />
              <StatusItem 
                label="OG Title" 
                isOk={title.length > 0 && title.length <= titleLimit} 
                message={title.length === 0 ? 'Missing' : title.length > titleLimit ? 'Too long' : 'Good length'} 
              />
              <StatusItem 
                label="OG Description" 
                isOk={description.length > 0 && description.length <= descLimit} 
                message={description.length === 0 ? 'Missing' : description.length > descLimit ? 'Too long' : 'Good length'} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface StatusItemProps {
  label: string;
  isOk: boolean;
  message: string;
}

function StatusItem({ label, isOk, message }: StatusItemProps) {
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg ${
      isOk ? 'bg-green-500/10' : 'bg-yellow-500/10'
    }`}>
      <div className="flex items-center gap-2">
        {isOk ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Badge variant="outline" className="text-xs">
        {message}
      </Badge>
    </div>
  );
}
