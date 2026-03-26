import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus, Wifi, WifiOff } from 'lucide-react';

interface ExchangeRateDisplayProps {
  currencyCode: string;
  rate: number | undefined;
  loading: boolean;
  change?: 'up' | 'down' | 'unchanged';
  isConnected?: boolean;
}

export const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({
  currencyCode,
  rate,
  loading,
  change = 'unchanged',
  isConnected = true,
}) => {
  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
  }

  if (currencyCode === 'USD') {
    return <span className="text-muted-foreground">Base currency</span>;
  }

  if (!rate) {
    return <span className="text-muted-foreground">N/A</span>;
  }

  const getChangeIcon = () => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground opacity-50" />;
    }
  };

  const getChangeClass = () => {
    switch (change) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className={`font-mono font-medium transition-colors duration-300 ${getChangeClass()}`}>
          1 USD = {rate.toFixed(4)} {currencyCode}
        </span>
        {getChangeIcon()}
        {isConnected && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        1 {currencyCode} = {(1 / rate).toFixed(4)} USD
      </span>
    </div>
  );
};

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  lastUpdated: string | null;
  onReconnect?: () => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  lastUpdated,
  onReconnect,
}) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      {isConnecting ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Connecting...</span>
        </>
      ) : isConnected ? (
        <>
          <Wifi className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-600">Live</span>
          {lastUpdated && (
            <span className="text-muted-foreground">• Updated {lastUpdated}</span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5 text-red-500" />
          <span className="text-red-600">Disconnected</span>
          {onReconnect && (
            <button
              onClick={onReconnect}
              className="text-primary hover:underline ml-1"
            >
              Reconnect
            </button>
          )}
        </>
      )}
    </div>
  );
};

interface CurrencyBadgeProps {
  code: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export const CurrencyBadge: React.FC<CurrencyBadgeProps> = ({
  code,
  isDefault,
  isActive = true,
}) => {
  return (
    <div className="flex items-center gap-2">
      {isDefault && (
        <Badge variant="default" className="text-xs">
          Default
        </Badge>
      )}
      <Badge 
        variant={isActive ? "default" : "secondary"}
        className="text-xs"
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
};
