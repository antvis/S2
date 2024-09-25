---
title: 导出
order: 3
tag: Updated
---

<Badge>@antv/s2</Badge> <Badge>@antv/s2-react-components</Badge>

`@antv/s2` 提供了 [复制导出的基础能力](/manual/advanced/interaction/copy), `@antv/s2-react-components` 组件层基于 `@antv/s2` 和 `antd` 封装了开箱即用的导出功能。

<Playground path='/react-component/export/demo/export.tsx' rid='export-component'></playground>

## 使用

```tsx
import React from 'react'
import { SheetComponent } from '@antv/s2-react'
import { Export } from '@antv/s2-react-components'
import '@antv/s2-react/dist/s2-react.min.css';
import '@antv/s2-react-components/dist/s2-react-components.min.css';


const S2Options = {
  interaction: {
    // 开启复制
    copy: {
      enable: true
    }
  }
}

const App = () => {
  const s2Ref = React.useRef()

  return (
    <>
      <Export sheetInstance={s2Ref.current} />
      <SheetComponent
        dataCfg={dataCfg}
        options={S2Options}
        ref={s2Ref}
      />
    </>
  )
}
```

:::info{title="提示"}
开启导出功能后，点击右上角的下拉菜单，可以复制和导出（原始/全量）数据。

1. `复制原始数据/复制格式化数据`: 可以直接粘贴到 `Excel (text/plain)`, `语雀 (text/html)` 等常用应用中。
2. `下载原始数据/下载格式化数据`: 生成 `csv` 文件，可以直接使用 `Excel (text/plain)` 打开。

:::

<video width="1000" controls>
  <source src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/file/A*EZfPRJqzl4cAAAAAAAAAAAAAARQnAQ" type="video/mp4">
  Your browser does not support HTML video.
</video>

[查看示例](/examples/react-component/export/#export)

### 自定义入口

`Export` 组件默认入口为 `三个点`，可以通过 `children` 的方式自定义。

```tsx
import { Button } from 'antd'
import { ExportOutlined } from '@ant-design/icons';
import { Export } from '@antv/s2-react-components'
import '@antv/s2-react-components/dist/s2-react-components.min.css';

const App = () => {
  return (
    <Export sheetInstance={s2Ref.current}>
      <Button type="text" icon={<ExportOutlined />}>
        导出数据
      </Button>
    </Export>
  )
}
```

### API

```tsx | pure
<Export
  onCopySuccess={(data) => {
    console.log('copy success:', data);
  }}
  onDownloadSuccess={(data) => {
    console.log('download success', data);
  }}
/>
```

查看 [分析组件 - 导出 API 文档](/api/components/export#copyalldataparams)

## 在趋势分析表中使用

由于 [趋势分析表](/manual/advanced/analysis/strategy) 数据结构的特殊性，和普通表格的导出有所不同，需要通过 `@antv/s2-react-components` 提供的 `StrategyExport` 组件， 使用方式和 `Export` 相同。

```tsx
import { StrategyExport } from '@antv/s2-react-components'

<StrategyExport sheetInstance={s2Ref.current} />
```

查看 [示例](/examples/react-component/export#export-strategy)

`<StrategyExport />` 内部使用的是 `strategyCopy` 处理数据的复制导出，等价于下面的代码：

```tsx
import { strategyCopy } from '@antv/s2';
import { Export } from '@antv/s2-react-components'

<Export sheetInstance={s2Ref.current} customCopyMethod={strategyCopy} />
```

所以，当你有自定义导出组件的诉求时，你也可以通过 `strategyCopy` 自行封装。

## 在非 React 应用中使用

:::info{title="提示"}
本质上，`@antv/s2-react-components` 的导出组件，只是基于 `@antv/s2` 提供的能力，封装了**相应的 UI**, 如果不希望依赖框架，或者希望在 `Vue` 等框架中使用，都是可以的。
:::

<embed src="@/docs/common/copy-export.zh.md"></embed>
