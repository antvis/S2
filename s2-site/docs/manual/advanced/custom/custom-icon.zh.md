---
title: 自定义 Icon
order: 3
tag: Updated
---

默认情况下，表格只会展示排序 icon, 但在很多情况下，会需要展示其他的操作 `icon`，例如：`筛选`、`下钻`、 `提示信息` 等，`S2` 提供了 `headerActionIcons` 参数让你可以通过简单的配置项快速实现行头、列头、角头的操作 `icon` 自定义。

<Playground path='custom/custom-icon/demo/custom-header-action-icon.ts' rid='custom-header-action-icon' height='400'></playground>

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

如果内置 `icon` 不满足诉求，可以配置 `customSVGIcons` 来额外注册自己的 `icon`, 自定义 `icon` 同时适用于**主题配置**，意味着你也可以调整它的大小，颜色（在线链接不支持），具体请查看 [主题配置](/manual/basic/theme) 章节。

支持三种方式：

- `字符串`
- `本地文件`
- `在线链接`

```ts | pure
import Icon from '/path/to/icon.svg'

const s2Options = {
  customSVGIcons: [
    {
      name: 'CustomIcon',
      // 1. 字符串（支持自定义颜色）
      src: `<?xml version="1.0" encoding="UTF-8"?><svg t="1634603945212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="558" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" fill="currentColor"><defs><style type="text/css"></style></defs><path d="M605.61 884.79h-24.26c-21.34 0-38.66 17.32-38.66 38.66 0 21.34 17.32 38.66 38.66 38.66h24.26c21.34 0 38.66-17.32 38.66-38.66 0-21.35-17.32-38.66-38.66-38.66z" fill="#040000" p-id="559"></path><path d="M950.47 419.76c-22.17-15.48-51.17-16.01-73.92-1.33L715.7 522.53 573.09 223.42c-10.95-22.98-33.55-37.43-58.97-37.75h-0.85c-25.09 0-47.67 13.84-59.05 36.29L302.25 521.82 154.9 419.61c-22-15.18-50.71-15.73-73.27-1.46-22.53 14.32-34.23 40.57-29.8 66.9l70.9 421.76c5.33 32.04 32.82 55.3 65.31 55.3h272.43c21.34 0 38.66-17.32 38.66-38.66 0-21.34-17.32-38.66-38.66-38.66H197.44l-64.99-386.62 136.17 94.46a66.14 66.14 0 0 0 54.01 9.79 66.097 66.097 0 0 0 42.81-34.28l147.54-291.11 138.35 290.2c8.21 17.19 23.41 30.03 41.76 35.19 18.37 5.24 38 2.21 53.99-8.1l148.62-96.17-87.74 386.65h-60.1c-21.34 0-38.66 17.32-38.66 38.66 0 21.34 17.32 38.66 38.66 38.66h68.96c31.16 0 57.71-21.22 64.58-51.57l95.72-421.86c5.97-26.39-4.47-53.42-26.65-68.93zM514.74 151.68c28.08 0 50.85-22.76 50.85-50.85s-22.77-50.85-50.85-50.85c-28.09 0-50.85 22.76-50.85 50.85s22.77 50.85 50.85 50.85zM973.15 277.37c-28.08 0-50.85 22.77-50.85 50.85 0 28.09 22.76 50.85 50.85 50.85 28.08 0 50.85-22.76 50.85-50.85 0-28.08-22.77-50.85-50.85-50.85zM101.69 328.22c0-28.08-22.76-50.85-50.85-50.85S0 300.14 0 328.22c0 28.09 22.76 50.85 50.85 50.85s50.84-22.77 50.84-50.85z" fill="#040000" p-id="560"></path></svg>`,

      // 2. 本地文件（支持自定义颜色，本质上也是字符串）
      src: Icon,

      // 3. 在线链接 （不支持自定义颜色）
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
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
      src: 'https://gw.alipayobjects.com/zos/antfincdn/kXgP1pnClS/plus.svg',
    },
    {
      name: 'Minus',
      src: 'https://gw.alipayobjects.com/zos/antfincdn/2aWYZ7%26rQF/minus-circle.svg',
    },
  ],
}

```

#### 4. 自定义 icon 颜色

图标颜色默认和文本颜色一致，遵循 [主题配置](/manual/basic/theme)

```ts
const s2Options = {
  headerActionIcons: [
    {
      icons: [{ name: 'SortDown', position: 'left', fill: 'red' }],
      belongsCell: 'colCell',
    },
  ],
};
```

:::info{title="提示"}
如果是彩色图标，希望使用图标自身颜色，可以将 `fill` 设置为 `null`.
:::

```diff
const s2Options = {
  headerActionIcons: [
    {
-     icons: [{ name: 'SortDown', position: 'left', fill: 'red' }],
+     icons: [{ name: 'SortDown', position: 'left', fill: null }],
      belongsCell: 'colCell',
    },
  ],
};
```

#### 5. 自定义展示逻辑

- `defaultHide`: 默认隐藏，鼠标在对应单元格悬停时才展示。
- `displayCondition`: 动态控制 icon 是否渲染。

<Playground path='custom/custom-icon/demo/display-condition.ts' rid='display-condition' height='400'></playground

### 自定义数值单元格 icon

:::info{title="提示"}
对于数值单元格，我们可以使用通用的 `字段标记` 能力来进行自定义 icon 的展示，详情请查看 [字段标记](/manual/basic/conditions) 章节。
:::

```ts | pure | {17}
import Icon from '/path/to/icon.svg'

const s2Options = {
  customSVGIcons: [
    {
      name: 'CustomIcon',
      src: Icon,
    },
  ],
  conditions: {
    icon: [
      {
        field: 'number',
        mapping(fieldValue, data) {
          return {
            // 使用自定义 icon 名称
            icon: 'CustomIcon',
            // 自定义颜色 （在线链接不支持）
            fill: '#30BF78',
          };
        },
      },
    ],
  },
}
```

<Playground path='custom/custom-icon/demo/custom-data-cell-icon.ts' rid='custom-data-cell-icon' height='400'></playground>

### 自定义绘制 icon

S2 表格是一个 Canvas 画布，所以你可以绘制任意的图形在表格里，比如 `icon`, 可以查看 [单元格内绘制图标和图形](/manual/advanced/chart-in-cell#3-%E7%BB%98%E5%88%B6-g-%E8%87%AA%E5%AE%9A%E4%B9%89%E5%9B%BE%E5%BD%A2) 章节了解更多。

<embed src="@/docs/common/header-action-icon.zh.md"></embed>
