/**
 * SSR (Server-Side Rendering) environment detection utilities
 */

/**
 * Check if running in SSR (Node.js) environment
 * Returns true if window is not defined (typical Node.js environment)
 */
export function isSSR(): boolean {
  return typeof window === 'undefined';
}

/**
 * Check if document is available (browser environment)
 */
export function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

/**
 * Check if navigator is available (browser environment)
 */
export function hasNavigator(): boolean {
  return typeof navigator !== 'undefined';
}
