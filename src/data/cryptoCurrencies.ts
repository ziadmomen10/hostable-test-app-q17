export interface CryptoCurrency {
  code: string;
  name: string;
  symbol: string;
  binanceSymbol: string;
  category: 'layer1' | 'stablecoin' | 'defi' | 'meme' | 'layer2' | 'exchange' | 'other';
}

export const CRYPTO_CURRENCIES: CryptoCurrency[] = [
  // Layer 1 Blockchains
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', binanceSymbol: 'BTCUSDT', category: 'layer1' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', binanceSymbol: 'ETHUSDT', category: 'layer1' },
  { code: 'SOL', name: 'Solana', symbol: 'SOL', binanceSymbol: 'SOLUSDT', category: 'layer1' },
  { code: 'ADA', name: 'Cardano', symbol: 'ADA', binanceSymbol: 'ADAUSDT', category: 'layer1' },
  { code: 'AVAX', name: 'Avalanche', symbol: 'AVAX', binanceSymbol: 'AVAXUSDT', category: 'layer1' },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT', binanceSymbol: 'DOTUSDT', category: 'layer1' },
  { code: 'ATOM', name: 'Cosmos', symbol: 'ATOM', binanceSymbol: 'ATOMUSDT', category: 'layer1' },
  { code: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', binanceSymbol: 'NEARUSDT', category: 'layer1' },
  { code: 'APT', name: 'Aptos', symbol: 'APT', binanceSymbol: 'APTUSDT', category: 'layer1' },
  { code: 'SUI', name: 'Sui', symbol: 'SUI', binanceSymbol: 'SUIUSDT', category: 'layer1' },
  { code: 'FTM', name: 'Fantom', symbol: 'FTM', binanceSymbol: 'FTMUSDT', category: 'layer1' },
  { code: 'ALGO', name: 'Algorand', symbol: 'ALGO', binanceSymbol: 'ALGOUSDT', category: 'layer1' },
  { code: 'XLM', name: 'Stellar', symbol: 'XLM', binanceSymbol: 'XLMUSDT', category: 'layer1' },
  { code: 'XRP', name: 'Ripple', symbol: 'XRP', binanceSymbol: 'XRPUSDT', category: 'layer1' },
  { code: 'TRX', name: 'Tron', symbol: 'TRX', binanceSymbol: 'TRXUSDT', category: 'layer1' },
  { code: 'TON', name: 'Toncoin', symbol: 'TON', binanceSymbol: 'TONUSDT', category: 'layer1' },
  { code: 'LTC', name: 'Litecoin', symbol: 'Ł', binanceSymbol: 'LTCUSDT', category: 'layer1' },
  { code: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH', binanceSymbol: 'BCHUSDT', category: 'layer1' },
  { code: 'ETC', name: 'Ethereum Classic', symbol: 'ETC', binanceSymbol: 'ETCUSDT', category: 'layer1' },
  { code: 'XMR', name: 'Monero', symbol: 'XMR', binanceSymbol: 'XMRUSDT', category: 'layer1' },
  { code: 'HBAR', name: 'Hedera', symbol: 'HBAR', binanceSymbol: 'HBARUSDT', category: 'layer1' },
  { code: 'ICP', name: 'Internet Computer', symbol: 'ICP', binanceSymbol: 'ICPUSDT', category: 'layer1' },
  { code: 'FIL', name: 'Filecoin', symbol: 'FIL', binanceSymbol: 'FILUSDT', category: 'layer1' },
  { code: 'VET', name: 'VeChain', symbol: 'VET', binanceSymbol: 'VETUSDT', category: 'layer1' },
  { code: 'EGLD', name: 'MultiversX', symbol: 'EGLD', binanceSymbol: 'EGLDUSDT', category: 'layer1' },

  // Stablecoins
  { code: 'USDT', name: 'Tether', symbol: '₮', binanceSymbol: 'USDCUSDT', category: 'stablecoin' },
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC', binanceSymbol: 'USDCUSDT', category: 'stablecoin' },
  { code: 'DAI', name: 'Dai', symbol: 'DAI', binanceSymbol: 'DAIUSDT', category: 'stablecoin' },
  { code: 'TUSD', name: 'TrueUSD', symbol: 'TUSD', binanceSymbol: 'TUSDUSDT', category: 'stablecoin' },
  { code: 'FDUSD', name: 'First Digital USD', symbol: 'FDUSD', binanceSymbol: 'FDUSDUSDT', category: 'stablecoin' },

  // Layer 2 Solutions
  { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', binanceSymbol: 'MATICUSDT', category: 'layer2' },
  { code: 'ARB', name: 'Arbitrum', symbol: 'ARB', binanceSymbol: 'ARBUSDT', category: 'layer2' },
  { code: 'OP', name: 'Optimism', symbol: 'OP', binanceSymbol: 'OPUSDT', category: 'layer2' },
  { code: 'IMX', name: 'Immutable X', symbol: 'IMX', binanceSymbol: 'IMXUSDT', category: 'layer2' },
  { code: 'MANTA', name: 'Manta Network', symbol: 'MANTA', binanceSymbol: 'MANTAUSDT', category: 'layer2' },
  { code: 'STRK', name: 'Starknet', symbol: 'STRK', binanceSymbol: 'STRKUSDT', category: 'layer2' },

  // DeFi Tokens
  { code: 'LINK', name: 'Chainlink', symbol: 'LINK', binanceSymbol: 'LINKUSDT', category: 'defi' },
  { code: 'UNI', name: 'Uniswap', symbol: 'UNI', binanceSymbol: 'UNIUSDT', category: 'defi' },
  { code: 'AAVE', name: 'Aave', symbol: 'AAVE', binanceSymbol: 'AAVEUSDT', category: 'defi' },
  { code: 'MKR', name: 'Maker', symbol: 'MKR', binanceSymbol: 'MKRUSDT', category: 'defi' },
  { code: 'CRV', name: 'Curve DAO', symbol: 'CRV', binanceSymbol: 'CRVUSDT', category: 'defi' },
  { code: 'LDO', name: 'Lido DAO', symbol: 'LDO', binanceSymbol: 'LDOUSDT', category: 'defi' },
  { code: 'SNX', name: 'Synthetix', symbol: 'SNX', binanceSymbol: 'SNXUSDT', category: 'defi' },
  { code: 'COMP', name: 'Compound', symbol: 'COMP', binanceSymbol: 'COMPUSDT', category: 'defi' },
  { code: 'SUSHI', name: 'SushiSwap', symbol: 'SUSHI', binanceSymbol: 'SUSHIUSDT', category: 'defi' },
  { code: 'DYDX', name: 'dYdX', symbol: 'DYDX', binanceSymbol: 'DYDXUSDT', category: 'defi' },
  { code: 'INJ', name: 'Injective', symbol: 'INJ', binanceSymbol: 'INJUSDT', category: 'defi' },
  { code: 'PENDLE', name: 'Pendle', symbol: 'PENDLE', binanceSymbol: 'PENDLEUSDT', category: 'defi' },
  { code: 'JUP', name: 'Jupiter', symbol: 'JUP', binanceSymbol: 'JUPUSDT', category: 'defi' },

  // Exchange Tokens
  { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', binanceSymbol: 'BNBUSDT', category: 'exchange' },
  { code: 'OKB', name: 'OKB', symbol: 'OKB', binanceSymbol: 'OKBUSDT', category: 'exchange' },
  { code: 'CRO', name: 'Cronos', symbol: 'CRO', binanceSymbol: 'CROUSDT', category: 'exchange' },
  { code: 'LEO', name: 'UNUS SED LEO', symbol: 'LEO', binanceSymbol: 'LEOUSDT', category: 'exchange' },

  // Meme Coins
  { code: 'DOGE', name: 'Dogecoin', symbol: 'Ð', binanceSymbol: 'DOGEUSDT', category: 'meme' },
  { code: 'SHIB', name: 'Shiba Inu', symbol: 'SHIB', binanceSymbol: 'SHIBUSDT', category: 'meme' },
  { code: 'PEPE', name: 'Pepe', symbol: 'PEPE', binanceSymbol: 'PEPEUSDT', category: 'meme' },
  { code: 'FLOKI', name: 'Floki', symbol: 'FLOKI', binanceSymbol: 'FLOKIUSDT', category: 'meme' },
  { code: 'BONK', name: 'Bonk', symbol: 'BONK', binanceSymbol: 'BONKUSDT', category: 'meme' },
  { code: 'WIF', name: 'dogwifhat', symbol: 'WIF', binanceSymbol: 'WIFUSDT', category: 'meme' },

  // Other Notable Tokens
  { code: 'RENDER', name: 'Render', symbol: 'RENDER', binanceSymbol: 'RENDERUSDT', category: 'other' },
  { code: 'GRT', name: 'The Graph', symbol: 'GRT', binanceSymbol: 'GRTUSDT', category: 'other' },
  { code: 'FET', name: 'Fetch.ai', symbol: 'FET', binanceSymbol: 'FETUSDT', category: 'other' },
  { code: 'SAND', name: 'The Sandbox', symbol: 'SAND', binanceSymbol: 'SANDUSDT', category: 'other' },
  { code: 'MANA', name: 'Decentraland', symbol: 'MANA', binanceSymbol: 'MANAUSDT', category: 'other' },
  { code: 'AXS', name: 'Axie Infinity', symbol: 'AXS', binanceSymbol: 'AXSUSDT', category: 'other' },
  { code: 'APE', name: 'ApeCoin', symbol: 'APE', binanceSymbol: 'APEUSDT', category: 'other' },
  { code: 'ENS', name: 'Ethereum Name Service', symbol: 'ENS', binanceSymbol: 'ENSUSDT', category: 'other' },
  { code: 'RNDR', name: 'Render Token', symbol: 'RNDR', binanceSymbol: 'RNDRUSDT', category: 'other' },
  { code: 'GALA', name: 'Gala', symbol: 'GALA', binanceSymbol: 'GALAUSDT', category: 'other' },
  { code: 'CHZ', name: 'Chiliz', symbol: 'CHZ', binanceSymbol: 'CHZUSDT', category: 'other' },
  { code: 'THETA', name: 'Theta Network', symbol: 'THETA', binanceSymbol: 'THETAUSDT', category: 'other' },
  { code: 'FLOW', name: 'Flow', symbol: 'FLOW', binanceSymbol: 'FLOWUSDT', category: 'other' },
  { code: 'KCS', name: 'KuCoin Token', symbol: 'KCS', binanceSymbol: 'KCSUSDT', category: 'other' },
  { code: 'NEO', name: 'Neo', symbol: 'NEO', binanceSymbol: 'NEOUSDT', category: 'other' },
  { code: 'KAVA', name: 'Kava', symbol: 'KAVA', binanceSymbol: 'KAVAUSDT', category: 'other' },
  { code: 'CFX', name: 'Conflux', symbol: 'CFX', binanceSymbol: 'CFXUSDT', category: 'other' },
  { code: 'ROSE', name: 'Oasis Network', symbol: 'ROSE', binanceSymbol: 'ROSEUSDT', category: 'other' },
  { code: 'ZIL', name: 'Zilliqa', symbol: 'ZIL', binanceSymbol: 'ZILUSDT', category: 'other' },
  { code: 'IOTA', name: 'IOTA', symbol: 'IOTA', binanceSymbol: 'IOTAUSDT', category: 'other' },
];

// Grouped by category for bulk add
export const CRYPTO_CATEGORIES = {
  layer1: CRYPTO_CURRENCIES.filter(c => c.category === 'layer1'),
  layer2: CRYPTO_CURRENCIES.filter(c => c.category === 'layer2'),
  stablecoin: CRYPTO_CURRENCIES.filter(c => c.category === 'stablecoin'),
  defi: CRYPTO_CURRENCIES.filter(c => c.category === 'defi'),
  exchange: CRYPTO_CURRENCIES.filter(c => c.category === 'exchange'),
  meme: CRYPTO_CURRENCIES.filter(c => c.category === 'meme'),
  other: CRYPTO_CURRENCIES.filter(c => c.category === 'other'),
};

// Top 10 by market cap for quick add
export const TOP_CRYPTOS = ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 'DOGE', 'TRX'];

export const getCryptoByCode = (code: string): CryptoCurrency | undefined => {
  return CRYPTO_CURRENCIES.find(c => c.code === code);
};

export const getCategoryLabel = (category: CryptoCurrency['category']): string => {
  const labels: Record<CryptoCurrency['category'], string> = {
    layer1: 'Layer 1',
    layer2: 'Layer 2',
    stablecoin: 'Stablecoin',
    defi: 'DeFi',
    exchange: 'Exchange',
    meme: 'Meme',
    other: 'Other',
  };
  return labels[category];
};

export const getCategoryColor = (category: CryptoCurrency['category']): string => {
  const colors: Record<CryptoCurrency['category'], string> = {
    layer1: 'bg-blue-500/10 text-blue-500',
    layer2: 'bg-purple-500/10 text-purple-500',
    stablecoin: 'bg-green-500/10 text-green-500',
    defi: 'bg-orange-500/10 text-orange-500',
    exchange: 'bg-yellow-500/10 text-yellow-500',
    meme: 'bg-pink-500/10 text-pink-500',
    other: 'bg-gray-500/10 text-gray-500',
  };
  return colors[category];
};
