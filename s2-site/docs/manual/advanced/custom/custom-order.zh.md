---
title: 自定义排序操作
order: 6
tag: Updated
---

:::warning{title="注意"}
阅读本章前，请确保已经阅读过 [基础排序](/manual/basic/sort/basic)，[组内排序](/manual/basic/sort/group)，[Tooltip 注意事项](/manual/basic/tooltip#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9) 等章节。
:::

`S2` 提供默认的基础 [排序操作](/examples/analysis/sort#group-sort) 和 React 版本的 [高级排序](/examples/analysis/sort#advanced) 组件。

但在某些业务场景下，我们仍需要自定义排序，我们将它分为**自定义排序 `icon`**，**自定义排序 `tooltip`**，**自定义排序操作**三个部分。

<img alt="preview" height="600" src="https://gw.alipayobjects.com/zos/antfincdn/oOiZ02mZJ/zidingyipaixu.gif" />

## 自定义排序 icon

相关章节：[自定义 icon](/examples/custom/custom-icon#custom-header-action-icon)

### 配置

- 关闭表头默认 [排序操作 icon](/manual/basic/sort/group).

```jsx
const s2Options = {
  showDefaultHeaderActionIcon: false,
  ...
}
```

- 配置 [自定义 icon](/manual/advanced/custom/custom-icon)

```jsx
const s2Options = {
  customSVGIcons: [
    {
      name: 'customKingIcon',
      src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ],
  ...
}
```

- 配置 icon [展示位置](/manual/advanced/custom/custom-icon#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E5%88%97%E5%A4%B4-icon)

```jsx
const s2Options = {
  headerActionIcons: [
    {
      // 选择 icon, 可以是 S2 自带的，也可以是自定义的 icon
      icons: ['customKingIcon'],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      displayCondition: (meta) => meta.level === 2,
      defaultHide: false,
      ...
    }],
  ...
}
```

### 效果展示

<img alt="preview" src="https://gw.alipayobjects.com/zos/antfincdn/s%26vVrM8Ap/14a3a4fa-6d07-4fb8-8201-012672bd0feb.png" height="600" />

## 自定义 Tooltip

相关章节：[headerActionIcons 配置说明](/api/general/s2-options#headeractionicon)

### 配置

- 排序菜单会在 Tooltip 中展示，确认 `tooltip` 为打开状态。

```jsx
const s2Options = {
  tooltip: {
    enable: true,
  },
  ...
}
```

- 指定排序菜单 UI

:::warning{title="注意"}

1. 如果使用的是 `@antv/s2`, 需要自行实现排序菜单的 UI, 否则 `tooltip` 不会展示。[查看示例](/examples/analysis/sort/#group-sort-base) 和 [Tooltip 注意事项](/manual/basic/tooltip#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)
2. 如果使用的是 `@antv/s2-react`, 可以结合任意组件库使用。[查看示例](/examples/custom/custom-order#custom-order)

:::

```tsx
import { Menu } from 'antd'

const s2Options = {
  tooltip: {
    enable: true,
    operation: {
      menu: {
        render: (props) => {
          return <Menu {...props} />;
        },
      }
    }
  },
}
```

- 自定义 `icon` 点击后的 `tooltip` 展示

```jsx
const items = [
  { key: 'NONE', label: '不排序' },
  { key: 'ASC', label: '升序', icon: 'GroupAsc' },
  { key: 'DESC', label: '降序', icon: 'GroupDesc' },
  { key: 'CUSTOM', label: '自定义排序', icon: 'Trend' },
];

const s2Options = {
  // 设置自定义 `icon` 的展示条件
  headerActionIcons: [
    {
      // 选择 icon, 可以是 S2 自带的，也可以是自定义的 icon, https://s2.antv.antgroup.com/manual/advanced/custom/custom-icon
      icons: ['customKingIcon'],
      // 通过 belongsCell + displayCondition 设置 icon 的展示位置
      belongsCell: 'colCell',
      // 展示条件
      displayCondition: (meta) => meta.level === 2,
      // 默认是否隐藏，hover 后再展示
      defaultHide: false,
      // icon 点击之后的执行函数
      onClick: (options) => {
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
      onHover: (options) => {}
    },
  ],
  ...
}
```

### 预览

<img alt="preview" src="https://gw.alipayobjects.com/zos/antfincdn/jTQbHqPuB/4917862a-e60c-4889-824f-f4d11f192f86.png" height="600" />

## 自定义排序操作

相关章节：[自定义排序](/manual/basic/sort/basic)

### 配置

```jsx
// 执行自定义排序回调
const handleSortCallback = (meta, key) => {
  if (key === 'CUSTOM') {
    const sortParams = [
      { sortFieldId: 'type', sortBy: [ '办公用品', '家具' ] },
      { sortFieldId: 'city', sortMethod: 'ASC' },
    ];
    console.log('可以在这里实现你手动排序的交互和逻辑哟', sortParams)
  } else {
    // 使用 S2 提供的组内排序方式
    meta.spreadsheet.groupSortByMethod(key, meta)
  }
}

const s2Options = {
  headerActionIcons: [
    {
      onClick: (props) => {
        const { meta, event } = props
        const operator = {
          menu: {
            onClick: ({ key }) => {
              // 执行自定义排序回调
              handleSortCallback(meta, key)
              meta.spreadsheet.hideTooltip()
            },
            items
          },
        }

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

### 预览

#### 在 `@antv/s2` 中使用

<Playground path='custom/custom-order/demo/custom-order-base.tsx' rid='custom-order-base' height='400'></Playground>

#### 在 `@antv/s2-react` 中使用

<Playground path='custom/custom-order/demo/custom-order.tsx' rid='custom-order' height='400'></Playground>
