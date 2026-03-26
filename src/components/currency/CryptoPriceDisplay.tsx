import React from 'react';
import { Loader2, TrendingUp, TrendingDown, Minus, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CryptoPrice, PriceChange } from '@/hooks/useCryptoRealtimePrices';
import { Button } from '@/components/ui/button';

interface CryptoPriceDisplayProps {
  currencyCode: string;
  price?: CryptoPrice;
  loading?: boolean;
  change?: PriceChange;
  isConnected: boolean;
}

export const CryptoPriceDisplay: React.FC<CryptoPriceDisplayProps> = ({
  currencyCode,
  price,
  loading = false,
  change,
  isConnected,
}) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">Disconnected</span>
      </div>
    );
  }

  if (!price) {
    return (
      <div className="text-muted-foreground text-sm">
        Waiting for data...
      </div>
    );
  }

  const formatPrice = (p: number): string => {
    if (p >= 1000) {
      return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (p >= 1) {
      return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    } else if (p >= 0.0001) {
      return `$${p.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`;
    } else {
      return `$${p.toFixed(8)}`;
    }
  };

  const changeDirection = change?.direction || 'unchanged';
  const isUp = changeDirection === 'up';
  const isDown = changeDirection === 'down';

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
        <span
          className={cn(
            'font-mono font-semibold transition-colors duration-300',
            isUp && 'text-green-500',
            isDown && 'text-red-500',
            !isUp && !isDown && 'text-foreground'
          )}
        >
          {formatPrice(price.price)}
        </span>
        {isUp && <TrendingUp className="h-4 w-4 text-green-500 animate-pulse" />}
        {isDown && <TrendingDown className="h-4 w-4 text-red-500 animate-pulse" />}
        {!isUp && !isDown && <Minus className="h-3 w-3 text-muted-foreground" />}
      </div>
      
      {/* Live indicator */}
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </div>
    </div>
  );
};

interface CryptoChangeDisplayProps {
  change24h?: number;
}

export const CryptoChangeDisplay: React.FC<CryptoChangeDisplayProps> = ({ change24h }) => {
  if (change24h === undefined) {
    return <span className="text-muted-foreground text-sm">-</span>;
  }

  const isPositive = change24h >= 0;
  const formatted = `${isPositive ? '+' : ''}${change24h.toFixed(2)}%`;

  return (
    <span
      className={cn(
        'font-mono text-sm font-medium',
        isPositive ? 'text-green-500' : 'text-red-500'
      )}
    >
      {formatted}
    </span>
  );
};

interface CryptoConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  lastUpdated: string;
  cryptoCount: number;
  onReconnect: () => void;
}

export const CryptoConnectionStatus: React.FC<CryptoConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  lastUpdated,
  cryptoCount,
  onReconnect,
}) => {
  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        {isConnected ? (
          <>
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </div>
            <span className="text-green-600 dark:text-green-400 font-medium">Live (Binance)</span>
          </>
        ) : isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
            <span className="text-yellow-600 dark:text-yellow-400">Connecting...</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span className="text-red-600 dark:text-red-400">Disconnected</span>
            <Button variant="ghost" size="sm" onClick={onReconnect} className="h-6 px-2">
              Reconnect
            </Button>
          </>
        )}
      </div>
      
      <span className="text-muted-foreground">•</span>
      
      <span className="text-muted-foreground">
        1s updates
      </span>
      
      <span className="text-muted-foreground">•</span>
      
      <span className="text-muted-foreground">
        {cryptoCount} cryptos tracked
      </span>
      
      {lastUpdated !== 'Never' && (
        <>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Last: {lastUpdated}
          </span>
        </>
      )}
    </div>
  );
};
