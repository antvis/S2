---
title: 透视组合图
order: 13
tag: Experimental
---

:::warning{title='提示'}
阅读本章前，请确保已经对 S2 足够了解，并且熟悉 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎，[`AntV/G2`](https://g2.antv.antgroup.com/)的相关内容。
:::

透视组合图是一种数据可视化技术，它可以使用透视表结构进一步可视化的展示数据信息。

## 为什么需要透视组合图？

透视表的数据分析能力无疑是强大的，以 `@antv/s2` 为例，结合字段标记的能力，还可以完成兼具一定程度可视化效果的透视表展示：
<br/>
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*WfLOT4ovkVcAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
<br/>
但单纯从数据的可视化能力来说，和常规的图形还有差距，透视组合表可以说是既要又要的产物，基于透视表的笛卡尔结构，即拥有强大的维度拆分能力，又在具体的细分维度中具有图表的可视化表达能力，形如：
<br/>
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*0h10SLUsCQgAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
<br/>

## 与透视表的形态差异

透视表的数值区域会从单一的数据维度变成坐标轴；另一侧维度拆分只会到倒数第二层级，最后的维度区域同样会以坐标轴的形式展示，且列头的坐标轴始终在底部，符合常用图形的坐标轴使用情况。

<br/>
<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*DAldRoSCfGoAAAAAAAAAAAAADmJ7AQ/original" alt="preview" width="800"/>
<br/>

相比普通交叉表，透视组合图除了有行列角头之外，还需要配置坐标轴，分别是：

1. 竖轴（`axisRowHeader`）：用于绘制竖向坐标轴
2. 横轴（`axisColumnHeader`）：用于绘制横向坐标轴
3. 交叉（`axisCornerHeader`）：类似角头，用于绘制竖轴，横轴交叉区域

## 快速上手

### 安装 G2

:::warning{title="该功能依赖 G2 的 `5.x` 版本，请确保使用了正确的版本 "}

```bash
pnpm add @antv/g2
```

:::

### 使用 PivotChartSheet

透视组合图是`@antv/s2`等拓展功能，所有模块均从 `@antv/s2/extends` 中导入：

```ts
import { PivotChartSheet } from '@antv/s2/extends';


async function bootstrap() {
  const container = document.getElementById('container');

  // 常规的透视表数据即可：https://gw.alipayobjects.com/os/bmw-prod/cd9814d0-6dfa-42a6-8455-5a6bd0ff93ca.json
  const s2=new PivotChartSheet(container,dataCfg,s2Options);
  await s2.render(); // 返回 Promise
}

bootstrap();

```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart.ts" rid='pivot-chart' height='300'></playground>

### 切换坐标系

数据可视化中，最常用的坐标系有两种：笛卡尔坐标系和极坐标系，均为二维坐标系：

1. 笛卡尔坐标系即直角坐标系，是由相互垂直的两条轴线构成
2. 极坐标系由极点、极轴组成，坐标系内任何一个点都可以用极径和夹角（逆时针）表示

在透视组合图中，可以在 `s2Options` 中进行切换:

```ts
const s2Options={
  chart: {
    // 切换为极坐标
        coordinate: 'polar', 
        // 使用 扇形图 g2 spec
        dataCellSpec: {
          type: 'interval',
          transform: [{ type: 'stackY' }],
          coordinate: { type: 'theta', outerRadius: 0.8 },
        },
  },
}

```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart-polar.ts" rid='pivot-chart-polar' height='300'></playground>

在笛卡尔坐标系布局中，行列头会增加特殊的 `axisRowHeader`，`axisColumnHeader`用于绘制坐标系，而在极坐标系布局中，只存在一个坐标轴，行列头根据数据是否置于列头只会存在`axisRowHeader`或者`axisColumnHeader`之一，且展示简单维度信息（文字），和普通行列头别无二致，不会显示坐标系标尺。

[查看 api 文档](/api/pivot-chart)。

## 自定义

透视组合图只提供了外层的透视框架，具体绘制什么 G2 图形交由用户自己决定（默认绘制柱状图）。

### 自定义 spec

透视组合图透出 `dataCellSpec`，`axisRowCellSpec`, `axisColCellSpec`用于自定义各个区域的 g2 spec 配置：

```ts
const s2Options = {
  chart: {
    dataCellSpec: {},
    axisRowCellSpec: {},
    axisColCellSpec: {},
  },
};

```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart-spec.ts" rid='pivot-chart-spec' height='300'></playground>

### 自定义 cell

如果希望不仅仅是更改 spec, 透视组合图还透出 `AxisRowCell`，`AxisColCell`, `AxisCornerCell`，`PivotChartDataCell` 用于完全自定义各个区域的单元格：

```ts
import type { S2Options } from '@antv/s2';
import { AxisColCell, AxisRowCell, PivotChartDataCell } from '@antv/s2/extends';

class CustomDataCell extends PivotChartDataCell {}

class CustomRowCell extends AxisRowCell {}

class CustomColCell extends AxisColCell {}

const s2Options: S2Options = {
  dataCell: (viewMeta, spreadsheet) =>
    new CustomDataCell(viewMeta, spreadsheet),
  axisRowCell: (node, s2, headConfig) => {
    return new CustomRowCell(node, s2, headConfig);
  },
  axisColCell: (node, s2, headConfig) => {
    return new CustomColCell(node, s2, headConfig);
  },
};

```

 <Playground path="custom/custom-shape-and-chart/demo/pivot-chart-cell.ts" rid='pivot-chart-cell' height='300'></playground>

## 限制

透视组合图作为一种特殊的表格形态，目前无法兼容普通透视表的所有展示形态，有以下限制：

1. 只能使用平铺模式，不支持[树状模式](/examples/basic/pivot/#tree)
2. 不支持[自定义行列头](/examples/layout/custom-header-group/#custom-pivot-row-header)
3. 不支持[自定义指标维度层级顺序](/examples/custom/custom-layout/#custom-value-order)
