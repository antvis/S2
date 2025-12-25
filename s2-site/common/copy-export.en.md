---
title: Copy and Export
order: 8
---

<Playground path="interaction/basic/demo/copy-export.ts" height="500" rid='copy-export'></playground>

## Copy

### 1. Full Copy

:::warning{title="Note"}
S2 will write two types of metadata to the clipboard when copying:

- `text/html`
- `text/plain`

When pasting, it depends on `what type of data the receiver chooses`. For rich text, it is generally `text/html`, and for Excel, it is `text/plain`, that is, plain text with tabs `\t`, which supports custom modification.
:::

There are three built-in APIs, see [the documentation below](#api) for details.

- `asyncGetAllData`
- `asyncGetAllPlainData`
- `asyncGetAllHtmlData`

```ts {10-13}
 const s2DataConfig = {
  fields: {
    rows: ['province', 'city'],
    columns: ['type', 'sub_type'],
    values: ['number'],
  },
  meta: [
    {
      field: 'number',
      name: 'Quantity',
      formatter: (value, record, meta) => {
        return `${value / 100} %`
      }
    },
  ]
}
```

#### 1.1 Using in `@antv/s2`

```ts | pure
import { asyncGetAllData, copyToClipboard } from '@antv/s2'

// 1. Get the table data
const data = await asyncGetAllData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: true,
  // formatOptions: {
  //   formatHeader: true,
  //   formatData: true
  // },

  // Synchronous copy
  // async: false
});

// 2. Write to the clipboard (including both `text/html` and `text/plain`)
// Synchronous copy: copyToClipboard(data, false)
copyToClipboard(data)
  .then(() => {
    console.log('Copy successful')
  })
  .catch(() => {
    console.log('Copy failed')
  })
```

[View Example](/examples/interaction/basic/#copy-export)

#### 1.2 Using in `@antv/s2-react`

:::info{title="Tip"}
The copying, exporting, and other functions of the component layer are encapsulated based on a series of utility methods exposed by the core layer `@antv/s2`. You can also encapsulate them yourself based on the utility methods according to your actual business.
:::

For details, please see the [Analysis Components-Export](/manual/advanced/analysis/export) chapter.

##### 1.2.1 Full Copy of Raw Data

<img alt="originFullCopy" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*lh52Q69eTSwAAAAAAAAAAAAAemJ7AQ/original" width="1000" />

Corresponds to the `@antv/s2` utility method:

```ts {4-7}
const data = await asyncGetAllData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: {
    formatHeader: false,
    formatData: false
  },
});
```

##### 1.2.2 Full Copy of Formatted Data

If you have configured [`S2DataConfig.meta`](/api/general/s2-data-config#meta) to [format the data](/manual/basic/formatter), that is, the `name` and `formatter` in `s2DataConfig.meta`, you can enable `withFormat` to get the formatted data when copying.

```ts
const s2Options = {
  interaction: {
    copy: {
      // Enable copying
      enable: true,
      // Carry the header when copying
      withHeader: true,
      // Copy formatted data
      withFormat: true
    }
  }
}
```

<img alt="formatFullCopy" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AGkpQLhWo0AAAAAAAAAAAAAAemJ7AQ/original" width="1000" />

Corresponds to the `@antv/s2` utility method:

```ts {4-7}
const data = await asyncGetAllData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: {
    formatHeader: true,
    formatData: true
  },
});
```

### 2. Partial Copy

S2 provides the ability to partially copy by default. After enabling it, you can use the shortcut key `Command/Ctrl + C` to copy the selected area, which supports `single selection/multiple selection/brush selection/range selection`.

```ts
const s2Options = {
  interaction: {
    copy: {
      // Whether to enable copying
      enable: true,
      // Carry the header when copying
      withHeader: true,
      // Copy formatted data
      withFormat: true,
    },

    // Optional: Before copying by brushing, you need to enable the brushing function
    brushSelection: {
      dataCell: true,
      rowCell: true,
      colCell: true,
    },

    // Optional: Multiple selection
    multiSelection: true
  }
};
```

#### 2.1 Copy to Excel

<img alt="excelCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*LzTYTpFosccAAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.2 Copy with HTML format

<img alt="HTMLCopy" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*DuHCSbpv_XkAAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.3 Copy row header content

<img alt="CopyCol" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*_NukQpysLC8AAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.4 Copy column header content

<img alt="CopyRow" src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*ncuAQaL4AvAAAAAAAAAAAAAAARQnAQ" width="1000"/>

#### 2.5 Copy with Header

After enabling `withHeader`, the row and column header cell data corresponding to the currently selected data will be carried when copying.

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

### 3. Custom Data Transformation

By default, it gets the full table data of two types, `text/plain` and `text/html`. You can customize the data transformation through `customTransformer`.

```ts | pure
import { asyncGetAllData } from '@antv/s2'

const data = await asyncGetAllData({
  sheetInstance: s2,
  split: '\t',
  formatOptions: true,
  customTransformer: () => {
    return {
      'text/plain': (data) => {
         return {
           type: 'text/plain',
           content: ``
         };
      },
      'text/html': (data) => {
         return {
           type: 'text/html',
           content: `<td></td>`
         };
      },
    };
  },
})
```

You can also write it in `s2Options`:

```ts
const s2Options = {
  interaction: {
    copy: {
      customTransformer: () => {}
    }
  }
}
```

[View Example](/examples/interaction/basic/#copy-export)

## Export

By default, only the export of `csv` plain text format is provided. If you want to export `xlsx` and retain the cell style, you can handle it yourself with tools such as [exceljs](https://github.com/exceljs/exceljs) and [sheetjs](https://github.com/SheetJS/sheetjs).

### 1. Export CSV

```ts | pure
import { asyncGetAllPlainData, download } from '@antv/s2'

// Get the copied data (text/plain)
const data = await asyncGetAllPlainData({
  sheetInstance: s2,
  split: ',',
  formatOptions: true,
  // formatOptions: {
  //   formatHeader: true,
  //   formatData: true
  // },

  // Synchronous export
  // async: false
});

// Export data (csv)
download(data, 'filename') // filename.csv
```

#### API

##### asyncGetAllData

Get data of two types, `text/plain` and `text/html`, for copying.

```ts
[
  {
    "type": "text/plain",
    "content": "Province\tCity\tCategory\r\nZhejiang\tHangzhou\tFurniture\r\nZhejiang\tShaoxing\tFurniture"
  },
  {
    "type": "text/html",
    "content": "<meta charset=\"utf-8\"><table><tbody><tr><td>Province</td><td>City</td><td>Category</td></tr><tr><td>Zhejiang</td><td>Hangzhou</td><td>Furniture</td></tr><tr><td>Zhejiang</td><td>Shaoxing</td><td>Furniture</td></tr></tbody></table>"
  }
]
```

##### asyncGetAllPlainData

Get data of type `text/plain` for exporting.

```ts
"Province,City,Category\r\nZhejiang,Hangzhou,Furniture\r\nZhejiang,Shaoxing,Furniture"
```

##### asyncGetAllHtmlData

Get data of type `text/html` for exporting.

```ts
"<meta charset=\"utf-8\"><table><tbody><tr><td>Province</td><td>City</td><td>Category</td></tr><tr><td>Zhejiang</td><td>Hangzhou</td><td>Furniture</td></tr><tr><td>Zhejiang</td><td>Shaoxing</td><td>Furniture</td></tr></tbody></table>"
```

| Parameter | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| sheetInstance | s2 instance | [SpreadSheet](/api/basic-class/spreadsheet) | | ✓ |
| split | Delimiter | `string` | | ✓ |
| formatOptions | Whether to use [S2DataConfig.Meta](/api/general/s2-data-config#meta) for formatting. You can format the data cells and row/column headers separately. Passing a `boolean` will affect both the cells and headers. | `boolean \| { formatHeader?: boolean, formatData?: boolean }` | `true` | |
| customTransformer | Supports custom (transformer) data export formatting methods when exporting. | (transformer: `Transformer`) => [`Partial<Transformer>`](#transformer) | | |
| async | Whether to copy/export asynchronously (when the browser does not support `requestIdleCallback`, it will be forcibly degraded to **synchronous**). | boolean | `true` | |

##### copyToClipboard

| Parameter | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| data | Data source | `string` | | ✓ |
| async | Whether to copy data asynchronously (asynchronous by default). | `boolean` | `true` | |

##### download

| Parameter | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| data | Data source | `string` | | ✓ |
| filename | File name | `string` | | ✓ |

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
  async?: boolean;
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

| Parameter | Description | Type | Default | Required |
| --- | --- | --- | --- | --- |
| type | The MIMEType of the copied content. | [`CopyMIMEType`](#copymimetype) | | ✓ |
| transformer | The processing function. | `MatrixHTMLTransformer \| MatrixPlainTransformer` | | ✓ |

## Special Character Handling Rules

According to the [CSV specification](https://en.wikipedia.org/wiki/Comma-separated_values#Example) and the handling rules of Excel, `S2` will handle special characters according to the following rules:

1. **Field wrapping rule**
   When a field contains any of the following characters, the entire field will be wrapped in double quotes:
   `,` `"` `\r` `\n` `\t`
2. **Double quote escaping rule**

   A double quote " in a field will be escaped as two double quotes "".
3. **Newline character handling rule**
   To be compatible with the scenario of directly pasting into an Excel cell:
   - Replace independent `\n` with `\r\n`.
   - Existing `\r\n` remains unchanged.
