import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertCircle, UserPlus, Trash2, RefreshCw, KeyRound, Users
} from 'lucide-react';
import { toast } from 'sonner';
import AddAdminForm from './AddAdminForm';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';
import UserTable from '@/components/admin/users/UserTable';
import UserDetailPanel from '@/components/admin/users/UserDetailPanel';
import DeleteUserDialog from '@/components/admin/users/DeleteUserDialog';
import EditUserDialog from '@/components/admin/users/EditUserDialog';
import ResetPasswordDialog from '@/components/admin/users/ResetPasswordDialog';
import BulkActionsBar from '@/components/admin/users/BulkActionsBar';
import UserTableSkeleton from '@/components/admin/users/UserTableSkeleton';
import { useRoleDefinitions } from '@/hooks/useRoleDefinitions';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  gender: 'male' | 'female';
  roles: string[];
  last_login: string | null;
  profile_picture_url: string | null;
  created_at: string;
  updated_at: string;
  must_change_password: boolean;
}

export type SortField = 'username' | 'created_at' | 'last_login';
export type SortDirection = 'asc' | 'desc';

const UserManagement: React.FC = () => {
  const { adminRoleKeys } = useRoleDefinitions();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) console.error('Error fetching user_roles:', rolesError);

      const rolesMap = new Map<string, string[]>();
      (userRoles || []).forEach(ur => {
        const existing = rolesMap.get(ur.user_id) || [];
        rolesMap.set(ur.user_id, [...existing, ur.role]);
      });

      const adminUsers = (profiles || [])
        .map(user => ({
          ...user,
          gender: (user.gender as 'male' | 'female') || 'male',
          roles: rolesMap.get(user.user_id) || [],
          must_change_password: user.must_change_password ?? false,
        }))
        .filter(user => user.roles.some(role => adminRoleKeys.includes(role)));

      setUsers(adminUsers);
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      toast.error('Failed to fetch admin users.');
    } finally {
      setLoading(false);
    }
  };

  // Filtering & sorting
  const filteredAndSortedUsers = useMemo(() => {
    let result = users;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        (u.username || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      let valA: string | null, valB: string | null;
      if (sortField === 'username') {
        valA = a.username?.toLowerCase() || '';
        valB = b.username?.toLowerCase() || '';
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }
      if (!valA && !valB) return 0;
      if (!valA) return 1;
      if (!valB) return -1;
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    return result;
  }, [users, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Selection
  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev);
      next.has(userId) ? next.delete(userId) : next.add(userId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredAndSortedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredAndSortedUsers.map(u => u.user_id)));
    }
  };

  // Delete
  const handleDeleteUser = async (userId: string, username: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user', {
        body: { action: 'delete', userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setUsers(prev => prev.filter(u => u.user_id !== userId));
      setSelectedUsers(prev => { const n = new Set(prev); n.delete(userId); return n; });
      if (selectedUser?.user_id === userId) setSelectedUser(null);
      toast.success(`User "${username}" deleted.`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    const toDelete = Array.from(selectedUsers);
    for (const userId of toDelete) {
      const user = users.find(u => u.user_id === userId);
      await handleDeleteUser(userId, user?.username || 'Unknown');
    }
    setSelectedUsers(new Set());
  };

  if (showAddForm) {
    return (
      <AddAdminForm
        onSuccess={() => { setShowAddForm(false); fetchAdminUsers(); }}
        onCancel={() => setShowAddForm(false)}
      />
    );
  }

  return (
    <>
      <AdminSectionHeader
        title="User Management"
        subtitle={`Manage administrator accounts and permissions${users.length > 0 ? ` · ${users.length} user${users.length !== 1 ? 's' : ''}` : ''}`}
        searchPlaceholder="Search by name or email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showRefresh
        onRefresh={fetchAdminUsers}
        refreshLoading={loading}
        actions={[
          {
            label: 'Add Admin',
            icon: <UserPlus className="h-4 w-4 mr-2" />,
            onClick: () => setShowAddForm(true),
            variant: 'default'
          }
        ]}
      />

      {selectedUsers.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedUsers.size}
          onClearSelection={() => setSelectedUsers(new Set())}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <div className="flex gap-4">
        <Card className="flex-1 bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <UserTableSkeleton />
            ) : filteredAndSortedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-medium mb-1">
                  {searchQuery ? 'No users found' : 'No admin users yet'}
                </p>
                <p className="text-sm text-muted-foreground/70 mb-4">
                  {searchQuery ? 'Try adjusting your search.' : 'Create your first admin user to get started.'}
                </p>
                {!searchQuery && (
                  <Button size="sm" onClick={() => setShowAddForm(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                )}
              </div>
            ) : (
              <UserTable
                users={filteredAndSortedUsers}
                selectedUsers={selectedUsers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onToggleSelect={toggleSelectUser}
                onToggleSelectAll={toggleSelectAll}
                onSelectUser={setSelectedUser}
                onEditUser={(user) => { setUserToEdit(user); setEditDialogOpen(true); }}
                onDeleteUser={(user) => { setUserToDelete(user); setDeleteDialogOpen(true); }}
                onResetPassword={(user) => { setUserToReset(user); setResetPasswordDialogOpen(true); }}
                activeUserId={selectedUser?.user_id}
              />
            )}
          </CardContent>
        </Card>

        {selectedUser && (
          <UserDetailPanel
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onEdit={() => { setUserToEdit(selectedUser); setEditDialogOpen(true); }}
            onDelete={() => { setUserToDelete(selectedUser); setDeleteDialogOpen(true); }}
            onResetPassword={() => { setUserToReset(selectedUser); setResetPasswordDialogOpen(true); }}
          />
        )}
      </div>

      <DeleteUserDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        user={userToDelete}
        onConfirm={handleDeleteUser}
      />

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={userToEdit}
        onSuccess={(updatedUser) => {
          setUsers(prev => prev.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
          if (selectedUser?.user_id === updatedUser.user_id) setSelectedUser(updatedUser);
          setEditDialogOpen(false);
        }}
      />

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        user={userToReset}
      />
    </>
  );
};

export default UserManagement;
