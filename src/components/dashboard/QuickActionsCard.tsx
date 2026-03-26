import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Globe, Users, Zap } from 'lucide-react';

const QuickActionsCard: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Create New Page', icon: Plus, path: '/a93jf02kd92ms71x8qp4/pages' },
    { label: 'Start SEO Audit', icon: Search, path: '/a93jf02kd92ms71x8qp4/seo' },
    { label: 'Add Translation', icon: Globe, path: '/a93jf02kd92ms71x8qp4/pages' },
    { label: 'Manage Users', icon: Users, path: '/a93jf02kd92ms71x8qp4/users' },
  ];

  return (
    <Card className="h-full dark:bg-white/[0.03] bg-card border-border rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Zap className="h-4 w-4 text-primary" strokeWidth={1.75} /> Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                className="justify-start gap-2 h-10 text-sm"
                onClick={() => navigate(action.path)}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                {action.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
