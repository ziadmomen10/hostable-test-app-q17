import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus, X, Copy, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useRoleDefinitions } from '@/hooks/useRoleDefinitions';

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

interface AddAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddAdminForm: React.FC<AddAdminFormProps> = ({ onSuccess, onCancel }) => {
  const { roles: roleDefinitions, loading: rolesLoading } = useRoleDefinitions();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: generatePassword(),
    gender: 'male' as 'male' | 'female'
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleChange = (roleValue: string, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, roleValue]);
    } else {
      setSelectedRoles(selectedRoles.filter(role => role !== roleValue));
    }
  };

  const handleCopyCredentials = async () => {
    if (!createdUser) return;
    try {
      const text = `Email: ${createdUser.email}\nTemporary Password: ${createdUser.password}\n\nPlease sign in and change your password on first login.`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Credentials copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy credentials');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Username, email, and password are required.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error('At least one role must be selected.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: {
          email: formData.email,
          username: formData.username,
          gender: formData.gender,
          roles: selectedRoles,
          password: formData.password,
        },
      });

      if (error) {
        const message = data?.error || error.message || 'Failed to create user.';
        toast.error(message);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setCreatedUser({ email: formData.email, password: formData.password });
      toast.success(`User "${formData.email}" created successfully!`);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(error.message || 'Failed to create admin user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {createdUser ? 'User Created' : 'Create New Admin'}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="absolute top-4 right-4 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {createdUser ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 space-y-3">
              <p className="text-sm font-medium text-green-400">✅ User created successfully</p>
              <p className="text-xs text-muted-foreground">
                Share these credentials with the user. They will be required to change their password on first login.
              </p>
              <div className="space-y-2 bg-white/[0.04] rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-sm font-mono">{createdUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Temporary Password</span>
                  <span className="text-sm font-mono">{createdUser.password}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyCredentials} variant="outline" className="flex-1">
                {copied ? <Check className="h-4 w-4 mr-2 text-green-400" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
              <Button onClick={onCancel} className="flex-1">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                required
                className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
                className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15]"
              />
            </div>

            <div>
              <Label htmlFor="password">Temporary Password *</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter temporary password"
                    required
                    minLength={6}
                    className="bg-white/[0.04] border-white/[0.08] focus:border-white/[0.15] pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData({ ...formData, password: generatePassword() })}
                  className="h-10 px-3"
                  title="Generate random password"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">User will be forced to change this on first login.</p>
            </div>

            <div>
              <Label className="text-base font-medium">Gender *</Label>
              <div className="flex items-center space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="male"
                    checked={formData.gender === 'male'}
                    onCheckedChange={(checked) => {
                      if (checked) setFormData({ ...formData, gender: 'male' });
                    }}
                  />
                  <Label htmlFor="male" className="text-sm font-normal cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="female"
                    checked={formData.gender === 'female'}
                    onCheckedChange={(checked) => {
                      if (checked) setFormData({ ...formData, gender: 'female' });
                    }}
                  />
                  <Label htmlFor="female" className="text-sm font-normal cursor-pointer">Female</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Roles *</Label>
              <div className="space-y-2 mt-2">
                {roleDefinitions.map((role) => (
                  <div key={role.role_key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-role-${role.role_key}`}
                      checked={selectedRoles.includes(role.role_key)}
                      onCheckedChange={(checked) => handleRoleChange(role.role_key, checked as boolean)}
                    />
                    <Label htmlFor={`add-role-${role.role_key}`} className="text-sm font-normal cursor-pointer">
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Creating User...' : 'Create User'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddAdminForm;
