---
title: Server-Side Rendering (SSR)
order: 10
tag: New
---

<Badge>@antv/s2-ssr</Badge>

## Introduction

In certain scenarios, you may need to generate table images on the server side (Node.js environment), such as:

- 📧 **Email Reports**: Embed table data as images in emails
- 🤖 **Chat Bots**: Push table screenshots to DingTalk, Slack, Lark, etc.
- 📊 **Scheduled Reports**: Automatically generate data reports and save as images
- 🖨️ **Print Services**: Generate high-quality table images for printing

S2 provides the `@antv/s2-ssr` package, which allows you to render PivotSheet and TableSheet in Node.js environments and export them to **PNG, JPEG, SVG, or PDF** formats.

## Installation

```bash
npm install @antv/s2-ssr
# or
pnpm add @antv/s2-ssr
# or
yarn add @antv/s2-ssr
```

:::warning{title="Prerequisites"}

`@antv/s2-ssr` depends on [node-canvas](https://github.com/Automattic/node-canvas), which requires Cairo and Pango graphics libraries to be installed.

**macOS:**

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Ubuntu/Debian:**

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**Windows:**
Please refer to the [node-canvas installation guide](https://github.com/Automattic/node-canvas#compiling)

:::

## Basic Usage

:::warning{title="Environment Setup"}

Before importing `@antv/s2-ssr`, you need to set up CSS module loaders. This is required because `@antv/s2` imports CSS files that Node.js cannot handle natively:

```javascript
// Must be set BEFORE importing @antv/s2-ssr
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};
```

:::

### Export PivotSheet

```javascript
// Set up CSS module loaders
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

const { createSpreadsheet } = require('@antv/s2-ssr');

async function main() {
  const spreadsheet = await createSpreadsheet({
    sheetType: 'pivot',
    width: 600,
    height: 400,
    dataCfg: {
      fields: {
        rows: ['province', 'city'],
        columns: ['type'],
        values: ['price'],
      },
      data: [
        { province: 'Zhejiang', city: 'Hangzhou', type: 'Pen', price: 10 },
        { province: 'Zhejiang', city: 'Hangzhou', type: 'Paper', price: 20 },
        { province: 'Zhejiang', city: 'Ningbo', type: 'Pen', price: 15 },
        { province: 'Zhejiang', city: 'Ningbo', type: 'Paper', price: 25 },
      ],
    },
  });

  // Export to file
  spreadsheet.exportToFile('./pivot-table.png');

  // Clean up resources
  spreadsheet.destroy();
}

main();
```

![PivotSheet](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*cHFySYcOKEsAAAAAQGAAAAgAemJ7AQ/fmt.avif)

### Export TableSheet

```javascript
const { createSpreadsheet } = require('@antv/s2-ssr');

async function main() {
  const spreadsheet = await createSpreadsheet({
    sheetType: 'table',
    width: 500,
    height: 300,
    dataCfg: {
      fields: {
        columns: ['province', 'city', 'type', 'price'],
      },
      data: [
        { province: 'Zhejiang', city: 'Hangzhou', type: 'Pen', price: 10 },
        { province: 'Zhejiang', city: 'Ningbo', type: 'Paper', price: 20 },
      ],
    },
  });

  spreadsheet.exportToFile('./table-sheet.png');
  spreadsheet.destroy();
}

main();
```

![TableSheet](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*pp96Qr9HP-EAAAAAQFAAAAgAemJ7AQ/fmt.avif)

## Export Formats

### PNG / JPEG

Export as PNG by default, or specify JPEG:

```javascript
// PNG (default)
const spreadsheet = await createSpreadsheet({
  ...options,
  imageType: 'png',
});

// JPEG
const spreadsheet = await createSpreadsheet({
  ...options,
  imageType: 'jpeg',
});

spreadsheet.exportToFile('./output.png');
```

### SVG

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  outputType: 'svg',
});

spreadsheet.exportToFile('./output.svg');
```

### PDF

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  outputType: 'pdf',
});

spreadsheet.exportToFile('./output.pdf');
```

## Theme Configuration

S2 SSR fully supports S2's theme system. You can use built-in themes or custom themes:

### Built-in Themes

```javascript
// Dark theme
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    name: 'dark', // Options: 'default' | 'dark' | 'colorful' | 'gray'
  },
});
```

![Dark Theme](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*hSipR7SMWMwAAAAAQGAAAAgAemJ7AQ/fmt.avif)

```javascript
// Colorful theme
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    name: 'colorful',
  },
});
```

![Colorful Theme](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*GckgTbAX_7EAAAAAQGAAAAgAemJ7AQ/fmt.avif)

### Custom Theme

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
      colCell: {
        cell: {
          backgroundColor: '#16213e',
        },
      },
    },
  },
});
```

For more theme configuration options, see the [Theme Documentation](/en/manual/basic/theme).

## Alternative Export Methods

Besides exporting to files, you can also get Buffer or DataURL:

```javascript
const spreadsheet = await createSpreadsheet(options);

// Get Buffer (useful for uploading to OSS, sending emails, etc.)
const buffer = spreadsheet.toBuffer();

// Get Base64 DataURL (useful for embedding in HTML)
const dataURL = spreadsheet.toDataURL();

spreadsheet.destroy();
```

## Configuration Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `sheetType` | `'pivot' \| 'table'` | `'pivot'` | Type of spreadsheet |
| `width` | `number` | - | Canvas width (pixels) |
| `height` | `number` | - | Canvas height (pixels) |
| `dataCfg` | `S2DataConfig` | - | Data configuration, same as browser side |
| `options` | `S2Options` | `{}` | Sheet options, same as browser side |
| `themeCfg` | `ThemeCfg` | - | Theme configuration |
| `devicePixelRatio` | `number` | `2` | Device pixel ratio, affects image clarity |
| `autoFit` | `boolean` | `true` | Auto crop canvas to actual table size, remove blank areas |
| `outputType` | `'image' \| 'svg' \| 'pdf'` | `'image'` | Output type |
| `imageType` | `'png' \| 'jpeg'` | `'png'` | Image format |
| `waitForRender` | `number` | `100` | Wait time for rendering (milliseconds) |

## CLI Tool

`@antv/s2-ssr` also provides a command-line tool:

```bash
npx s2-ssr export -i data.json -o output.png
```

Where `data.json` is the configuration file:

```json
{
  "sheetType": "pivot",
  "width": 600,
  "height": 400,
  "dataCfg": {
    "fields": {
      "rows": ["province", "city"],
      "columns": ["type"],
      "values": ["price"]
    },
    "data": [
      { "province": "Zhejiang", "city": "Hangzhou", "type": "Pen", "price": 10 }
    ]
  }
}
```

## FAQ

### Q: What if the image is blank?

Please ensure:

1. The `data` array is not empty
2. The `fields` configuration is correct (PivotSheet needs rows/columns/values, TableSheet needs columns)
3. Increase the `waitForRender` value appropriately (e.g., 100ms)

### Q: Font display is incorrect?

SSR environment uses system fonts by default. For custom fonts, refer to [node-canvas font configuration](https://github.com/Automattic/node-canvas#registerFont).

### Q: How to improve image clarity?

Increase the `devicePixelRatio` value:

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  devicePixelRatio: 3, // Default is 2
});
```
