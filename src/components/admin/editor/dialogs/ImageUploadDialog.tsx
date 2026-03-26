/**
 * ImageUploadDialog Component
 * 
 * Dialog for editing image properties: upload new image, set dimensions, alt text.
 */

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface ImageUploadState {
  isOpen: boolean;
  component: any;
  currentSrc: string;
  width: string;
  height: string;
  alt: string;
}

export interface ImageUploadDialogProps {
  state: ImageUploadState;
  onStateChange: (state: Partial<ImageUploadState>) => void;
  onUpload: (file: File) => Promise<void>;
  onApply: () => void;
}

export const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  state,
  onStateChange,
  onUpload,
  onApply,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <Dialog 
      open={state.isOpen} 
      onOpenChange={(open) => onStateChange({ isOpen: open })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Image
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Current Image</Label>
            {state.currentSrc && (
              <img 
                src={state.currentSrc} 
                alt="Current" 
                className="w-full h-32 object-contain border rounded mt-2 bg-muted"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            )}
          </div>
          
          <div>
            <Label>Upload New Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Width</Label>
              <Input
                value={state.width}
                onChange={(e) => onStateChange({ width: e.target.value })}
                placeholder="e.g., 300px or 100%"
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                value={state.height}
                onChange={(e) => onStateChange({ height: e.target.value })}
                placeholder="e.g., 200px or auto"
              />
            </div>
          </div>
          
          <div>
            <Label>Alt Text</Label>
            <Input
              value={state.alt}
              onChange={(e) => onStateChange({ alt: e.target.value })}
              placeholder="Describe the image"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onStateChange({ isOpen: false })}>
            Cancel
          </Button>
          <Button onClick={onApply}>
            Apply Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
