import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
  showFlag?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'compact', 
  className = '',
  showFlag = true 
}) => {
  const { currentLanguage, languages, changeLanguage, isLoading } = useI18n();
  const { ui } = useTranslation();

  if (isLoading || !currentLanguage) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Select value={currentLanguage.code} onValueChange={changeLanguage}>
        <SelectTrigger className={`w-auto h-auto p-2 bg-transparent border-none text-current ${className}`}>
          <div className="flex items-center gap-2">
            {showFlag && <Globe className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {currentLanguage.code.toUpperCase()}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.id} value={language.code}>
              <div className="flex items-center gap-2 w-full">
                <span>{language.native_name || language.name}</span>
                <Badge variant="outline" className="text-xs">
                  {language.code.toUpperCase()}
                </Badge>
                {language.direction === 'rtl' && (
                  <Badge variant="secondary" className="text-xs">
                    RTL
                  </Badge>
                )}
                {language.code === currentLanguage.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="text-sm font-medium">{ui.language()}</label>
        <Select value={currentLanguage.code} onValueChange={changeLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{currentLanguage.native_name || currentLanguage.name}</span>
                <Badge variant="outline" className="text-xs">
                  {currentLanguage.code.toUpperCase()}
                </Badge>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.id} value={language.code}>
                <div className="flex items-center gap-2 w-full">
                  <span>{language.native_name || language.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {language.code.toUpperCase()}
                  </Badge>
                  {language.direction === 'rtl' && (
                    <Badge variant="secondary" className="text-xs">
                      RTL
                    </Badge>
                  )}
                  {language.code === currentLanguage.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Dropdown variant - just the buttons
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {languages.map((language) => (
        <Button
          key={language.id}
          variant={language.code === currentLanguage.code ? "default" : "outline"}
          size="sm"
          onClick={() => changeLanguage(language.code)}
          className="h-8 px-3 text-xs"
        >
          {language.code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;