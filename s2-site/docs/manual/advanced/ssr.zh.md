---
title: 服务端渲染 (SSR)
order: 10
tag: New
---

<Badge>@antv/s2-ssr</Badge>

## 简介

在某些场景下，我们需要在服务端（Node.js 环境）生成表格图片，比如：

- 📧 **邮件报表**：将表格数据以图片形式嵌入邮件发送
- 🤖 **即时通讯机器人**：在钉钉、企微、飞书等平台推送表格截图
- 📊 **定时报告**：自动化生成数据报表并保存为图片
- 🖨️ **打印服务**：服务端生成高清表格图片用于打印

S2 提供了 `@antv/s2-ssr` 包，让你可以在 Node.js 环境中渲染透视表和明细表，并导出为 **PNG、JPEG、SVG、PDF** 等格式。

## 安装

```bash
npm install @antv/s2-ssr
# 或者
pnpm add @antv/s2-ssr
# 或者
yarn add @antv/s2-ssr
```

:::warning{title="前置依赖"}

`@antv/s2-ssr` 依赖 [node-canvas](https://github.com/Automattic/node-canvas)，它需要系统安装 Cairo 和 Pango 图形库。

**macOS:**

```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

**Ubuntu/Debian:**

```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**Windows:**
请参考 [node-canvas 安装指南](https://github.com/Automattic/node-canvas#compiling)

:::

## 基本用法

:::warning{title="环境配置"}

在导入 `@antv/s2-ssr` 之前，需要先设置 CSS 模块加载器。这是由于 `@antv/s2` 导入了 CSS 文件，Node.js 无法原生处理：

```javascript
// 必须在导入 @antv/s2-ssr 之前设置
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};
```

:::

### 导出透视表

```javascript
// 设置 CSS 模块加载器
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
        { province: '浙江', city: '杭州', type: '笔', price: 10 },
        { province: '浙江', city: '杭州', type: '纸张', price: 20 },
        { province: '浙江', city: '宁波', type: '笔', price: 15 },
        { province: '浙江', city: '宁波', type: '纸张', price: 25 },
      ],
    },
  });

  // 导出到文件
  spreadsheet.exportToFile('./pivot-table.png');

  // 清理资源
  spreadsheet.destroy();
}

main();
```

![透视表](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*cHFySYcOKEsAAAAAQGAAAAgAemJ7AQ/fmt.avif)

### 导出明细表

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
        { province: '浙江', city: '杭州', type: '笔', price: 10 },
        { province: '浙江', city: '宁波', type: '纸张', price: 20 },
      ],
    },
  });

  spreadsheet.exportToFile('./table-sheet.png');
  spreadsheet.destroy();
}

main();
```

![明细表](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*pp96Qr9HP-EAAAAAQFAAAAgAemJ7AQ/fmt.avif)

## 导出格式

### PNG / JPEG

默认导出为 PNG 格式，也可以指定为 JPEG：

```javascript
// PNG (默认)
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

## 主题配置

S2 SSR 完全支持 S2 的主题系统，你可以使用内置主题或自定义主题：

### 内置主题

```javascript
// 暗黑主题
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    name: 'dark', // 可选: 'default' | 'dark' | 'colorful' | 'gray'
  },
});
```

![暗黑主题](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*hSipR7SMWMwAAAAAQGAAAAgAemJ7AQ/fmt.avif)

```javascript
// 多彩主题
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    name: 'colorful',
  },
});
```

![多彩主题](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*GckgTbAX_7EAAAAAQGAAAAgAemJ7AQ/fmt.avif)

### 自定义主题

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

更多主题配置请参考 [主题配置](/manual/basic/theme) 文档。

## 其他导出方式

除了导出到文件，还可以获取 Buffer 或 DataURL：

```javascript
const spreadsheet = await createSpreadsheet(options);

// 获取 Buffer (可用于上传到 OSS、发送邮件等)
const buffer = spreadsheet.toBuffer();

// 获取 Base64 DataURL (可用于嵌入 HTML)
const dataURL = spreadsheet.toDataURL();

spreadsheet.destroy();
```

## 完整配置项

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `sheetType` | `'pivot' \| 'table'` | `'pivot'` | 表格类型 |
| `width` | `number` | - | 画布宽度（像素） |
| `autoFit` | `boolean` | `true` | 自动裁剪画布到实际表格大小，去除空白区域 |
| `height` | `number` | - | 画布高度（像素） |
| `dataCfg` | `S2DataConfig` | - | 数据配置，与浏览器端一致 |
| `options` | `S2Options` | `{}` | 表格配置，与浏览器端一致 |
| `themeCfg` | `ThemeCfg` | - | 主题配置 |
| `devicePixelRatio` | `number` | `2` | 设备像素比，影响图片清晰度 |
| `outputType` | `'image' \| 'svg' \| 'pdf'` | `'image'` | 输出类型 |
| `imageType` | `'png' \| 'jpeg'` | `'png'` | 图片格式 |
| `waitForRender` | `number` | `100` | 等待渲染完成的时间（毫秒） |

## CLI 工具

`@antv/s2-ssr` 还提供了命令行工具：

```bash
npx s2-ssr export -i data.json -o output.png
```

其中 `data.json` 为配置文件：

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
      { "province": "浙江", "city": "杭州", "type": "笔", "price": 10 }
    ]
  }
}
```

## 常见问题

### Q: 图片是空白的怎么办？

请确保：

1. 数据 `data` 数组不为空
2. `fields` 配置正确（透视表需要 rows/columns/values，明细表需要 columns）
3. 适当增加 `waitForRender` 的值（如 100ms）

### Q: 字体显示不正确？

SSR 环境默认使用系统字体。如需使用自定义字体，请参考 [node-canvas 字体配置](https://github.com/Automattic/node-canvas#registerFont)。

### Q: 如何提高图片清晰度？

增加 `devicePixelRatio` 的值：

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  devicePixelRatio: 3, // 默认为 2
});
```
