/**
 * Translation Engine Types
 * 
 * Core types for the enterprise-grade translation system.
 */

// ============================================================================
// Status Types
// ============================================================================

export type TranslationStatus = 'untranslated' | 'ai_translated' | 'reviewed' | 'edited' | 'stale';

// ============================================================================
// Translation Key Registry
// ============================================================================

export interface TranslationKeyRecord {
  id: string;
  key: string;                    // e.g., "page.home.hero_0.title"
  sourceText: string;             // Original text in source language
  sourceLanguage: string;         // e.g., "en"
  context?: string;               // Context for AI translation
  pageId: string | null;          // Link to page (null for global keys)
  sectionId?: string;             // Section instance ID
  sectionType?: string;           // e.g., "hero"
  propPath?: string;              // e.g., "title" or "features.0.name"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Translation Entry (per language)
// ============================================================================

export interface TranslationEntry {
  id: string;
  key: string;
  languageId: string;
  languageCode?: string;
  value: string | null;
  status: TranslationStatus;
  sourceText?: string;
  sourceLanguage?: string;
  context?: string;
  aiProvider?: string;
  aiTranslatedAt?: Date;
  manuallyEditedAt?: Date;
  updatedAt: Date;
}

// ============================================================================
// Coverage Statistics
// ============================================================================

export interface TranslationCoverage {
  pageId: string;
  pageUrl?: string;
  pageTitle?: string;
  languageId: string;
  languageCode: string;
  languageName: string;
  totalKeys: number;
  translatedKeys: number;
  untranslatedCount: number;
  aiTranslatedCount: number;
  reviewedCount: number;
  editedCount: number;
  coveragePercentage: number;
}

export interface SectionCoverage {
  sectionId: string;
  sectionType: string;
  totalProps: number;
  boundProps: number;
  translatedProps: Record<string, number>; // languageCode → count
}

// ============================================================================
// Key Binding Map
// ============================================================================

// Maps propPath → translationKey
export type TranslationKeyMap = Record<string, string>;

// ============================================================================
// Validation
// ============================================================================

export type ValidationErrorType = 
  | 'missing_key' 
  | 'orphan_prop' 
  | 'duplicate_key' 
  | 'stale_source'
  | 'missing_source';

export interface ValidationError {
  type: ValidationErrorType;
  sectionId?: string;
  propPath?: string;
  key?: string;
  message: string;
}

export interface ValidationWarning {
  type: string;
  sectionId?: string;
  propPath?: string;
  key?: string;
  message: string;
}

export interface PageValidationResult {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// ============================================================================
// AI Translation
// ============================================================================

export interface AITranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguages: { code: string; name: string }[];
  context?: string;
}

export interface AITranslationResult {
  translations: Record<string, string>; // languageCode → translatedText
  error?: string;
}

export interface BulkTranslationJob {
  keys: string[];
  targetLanguages: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: Record<string, Record<string, string>>; // key → languageCode → value
  error?: string;
}

// ============================================================================
// Key Generation
// ============================================================================

export interface KeyGenerationOptions {
  pageSlug: string;
  sectionType: string;
  /** Stable section ID (UUID) - used for key generation instead of volatile index */
  sectionId: string;
  propPath: string;
  scope?: 'page' | 'common' | 'header' | 'footer';
  /** @deprecated Use sectionId instead - indices change when sections are reordered */
  sectionIndex?: number;
}

// ============================================================================
// Translation Context Value
// ============================================================================

export interface TranslationEngineContextValue {
  // Key Management
  registerKey: (options: {
    key: string;
    sourceText: string;
    pageId: string;
    sectionId: string;
    sectionType: string;
    propPath: string;
    context?: string;
  }) => Promise<void>;
  unregisterKey: (key: string) => Promise<void>;
  getKeysByPage: (pageId: string) => TranslationKeyRecord[];
  getKeysBySection: (sectionId: string) => TranslationKeyRecord[];
  
  // Translation Values
  getTranslation: (key: string, languageCode: string) => string | null;
  setTranslation: (key: string, languageCode: string, value: string, status?: TranslationStatus) => Promise<void>;
  getTranslationsForLanguage: (languageCode: string) => Record<string, string>;
  
  // AI Translation
  translateWithAI: (request: AITranslationRequest) => Promise<AITranslationResult>;
  translateKeys: (keys: string[], targetLanguages: string[]) => Promise<void>;
  
  // Coverage
  getCoverage: (pageId: string) => TranslationCoverage[];
  getSectionCoverage: (sectionId: string) => SectionCoverage | null;
  
  // Validation
  validatePage: (pageId: string) => Promise<PageValidationResult>;
  
  // State
  isLoading: boolean;
  currentLanguage: string;
  setCurrentLanguage: (code: string) => void;
}
