---
title: Customize Icon
order: 3
---

By default, `S2` will display the default intra-group sorting operation icon at the index row header (indicator hanging row header) or column header (indicator hanging column header), as shown in the following figure:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*kV8gR555SxgAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

But in many cases, you will need to display other action `icon` , such as: filter, drill down, etc. `S2` provides the `headerActionIcons` parameter so that you can quickly customize the action `icon` of the row header, column header, and corner header through simple configuration items.

```ts
const s2Options = {
  headerActionIcons: [
    {
      icons: ['SortDown'],
      belongsCell: 'colCell',
    },
  ],
}
```

1\. If the built-in `icon` is not satisfied, you can configure `customSVGIcons` parameter to additionally register your own `icon` . The custom `icon` is also applicable to the **theme configuration** , which means that you can also adjust its size and color. For details, please refer to the [theme configuration](/docs/manual/basic/theme) chapter.

```ts
const s2Options = {
  customSVGIcons: [
    {
      name: 'Filter',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
    },
  ],
}
```

Or override the default `icon` , such as a custom tree form to collapse and expand the `icon`

```ts
const s2Options = {
  customSVGIcons: [
    {
      name: 'Plus',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/kXgP1pnClS/plus.svg',
    },
    {
      name: 'Minus',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/2aWYZ7%26rQF/minus-circle.svg',
    },
  ],
}
```

<embed src="@/docs/common/icon.en.md"></embed>​

2\. Configure `headerActionIcons` parameter ​ ⚠️ Note: To register a custom row and column header action icon, you need to set the `showDefaultHeaderActionIcon` of `options` to `false` first, otherwise the sorting icon displayed in the indicator column header by default will not disappear

### configuration parameters

<embed src="@/docs/common/header-action-icon.en.md"></embed>

### Custom row and column header icon example

<Playground path="custom/custom-icon/demo/custom-header-action-icon.tsx" rid="container" height="400"></Playground>

### Custom cell icon example

> For details on cell marking, see the [field marking](/docs/manual/basic/conditions) chapter

```javascript
const s2Options = {
  customSVGIcons: [
    {
      name: 'Filter',
      svg: 'https://gw.alipayobjects.com/zos/antfincdn/gu1Fsz3fw0/filter%26sort_filter.svg',
    },
  ],
  conditions: {
    icon: [
      {
        field: 'number',
        mapping(fieldValue, data) {
          return {
            // 使用自定义 icon 名称
            icon: 'Filter',
            fill: '#30BF78',
          };
        },
      },
    ],
  },
}
```

<Playground path="custom/custom-icon/demo/custom-data-cell-icon.ts" rid="custom-data-cell-icon" height="400"></Playground>
