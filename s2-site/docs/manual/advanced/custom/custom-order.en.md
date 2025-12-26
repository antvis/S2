---
title: Customize Order
order: 6
---

Although, `S2` tables have default [sort operations](/en/examples/analysis/sort#group-sort) and [advanced sort](/en/examples/analysis/sort#advanced) functionality in `React Header` component.

But in some business scenarios, we still need custom sorting, which we divide into three parts: **custom sorting `icon`** , **custom sorting `tooltip`** , and **custom sorting operations** . Next, I will take you to realize the custom sorting function as shown in the 👇 animation.

![custom sort](https://gw.alipayobjects.com/zos/antfincdn/oOiZ02mZJ/zidingyipaixu.gif)

## custom sort icon

Related chapters: [custom icon](/en/examples/custom/custom-icon#custom-header-action-icon)

### configuration

* Close the default icon

```jsx
const s2Options = {
  // Disable default icon
  showDefaultHeaderActionIcon: false,
  ...
}
```

* Configure custom icon

```jsx
const s2Options = {
  // Custom icon
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
  // Configure icon display position
  headerActionIcons: [
    {
      // Select icon, can be S2 built-in or custom icon
      icons: [ 'customKingIcon' ],
      // Set icon display position via belongsCell + displayCondition
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
  { key: SortMethodType.none, label: 'No Sort' },
  { key: SortMethodType.asc, label: 'Asc', icon: 'GroupAsc' },
  { key: SortMethodType.desc, label: 'Desc', icon: 'GroupDesc' },
  { key: SortMethodType.custom, label: 'Custom Sort', icon: 'Trend' },
];

const s2Options = {
  // Set custom icon display condition
  headerActionIcons: [
    {
      // Select icon, can be S2 built-in or custom icon
      icons: [ 'customKingIcon' ],
      // Set icon display position via belongsCell + displayCondition
      belongsCell: 'colCell',
      displayCondition: (meta) => meta.level === 2,
      // Execution function after icon click
      onClick: (props) => {
        const { meta, event } = props;
        const operator = {
          // Configure content displayed in tooltip
          menu: {
            items
          },
        };
        // Custom tooltip configuration, show toolTip
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

Related chapter: [Custom sorting](/en/manual/basic/sort/basic#2-dimension-value-list-sortby)

### configuration

```jsx
// Execute custom sort callback
const handleSortCallback = (meta, key) => {
  if (key === SortMethodType.custom) {
    const sortParams = [
      { sortFieldId: 'type', sortBy: [ 'Office Supplies', 'Furniture' ] },
      { sortFieldId: 'city', sortMethod: 'ASC' },
    ];
    setSortParams(sortParams)
    console.log('You can implement your manual sort interaction and logic here', sortParams)
  } else {
    // Use S2 provided intra-group sort method
    meta.spreadsheet.groupSortByMethod(key, meta)
    ;
  }
}

const s2Options = {
  // Set custom icon display condition
  headerActionIcons: [
    {
      onClick: (props) => {
        const { meta, event } = props;
        const operator = {
          onClick: ({ key }) => {
            // Execute custom sort callback
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
