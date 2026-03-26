import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Shield, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';
import type { RoleDefinition } from '@/hooks/useRoleDefinitions';

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('role_definitions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setRoles(data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
      toast.error('Failed to load role definitions.');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = (id: string, field: keyof RoleDefinition, value: any) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const role of roles) {
        const { error } = await (supabase as any)
          .from('role_definitions')
          .update({
            label: role.label,
            description: role.description,
            grants_admin_access: role.grants_admin_access,
            is_active: role.is_active,
            sort_order: role.sort_order,
          })
          .eq('id', role.id);
        if (error) throw error;
      }
      toast.success('Role definitions saved successfully.');
      setDirty(false);
    } catch (err) {
      console.error('Error saving roles:', err);
      toast.error('Failed to save role definitions.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminSectionHeader
        title="Role Management"
        subtitle="Configure available roles, labels, and admin access permissions"
      />

      <div className="flex justify-end mb-4">
        <Button onClick={handleSave} disabled={!dirty || saving}>
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className="bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Role Key</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Display Label</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Description</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Admin Access</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Active</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Order</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <code className="text-sm font-mono bg-white/[0.06] px-2 py-0.5 rounded">{role.role_key}</code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          value={role.label}
                          onChange={(e) => updateRole(role.id, 'label', e.target.value)}
                          className="h-8 bg-white/[0.04] border-white/[0.08] text-sm max-w-[200px]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          value={role.description || ''}
                          onChange={(e) => updateRole(role.id, 'description', e.target.value || null)}
                          placeholder="Optional description..."
                          className="h-8 bg-white/[0.04] border-white/[0.08] text-sm max-w-[250px]"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={role.grants_admin_access}
                          onCheckedChange={(checked) => updateRole(role.id, 'grants_admin_access', checked)}
                          disabled={role.role_key === 'admin'} // Can't remove admin access from admin role
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={role.is_active}
                          onCheckedChange={(checked) => updateRole(role.id, 'is_active', checked)}
                          disabled={role.role_key === 'admin'} // Can't deactivate admin role
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Input
                          type="number"
                          value={role.sort_order}
                          onChange={(e) => updateRole(role.id, 'sort_order', parseInt(e.target.value) || 0)}
                          className="h-8 w-16 bg-white/[0.04] border-white/[0.08] text-sm text-center mx-auto"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/[0.02] backdrop-blur-xl border-white/[0.06] rounded-2xl mt-4">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> Role keys are defined as database enum values and cannot be added or removed from this UI. 
            To add new role types, a database migration is required. You can control which roles are visible in user forms 
            by toggling the "Active" switch, and which roles grant admin panel access via the "Admin Access" toggle.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default RoleManagement;
