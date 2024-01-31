---
title: 表头
order: 2
tag: Updated
---

<Badge>@antv/s2-react</Badge>

表头组件基于 `@antv/s2` 和 `antd` 进行封装，内置了 `标题`, `描述`, `行列切换`, `高级排序`, `导出` 等能力。

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Pui0SaMs910AAAAAAAAAAAAADmJ7AQ/original" width="600" alt="header"/>

## 快速上手

```tsx
import React from 'react'
import { SheetComponent } from '@antv/s2-react'
import { Button } from 'antd'

const App = () => {
  const [dataCfg, setDataCfg] = React.useState(s2DataConfig);
  const [sortParams, setSortParams] = React.useState([]);

  const header =  {
    title: '表头标题',
    description: '表头描述',
    export: { open: true },
    advancedSort: {
      open: true,
      sortParams,
      onSortConfirm: (ruleValues, sortParams) => {
        setDataCfg({ ...dataCfg, sortParams });
        setSortParams(sortParams);
      },
    },
    switcher: { open: true },
    extra: (
      <Button size={'small'} style={{ verticalAlign: 'top' }}>
        自定义按钮
      </Button>
    ),
  };

  return (
    <SheetComponent
      dataCfg={dataCfg}
      options={s2Options}
      header={header}
      adaptive={false}
    />
  );
};

```

## 效果

[查看示例](/examples/react-component/header#default)

<Playground path='/react-component/header/demo/default.tsx' rid='header'></playground>

## API

<embed src="@/docs/common/header.zh.md"></embed>
