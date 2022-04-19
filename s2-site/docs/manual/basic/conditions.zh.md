---
title: 字段标记
order: 4
---

S2 自带字段标记特性。用户可以根据业务语义设置不同的渲染逻辑，实现重点数据的标记和分析。字段标记类型包括：

* 文本 (text) 字段标记
* 背景 (background) 字段标记
* 柱状图 (interval) 字段标记
* 图标 (icon) 字段标记

下图直观展示了四种字段标记的形态：

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*-lr0QJRCxkEAAAAAAAAAAAAAARQnAQ" width="600" alt="preview" />

## 快速上手

`S2` 字段标记特性通过配置 `s2Options` 中 [`Conditions`](/zh/docs/api/general/S2Options#conditions) 属性。

```js
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

<playground path='analysis/conditions/demo/text.ts' rid='container' height='300'></playground>

## 配置解释

[Conditions 属性](/zh/docs/api/general/S2Options#conditions) 可配置四种不同的字段，分别对应四种不同的字段标记。

* `text`，`background` 和 `interval` 的均为 [Condition](/zh/docs/api/general/S2Options#condition) 数组类型
  * 包含 `field` 和 `mapping` 两个字段
  * 一个字段 ID 多次匹配到同一范围的字段标记规则，以最后一个规则为准。
* `icon` 稍有不同，为 [IconCondition](/zh/docs/api/general/S2Options#iconcondition) 数组类型
  * 多一个 `position` 字段用于指定图标相对于文字的位置

重点解释 `field` 和 `mapping` 两个字段：

### field

`field` 用于指定将字段标记应用于哪些字段上，其取值范围会因表的形态不同而不同：

* 对于透视表，`field` 取值范围或正则匹配范围是 `values`
* 对于明细表，`field` 取值范围或正则匹配范围是 `columns`

<table
  style="width: 100%; outline: none; border-collapse: collapse;"
>
  <tbody>
  <tr style="height: 33px;" >
      <td style="text-align: center;width:74px;">
      透视表
      </td>
      <td>
          <playground path="analysis/conditions/demo/text.ts" rid='pivot' height='300'></playground>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;width:74px;">
        明细表
      </td>
        <td >
          <playground path="analysis/conditions/demo/table-text.ts" rid='table' height='300'></playground>
      </td>
    </tr>
  </tbody>
</table>

### ​mapping

`mapping` 是处理字段标记的回调函数：

| 参数            | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| fieldValue | 单元格对应字段的值           | `number` &#124; `string`  &#124; `null`        | -      |      |
| data     | 单元格对应的​一条完整数据    | `object`               | -      |   ✓   |

| 返回值           | 说明                 | 类型                   | 默认值 | 必选 |
| --------------- | ------------------ | ---------------------- | ------ | ---- |
| fill           | 当作用于文本字段标记时，代表**文字填充颜色** <br>当作用于背景字段标记时，代表**单元格背景填充颜色** <br>当作用于柱状图字段标记时，代表**柱状图填充颜色** <br>当作用于图标字段标记时，代表**图标填充颜色** <br> | `string`    | -      |   ✓   |
| icon     | 仅用于**图标**字段标记，指定图标类型    | `string`              | -      |      |
| isCompare |仅用于**柱状图**字段标记，当为 `true` 时，可以定制柱状图的最大最小值 |`boolean`| -      |      |
| minValue | 仅用于**柱状图**字段标记且 `isCompare` 为 `true` 时，定制柱状图最小值  |`number` | -      |      |
| maxValue |  仅用于**柱状图**字段标记且 `isCompare` 为 `true` 时，定制柱状图最大值 |`number` | -      |      |

> 如果`mapping`函数返回值为空，则表明不渲染该单元格的字段标记

🎨 字段标记详细的配置参考 [Conditions API](/zh/docs/api/general/S2Options#conditions) 文档。

## 特性

### 自定义图标位置

通过设置 `icon` 字段标记中的 `position` 属性，可以设置图标位于文本的左侧还是右侧。

`price` 字段的图标位于文本右侧，`cost` 字段的图标位于文本左侧：

<playground path="analysis/conditions/demo/icon.ts" rid='icon' height="200"></playground>

​

### 自定义柱状图范围

通过显示指定 `interval` 字段标记中的 `mapping 函数` 返回值  `isCompare` 属性值为 `true`，并指定 `maxValue` 和 `minValue` 的值，可以自定义柱状图的区间范围。
> 如果 `mapping 函数` 返回值中的 `isCompare` 属性值为 `false` 或者不返回该属性。此时 `maxValue` 和 `minValue` 会以所有图表数据中该字段的最大最小值为区间范围

`price` 字段使用自定义模式，`cost` 字段使用默认模式：

<playground path="analysis/conditions/demo/interval.ts" rid='interval'></playground>

### 渐变柱状图

`S2` 的底层图形绘制采用 [AntV/g](https://g.antv.vision/zh/docs/guide/introduce) 渲染引擎 ，借助其强大的绘制能力，`fill` 字段不仅仅是颜色属性，还可以使用 [渐变色](https://g.antv.vision/zh/docs/api/shape/attrs#%E6%B8%90%E5%8F%98%E8%89%B2)、[纹理](https://g.antv.vision/zh/docs/api/shape/attrs#%E7%BA%B9%E7%90%86)等。

`price` 字段使用渐变色：
<playground path="analysis/conditions/demo/gradient-interval.ts" rid='gradient'></playground>

​📊 查看更多 [字段标记示例](/zh/examples/analysis/conditions#text)。
