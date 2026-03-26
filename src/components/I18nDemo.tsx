import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/contexts/I18nContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Badge } from '@/components/ui/badge';
import { Globe, Zap, CheckCircle } from 'lucide-react';

// Demo component to showcase i18n functionality
const I18nDemo: React.FC = () => {
  const { t, common, auth, ui, errors } = useTranslation();
  const { currentLanguage, isRTL } = useI18n();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Internationalization Demo
          {isRTL && <Badge variant="secondary">RTL</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Current Language</h3>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {currentLanguage?.code.toUpperCase()} - {currentLanguage?.native_name || currentLanguage?.name}
            </Badge>
            <Badge variant={isRTL ? "default" : "secondary"}>
              {currentLanguage?.direction.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Language Selector</h3>
          <LanguageSelector variant="full" />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Translation Examples</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Common Actions</h4>
              <div className="space-y-1">
                <Button size="sm" variant="outline">{common.save()}</Button>
                <Button size="sm" variant="outline">{common.cancel()}</Button>
                <Button size="sm" variant="outline">{common.delete()}</Button>
                <Button size="sm" variant="outline">{common.edit()}</Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">UI Elements</h4>
              <div className="space-y-1">
                <div className="text-sm">{ui.dashboard()}</div>
                <div className="text-sm">{ui.settings()}</div>
                <div className="text-sm">{ui.profile()}</div>
                <div className="text-sm">{ui.language()}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Direct Translation</h3>
          <p className="text-sm text-muted-foreground">
            Using t() function: <strong>{t('common.welcome', { name: 'Developer' })}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-800">
            i18n system is working! Translations load from your Supabase database in real-time.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default I18nDemo;