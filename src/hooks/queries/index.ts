// Page data hooks
export {
  usePageDataById,
  usePageDataByUrl,
  usePagesList,
  usePrefetchPage,
  pageKeys,
  type PageData,
} from './usePageData';

// Page mutation hooks
export {
  useUpdatePage,
  useCreatePage,
  useDeletePage,
} from './usePageMutations';

// Language and currency hooks
export {
  useLanguages,
  useCurrencies,
  useDefaultLanguage,
  useDefaultCurrency,
  languageKeys,
  currencyKeys,
  type Language,
  type Currency,
} from './useLanguages';

// Translation hooks (legacy namespace-based - used by Header/Footer)
export {
  useTranslationsByNamespace,
  usePageTranslationsQuery,
  translationKeys,
  type Translation,
} from './useTranslationsQuery';

// Autosave hook
export {
  useAutosave,
  type SaveStatus,
} from './useAutosave';

// Real-time hooks
export {
  usePageRealtime,
  usePagesListRealtime,
} from './usePageRealtime';

// Other pages hook (for section import)
export {
  useOtherPages,
  otherPagesKeys,
} from './useOtherPages';
