// Mock browser globals for SSR testing

/* eslint-disable max-classes-per-file */
// Mock navigator
global.navigator = {
  userAgent: 'node',
  language: 'en-US',
  platform: 'node',
};

// Mock window
global.window = {
  navigator: global.navigator,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => ({}),
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
};

// Mock document
global.document = {
  createElement: (tag) => ({
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
  createElementNS: (ns, tag) => global.document.createElement(tag),
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

// Mock HTMLElement
global.HTMLElement = class HTMLElement {};
global.HTMLCanvasElement = class HTMLCanvasElement {};
global.HTMLImageElement = class HTMLImageElement {};

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock performance
global.performance = {
  now: () => Date.now(),
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  observe() {}

  disconnect() {}
};

// Mock PointerEvent
global.PointerEvent = class PointerEvent {
  constructor(type, options) {
    this.type = type;
    Object.assign(this, options);
  }
};

// Mock CustomEvent
global.CustomEvent = class CustomEvent {
  constructor(type, options) {
    this.type = type;
    this.detail = options?.detail;
  }
};
