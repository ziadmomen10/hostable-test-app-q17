import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';
import ForcePasswordChange from '@/components/ForcePasswordChange';

interface AdminLoginProps {
  errorMessage?: string;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForceChange, setShowForceChange] = useState(false);
  
  const { signIn, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clear any existing non-admin session before retrying
      if (errorMessage) {
        await signOut();
      }

      const result = await signIn(email, password);

      if (result.success) {
        // Check if user must change password
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('must_change_password')
            .eq('user_id', user.id)
            .single();

          if (profile?.must_change_password) {
            setShowForceChange(true);
            return;
          }
        }

        toast.success('Welcome back!', {
          description: 'You have been signed in successfully.',
        });
      } else {
        toast.error('Error', {
          description: result.error || 'Authentication failed',
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChanged = () => {
    setShowForceChange(false);
    toast.success('Welcome!', {
      description: 'Your password has been updated. You are now signed in.',
    });
  };

  const displayError = errorMessage || '';

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <Card className="bg-white/[0.08] backdrop-blur-2xl border-white/[0.12] shadow-2xl shadow-black/20">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <img 
                  src={`${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/storage/v1/object/public/avatars/website/logo.png`} 
                  alt="HostOnce Logo" 
                  className="h-12 w-36 object-contain rounded-md relative z-10"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const cloudUrl = 'https://hkfjyktrgcxkxzdxxatx.supabase.co/storage/v1/object/public/avatars/website/logo.png';
                    if (!target.dataset.retried) {
                      target.dataset.retried = 'true';
                      target.src = cloudUrl;
                    } else {
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }
                  }}
                />
                <div className="hidden h-12 w-36 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-lg">
                  H
                </div>
              </div>
            </div>
            <CardTitle className="text-white text-xl">Admin Access</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to access the HostOnce admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                {displayError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/[0.06] border-white/[0.1] text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <ForcePasswordChange
        open={showForceChange}
        onPasswordChanged={handlePasswordChanged}
      />
    </div>
  );
};

export default AdminLogin;
