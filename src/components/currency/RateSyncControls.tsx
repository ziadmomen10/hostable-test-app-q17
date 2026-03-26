import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  Globe2, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface SyncResult {
  success: boolean;
  fiatUpdated?: number;
  cryptoUpdated?: number;
  error?: string;
}

interface RateSyncControlsProps {
  onSyncComplete?: () => void;
}

const RateSyncControls: React.FC<RateSyncControlsProps> = ({ onSyncComplete }) => {
  const [lastFiatSync, setLastFiatSync] = useState<Date | null>(null);
  const [lastCryptoSync, setLastCryptoSync] = useState<Date | null>(null);
  const [syncingFiat, setSyncingFiat] = useState(false);
  const [syncingCrypto, setSyncingCrypto] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    fetchLastSyncTimes();
  }, []);

  const fetchLastSyncTimes = async () => {
    try {
      // Get last fiat sync time
      const { data: fiatData } = await supabase
        .from('currencies')
        .select('rate_updated_at')
        .not('code', 'in', '(BTC,ETH,BNB,XRP,ADA,SOL,DOGE,DOT,MATIC,LTC,SHIB,TRX,AVAX,LINK,ATOM,XMR,ETC,BCH,XLM,ALGO,FIL,VET,NEAR,ICP,HBAR,QNT,GRT,AAVE,EOS,THETA,XTZ,MKR,SNX,ZEC,NEO,BTT,DASH,MANA,SAND,AXS,CHZ,ENJ,FTM,FLOW,KLAY,WAVES,LRC,KSM,COMP)')
        .not('rate_updated_at', 'is', null)
        .order('rate_updated_at', { ascending: false })
        .limit(1);

      if (fiatData?.[0]?.rate_updated_at) {
        setLastFiatSync(new Date(fiatData[0].rate_updated_at));
      }

      // Get last crypto sync time
      const { data: cryptoData } = await supabase
        .from('currencies')
        .select('rate_updated_at')
        .in('code', ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE', 'DOT', 'MATIC', 'LTC'])
        .not('rate_updated_at', 'is', null)
        .order('rate_updated_at', { ascending: false })
        .limit(1);

      if (cryptoData?.[0]?.rate_updated_at) {
        setLastCryptoSync(new Date(cryptoData[0].rate_updated_at));
      }
    } catch (error) {
      console.error('Error fetching last sync times:', error);
    }
  };

  const syncRates = async (type: 'fiat' | 'crypto' | 'both') => {
    const setLoading = type === 'fiat' ? setSyncingFiat : type === 'crypto' ? setSyncingCrypto : setSyncingAll;
    setLoading(true);
    setLastSyncResult(null);

    try {
      // Build the URL with query params
      const baseUrl = `${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/functions/v1/sync-exchange-rates`;
      const url = type === 'both' ? baseUrl : `${baseUrl}?type=${type}`;

      const { data, error } = await supabase.functions.invoke('sync-exchange-rates', {
        body: { type },
      });

      if (error) throw error;

      const result: SyncResult = {
        success: true,
        fiatUpdated: data?.results?.fiat?.updated ?? data?.fiatUpdated ?? 0,
        cryptoUpdated: data?.results?.crypto?.updated ?? data?.cryptoUpdated ?? 0,
      };

      setLastSyncResult(result);

      const totalUpdated = (result.fiatUpdated || 0) + (result.cryptoUpdated || 0);
      toast.success(`Synced ${totalUpdated} exchange rates successfully`);

      // Refresh last sync times
      await fetchLastSyncTimes();
      
      // Notify parent
      onSyncComplete?.();
    } catch (error) {
      console.error('Error syncing rates:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLastSyncResult({ success: false, error: errorMessage });
      toast.error(`Failed to sync rates: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const isAnySyncing = syncingFiat || syncingCrypto || syncingAll;

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Exchange Rate Sync
          </CardTitle>
          {lastSyncResult && (
            <Badge variant={lastSyncResult.success ? "default" : "destructive"} className="gap-1">
              {lastSyncResult.success ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Synced
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Failed
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Sync Times */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Fiat:</span>
            <span className="font-medium">{formatTimeAgo(lastFiatSync)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Crypto:</span>
            <span className="font-medium">{formatTimeAgo(lastCryptoSync)}</span>
          </div>
        </div>

        {/* Sync Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncRates('fiat')}
            disabled={isAnySyncing}
          >
            {syncingFiat ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Globe2 className="h-4 w-4 mr-2" />
            )}
            Sync Fiat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => syncRates('crypto')}
            disabled={isAnySyncing}
          >
            {syncingCrypto ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Coins className="h-4 w-4 mr-2" />
            )}
            Sync Crypto
          </Button>
          <Button
            size="sm"
            onClick={() => syncRates('both')}
            disabled={isAnySyncing}
          >
            {syncingAll ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Sync All
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground">
          Fiat rates from aggregator APIs • Crypto rates from Binance API • Rates cached in database for live pages
        </p>
      </CardContent>
    </Card>
  );
};

export default RateSyncControls;
