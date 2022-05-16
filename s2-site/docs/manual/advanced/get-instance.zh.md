---
title: 获取表格实例
order: 8
---

对于使用 React 组件 `SheetComponent` 这一类场景，如果需要获取到 [表格实例](/zh/docs/api/basic-class/spreadsheet)， 进行一些进阶操作时，可以使用 `React.useRef` 和 `getSpreadSheet` 两种方式

## ref 方式 （推荐）

```tsx
import { SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()

  React.useEffect(() => {
    console.log(s2Ref.current)
  }, [])

  return (
    <SheetComponent ref={s2Ref} />
  )
}
```

## getSpreadSheet 方式

```tsx
import { SpreadSheet } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()

  const getSpreadSheet = (instance) => {
    s2Ref.current = instance
  }

  React.useEffect(() => {
    console.log(s2Ref.current)
  }, [])

  return (
    <SheetComponent getSpreadSheet={getSpreadSheet} />
  )
}
```

## 组件形态变更时重新监听事件

`S2` 提供了 `透视表`, `明细表` 等表形态，对于 `SheetComponent` 组件 对应 `sheetType` 属性

```tsx
function App() {
  // pivot 透视表，table: 明细表
  return (
    <SheetComponent sheetType="pivot" />
  )
}
```

当 `sheetType` 变更时，底层会使用不同的表格类进行渲染，也就意味着此时 `实例` 已经发生了变更，变更前注册事件会被注销，`S2` 对这种场景进行了优化，不管是 `ref` 还是 `getSpreadSheet` 方式，拿到的都是最新的实例，只需要监听 `sheetType`, 变更时对事件重新监听即可

```tsx
import { SpreadSheet, S2Event } from '@antv/s2'
import { SheetComponent } from '@antv/s2-react'

function App() {
  const s2Ref = React.useRef<SpreadSheet>()
  const [sheetType, setSheetType] = React.useState('pivot')

  React.useEffect(() => {
    s2Ref.current.on(S2Event.xxx, () => {
      ...
    })
  // 保证表形态变更时，保持事件的正常监听
  }, [sheetType])

  return (
    <SheetComponent sheetType={sheetType} />
  )
}
```

## 转发实例给上层组件

如果你的业务对于 `SheetComponent` 进行了二次封装，需要暴露实例时，可以使用 `React.forwardRef` 进行实例转发

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

  React.useEffect(() => {
    console.log(s2Ref.current)
  }, [])

  return (
    <YourComponent ref={s2Ref} />
  )
}
```
