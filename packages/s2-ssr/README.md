# @antv/s2-ssr

[简体中文](./README.zh-CN.md) | English

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

### Prerequisites

Before importing `@antv/s2-ssr`, you need to set up CSS module loaders. This is required because `@antv/s2` imports CSS files that Node.js cannot handle natively:

```javascript
// Must be set BEFORE importing @antv/s2-ssr
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

// Now you can import and use the package
const { createSpreadsheet } = require('@antv/s2-ssr');
```

### Basic Usage

```javascript
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

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

### Theme Configuration

S2 provides multiple built-in themes that can be configured via the `themeCfg` option:

```javascript
// Dark theme
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    name: 'dark', // 'default' | 'dark' | 'colorful' | 'gray'
  },
});

spreadsheet.exportToFile('./output-dark.png');
```

You can also customize the theme:

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    theme: {
      cornerCell: {
        cell: {
          backgroundColor: '#1a1a2e',
        },
      },
    },
  },
});
```

For detailed theme configuration, see the [S2 Theme Documentation](https://s2.antv.antgroup.com/en/manual/basic/theme).

## Jest Configuration

If you're using Jest to test code that imports `@antv/s2-ssr`, you'll need to configure Jest to handle CSS files. The `require.extensions` approach used by this package only works at Node.js runtime, not within Jest's module system.

Add the following to your `jest.config.js` or `jest.config.ts`:

```javascript
module.exports = {
  // ... other config
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
```

Then create the mock files:

**`__mocks__/styleMock.js`**

```javascript
module.exports = {};
```

**`__mocks__/fileMock.js`**

```javascript
module.exports = 'file-stub';
```

This tells Jest to mock CSS/LESS/SVG imports with empty modules, preventing parse errors.

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
| `themeCfg` | `ThemeCfg` | - | Theme configuration |
| `autoFit` | `boolean` | `true` | Auto crop canvas to actual table size, remove blank areas |
| `devicePixelRatio` | `number` | `2` | Device pixel ratio |
| `outputType` | `'image' \| 'svg' \| 'pdf'` | `'image'` | Output type |
| `imageType` | `'png' \| 'jpeg'` | `'png'` | Image type (when outputType is 'image') |
| `waitForRender` | `number` | `100` | Wait time (ms) for async rendering to complete |
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

## Development

If you're developing `@antv/s2-ssr` within the S2 monorepo, follow these steps:

### 1. Enable canvas build script

The `canvas` package requires its install script to run in order to download prebuilt binaries. Ensure `canvas` is listed in `onlyBuiltDependencies` in `pnpm-workspace.yaml`:

```yaml
onlyBuiltDependencies:
  - canvas
```

Then reinstall dependencies:

```bash
pnpm install
```

### 2. Build s2-core

The s2-ssr package depends on `@antv/s2` which is linked to the local `s2-core` package. You need to build the CommonJS output:

```bash
pnpm core:build
```

### 3. Build s2-ssr

```bash
cd packages/s2-ssr
pnpm build
```

### 4. Run examples

```bash
node examples/grid-english.js
```

## License

MIT
