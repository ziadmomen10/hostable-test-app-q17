/**
 * Environment-Aware Logger
 * 
 * Provides logging utilities that are active in development but silent in production.
 * This prevents console spam in production builds while keeping helpful debug info during development.
 * 
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Something happened');
 *   logger.editor.debug('Section updated', sectionId);
 */

// ============================================================================
// Environment Check
// ============================================================================

const isDevelopment = typeof window !== 'undefined' 
  ? (import.meta.env?.DEV ?? false) 
  : process.env.NODE_ENV !== 'production';

// ============================================================================
// Types
// ============================================================================

type LogMethod = (...args: unknown[]) => void;

interface NamedLogger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
}

// ============================================================================
// Logger Factory
// ============================================================================

function createNamedLogger(name: string): NamedLogger {
  const prefix = `[${name}]`;
  
  return {
    debug: (...args) => isDevelopment && console.log(prefix, ...args),
    info: (...args) => isDevelopment && console.log(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args), // Always show warnings
    error: (...args) => console.error(prefix, ...args), // Always show errors
  };
}

// ============================================================================
// Main Logger
// ============================================================================

/**
 * Main logger with named sub-loggers for different domains.
 * 
 * Debug and info logs only appear in development.
 * Warnings and errors always appear (for production debugging).
 */
export const logger = {
  // Generic logging methods
  debug: (...args: unknown[]) => isDevelopment && console.log('[DEBUG]', ...args),
  info: (...args: unknown[]) => isDevelopment && console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
  
  // Named loggers for specific domains
  editor: createNamedLogger('Editor'),
  auth: createNamedLogger('Auth'),
  presence: createNamedLogger('Presence'),
  autosave: createNamedLogger('Autosave'),
  translation: createNamedLogger('Translation'),
  grid: createNamedLogger('Grid'),
  dnd: createNamedLogger('DnD'),
  api: createNamedLogger('API'),
};

// ============================================================================
// Utility for Creating Custom Named Loggers
// ============================================================================

/**
 * Create a custom named logger for a specific module.
 * 
 * @param name - The name to prefix logs with
 * @returns A logger object with debug, info, warn, error methods
 * 
 * @example
 * const myLogger = createLogger('MyComponent');
 * myLogger.debug('Component mounted');
 */
export const createLogger = createNamedLogger;

export default logger;
