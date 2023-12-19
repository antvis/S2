---
title: Drill Down
order: 13
---

The "dimension drill-down" capability provided by S2 can dig out more detailed data in different dimensions for you, making your data insights clearer.

<img src="https://gw.alipayobjects.com/zos/antfincdn/J7bnG8lcf/xiazuan.gif" height="400" alt="preview">

## Introduction

### basic concept

* It is mainly applicable to data sources with hierarchical relationships. For a certain data information, drill down to the data performance of different levels. 🌰 For example: to view sales data in different regions, when you view sales in Central China, you can drill down to view sales in Hubei Province.
* Drill-down is a way to drill down from the summary data to the details, layer by layer, so as to view the data in more detail, making the data clearer and helping to fully tap the value behind the data.

### Functional description

Configure dimension drill-down, currently only supports drill-down in the perspective mode tree structure, row header dimension drill-down

### expand

Drill Up: Drill Up exists to view sales data in different regions. When you view sales in Zhejiang Province, you can drill up to view sales in East China.

## Get started quickly

<details><summary>Click to view the PartDrillDown dimension drill down configuration</summary><pre> <code class="language-js">
const&#x26;nbsp;sex&#x26;nbsp;=&#x26;nbsp;[&#x26;nbsp;'男',&#x26;nbsp;'女'&#x26;nbsp;];

const&#x26;nbsp;PartDrillDown&#x26;nbsp;=&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;drillConfig:&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;dataSet:&#x26;nbsp;[&#x26;nbsp;//&#x26;nbsp;下钻数据源配置
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;name:&#x26;nbsp;'客户性别',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;value:&#x26;nbsp;'sex',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type:&#x26;nbsp;'text',
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;},
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;],
&#x26;nbsp;&#x26;nbsp;},

&#x26;nbsp;&#x26;nbsp;//&#x26;nbsp;点击下钻后的回调
&#x26;nbsp;&#x26;nbsp;fetchData:&#x26;nbsp;(meta,&#x26;nbsp;drillFields)&#x26;nbsp;=>
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;new&#x26;nbsp;Promise((resolve)&#x26;nbsp;=>&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;dataSet&#x26;nbsp;=&#x26;nbsp;meta.spreadsheet.dataSet;
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;field&#x26;nbsp;=&#x26;nbsp;drillFields[0];
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;rowDatas&#x26;nbsp;=&#x26;nbsp;dataSet.getCellMultiData(meta.query,&#x26;nbsp;true,&#x26;nbsp;true);
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;drillDownData&#x26;nbsp;=&#x26;nbsp;[];
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;rowDatas.forEach((data)&#x26;nbsp;=>&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;{&#x26;nbsp;city,&#x26;nbsp;number,&#x26;nbsp;province,&#x26;nbsp;sub_type:&#x26;nbsp;subType,&#x26;nbsp;type&#x26;nbsp;}&#x26;nbsp;=&#x26;nbsp;data;
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;number0&#x26;nbsp;=&#x26;nbsp;Math.ceil(Math.random()&#x26;nbsp;*&#x26;nbsp;(number&#x26;nbsp;-&#x26;nbsp;50))&#x26;nbsp;+&#x26;nbsp;50;
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;number1&#x26;nbsp;=&#x26;nbsp;number&#x26;nbsp;-&#x26;nbsp;number0;
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;dataItem0&#x26;nbsp;=&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;number:&#x26;nbsp;number0,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;sub_type:&#x26;nbsp;subType,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;[field]:&#x26;nbsp;sex[0],
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;};
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;drillDownData.push(dataItem0);
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;const&#x26;nbsp;dataItem1&#x26;nbsp;=&#x26;nbsp;{
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;city,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;number:&#x26;nbsp;number1,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;province,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;sub_type:&#x26;nbsp;subType,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;type,
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;[field]:&#x26;nbsp;sex[1],
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;};

&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;drillDownData.push(dataItem1);
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;});

<<<<<<< HEAD
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;resolve({
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;drillField:&#x26;nbsp;field,&#x26;nbsp;//&#x26;nbsp;下钻维度&#x26;nbsp;value&#x26;nbsp;值
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;drillData:&#x26;nbsp;drillDownData,&#x26;nbsp;//&#x26;nbsp;下钻数据
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;});
&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;&#x26;nbsp;}),
=======
  // 点击下钻后的回调
  fetchData: (meta, drillFields) =>
    new Promise((resolve) => {
      const dataSet = meta.spreadsheet.dataSet;
      const field = drillFields[0];
      const rowDatas = dataSet.getMultiData(meta.query);
      const drillDownData = [];
      rowDatas.forEach((data) => {
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
>>>>>>> origin/master
};

</code></pre></details>

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { SheetComponent } from '@antv/s2-react';

const s2Options = {
  hierarchyType: 'tree', // 树形结构
};

ReactDOM.render(
  <SheetComponent
    dataCfg={s2DataConfig}
    options={s2Options}
    partDrillDown={PartDrillDown}
  />,
  document.getElementById('container'),
);
```

<Playground path="react-component/drill-dwon/demo/for-pivot.tsx" rid="container"></Playground>

## scenes to be used

🌰 Case: **insight into abnormal data** : when the sales leader finds that the sales in Central China are abnormal, which is much lower than other regions. He drills down to the provinces to view the sales of all provinces in Central China. When abnormal sales in Hubei Province are found, you can drill down to the city 🏙 through the province and find that the sales in city B are abnormal. Through drilling down, we quickly discovered the root cause of abnormal sales.

<img src="https://gw.alipayobjects.com/zos/antfincdn/43CZawVX7/xiazuan-chengshi.gif" height="400" alt="preview">

## APIs

<embed src="@/docs/api/components/drill-down.en.md"></embed>
