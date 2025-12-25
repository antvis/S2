---
title: Pivot Table
order: 1

---

## Introduction

A pivot table, also known as a crosstab or multi-dimensional table, is a table that displays the relationships between multiple variables. It helps users discover interactions between them and facilitates cross-exploration analysis, making it one of the most frequently used charts in the field of business intelligence.

<img alt="pivot-mode" src="https://gw.alipayobjects.com/zos/antfincdn/a6zSe1gvvy/f97ed6ec-0a5d-49b7-8492-754611d0aea6.png" width="600" />

## Usage

```html
<div id="container" />
```

```ts
import { PivotSheet } from "@antv/s2";

// Prepare the data
const data = [
  {
    province: "Zhejiang",
    city: "Hangzhou",
    type: "Furniture",
    sub_type: "Table",
    price: "1",
  },
  {
    province: "Zhejiang",
    city: "Hangzhou",
    type: "Furniture",
    sub_type: "Sofa",
    price: "2",
  },
  {
    province: "Zhejiang",
    city: "Hangzhou",
    type: "Office Supplies",
    sub_type: "Pen",
    price: "3",
  },
  {
    province: "Zhejiang",
    city: "Hangzhou",
    type: "Office Supplies",
    sub_type: "Paper",
    price: "4",
  },
];

// Configure the data
const s2DataConfig = {
  fields: {
    rows: ["province", "city"],
    columns: ["type", "sub_type"],
    values: ["price"]
  },
  data,
};

// Add configuration
const s2Options = {
  width: 600,
  height: 600,
};

// Render
async function bootstrap() {
  const container = document.getElementById('container');
  const s2 = new PivotSheet(container, s2DataConfig, s2Options);

  await s2.render();
}

bootstrap()
```

<Playground path='/basic/pivot/demo/grid.ts' rid='pivot-grid' height='300'></playground>

[View Example](/examples/basic/pivot#grid) and [API documentation](/api/general/s2options).

## Usage in React

### Using `@antv/s2`

```tsx
import React from "react";
import { PivotSheet } from '@antv/s2';

const s2Options = {
  width: 400,
  height: 200,
};

const App = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const shouldInit = React.useRef(true);
  const isDevMode = React.useMemo(() => {
    try {
      return process.env['NODE_ENV'] !== 'production';
    } catch {
      return false;
    }
  }, []);

  React.useEffect(() => {
    // Workaround for React 18 StrictMode double render in dev
    if (isDevMode && !shouldInit.current) {
      return;
    }

    const s2 = new PivotSheet(containerRef.current, s2DataConfig, s2Options);
    shouldInit.current = false;

    return () => {
      s2?.destroy?.();
    };
  }, []);

  return <div id="container" ref={containerRef} />
}
```

### Using `@antv/s2-react` <Badge type="success">Recommended</Badge>

```tsx
import React from "react";
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

const s2Options = {
  width: 400,
  height: 200,
};

const App = () => {
  return (
    <SheetComponent
      sheetType="pivot"
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

[View Example](/examples/react-component/sheet#pivot) and [API documentation](/api/components/sheet-component).

## Features

### Series Number

You can display a built-in series number column by passing `seriesNumber` in `s2Options`. You can also customize the column title. [View Example](/examples/basic/pivot#grid)

```ts
const s2Options = {
  seriesNumber: {
    enable: true,
    text: 'Custom Title' // Default is "序号"
  }
}
```

### Display Modes

It supports two display modes by default: [Grid Mode](/en/examples/basic/pivot/#grid) and [Tree Mode](/en/examples/basic/pivot/#tree).

### Data Summarization

It supports pivot capabilities for [subtotals and grand totals](/manual/basic/totals).

### Frozen Row Header Area

When the row header area is frozen, it will have its own scrollable area. If you disable the frozen row header, the entire table will be the scrollable area.

<Playground path='layout/frozen/demo/pivot-frozen-row-header.ts' rid='pivot-frozen-row-header' height='300'></playground>

<br/>

```ts
const s2Options = {
  frozen: {
    rowHeader: false, // Enabled by default
  }
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*kk0ETbbbnOsAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview" />

The default maximum frozen width is `1/2` of the table area, but this can be customized:

```ts
const s2Options = {
  frozen: {
    rowHeader: 0.2, // Default is 0.5 (range: 0 - 1)
  }
}
```

### Frozen Row and Column Header Cells

:::info{title="Note"}
Unlike [row and column freezing in a detail table](https://s2.antv.antgroup.com/manual/basic/sheet-type/table-mode#row-and-column-freezing), pivot tables have more complex layouts due to their grouping features, which leads to the following limitation:

- When the series number column is enabled and has a [custom layout](/examples/custom/custom-cell/#series-number-cell), freezing row header cells is not currently supported because the relationship between the series number column and the row header cells is unknown.

:::

Row and column freezing is controlled by these properties in `s2Options`:

```ts
const s2Options = {
  frozen: {
    rowCount: number; // Number of leaf row nodes to freeze from the top
    trailingRowCount: number; // Number of leaf row nodes to freeze from the bottom
    colCount: number; // Number of leaf column nodes to freeze from the left
    trailingColCount: number; // Number of leaf column nodes to freeze from the right
  }
}
```

#### Tree Mode

```ts
const s2Options = {
  hierarchyType: 'tree',
  frozen: {
    rowCount: 1,
  },
}
```

<Playground path='layout/frozen/demo/frozen-pivot-tree.ts' rid='container-tree' height='300'></playground>

<br/>

#### Grid Mode

```ts
const s2Options = {
  hierarchyType: 'grid',
  frozen: {
    rowCount: 1,
  },
  totals: {
    row: {
      showGrandTotals: true,
      reverseLayout: true,
    },
  },
}
```

<Playground path='layout/frozen/demo/frozen-pivot-grid.ts' rid='container-grid' height='300'></playground>

<br/>

### Custom Row and Column Header Grouping

By default, the row and column header structures are grouped based on the provided dimension values. Custom grouping is also supported. [Learn More](/manual/advanced/custom/custom-header)
