import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/contexts/I18nContext';

const Footer: React.FC = () => {
  const { t } = useTranslation('footer');
  const { isRTL } = useI18n();
  return (
    <footer className={`w-full bg-slate-900 text-white mt-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={`${import.meta.env.VITE_SUPABASE_URL || 'https://hkfjyktrgcxkxzdxxatx.supabase.co'}/storage/v1/object/public/avatars/website/logo.png`} 
                alt="HostOnce Logo" 
                className="h-8 w-24 object-contain rounded-md"
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
              <div className="hidden h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                H
              </div>
            </div>
            <p className="text-sm text-slate-300">
              {t('company_description')}
            </p>
          </div>

          {/* Hosting Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('hosting_services')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/hosting/shared" className="text-slate-300 hover:text-white transition-colors">{t('shared_hosting')}</Link></li>
              <li><Link to="/hosting/vps" className="text-slate-300 hover:text-white transition-colors">{t('vps_hosting')}</Link></li>
              <li><Link to="/hosting/dedicated" className="text-slate-300 hover:text-white transition-colors">{t('dedicated_servers')}</Link></li>
              <li><Link to="/hosting/wordpress" className="text-slate-300 hover:text-white transition-colors">{t('wordpress_hosting')}</Link></li>
            </ul>
          </div>

          {/* Domain Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('domains')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/domain/buy" className="text-slate-300 hover:text-white transition-colors">{t('buy_domain')}</Link></li>
              <li><Link to="/domain/ssl" className="text-slate-300 hover:text-white transition-colors">{t('ssl_certificates')}</Link></li>
              <li><Link to="/domain/whois" className="text-slate-300 hover:text-white transition-colors">{t('whois_checker')}</Link></li>
              <li><Link to="/domain/dns" className="text-slate-300 hover:text-white transition-colors">{t('dns_checker')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">{t('contact_us')}</Link></li>
              <li><Link to="/knowledge" className="text-slate-300 hover:text-white transition-colors">{t('knowledge_base')}</Link></li>
              
              <li><Link to="/affiliate" className="text-slate-300 hover:text-white transition-colors">{t('affiliate_program')}</Link></li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-slate-700" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-slate-300">
            {t('copyright')}
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">{t('privacy_policy')}</Link>
            <Link to="/terms" className="text-slate-300 hover:text-white transition-colors">{t('terms_of_service')}</Link>
            <Link to="/refund" className="text-slate-300 hover:text-white transition-colors">{t('refund_policy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;