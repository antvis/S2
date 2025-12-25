---
title: In-Group Sorting
order: 1

---

## Introduction

`In-group sorting` means that the sorting only affects the order within a specific group. For example, in the image below, when "Pen - Price" is sorted in `ascending order within the group`, the sort order of "Province" does not change; only the order of "City" within each "Province" is affected.

:::warning{title="Note"}
The `row/column headers` have only a single sorting state at a time, and the current state will **override the previous one**. As shown in the image, when "Pen" is sorted, the sorting state for "Paper" disappears. However, the `row headers` and `column headers` can each maintain their own sorting state simultaneously.
:::

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*PuoGS7DQdV8AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="group-sort" />

## Usage in `@antv/s2`

`@antv/s2` provides the capability for in-group sorting (which is equivalent to **global sorting** for a detail table). You can implement a [Tooltip sort menu](/manual/basic/tooltip) ([View Example](/examples/custom/custom-order/#custom-order-base)) and then call the relevant [API](/api/basic-class/spreadsheet).

```ts
const meta = cell.getMeta()

// Ascending
s2.groupSortByMethod('asc', meta)

// Descending
s2.groupSortByMethod('desc', meta)

// No sort
s2.groupSortByMethod('none', meta)
```

To listen for sort events:

```ts | pure
s2.on(S2Event.RANGE_SORT, (sortParams) => {
  console.log('sortParams:', sortParams)
});
```

- Example 1: Custom sort menu on column header click

<Playground path="analysis/sort/demo/group-sort-base.ts" rid='group-sort-base' height="200"></playground>

- Example 2: Custom sort menu on column header sort icon click ([Learn More](/manual/advanced/custom/custom-order))

<Playground path="custom/custom-order/demo/custom-order-base.ts" rid='custom-order-base' height="200"></playground>

## Usage in `@antv/s2-react`

`@antv/s2-react` builds upon the [basic sorting capabilities](/manual/basic/sort/basic) of `@antv/s2` and, when combined with a menu component (like `antd`'s `Menu`), provides a default in-group sorting feature. The sort menu is hosted in a [Tooltip](/manual/basic/tooltip) (just enable the tooltip) and is primarily used to sort `row/column headers` by numerical values. [See more sorting examples](/examples/analysis/sort/#group-sort).

By default, the `SheetComponent` from `@antv/s2-react` displays a sort `icon` in the numerical headers. Clicking it reveals three options: `Ascending`, `Descending`, and `No Sort`. This can be configured in the `options`.

:::info
Since version `2.0`, the dependency on the antd [Menu component](https://ant.design/components/menu#api) for the internal **sort menu** and **operation items** has been removed. You now need to explicitly declare the UI component using `render`. The final effect is the same, and default menu configurations (props) are provided, which you can adjust based on the version of `antd@v4` or `antd@v5` you are using in your project.
:::

```ts
import { Menu } from 'antd'

const s2Options = {
  width: 600,
  height: 600,
  // Show the operation icon (enabled by default)
  showDefaultHeaderActionIcon: true,
  // Show the tooltip (enabled by default)
  tooltip: {
    operation: {
      // Enable in-group sorting (enabled by default)
      sort: true,
      menu: {
        render: (props) => {
          return <Menu {...props} />;
        },
      }
    },
  },
};
```

To listen for sort events:

```tsx | pure
function onRangeSort(sortParams) {
  console.log('sortParams:', sortParams);
}

<SheetComponent onRangeSort={onRangeSort} />
```

<Playground path="analysis/sort/demo/group-sort.tsx" rid='group-sort' height="200"></playground>
