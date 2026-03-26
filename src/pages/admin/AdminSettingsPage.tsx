import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Megaphone, Star, Activity, Image, Upload, Shield, Trash2, Key, Save, Eye, EyeOff, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AnnouncementManagement from '@/components/AnnouncementManagement';
import SystemStatusMonitor from '@/components/SystemStatusMonitor';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';

interface BannedIP {
  id: string;
  ip_address: string;
  created_at: string;
  reason?: string;
  banned_by_user_id: string;
  updated_at: string;
}

interface Integration {
  id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

const AdminSettingsPage: React.FC = () => {
  const [logoUploading, setLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);
  const [adminLogoUploading, setAdminLogoUploading] = useState(false);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [currentFavicon, setCurrentFavicon] = useState<string | null>(null);
  const [currentAdminLogo, setCurrentAdminLogo] = useState<string | null>(null);
  const [bannedIPs, setBannedIPs] = useState<BannedIP[]>([]);
  const [newIP, setNewIP] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banning, setBanning] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [savingIntegration, setSavingIntegration] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [integrationValues, setIntegrationValues] = useState<Record<string, string>>({
    cloudflare_api_token: '',
    cloudflare_zone_id: '',
    seo_ai_provider: 'openai',
  });
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const adminLogoInputRef = useRef<HTMLInputElement>(null);
  

  // Load current logo and favicon on mount
  useEffect(() => {
    loadCurrentAssets();
    loadBannedIPs();
    loadIntegrations();
  }, []);

