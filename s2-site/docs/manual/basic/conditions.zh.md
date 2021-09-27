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

![preview](https://gw.alipayobjects.com/zos/antfincdn/UagqR4rrA/8c408479-cc79-4c7f-964f-8afeccbe8dba.png)

## 快速上手

S2 字段标记特性通过配置 [Options 中 conditions 属性实现](/zh/docs/api/general/options#conditions)。

<details>
<summary>点击查看数据</summary>

```js
const data=[
  {
    "province": "浙江",
    "city": "杭州",
    "type": "笔",
    "price": "1"
  },
  {
    "province": "浙江",
    "city": "杭州",
    "type": "纸张",
    "price": "2"
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "笔",
    "price": "17"
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "纸张",
    "price": "6"
  },
  {
    "province": "吉林",
    "city": "丹东",
    "type": "笔",
    "price": "8"
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "笔",
    "price": "12"
  },
  {
    "province": "吉林",
    "city": "丹东",
    "type": " 纸张",
    "price": "3"
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "纸张",
    "price": "25"
  },

  {
    "province": "浙江",
    "city": "杭州",
    "type": "笔",
    "cost": "0.5"
  },
  {
    "province": "浙江",
    "city": "杭州",
    "type": "纸张",
    "cost": "20"
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "笔",
    "cost": "1.7"
  },
  {
    "province": "浙江",
    "city": "舟山",
    "type": "纸张",
    "cost": "0.12"
  },
  {
    "province": "吉林",
    "city": "丹东",
    "type": "笔",
    "cost": "10"
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "笔",
    "cost": "9"
  },
  {
    "province": "吉林",
    "city": "丹东",
    "type": " 纸张",
    "cost": "3"
  },
  {
    "province": "吉林",
    "city": "白山",
    "type": "纸张",
    "cost": "1"
  }
]
```

</details>

```js
import { PivotSheet } from '@antv/s2';

// s2 被挂载的 dom 节点
const container = document.getElementById("container");

// 构建 data config 
const s2DataConfig = {
  fields: {
    rows: ["province", "city"],
    columns: ["type"],
    values: ["price"],
  },
  data
};

// 构建 options
const s2options = {
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

// 创建实例
const s2 = new PivotSheet(container, s2DataConfig, s2options);

// 渲染图表到页面上
s2.render();
```

<playground path='conditions/basic/demo/text.ts' rid='container' height='400'></playground>

## 配置解释

[conditions 属性](/zh/docs/api/general/options#conditions) 可配置四种不同的字段，分别对应四种不同的字段标记。

* `text`，`background`和`interval`的均为 [Condition](/zh/docs/api/general/options#condition) 数组类型
  * 包含`field`和`mapping`两个字段
* `icon`稍有不同，为 [IconCondition](/zh/docs/api/general/options#iconcondition) 数组类型
  * 多一个`position`字段用于指定图标相对于文字的位置

重点解释`field`和`mapping`两个字段：

### field

`field`用于指定将字段标记应用于哪些字段上，其取值范围会因表的形态不同而不同：

* 对于交叉表，`field`取值范围是`values`
* 对于明细表，`field`取值范围是`columns`

 <table
        style="width: 100%; outline: none; border-collapse: collapse;"
      >
        <colgroup>
          <col width="5%"/>
          <col width="95%" />
        </colgroup>
        <tbody>
        <tr style="height: 33px;">
            <td style="text-align: center;">
            交叉表
            </td>
            <td>
               <playground path="conditions/basic/demo/text.ts" rid='pivot' height='300'></playground>
            </td>
          </tr>
         <tr>
            <td style="text-align: center;">
             明细表
            </td>
              <td >
               <playground path="conditions/basic/demo/table-text.ts" rid='table' height='300'></playground>
            </td>
          </tr>
        </tbody>
  </table>

### ​mapping

`mapping`是处理字段标记的回调函数：

| 参数    | 类型     | 字段描述     |
| :------- | :-------- | :------------ |
| fieldValue   | `number` &#124; `string`  &#124; `null`       | 单元格对应字段的值      |
| data | `object` | 单元格对应的​一条完整数据 |

| 返回值    | 类型    | 必选 | 字段描述     |
| :------- | :-------- | :---- | :----------- |
| fill   | `string`   | ✓  | 背景、文本、柱状图、图标的填充颜色      |
| icon | `string` | |仅用于**图标**字段标记，指定图标类型 |
| isCompare | `boolean` | |仅用于**柱状图**字段标记，当为`true`时，可以定制柱状图的最大最小值|
| minValue | `number` | |仅用于**柱状图**字段标记且`isCompare`为`true`时，定制柱状图最小值 |
| maxValue | `number` | |仅用于**柱状图**字段标记且`isCompare`为`true`时，定制柱状图最大值 |

> 如果`mapping`函数返回值为空，则表明不渲染该单元格的字段标记

🎨 字段标记详细的配置参考 [Conditions API](/zh/docs/api/general/options#conditions) 文档。

## 特性

### 自定义图标位置

通过设置`icon`字段标记中的`position`属性，可以设置图标位于文本的左侧还是右侧。

`price`字段的图标位于文本右侧，`cost`字段的图标位于文本左侧：
<playground path="conditions/basic/demo/icon.ts" rid='icon'></playground>

​

### 自定义柱状图范围

通过显示指定`interval`字段标记中的`mapping`返回值 `isCompare`属性值为`true`，并指定`maxValue`和`minValue`的值，可以自定义柱状图的区间范围。
> 如果`mapping`返回值中的 `isCompare`属性值为`false` 或者不返回该属性。此时`maxValue`和`minValue`会以所有图标数据中该字段 (`field`) 的最大最小值为区间范围

`price`字段使用自定义模式，`cost`字段使用默认模式：
<playground path="conditions/basic/demo/interval.ts" rid='interval'></playground>

### 渐变柱状图

S2 的底层图形绘制采用渲染引擎[G](https://g.antv.vision/zh/docs/guide/introduce)，借助其强大的绘制能力，`fill`字段不仅仅可以是颜色属性，也可以使用[渐变色]((https://g.antv.vision/zh/docs/api/shape/attrs#%E6%B8%90%E5%8F%98%E8%89%B2))，[纹理](https://g.antv.vision/zh/docs/api/shape/attrs#%E7%BA%B9%E7%90%86)。

`price`字段使用渐变色：
<playground path="conditions/advanced/demo/gradient-interval.ts" rid='gradient'></playground>

​📊 查看更多[字段标记示例](/zh/examples/conditions/basic#text)。
