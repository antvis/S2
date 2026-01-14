/* eslint-disable max-classes-per-file */
// @ts-nocheck - This file contains intentionally minimal mock implementations
/**
 * Node.js environment setup for SSR
 *
 * This module sets up browser-like globals required by S2 and its dependencies
 * in a Node.js environment. It must be imported before any other S2 modules.
 */

/**
 * Check if we're running in Node.js environment
 */
function isNodeEnvironment(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null &&
    typeof window === 'undefined'
  );
}

/**
 * Setup mock CSS/LESS/SVG module loaders for Node.js
 */
function setupModuleExtensions(): void {
  if (typeof require !== 'undefined' && (require as NodeRequire).extensions) {
    (require as NodeRequire).extensions['.css'] = () => {};
    (require as NodeRequire).extensions['.less'] = () => {};
    (require as NodeRequire).extensions['.svg'] = () => {};
  }
}

/**
 * Setup browser-like globals in Node.js environment
 */
function setupBrowserGlobals(): void {
  const g = globalThis as typeof globalThis & {
    navigator: unknown;
    document: unknown;
    window: unknown;
    HTMLElement: unknown;
    HTMLCanvasElement: unknown;
    HTMLImageElement: unknown;
    requestAnimationFrame: unknown;
    cancelAnimationFrame: unknown;
    performance: unknown;
    ResizeObserver: unknown;
    MutationObserver: unknown;
    PointerEvent: unknown;
    CustomEvent: unknown;
  };

  // Mock navigator
  g.navigator = {
    userAgent: 'node',
    language: 'en-US',
    platform: 'node',
  };

  // Mock document (before window so window.document works)
  g.document = {
    createElement: (tag: string) => ({
      tagName: tag.toUpperCase(),
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      appendChild: () => {},
      removeChild: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      classList: {
        add: () => {},
        remove: () => {},
        contains: () => false,
      },
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }),
      getContext: () => null,
      toDataURL: () => '',
    }),
    getElementById: () => null,
    createElementNS: (_ns: string, tag: string) =>
      (g.document as { createElement: (tag: string) => unknown }).createElement(
        tag,
      ),
    body: {
      appendChild: () => {},
      removeChild: () => {},
      style: {},
    },
    documentElement: {
      style: {},
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
  };

  // Mock window (after document)
  g.window = {
    navigator: g.navigator,
    document: g.document,
    devicePixelRatio: 2,
    addEventListener: () => {},
    removeEventListener: () => {},
    getComputedStyle: () => ({
      getPropertyValue: () => '',
    }),
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
    requestAnimationFrame: (cb: FrameRequestCallback) =>
      setTimeout(cb as unknown as () => void, 16),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
    location: { href: 'http://localhost/' },
  };

  // Mock HTML element classes
  g.HTMLElement = class HTMLElement {};
  g.HTMLCanvasElement = class HTMLCanvasElement {};
  g.HTMLImageElement = class HTMLImageElement {};

  // Mock animation frame APIs
  g.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(cb as unknown as () => void, 16);
  g.cancelAnimationFrame = (id: number) => clearTimeout(id);

  // Mock performance API
  g.performance = {
    now: () => Date.now(),
  };

  // Mock observer classes
  g.ResizeObserver = class ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  };

  g.MutationObserver = class MutationObserver {
    observe() {}

    disconnect() {}
  };

  // Mock event classes
  g.PointerEvent = class PointerEvent {
    type: string;

    constructor(type: string, opts?: Record<string, unknown>) {
      this.type = type;
      Object.assign(this, opts);
    }
  };

  g.CustomEvent = class CustomEvent {
    type: string;

    detail?: unknown;

    constructor(type: string, opts?: { detail?: unknown }) {
      this.type = type;
      this.detail = opts?.detail;
    }
  };
}

/**
 * Setup Node.js environment for SSR
 *
 * Call this function before importing any S2 modules to ensure
 * browser-like globals are available.
 *
 * @example
 * ```ts
 * import { setupNodeEnvironment } from '@antv/s2-ssr/env';
 * setupNodeEnvironment();
 *
 * // Now import S2
 * import { createSpreadsheet } from '@antv/s2-ssr';
 * ```
 */
export function setupNodeEnvironment(): void {
  if (!isNodeEnvironment()) {
    return;
  }

  setupModuleExtensions();
  setupBrowserGlobals();
}
