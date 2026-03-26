/**
 * Country to Language and Currency Mappings
 * Used for auto-detecting user preferences based on IP geolocation
 */

export interface CountryMapping {
  language: string;
  currency: string;
}

export const COUNTRY_MAPPINGS: Record<string, CountryMapping> = {
  // Middle East (Arabic)
  'SA': { language: 'ar', currency: 'SAR' },  // Saudi Arabia
  'AE': { language: 'ar', currency: 'AED' },  // UAE
  'EG': { language: 'ar', currency: 'EGP' },  // Egypt
  'JO': { language: 'ar', currency: 'JOD' },  // Jordan
  'KW': { language: 'ar', currency: 'KWD' },  // Kuwait
  'BH': { language: 'ar', currency: 'BHD' },  // Bahrain
  'OM': { language: 'ar', currency: 'OMR' },  // Oman
  'QA': { language: 'ar', currency: 'QAR' },  // Qatar
  'LB': { language: 'ar', currency: 'LBP' },  // Lebanon
  'SY': { language: 'ar', currency: 'SYP' },  // Syria
  'IQ': { language: 'ar', currency: 'IQD' },  // Iraq
  'YE': { language: 'ar', currency: 'YER' },  // Yemen
  'LY': { language: 'ar', currency: 'LYD' },  // Libya
  'TN': { language: 'ar', currency: 'TND' },  // Tunisia
  'DZ': { language: 'ar', currency: 'DZD' },  // Algeria
  'MA': { language: 'ar', currency: 'MAD' },  // Morocco
  'SD': { language: 'ar', currency: 'SDG' },  // Sudan
  'PS': { language: 'ar', currency: 'ILS' },  // Palestine
  
  // Europe - Western
  'DE': { language: 'de', currency: 'EUR' },  // Germany
  'AT': { language: 'de', currency: 'EUR' },  // Austria
  'CH': { language: 'de', currency: 'CHF' },  // Switzerland
  'LI': { language: 'de', currency: 'CHF' },  // Liechtenstein
  'LU': { language: 'de', currency: 'EUR' },  // Luxembourg
  
  'FR': { language: 'fr', currency: 'EUR' },  // France
  'BE': { language: 'fr', currency: 'EUR' },  // Belgium
  'MC': { language: 'fr', currency: 'EUR' },  // Monaco
  
  'ES': { language: 'es', currency: 'EUR' },  // Spain
  'AD': { language: 'es', currency: 'EUR' },  // Andorra
  
  'IT': { language: 'it', currency: 'EUR' },  // Italy
  'SM': { language: 'it', currency: 'EUR' },  // San Marino
  'VA': { language: 'it', currency: 'EUR' },  // Vatican
  
  'PT': { language: 'pt', currency: 'EUR' },  // Portugal
  
  'NL': { language: 'nl', currency: 'EUR' },  // Netherlands
  
  'GB': { language: 'en', currency: 'GBP' },  // UK
  'IE': { language: 'en', currency: 'EUR' },  // Ireland
  
  // Europe - Nordic
  'SE': { language: 'sv', currency: 'SEK' },  // Sweden
  'NO': { language: 'no', currency: 'NOK' },  // Norway
  'DK': { language: 'da', currency: 'DKK' },  // Denmark
  'FI': { language: 'fi', currency: 'EUR' },  // Finland
  'IS': { language: 'is', currency: 'ISK' },  // Iceland
  
  // Europe - Eastern
  'RU': { language: 'ru', currency: 'RUB' },  // Russia
  'UA': { language: 'uk', currency: 'UAH' },  // Ukraine
  'BY': { language: 'ru', currency: 'BYN' },  // Belarus
  'PL': { language: 'pl', currency: 'PLN' },  // Poland
  'CZ': { language: 'cs', currency: 'CZK' },  // Czech Republic
  'SK': { language: 'sk', currency: 'EUR' },  // Slovakia
  'HU': { language: 'hu', currency: 'HUF' },  // Hungary
  'RO': { language: 'ro', currency: 'RON' },  // Romania
  'BG': { language: 'bg', currency: 'BGN' },  // Bulgaria
  'HR': { language: 'hr', currency: 'EUR' },  // Croatia
  'SI': { language: 'sl', currency: 'EUR' },  // Slovenia
  'RS': { language: 'sr', currency: 'RSD' },  // Serbia
  'BA': { language: 'bs', currency: 'BAM' },  // Bosnia
  'ME': { language: 'sr', currency: 'EUR' },  // Montenegro
  'MK': { language: 'mk', currency: 'MKD' },  // North Macedonia
  'AL': { language: 'sq', currency: 'ALL' },  // Albania
  'XK': { language: 'sq', currency: 'EUR' },  // Kosovo
  'MD': { language: 'ro', currency: 'MDL' },  // Moldova
  'EE': { language: 'et', currency: 'EUR' },  // Estonia
  'LV': { language: 'lv', currency: 'EUR' },  // Latvia
  'LT': { language: 'lt', currency: 'EUR' },  // Lithuania
  
  // Europe - Southern
  'GR': { language: 'el', currency: 'EUR' },  // Greece
  'CY': { language: 'el', currency: 'EUR' },  // Cyprus
  'MT': { language: 'en', currency: 'EUR' },  // Malta
  'TR': { language: 'tr', currency: 'TRY' },  // Turkey
  
  // Asia - East
  'CN': { language: 'zh', currency: 'CNY' },  // China
  'HK': { language: 'zh', currency: 'HKD' },  // Hong Kong
  'TW': { language: 'zh', currency: 'TWD' },  // Taiwan
  'MO': { language: 'zh', currency: 'MOP' },  // Macau
  'JP': { language: 'ja', currency: 'JPY' },  // Japan
  'KR': { language: 'ko', currency: 'KRW' },  // South Korea
  'KP': { language: 'ko', currency: 'KPW' },  // North Korea
  'MN': { language: 'mn', currency: 'MNT' },  // Mongolia
  
  // Asia - Southeast
  'TH': { language: 'th', currency: 'THB' },  // Thailand
  'VN': { language: 'vi', currency: 'VND' },  // Vietnam
  'ID': { language: 'id', currency: 'IDR' },  // Indonesia
  'MY': { language: 'ms', currency: 'MYR' },  // Malaysia
  'SG': { language: 'en', currency: 'SGD' },  // Singapore
  'PH': { language: 'en', currency: 'PHP' },  // Philippines
  'MM': { language: 'my', currency: 'MMK' },  // Myanmar
  'KH': { language: 'km', currency: 'KHR' },  // Cambodia
  'LA': { language: 'lo', currency: 'LAK' },  // Laos
  'BN': { language: 'ms', currency: 'BND' },  // Brunei
  'TL': { language: 'pt', currency: 'USD' },  // Timor-Leste
  
  // Asia - South
  'IN': { language: 'hi', currency: 'INR' },  // India
  'PK': { language: 'ur', currency: 'PKR' },  // Pakistan
  'BD': { language: 'bn', currency: 'BDT' },  // Bangladesh
  'LK': { language: 'si', currency: 'LKR' },  // Sri Lanka
  'NP': { language: 'ne', currency: 'NPR' },  // Nepal
  'BT': { language: 'dz', currency: 'BTN' },  // Bhutan
  'MV': { language: 'dv', currency: 'MVR' },  // Maldives
  'AF': { language: 'fa', currency: 'AFN' },  // Afghanistan
  
  // Asia - Central
  'KZ': { language: 'kk', currency: 'KZT' },  // Kazakhstan
  'UZ': { language: 'uz', currency: 'UZS' },  // Uzbekistan
  'TM': { language: 'tk', currency: 'TMT' },  // Turkmenistan
  'TJ': { language: 'tg', currency: 'TJS' },  // Tajikistan
  'KG': { language: 'ky', currency: 'KGS' },  // Kyrgyzstan
  
  // Asia - West
  'IR': { language: 'fa', currency: 'IRR' },  // Iran
  'IL': { language: 'he', currency: 'ILS' },  // Israel
  'GE': { language: 'ka', currency: 'GEL' },  // Georgia
  'AM': { language: 'hy', currency: 'AMD' },  // Armenia
  'AZ': { language: 'az', currency: 'AZN' },  // Azerbaijan
  
  // Americas - North
  'US': { language: 'en', currency: 'USD' },  // USA
  'CA': { language: 'en', currency: 'CAD' },  // Canada
  'MX': { language: 'es', currency: 'MXN' },  // Mexico
  
  // Americas - Central
  'GT': { language: 'es', currency: 'GTQ' },  // Guatemala
  'BZ': { language: 'en', currency: 'BZD' },  // Belize
  'SV': { language: 'es', currency: 'USD' },  // El Salvador
  'HN': { language: 'es', currency: 'HNL' },  // Honduras
  'NI': { language: 'es', currency: 'NIO' },  // Nicaragua
  'CR': { language: 'es', currency: 'CRC' },  // Costa Rica
  'PA': { language: 'es', currency: 'PAB' },  // Panama
  
  // Americas - Caribbean
  'CU': { language: 'es', currency: 'CUP' },  // Cuba
  'DO': { language: 'es', currency: 'DOP' },  // Dominican Republic
  'HT': { language: 'fr', currency: 'HTG' },  // Haiti
  'JM': { language: 'en', currency: 'JMD' },  // Jamaica
  'PR': { language: 'es', currency: 'USD' },  // Puerto Rico
  'TT': { language: 'en', currency: 'TTD' },  // Trinidad & Tobago
  'BB': { language: 'en', currency: 'BBD' },  // Barbados
  'BS': { language: 'en', currency: 'BSD' },  // Bahamas
  
  // Americas - South
  'BR': { language: 'pt', currency: 'BRL' },  // Brazil
  'AR': { language: 'es', currency: 'ARS' },  // Argentina
  'CL': { language: 'es', currency: 'CLP' },  // Chile
  'CO': { language: 'es', currency: 'COP' },  // Colombia
  'PE': { language: 'es', currency: 'PEN' },  // Peru
  'VE': { language: 'es', currency: 'VES' },  // Venezuela
  'EC': { language: 'es', currency: 'USD' },  // Ecuador
  'BO': { language: 'es', currency: 'BOB' },  // Bolivia
  'PY': { language: 'es', currency: 'PYG' },  // Paraguay
  'UY': { language: 'es', currency: 'UYU' },  // Uruguay
  'GY': { language: 'en', currency: 'GYD' },  // Guyana
  'SR': { language: 'nl', currency: 'SRD' },  // Suriname
  'GF': { language: 'fr', currency: 'EUR' },  // French Guiana
  
  // Africa - North (Arabic already covered)
  
  // Africa - West
  'NG': { language: 'en', currency: 'NGN' },  // Nigeria
  'GH': { language: 'en', currency: 'GHS' },  // Ghana
  'CI': { language: 'fr', currency: 'XOF' },  // Ivory Coast
  'SN': { language: 'fr', currency: 'XOF' },  // Senegal
  'ML': { language: 'fr', currency: 'XOF' },  // Mali
  'BF': { language: 'fr', currency: 'XOF' },  // Burkina Faso
  'NE': { language: 'fr', currency: 'XOF' },  // Niger
  'GN': { language: 'fr', currency: 'GNF' },  // Guinea
  'BJ': { language: 'fr', currency: 'XOF' },  // Benin
  'TG': { language: 'fr', currency: 'XOF' },  // Togo
  'SL': { language: 'en', currency: 'SLE' },  // Sierra Leone
  'LR': { language: 'en', currency: 'LRD' },  // Liberia
  'MR': { language: 'ar', currency: 'MRU' },  // Mauritania
  'GM': { language: 'en', currency: 'GMD' },  // Gambia
  'GW': { language: 'pt', currency: 'XOF' },  // Guinea-Bissau
  'CV': { language: 'pt', currency: 'CVE' },  // Cape Verde
  
  // Africa - Central
  'CD': { language: 'fr', currency: 'CDF' },  // DR Congo
  'AO': { language: 'pt', currency: 'AOA' },  // Angola
  'CM': { language: 'fr', currency: 'XAF' },  // Cameroon
  'TD': { language: 'fr', currency: 'XAF' },  // Chad
  'CF': { language: 'fr', currency: 'XAF' },  // Central African Republic
  'CG': { language: 'fr', currency: 'XAF' },  // Congo
  'GA': { language: 'fr', currency: 'XAF' },  // Gabon
  'GQ': { language: 'es', currency: 'XAF' },  // Equatorial Guinea
  'ST': { language: 'pt', currency: 'STN' },  // São Tomé and Príncipe
  
  // Africa - East
  'KE': { language: 'en', currency: 'KES' },  // Kenya
  'TZ': { language: 'sw', currency: 'TZS' },  // Tanzania
  'UG': { language: 'en', currency: 'UGX' },  // Uganda
  'RW': { language: 'rw', currency: 'RWF' },  // Rwanda
  'BI': { language: 'fr', currency: 'BIF' },  // Burundi
  'ET': { language: 'am', currency: 'ETB' },  // Ethiopia
  'ER': { language: 'ti', currency: 'ERN' },  // Eritrea
  'DJ': { language: 'fr', currency: 'DJF' },  // Djibouti
  'SO': { language: 'so', currency: 'SOS' },  // Somalia
  'MG': { language: 'mg', currency: 'MGA' },  // Madagascar
  'MU': { language: 'en', currency: 'MUR' },  // Mauritius
  'SC': { language: 'en', currency: 'SCR' },  // Seychelles
  'KM': { language: 'ar', currency: 'KMF' },  // Comoros
  
  // Africa - Southern
  'ZA': { language: 'en', currency: 'ZAR' },  // South Africa
  'NA': { language: 'en', currency: 'NAD' },  // Namibia
  'BW': { language: 'en', currency: 'BWP' },  // Botswana
  'ZW': { language: 'en', currency: 'ZWL' },  // Zimbabwe
  'ZM': { language: 'en', currency: 'ZMW' },  // Zambia
  'MW': { language: 'en', currency: 'MWK' },  // Malawi
  'MZ': { language: 'pt', currency: 'MZN' },  // Mozambique
  'LS': { language: 'en', currency: 'LSL' },  // Lesotho
  'SZ': { language: 'en', currency: 'SZL' },  // Eswatini
  
  // Oceania
  'AU': { language: 'en', currency: 'AUD' },  // Australia
  'NZ': { language: 'en', currency: 'NZD' },  // New Zealand
  'PG': { language: 'en', currency: 'PGK' },  // Papua New Guinea
  'FJ': { language: 'en', currency: 'FJD' },  // Fiji
  'SB': { language: 'en', currency: 'SBD' },  // Solomon Islands
  'VU': { language: 'en', currency: 'VUV' },  // Vanuatu
  'WS': { language: 'en', currency: 'WST' },  // Samoa
  'TO': { language: 'en', currency: 'TOP' },  // Tonga
  'NC': { language: 'fr', currency: 'XPF' },  // New Caledonia
  'PF': { language: 'fr', currency: 'XPF' },  // French Polynesia
  'GU': { language: 'en', currency: 'USD' },  // Guam
};

// Default fallback
export const DEFAULT_MAPPING: CountryMapping = {
  language: 'en',
  currency: 'USD',
};

// Get mapping for a country code
export const getCountryMapping = (countryCode: string): CountryMapping => {
  return COUNTRY_MAPPINGS[countryCode?.toUpperCase()] || DEFAULT_MAPPING;
};

// Get all unique languages from mappings
export const getAvailableLanguages = (): string[] => {
  const languages = new Set(Object.values(COUNTRY_MAPPINGS).map(m => m.language));
  return Array.from(languages).sort();
};

// Get all unique currencies from mappings
export const getAvailableCurrencies = (): string[] => {
  const currencies = new Set(Object.values(COUNTRY_MAPPINGS).map(m => m.currency));
  return Array.from(currencies).sort();
};
