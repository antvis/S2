---
title: Getting the Spreadsheet Instance
order: 8
---

<Badge>@antv/s2-react</Badge> <Badge type="success">@antv/s2-vue</Badge>

## React Version

When using the `SheetComponent` in React, if you need to access the [spreadsheet instance](/en/api/basic-class/spreadsheet) for advanced operations, you can use `React.useRef` and `onMounted`.

:::info{title="Note"}
The spreadsheet renders asynchronously. You must wait for the `onMounted` callback to get the latest instance.
:::

### Usage

```tsx
import React from 'react'
import { SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()

  const onMounted = () => {
    console.log(s2Ref.current)
  }

  return (
    <SheetComponent ref={s2Ref} onMounted={onMounted}/>
  )
}
```

### Usage with Other Components

If you need to use the S2 instance with other components that depend on it, you should use `React.useState` to store the instance. This is because a `ref` change does not trigger a re-render, which could prevent dependent components from updating correctly. [View Example](/en/examples/react-component/export/#export)

```tsx
import React from 'react'
import { SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'
import { Export } from '@antv/s2-react-components';

function App() {
  const [sheetInstance, setSheetInstance] = React.useState<SpreadSheet>();

  const onMounted = (s2: SpreadSheet) => {
    setSheetInstance(s2);
  };

  return (
    <>
      <Export sheetInstance={sheetInstance} />
      <SheetComponent onMounted={onMounted}/>
    </>
  )
}
```

### Instance Updates on Component Type Change

`S2` provides different spreadsheet types, such as `PivotSheet` and `TableSheet`. The `SheetComponent` corresponds to the `sheetType` prop.

```tsx
function App() {
  // pivot: PivotSheet, table: TableSheet
  return (
    <SheetComponent sheetType="pivot" />
  )
}
```

When the `sheetType` changes, a different underlying spreadsheet class is used for rendering, which means the **instance has changed**.

```diff
pivot => table

+ new TableSheet()
- new PivotSheet()
```

Any event listeners registered on the old instance will be removed. `S2` optimizes for this scenario, so whether you use `ref` or `onMounted`, you will always get the latest instance without needing to handle it yourself.

```tsx
import React from 'react'
import { SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()
  const [sheetType, setSheetType] = React.useState('pivot')

  const onMounted = (instance) => {
    console.log(s2Ref.current === instance) // Always true
  }

  React.useEffect(() => {
    setSheetType('table')
  },[])

  return (
    <SheetComponent ref={s2Ref} sheetType={sheetType} onMounted={onMounted}/>
  )
}
```

### Forwarding the Instance to a Parent Component

If you have created a wrapper around `SheetComponent` and need to expose the instance, you can use `React.forwardRef`.

```tsx
const YourComponent = React.forwardRef(
  (props, ref: React.MutableRefObject<SpreadSheet>) => {
    // ... your business logic
    return (
      <SheetComponent ref={ref} />
    )
  }
)

function App() {
  const s2Ref = React.useRef<SpreadSheet>()

  const onMounted = () => {
    console.log(s2Ref.current)
  }

  return (
    <YourComponent ref={s2Ref} onMounted={onMounted}/>
  )
}
```

## Vue Version

### Usage

The `ref` method returns an object, and the `instance` property on that object is the actual spreadsheet instance:

```vue
<script lang="ts">
import type { S2DataConfig, S2Options } from '@antv/s2';
import { Sheet } from '@antv/s2-vue';
import { defineComponent, onMounted, shallowRef } from 'vue';

export default defineComponent({
  setup() {
    const s2 = shallowRef();

    onMounted(() => {
      console.log('s2 instance:', s2.value?.instance);
    });
    return {
      s2
    };
  },
  components: {
    Sheet,
  },
});
</script>

<template>
  <SheetComponent ref="s2" :dataCfg="your-dataCfg" :options="your-options" />
</template>
```

### Forwarding the Instance to a Parent Component

If you have created a wrapper around the `Sheet` component and need to expose the instance, you can use the `useExpose` utility provided by the library.

```tsx
// Your wrapper component
import { defineComponent } from 'vue';
import { SheetComponent as BaseSheet, useExpose } from '@antv/s2-vue';

export default defineComponent({
  name: 'YourSheet',
  setup(props, ctx) {
    const s2Ref = useExpose(ctx.expose);
    return { s2Ref };
  },
  components: {
    BaseSheet,
  },
});
</script>
<template>
  <SheetComponent ref="s2Ref" />
</template>
```

The parent component can then get the instance using a `ref`:

```vue
<script lang="ts">
import { defineComponent, onMounted, shallowRef } from 'vue';
import YourSheet from './YourSheet.vue';

export default defineComponent({
  setup() {
    const s2 = shallowRef();

    onMounted(() => {
      console.log('s2 instance:', s2.value?.instance);
    });

    return {
      s2
    };
  },
  components: {
    YourSheet,
  },
});
</script>

<template>
  <YourSheet ref="s2" :dataCfg="your-dataCfg" :options="your-options" />
</template>
```
