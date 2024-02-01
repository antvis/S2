---
title: 导出
order: 3
tag: Updated
---

<Badge>@antv/s2</Badge> <Badge>@antv/s2-react</Badge>

`@antv/s2` 提供了 [复制导出的基础能力](/manual/advanced/interaction/copy), `@antv/s2-react` 组件层基于 `@antv/s2` 和 `antd` 封装了开箱即用的导出功能。

## 使用

```tsx | {17-21}
import { SheetComponent } from '@antv/s2-react'

const S2Options = {
  interaction: {
    // 开启复制
    copy: {
      enable: true
    }
  }
}

const App = () => {
  return (
    <SheetComponent
      dataCfg={dataCfg}
      options={S2Options}
      header={{
        export: {
          open: true
        }
      }}
    />
  )
}
```

:::info{title="提示"}
开启导出功能后，点击右上角的下拉菜单，可以复制和导出（原始/全量）数据。

1. `复制原始数据/复制格式化数据`: 可以直接粘贴到 `Excel`,`语雀` 等常用应用中。
2. `下载原始数据/下载格式化数据`: 生成 `csv` 文件，可以直接使用 `Excel` 打开。

:::

<video width="1000" controls>
  <source src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ" type="video/mp4">
  Your browser does not support HTML video.
</video>

[查看示例](/examples/react-component/export/#export)

## 在非 React 应用中使用

:::info{title="提示"}
本质上，`@antv/s2-react` 的导出分析组件，只是基于 `@antv/s2` 提供的能力，封装了相应的 UI, 如果不希望依赖框架，或者希望在 `Vue` 等框架中使用，都是可以的。
:::

<embed src="@/docs/common/copy-export.zh.md"></embed>
