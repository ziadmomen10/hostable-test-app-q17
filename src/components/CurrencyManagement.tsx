import React, { useCallback, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe2, Coins } from 'lucide-react';
import AdminSectionHeader from '@/components/admin/AdminSectionHeader';
import FiatCurrencyManagement from '@/components/currency/FiatCurrencyManagement';
import CryptoManagement from '@/components/currency/CryptoManagement';
import RateSyncControls from '@/components/currency/RateSyncControls';

const CurrencyManagement: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSyncComplete = useCallback(() => {
    // Trigger a refresh of the currency tables
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <AdminSectionHeader
        title="Currency Management"
        subtitle="Manage fiat currencies and cryptocurrencies with real-time exchange rates"
      />

      {/* Rate Sync Controls */}
      <RateSyncControls onSyncComplete={handleSyncComplete} />

      <Tabs defaultValue="fiat" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/[0.04] backdrop-blur-sm border border-white/[0.08]">
          <TabsTrigger value="fiat" className="flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            Fiat Currencies
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Cryptocurrencies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fiat" className="mt-6">
          <FiatCurrencyManagement key={`fiat-${refreshKey}`} />
        </TabsContent>

        <TabsContent value="crypto" className="mt-6">
          <CryptoManagement key={`crypto-${refreshKey}`} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurrencyManagement;
