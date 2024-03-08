---
title: 自定义 Icon
order: 3
tag: Updated
---

默认情况下，表格只会展示排序 icon, 但在很多情况下，会需要展示其他的操作 `icon`，例如：`筛选`、`下钻`、 `提示信息` 等，`S2` 提供了 `headerActionIcons` 参数让你可以通过简单的配置项快速实现行头、列头、角头的操作 `icon` 自定义。

<Playground path='custom/custom-icon/demo/custom-header-action-icon.tsx' rid='custom-header-action-icon' height='400'></playground>

### 关闭默认排序 icon

表格的数值默认会渲染排序 icon, 可以配置 `showDefaultHeaderActionIcon` 关闭。

```ts
const s2Options = {
  showDefaultHeaderActionIcon: false
}
```

### 自定义行列头 icon

#### 1. 使用内置 icon

- `icons`: 内置 icon 或者自定义注册的 icon 名称。
- `belongsCell`:  当前一组 icon 展示在哪个单元格内。

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

<embed src="@/docs/common/icon.zh.md"></embed>​

#### 2. 自定义展示位置

自定义操作 `icon` 默认会展示在**行列头文字的右侧**，如果需要展示在左侧，可以使用对象的形式，支持更丰富的配置：

```diff
const s2Options = {
  headerActionIcons: [
    {
-     icons: ['SortDown'],
+     icons: [{ name: 'SortDown', position: 'left' }],
      belongsCell: 'colCell',
    },
  ],
};

```

#### 3. 使用自定义 icon

如果内置 `icon` 不满足诉求，可以配置 `customSVGIcons` 来额外注册自己的 `icon`, 自定义 `icon` 同时适用于**主题配置**，意味着你也可以调整它的大小，颜色，具体请查看 [主题配置](/docs/manual/basic/theme) 章节。

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

也可以覆盖内置 `icon`, 例如自定义树状表格收起展开 `icon`. [查看示例](/examples/custom/custom-icon/#custom-tree-icon)

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

#### 自定义展示逻辑

- `defaultHide`: 默认隐藏，鼠标在对应单元格悬停时才展示。
- `displayCondition`: 动态控制 icon 是否渲染。

<Playground path='custom/custom-icon/demo/display-condition.ts' rid='display-condition' height='400'></playground

### 自定义数值单元格 icon

:::info{title="提示"}
对于数值单元格，我们可以使用通用的 `字段标记` 能力来进行自定义 icon 的展示，详情请查看 [字段标记](/docs/manual/basic/conditions) 章节。
:::

```ts | {15}
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

<Playground path='custom/custom-icon/demo/custom-data-cell-icon.ts' rid='custom-data-cell-icon' height='400'></playground>

<embed src="@/docs/common/header-action-icon.zh.md"></embed>
