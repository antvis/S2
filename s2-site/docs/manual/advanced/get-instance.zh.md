---
title: 获取表格实例
order: 8
---

<Badge>@antv/s2-react</Badge> <Badge type="success">@antv/s2-vue</Badge>

## React 版本

对于使用 `React` 组件 `SheetComponent` 这一类场景，如果需要获取到 [表格实例](/docs/api/basic-class/spreadsheet)，进行一些进阶操作时，可以使用 `React.useRef` 和 `onMounted` 进行获取。

### 使用

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

### 组件形态变更时实例更新

`S2` 提供了 `透视表`, `明细表` 等表形态，对于 `SheetComponent` 组件 对应 `sheetType` 属性

```tsx
function App() {
  // pivot 透视表，table: 明细表
  return (
    <SheetComponent sheetType="pivot" />
  )
}
```

当 `sheetType` 变更时，底层会使用不同的表格类进行渲染，也就意味着此时 `实例` 已经**发生了变更**.

```diff
pivot => table

+ new TableSheet()
- new PivotSheet()
```

变更前注册事件会被注销，`S2` 对这种场景进行了优化，不管是 `ref` 还是 `onMounted` 方式，拿到的都是最新的实例，开发者无需关心

```tsx
import React from 'react'
import { SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()
  const [sheetType, setSheetType] = React.useState('pivot')

  const onMounted = (instance) => {
    console.log(s2Ref.current === instance)
  }

  React.useEffect(() => {
    setSheetType('table')
  },[])

  return (
    <SheetComponent ref={s2Ref} sheetType={sheetType} onMounted={onMounted}/>
  )
}
```

### 转发实例给上层组件

如果你的业务对于 `SheetComponent` 进行了二次封装，需要暴露实例时，可以使用 `React.forwardRef` 进行实例转发。

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

## Vue 版本

### 使用

ref 方式得到的是一个对象，其中的 `instance` 属性才对应真正的表格实例：

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

### 转发实例给上层组件

如果你的业务对于 `Sheet` 进行了二次封装，需要暴露实例时，可以使用库提供的 `useExpose` 进行实例转发

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

外部组件获取实例搭配使用 ref 方式：

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
