import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useI18n } from '@/contexts/I18nContext';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const { isRTL, direction } = useI18n();
  
  return (
    <div 
      className={`min-h-screen bg-background flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}
      dir={direction}
    >
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
