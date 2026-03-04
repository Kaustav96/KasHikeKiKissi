/**
 * Centralized logging utility for production-safe logging
 * Only logs in development or when explicitly enabled
 */

const isDev = process.env.NODE_ENV !== 'production';
const isLoggingEnabled = process.env.ENABLE_LOGGING === 'true';

export const logger = {
  info: (...args: any[]) => {
    if (isDev || isLoggingEnabled) {
      console.log('[INFO]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDev || isLoggingEnabled) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors
    console.error('[ERROR]', ...args);
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },
};
