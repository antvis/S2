---
title: Detail Table
order: 2
---

## Introduction

The Detail Table is one of the basic forms of `S2`. It is a standard table that displays each row of data directly under the column headers. It is primarily used for displaying detailed data in big data scenarios.

The Detail Table shares capabilities with the Pivot Table, such as [basic interactions](/manual/advanced/interaction/basic), [theming](/manual/basic/theme), [copying](/manual/basic/analysis/export), and [custom cells](/manual/advanced/custom/hook). In addition, the Detail Table supports special features like [row and column freezing](/examples/interaction/basic#frozen). In scenarios with massive amounts of detailed data, the Detail Table can replace `DOM`-based table components to improve performance and user experience.

<img alt="table-mode" src="https://gw.alipayobjects.com/zos/antfincdn/jWifHNLOsB/08db1064-bb09-4d44-b42b-26aed1766545.png" width="600" />

## Usage

```html
<div id="container" />
```

```ts
import { TableSheet } from "@antv/s2";

// Prepare the data
const data = [
  {
    province: "Zhejiang",
    city: "Hangzhou",
    type: "Pen",
    price: "1",
  },
  {
    province: "Zhejiang",
    city: "Hangzhou",
    type: "Paper",
    price: "2",
  },
];

// Configure the data
const s2DataConfig = {
  fields: {
    columns: ["province", "city", "type", "price"], // List of column header field IDs to display
  },
  meta: [
    // Metadata for the column header fields, e.g., for display names
    {
      field: "province",
      name: "Province",
    },
    {
      field: "city",
      name: "City",
    },
    {
      field: "type",
      name: "Type",
    },
    {
      field: "price",
      name: "Price",
    },
  ],
  data,
};

// Render
async function bootstrap() {
  const container = document.getElementById('container');
  const s2 = new TableSheet(container, s2DataConfig, s2Options);

  await s2.render();
}

bootstrap()
```

<Playground path='basic/table/demo/table.ts' rid='table' height='300'></playground>

[View Example](/examples/basic/table) and [API documentation](/api/general/s2options).

## Usage in React

### Using `@antv/s2`

```tsx
import React from "react";
import { TableSheet } from '@antv/s2';

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

    const s2 = new TableSheet(containerRef.current, s2DataConfig, s2Options);
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
      sheetType="table"
      dataCfg={s2DataConfig}
      options={s2Options}
    />
  )
}
```

[View Example](/examples/react-component/sheet/#table) and [API documentation](/api/components/sheet-component).

## Features

### Series Number

You can display a built-in series number column by passing `seriesNumber` in `s2Options`. You can also customize the column title. [View Example](/examples/basic/table#table)

```ts
const s2Options = {
  seriesNumber: {
    enable: true,
    text: 'Index'
  }
}
```

### Row and Column Freezing

Row and column freezing keeps specific rows and columns fixed during scrolling, ensuring they remain in the viewport for reference. [View Example](/examples/interaction/basic#frozen)

<Playground path='layout/frozen/demo/table-frozen.ts' rid='table-frozen' height='300'></playground>

<br/>

Row and column freezing is controlled by these properties in `s2Options`:

```ts
const s2Options = {
  frozen: {
    rowCount: number; // Number of rows to freeze from the top
    trailingRowCount: number; // Number of rows to freeze from the bottom
    colCount: number; // Number of columns to freeze from the left
    trailingColCount: number; // Number of columns to freeze from the right
  }
}
```

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*tZkOSqYWVFQAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

### Custom Column Header Grouping

By default, the column header structure is grouped based on the provided dimension values. Custom grouping is also supported, allowing for multi-level column headers. [Learn More](/manual/advanced/custom/custom-header)

### Empty Data Placeholder

When the data is empty, you can display a custom icon and description. Icons can be registered via [customSVGIcons](/manual/advanced/custom/custom-icon) or use built-in icons. The size and spacing of the icon and text can be modified through [theme configuration](/api/general/s2-theme#empty).

<Playground path='/custom/custom-cell/demo/empty-placeholder.ts' rid='empty-placeholder' height='300'></playground>
