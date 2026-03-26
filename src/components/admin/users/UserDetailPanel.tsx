import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Edit, Trash2, KeyRound, Calendar, Clock, Mail, User, Shield } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { UserProfile } from '@/components/UserManagement';
import UserAvatar from './UserAvatar';

const ROLE_MAP: Record<string, string> = {
  admin: 'Admin', seo_manager: 'SEO Manager', content_writer: 'Content Writer', manager: 'Manager', user: 'User',
};

interface Props {
  user: UserProfile;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onResetPassword: () => void;
}

const UserDetailPanel: React.FC<Props> = ({ user, onClose, onEdit, onDelete, onResetPassword }) => {
  return (
    <Card className="w-[320px] shrink-0 bg-white/[0.03] backdrop-blur-xl border-white/[0.08] rounded-2xl shadow-xl sticky top-4 self-start">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">User Details</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <UserAvatar username={user.username} role={user.roles[0]} size="md" />
          <h3 className="font-semibold mt-3">{user.username || 'Unnamed'}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.must_change_password && (
            <span className="mt-2 text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full px-2 py-0.5">
              Must Change Password
            </span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 shrink-0" />
            <span>{user.roles.map(r => ROLE_MAP[r] || r).join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 shrink-0" />
            <span className="capitalize">{user.gender}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>Created {format(new Date(user.created_at), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <span>
              {user.last_login
                ? `Last login ${formatDistanceToNow(new Date(user.last_login), { addSuffix: true })}`
                : 'Never logged in'
              }
            </span>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-5 pt-4 space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={onResetPassword}>
            <KeyRound className="h-4 w-4 mr-2" /> Reset Password
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" /> Edit User
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailPanel;
