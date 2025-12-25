---
title: Customize Order
order: 6
---

Although, `S2` tables have default [sort operations](/examples/analysis/sort#group-sort) and [advanced sort](/examples/analysis/sort#advanced) functionality in `React Header` component.

But in some business scenarios, we still need custom sorting, which we divide into three parts: **custom sorting `icon`** , **custom sorting `tooltip`** , and **custom sorting operations** . Next, I will take you to realize the custom sorting function as shown in the 👇 animation.

![custom sort](https://gw.alipayobjects.com/zos/antfincdn/oOiZ02mZJ/zidingyipaixu.gif)

## custom sort icon

Related chapters: [custom icon](/examples/custom/custom-icon#custom-header-action-icon)

### configuration

* Close the default icon

```jsx
const s2Options = {
  // 关闭默认 icon
  showDefaultHeaderActionIcon: false,
  ...
}
```

* Configure custom icon

```jsx
const s2Options = {
  // 自定义 icon
  customSVGIcons: [
    {
      name: 'customKingIcon',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ],
  ...
}
```

* Configure icon placement

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

### Show results

| before                                                                                                                                                    | after                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| <img alt="before" src="https://gw.alipayobjects.com/zos/antfincdn/HsPpQdx%241/0d4a4371-191c-432e-8887-6392e38eb4ff.png" style="width: 500; height: auto"> | <img alt="after" src="https://gw.alipayobjects.com/zos/antfincdn/s%26vVrM8Ap/14a3a4fa-6d07-4fb8-8201-012672bd0feb.png" width="400" height="300"> |

## custom tooltip

Related chapters: [headerActionIcons configuration instructions](/en/api/general/s2-options#headeractionicon)

### configuration

* Confirm `tooltip` is open

```jsx
const s2Options = {
  tooltip: {
    enable: true,
  },
  ...
}
```

* Customize the `tooltip` display after the `icon` is clicked

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
      // 选择 icon, 可以是 S2 自带的，也可以是自定义的 icon
      icons: [ 'customKingIcon' ],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      displayCondition: (meta) => meta.level === 2,
      // icon 点击之后的执行函数
      onClick: (props) => {
        const { meta, event } = props;
        const operator = {
          // 配置 tooltip 中展示的内容
          menu: {
            items
          },
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

### Display of results

| before                                                                                                   | after                                                                                                   |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ![before](https://gw.alipayobjects.com/zos/antfincdn/ho4NpbgQC/926fb382-d71e-429e-8a22-290c16ffb6c0.png) | ![after](https://gw.alipayobjects.com/zos/antfincdn/jTQbHqPuB/4917862a-e60c-4889-824f-f4d11f192f86.png) |

## custom sort operation

Related chapter: [Custom sorting](/manual/basic/sort/basic#2-维度值列表sortBy)

### configuration

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

### Display of results

Click Custom Sort, and the table will be displayed according to the sort we set.

Categories are manually sorted: \[Office Supplies, Furniture], cities 🏙 are arranged in groups in ascending alphabetical order.

![after](https://gw.alipayobjects.com/zos/antfincdn/g8H01taL6/zidingyipaixucaozuo.gif)
