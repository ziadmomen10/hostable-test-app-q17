import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Megaphone, Save, Eye, EyeOff } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  is_active: boolean;
  text_color: string;
  created_at: string;
  updated_at: string;
}

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    is_active: true,
    text_color: '#ffffff'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      is_active: announcement.is_active,
      text_color: announcement.text_color
    });
  };

  const handleSave = async () => {
    if (!editingAnnouncement) return;

    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: formData.title,
          message: formData.message,
          is_active: formData.is_active,
          text_color: formData.text_color
        })
        .eq('id', editingAnnouncement.id);

      if (error) throw error;

      toast.success('Announcement updated successfully');

      setEditingAnnouncement(null);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  const handleToggleStatus = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id);

      if (error) throw error;

      toast.success(`Announcement ${!announcement.is_active ? 'activated' : 'deactivated'}`);

      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      toast.error('Failed to update announcement status');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-muted-foreground">Loading announcements...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Announcements */}
      <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Current Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No announcements found
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border border-white/[0.06] rounded-lg p-4 hover:bg-white/[0.05] transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <div className="flex items-center gap-2">
                          {announcement.is_active ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-gray-500">
                              <EyeOff className="h-4 w-4" />
                              <span className="text-sm">Inactive</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{announcement.message}</p>
                      <div 
                        className="p-3 rounded-md text-sm bg-slate-800"
                        style={{
                          color: announcement.text_color
                        }}
                      >
                        Preview: {announcement.title}: {announcement.message}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={announcement.is_active ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(announcement)}
                      >
                        {announcement.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Form */}
      {editingAnnouncement && (
        <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Edit Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter announcement title"
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Enter announcement message"
                  rows={3}
                  className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={formData.text_color}
                  onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active (visible on homepage)</Label>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Preview</Label>
                <div 
                  className="p-4 rounded-md text-center bg-slate-800"
                  style={{
                    color: formData.text_color
                  }}
                >
                  {formData.title}: {formData.message}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingAnnouncement(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnnouncementManagement;