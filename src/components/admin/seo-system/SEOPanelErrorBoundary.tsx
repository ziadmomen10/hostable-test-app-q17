/**
 * SEOPanelErrorBoundary
 * 
 * Error boundary to prevent individual panel failures from
 * crashing the entire SEO Studio.
 * 
 * Gap A3: Panel Error Boundaries
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SEOPanelErrorBoundaryProps {
  children: ReactNode;
  panelName: string;
  onReset?: () => void;
}

interface SEOPanelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SEOPanelErrorBoundary extends Component<
  SEOPanelErrorBoundaryProps,
  SEOPanelErrorBoundaryState
> {
  constructor(props: SEOPanelErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SEOPanelErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`[${this.props.panelName}] Error caught by boundary:`, error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-4 text-center space-y-3 min-h-[100px]">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {this.props.panelName} encountered an error
            </p>
            <p className="text-xs text-muted-foreground max-w-[200px]">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={this.handleReset}
            className="gap-1.5"
          >
            <RefreshCw className="h-3 w-3" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
