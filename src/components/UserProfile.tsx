import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  LogOut, 
  Settings, 
  Upload, 
  Camera,
  Mail,
  Badge
} from 'lucide-react';

interface UserProfileProps {
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const { user, userRoles, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: user?.user_metadata?.username || '',
    email: '',
    profile_picture_url: ''
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colorMap: Record<string, string> = {
      admin: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 dark:shadow-sm dark:shadow-red-500/20',
      seo_manager: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 dark:shadow-sm dark:shadow-blue-500/20',
      content_writer: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30 dark:shadow-sm dark:shadow-green-500/20',
      manager: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 dark:shadow-sm dark:shadow-purple-500/20',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30';
  };

  const formatRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      admin: 'Admin',
      seo_manager: 'SEO Manager',
      content_writer: 'Content Writer',
      manager: 'Manager',
    };
    return roleNames[role] || role;
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setUserProfile(prev => ({ ...prev, profile_picture_url: publicUrl }));

      toast.success('Profile picture updated successfully!');

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload profile picture. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed Out', {
      description: 'You have been successfully signed out.',
    });
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`flex items-center gap-3 p-2 h-auto hover:bg-muted/50 ${className}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.profile_picture_url} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(userProfile.username || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-sm">
              <span className="font-medium">{userProfile.username}</span>
              <div className="flex flex-wrap gap-1">
                {userRoles.slice(0, 2).map((role) => (
                  <span 
                    key={role}
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${getRoleColor(role)}`}
                  >
                    {formatRoleName(role)}
                  </span>
                ))}
                {userRoles.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{userRoles.length - 2}</span>
                )}
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.profile_picture_url} alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(userProfile.username || 'User')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{userProfile.username}</p>
              <p className="text-xs text-muted-foreground">
                {formatRoleName(userRoles[0] || 'user')}
              </p>
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
            <Camera className="mr-2 h-4 w-4" />
            {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Settings Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
            <DialogDescription>
              View and manage your profile information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.profile_picture_url} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(userProfile.username || 'User')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="profile-username">Username</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="profile-username"
                  value={userProfile.username}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Roles</Label>
              <div className="flex flex-wrap gap-2">
                {userRoles.map((role) => (
                  <div 
                    key={role}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm border ${getRoleColor(role)}`}
                  >
                    <Badge className="h-3 w-3" />
                    {formatRoleName(role)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setProfileDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;