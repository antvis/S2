---
title: 自定义单元格内绘制 G2 图表
order: 8
---

S2 支持 [自定义单元格](https://s2.antv.antgroup.com/examples#custom-custom-cell)，也内置了 [简单的 mini 图绘制](https://s2.antv.antgroup.com/examples/custom/custom-cell/#mini-chart), 如果上诉功能都无法满足使用，那么还可以使用专业的可视化图表库 [`AntV/G2`](https://g2.antv.antgroup.com/).

`S2` 和 `G2` 底层都使用 [AntV/G](https://g.antv.antgroup.com/) 渲染引擎绘制，也就意味着可以**共享渲染引擎**, 实现在 `S2` 表格中绘制 `G2` 图表的梦幻联动，实现真 `图·表`.

<Playground path='custom/custom-g2-chart/demo/custom-g2-chart.ts' rid='container' height='400'></playground>

<br/>

## 数据准备

数据源类型为 [MultiData](https://s2.antv.antgroup.com/api/general/s2-data-config#multidata) 支持 `普通数值单元格` 和 `图表单元格` 共存。图表数据源为标准的 [G2 Spec](https://g2.antv.antgroup.com/examples/general/interval/#column).

```ts
const s2DataConfig = {
  data: [
    // 普通数据
    {
      number: 1343,
      province: '浙江省',
      city: '杭州市',
      type: '办公用品',
      sub_type: '纸张',
    },
    {
      number: {
        // G2 图表数据 (Spec) https://g2.antv.antgroup.com/examples/general/interval/#column
        values: {
          type: 'view',
          autoFit: true,
          padding: 0,
          axis: false,
          children: [
            {
              type: 'image',
              style: {
                src: 'https://gw.alipayobjects.com/zos/rmsportal/NeUTMwKtPcPxIFNTWZOZ.png',
                x: '50%',
                y: '50%',
                width: '100%',
                height: '100%',
              },
              tooltip: false,
            },
            {
              type: 'heatmap',
              data: {
                type: 'fetch',
                value: 'https://assets.antv.antgroup.com/g2/heatmap.json',
              },
              encode: { x: 'g', y: 'l', color: 'tmp' },
              style: { opacity: 0 },
              tooltip: false,
            },
          ],
        },
      },
      province: '浙江省',
      city: '舟山市',
      type: '办公用品',
      sub_type: '笔',
    },
  ],
};
```

### 安装 G2

:::warning{title="该功能依赖 G2 的 5.x 版本，请确保使用了正确的版本 "}

```bash
yarn add @antv/g2 --save
```

使用 `G2` 提供的 `renderToMountedElement` 方法

```ts
import { renderToMountedElement } from '@antv/g2';
```

:::

### 在 `@antv/s2` 中使用

#### 1. 自定义 `DataCell`, 如果是图表数据，则不渲染默认的文本

```ts
import { PivotSheet, DataCell } from '@antv/s2';
import { renderToMountedElement, stdlib } from '@antv/g2';

class ChartSheetDataCell extends DataCell {
  public drawTextShape(options) {
    if (this.isMultiData()) {
      return null;
    }

    super.drawTextShape(options);
  }
}

const s2 = new PivotSheet(container, s2DataConfig, {
  dataCell: (viewMeta) => new ChartSheetDataCell(viewMeta, viewMeta.spreadsheet)
});

s2.render();

```

#### 2. 监听数值单元格渲染完成后，使用 `G2` 提供的 `renderToMountedElement` 将图表挂载在 `S2` 单元格实例上

:::warning{title="提示"}
由于 `G2` 按需加载的特性，请根据你渲染的图表，自行选择适合的 [`library`](https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib)
:::

```ts
s2.on(S2Event.DATA_CELL_RENDER, (cell) => {
  // 如果是普通数值单元格正常展示
  if (!cell.isChartData()) {
    return;
  }

  const chartOptions = cell.getRenderChartOptions();

  renderToMountedElement(chartOptions, {
    group: cell,
    // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
    library: stdlib(),
  });
});
```

### 在 `@antv/s2-react` 使用

如果希望在 `React` 中使用，除了上诉的方式外，也可以直接使用 `<SheetComponent sheetType="chart"/>`, 内部封装了 `自定义 DateCell` 的步骤

```tsx
import { SheetComponent } from '@antv/s2-react';
import { renderToMountedElement, stdlib } from '@antv/g2';

function App() {
  const onDataCellRender = (cell) => {
    // 如果是普通数值单元格正常展示
    if (!cell.isChartData()) {
      return;
    }

    const chartOptions = cell.getRenderChartOptions();

    renderToMountedElement(chartOptions, {
      group: cell,
      // 根据实际需要渲染的图表，选择 library：https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
      library: stdlib(),
    });
  };

  return (
    <SheetComponent dataCfg={s2DataConfig} sheetType="chart" onDataCellRender={onDataCellRender} />
  )
}
```

### 效果

[查看示例](/examples#custom-custom-g2-chart)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*y9mfQqk9XwYAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="600"/>
