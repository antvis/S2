#!/usr/bin/env node
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

// Setup browser globals for SSR before loading any modules
global.navigator = {
  userAgent: 'node',
  language: 'en-US',
  platform: 'node',
};

global.window = {
  navigator: global.navigator,
  devicePixelRatio: 2,
  addEventListener: () => {},
  removeEventListener: () => {},
  getComputedStyle: () => new Proxy({}, { get: () => '' }),
  setTimeout: global.setTimeout,
  clearTimeout: global.clearTimeout,
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id),
};

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
  createElementNS: (ns, tag) => global.document.createElement(tag),
  body: { appendChild: () => {}, removeChild: () => {}, style: {} },
  documentElement: { style: {} },
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
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
  .command('export', 'Export S2 Spreadsheet to Image, PDF or SVG')
  .option('-i, --input <inputPath>', 'Path to the S2 spec file')
  .option('-o, --output <outputPath>', 'Path to the export file')
  .option('-t, --type [type]', 'File type, default is image')
  .action(async (options) => {
    const { input, output, type } = options;

    if (!input) {
      console.log(
        '\x1b[31m%s\x1b[0m',
        'Please provide a path to the S2 spec file',
      );
      process.exit(1);
    }

    if (!fs.existsSync(input)) {
      console.log('\x1b[31m%s\x1b[0m', 'File does not exist: ', input);
      process.exit(1);
    }

    let spec;

    try {
      spec = JSON.parse(fs.readFileSync(input, 'utf-8'));
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', 'Invalid JSON file');
      process.exit(1);
    }

    if (!spec.outputType) {
      if (type === 'svg' || type === 'pdf') {
        spec.outputType = type;
      }
    }

    console.log(`Exporting to ${type || 'image'}...`);

    const spreadsheet = await createSpreadsheet(spec);

    spreadsheet.exportToFile(output, type);

    console.log('\x1b[32m%s\x1b[0m', 'Exported successfully!');

    spreadsheet.destroy();

    process.exit(0);
  });

cli.help();

cli.parse();