  const loadBannedIPs = async () => {
    try {
      const { data, error } = await supabase
        .from('banned_ips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBannedIPs(data?.map(item => ({
        ...item,
        ip_address: String(item.ip_address)
      })) || []);
    } catch (error) {
      console.error('Error loading banned IPs:', error);
      toast.error("Failed to load the list of banned IP addresses");
    }
  };

  const loadIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .select('*')
        .in('key', ['cloudflare_api_token', 'cloudflare_zone_id', 'seo_ai_provider']);

      if (error) throw error;
      
      const values: Record<string, string> = {
        cloudflare_api_token: '',
        cloudflare_zone_id: '',
        seo_ai_provider: 'openai',
      };
      
      data?.forEach(item => {
        values[item.key] = item.value;
      });
      
      setIntegrationValues(values);
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const handleSaveIntegration = async (key: string) => {
    setSavingIntegration(true);
    try {
      const existingItem = integrations.find(i => i.key === key);
      
      if (existingItem) {
        const { error } = await supabase
          .from('admin_config')
          .update({ value: integrationValues[key], updated_at: new Date().toISOString() })
          .eq('id', existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admin_config')
          .insert({ key, value: integrationValues[key] });
        if (error) throw error;
      }

      await loadIntegrations();
      toast.success("Integration saved", {
        description: `${key.replace(/_/g, ' ')} has been saved successfully.`
      });
    } catch (error) {
      console.error('Error saving integration:', error);
      toast.error("Failed to save integration. Please try again.");
    } finally {
      setSavingIntegration(false);
    }
  };

  const toggleShowSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBanIP = async () => {
    console.log('handleBanIP function called');
    console.log('IP to ban:', newIP.trim());
    console.log('Ban reason:', banReason.trim());
    
    if (!newIP.trim()) {
      toast.error("Please enter an IP address to ban");
      return;
    }

    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(newIP.trim())) {
      toast.error("Please enter a valid IP address format (e.g., 192.168.1.1)");
      return;
    }

    setBanning(true);
    try {
      console.log('Attempting to insert into banned_ips table...');
      const { data, error } = await supabase
        .from('banned_ips')
        .insert([
          {
            ip_address: newIP.trim(),
            banned_by_user_id: '00000000-0000-0000-0000-000000000001',
            reason: banReason.trim() || 'No reason provided'
          }
        ])
        .select();

      console.log('Insert response:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        if (error.code === '23505') {
          toast.error("This IP address is already in the ban list");
          return;
        }
        throw error;
      }

      console.log('IP ban successful, data:', data);
      setNewIP('');
      setBanReason('');
      await loadBannedIPs();
      
      toast.success(`IP address ${newIP.trim()} has been banned`);
    } catch (error) {
      console.error('Error banning IP:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      toast.error(`Failed to ban IP address: ${error.message || 'Unknown error'}`);
    } finally {
      setBanning(false);
    }
  };

  const handleUnbanIP = async (id: string, ip: string) => {
    try {
      const { error } = await supabase
        .from('banned_ips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadBannedIPs();
      toast.success(`IP address ${ip} has been removed from the ban list`);
    } catch (error) {
      console.error('Error unbanning IP:', error);
      toast.error("Failed to unban IP address. Please try again");
    }
  };

  const loadCurrentAssets = async () => {
    try {
      // Check if logo exists
      const { data: logoData, error: logoError } = await supabase.storage
        .from('avatars')
        .list('website/', { 
          limit: 10,
          search: 'logo'
        });

      if (!logoError && logoData && logoData.length > 0) {
        const logoFile = logoData.find(file => file.name.startsWith('logo.'));
        if (logoFile) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(`website/${logoFile.name}`);
          setCurrentLogo(publicUrl);
        }
      }

      // Check if favicon exists
      const { data: faviconData, error: faviconError } = await supabase.storage
        .from('avatars')
        .list('website/', { 
          limit: 10,
          search: 'favicon'
        });

      if (!faviconError && faviconData && faviconData.length > 0) {
        const faviconFile = faviconData.find(file => file.name.startsWith('favicon.'));
        if (faviconFile) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(`website/${faviconFile.name}`);
          setCurrentFavicon(publicUrl);
        }
      }

      // Check if admin logo exists
      const { data: adminLogoData, error: adminLogoError } = await supabase.storage
        .from('avatars')
        .list('website/', { 
          limit: 10,
          search: 'admin-logo'
        });

      if (!adminLogoError && adminLogoData && adminLogoData.length > 0) {
        const adminLogoFile = adminLogoData.find(file => file.name.startsWith('admin-logo.'));
        if (adminLogoFile) {
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(`website/${adminLogoFile.name}`);
          setCurrentAdminLogo(publicUrl);
        }
      }
    } catch (error) {
      console.error('Error loading current assets:', error);
    }
  };

  const handleAdminLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAdminLogoUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin-logo.${fileExt}`;
      const filePath = `website/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Add cache-busting parameter
      const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
      setCurrentAdminLogo(urlWithCacheBust);
      
      // Dispatch custom event to notify AdminLayout
      window.dispatchEvent(new CustomEvent('adminLogoUpdated', { detail: urlWithCacheBust }));
      
      toast.success("Admin logo updated successfully");
    } catch (error) {
      console.error('Error uploading admin logo:', error);
      toast.error("Failed to upload admin logo. Please try again");
    } finally {
      setAdminLogoUploading(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo.${fileExt}`;
      const filePath = `website/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setCurrentLogo(publicUrl);
      toast.success("Website logo updated successfully");
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error("Failed to upload logo. Please try again");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFaviconUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon.${fileExt}`;
      const filePath = `website/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setCurrentFavicon(publicUrl);
      
      // Update favicon in the document
      const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (existingFavicon) {
        existingFavicon.href = publicUrl;
      } else {
        const newFavicon = document.createElement('link');
        newFavicon.rel = 'icon';
        newFavicon.href = publicUrl;
        newFavicon.type = `image/${fileExt}`;
        document.head.appendChild(newFavicon);
      }

      toast.success("Website favicon updated successfully");
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast.error("Failed to upload favicon. Please try again");
    } finally {
      setFaviconUploading(false);
    }
  };

  return (
    <>
      <AdminSectionHeader
        title="System Settings"
        subtitle="Configure website settings, security, and system options"
      />
      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="p-6">
        <Tabs defaultValue="website-customization" className="w-full">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted/30 p-1 gap-1">
            <TabsTrigger 
              value="website-customization" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Image className="h-4 w-4" />
              Website Customization
            </TabsTrigger>
            <TabsTrigger 
              value="ban-users" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              Ban Users
            </TabsTrigger>
            <TabsTrigger 
              value="announcements" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Megaphone className="h-4 w-4" />
              Announcements
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="system-status" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Activity className="h-4 w-4" />
              System Status
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-medium text-sm transition-all duration-200 text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
            >
              <Key className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="website-customization" className="mt-6">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Website Customization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="logo-upload">Website Logo</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your website logo (PNG, JPG, GIF recommended)
                    </p>
                    <div className="flex items-center gap-4">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        ref={logoInputRef}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={logoUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {logoUploading ? "Uploading..." : "Upload Logo"}
                      </Button>
                      {currentLogo && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={currentLogo} 
                            alt="Current logo" 
                            className="h-10 w-10 object-contain rounded border"
                          />
                          <span className="text-sm text-muted-foreground">Current logo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="favicon-upload">Website Favicon</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload your website favicon (PNG, JPG recommended - ICO not supported)
                    </p>
                    <div className="flex items-center gap-4">
                      <Input
                        id="favicon-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFaviconUpload}
                        ref={faviconInputRef}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => faviconInputRef.current?.click()}
                        disabled={faviconUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {faviconUploading ? "Uploading..." : "Upload Favicon"}
                      </Button>
                      {currentFavicon && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={currentFavicon} 
                            alt="Current favicon" 
                            className="h-6 w-6 object-contain rounded border"
                          />
                          <span className="text-sm text-muted-foreground">Current favicon</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Panel Logo Section */}
                  <div className="pt-6 border-t">
                    <Label htmlFor="admin-logo-upload" className="text-base font-semibold">Admin Panel Logo</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a custom logo for the admin panel sidebar (PNG, JPG recommended)
                    </p>
                    <div className="flex items-center gap-4">
                      <Input
                        id="admin-logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAdminLogoUpload}
                        ref={adminLogoInputRef}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        onClick={() => adminLogoInputRef.current?.click()}
                        disabled={adminLogoUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {adminLogoUploading ? "Uploading..." : "Upload Admin Logo"}
                      </Button>
                      {currentAdminLogo && (
                        <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-lg">
                          <img 
                            src={currentAdminLogo} 
                            alt="Current admin logo" 
                            className="h-10 w-auto object-contain"
                          />
                          <span className="text-sm text-muted-foreground">Current admin logo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ban-users" className="mt-6">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Ban Users by IP Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ban-ip">IP Address</Label>
                    <Input
                      id="ban-ip"
                      type="text"
                      placeholder="192.168.1.1"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ban-reason">Reason (Optional)</Label>
                    <Input
                      id="ban-reason"
                      type="text"
                      placeholder="Spam, abuse, etc."
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleBanIP}
                      disabled={banning}
                      variant="destructive"
                      className="w-full"
                    >
                      {banning ? "Banning..." : "BAN"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Banned IP Addresses</h3>
                  {bannedIPs.length === 0 ? (
                    <p className="text-muted-foreground">No IP addresses are currently banned.</p>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Date of Ban</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="w-20">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bannedIPs.map((bannedIP) => (
                            <TableRow key={bannedIP.id} className="hover:bg-white/[0.05] transition-colors duration-200">
                              <TableCell className="font-mono">{bannedIP.ip_address}</TableCell>
                              <TableCell>
                                {new Date(bannedIP.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell>{bannedIP.reason || 'No reason provided'}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleUnbanIP(bannedIP.id, bannedIP.ip_address)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-6">
            <AnnouncementManagement />
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Reviews Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Moderate and manage customer reviews and testimonials.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system-status" className="mt-6">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Status Monitor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SystemStatusMonitor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card className="bg-white/[0.02] backdrop-blur-lg border-white/[0.06] rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Provider Selection */}
                <div className="space-y-4 p-4 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">AI Provider</h3>
                      <p className="text-sm text-muted-foreground">Controls which AI provider SEO Studio uses</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo_ai_provider">SEO AI Provider</Label>
                    <div className="flex gap-2">
                      <select
                        id="seo_ai_provider"
                        value={integrationValues.seo_ai_provider}
                        onChange={(e) => setIntegrationValues(prev => ({ ...prev, seo_ai_provider: e.target.value }))}
                        className="flex-1 h-10 rounded-md border bg-background border-border focus:border-ring px-3 text-sm text-foreground [&>option]:bg-background [&>option]:text-foreground"
                      >
                        <option value="openai">OpenAI (gpt-4o-mini)</option>
                        <option value="claude">Claude (claude-sonnet-4-20250514)</option>
                        <option value="lovable">Lovable AI (Gemini Flash)</option>
                      </select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSaveIntegration('seo_ai_provider')}
                        disabled={savingIntegration}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {integrationValues.seo_ai_provider === 'openai' 
                        ? 'OpenAI requires OPENAI_API_KEY set in Supabase Edge Function secrets' 
                        : integrationValues.seo_ai_provider === 'claude'
                        ? 'Claude requires ANTHROPIC_API_KEY set in Supabase Edge Function secrets'
                        : 'Lovable AI uses your workspace credits via LOVABLE_API_KEY'}
                    </p>
                  </div>
                </div>

                {/* Cloudflare Integration */}
                <div className="space-y-4 p-4 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <svg className="h-5 w-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16.5088 16.8447C16.6364 16.2979 16.5645 15.8358 16.3047 15.5162C16.0684 15.2237 15.6776 15.0639 15.1768 15.0229L8.70332 14.9526C8.60938 14.9404 8.52559 14.8916 8.46875 14.8169C8.41191 14.7422 8.38672 14.6475 8.39844 14.5537C8.41309 14.4131 8.53027 14.2993 8.67676 14.2764L15.2578 14.2061C15.9697 14.1479 16.75 13.5522 17.0303 12.8779L17.5566 11.5952C17.5957 11.4951 17.5986 11.3833 17.5645 11.2808C17.1035 9.8833 15.7012 8.8667 14.0508 8.8667C12.6318 8.8667 11.4102 9.6084 10.8398 10.6836C10.4785 10.3987 10.0215 10.2383 9.54102 10.2383C8.42285 10.2383 7.51465 11.1113 7.44824 12.2061C7.4541 12.2441 7.44531 12.2764 7.44531 12.3145C6.09375 12.4453 5.00391 13.5645 5.00391 14.9355C5.00391 15.1406 5.02148 15.3398 5.05469 15.5332C5.07812 15.6631 5.19141 15.7588 5.32324 15.7588L15.9814 15.8467C15.9961 15.8467 16.0127 15.8467 16.0273 15.8438C16.1621 15.8232 16.2695 15.7129 16.2988 15.5742L16.5088 16.8447Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Cloudflare</h3>
                      <p className="text-sm text-muted-foreground">Cache purging and CDN management</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cloudflare_api_token">API Token</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="cloudflare_api_token"
                            type={showSecrets['cloudflare_api_token'] ? 'text' : 'password'}
                            placeholder="Enter Cloudflare API token"
                            value={integrationValues.cloudflare_api_token}
                            onChange={(e) => setIntegrationValues(prev => ({ ...prev, cloudflare_api_token: e.target.value }))}
                            className="pr-10 bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => toggleShowSecret('cloudflare_api_token')}
                          >
                            {showSecrets['cloudflare_api_token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSaveIntegration('cloudflare_api_token')}
                          disabled={savingIntegration}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Get your API token from Cloudflare Dashboard → My Profile → API Tokens</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cloudflare_zone_id">Zone ID</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="cloudflare_zone_id"
                            type={showSecrets['cloudflare_zone_id'] ? 'text' : 'password'}
                            placeholder="Enter Cloudflare Zone ID"
                            value={integrationValues.cloudflare_zone_id}
                            onChange={(e) => setIntegrationValues(prev => ({ ...prev, cloudflare_zone_id: e.target.value }))}
                            className="pr-10 bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => toggleShowSecret('cloudflare_zone_id')}
                          >
                            {showSecrets['cloudflare_zone_id'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleSaveIntegration('cloudflare_zone_id')}
                          disabled={savingIntegration}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">Find Zone ID on your domain's overview page in Cloudflare Dashboard</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </>
  );
};

export default AdminSettingsPage;