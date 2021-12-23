---
title: 自定义行列头操作图标
order: 2
---

默认情况下，`S2` 会在指标行头（指标挂行头）或列头 （指标挂列头）展示默认的组内排序操作 icon，如下图：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*kV8gR555SxgAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

但在很多情况下，会需要展示其他的操作 `icon`，例如：筛选、下钻等，`S2` 提供了 `headerActionIcons` 参数可以通过简单的配置项快速实现行头、列头、角头的操作 icon 自定义。

```ts
const s2Options = {
  headerActionIcons: [
    {
      iconNames: ['SortDown'],
      belongsCell: 'colCell',
    },
  ],
}
```

1、如果内置 icon 不满足，可以配置 `customSVGIcons` 参数额外注册自己的 `icon`。

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

内置 icon 列表

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*72MST6HPxBYAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

2、配置 `headerActionIcons` 参数
​
⚠️ 注：注册自定义行列头操作图标需要先将 `options` 的 `showDefaultHeaderActionIcon` 设置为 `false`, 否则默认展示在指标列头的排序 icon 并不会消失

### 配置参数

`markdown:docs/common/header-action-icon.zh.md`

### 完整示例

<playground path='custom/custom-icon/demo/custom-header-action-icon.tsx' rid='container' height='400'></playground>
