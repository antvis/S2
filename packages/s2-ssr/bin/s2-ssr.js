#!/usr/bin/env node
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

// Mock CSS/LESS/SVG imports
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

// Setup browser globals for SSR before loading any modules
global.navigator = {
  userAgent: 'node',
  language: 'en-US',
  platform: 'node',
};

// Define document first since window.document needs it
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
    classList: { add: () => {}, remove: () => {}, contains: () => false },
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
  createElementNS: (ns, tag) => global.document.createElement(tag),
  body: { appendChild: () => {}, removeChild: () => {}, style: {} },
  documentElement: { style: {} },
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
};

// Define window after document so window.document works
global.window = {
  navigator: global.navigator,
  document: global.document,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => ({
    getPropertyValue: () => '',
  }),
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
  location: { href: 'http://localhost/' },
};

global.HTMLElement = class HTMLElement {};
global.HTMLCanvasElement = class HTMLCanvasElement {};
global.HTMLImageElement = class HTMLImageElement {};
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.performance = { now: () => Date.now() };
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
};
global.MutationObserver = class MutationObserver {
  observe() {}

  disconnect() {}
};
global.PointerEvent = class PointerEvent {
  constructor(type, opts) {
    Object.assign(this, { type }, opts);
  }
};
global.CustomEvent = class CustomEvent {
  constructor(type, opts) {
    this.type = type;
    this.detail = opts?.detail;
  }
};

// Now load the actual module and CLI logic
const fs = require('fs');
const cac = require('cac');
const { createSpreadsheet } = require('../dist/s2-ssr.cjs');
const { version } = require('../package.json');

const cli = cac();

cli.version(version);

cli.command('version', 'Show version').action(() => {
  console.log(version);
});

cli
  .command('export', 'Export spreadsheet to image')
  .option('-i, --input <file>', 'Input specification file (JSON)')
  .option('-o, --output <file>', 'Output file path')
  .option('-t, --type <type>', 'Sheet type: pivot or table', {
    default: 'pivot',
  })
  .option('-w, --width <number>', 'Width in pixels', { default: 800 })
  .option('-h, --height <number>', 'Height in pixels', { default: 600 })
  .option('--image-type <type>', 'Image type: png or jpeg', { default: 'png' })
  .option('--output-type <type>', 'Output type: image, svg, or pdf', {
    default: 'image',
  })
  .option('--wait <ms>', 'Wait time for rendering in milliseconds', {
    default: 32,
  })
  .action(async (options) => {
    const { input, output, type, width, height, imageType, outputType, wait } =
      options;

    if (!input) {
      console.error('Error: Input file is required');
      process.exit(1);
    }

    if (!output) {
      console.error('Error: Output file is required');
      process.exit(1);
    }

    // Read input specification
    const specContent = fs.readFileSync(input, 'utf-8');
    const spec = JSON.parse(specContent);

    // Create spreadsheet and export
    const spreadsheet = await createSpreadsheet({
      sheetType: spec.sheetType || type,
      width: spec.width || parseInt(width, 10),
      height: spec.height || parseInt(height, 10),
      imageType: spec.imageType || imageType,
      outputType: spec.outputType || outputType,
      waitForRender: spec.waitForRender || parseInt(wait, 10),
      dataCfg: spec.dataCfg,
      options: spec.options,
    });

    spreadsheet.exportToFile(output);
    spreadsheet.destroy();
    console.log(`Exported to: ${output}`);
  });

cli.help();
cli.parse();
