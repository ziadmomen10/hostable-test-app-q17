import { useIntl } from '@/contexts/I18nContext';

// Simple hook for common translation patterns
export const useTranslation = (namespace?: string) => {
  const { t, tn, currentLanguage, locale, isRTL } = useIntl();

  // Helper for namespaced translations
  const translate = (key: string, values?: Record<string, any>) => {
    if (namespace) {
      return tn(namespace, key, values);
    }
    return t(key, values);
  };

  // Common translation helpers
  const common = {
    save: () => t('common.save'),
    cancel: () => t('common.cancel'),
    delete: () => t('common.delete'),
    edit: () => t('common.edit'),
    add: () => t('common.add'),
    loading: () => t('common.loading'),
    error: () => t('common.error'),
    success: () => t('common.success'),
    yes: () => t('common.yes'),
    no: () => t('common.no'),
    ok: () => t('common.ok'),
    close: () => t('common.close'),
    search: () => t('common.search'),
    filter: () => t('common.filter'),
    clear: () => t('common.clear'),
    reset: () => t('common.reset'),
    submit: () => t('common.submit'),
    next: () => t('common.next'),
    previous: () => t('common.previous'),
    back: () => t('common.back'),
    continue: () => t('common.continue'),
    confirm: () => t('common.confirm')
  };

  const auth = {
    login: () => t('auth.login'),
    logout: () => t('auth.logout'),
    register: () => t('auth.register'),
    password: () => t('auth.password'),
    email: () => t('auth.email'),
    username: () => t('auth.username'),
    forgotPassword: () => t('auth.forgot_password'),
    resetPassword: () => t('auth.reset_password'),
    changePassword: () => t('auth.change_password')
  };

  const ui = {
    welcome: () => t('ui.welcome'),
    dashboard: () => t('ui.dashboard'),
    settings: () => t('ui.settings'),
    profile: () => t('ui.profile'),
    notifications: () => t('ui.notifications'),
    preferences: () => t('ui.preferences'),
    language: () => t('ui.language'),
    theme: () => t('ui.theme'),
    help: () => t('ui.help'),
    support: () => t('ui.support')
  };

  const errors = {
    required: (field?: string) => t('errors.required', { field }),
    invalid: (field?: string) => t('errors.invalid', { field }),
    network: () => t('errors.network'),
    server: () => t('errors.server'),
    unauthorized: () => t('errors.unauthorized'),
    forbidden: () => t('errors.forbidden'),
    notFound: () => t('errors.not_found'),
    validation: () => t('errors.validation')
  };

  return {
    t: translate,
    currentLanguage,
    locale,
    isRTL,
    common,
    auth,
    ui,
    errors
  };
};