# @antv/s2-ssr

Server-side rendering (SSR) support for [S2](https://github.com/antvis/S2) using [node-canvas](https://github.com/Automattic/node-canvas).

This package allows you to render S2 PivotSheet and TableSheet to PNG, JPEG, SVG, or PDF formats in Node.js environments.

## Installation

```bash
npm install @antv/s2-ssr
# or
pnpm add @antv/s2-ssr
```

> **Note**: This package requires [node-canvas](https://github.com/Automattic/node-canvas) which needs Cairo and Pango. See the [node-canvas installation guide](https://github.com/Automattic/node-canvas#compiling) for platform-specific instructions.

## Usage

### Basic Usage

```javascript
const { createSpreadsheet } = require('@antv/s2-ssr');

const options = {
  sheetType: 'pivot', // or 'table'
  width: 800,
  height: 600,
  dataCfg: {
    fields: {
      rows: ['province', 'city'],
      columns: ['type'],
      values: ['price'],
    },
    data: [
      { province: 'Province A', city: 'City 1', type: 'Type A', price: 100 },
      { province: 'Province A', city: 'City 2', type: 'Type B', price: 200 },
    ],
  },
  options: {
    // S2 options
  },
};

(async () => {
  const spreadsheet = await createSpreadsheet(options);

  // Export to file
  spreadsheet.exportToFile('./output.png');

  // Or get as buffer
  const buffer = spreadsheet.toBuffer();

  // Or get as data URL
  const dataURL = spreadsheet.toDataURL();

  // Clean up
  spreadsheet.destroy();
})();
```

### Export Formats

#### PNG/JPEG (default)

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  imageType: 'png', // or 'jpeg'
});

spreadsheet.exportToFile('./output.png');
```

#### SVG

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  outputType: 'svg',
});

spreadsheet.exportToFile('./output.svg');
```

#### PDF

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  outputType: 'pdf',
});

spreadsheet.exportToFile('./output.pdf');
```

## API

### `createSpreadsheet(options)`

Creates a spreadsheet instance for SSR.

#### Options

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `sheetType` | `'pivot' \| 'table'` | `'pivot'` | Type of spreadsheet to create |
| `width` | `number` | - | Canvas width |
| `height` | `number` | - | Canvas height |
| `dataCfg` | `S2DataConfig` | - | S2 data configuration |
| `options` | `S2Options` | `{}` | S2 options |
| `devicePixelRatio` | `number` | `2` | Device pixel ratio |
| `outputType` | `'image' \| 'svg' \| 'pdf'` | `'image'` | Output type |
| `imageType` | `'png' \| 'jpeg'` | `'png'` | Image type (when outputType is 'image') |
| `waitForRender` | `number` | `32` | Wait time (ms) for async rendering to complete |
| `renderPlugins` | `any[]` | `[]` | Additional G render plugins |

#### Returns

Returns a `Spreadsheet` object with the following methods:

| Method | Description |
| --- | --- |
| `exportToFile(path, meta?)` | Export to a file |
| `toBuffer(meta?)` | Get as Node.js Buffer |
| `toDataURL()` | Get as base64 data URL |
| `getCanvas()` | Get the underlying node-canvas instance |
| `destroy()` | Clean up resources |

### `createCanvas(options)`

Creates a raw G Canvas with node-canvas for advanced usage.

## Node.js Environment Setup

When using this package, you need to set up browser globals in your Node.js environment. For jsdom users, this is typically handled automatically. For other environments:

```javascript
// Setup before importing @antv/s2-ssr
global.navigator = { userAgent: 'node' };
global.window = { navigator: global.navigator };
global.document = {
  createElement: () => ({ style: {} }),
  body: { style: {} },
};
```

## License

MIT
