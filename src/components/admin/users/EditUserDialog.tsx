import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '@/components/UserManagement';
import { useRoleDefinitions } from '@/hooks/useRoleDefinitions';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  onSuccess: (user: UserProfile) => void;
}

const EditUserDialog: React.FC<Props> = ({ open, onOpenChange, user, onSuccess }) => {
  const [form, setForm] = useState({ username: '', email: '', gender: 'male' as 'male' | 'female', roles: [] as string[] });
  const [updating, setUpdating] = useState(false);
  const { roles: roleDefinitions } = useRoleDefinitions();

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email: user.email || '',
        gender: user.gender || 'male',
        roles: [...user.roles],
      });
    }
  }, [user]);

  const handleRoleChange = (roleId: string, checked: boolean) => {
    setForm(prev => ({
      ...prev,
      roles: checked ? [...prev.roles, roleId] : prev.roles.filter(r => r !== roleId),
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setUpdating(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: form.username, email: form.email, gender: form.gender, updated_at: new Date().toISOString() })
        .eq('user_id', user.user_id);
      if (profileError) throw profileError;

      await supabase.from('user_roles').delete().eq('user_id', user.user_id);
      if (form.roles.length > 0) {
        const { error: rolesError } = await supabase
          .from('user_roles')
          .insert(form.roles.map(role => ({
            user_id: user.user_id,
            role: role as 'admin' | 'user' | 'seo_manager' | 'content_writer' | 'manager',
          })));
        if (rolesError) throw rolesError;
      }

      const updatedUser: UserProfile = {
        ...user,
        username: form.username,
        email: form.email,
        gender: form.gender,
        roles: form.roles,
        updated_at: new Date().toISOString(),
      };
      toast.success(`User "${form.username}" updated.`);
      onSuccess(updatedUser);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/[0.08]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information and permissions.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-username">Username</Label>
            <Input id="edit-username" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" value={form.email} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed after creation.</p>
          </div>
          <div className="grid gap-2">
            <Label>Gender</Label>
            <div className="flex items-center space-x-6">
              {(['male', 'female'] as const).map(g => (
                <div key={g} className="flex items-center space-x-2">
                  <Checkbox id={`edit-${g}`} checked={form.gender === g} onCheckedChange={c => { if (c) setForm(p => ({ ...p, gender: g })); }} />
                  <Label htmlFor={`edit-${g}`} className="text-sm font-normal cursor-pointer capitalize">{g}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Roles</Label>
            <div className="grid gap-2">
              {roleDefinitions.map(role => (
                <div key={role.role_key} className="flex items-center space-x-2">
                  <Checkbox id={`edit-role-${role.role_key}`} checked={form.roles.includes(role.role_key)} onCheckedChange={c => handleRoleChange(role.role_key, c as boolean)} />
                  <Label htmlFor={`edit-role-${role.role_key}`} className="text-sm font-normal cursor-pointer">{role.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={updating}>
            {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
