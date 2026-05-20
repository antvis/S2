# @antv/s2-ssr

简体中文 | [English](./README.md)

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

### 前置条件

在导入 `@antv/s2-ssr` 之前，您需要设置 CSS 模块加载器。这是必需的，因为 `@antv/s2` 导入了 Node.js 无法原生处理的 CSS 文件：

```javascript
// 必须在导入 @antv/s2-ssr 之前设置
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

// 现在可以导入并使用该包
const { createSpreadsheet } = require('@antv/s2-ssr');
```

### 基本使用

```javascript
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};
require.extensions['.svg'] = () => {};

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

## Jest 配置

如果您使用 Jest 对导入了 `@antv/s2-ssr` 的代码进行测试，您需要配置 Jest 来处理 CSS 文件。此包使用的 `require.extensions` 方法仅在 Node.js 运行时有效，在 Jest 的模块系统中不起作用。

在您的 `jest.config.js` 或 `jest.config.ts` 中添加以下配置：

```javascript
module.exports = {
  // ... 其他配置
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
};
```

然后创建 mock 文件：

**`__mocks__/styleMock.js`**

```javascript
module.exports = {};
```

**`__mocks__/fileMock.js`**

```javascript
module.exports = 'file-stub';
```

这会告诉 Jest 用空模块来模拟 CSS/LESS/SVG 导入，防止解析错误。

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
| `autoFit` | `boolean` | `true` | 自动裁剪画布到实际表格大小，去除空白区域 |
| `devicePixelRatio` | `number` | `2` | 设备像素比 |
| `outputType` | `'image' \| 'svg' \| 'pdf'` | `'image'` | 输出类型 |
| `imageType` | `'png' \| 'jpeg'` | `'png'` | 图片类型 (当 outputType 为 'image' 时) |
| `waitForRender` | `number` | `100` | 等待异步渲染完成的时间 (ms) |
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

## 本地开发

如果您在 S2 monorepo 中开发 `@antv/s2-ssr`，请按照以下步骤操作：

### 1. 启用 canvas 构建脚本

`canvas` 包需要运行其安装脚本才能下载预编译的二进制文件。确保 `canvas` 在 `pnpm-workspace.yaml` 的 `onlyBuiltDependencies` 中：

```yaml
onlyBuiltDependencies:
  - canvas
```

然后重新安装依赖：

```bash
pnpm install
```

### 2. 构建 s2-core

s2-ssr 包依赖于链接到本地 `s2-core` 的 `@antv/s2`。您需要构建 CommonJS 输出：

```bash
pnpm core:build
```

### 3. 构建 s2-ssr

```bash
cd packages/s2-ssr
pnpm build
```

### 4. 运行示例

```bash
node examples/grid-english.js
```

## License

MIT
