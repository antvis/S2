---
title: 维度下钻
order: 13
tag: Updated
---

<Badge>@antv/s2-react</Badge> <Badge type="success">@antv/s2-vue</Badge>

S2 提供 `维度下钻` 的基础能力，`@antv/s2-react` 和 `@antv/s2-vue` 基于 `@antv/s2` 封装了 `维度下钻` 的组件，可以为你挖掘不同维度下更详细的数据，让你的数据洞察变得更清晰，也可以通过下钻的方式实现数据按需渲染。

<img src="https://gw.alipayobjects.com/zos/antfincdn/J7bnG8lcf/xiazuan.gif" height="400" alt="preview" />

## 简介

### 基本概念

- 主要适用于存在分层关系的数据源，对于某一个数据信息，向下钻取不同层级的数据表现。🌰 例如：查看不同区域的销售数据，您查看华中区销售额时，可以下钻查看湖北省的销售额。
- 下钻是由汇总数据深入到细节，层层深入以便更详细的查看数据的方式，让数据更加清晰明了，帮助充分挖掘数据背后的价值。

### 功能描述

配置维度下钻，当前仅支持透视模式的树形结构下，行头维度下钻。

### 拓展

向上钻取： 存在向上钻取，查看不同区域的销售数据，您查看浙江省销售额时，可以上钻查看华东区的销售额。

## 示例

<details>
<summary>点击查看 PartDrillDown 维度下钻配置</summary>

```tsx
import { DrillDown } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

const sex = ['男', '女'];

const PartDrillDown = {
  render: (props) => <DrillDown {...props}/>,
  drillConfig: {
    // 个性化配置 （可选）
    title: '下钻',
    clearText: '还原',
    searchText: '搜素',
    // 下钻数据源配置
    dataSet: [
      {
        name: '客户性别',
        value: 'sex',
        type: 'text',
      },
    ],
  },
  // 点击下钻后的回调
  fetchData: (meta, drillFields) =>
    new Promise((resolve) => {
      const dataSet = meta.spreadsheet.dataSet;
      const field = drillFields[0];
      const rowData = dataSet.getCellMultiData({ query: meta.query });
      const drillDownData = [];

      rowData.forEach((data) => {
        const { city, number, province, sub_type: subType, type } = data;
        const number0 = Math.ceil(Math.random() * (number - 50)) + 50;
        const number1 = number - number0;
        const dataItem0 = {
          city,
          number: number0,
          province,
          sub_type: subType,
          type,
          [field]: sex[0],
        };
        drillDownData.push(dataItem0);
        const dataItem1 = {
          city,
          number: number1,
          province,
          sub_type: subType,
          type,
          [field]: sex[1],
        };

        drillDownData.push(dataItem1);
      });

      resolve({
        drillField: field, // 下钻维度 value 值
        drillData: drillDownData, // 下钻数据
      });
    }),
};

```

</details>

```tsx
import React from 'react';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/s2-react.min.css';

const s2Options = {
  hierarchyType: 'tree', // 树形结构
};

const App = () => {
  return (
    <SheetComponent
      dataCfg={s2DataConfig}
      options={s2Options}
      partDrillDown={PartDrillDown}
    />
  )
}
```

<Playground path='react-component/drill-down/demo/for-pivot.tsx' rid='for-pivot'></playground>

### 单独使用下钻面板

```tsx | pure
import { DrillDown } from '@antv/s2-react-components';
import '@antv/s2-react-components/dist/s2-react-components.min.css';

function App() {
  return (
    <DrillDown
      dataSet={dataSet}
      disabledFields={disabledFields}
      clearText={clearText}
    />
  )
}
```

<Playground path='react-component/drill-down/demo/basic-panel.tsx' rid='basic-panel'></playground>

## 使用场景

:::info{title="🌰 案例"}

**洞察数据异常**：当销售负责人发现华中地区销售异常，远低于其他地区时。他通过下钻省份，查看华中地区所有省份的销售额。当发现湖北省销售异常时，由可以通过省份下钻到城市🏙，发现城市 B 销售额异常。通过下钻，我们快速的挖掘到了销售额异常的根源。

:::

<img src="https://gw.alipayobjects.com/zos/antfincdn/43CZawVX7/xiazuan-chengshi.gif" height="400" alt="preview" />

## API

<embed src="@/docs/api/components/drill-down.zh.md"></embed>
