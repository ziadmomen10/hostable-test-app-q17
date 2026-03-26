import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, KeyRound, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import type { UserProfile, SortField, SortDirection } from '@/components/UserManagement';
import UserAvatar from './UserAvatar';

interface UserTableProps {
  users: UserProfile[];
  selectedUsers: Set<string>;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onToggleSelect: (userId: string) => void;
  onToggleSelectAll: () => void;
  onSelectUser: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onDeleteUser: (user: UserProfile) => void;
  onResetPassword: (user: UserProfile) => void;
  activeUserId?: string;
}

const ROLE_MAP: Record<string, string> = {
  admin: 'Admin',
  seo_manager: 'SEO Manager',
  content_writer: 'Content Writer',
  manager: 'Manager',
  user: 'User',
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-500/15 text-red-400 border-red-500/25',
  seo_manager: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
  content_writer: 'bg-green-500/15 text-green-400 border-green-500/25',
  manager: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  user: 'bg-muted text-muted-foreground border-border',
};

const SortIcon: React.FC<{ field: SortField; current: SortField; direction: SortDirection }> = ({ field, current, direction }) => {
  if (field !== current) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
  return direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />;
};

const UserTable: React.FC<UserTableProps> = ({
  users, selectedUsers, sortField, sortDirection, onSort,
  onToggleSelect, onToggleSelectAll, onSelectUser,
  onEditUser, onDeleteUser, onResetPassword, activeUserId,
}) => {
  const allSelected = users.length > 0 && selectedUsers.size === users.length;

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.06] hover:bg-transparent">
          <TableHead className="w-[40px]">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onToggleSelectAll}
              aria-label="Select all"
            />
          </TableHead>
          <TableHead className="w-[220px]">
            <button onClick={() => onSort('username')} className="flex items-center text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors">
              User <SortIcon field="username" current={sortField} direction={sortDirection} />
            </button>
          </TableHead>
          <TableHead>Roles</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <button onClick={() => onSort('created_at')} className="flex items-center text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors">
              Created <SortIcon field="created_at" current={sortField} direction={sortDirection} />
            </button>
          </TableHead>
          <TableHead>
            <button onClick={() => onSort('last_login')} className="flex items-center text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors">
              Last Login <SortIcon field="last_login" current={sortField} direction={sortDirection} />
            </button>
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className={`border-white/[0.04] cursor-pointer transition-colors duration-150 ${activeUserId === user.user_id ? 'bg-primary/5' : 'hover:bg-white/[0.03]'}`}
            onClick={() => onSelectUser(user)}
          >
            <TableCell onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedUsers.has(user.user_id)}
                onCheckedChange={() => onToggleSelect(user.user_id)}
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <UserAvatar username={user.username} role={user.roles[0]} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{user.username || 'Unnamed'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email || 'No email'}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {user.roles.map(role => (
                  <span key={role} className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${ROLE_COLORS[role] || ROLE_COLORS.user}`}>
                    {ROLE_MAP[role] || role}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {user.must_change_password ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  <AlertTriangle className="h-3 w-3" />
                  Temp Password
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/25">
                  Active
                </span>
              )}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(user.created_at), 'MMM d, yyyy')}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {user.last_login
                ? formatDistanceToNow(new Date(user.last_login), { addSuffix: true })
                : <span className="text-muted-foreground/50">Never</span>
              }
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" onClick={() => onResetPassword(user)} className="h-7 w-7 p-0 hover:bg-white/[0.08]" title="Reset Password">
                  <KeyRound className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditUser(user)} className="h-7 w-7 p-0 hover:bg-white/[0.08]" title="Edit">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteUser(user)} className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
