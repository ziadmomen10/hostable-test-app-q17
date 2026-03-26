import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Home, Users, FileText, DollarSign, Package, Search,
  Settings, BookOpen, Zap, Download,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/a93jf02kd92ms71x8qp4', icon: Home },
  { label: 'User Management', path: '/a93jf02kd92ms71x8qp4/users', icon: Users },
  { label: 'Manage Pages', path: '/a93jf02kd92ms71x8qp4/pages', icon: FileText },
  { label: 'Manage Currencies', path: '/a93jf02kd92ms71x8qp4/currencies', icon: DollarSign },
  { label: 'Manage Packages', path: '/a93jf02kd92ms71x8qp4/packages', icon: Package },
  { label: 'SEO Studio', path: '/a93jf02kd92ms71x8qp4/seo', icon: Search },
  { label: 'System Settings', path: '/a93jf02kd92ms71x8qp4/settings', icon: Settings },
  { label: 'Documentation', path: '/a93jf02kd92ms71x8qp4/documentation', icon: BookOpen },
];

const QUICK_ACTIONS = [
  { label: 'Create New Page', path: '/a93jf02kd92ms71x8qp4/pages', icon: FileText },
  { label: 'View SEO Tasks', path: '/a93jf02kd92ms71x8qp4/seo', icon: Zap },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {NAV_ITEMS.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => handleSelect(item.path)}
              className="gap-2"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          {QUICK_ACTIONS.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => handleSelect(item.path)}
              className="gap-2"
            >
              <item.icon className="h-4 w-4 text-muted-foreground" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
