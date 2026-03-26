// Complete list of world currencies (ISO 4217)
// Includes all major, regional, and lesser-known currencies

export interface WorldCurrency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  region: 'major' | 'europe' | 'asia' | 'americas' | 'africa' | 'oceania' | 'middle_east' | 'crypto';
}

export const WORLD_CURRENCIES: WorldCurrency[] = [
  // Major Currencies (G8)
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', region: 'major' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union', region: 'major' },
  { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom', region: 'major' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan', region: 'major' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland', region: 'major' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada', region: 'major' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia', region: 'major' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand', region: 'major' },

  // European Currencies
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', region: 'europe' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', region: 'europe' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark', region: 'europe' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', country: 'Poland', region: 'europe' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'Czech Republic', region: 'europe' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary', region: 'europe' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'Romania', region: 'europe' },
  { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'Bulgaria', region: 'europe' },
  { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', country: 'Croatia', region: 'europe' },
  { code: 'RSD', name: 'Serbian Dinar', symbol: 'din', country: 'Serbia', region: 'europe' },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', country: 'Ukraine', region: 'europe' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'Russia', region: 'europe' },
  { code: 'BYN', name: 'Belarusian Ruble', symbol: 'Br', country: 'Belarus', region: 'europe' },
  { code: 'MDL', name: 'Moldovan Leu', symbol: 'L', country: 'Moldova', region: 'europe' },
  { code: 'ALL', name: 'Albanian Lek', symbol: 'L', country: 'Albania', region: 'europe' },
  { code: 'MKD', name: 'Macedonian Denar', symbol: 'ден', country: 'North Macedonia', region: 'europe' },
  { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark', symbol: 'KM', country: 'Bosnia and Herzegovina', region: 'europe' },
  { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', country: 'Iceland', region: 'europe' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', country: 'Georgia', region: 'europe' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', country: 'Armenia', region: 'europe' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', country: 'Azerbaijan', region: 'europe' },

  // Asian Currencies
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China', region: 'asia' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'Hong Kong', region: 'asia' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', country: 'Taiwan', region: 'asia' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea', region: 'asia' },
  { code: 'KPW', name: 'North Korean Won', symbol: '₩', country: 'North Korea', region: 'asia' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore', region: 'asia' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia', region: 'asia' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'Thailand', region: 'asia' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia', region: 'asia' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'Philippines', region: 'asia' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', country: 'Vietnam', region: 'asia' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India', region: 'asia' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', country: 'Pakistan', region: 'asia' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', country: 'Bangladesh', region: 'asia' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'Rs', country: 'Sri Lanka', region: 'asia' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: 'Rs', country: 'Nepal', region: 'asia' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', country: 'Myanmar', region: 'asia' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', country: 'Cambodia', region: 'asia' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', country: 'Laos', region: 'asia' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', country: 'Brunei', region: 'asia' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', country: 'Mongolia', region: 'asia' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', country: 'Kazakhstan', region: 'asia' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'so\'m', country: 'Uzbekistan', region: 'asia' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM', country: 'Tajikistan', region: 'asia' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с', country: 'Kyrgyzstan', region: 'asia' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'm', country: 'Turkmenistan', region: 'asia' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', country: 'Afghanistan', region: 'asia' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', country: 'Macau', region: 'asia' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.', country: 'Bhutan', region: 'asia' },
  { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf', country: 'Maldives', region: 'asia' },

  // Middle East Currencies
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'United Arab Emirates', region: 'middle_east' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', country: 'Saudi Arabia', region: 'middle_east' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: 'ر.ق', country: 'Qatar', region: 'middle_east' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', country: 'Kuwait', region: 'middle_east' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: '.د.ب', country: 'Bahrain', region: 'middle_east' },
  { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع.', country: 'Oman', region: 'middle_east' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', country: 'Jordan', region: 'middle_east' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', country: 'Lebanon', region: 'middle_east' },
  { code: 'SYP', name: 'Syrian Pound', symbol: '£S', country: 'Syria', region: 'middle_east' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', country: 'Iraq', region: 'middle_east' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', country: 'Iran', region: 'middle_east' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', country: 'Yemen', region: 'middle_east' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', country: 'Israel', region: 'middle_east' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'Turkey', region: 'middle_east' },

  // African Currencies
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', region: 'africa' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'Egypt', region: 'africa' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria', region: 'africa' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', country: 'Ghana', region: 'africa' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya', region: 'africa' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', country: 'Tanzania', region: 'africa' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', country: 'Uganda', region: 'africa' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', country: 'Rwanda', region: 'africa' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'Ethiopia', region: 'africa' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', country: 'Morocco', region: 'africa' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', country: 'Algeria', region: 'africa' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', country: 'Tunisia', region: 'africa' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د', country: 'Libya', region: 'africa' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: '£', country: 'Sudan', region: 'africa' },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: '£', country: 'South Sudan', region: 'africa' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', country: 'West Africa', region: 'africa' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', country: 'Central Africa', region: 'africa' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', country: 'Angola', region: 'africa' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', country: 'Zambia', region: 'africa' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', country: 'Mozambique', region: 'africa' },
  { code: 'ZWL', name: 'Zimbabwean Dollar', symbol: 'Z$', country: 'Zimbabwe', region: 'africa' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', country: 'Botswana', region: 'africa' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', country: 'Namibia', region: 'africa' },
  { code: 'SZL', name: 'Eswatini Lilangeni', symbol: 'E', country: 'Eswatini', region: 'africa' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', country: 'Lesotho', region: 'africa' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', country: 'Malawi', region: 'africa' },
  { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar', country: 'Madagascar', region: 'africa' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', country: 'Mauritius', region: 'africa' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', country: 'Seychelles', region: 'africa' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', country: 'Djibouti', region: 'africa' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', country: 'Eritrea', region: 'africa' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'S', country: 'Somalia', region: 'africa' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', country: 'Burundi', region: 'africa' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', country: 'DR Congo', region: 'africa' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', country: 'Gambia', region: 'africa' },
  { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', country: 'Guinea', region: 'africa' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', country: 'Liberia', region: 'africa' },
  { code: 'SLE', name: 'Sierra Leonean Leone', symbol: 'Le', country: 'Sierra Leone', region: 'africa' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', country: 'Cape Verde', region: 'africa' },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db', country: 'São Tomé and Príncipe', region: 'africa' },
  { code: 'MRU', name: 'Mauritanian Ouguiya', symbol: 'UM', country: 'Mauritania', region: 'africa' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', country: 'Comoros', region: 'africa' },

  // Americas Currencies
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico', region: 'americas' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil', region: 'americas' },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', country: 'Argentina', region: 'americas' },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', country: 'Chile', region: 'americas' },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'Colombia', region: 'americas' },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', country: 'Peru', region: 'americas' },
  { code: 'VES', name: 'Venezuelan Bolívar', symbol: 'Bs.S', country: 'Venezuela', region: 'americas' },
  { code: 'UYU', name: 'Uruguayan Peso', symbol: '$U', country: 'Uruguay', region: 'americas' },
  { code: 'PYG', name: 'Paraguayan Guarani', symbol: '₲', country: 'Paraguay', region: 'americas' },
  { code: 'BOB', name: 'Bolivian Boliviano', symbol: 'Bs.', country: 'Bolivia', region: 'americas' },
  { code: 'CRC', name: 'Costa Rican Colón', symbol: '₡', country: 'Costa Rica', region: 'americas' },
  { code: 'PAB', name: 'Panamanian Balboa', symbol: 'B/.', country: 'Panama', region: 'americas' },
  { code: 'GTQ', name: 'Guatemalan Quetzal', symbol: 'Q', country: 'Guatemala', region: 'americas' },
  { code: 'HNL', name: 'Honduran Lempira', symbol: 'L', country: 'Honduras', region: 'americas' },
  { code: 'NIO', name: 'Nicaraguan Córdoba', symbol: 'C$', country: 'Nicaragua', region: 'americas' },
  { code: 'SVC', name: 'Salvadoran Colón', symbol: '₡', country: 'El Salvador', region: 'americas' },
  { code: 'BZD', name: 'Belize Dollar', symbol: 'BZ$', country: 'Belize', region: 'americas' },
  { code: 'DOP', name: 'Dominican Peso', symbol: 'RD$', country: 'Dominican Republic', region: 'americas' },
  { code: 'HTG', name: 'Haitian Gourde', symbol: 'G', country: 'Haiti', region: 'americas' },
  { code: 'JMD', name: 'Jamaican Dollar', symbol: 'J$', country: 'Jamaica', region: 'americas' },
  { code: 'TTD', name: 'Trinidad and Tobago Dollar', symbol: 'TT$', country: 'Trinidad and Tobago', region: 'americas' },
  { code: 'BBD', name: 'Barbadian Dollar', symbol: 'Bds$', country: 'Barbados', region: 'americas' },
  { code: 'BSD', name: 'Bahamian Dollar', symbol: 'B$', country: 'Bahamas', region: 'americas' },
  { code: 'CUP', name: 'Cuban Peso', symbol: '₱', country: 'Cuba', region: 'americas' },
  { code: 'AWG', name: 'Aruban Florin', symbol: 'ƒ', country: 'Aruba', region: 'americas' },
  { code: 'ANG', name: 'Netherlands Antillean Guilder', symbol: 'ƒ', country: 'Curaçao', region: 'americas' },
  { code: 'KYD', name: 'Cayman Islands Dollar', symbol: 'CI$', country: 'Cayman Islands', region: 'americas' },
  { code: 'BMD', name: 'Bermudian Dollar', symbol: 'BD$', country: 'Bermuda', region: 'americas' },
  { code: 'XCD', name: 'East Caribbean Dollar', symbol: 'EC$', country: 'Eastern Caribbean', region: 'americas' },
  { code: 'GYD', name: 'Guyanese Dollar', symbol: 'G$', country: 'Guyana', region: 'americas' },
  { code: 'SRD', name: 'Surinamese Dollar', symbol: '$', country: 'Suriname', region: 'americas' },
  { code: 'FKP', name: 'Falkland Islands Pound', symbol: '£', country: 'Falkland Islands', region: 'americas' },

  // Oceania Currencies
  { code: 'FJD', name: 'Fijian Dollar', symbol: 'FJ$', country: 'Fiji', region: 'oceania' },
  { code: 'PGK', name: 'Papua New Guinean Kina', symbol: 'K', country: 'Papua New Guinea', region: 'oceania' },
  { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$', country: 'Solomon Islands', region: 'oceania' },
  { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT', country: 'Vanuatu', region: 'oceania' },
  { code: 'WST', name: 'Samoan Tala', symbol: 'WS$', country: 'Samoa', region: 'oceania' },
  { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$', country: 'Tonga', region: 'oceania' },
  { code: 'XPF', name: 'CFP Franc', symbol: '₣', country: 'French Pacific', region: 'oceania' },

  // Oceania only - cryptocurrencies are now managed separately in cryptoCurrencies.ts
];

// Crypto codes (for filtering in fiat management - cryptocurrencies handled separately)
export const CRYPTO_CODES = [
  'BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'USDC', 'ADA', 'DOGE', 'TRX',
  'TON', 'LINK', 'AVAX', 'SHIB', 'DOT', 'DAI', 'MATIC', 'LTC', 'BCH', 'UNI',
  'ATOM', 'XMR', 'XLM', 'NEAR', 'APT', 'ARB', 'OP', 'PEPE', 'FTM', 'ALGO',
  'SUI', 'HBAR', 'ICP', 'FIL', 'VET', 'EGLD', 'TUSD', 'FDUSD', 'IMX', 'MANTA',
  'STRK', 'AAVE', 'MKR', 'CRV', 'LDO', 'SNX', 'COMP', 'SUSHI', 'DYDX', 'INJ',
  'PENDLE', 'JUP', 'OKB', 'CRO', 'LEO', 'FLOKI', 'BONK', 'WIF', 'RENDER', 'GRT',
  'FET', 'SAND', 'MANA', 'AXS', 'APE', 'ENS', 'RNDR', 'GALA', 'CHZ', 'THETA',
  'FLOW', 'KCS', 'NEO', 'KAVA', 'CFX', 'ROSE', 'ZIL', 'IOTA', 'ETC'
];

// Filter out crypto from WORLD_CURRENCIES for fiat-only lists
export const FIAT_CURRENCIES = WORLD_CURRENCIES.filter(c => c.region !== 'crypto');

// Helper function to get currencies by region
export const getCurrenciesByRegion = (region: WorldCurrency['region']) => 
  WORLD_CURRENCIES.filter(c => c.region === region);

// Major currencies for quick add
export const MAJOR_CURRENCIES = WORLD_CURRENCIES.filter(c => c.region === 'major');

// G20 currencies (approximate - most used currencies)
export const G20_CURRENCIES_CODES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'BRL', 'RUB', 
  'KRW', 'AUD', 'CAD', 'MXN', 'IDR', 'TRY', 'SAR', 'ZAR',
  'ARS', 'CHF', 'SGD', 'HKD'
];

export const G20_CURRENCIES = WORLD_CURRENCIES.filter(c => 
  G20_CURRENCIES_CODES.includes(c.code)
);

// Get currency by code
export const getCurrencyByCode = (code: string) => 
  WORLD_CURRENCIES.find(c => c.code === code);

// Search currencies
export const searchCurrencies = (query: string): WorldCurrency[] => {
  const lowerQuery = query.toLowerCase();
  return WORLD_CURRENCIES.filter(c =>
    c.code.toLowerCase().includes(lowerQuery) ||
    c.name.toLowerCase().includes(lowerQuery) ||
    c.country.toLowerCase().includes(lowerQuery)
  );
};

// Total count (fiat only)
export const TOTAL_CURRENCIES_COUNT = FIAT_CURRENCIES.length;
