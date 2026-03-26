/**
 * LogoCarouselSettingsContent - Content-only settings.
 */
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Image, Upload, Link, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LogoCarouselData, LogoData } from '@/types/pageEditor';
import { ItemListEditor } from './shared';
import { useDataChangeHandlers } from '@/hooks/useLatestRef';

interface LogoCarouselSettingsContentProps { data: LogoCarouselData; onChange: (data: LogoCarouselData) => void; }

const LogoCarouselSettingsContent: React.FC<LogoCarouselSettingsContentProps> = ({ data, onChange }) => {
  const { updateField, updateArray, dataRef } = useDataChangeHandlers(data, onChange);
  const [newLogoSrc, setNewLogoSrc] = useState('');
  const [newLogoAlt, setNewLogoAlt] = useState('');
  const [addMode, setAddMode] = useState<'url' | 'upload'>('upload');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleLogosChange = useCallback((logos: LogoData[]) => updateArray('logos', logos), [updateArray]);
  const createNewLogo = useCallback((): LogoData => ({ src: '/placeholder.svg', alt: 'Logo' }), []);
  const addLogoByUrl = useCallback(() => { if (!newLogoSrc.trim()) return; updateArray('logos', [...dataRef.current.logos, { src: newLogoSrc, alt: newLogoAlt || 'Logo' }]); setNewLogoSrc(''); setNewLogoAlt(''); }, [newLogoSrc, newLogoAlt, updateArray, dataRef]);
  const handleFileUpload = useCallback(async (file: File) => { setUploading(true); try { const fileExt = file.name.split('.').pop(); const fileName = `logo-${Date.now()}.${fileExt}`; const filePath = `logos/${fileName}`; const { error: uploadError } = await supabase.storage.from('page-assets').upload(filePath, file); if (uploadError) { if (uploadError.message.includes('Bucket not found')) { toast.error("Storage bucket not configured."); } else { throw uploadError; } return; } const { data: urlData } = supabase.storage.from('page-assets').getPublicUrl(filePath); const altText = newLogoAlt || file.name.replace(/\.[^/.]+$/, ''); updateArray('logos', [...dataRef.current.logos, { src: urlData.publicUrl, alt: altText }]); setNewLogoAlt(''); toast.success("Logo added"); } catch (error) { console.error('Upload error:', error); toast.error("Failed to upload"); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; } }, [newLogoAlt, updateArray, dataRef]);

  return (
    <div className="space-y-4 p-3">
      <div className="space-y-3"><h4 className="font-medium text-sm">Appearance</h4>
        <div className="space-y-1.5"><Label className="text-xs">Theme Variant</Label><Select value={data.variant} onValueChange={(val: 'dark' | 'light') => updateField('variant', val)}><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="dark">Dark</SelectItem><SelectItem value="light">Light</SelectItem></SelectContent></Select></div>
        <div className="space-y-1.5"><Label className="text-xs">Custom Background Color</Label><div className="flex gap-2"><Input type="color" value={data.customBackground || '#1a2e1f'} onChange={(e) => updateField('customBackground', e.target.value)} className="w-12 h-8 p-1 cursor-pointer" /><Input value={data.customBackground} onChange={(e) => updateField('customBackground', e.target.value)} placeholder="e.g., #1a2e1f" className="flex-1 h-8 text-sm" /></div></div>
        <div className="space-y-1.5"><div className="flex justify-between"><Label className="text-xs">Logo Opacity</Label><span className="text-xs text-muted-foreground">{data.logoOpacity}%</span></div><Slider value={[data.logoOpacity]} onValueChange={([val]) => updateField('logoOpacity', val)} min={10} max={100} step={5} className="py-2" /></div>
        <div className="space-y-1.5"><div className="flex justify-between"><Label className="text-xs">Scroll Speed</Label><span className="text-xs text-muted-foreground">{data.speed}px/s</span></div><Slider value={[data.speed]} onValueChange={([val]) => updateField('speed', val)} min={10} max={150} step={5} className="py-2" /></div>
        <div className="flex items-center justify-between p-2 border rounded-lg"><div><Label className="text-xs font-medium">Pause on Hover</Label></div><Switch checked={data.pauseOnHover} onCheckedChange={(checked) => updateField('pauseOnHover', checked)} /></div>
      </div>
      <div className="border-t pt-4"><h4 className="font-medium text-sm mb-3">Logos</h4>
        <ItemListEditor items={data.logos} onItemsChange={handleLogosChange} createNewItem={createNewLogo} getItemTitle={(logo) => logo.alt || 'Logo'} getItemIcon={(logo) => <img src={logo.src} alt={logo.alt} className="w-6 h-6 object-contain bg-muted rounded" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />} addItemLabel="Add Logo" emptyMessage="No logos added." emptyStateIcon={<Image className="h-10 w-10 text-muted-foreground/50 mb-2" />} minItems={0} maxItems={20} showDuplicateButton confirmDelete showBulkActions={false} renderItem={(logo, index, onUpdate) => (<div className="space-y-2 pt-2"><div><Label className="text-[10px]">Image URL</Label><Input value={logo.src} onChange={(e) => onUpdate({ src: e.target.value })} placeholder="https://..." className="h-7 text-xs" /></div><div><Label className="text-[10px]">Alt Text</Label><Input value={logo.alt} onChange={(e) => onUpdate({ alt: e.target.value })} placeholder="Company name" className="h-7 text-xs" /></div></div>)} />
        <div className="space-y-3 border-t pt-3 mt-3">
          <div className="flex items-center justify-between"><Label className="text-xs font-medium">Quick Add</Label><div className="flex gap-1"><Button variant={addMode === 'upload' ? 'default' : 'ghost'} size="sm" className="h-6 px-2 text-xs" onClick={() => setAddMode('upload')}><Upload className="h-3 w-3 mr-1" />Upload</Button><Button variant={addMode === 'url' ? 'default' : 'ghost'} size="sm" className="h-6 px-2 text-xs" onClick={() => setAddMode('url')}><Link className="h-3 w-3 mr-1" />URL</Button></div></div>
          {addMode === 'upload' ? (<div className="space-y-2"><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); }} /><div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => !uploading && fileInputRef.current?.click()}>{uploading ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Uploading...</span></div> : <><Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Click to upload</p></>}</div></div>) : (<div className="space-y-2"><Input value={newLogoSrc} onChange={(e) => setNewLogoSrc(e.target.value)} placeholder="https://example.com/logo.png" className="h-7 text-xs" /><Input value={newLogoAlt} onChange={(e) => setNewLogoAlt(e.target.value)} placeholder="Alt text" className="h-7 text-xs" /><Button size="sm" className="w-full h-7 text-xs" onClick={addLogoByUrl} disabled={!newLogoSrc.trim()}><Plus className="h-3 w-3 mr-1" />Add Logo</Button></div>)}
        </div>
      </div>
    </div>
  );
};

export default LogoCarouselSettingsContent;
