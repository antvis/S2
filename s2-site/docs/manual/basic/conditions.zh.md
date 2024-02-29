---
title: 字段标记
order: 4
tag: Updated
---

在数据可视化和分析中，字段标记是一种常用的功能，它允许用户通过可视化的方式强调数据中的关键信息。S2 是一个数据可视化库，支持灵活的字段标记功能：

* 文本 (text) 字段标记
* 背景 (background) 字段标记
* 柱状图 (interval) 字段标记
* 图标 (icon) 字段标记

下图直观展示了四种字段标记的形态：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*-lr0QJRCxkEAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

**数据单元格完整的支持 4 种字段标记，而角头、行头、列头这些头部单元格只支持文本、背景和图标三种字段标记（柱状图不适用于头部单元格，业务上价值不大）。**

## 快速上手

`S2` 字段标记特性通过配置 `s2Options` 中 [`Conditions`](/docs/api/general/S2Options#conditions) 属性。

```ts
// 构建 options
const s2Options = {
  width: 600,
  height: 600,
  // 通过配置 conditions 实现字段标记
  conditions: {
    text: [
      {
        field: "price",
        mapping(fieldValue, data) {
          return {
            // fill 是文本字段标记下唯一必须的字段，用于指定文本颜色
            fill: "#5B8FF9",
          };
        },
      },
    ],
  },
};
```

## 配置解释

[Conditions 属性](/docs/api/general/S2Options#conditions) 可配置四种不同的字段，分别对应四种不同的字段标记。

* `text`，`background` 和 `interval` ,`icon` 均是继承自[Condition](/docs/api/general/S2Options#condition) 数组类型
  * 包含 `field` 和 `mapping` 两个字段
  * 一个字段 ID 多次匹配到同一范围的字段标记规则，以最后一个规则为准
* `icon` 稍有不同，为 [IconCondition](/docs/api/general/S2Options#iconcondition) 数组类型
  * 多一个额外的`position` 字段用于指定图标相对于文字的位置，定义图标相对于单元格文本的位置。这个位置可以是文本的左侧、右侧

### field

`field` 用于指定将字段标记应用于哪些字段上，其取值范围会因表的形态不同而不同：

* 对于透视表，`field` 取值范围或正则匹配范围是 `rows`，`columns`，`values`，作用范围为行头、列头、角头和数据单元格
* 对于明细表，`field` 取值范围或正则匹配范围是 `columns`，作用范围为数据单元格

<table
  style="width: 100%; outline: none; border-collapse: collapse;"
>
  <tbody>
  <tr style="height: 33px;" >
      <td style="text-align: center;width:74px;">
      透视表
      </td>
      <td>
          <Playground path="analysis/conditions/demo/text.ts" rid='pivot' height='300'></playground>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;width:74px;">
        明细表
      </td>
        <td >
          <Playground path="analysis/conditions/demo/table-text.ts" rid='table' height='300'></playground>
      </td>
    </tr>
  </tbody>
</table>

### ​mapping

其中的重点是`mapping`函数，它用于处理字段标记的回调函数，如果`mapping`函数返回值为空，则表明不渲染该单元格的字段标记。

```ts
export type ConditionMapping<T = unknown> = (
  fieldValue: number | string,
  data: RawData,
  cell?: DataCell | HeaderCell,
) => ConditionMappingResult<T>;
```

`mapping`接收三个参数，分别是:

* fieldValue: 当前单元格的值
* data: 如果是数据单元格，则是格子对应的数据；如果是角头、行头、列头，则是格子的 meta 信息
* cell: 对应当前格子的实例，如果前两个参数不满足业务需求，可以通过这个参数获取任意你想要的数据

不同的字段标记类型所需的返回值类型`ConditionMappingResult<T>`有所不同，主要是泛型`T`不同。S2 提供了完备的类型提示：

![类型提示](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*wgC1QoXRWkAAAAAAAAAAAAAADmJ7AQ/original)

> 也可以通过 [condition.ts](https://github.com/antvis/S2/blob/next/packages/s2-core/src/common/interface/condition.ts) 查看具体的类型定义。

🎨 字段标记详细的配置参考 [Conditions API](/docs/api/general/S2Options#conditions) 文档。

## 特性

### 自定义图标位置

通过设置 `icon` 字段标记中的 `position` 属性，可以设置图标位于文本的左侧还是右侧。（目前表头单元格暂不支持切换）

`price` 字段的图标位于文本右侧，`cost` 字段的图标位于文本左侧：

<Playground path="analysis/conditions/demo/icon.ts" rid='icon' height="200"></playground>

当同时存在自定义 Icon 时，Condition Icon 单元格 value 是强关联的，所以将 condition icon 放在紧贴文本的左右侧，即：

* `[header action icons] [condition icon] [text]`
* `[text] [condition icon] [header action icons]`

<Playground path="analysis/conditions/demo/icon-with-action.ts" rid='icon-with-action' height="200"></playground>

> 自定义 Icon 详情，可查看 [自定义 Icon](/docs/manual/advanced/custom/custom-icon) 章节

### 自定义柱状图范围

通过显示指定 `interval` 字段标记中的 `mapping` 函数返回值  `isCompare` 属性值为 `true`，并指定 `maxValue` 和 `minValue` 的值，可以自定义柱状图的区间范围。
> 如果 `mapping 函数` 返回值中的 `isCompare` 属性值为 `false` 或者不返回该属性。此时 `maxValue` 和 `minValue` 会以所有图表数据中该字段的最大最小值为区间范围

字段标记默认都是使用当前单元格的 value 作为绘制的依据，但在柱状图中，因为可以自定义柱状图的范围，那么也可能需要根据范围，同时对当前的 value 进行处理，使用新的 value 作为绘制的依据，此时可以通过`mapping` 函数返回值中指定`fieldValue`重新指定当前格子的绘制依据。

`price` 字段使用自定义模式，`cost` 字段使用默认模式：

<Playground path="analysis/conditions/demo/interval.ts" rid='interval'></playground>

### 双向柱状图

当柱状图的区间有正负之分时，并搭配 `mapping` 函数返回值的 `fill` 属性，即可绘制出带有不同颜色的正负双向柱状图：

<Playground path="analysis/conditions/demo/bidirectional-interval.ts" rid='bidirectional'></playground>

​📊 查看更多 [字段标记示例](/examples/analysis/conditions#bidirectional-interval)。

### 渐变柱状图

`S2` 的底层图形绘制采用 [AntV/g](https://g.antv.antgroup.com/guide/getting-started) 渲染引擎 ，借助其强大的绘制能力，`fill` 字段不仅仅是颜色属性，还可以使用 [渐变色](https://g.antv.antgroup.com/api/css/gradient)、[纹理](https://g.antv.antgroup.com/api/css/pattern) 等。

`price` 字段使用渐变色：
<Playground path="analysis/conditions/demo/gradient-interval.ts" rid='gradient'></playground>

​📊 查看更多 [字段标记示例](/examples/analysis/conditions#gradient-interval)。

### 开启文字智能反色

通过显示指定 `background` 字段标记中的 `mapping` 函数返回值  `intelligentReverseTextColor` 属性值为 `true`。
当标记背景颜色较暗时，文本颜色将变为白色。当标记背景颜色明亮时，文本颜色默认为黑色。
优先级： `background condition` 的 `intelligentReverseTextColor` < `text condition` 的 `fill`

<Playground path="analysis/conditions/demo/intelligent-background.ts" rid='intelligentReverseTextColor'></playground>

### 区分角头、行头、列头

在透视表模式中，如果字段标记对应的`field`是行头或者列头的维度，那么会同时将对应的角头单元格也进行标记，可以通过`mapping` 函数三个参数做区分：

<Playground path="analysis/conditions/demo/distinguish-cell.ts" rid='distinguish-cell'></playground>

​📊 查看更多 [字段标记示例](/examples/analysis/conditions#intelligent-background)。
