---
title: Get Instance
order: 8
---

## React version

For scenarios such as using the `React` component `SheetComponent` , if you need to get the [table instance](/docs/api/basic-class/spreadsheet) and perform some advanced operations, you can use `React.useRef` and `onMounted` two ways

### ref method (recommended)

```tsx
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

### Instance update when component shape changes

`S2` provides table forms such as`透视表`and `sheetType``明细表`corresponds to the `SheetComponent` component

```tsx
function App() {
  // pivot 透视表，table: 明细表
  return (
    <SheetComponent sheetType="pivot" />
  )
}
```

When the `sheetType` changes, the bottom layer will use different table classes for rendering, which means that the`实例`has changed at this time

```diff
pivot => table

+ new TableSheet()
- new PivotSheet()
```

The registration event will be canceled before the change. `S2` optimizes this scenario. Regardless of the `ref` or `onMounted` method, the latest instance is obtained, and developers do not need to care

```tsx
import { SpreadSheet, S2Event } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()
  const [sheetType, setSheetType] = React.useState('pivot')

  const onMounted = (instance) => {
    console.log(s2Ref.current === instance)
  }

  return (
    <SheetComponent ref={s2Ref} sheetType={sheetType} onMounted={onMounted}/>
  )
}
```

### Forward the instance to the upper component

If your business has re-encapsulated `SheetComponent` and needs to expose instances, you can use `React.forwardRef` for instance forwarding

```tsx
const YourComponent = React.forwardRef(
  (props, ref: React.MutableRefObject<SpreadSheet>) => {

    // ... 业务逻辑

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

## Vue version

### ref method (recommended)

The ref method gets an object, and the `instance` attribute in it corresponds to the real table instance:

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

### Forward the instance to the upper component

If your business has re-encapsulated `Sheet` and needs to expose instances, you can use `useExpose` provided by the library to forward instances

```tsx
//  二次封装组件
export default defineComponent({
  name: 'YourSheet',
  props: [] as unknown as BaseSheetInitProps,
  emits: [] as unknown as BaseSheetInitEmits,
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

Use the ref method to obtain an instance of an external component:

```vue
<script lang="ts">
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
  <YourSheet ref="s2" :dataCfg="your-dataCfg" :options="your-options" />
</template>
```
