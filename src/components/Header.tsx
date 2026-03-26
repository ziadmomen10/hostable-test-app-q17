// HostOnce Homepage Header
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/contexts/I18nContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useGeoLocation } from '@/contexts/GeoLocationContext';
import { RotateCcw } from 'lucide-react';
interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string | null;
  is_active: boolean;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  is_default: boolean;
  is_active: boolean;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  is_active: boolean;
  text_color: string;
}

interface Page {
  id: string;
  page_url: string;
  page_title: string;
  page_description: string | null;
  is_active: boolean;
}

const Header: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation('header');
  const { currentLanguage, changeLanguage, isRTL } = useI18n();
  const { currentCurrency, currencies: currencyList, setCurrency } = useCurrency();
  const { 
    isCurrencyAutoDetected, 
    isLanguageAutoDetected, 
    detectedCurrency, 
    detectedLanguage,
    resetToAutoDetect 
  } = useGeoLocation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    fetchActiveLanguages();
    fetchActiveAnnouncements();
    fetchActivePages();
  }, []);

  const fetchActiveLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('id, code, name, native_name, is_active')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching languages:', error);
        return;
      }

      setLanguages(data || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };


  const fetchActiveAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching announcements:', error);
        return;
      }

      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const fetchActivePages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('id, page_url, page_title, page_description, is_active')
        .eq('is_active', true)
        .order('page_title');

      if (error) {
        console.error('Error fetching pages:', error);
        return;
      }

      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  return (
    <div className={`w-full ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mini Navbar */}
      <div className="bg-slate-900 text-white text-sm">
        <div className="container flex h-10 items-center justify-between">
          <div className="flex items-center">
            {announcements.length > 0 && (
              <span style={{ color: announcements[0].text_color }}>
                {announcements[0].title}: {announcements[0].message}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/contact" className="hover:text-slate-200 transition-colors">
              {t('contact_us')}
            </Link>
            <Link to="/knowledge" className="hover:text-slate-200 transition-colors">
              {t('knowledge_base')}
            </Link>
            <Link to="/affiliate" className="hover:text-slate-200 transition-colors">
              {t('affiliate')}
            </Link>
            {/* Currency Selector with Auto-Detection Indicator */}
            <div className="flex items-center gap-1">
              {isCurrencyAutoDetected && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-transparent border-white/30 text-white/70 cursor-help">
                      Auto
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">
                      Currency auto-detected based on your location ({detectedCurrency}).
                      <button 
                        onClick={resetToAutoDetect}
                        className="ml-2 text-primary underline hover:no-underline inline-flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Select 
                value={currentCurrency?.code.toLowerCase() || 'usd'} 
                onValueChange={(code) => {
                  // Set manual flag to prevent geo-detection from overriding
                  localStorage.setItem('currency-manually-set', 'true');
                  setCurrency(code.toUpperCase());
                }}
              >
                <SelectTrigger className="w-auto h-auto p-1 bg-transparent border-none text-white hover:text-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyList.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code.toLowerCase()}>
                      {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Selector with Auto-Detection Indicator */}
            <div className="flex items-center gap-1">
              {isLanguageAutoDetected && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-transparent border-white/30 text-white/70 cursor-help">
                      Auto
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm">
                      Language auto-detected based on your location ({detectedLanguage}).
                      <button 
                        onClick={resetToAutoDetect}
                        className="ml-2 text-primary underline hover:no-underline inline-flex items-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Select 
                value={currentLanguage?.code || 'en'} 
                onValueChange={(code) => {
                  // Set manual flag to prevent geo-detection from overriding
                  localStorage.setItem('language-manually-set', 'true');
                  changeLanguage(code);
                }}
              >
                <SelectTrigger className="w-auto h-auto p-1 bg-transparent border-none text-white hover:text-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border shadow-lg z-50">
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.native_name || language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Main Header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={`${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/storage/v1/object/public/avatars/website/logo.png`} 
              alt="HostOnce Logo" 
              className="h-12 w-36 object-contain rounded-md"
              onError={(e) => {
                const target = e.currentTarget;
                const cloudUrl = 'https://hkfjyktrgcxkxzdxxatx.supabase.co/storage/v1/object/public/avatars/website/logo.png';
                if (!target.dataset.retried) {
                  target.dataset.retried = 'true';
                  target.src = cloudUrl;
                } else {
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }
              }}
            />
            <div className="hidden h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
              H
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {/* Domain Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                  {t('domain')}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[500px] !w-[500px] p-6 bg-background border shadow-lg z-50">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <Link to="/domain/buy" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-green-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{t('buy_domain_names')}</h3>
                          <p className="text-xs text-muted-foreground">{t('find_perfect_domain')}</p>
                        </div>
                      </Link>
                      <Link to="/domain/ssl" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-purple-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{t('ssl_certificates')}</h3>
                          <p className="text-xs text-muted-foreground">{t('ssl_description')}</p>
                        </div>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      <Link to="/domain/whois" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                        <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-pink-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">WHOIS Checker</h3>
                          <p className="text-xs text-muted-foreground">Perform a WHOIS lookup to find the domain owner, registration date, and contact details.</p>
                        </div>
                      </Link>
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-blue-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Domain SSL Checker</h3>
                          <p className="text-xs text-muted-foreground">Verify SSL encryption on your site.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-purple-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Domain DNS Checker</h3>
                        <p className="text-xs text-muted-foreground">Quickly verify DNS settings to ensure proper setup and avoid connectivity issues.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 mt-4">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-orange-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">AI Domain Name Generator</h3>
                        <p className="text-xs text-muted-foreground">Generator name with AI suggestion.</p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Hosting Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                  {t('hosting')}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[650px] !w-[650px] p-6 bg-background border shadow-lg z-50">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Link to="/hosting/shared" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-green-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Shared Hosting</h3>
                          <p className="text-xs text-muted-foreground">Learn more about an affordable solution for various websites</p>
                        </div>
                      </Link>
                      <Link to="/hosting/vps" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                        <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-pink-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">VPS Hosting</h3>
                          <p className="text-xs text-muted-foreground">Discover a virtual server with enhanced capabilities</p>
                        </div>
                      </Link>
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-purple-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Dedicated Servers</h3>
                          <p className="text-xs text-muted-foreground">Discover a server for business applications</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-orange-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">WordPress Hosting</h3>
                          <p className="text-xs text-muted-foreground">Learn more about hosting optimized for WordPress</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="h-6 w-6 bg-blue-500 rounded"></div>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">Windows Hosting</h3>
                          <p className="text-xs text-muted-foreground">Explore Windows-based hosting for professional solutions</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">Find the most suitable plan for your website</h3>
                      <p className="text-sm text-muted-foreground mb-4">Choose the ideal hosting plan for your website's performance and growth.</p>
                      <div className="bg-orange-200 rounded-full px-4 py-2 text-sm font-medium text-center mb-4">
                        Your Perfect Plan
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-green-500 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-blue-500 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded flex-1"></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-purple-500 rounded"></div>
                          <div className="h-2 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pages Dropdown */}
              {pages.length > 0 && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                    Pages
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[400px] !w-[400px] p-6 bg-background border shadow-lg z-50">
                    <div className="grid grid-cols-1 gap-2">
                      {pages.map((page) => (
                        <Link 
                          key={page.id} 
                          to={page.page_url} 
                          className="flex items-start space-x-3 hover:bg-muted/50 p-3 rounded-md transition-colors"
                        >
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="h-4 w-4 bg-blue-500 rounded"></div>
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{page.page_title}</h3>
                            {page.page_description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">{page.page_description}</p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}

              {/* Tools & Services Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                  Tools & Services
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[500px] !w-[500px] p-6 bg-background border shadow-lg z-50">
                  <div className="grid grid-cols-1 gap-4">
                    <Link to="/services/reseller" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-green-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Reseller Hosting</h3>
                        <p className="text-xs text-muted-foreground">Unlock Profits with your very own Web Hosting Business.</p>
                      </div>
                    </Link>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-pink-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">E-commerce Hosting</h3>
                        <p className="text-xs text-muted-foreground">Managed e-commerce hosting solutions.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-orange-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Social Network Hosting</h3>
                        <p className="text-xs text-muted-foreground">Get your social community off the ground.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-purple-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Email Hosting</h3>
                        <p className="text-xs text-muted-foreground">Promote your business with email Hosting.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-blue-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">CRM Hosting</h3>
                        <p className="text-xs text-muted-foreground">CRM Hosting Key Coming Soon.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-red-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Game Server Hosting</h3>
                        <p className="text-xs text-muted-foreground">Best Game Server Hosting.</p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Support Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent">
                  Support
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-[450px] !w-[450px] p-6 bg-background border shadow-lg z-50">
                  <div className="grid grid-cols-1 gap-4">
                    <Link to="/support/knowledge" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-green-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Knowledge Base</h3>
                        <p className="text-xs text-muted-foreground">We're here to help you</p>
                      </div>
                    </Link>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-pink-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Download</h3>
                        <p className="text-xs text-muted-foreground">Our Download area</p>
                      </div>
                    </div>
                    <Link to="/support/contact" className="flex items-start space-x-3 hover:bg-muted/50 p-2 rounded-md transition-colors">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-purple-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Contact Us</h3>
                        <p className="text-xs text-muted-foreground">Get in touch with us</p>
                      </div>
                    </Link>
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <div className="h-6 w-6 bg-blue-500 rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Blog</h3>
                        <p className="text-xs text-muted-foreground">Read latest news on our Blog</p>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Button variant="outline">Dashboard</Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Chat with OnceAI
                </Button>
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                  Client Area
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;