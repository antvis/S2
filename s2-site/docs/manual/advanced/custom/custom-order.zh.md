---
title: 自定义排序操作
order: 6
---

虽然，`S2` 表格有默认的 [排序操作](/examples/analysis/sort#group-sort) 和 `React Header`
组件中的 [高级排序排序](/examples/analysis/sort#advanced) 功能。

但在某些业务场景下，我们仍需要自定义排序，我们将它分为**自定义排序 `icon`**，**自定义排序 `tooltip`**，**自定义排序操作**三个部分。接下来，我将带大家实现如👇 动图中的自定义排序功能。

![自定义排序](https://gw.alipayobjects.com/zos/antfincdn/oOiZ02mZJ/zidingyipaixu.gif)

## 自定义排序 icon

相关章节：[自定义 icon](/examples/custom/custom-icon#custom-header-action-icon)

### 配置

- 关闭默认 icon

```jsx
const s2Options = {
  // 关闭默认 icon
  showDefaultHeaderActionIcon: false,
  ...
}
```

- 配置自定义 icon

```jsx
const s2Options = {
  // 自定义 icon
  customSVGIcons: [
    {
      name: 'customKingIcon',
      svg: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ],
  ...
}
```

- 配置 icon 展示位置

```jsx
const s2Options = {
  // 配置 icon 展示位置
  headerActionIcons: [
    {
      // 选择 icon, 可以是 S2 自带的，也可以是自定义的 icon
      icons: [ 'customKingIcon' ],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      displayCondition: (meta) => meta.level === 2,
      ...
    }],
  ...
}
```

### 效果展示

| before                                                                                                                                                         | after                                                                                                                                                 |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| <image alt="before" src="https://gw.alipayobjects.com/zos/antfincdn/HsPpQdx%241/0d4a4371-191c-432e-8887-6392e38eb4ff.png" style="width: 500; height: auto"  /> | <image alt="after" src="https://gw.alipayobjects.com/zos/antfincdn/s%26vVrM8Ap/14a3a4fa-6d07-4fb8-8201-012672bd0feb.png"  width="400" height="300" /> |

## 自定义 tooltip

相关章节：[headerActionIcons 配置说明](/docs/api/general/S2Options#headeractionicon)

### 配置

- 确认 `tooltip` 为打开状态

```jsx
const s2Options = {
  tooltip: {
    enable: true,
  },
  ...
}
```

- 自定义 `icon` 点击后的 `tooltip` 展示

```jsx
const items = [
  { key: SortMethodType.none, label: '不排序' },
  { key: SortMethodType.asc, label: '升序', icon: 'GroupAsc' },
  { key: SortMethodType.desc, label: '降序', icon: 'GroupDesc' },
  { key: SortMethodType.custom, label: '自定义排序', icon: 'Trend' },
];

const s2Options = {
  // 设置自定义 `icon` 的展示条件
  headerActionIcons: [
    {
      // 选择 icon, 可以是 S2 自带的，也可以是自定义的 icon, https://s2.antv.antgroup.com/manual/advanced/custom/custom-icon
      icons: ['customKingIcon'],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      displayCondition: (meta) => meta.level === 2,
      // icon 点击之后的执行函数
      onClick: (props) => {
        const { meta, event } = props;
        // https://s2.antv.antgroup.com/manual/basic/tooltip
        const operator = {
          // 配置 tooltip 中的操作项
          menu: {
            items,
          }
        };
        // 自定义 tooltip 配置，展示 toolTip
        meta.spreadsheet.showTooltipWithInfo(event, [], {
          operator,
          onlyShowCellText: true,
          onlyShowOperator: true,
        });
      },
    },
  ],
  ...
}
```

### 展示效果

| before                                                                                                   | after                                                                                                   |
|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| ![before](https://gw.alipayobjects.com/zos/antfincdn/ho4NpbgQC/926fb382-d71e-429e-8a22-290c16ffb6c0.png) | ![after](https://gw.alipayobjects.com/zos/antfincdn/jTQbHqPuB/4917862a-e60c-4889-824f-f4d11f192f86.png) |

## 自定义排序操作

相关章节：[自定义排序](/docs/manual/basic/sort/custom#2-%E7%BB%B4%E5%BA%A6%E5%80%BC%E5%88%97%E8%A1%A8sortby)

### 配置

```jsx
// 执行自定义排序回调
const handleSortCallback = (meta, key) => {
  if (key === SortMethodType.custom) {
    const sortParams = [
      { sortFieldId: 'type', sortBy: [ '办公用品', '家具' ] },
      { sortFieldId: 'city', sortMethod: 'ASC' },
    ];
    setSortParams(sortParams)
    console.log('可以在这里实现你手动排序的交互和逻辑哟', sortParams)
  } else {
    // 使用 S2 提供的组内排序方式
    meta.spreadsheet.groupSortByMethod(key, meta)
    ;
  }
}

const s2Options = {
  // 设置自定义 `icon` 的展示条件
  headerActionIcons: [
    {
      onClick: (props) => {
        const { meta, event } = props;
        const operator = {
          onClick: ({ key }) => {
            // 执行自定义排序回调
            handleSortCallback(meta, key);
            meta.spreadsheet.hideTooltip();
          },
          menu: {
            items
          },
        };
        meta.spreadsheet.showTooltipWithInfo(event, [], {
          operator,
          onlyShowCellText: true,
          onlyShowOperator: true,
        });
      },
      ...
    }
  ],
  ...
}
```

### 展示效果

点击自定义排序，表格就会按照我们设置的排序进行展示。

类别按手动排序：[办公用品，家具], 城市 🏙 按首字母升序组内排列。

![after](https://gw.alipayobjects.com/zos/antfincdn/g8H01taL6/zidingyipaixucaozuo.gif)
