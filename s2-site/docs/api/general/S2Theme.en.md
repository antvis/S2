---
title: S2Theme
order: 2
tag: Updated
---

theme configuration

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

**optional** *object*

Function description: Table theme configuration items

| parameter | parameter    | type                              | Defaults  | required |
| --------- | ------------ | --------------------------------- | --------- | -------- |
| theme     | theme schema | [S2Theme](#s2theme)               | -         |          |
| palette   | swatches     | [Palette](#palette)               | -         |          |
| name      | subject name | `default` \| `colorful` \| `gray` | `default` |          |

### Palette

**optional** *object*

Function description: Table theme swatches

| parameter           | parameter                                                                                                     | type                                                             | Defaults | required |
| ------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------- | -------- |
| brandColor          | Swatch theme color                                                                                            | `string`                                                         | -        | ✓        |
| basicColors         | base color                                                                                                    | `string[]`                                                       | -        | ✓        |
| basicColorRelations | The correspondence between basicColors and the subscripts of the standard color palette array                 | `Array<{ basicColorIndex: number; standardColorIndex: number;}>` | -        | ✓        |
| semanticColors      | Colors used to represent the actual business semantics. For example, the built-in color "red fall green rise" | `[key: string]`                                                  | -        | ✓        |
| others              | Colors used to represent the actual business semantics. For example, the built-in color "red fall green rise" | `[key: string]`                                                  | -        |          |

### S2Theme

**optional** *object*

Function description: Table theme `Schema`

| parameter         | parameter                                                                            | type                                            | Defaults | required |
| ----------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------- | -------- | -------- |
| cornerCell        | Corner header cell theme                                                             | [DefaultCellTheme](#defaultcelltheme)           |          |          |
| rowCell           | Row header cell theme                                                                | [DefaultCellTheme](#defaultcelltheme)           |          |          |
| colCell           | Column header cell theme                                                             | [DefaultCellTheme](#defaultcelltheme)           |          |          |
| dataCell          | Numeric Cell Theme                                                                   | [DefaultCellTheme](#defaultcelltheme)           |          |          |
| resizeArea        | Column Width Row Height Adjustment Hotspot                                           | [ResizeArea](#resizearea)                       |          |          |
| scrollBar         | scroll bar style                                                                     | [ScrollBarTheme](#scrollbartheme)               |          |          |
| splitLine         | Cell divider style                                                                   | [SplitLine](#splitline)                         |          |          |
| prepareSelectMask | Brush mask style                                                                     | [InteractionStateTheme](#interactionstatetheme) |          |          |
| background        | background style                                                                     | [background](#background)                       |          |          |
| \[key: string]    | Additional attribute fields, used for passing parameters when users customize themes | `unknown`                                       |          |          |

#### DefaultCellTheme

**optional** *object*

Function description: Default cell theme

| parameter         | illustrate                 | type                              | Defaults | required |
| ----------------- | -------------------------- | --------------------------------- | -------- | -------- |
| bolderText        | bold text style            | [TextTheme](#texttheme)           | -        |          |
| text              | text style                 | [TextTheme](#texttheme)           | -        |          |
| seriesText        | Ordinal text style         | [TextTheme](#texttheme)           | -        |          |
| measureText       | Metric Text Style          | [TextTheme](#texttheme)           | -        |          |
| cell              | cell style                 | [Cell Theme](#celltheme)          | -        |          |
| icon              | icon style                 | [IconTheme](#icontheme)           | -        |          |
| seriesNumberWidth | Serial Number Column Width | `number`                          | 80       |          |
| miniChart         | mini-figure                | [MiniChartTheme](#minicharttheme) |          |          |

#### ResizeArea

**optional** *object*

Function description: Column width row height drag hot zone style

| parameter         | illustrate                                                                                                               | type                                  | Defaults | required |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | -------- | -------- |
| size              | Hot zone size                                                                                                            | `number`                              | 3        |          |
| background        | Hot zone background color                                                                                                | `string`                              | -        |          |
| backgroundOpacity | Hotspot background color transparency                                                                                    | `number`                              | -        |          |
| guideLineColor    | Guide Color                                                                                                              | `string`                              | -        |          |
| guideLineDash     | Hot Zone Guide [Dashed Line Mode](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setLineDash) | `number[]`                            | `[3, 3]` |          |
| interactionState  | Hot zone interactive state style                                                                                         | [InteractionState](#interactionstate) | -        |          |

#### ScrollBarTheme

**optional** *object*

Function description: scroll bar style

| parameter              | illustrate                                                                                                                                                                            | type                          | Defaults               | required |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ---------------------- | -------- |
| trackColor             | Scrollbar track color                                                                                                                                                                 | `string`                      | `rgba(0,0,0,0)`        |          |
| thumbHoverColor        | Scrollbar Hover state color                                                                                                                                                           | `string`                      | `rgba(0,0,0,0.4)`      |          |
| thumbColor             | scrollbar color                                                                                                                                                                       | `string`                      | `rgba(0,0,0,0.15)`     |          |
| thumbHorizontalMinSize | The horizontal minimum size of the scroll bar (in the case of a large number, the scroll bar will be very small, and the minimum size of the horizontal scroll bar can be configured) | `string`                      | `32`                   |          |
| thumbVerticalMinSize   | The vertical minimum size of the scroll bar (in the case of a large number, the scroll bar will be very small, and the minimum size of the vertical scroll bar can be configured)     | `string`                      | `32`                   |          |
| size                   | scroll bar size                                                                                                                                                                       | `number`                      | Mobile: `3`<br>PC: `6` |          |
| hoverSize              | The size of the scrollbar when Hover                                                                                                                                                  | `number`                      | `16`                   |          |
| lineCap                | Specifies how to draw the end of each line segment                                                                                                                                    | `butt` \| `round` \| `square` | `round`                |          |

#### SplitLine

**optional** *object*

Function description: Split line style

| parameter                    | illustrate                                                                                        | type                                 | Defaults                                                 | required |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------- | -------- |
| horizontalBorderColor        | Horizontal divider color                                                                          | `string`                             | -                                                        |          |
| horizontalBorderColorOpacity | Horizontal divider color transparency                                                             | `number`                             | 0.2                                                      |          |
| horizontalBorderWidth        | Horizontal split line width                                                                       | `number`                             | 2                                                        |          |
| verticalBorderColor          | vertical line color                                                                               | `string`                             | -                                                        |          |
| verticalBorderColorOpacity   | Vertical split line color transparency                                                            | `number`                             | 0.25                                                     |          |
| verticalBorderWidth          | Vertical dividing line width                                                                      | `number`                             | 2                                                        |          |
| showShadow                   | Whether to display the outer shadow of the dividing line (in the case of frozen rows and columns) | `boolean`                            | `true`                                                   |          |
| shadowWidth                  | shadow width                                                                                      | `number`                             | 10                                                       |          |
| shadowColors                 | `left` : change the left color linearly<br>`right` : change the color of the right side linearly  | `{left: string,`<br>`right: string}` | `{left: 'rgba(0,0,0,0.1)',`<br>`right: 'rgba(0,0,0,0)'}` |          |

#### TextTheme

**optional** *object*

Function Description: Text Theme

| parameter    | illustrate                                                                | type                          | Defaults                                                                                    | required |
| ------------ | ------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| textAlign    | Alignment of text content                                                 | `left` \| `center` \| `right` | -                                                                                           |          |
| textBaseline | Baseline when drawing text                                                | `top` \| `middle` \| `bottom` | -                                                                                           |          |
| fontFamily   | font                                                                      | `string`                      | `Roboto, PingFangSC,`<br>`BlinkMacSystemFont,`<br>`Microsoft YaHei,`<br>`Arial, sans-serif` |          |
| fontSize     | font size                                                                 | `number`                      | -                                                                                           |          |
| fontWeight   | number<br>string: `normal`<br>`bold`<br>`bolder`<br>`lighter` font weight | `number` \| `string`          | Bold text: Mobile: `520` PC: `bold`<br>Normal text: `normal`                                |          |
| fill         | font color                                                                | `string`                      | -                                                                                           |          |
| linkTextFill | link text color                                                           | `string`                      | -                                                                                           |          |
| opacity      | font transparency                                                         | `number`                      | 1                                                                                           |          |

#### Cell Theme

**optional** *object*

Function description: Cell general theme

| parameter                    | illustrate                                | type                                            | Defaults | required |
| ---------------------------- | ----------------------------------------- | ----------------------------------------------- | -------- | -------- |
| crossBackgroundColor         | Cardinal row cell background color        | `string`                                        | -        |          |
| backgroundColor              | cell background color                     | `string`                                        | -        |          |
| backgroundColorOpacity       | Cell background color transparency        | `number`                                        | 1        |          |
| horizontalBorderColor        | Cell horizontal border color              | `string`                                        | -        |          |
| horizontalBorderColorOpacity | Cell horizontal border color transparency | `number`                                        | 1        |          |
| horizontalBorderWidth        | Cell horizontal border width              | `number`                                        | -        |          |
| verticalBorderColor          | Cell vertical border color                | `string`                                        | -        |          |
| verticalBorderColorOpacity   | Cell vertical border color transparency   | `number`                                        | 1        |          |
| verticalBorderWidth          | cell vertical border width                | `number`                                        | -        |          |
| padding                      | cell padding                              | [Padding](#margin--padding)                     | -        |          |
| interactionState             | cell interaction state                    | [InteractionStateTheme](#interactionstatetheme) | -        |          |

#### IconTheme

**optional** *object*

Function description: icon general theme

| parameter     | illustrate             | type                       | Defaults  | required |
| ------------- | ---------------------- | -------------------------- | --------- | -------- |
| fill          | icon fill color        | `string`                   | -         |          |
| size          | icon size              | `number`                   | -         |          |
| margin        | cell margin            | [Margin](#margin--padding) | -         |          |

#### InteractionStateTheme

**optional** *object*

Function description: interactive general theme

| parameter         | illustrate              | type     | Defaults | required |
| ----------------- | ----------------------- | -------- | -------- | -------- |
| backgroundColor   | background fill color   | `string` |          |          |
| backgroundOpacity | background transparency | `number` |          |          |
| borderColor       | Edge fill color         | `string` |          |          |
| borderWidth       | Edge Width              | `number` |          |          |
| borderOpacity     | border transparency     | `number` |          |          |
| textOpacity       | text transparency       | `number` |          |          |
| opacity           | overall transparency    | `number` |          |          |

#### Margin｜Padding

**optional** *object*

Function description: icon outer margin, cell inner margin

| parameter | illustrate | type     | Defaults | required |
| --------- | ---------- | -------- | -------- | -------- |
| top       | superior   | `number` |          |          |
| right     | right      | `number` |          |          |
| bottom    | Down       | `number` |          |          |
| left      | Left       | `number` |          |          |

#### background

**optional** *object*

Function description: background configuration

| parameter | illustrate   | type     | Defaults | required |
| --------- | ------------ | -------- | -------- | -------- |
| color     | color        | `string` | -        |          |
| opacity   | transparency | `number` | 1        |          |

#### MiniChartTheme

Function description: sparkline configuration

| parameter | illustrate                     | type                             | Defaults | required |
| --------- | ------------------------------ | -------------------------------- | -------- | -------- |
| line      | Line chart style configuration | [Line Theme](#linetheme)         |          |          |
| bar       | Histogram style configuration  | [Bar Theme](#bartheme)           |          |          |
| bullet    | color                          | [Bullet Theme](#bullettheme)     |          |          |
| interval  | transparency                   | [Interval Theme](#intervaltheme) |          |          |

#### Line Theme

Function description: mini line chart style configuration

| parameter | illustrate                          | type                                              | Defaults | required |
| --------- | ----------------------------------- | ------------------------------------------------- | -------- | -------- |
| point     | Point Configuration for Line Charts | `{size: number; fill?: number; opacity?: number}` |          |          |
| linkLine  | Line Configuration for Line Charts  | `{size: number; fill: number; opacity: number}`   |          |          |

#### Bar Theme

Function description: mini histogram style configuration

| parameter       | illustrate                           | type     | Defaults | required |
| --------------- | ------------------------------------ | -------- | -------- | -------- |
| intervalPadding | Interval distance between histograms | `number` |          |          |
| fill            | color fill                           | `string` |          |          |
| opacity         | transparency                         | `number` |          |          |

#### Bullet Theme

Function description: mini bullet chart style configuration

| parameter           | illustrate                    | type                                       | Defaults | required |
| ------------------- | ----------------------------- | ------------------------------------------ | -------- | -------- |
| progressBar         | progress bar style            | [Progress Bar](#progressbar)               |          |          |
| comparative measure | measurement markers           | [Comparative Measure](#comparativemeasure) |          |          |
| rangeColors         | Bullet chart status color     | [RangeColors](#rangecolors)                |          |          |
| backgroundColor     | Bullet chart background color | string                                     |          |          |

#### Progress Bar

Function description: mini bullet chart progress bar style configuration

| parameter    | illustrate                                                    | type     | Defaults | required |
| ------------ | ------------------------------------------------------------- | -------- | -------- | -------- |
| widthPercent | Ratio of bullet chart width relative to cell content, decimal | `number` |          |          |
| height       | high                                                          | `number` |          |          |
| innerHeight  | inner height                                                  | `number` |          |          |

#### Comparative Measure

Function description: mini bullet chart measurement marker line style configuration

| parameter | illustrate   | type     | Defaults | required |
| --------- | ------------ | -------- | -------- | -------- |
| width     | width        | `number` |          |          |
| height    | high         | `number` |          |          |
| fill      | color fill   | `string` |          |          |
| opacity   | transparency | `number` |          |          |

#### RangeColors

Function description: mini bullet chart state color style configuration

| parameter    | illustrate                | type     | Defaults | required |
| ------------ | ------------------------- | -------- | -------- | -------- |
| good         | satisfy                   | `string` |          |          |
| satisfactory | good                      | `string` |          |          |
| bad          | did not meet expectations | `string` |          |          |

#### Interval Theme

Function description: mini bar chart style (conditional formatting)

| parameter | illustrate | type     | Defaults | required |
| --------- | ---------- | -------- | -------- | -------- |
| height    | bar height | `number` |          |          |
| fill      | color fill | `string` |          |          |
