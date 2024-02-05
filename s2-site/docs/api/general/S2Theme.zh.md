---
title: S2Theme
order: 2
tag: Updated
---

主题配置

```ts
// 统一设置主题 Schema, 色板，名称
s2.setThemeCfg({
  theme: {},
  palette: {},
  name: "default"
});

// 单独设置主题 Schema, 配置单元格背景，文字大小，文字颜色
s2.setTheme({
  rowCell: {
    cell: {
      backgroundColor: "#fff"
    }
  }
});
```

## ThemeCfg

功能描述：表格主题配置项。查看 [文档](/manual/basic/theme) 和 [示例](/examples/theme/default/#colorful)

| 参数    | 参数        | 类型                              | 默认值    | 必选 |
| ------- | ----------- | --------------------------------- | --------- | ---- |
| theme   | 主题 schema | [S2Theme](#s2theme)               | -         |      |
| palette | 色板        | [Palette](#palette)               | -         |      |
| name    | 主题名      | `default` \| `colorful` \| `gray` | `default` |      |

### Palette

功能描述：表主题色板。查看 [文档](/manual/basic/theme) 和 [示例](/examples/theme/custom/#custom-palette)

| 参数                | 参数                                                | 类型                                                             | 默认值 | 必选 |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------------------- | ------ | ---- |
| brandColor          | 色板主题色                                          | `string`                                                         | -      | ✓    |
| basicColors         | 基础颜色                                            | `string[]`                                                       | -      | ✓    |
| basicColorRelations | basicColors 与标准色板数组下标的对应关系            | `Array<{ basicColorIndex: number; standardColorIndex: number}>` | -      | ✓    |
| semanticColors      | 用于表示实际业务语义的颜色。例如内置颜色 “红跌绿涨” | `[key: string]`                                                  | -      | ✓    |
| others              | 用于表示实际业务语义的颜色。例如内置颜色 “红跌绿涨” | `[key: string]`                                                  | -      |      |

### S2Theme

功能描述：表格主题 `Schema`. 查看 [文档](/manual/basic/theme#%E4%B8%BB%E9%A2%98-schema) 和 [示例](/examples/theme/custom/#custom-palette)

| 参数              | 参数                                   | 类型                                            | 默认值 | 必选 |
| ----------------- | -------------------------------------- | ----------------------------------------------- | ------ | ---- |
| cornerCell        | 角头单元格主题                         | [DefaultCellTheme](#defaultcelltheme)           |        |      |
| rowCell           | 行头单元格主题                         | [DefaultCellTheme](#defaultcelltheme)           |        |      |
| colCell           | 列头单元格主题                         | [DefaultCellTheme](#defaultcelltheme)           |        |      |
| dataCell          | 数值单元格主题                         | [DefaultCellTheme](#defaultcelltheme)           |        |      |
| resizeArea        | 列宽行高调整热区                       | [ResizeArea](#resizearea)                       |        |      |
| scrollBar         | 滚动条样式                             | [ScrollBarTheme](#scrollbartheme)               |        |      |
| splitLine         | 单元格分割线样式                       | [SplitLine](#splitline)                         |        |      |
| prepareSelectMask | 刷选遮罩样式                           | [InteractionStateTheme](#interactionstatetheme) |        |      |
| background        | 背景样式                               | [Background](#background)                       |        |      |
| [key: string]     | 额外属性字段，用于用户自定义主题时传参 | `unknown`                                       |        |      |

#### DefaultCellTheme

功能描述：默认单元格主题。查看 [文档](/manual/basic/theme#%E4%B8%BB%E9%A2%98-schema) 和 [示例](/examples/theme/custom/#custom-palette)

| 参数              | 说明           | 类型                              | 默认值 | 必选 |
| ----------------- | -------------- | --------------------------------- | ------ | ---- |
| bolderText        | 加粗文本样式   | [TextTheme](#texttheme)           | -      |      |
| text              | 文本样式       | [TextTheme](#texttheme)           | -      |      |
| seriesText        | 序号文本样式   | [TextTheme](#texttheme)           | -      |      |
| measureText       | 度量值文本样式 | [TextTheme](#texttheme)           | -      |      |
| cell              | 单元格样式     | [CellTheme](#celltheme)           | -      |      |
| icon              | 图标样式       | [IconTheme](#icontheme)           | -      |      |
| seriesNumberWidth | 序号列宽       | `number`                          | 80     |      |
| miniChart         | mini 图        | [MiniChartTheme](#minicharttheme) |        |      |

#### ResizeArea

功能描述：列宽行高拖拽热区样式。查看 [文档](/manual/basic/theme#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%89%B2%E6%9D%BF) 和 [示例](/examples/interaction/basic/#state-theme)

| 参数              | 说明                                                                                                         | 类型                                  | 默认值   | 必选 |
| ----------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------- | -------- | ---- |
| size              | 热区大小                                                                                                     | `number`                              | 3        |      |
| background        | 热区背景色                                                                                                   | `string`                              | -        |      |
| backgroundOpacity | 热区背景色透明度                                                                                             | `number`                              | -        |      |
| guideLineColor    | 参考线颜色                                                                                                   | `string`                              | -        |      |
| guideLineDash     | 热区参考线 [虚线模式](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash) | `number[]`                            | `[3, 3]` |      |
| interactionState  | 热区交互态样式                                                                                               | [InteractionState](#interactionstate) | -        |      |

#### ScrollBarTheme

功能描述：滚动条样式。查看 [文档](/manual/basic/theme#%E8%87%AA%E5%AE%9A%E4%B9%89-schema) 和 [示例](/examples/theme/custom#custom-scrollbar)

| 参数            | 说明                       | 类型                          | 默认值               | 必选 |
| --------------- | -------------------------- | ----------------------------- | -------------------- | ---- |
| trackColor      | 滚动条轨道颜色             | `string`                      | `rgba(0,0,0,0)`      |      |
| thumbHoverColor | 滚动条 Hover 态颜色        | `string`                      | `rgba(0,0,0,0.4)`    |      |
| thumbColor      | 滚动条颜色                 | `string`                      | `rgba(0,0,0,0.15)`   |      |
| thumbHorizontalMinSize      | 滚动条水平最小尺寸 （在大数量情况下，滚动条会很小，可配置水平滚动条最小尺寸）                | `string`                      | `32`   |      |
| thumbVerticalMinSize      | 滚动条垂直最小尺寸 （在大数量情况下，滚动条会很小，可配置垂直滚动条最小尺寸）                 | `string`                      | `32`   |      |
| size            | 滚动条尺寸                 | `number`                      | Mobile: `3` <br> PC: `6` |      |
| hoverSize       | 滚动条 Hover 时的尺寸        | `number`                      | `16`                   |      |
| lineCap         | 指定如何绘制每一条线段末端 | `butt` \| `round` \| `square` | `round`              |      |

#### SplitLine

功能描述：分割线样式

| 参数                         | 说明                                                      | 类型                                   | 默认值                                                   | 必选 |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------- | ---- |
| horizontalBorderColor        | 水平分割线颜色                                            | `string`                               | -                                                        |      |
| horizontalBorderColorOpacity | 水平分割线颜色透明度                                      | `number`                               | 0.2                                                      |      |
| horizontalBorderWidth        | 水平分割线宽度                                            | `number`                               | 2                                                        |      |
| verticalBorderColor          | 垂直分割线颜色                                            | `string`                               | -                                                        |      |
| verticalBorderColorOpacity   | 垂直分割线颜色透明度                                      | `number`                               | 0.25                                                     |      |
| verticalBorderWidth          | 垂直分割线宽度                                            | `number`                               | 2                                                        |      |
| showShadow                   | 分割线是否显示外阴影（行列冻结情况下）                    | `boolean`                              | `true`                                                   |      |
| shadowWidth                  | 阴影宽度                                                  | `number`                               | 10                                                       |      |
| shadowColors                 | `left` : 线性变化左侧颜色 <br> `right` : 线性变化右侧颜色 | `{left: string,` <br> `right: string}` | `{left: 'rgba(0,0,0,0.1)',`<br>`right: 'rgba(0,0,0,0)'}` |      |
| borderDash                 | 分割线虚线 | `number \| string \| (string \| number)[]` | `[]` |      |

#### TextTheme

功能描述：文本主题

| 参数         | 说明                                                                           | 类型                          | 默认值                                                                                            | 必选 |
| ------------ | ------------------------------------------------------------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------- | ---- |
| textAlign    | 文本内容的对齐方式                                                             | `left \| center \| right` | -                                                                                                 |      |
| textBaseline | 绘制文本时的基线                                                               | `top \| middle \| bottom` | -                                                                                                 |      |
| fontFamily   | 字体，**如需每个字体宽度一样，请使用等宽字体**                                                                           | `string`                      | `Roboto, PingFangSC,` <br> `BlinkMacSystemFont,` <br> `Microsoft YaHei,` <br> `Arial, sans-serif` |      |
| fontSize     | 字体大小                                                                       | `number`                      | -                                                                                                 |      |
| fontWeight   | `number` <br/> `string` （可选项：`normal` <br> `bold` <br> `bolder` <br> `lighter`) | `number \| string`          | 粗体文本：Mobile：`520` PC: `bold` <br> 普通文本：`normal`                                        |      |
| fontStyle   | 字体样式    | `normal \| italic \| oblique`        |  `normal` |
| fontVariant | 字体变体  | `normal \| small-caps \| string`    |  `normal`  |
| fill         | 字体颜色                                                                       | `string`                      | -                                                                                                 |      |
| linkTextFill | 链接文本颜色                                                                   | `string`                      | -                                                                                                 |      |
| opacity      | 字体透明度                                                                     | `number`                      | 1                                                                                                 |      |

#### CellTheme

功能描述：单元格通用主题

| 参数                         | 说明                                    | 类型                                            | 默认值 | 必选 |
| ---------------------------- | --------------------------------------- | ----------------------------------------------- | ------ | ---- |
| crossBackgroundColor         | 奇数行单元格背景色                      | `string`                                        | -      |      |
| backgroundColor              | 单元格背景色 （默认斑马纹效果，如果想禁用，可将 `crossBackgroundColor` 和 `backgroundColor` 设置为同一颜色）                           | `string`                                        | -      |      |
| backgroundColorOpacity       | 单元格背景色透明度                      | `number`                                        | 1      |      |
| horizontalBorderColor        | 单元格水平边线颜色                      | `string`                                        | -      |      |
| horizontalBorderColorOpacity | 单元格水平边线颜色透明度                | `number`                                        | 1      |      |
| horizontalBorderWidth        | 单元格水平边线宽度                      | `number`                                        | -      |      |
| verticalBorderColor          | 单元格垂直边线颜色                      | `string`                                        | -      |      |
| verticalBorderColorOpacity   | 单元格垂直边线颜色透明度                | `number`                                        | 1      |      |
| verticalBorderWidth          | 单元格垂直边线宽度                      | `number`                                        | -      |      |
| padding                      | 单元格内边距                            | [Padding](#margin--padding)                     | -      |      |
| interactionState             | 单元格交互态                            | [InteractionStateTheme](#interactionstatetheme) | -      |      |
| interactionState             | 单元格交互态  ([查看默认配置](https://github.com/antvis/S2/blob/next/packages/s2-core/src/theme/index.ts#L66-L107)) ([示例](/examples/interaction/basic#state-theme))                       |  Record<[InteractionStateName](#interactionstatename), [InteractionStateTheme](#interactionstatetheme)> | -      |      |
| borderDash        | 单元格边线虚线 | `number \| string \| (string \| number)[]`                                        | `[]`      |      |

#### IconTheme

功能描述：icon 通用主题

| 参数          | 说明             | 类型                       | 默认值    | 必选 |
| ------------- | ---------------- | -------------------------- | --------- | ---- |
| fill          | icon 填充色      | `string`                   | -         |      |
| size          | icon 大小        | `number`                   | -         |      |
| margin        | 单元格外边距     | [Margin](#margin--padding) | -         |      |

#### InteractionStateName

功能描述：交互通用主题。查看 [文档](/manual/basic/theme#%E8%87%AA%E5%AE%9A%E4%B9%89%E8%89%B2%E6%9D%BF) 和 [示例](/examples/interaction/basic/#state-theme)

```ts
s2.setTheme({
  dataCell: {
    cell: {
      interactionState: {
        hoverFocus: {},
        selected: {},
        prepareSelect: {}
      }
    }
  }
})
```

| 状态名              | 说明       | 类型     | 默认值 | 必选 |
| ----------------- | ---------- | -------- | ------ | ---- |
| hover   | 悬停 | [InteractionStateTheme](#interactionstatetheme) |        |      |
| hoverFocus | 悬停聚焦 | [InteractionStateTheme](#interactionstatetheme) |        |      |
| selected       | 选中 | [InteractionStateTheme](#interactionstatetheme)|        |      |
| unselected       | 未选中   | [InteractionStateTheme](#interactionstatetheme) |        |      |
| searchResult     | 搜索结果 | [InteractionStateTheme](#interactionstatetheme) |        |      |
| highlight       | 高亮 | [InteractionStateTheme](#interactionstatetheme) |        |      |
| prepareSelect           | 预选中 | [InteractionStateTheme](#interactionstatetheme) |        |      |

#### Margin ｜ Padding

功能描述：icon 外边距，单元格内边距。

| 参数   | 说明 | 类型     | 默认值 | 必选 |
| ------ | ---- | -------- | ------ | ---- |
| top    | 上   | `number` |        |      |
| right  | 右   | `number` |        |      |
| bottom | 下   | `number` |        |      |
| left   | 左   | `number` |        |      |

#### Background

功能描述：背景配置。查看 [文档](/manual/basic/theme#%E8%87%AA%E5%AE%9A%E4%B9%89-schema) 和 [示例](/examples/theme/custom/#custom-schema)

| 参数    | 说明   | 类型     | 默认值 | 必选 |
| ------- | ------ | -------- | ------ | ---- |
| color   | 颜色   | `string` | -      |      |
| opacity | 透明度 | `number` | 1      |      |

#### MiniChartTheme

功能描述：迷你图配置。查看 [文档](/manual/advanced/chart-in-cell) 和 [示例](examples/custom/custom-cell/#mini-chart)

| 参数     | 说明           | 类型                            | 默认值 | 必选 |
| -------- | -------------- | ------------------------------- | ------ | ---- |
| line     | 折线图样式配置 | [LineTheme](#linetheme)         |        |      |
| bar      | 柱状图样式配置 | [BarTheme](#bartheme)           |        |      |
| bullet   | 颜色           | [BulletTheme](#bullettheme)     |        |      |
| interval | 透明度         | [IntervalTheme](#intervaltheme) |        |      |

##### LineTheme

功能描述：mini 折线图样式配置

| 参数     | 说明           | 类型                                              | 默认值 | 必选 |
| -------- | -------------- | ------------------------------------------------- | ------ | ---- |
| point    | 折线图的点配置 | `{size: number; fill?: number; opacity?: number}` |        |      |
| linkLine | 折线图的线配置 | `{size: number; fill: number; opacity: number}`   |        |      |

##### BarTheme

功能描述：mini 柱状图样式配置

| 参数            | 说明                 | 类型     | 默认值 | 必选 |
| --------------- | -------------------- | -------- | ------ | ---- |
| intervalPadding | 柱状图之间的间隔距离 | `number` |        |      |
| fill            | 颜色填充             | `string` |        |      |
| opacity         | 透明度               | `number` |        |      |

##### BulletTheme

功能描述：mini 子弹图样式配置

| 参数               | 说明           | 类型                                      | 默认值 | 必选 |
| ------------------ | -------------- | ----------------------------------------- | ------ | ---- |
| progressBar        | 进度条样式     | [ProgressBar](#progressbar)               |        |      |
| comparativeMeasure | 测量标记线     | [ComparativeMeasure](#comparativemeasure) |        |      |
| rangeColors        | 子弹图状态颜色 | [RangeColors](#rangecolors)               |        |      |
| backgroundColor    | 子弹图背景颜色 | `string`                                    |        |      |

##### ProgressBar

功能描述：mini 子弹图进度条样式配置

| 参数               | 说明           | 类型                                      | 默认值 | 必选 |
| ------------------ | -------------- | ----------------------------------------- | ------ | ---- |
| widthPercent        | 子弹图宽度相对单元格 content 占比，小数     | `number` |        |      |
| height | 高度     | `number`|        |      |
| innerHeight        | 内高度 | `number`  |        |      |

##### ComparativeMeasure

功能描述：mini 子弹图测量标记线样式配置

| 参数               | 说明           | 类型                                      | 默认值 | 必选 |
| ------------------ | -------------- | ----------------------------------------- | ------ | ---- |
| width        | 宽度    | `number` |        |      |
| height | 高度     | `number`|        |      |
| fill            | 颜色填充             | `string` |        |      |
| opacity         | 透明度               | `number` |        |      |

##### RangeColors

功能描述：mini 子弹图状态颜色样式配置

| 参数               | 说明           | 类型                                      | 默认值 | 必选 |
| ------------------ | -------------- | ----------------------------------------- | ------ | ---- |
| good        | 满意    | `string` |        |      |
| satisfactory | 良好     | `string`|        |      |
| bad            | 不符合预期             | `string` |        |      |

##### IntervalTheme

功能描述：mini 条形图样式（条件格式）

| 参数   | 说明       | 类型     | 默认值 | 必选 |
| ------ | ---------- | -------- | ------ | ---- |
| height | 条形图高度 | `number` |        |      |
| fill   | 颜色填充   | `string` |        |      |
