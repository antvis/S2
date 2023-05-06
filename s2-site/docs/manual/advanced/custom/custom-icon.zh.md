---
title: 自定义 Icon
order: 3
---

默认情况下，`S2` 会在指标行头（指标挂行头）或列头 （指标挂列头）展示默认的组内排序操作 icon，如下图：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*qqLAS5Q3obUAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

但在很多情况下，会需要展示其他的操作 `icon`，例如：筛选、下钻等，`S2` 提供了 `headerActionIcons` 参数让你可以通过简单的配置项快速实现行头、列头、角头的操作 `icon` 自定义。

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

自定义操作 `icon` 默认会展示在行列头的右侧，如果需要展示在左侧，可以使用对象的形式，如下：

```ts
const s2Options = {
  headerActionIcons: [
    {
      icons: [{ name: 'SortDown', position: 'left' }],
      belongsCell: 'colCell',
    },
  ],
};

```

1、如果内置 `icon` 不满足，可以配置 `customSVGIcons` 参数额外注册自己的 `icon`, 自定义 `icon` 同时适用于**主题配置**，意味着你也可以调整它的大小，颜色，具体请查看 [主题配置](/docs/manual/basic/theme) 章节。

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

或者覆盖默认 `icon`, 例如自定义树状表格收起展开 `icon`

``` ts
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

<embed src="@/docs/common/icon.zh.md"></embed>​

2、配置 `headerActionIcons` 参数
​
⚠️ 注：注册自定义行列头操作图标需要先将 `options` 的 `showDefaultHeaderActionIcon` 设置为 `false`, 否则默认展示在指标列头的排序 icon 并不会消失

### 配置参数

<embed src="@/docs/common/header-action-icon.zh.md"></embed>

### 自定义行列头 icon 示例

<Playground path='custom/custom-icon/demo/custom-header-action-icon.tsx' rid='container' height='400'></playground>

### 自定义单元格 icon 示例

> 单元格标记详情，可查看 [字段标记](/docs/manual/basic/conditions) 章节

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

<Playground path='custom/custom-icon/demo/custom-data-cell-icon.tsx' rid='customDataCellIcon' height='400'></playground>
