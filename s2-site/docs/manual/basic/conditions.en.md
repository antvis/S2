---
title: Conditions
order: 4
tag: Updated
---

S2 comes with field tagging feature. Users can set different rendering logics based on business semantics to mark and analyze key data. Field tag types include:

* Text field flag (all cell types)
* background field marker (all cell types)
* Histogram (interval) field markers (only data cells are supported)
* Icon (icon) field markers (currently supports pivot table data cells, row and column header cells)

The figure below visually shows the form of the four field tags:

<img src="https://gw.alipayobjects.com/mdn/rms_56cbb2/afts/img/A*-lr0QJRCxkEAAAAAAAAAAAAAARQnAQ" width="600" alt="preview">

## Get started quickly

The `S2` field marking feature is configured by configuring the [`Conditions`](/docs/api/general/S2Options#conditions) attribute in `s2Options` .

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

## configuration explanation

The [Conditions attribute](/docs/api/general/S2Options#conditions) can configure four different fields, corresponding to four different field tags.

* `text` , `background` and `interval` are all of [Condition](/docs/api/general/S2Options#condition) array type

  * Contains `field` and `mapping` two fields
  * If a field ID matches multiple field marking rules in the same scope, the last rule shall prevail.

* `icon` is slightly different, it is [IconCondition](/docs/api/general/S2Options#iconcondition) array type

  * One more `position` field is used to specify the position of the icon relative to the text

Focus on explaining the two fields of `field` and `mapping` :

### field

`field` is used to specify which fields to apply the field mark to, and its value range will vary depending on the form of the table:

* For pivot tables, the `field` value range or regular matching range is `values` ​​, and the scope of action is the row header, column header, corner header and data cells
* For the detailed table, the `field` value range or regular matching range is `columns` , and the range of action is the data cell

<table
  style="width: 100%; outline: none; border-collapse: collapse;"
>
  <tbody>
  <tr style="height: 33px;" >
      <td style="text-align: center;width:74px;">
      pivot mode
      </td>
      <td>
          <Playground path="analysis/conditions/demo/text.ts" rid='pivot' height='300'></Playground>
      </td>
    </tr>
    <tr>
      <td style="text-align: center;width:74px;">
        table mode
      </td>
        <td >
          <Playground path="analysis/conditions/demo/table-text.ts" rid='table' height='300'></Playground>
      </td>
    </tr>
  </tbody>
</table>

### ​mapping

`mapping` is a callback function that handles field marking:

| parameter  | illustrate                                       | type                           | Defaults | required |
| ---------- | ------------------------------------------------ | ------------------------------ | -------- | -------- |
| fieldValue | The value of the corresponding field of the cell | `number` \| `string` \| `null` | -        |          |
| data       | The entire row of data corresponding to the cell | `object`                       | -        | ✓        |

| return value | illustrate                                                                                                                                                                                                                                                                                                                                                                                                                        | type      | Defaults | required |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | -------- |
| fill         | When used as a text field tag, it represents the **text fill color** \<br data-mdast="html">When it is used as a background field tag, it represents **the cell background fill color** \<br data-mdast="html">It is used as a column When the graph field is marked, it represents the **fill color of the histogram** \<br data-mdast="html">When it is used for the icon field mark, it represents the **icon fill color**<br> | `string`  | -        | ✓        |
| icon         | For **icon** field tags only, specifies the icon type                                                                                                                                                                                                                                                                                                                                                                             | `string`  | -        |          |
| isCompare    | Only used for **histogram** field marking, when `true` , you can customize the maximum and minimum values ​​of the histogram                                                                                                                                                                                                                                                                                                      | `boolean` | -        |          |
| minValue     | It is only used when the **histogram** field is marked and `isCompare` is `true` , and the minimum value of the histogram can be customized                                                                                                                                                                                                                                                                                       | `number`  | -        |          |
| maxValue     | Only used when the **histogram** field is marked and `isCompare` is `true` , customize the maximum value of the histogram                                                                                                                                                                                                                                                                                                         | `number`  | -        |          |
| fieldValue   | Only used when the **histogram** field is marked and `isCompare` is `true` , customize the length of the histogram                                                                                                                                                                                                                                                                                                                | `number`  | -        |          |

> If the return value of the `mapping` function is empty, it means that the field mark of the cell is not rendered

<embed src="@/docs/common/icon.en.md"></embed>​

🎨 field mark detailed configuration refer to [Conditions API](/docs/api/general/S2Options#conditions) documentation.

## characteristic

### custom icon position

By setting the `position` attribute in the `icon` field tag, you can set whether the icon is on the left or right of the text. (Currently, header cells do not support switching)

The icon for the `price` field is to the right of the text, and the icon for the `cost` field is to the left of the text:

<Playground path="analysis/conditions/demo/icon.ts" rid="icon" height="200"></Playground>

### Custom histogram range

You can customize the interval range of the histogram by displaying the return value of the `mapping` attribute in the specified `interval` field tag and setting the value of the `isCompare` attribute to `true` , and specifying the values ​​of `maxValue` and `minValue` .

> If the value of the `isCompare` attribute in the return value of the `mapping 函数`is `false` or the attribute is not returned. At this time `maxValue` and `minValue` will use the maximum and minimum values ​​of the field in all chart data as interval ranges

The `price` field uses a custom schema, and the `cost` field uses the default schema:

<Playground path="analysis/conditions/demo/interval.ts" rid="interval"></Playground>

### Two-way histogram

When the interval of the histogram has positive and negative points, and with the `fill` attribute of the return value of the `mapping` function, a positive and negative two-way histogram with different colors can be drawn:

<Playground path="analysis/conditions/demo/bidirectional-interval.ts" rid="bidirectional"></Playground>

​📊 See more [field markup examples](/examples/analysis/conditions#bidirectional-interval) .

### Gradient histogram

The underlying graphic drawing of `S2` uses the [AntV/g](https://g.antv.vision/zh/docs/guide/introduce) rendering engine. With its powerful drawing capabilities, the `fill` field is not only a color attribute, but also [gradient colors](https://g.antv.vision/zh/docs/api/shape/attrs#%E6%B8%90%E5%8F%98%E8%89%B2) , [textures](https://g.antv.vision/zh/docs/api/shape/attrs#%E7%BA%B9%E7%90%86) , etc. can be used.

The `price` field uses a gradient color:<Playground path="analysis/conditions/demo/gradient-interval.ts" rid="gradient"></Playground>

​📊 See more [field markup examples](/examples/analysis/conditions#gradient-interval) .

### Turn on text intelligent inversion

By displaying the return value of the `mapping` function in the specified `background` field tag the `intelligentReverseTextColor` attribute value is `true` . When the marker background color is darker, the text color will change to white. When the marker background color is bright, the text color defaults to black. Priority: `intelligentReverseTextColor` of `background condition` < `fill` of `text condition`

<Playground path="analysis/conditions/demo/intelligent-background.ts" rid="intelligentReverseTextColor"></Playground>

​📊 See more [field markup examples](/examples/analysis/conditions#intelligent-background) .
