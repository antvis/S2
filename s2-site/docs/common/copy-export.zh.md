---
title: 复制与导出
order: 8
---

<Playground path="interaction/basic/demo/copy-export.ts" height="500" rid='copy-export'></playground>

## 复制

### 1. 全量复制

```ts | pure
import { asyncGetAllPlainData, copyToClipboard } from '@antv/s2'

// 拿到复制数据
const data = await asyncGetAllPlainData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: false,
  // formatOptions: {
  //   formatHeader: false,
  //   formatData: true
  // },
});

// 同步复制：copyToClipboard(data, false)
copyToClipboard(data)
  .then(() => {
    console.log('复制成功')
  })
  .catch(() => {
    console.log('复制失败')
  })
```

[查看示例](/examples/interaction/basic/#copy-export)

#### 1.1 原始数据全量复制

<img alt="originFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*pfSsTrvuJ0UAAAAAAAAAAAAAARQnAQ" width="1000" />

#### 1.2 格式化数据全量复制

如果配置了 [`S2DataConfig.meta`](/api/general/s2-data-config#meta) 对数据有 [格式化处理](/manual/basic/formatter), 那么可以开启 `withFormat`, 这样复制时会拿到格式化之后的数据。

```ts
const s2Options = {
  interaction: {
    copy: {
      // 开启复制
      enable: true,
      // 复制时携带表头
      withHeader: true,
      // 复制格式化后的数据
      withFormat: true
    }
  }
}
```

<img alt="formatFullCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*mLSdTrAWZrwAAAAAAAAAAAAAARQnAQ" width="1000" />

### 2. 局部复制

S2 默认提供局部复制的能力，开启后，使用快捷键 `Command/Ctrl + C` 即可复制选中区域，支持 `单选/多选/刷选/区间多选`.

```ts
const s2Options = {
  interaction: {
    copy: {
      // 是否开启复制
      enable: true,
      // 复制时携带表头
      withHeader: true,
      // 复制格式化后的数据
      withFormat: true,
    },

    // 可选：圈选复制前，需要开启圈选功能
    brushSelection: {
      dataCell: true,
      rowCell: true,
      colCell: true,
    },

    // 可选：多选
    multiSelection: true
  }
};
```

#### 2.1 复制到 Excel

<img alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.2 复制带 HTML 格式

<img alt="HTMLCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DuHCSbpv_XkAAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.3 复制行头内容

<img alt="CopyCol" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_NukQpysLC8AAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.4 复制列头内容

<img alt="CopyRow" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ncuAQaL4AvAAAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.5 带表头复制

开启 `withHeader` 后，复制时会携带当前选中数据对应的行列头单元格数据。

```ts
const s2Options = {
  interaction: {
    copy: {
      enable: true,
      withHeader: true,
    },
  }
};
```

<img alt="withHeader" src="https://gw.alipayobjects.com/zos/antfincdn/wSBjSYKSM/3eee7bc2-7f8e-4dd9-8836-52a978d9718a.png" width="1000"/>

## 导出

### 原始导出方法

:::info{title="提示"}
组件层的复制，导出等功能，基于核心层 `@antv/s2` 透出的一系列工具方法封装，可以根据实际业务，基于工具方法自行封装
:::

#### 1. 导出 CSV

默认只提供 `csv` 纯文本格式的导出，如果想导出 `xlsx`, 保留单元格样式，可以结合 [exceljs](https://github.com/exceljs/exceljs), [sheetjs]( https://github.com/SheetJS/sheetjs) 等工具自行处理。

```ts | pure
import { asyncGetAllPlainData, download } from '@antv/s2'

// 拿到复制数据
const data = await asyncGetAllPlainData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: false,
  // formatOptions: {
  //   formatHeader: false,
  //   formatData: true
  // },
});

// 导出数据 (csv)
download(data, 'filename')
```

#### 2. 复制数据到剪贴板

:::warning{title="注意"}
S2 会在复制的时候往剪贴板写入两种类型的元数据

- `text/html`
- `text/plain`

粘贴的时候，取决于`接收方选择什么类型的数据`，对于富文本一般来说接收的是 `text/html`, 对于 Excel 之类的就是 `text/plain`, 即带制表符 `\t` 的纯文本，支持自定义修改。
:::

```ts | pure
import { copyToClipboard } from '@antv/s2'

// 同步复制：copyToClipboard(data, false)
copyToClipboard(data)
  .then(() => {
    console.log('复制成功')
  })
  .catch(() => {
    console.log('复制失败')
  })
```

#### 3. 自定义导出类型

```ts | pure
import { asyncGetAllPlainData, CopyMIMEType } from '@antv/s2'

// 复制到 word、语雀等场景会成为一个空表格
const data = await asyncGetAllPlainData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: false,
  // 自定义导出类型
  customTransformer: () => {
    return {
      [CopyMIMEType.HTML]: () => {
        return {
          type: CopyMIMEType.HTML,
          content: `<td></td>`
        };
      },
    };
  },
});
```

#### API

##### asyncGetAllPlainData

| 参数          | 说明      | 类型              | 默认值           | 必选 |
| ------------|-----------------|---------------|---------------| --- |
| sheetInstance | s2 实例    | [SpreadSheet](/docs/api/basic-class/spreadsheet)     |      | ✓    |
| split       | 分隔符           | `string`       |     | ✓    |
| formatOptions  | 是否格式化，可以分别对数据单元格和行列头进行格式化，传 `boolean` 会同时对单元格和行列头生效。 | `boolean \|  { formatHeader?: boolean, formatData?: boolean }`| `false`  |      |
| customTransformer  | 导出时支持自定义 (transformer) 数据导出格式化方法  | (transformer: `Transformer`) => [`Partial<Transformer>`](#transformer)      |  |      |
| isAsyncExport  | 是否异步导出        | boolean      | false         |      |

##### copyToClipboard

| 参数 | 说明     | 类型     | 默认值 | 必选 |
| --- | --- | ------- | ----- | --- |
| data | 数据源 | `string` |        | ✓    |
| sync | 是否同步复制数据 （默认异步） | `boolean` |   `false`     |     |

##### download

| 参数     | 说明     | 类型     | 默认值 | 必选 |
| ------- | ------- | ------- | ----- | --- |
| data     | 数据源 | `string` |        | ✓    |
| filename | 文件名称 | `string` |        | ✓    |

##### CopyMIMEType

```ts
enum CopyMIMEType {
  PLAIN = 'text/plain',
  HTML = 'text/html',
}
```

##### FormatOptions

```ts
type FormatOptions =
  | boolean
  | {
      formatHeader?: boolean;
      formatData?: boolean;
    };
```

##### CopyAllDataParams

```ts
interface CopyAllDataParams {
  sheetInstance: SpreadSheet;
  split?: string;
  formatOptions?: FormatOptions;
  customTransformer?: (transformer: Transformer) => Partial<Transformer>;
  isAsyncExport?: boolean;
}
```

##### Transformer

```ts | pure
type CopyablePlain = {
  type: CopyMIMEType.PLAIN;
  content: string;
};

type CopyableHTML = {
  type: CopyMIMEType.HTML;
  content: string;
};

type MatrixPlainTransformer = (
  data: DataItem[][],
  separator?: string,
) => CopyablePlain;

type MatrixHTMLTransformer = (data: DataItem[][]) => CopyableHTML;

interface Transformer {
  [CopyMIMEType.PLAIN]: MatrixPlainTransformer;
  [CopyMIMEType.HTML]: MatrixHTMLTransformer;
}
```

| 参数 | 说明     | 类型                       | 默认值 | 必选 |
| --- | --- |--------------------------|-----| --- |
| type | 复制内容的 MIMEType | [CopyMIMEType](#copymimetype)           |     | ✓    |
| transformer | 处理函数 | `MatrixHTMLTransformer \| MatrixPlainTransformer`   |      |   ✓   |
