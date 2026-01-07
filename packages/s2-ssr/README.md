# @antv/s2-ssr

基于 [node-canvas](https://github.com/Automattic/node-canvas) 的 [S2](https://github.com/antvis/S2) 服务端渲染 (SSR) 支持。

该包允许您在 Node.js 环境中将 S2 透视表（PivotSheet）和明细表（TableSheet）渲染为 PNG、JPEG、SVG 或 PDF 格式。

## 安装

```bash
npm install @antv/s2-ssr
# 或者
pnpm add @antv/s2-ssr
```

> **注意**：该包依赖 [node-canvas](https://github.com/Automattic/node-canvas)，它需要 Cairo 和 Pango。有关特定平台的说明，请参阅 [node-canvas 安装指南](https://github.com/Automattic/node-canvas#compiling)。

## 使用

### 基本使用

```javascript
const { createSpreadsheet } = require('@antv/s2-ssr');

const options = {
  sheetType: 'pivot', // 或者 'table'
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
    // S2 配置
  },
};

(async () => {
  const spreadsheet = await createSpreadsheet(options);

  // 导出到文件
  spreadsheet.exportToFile('./output.png');

  // 或者获取 buffer
  const buffer = spreadsheet.toBuffer();

  // 或者获取 data URL
  const dataURL = spreadsheet.toDataURL();

  // 清理资源
  spreadsheet.destroy();
})();
```

### 导出格式

#### PNG/JPEG (默认)

```javascript
const spreadsheet = await createSpreadsheet({
  ...options,
  imageType: 'png', // 或者 'jpeg'
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

### 主题配置

S2 提供了多种内置主题，可以通过 `themeCfg` 配置项来设置：

```javascript
// 暗黑主题
const spreadsheet = await createSpreadsheet({
  ...options,
  themeCfg: {
    name: 'dark', // 'default' | 'dark' | 'colorful' | 'gray'
  },
});

spreadsheet.exportToFile('./output-dark.png');
```

也可以自定义主题：

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

详细的主题配置请参考 [S2 主题文档](https://s2.antv.antgroup.com/manual/basic/theme)。

## API

### `createSpreadsheet(options)`

创建一个用于 SSR 的表格实例。

#### Options (配置项)

| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `sheetType` | `'pivot' \| 'table'` | `'pivot'` | 要创建的表格类型 |
| `width` | `number` | - | 画布宽度 |
| `height` | `number` | - | 画布高度 |
| `dataCfg` | `S2DataConfig` | - | S2 数据配置 |
| `options` | `S2Options` | `{}` | S2 表格配置 |
| `themeCfg` | `ThemeCfg` | - | 主题配置 |
| `devicePixelRatio` | `number` | `2` | 设备像素比 |
| `outputType` | `'image' \| 'svg' \| 'pdf'` | `'image'` | 输出类型 |
| `imageType` | `'png' \| 'jpeg'` | `'png'` | 图片类型 (当 outputType 为 'image' 时) |
| `waitForRender` | `number` | `32` | 等待异步渲染完成的时间 (ms) |
| `renderPlugins` | `any[]` | `[]` | 额外的 G 渲染插件 |

#### Returns (返回值)

返回一个 `Spreadsheet` 对象，包含以下方法：

| 方法 | 描述 |
| --- | --- |
| `exportToFile(path, meta?)` | 导出到文件 |
| `toBuffer(meta?)` | 获取 Node.js Buffer |
| `toDataURL()` | 获取 base64 data URL |
| `getCanvas()` | 获取底层的 node-canvas 实例 |
| `destroy()` | 清理资源 |

### `createCanvas(options)`

创建一个带有 node-canvas 的原生 G Canvas，用于高级用法。

## Node.js 环境配置

使用此包时，您需要在 Node.js 环境中设置浏览器全局变量。对于 jsdom 用户，这通常会自动处理。对于其他环境：

```javascript
// 在导入 @antv/s2-ssr 之前进行设置
global.navigator = { userAgent: 'node' };
global.window = { navigator: global.navigator };
global.document = {
  createElement: () => ({ style: {} }),
  body: { style: {} },
};
```

## License

MIT
