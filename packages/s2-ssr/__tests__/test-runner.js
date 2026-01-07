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

// eslint-disable-next-line max-lines-per-function
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

  console.log('\nTheme:');

  // Test: Dark Theme
  await test('dark theme', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      dataCfg: pivotData,
      themeCfg: {
        name: 'dark',
      },
    });
    const buffer = spreadsheet.toBuffer();

    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'pivot-dark.png'));
    spreadsheet.destroy();
  });

  // Test: Colorful Theme
  await test('colorful theme', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 400,
      height: 300,
      dataCfg: pivotData,
      themeCfg: {
        name: 'colorful',
      },
    });
    const buffer = spreadsheet.toBuffer();

    assert(buffer.length > 1000, `Buffer too small: ${buffer.length} bytes`);
    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'pivot-colorful.png'));
    spreadsheet.destroy();
  });

  console.log('\nAutoFit:');

  // Test: AutoFit enabled (should crop to actual size with high DPI)
  await test('autoFit enabled', async () => {
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width: 800,
      height: 600,
      dataCfg: pivotData,
      autoFit: true,
      devicePixelRatio: 2,
    });
    const canvas = spreadsheet.getCanvas();
    // Expected height is small (around 122), width is 800 (logical) => physical 1600 x 244 (approx)
    const dpr = 2;

    // Width should be preserved (logical 800 -> physical 1600)
    assert(
      canvas.width === 800 * dpr,
      `Width should be ${800 * dpr}, got ${canvas.width}`,
    );

    // Height should be cropped (logical 122 -> physical 244), definitely less than original 600*2=1200
    assert(
      canvas.height < 600 * dpr,
      `Height should be cropped (< ${600 * dpr}), got ${canvas.height}`,
    );

    console.log(`     Cropped High-Res Size: ${canvas.width}x${canvas.height}`);

    spreadsheet.exportToFile(
      path.join(ASSETS_DIR, 'pivot-autofit-high-res.png'),
    );
    spreadsheet.destroy();
  });

  // Test: AutoFit disabled (should keep original canvas size)
  await test('autoFit disabled', async () => {
    // Create with large canvas but small data - should NOT crop
    const width = 800;
    const height = 600;
    const spreadsheet = await createSpreadsheet({
      sheetType: 'pivot',
      width,
      height,
      dataCfg: pivotData,
      autoFit: false,
    });
    const canvas = spreadsheet.getCanvas();

    // Should keep original dimensions (multiplied by DPR 2)
    const dpr = 2;

    assert(
      canvas.width === width * dpr && canvas.height === height * dpr,
      `Canvas should not be cropped: expected ${width * dpr}x${height * dpr}, got ${canvas.width}x${canvas.height}`,
    );
    console.log(`     Canvas size: ${canvas.width}x${canvas.height}`);

    spreadsheet.exportToFile(path.join(ASSETS_DIR, 'pivot-no-autofit.png'));
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
