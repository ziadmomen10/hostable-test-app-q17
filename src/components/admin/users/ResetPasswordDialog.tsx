import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import type { UserProfile } from '@/components/UserManagement';

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let pw = '';
  for (let i = 0; i < 12; i++) pw += chars.charAt(Math.floor(Math.random() * chars.length));
  return pw;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
}

const ResetPasswordDialog: React.FC<Props> = ({ open, onOpenChange, user }) => {
  const [newPassword, setNewPassword] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReset = async () => {
    if (!user || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setResetting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { action: 'reset_password', userId: user.user_id, newPassword },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setDone(true);
      toast.success(`Password reset for "${user.username}".`);
    } catch (err: any) {
      console.error('Reset password error:', err);
      toast.error('Failed to reset password.');
    } finally {
      setResetting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Email: ${user?.email}\nNew Temporary Password: ${newPassword}\n\nPlease sign in and change your password on first login.`);
      setCopied(true);
      toast.success('Credentials copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy.');
    }
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setDone(false);
      setNewPassword(generatePassword());
      setShowPassword(false);
      setCopied(false);
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] bg-background/95 backdrop-blur-xl border-white/[0.08]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Set a new temporary password for <strong>{user?.username}</strong>. They will be required to change it on next login.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 space-y-2">
              <p className="text-sm font-medium text-green-400">✅ Password reset successfully</p>
              <div className="bg-white/[0.04] rounded-md p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-mono">{user?.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New Password</span>
                  <span className="font-mono">{newPassword}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="outline" className="flex-1">
                {copied ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
              <Button onClick={() => handleClose(false)} className="flex-1">Done</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-2 py-4">
              <Label>New Temporary Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    minLength={6}
                    className="pr-10"
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0">
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => setNewPassword(generatePassword())} className="h-10 px-3" title="Generate">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={handleReset} disabled={resetting}>
                {resetting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : 'Reset Password'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
