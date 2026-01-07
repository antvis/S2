#!/usr/bin/env node
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

/**
 * SSR Unit Test Runner
 * Uses Node.js directly instead of Jest to avoid jsdom/node-canvas conflicts
 */

// Mock CSS/LESS/SVG imports
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

// Setup browser globals for SSR
global.navigator = {
  userAgent: 'node',
  language: 'en-US',
  platform: 'node',
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
  getElementById: () => null,
  createElementNS: (ns, tag) => global.document.createElement(tag),
  body: { appendChild: () => {}, removeChild: () => {}, style: {} },
  documentElement: { style: {} },
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
};

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

// Now run tests
const path = require('path');
const fs = require('fs');
const { createSpreadsheet } = require('../dist/s2-ssr.cjs');

const ASSETS_DIR = path.join(__dirname, 'assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const pivotData = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type'],
    values: ['price'],
  },
  data: [
    { province: '浙江', city: '杭州', type: '笔', price: 10 },
    { province: '浙江', city: '杭州', type: '纸张', price: 20 },
    { province: '浙江', city: '宁波', type: '笔', price: 15 },
    { province: '浙江', city: '宁波', type: '纸张', price: 25 },
  ],
};

const tableData = {
  fields: {
    columns: ['province', 'city', 'type', 'price'],
  },
  data: [
    { province: '浙江', city: '杭州', type: '笔', price: 10 },
    { province: '浙江', city: '宁波', type: '纸张', price: 20 },
  ],
};

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

async function runTests() {
  console.log('\n📊 S2-SSR Unit Tests\n');
  console.log('PivotSheet:');

  // Test: PivotSheet PNG
  await test('image png', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      dataCfg: pivotData,
    });
    const buffer = spreadsheet.toBuffer();

    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'pivot.png'));
    spreadsheet.destroy();
  });

  // Test: PivotSheet JPEG
  await test('image jpeg', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      imageType: 'jpeg',
      dataCfg: pivotData,
    });
    const buffer = spreadsheet.toBuffer();

    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'pivot.jpeg'));
    spreadsheet.destroy();
  });

  // Test: PivotSheet SVG
  await test('file svg', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      outputType: 'svg',
      dataCfg: pivotData,
    });

    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'pivot.svg'));
    assert(
      fs.existsSync(path.join(ASSETS_DIR, 'pivot.svg')),
      'SVG file not created',
    );
    spreadsheet.destroy();
  });

  // Test: toDataURL
  await test('toDataURL', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      dataCfg: pivotData,
    });
    const dataURL = spreadsheet.toDataURL();

    assert(
      dataURL.startsWith('data:image/png;base64,'),
      'Invalid dataURL format',
    );
    assert(dataURL.length > 100, 'DataURL too short');
    spreadsheet.destroy();
  });

  // Test: toBuffer
  await test('toBuffer', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      dataCfg: pivotData,
    });
    const buffer = spreadsheet.toBuffer();

    assert(Buffer.isBuffer(buffer), 'Result is not a Buffer');
    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.destroy();
  });

  console.log('\nTableSheet:');

  // Test: TableSheet PNG
  await test('image png', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'table',
      width: 400,
      height: 200,
      dataCfg: tableData,
    });
    const buffer = spreadsheet.toBuffer();

    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'table.png'));
    spreadsheet.destroy();
  });

  // Test: TableSheet JPEG
  await test('image jpeg', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'table',
      width: 400,
      height: 200,
      imageType: 'jpeg',
      dataCfg: tableData,
    });
    const buffer = spreadsheet.toBuffer();

    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'table.jpeg'));
    spreadsheet.destroy();
  });

  // Summary
  console.log('\n---');
  console.log(`Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
