---
title: 主题配置
order: 6
tag: Updated
---

## 简介

S2 中内置了 **4** 套开箱即用的主题配置，也提供了强大的主题自定义功能。[查看 API](/api/general/s2theme)

- [默认](/examples/theme/default/#default)
- [多彩蓝](/examples/theme/default/#colorful)
- [简约灰](/examples/theme/default/#gray)
- [暗黑](/examples/theme/default/#dark)

### 色彩

在 S2 的色彩使用中，我们会首先选定一个**主题色**，并使用主题色生成一套 `标准色板`：

- 标准色板共 `11` 个色彩位，主题色位于索引 `6` 上
- 使用主题色加不同程度的 `白` 生成 `5` 个**较淡的颜色**，置于索引 `0~5` 上
- 使用主题色加不同程度的 `黑` 生成 `5` 个**较深的颜色**，置于索引 `6~11` 上

以下是使用 **#0A78F4**、**#FF5500** 不同主题色，生成标准色板的示例：

<image alt="#0A78F4 standard palette" src="https://gw.alipayobjects.com/zos/antfincdn/8BOmvrgF6/65409159-09d0-4780-a431-3bb3e61cf429.png" width="600" />

<image alt="#FF5500 standard palette" src="https://gw.alipayobjects.com/zos/antfincdn/%24oA4V2Sby/6a224ba4-c191-476c-9b15-4394c2961492.png" width="600" />

### 色板 Palette

色板的定义为 [Palette](/docs/api/general/S2Theme#palette)，当生成主题 schema 时会从中取用颜色，而它的颜色则来自于标准色板中，Palette 的关键属性有：

- `basicColors`：基础颜色，共 15 个色彩位，本质上确定了表格的配色方案，生成主题 schema 时会从 basicColors 固定索引上取色，如行头背景颜色固定会取 `basicColors[1]` 的颜色
- `basicColorRelations`：basicColors 与标准色板的对应关系，如内置的 colorful 主题中，行头背景色 `basicColors[1]` 是取用标准色板中的索引 0 的颜色

由此 S2 保证了，所有绘制时使用的颜色均来自于主题色或主题色的派生颜色。这样使表格界面颜色统一，也便于用户根据自己需要的主题色，生成个性化主题。

### 主题 Schema

主题 schema 的定义为 [S2Theme](/docs/api/general/S2Theme#s2theme)，其详尽地描述了单元格、交互等主题样式，属性包含颜色、线条粗细、文字大小、文字对齐方式等。整个 schema 中，所有的颜色会从 [Palette](/docs/api/general/S2Theme#palette) 中取用：

- `basicColors`：基础颜色，如角/列/行头背景，字体/icon 颜色。
- `semanticColors`：语义颜色，如红色、绿色、黄色指代的色值。
- `others`：补充颜色，一些固定特殊色，如搜索结果。

```ts
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.setThemeCfg({
  theme: {
    background: {
      color: '#353c59',
    }
  }
});

//  等价于
s2.setTheme({
  background: {
    color: '#353c59',
  },
});

await s2.render(false);
```

## 自定义主题

s2 实例上的 `setThemeCfg` 方法是一切主题配置的入口，该方法接收一个类型为 [ThemeCfg](/api/general/S2Theme) 的参数，你可以：

- 通过 [ThemeCfg.name](/api/general/s2-theme) 使用预置主题
- 通过 [ThemeCfg.palette](/api/general/s2-theme#palette) 自定义色板生成主题
- 通过 [ThemeCfg.theme](/api/general/s2-theme#s2theme) 自定义 schema 生成主题（可与上两个属性同时使用，即覆盖由它们生成的主题）

### 选择预置主题

你可以通过指定主题名字来使用对应的主题：

```js
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

// name 可为 default, colorful, gray, dark
s2.setThemeCfg({ name: 'colorful' });
await s2.render(false);
```

S2 内置 `4` 套主题效果：

<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="20%"/>
    <col width="80%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
        默认 (default)
      </td>
      <td>
        <img height="300" alt="default" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/nDIO0OG8fv/4ff6613f-fad3-4ea6-9473-0161509f692c.png" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        多彩蓝 (colorful)
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/rgLkfo4MrT/95b7fbc3-8c6e-442c-9c4b-8bf8b3c3da1d.png" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        简约灰 (gray)
      </td>
      <td>
        <img height="300" alt="gray" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/4rwGg8Rp3N/cf08d7dd-ab96-446e-ba8d-146de8cb6a64.png" />
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
        暗黑 (dark)
      </td>
      <td>
        <img height="300" alt="dark" style="max-height: unset;" src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*eRu9R7b1pGwAAAAAAAAAAAAADmJ7AQ/original" />
      </td>
    </tr>
  </tbody>
</table>

​📊 查看更多 [主题示例](/examples/theme/default#default)。

### 自定义 Schema

如果内置的主题不满意你的要求，那么你可以通过自定义 `schema` 的方式重写特定的配置。

此时你可以调用 `s2.setTheme` 或者 `s2.setThemeCfg()` 配置 `theme` 对象。[查看完整 Schema 配置](/docs/api/general/S2Theme#s2theme)：

```js
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

const customTheme = {
  background: {
    color: '#353c59',
  },
};

s2.setTheme(customTheme) // 等价与：s2.setThemeCfg({ theme: customTheme })
await s2.render(false);
```

<Playground path="theme/custom/demo/custom-schema.ts" rid='custom-schema'></playground>

<br/>

#### 自定义单元格对齐方式

[查看详情](/manual/advanced/custom/cell-align) 和 [完整 API](/api/general/s2theme#s2theme)

```ts
s2.setTheme({
  rowCell: {
    text: {
      textAlign: 'left',
    },
    bolderText: {
      textAlign: 'left',
    },
  },
});
```

#### 自定义单元格背景色

查看 [完整 API](/api/general/s2theme#s2theme)

```ts
s2.setTheme({
  rowCell: {
    cell: {
      backgroundColor: '#dcdcdc',
    },
  },
});
```

#### 自定义滚动条样式

查看 [完整 API](/api/general/s2theme#scrollbartheme)

```ts
s2.setTheme({
  scrollBar: {
    thumbColor: '#666',
    thumbHorizontalMinSize: 20,
    thumbVerticalMinSize: 20,
  },
});
```

#### 自定义交互样式

[查看文档](/manual/advanced/interaction/basic#%E8%B0%83%E6%95%B4%E4%BA%A4%E4%BA%92%E4%B8%BB%E9%A2%98) [查看示例](/zh/examples/interaction/basic#state-theme)

<Playground path='interaction/basic/demo/state-theme.ts' rid='state-theme' height='300'></playground>

<br/>

### 自定义色板

自定义 `schema` 虽然灵活，但是心智负担比较重，需要对 `schema` 的结构有比较详细的了解。因此我们还提供了自定义色板功能，此时你需要为 `setThemeCfg` 配置`palette`对象。[查看完整色板配置](/docs/api/general/S2Theme#palette)：

#### 自选色板颜色

你可以参考 [内置色板](https://github.com/antvis/S2/blob/next/packages/s2-core/src/theme/palette/colorful.ts) 个人化设置 `basicColors` 与 `semanticColors`，所选颜色会被用于表格不同部分的绘制，颜色使用关系请参考下方的 [色板对照表](#色板对照表)。

另外为方便大家调配专属色板，S2 官方提供了 [自助色板调色工具](/examples/theme/custom/#custom-manual-palette)，所见即所得帮助你快速调配色板，一键复制粘贴进项目使用。

```js
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

const s2Palette = {
  // 基础配色色板
  basicColors: [
    '#FFFFFF',
    '#F8F5FE',
    '#EDE1FD',
    '#873BF4',
    '#7232CF',
    '#AB76F7',
    '#FFFFFF',
    '#DDC7FC',
    '#9858F5',
    '#B98EF8',
    '#873BF4',
    '#282B33',
    '#121826',
  ],
  // 语义化色板
  semanticColors: {
    red: '#FF4D4F',
    green: '#29A294',
  },
};

s2.setThemeCfg({ palette: s2Palette });
await s2.render(false);
```

<Playground path="theme/custom/demo/custom-manual-palette.tsx" height="500" rid='custom-manual-palette'></playground>

<br/>

#### 按主题色自动生成

[自选色板颜色](#自选色板颜色) 的调配自由度大，但每个颜色都需要单独确定，整体过程较为复杂。为满足用户的一般主题诉求，S2 还提供了根据主题色生成色板的功能。

```js
import { getPalette, generatePalette, PivotSheet } from '@antv/s2';

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

// 主题色
const themeColor = '#EA1720';
// 使用内置的 colorful 色板作为参考色板
// 根据风格差异，你也可以选择 default、gray 作为参考色板
const palette = getPalette('colorful');
// 使用参考色板 & 主题色值生成新色板
const newPalette = generatePalette({ ...palette, brandColor: themeColor });

// 使用新色板设置主题
s2.setThemeCfg({
  palette: newPalette,
});
await s2.render(false);
```

<Playground path="theme/custom/demo/custom-generate-palette.tsx" rid='custom-generate-palette'></playground>

## 预置主题色板对照表

<table style="width: 100%; outline: none; border-collapse: collapse;">
 <colgroup>
    <col width="10%" />
    <col width="10%"/>
    <col width="10%" />
    <col width="35%"/>
    <col width="35%" />
  </colgroup>
  <tbody>
    <tr>
      <td  colspan=3 style="text-align: center;">
      色板
      </td>
       <td rowspan=3 style="text-align: center;">
      涉及范围
      </td>
        <td rowspan=3 style="text-align: center;">
      对应 schema 的 key
      </td>
    </tr>
    <tr>
    <td colspan=3  style="text-align: center;"> 基础色-basicColors</td>
    </tr>
     <tr>
    <td style="text-align: center;"> 默认</td>
    <td style="text-align: center;"> 简约灰</td>
    <td style="text-align: center;"> 多彩蓝</td>
    </tr>
    <tr>
        <td rowspan=8 style="text-align: center; background: #000000; color: white;"> #000000</td>
        <td rowspan=8 style="text-align: center; background: #000000;  color: white;"> #000000</td>
        <td rowspan=8  style="text-align: center;  background: #FFFFFF;"> #FFFFFF</td>
        <td style="text-align: left;">
            角头单元格粗体文本颜色 </br>
        </td>
        <td style="text-align: left;">
            cornerCell.bolderText.fill</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            角头单元格文本颜色 </br>
        </td>
        <td style="text-align: left;">
            cornerCell.text.fill</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            角头单元格图标颜色</br>
        </td>
        <td style="text-align: left;">
            cornerCell.icon.fill</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            行头单元格图标颜色</br>
        </td>
        <td style="text-align: left;">
            rowCell.icon.fill</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            列头单元格粗体文本颜色</br>
        </td>
        <td style="text-align: left;">
            colCell.bolderText.fill</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            列头单元格文本颜色</br>
        </td>
        <td style="text-align: left;">
            colCell.text.fill</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            列头单元格图标颜色 </br>
        </td>
        <td style="text-align: left;">
           colCell.icon.fill</br>
        </td>
    </tr>
<tr>
        <td style="text-align: left;">
            数据单元格图标颜色 </br>
        </td>
        <td style="text-align: left;">
           dataCell.icon.fill</br>
        </td>
    </tr>
    <tr>
        <td rowspan=2 style="text-align: center; background: #F5F8FE; "> #F5F8FE</td>
        <td rowspan=2 style="text-align: center; background: #FAFBFB;"> #FAFBFB</td>
        <td rowspan=2 style="text-align: center;  background: #F5F8FF;"> #F5F8FF</td>
        <td style="text-align: left;">
            行头单元格背景填充色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.cell.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            数据单元格背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td rowspan=5 style="text-align: center; background: #E0E9FD; "> #E0E9FD</td>
        <td rowspan=5 style="text-align: center; background: #F0F2F4;"> #F0F2F4</td>
        <td rowspan=5 style="text-align: center;  background: #E1EAFE;"> #E1EAFE</td>
        <td style="text-align: left;">
            行头单元格鼠标悬停态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.cell.interactionState.hover.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            行头单元格鼠标选中态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.cell.interactionState.selected.backgroundColor</br>
        </td>
    </tr>
 <tr>
        <td  style="text-align: left;">
            数据单元格鼠标悬停态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.interactionState.hover.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td  style="text-align: left;">
            数据单元格鼠标悬停聚焦态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.interactionState.hoverFocus.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td  style="text-align: left;">
            数据单元格鼠标选中态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.interactionState.selected.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td rowspan=2 style="text-align: center; background: #E0E9FD; "> #E0E9FD</td>
        <td rowspan=2 style="text-align: center; background: #F0F2F4;"> #F0F2F4</td>
        <td rowspan=2 style="text-align: center;  background: #3471F9;"> #3471F9</td>
        <td style="text-align: left;">
            角头单元格背景填充色 </br>
        </td>
        <td style="text-align: left;">
            cornerCell.cell.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            列头单元格背景填充色 </br>
        </td>
        <td style="text-align: left;">
            colCell.cell.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td rowspan=2 style="text-align: center; background: #CCDBFC; "> #CCDBFC</td>
        <td rowspan=2 style="text-align: center; background: #E7E9ED;"> #E7E9ED</td>
        <td rowspan=2 style="text-align: center;  background: #2C60D4;"> #2C60D4</td>
        <td style="text-align: left;">
            列头单元格鼠标鼠标悬停态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            colCell.cell.interactionState.hover.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            列头单元格鼠标鼠标选中态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            colCell.cell.interactionState.selected.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: center; background: #234DAB; color:white;"> #234DAB</td>
        <td style="text-align: center; background: #6E757F;color:white; "> #6E757F</td>
        <td style="text-align: center;  background: #2C60D4;color:white;"> #2C60D4</td>
        <td style="text-align: left;">
            刷选预选中状态蒙板背景填充色 </br>
        </td>
        <td style="text-align: left;">
            prepareSelectMask.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td rowspan=2 style="text-align: center; background: #326EF4; color:white;"> #326EF4</td>
        <td rowspan=2 style="text-align: center; background: #565C64; color:white; "> #565C64</td>
        <td rowspan=2 style="text-align: center;  background: #2C60D4; color:white;"> #2C60D4</td>
        <td style="text-align: left;">
            行头单元格链接文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.text.linkTextFill</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            行头单元格链接粗体文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.bolderText.linkTextFill</br>
        </td>
    </tr>
    <tr>
        <td rowspan=4 style="text-align: center; background: #326EF4; "> #326EF4</td>
        <td rowspan=4 style="text-align: center; background: #9DA7B6;"> #9DA7B6</td>
        <td rowspan=4 style="text-align: center;  background: #3471F9;"> #3471F9</td>
        <td style="text-align: left;">
            数据单元格柱状图填充色 </br>
        </td>
        <td style="text-align: left;">
            miniChart.bar.fill</br>
        </td>
    </tr>
       <tr>
        <td style="text-align: left;">
            resize 蒙层背景色 </br>
        </td>
        <td style="text-align: left;">
            resizeArea.background</br>
        </td>
    </tr>
       <tr>
        <td style="text-align: left;">
            resize 热区参考线颜色 </br>
        </td>
        <td style="text-align: left;">
            resizeArea.guideLineColor</br>
        </td>
    </tr>
       <tr>
        <td style="text-align: left;">
            resize 热区悬停态背景颜色 </br>
        </td>
        <td style="text-align: left;">
            resizeArea.interactionState.hover.backgroundColor</br>
        </td>
    </tr>
    <tr>
        <td rowspan=2 style="text-align: center; background: #FFFFFF; "> #FFFFFF</td>
        <td rowspan=2 style="text-align: center; background: #FFFFFF;"> #FFFFFF</td>
        <td rowspan=2 style="text-align: center;  background: #FFFFFF;"> #FFFFFF</td>
        <td style="text-align: left;">
            数据单元格背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            表格背景填充色 </br>
        </td>
        <td style="text-align: left;">
            background.color</br>
        </td>
    </tr>
    <tr>
        <td rowspan=4 style="text-align: center; background: #E0E9FD; "> #E0E9FD</td>
        <td rowspan=4 style="text-align: center; background: #F0F2F4;"> #F0F2F4</td>
        <td rowspan=4 style="text-align: center;  background: #E1EAFE;"> #E1EAFE</td>
        <td style="text-align: left;">
            行头单元格水平边框颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.cell.horizontalBorderColor</br>
        </td>
    </tr>
<tr>
        <td style="text-align: left;">
            行头单元格垂直边框颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.cell.verticalBorderColor</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            数据单元格水平边框颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.horizontalBorderColor</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: left;">
            数据单元格垂直边框颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.verticalBorderColor</br>
        </td>
    </tr>
    <tr>
        <td rowspan=4 style="text-align: center; background: #CCDBFC; "> #CCDBFC</td>
        <td rowspan=4 style="text-align: center; background: #E7E9ED;"> #E7E9ED</td>
        <td rowspan=4 style="text-align: center;  background: #5286FA;"> #5286FA</td>
        <td style="text-align: left;">
            角头单元格水平边框颜色 </br>
        </td>
        <td style="text-align: left;">
           cornerCell.cell.horizontalBorderColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            角头单元格垂直边框颜色 </br>
        </td>
        <td style="text-align: left;">
            cornerCell.cell.verticalBorderColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            列头单元格水平边框颜色 </br>
        </td>
        <td style="text-align: left;">
            colCell.cell.horizontalBorderColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            列头单元格垂直边框颜色 </br>
        </td>
        <td style="text-align: left;">
            colCell.cell.verticalBorderColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: center; background: #326EF4; "> #326EF4</td>
        <td style="text-align: center; background: #BAC1CC;"> #BAC1CC</td>
        <td style="text-align: center;  background: #5286FA;"> #5286FA</td>
        <td style="text-align: left;">
            表体水平边框颜色（一级横向分割线） </br>
        </td>
        <td style="text-align: left;">
           splitLine.verticalBorderColor</br>
        </td>
    </tr>
  <tr>
        <td style="text-align: center; background: #326EF4; "> #326EF4</td>
        <td style="text-align: center; background: #BAC1CC;"> #BAC1CC</td>
        <td style="text-align: center;  background: #3471F9;"> #3471F9</td>
        <td style="text-align: left;">
           表体垂直边框颜色（一级纵向分割线） </br>
        </td>
        <td style="text-align: left;">
           splitLine.horizontalBorderColor</br>
        </td>
    </tr>
      <tr>
        <td rowspan=2 style="text-align: center; background: #000000; color: white; "> #000000</td>
        <td rowspan=2 style="text-align: center; background: #000000; color: white;"> #000000</td>
        <td rowspan=2 style="text-align: center;  background: #000000; color: white;"> #000000</td>
        <td style="text-align: left;">
           数据单元格粗体文本颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.bolderText.fill</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
           数据单元格文本颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.text.fill</br>
        </td>
    </tr>
    <tr>
        <td rowspan=4 style="text-align: center; background: #000000; color: white; "> #000000</td>
        <td rowspan=4 style="text-align: center; background: #000000; color: white;"> #000000</td>
        <td rowspan=4 style="text-align: center;  background: #000000; color: white;"> #000000</td>
        <td style="text-align: left;">
           行头单元格粗体文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.bolderText.fill</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
           数据单元格鼠标悬停聚焦态边框颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.interactionState.hoverFocus.borderColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
           数据单元格鼠标刷选预中态边框颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.cell.interactionState.prepareSelect.borderColor</br>
        </td>
    </tr>
    <tr>
    <td colspan=3  style="text-align: center;"> 语义色-semanticColors</td>
    <td colspan=2 style="text-align: center;"> </td>
    </tr>
  </tbody>
</table>
