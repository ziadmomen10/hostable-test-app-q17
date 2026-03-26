import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { History, RotateCcw, Eye, Clock, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

interface PageVersion {
  id: string;
  version_number: number;
  page_title: string;
  page_description: string;
  change_summary: string;
  created_at: string;
  content: string;
  css_content: string;
  metadata: any;
}

interface PageVersionHistoryProps {
  pageId: string;
  onRestore: (version: PageVersion) => void;
}

export const PageVersionHistory: React.FC<PageVersionHistoryProps> = ({
  pageId,
  onRestore
}) => {
  const [versions, setVersions] = useState<PageVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<PageVersion | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('page_versions')
        .select('*')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false })
        .limit(10);

      if (error) throw error;
      setVersions((data || []) as PageVersion[]);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [pageId]);

  const handlePreview = (version: PageVersion) => {
    setSelectedVersion(version);
    setPreviewOpen(true);
  };

  const handleRestoreClick = (version: PageVersion) => {
    setSelectedVersion(version);
    setRestoreDialogOpen(true);
  };

  const handleRestore = async () => {
    if (!selectedVersion) return;
    
    setRestoring(true);
    try {
      // First create a version of current state
      await supabase.rpc('create_page_version', {
        p_page_id: pageId,
        p_change_summary: 'Auto-save before restore'
      });

      // Now restore the selected version
      const { error } = await supabase
        .from('pages')
        .update({
          content: selectedVersion.content,
          css_content: selectedVersion.css_content,
          page_title: selectedVersion.page_title,
          page_description: selectedVersion.page_description,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId);

      if (error) throw error;

      // Log activity
      await supabase.from('activity_logs').insert({
        activity_type: 'page_restored',
        title: 'Page restored to previous version',
        description: `Restored to version ${selectedVersion.version_number}`,
        entity_type: 'page',
        entity_id: pageId,
        metadata: { version_number: selectedVersion.version_number }
      });

      toast.success(`Restored to version ${selectedVersion.version_number}`);

      onRestore(selectedVersion);
      setRestoreDialogOpen(false);
      fetchVersions();
    } catch (error: any) {
      console.error('Error restoring version:', error);
      toast.error(error.message || 'Failed to restore version');
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No versions saved yet</p>
              <p className="text-xs">Versions are created when you save the page</p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-lg border ${
                      index === 0 ? 'border-primary/50 bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-xs">
                          v{version.version_number}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">Latest</Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handlePreview(version)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleRestoreClick(version)}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium truncate">{version.page_title}</p>
                    {version.change_summary && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {version.change_summary}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span title={format(new Date(version.created_at), 'PPpp')}>
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              Version {selectedVersion?.version_number} Preview
            </DialogTitle>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden bg-white">
            <ScrollArea className="h-[60vh]">
              {selectedVersion?.css_content && (
                <style dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedVersion.css_content) }} />
              )}
              <div 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedVersion?.content || '') }}
                className="p-4"
              />
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Version {selectedVersion?.version_number}?</DialogTitle>
            <DialogDescription>
              This will replace the current page content with this version. 
              The current version will be saved before restoring.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="font-medium">{selectedVersion?.page_title}</p>
              <p className="text-sm text-muted-foreground">
                {selectedVersion?.change_summary || 'No description'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Created: {selectedVersion && format(new Date(selectedVersion.created_at), 'PPpp')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestore} disabled={restoring}>
              {restoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PageVersionHistory;
