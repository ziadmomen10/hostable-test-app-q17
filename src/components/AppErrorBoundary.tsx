import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

function isChunkLoadError(error: Error): boolean {
  const message = error.message || '';
  return (
    error.name === 'ChunkLoadError' ||
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('Loading chunk') ||
    message.includes('Loading CSS chunk') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('Importing a module script failed')
  );
}

const RELOAD_KEY = 'app_chunk_error_reload';

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isChunkError: isChunkLoadError(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary]', error, errorInfo);

    if (isChunkLoadError(error)) {
      const lastReload = sessionStorage.getItem(RELOAD_KEY);
      const now = Date.now();

      // Auto-reload once if we haven't reloaded in the last 30 seconds
      if (!lastReload || now - parseInt(lastReload, 10) > 30000) {
        sessionStorage.setItem(RELOAD_KEY, String(now));
        window.location.reload();
        return;
      }
    }
  }

  handleReload = () => {
    sessionStorage.removeItem(RELOAD_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#fafafa',
          color: '#1a1a1a',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: this.state.isChunkError ? '#fef3c7' : '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            fontSize: '24px',
          }}>
            {this.state.isChunkError ? '⚡' : '⚠️'}
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem' }}>
            {this.state.isChunkError
              ? 'Connection interrupted'
              : 'Something went wrong'}
          </h1>
          <p style={{ color: '#6b7280', maxWidth: '400px', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
            {this.state.isChunkError
              ? 'The page failed to load due to a network interruption. Please check your connection and try again.'
              : 'An unexpected error occurred. Please reload the page to continue.'}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.625rem 1.5rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
