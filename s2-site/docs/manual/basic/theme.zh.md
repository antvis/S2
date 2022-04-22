---
title: 主题配置
order: 6
---

## 简介

S2 中内置了 3 套开箱即用的主题配置，也提供了强大的主题配置自定义功能。

实例对象上的`setThemeCfg`方法是一切主题配置的入口，该方法接收一个类型为 [ThemeCfg](/zh/docs/api/general/S2Theme#themecfg) 作为参数。

## 主题

你可以通过指定主题名字来使用对应的主题：

```js
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

// name 可为 default, colorful, gray
s2.setThemeCfg({ name: 'colorful' });
s2.render();
```

S2 内置 3 套主题效果：
<table style="width: 100%; outline: none; border-collapse: collapse;">
  <colgroup>
    <col width="20%"/>
    <col width="80%" />
  </colgroup>
  <tbody>
    <tr>
      <td style="text-align: center;">
      默认
      </td>
      <td>
        <img height="300" alt="default" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/nDIO0OG8fv/4ff6613f-fad3-4ea6-9473-0161509f692c.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
      多彩蓝
      </td>
      <td>
        <img height="300" alt="colorful" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/rgLkfo4MrT/95b7fbc3-8c6e-442c-9c4b-8bf8b3c3da1d.png">
      </td>
    </tr>
    <tr>
      <td style="text-align: center;">
      简约灰
      </td>
      <td>
        <img height="300" alt="gray" style="max-height: unset;" src="https://gw.alipayobjects.com/zos/antfincdn/4rwGg8Rp3N/cf08d7dd-ab96-446e-ba8d-146de8cb6a64.png">
      </td>
    </tr>
  </tbody>
</table>

​📊 查看更多 [主题示例](/zh/examples/theme/default#default)。

## 自定义 schema

如果内置的主题不满意你的要求，那么你可以通过自定义 `schema` 的方式重写特定的配置。

此时你需要为 `setThemeCfg` 配置 `theme` 对象。[查看完整 schema 配置](/zh/docs/api/general/S2Theme#s2theme)：

```js
const s2 = new PivotSheet(container, s2DataConfig, s2Options);

const customTheme = {
    background: {
        color: '#353c59',
    }
};

s2.setThemeCfg({ theme: customTheme });
s2.render();
```

<playground path="theme/custom/demo/custom-schema.ts" rid='custom-schema'></playground>

## 自定义色板

自定义 `schema` 虽然灵活，但是心智负担比较重，需要对 `schema` 的结构有比较详细的了解。因此我们还提供了自定义色板功能，此时你需要为 `setThemeCfg` 配置`palette`对象。[查看完整色板配置](/zh/docs/api/general/S2Theme#palette)：

### 自选色板颜色

你可以参考 [内置色板](https://github.com/antvis/S2/blob/master/packages/s2-core/src/theme/palette/colorful.ts) 个人化设置 `basicColors` 与 `semanticColors`，所选颜色会被用于表格不同部分的绘制，颜色使用关系请参考下方的 [色板对照表](#色板对照表)。

另外为方便大家调配专属色板，S2 官方提供了[自助色板调色工具](/zh/examples/theme/custom/#custom-manual-palette)，所见即所得帮助你快速调配色板，一键复制粘贴进项目使用。

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
    '#7232CF',
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
    red: "#FF4D4F",
    green: "#29A294",
  },
};
s2.setThemeCfg({ palette: s2Palette });
s2.render();
```

<playground path="theme/custom/demo/custom-manual-palette.tsx" height="500" rid='custom-manual-palette'></playground>

### 按主题色自动生成

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

s2.setThemeCfg({ palette: s2Palette });
s2.render();

```

<playground path="theme/custom/demo/custom-generate-palette.tsx" rid='custom-generate-palette'></playground>

## 色板对照表

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
            rowCell.cell.icon.fill</br>
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
            rowCell.interactionState.hover.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
            行头单元格鼠标选中态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.interactionState.selected.backgroundColor</br>
        </td>
    </tr>
 <tr>
        <td  style="text-align: left;">
            数据单元格鼠标悬停态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.interactionState.hover.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td  style="text-align: left;">
            数据单元格鼠标悬停聚焦态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.interactionState.hoverFocus.backgroundColor</br>
        </td>
    </tr>
     <tr>
        <td  style="text-align: left;">
            数据单元格鼠标选中态背景填充色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.interactionState.selected.backgroundColor</br>
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
        <td style="text-align: center; background: #326EF4; color:white;"> #326EF4</td>
        <td style="text-align: center; background: #565C64; color:white; "> #565C64</td>
        <td style="text-align: center;  background: #2C60D4; color:white;"> #2C60D4</td>
        <td style="text-align: left;">
            行头单元格链接文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.text.linkTextFill</br>
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
            dataCell.cell.miniBarChartFillColor</br>
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
            resizeArea.interactionState.hover。backgroundColor</br>
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
        <td rowspan=5 style="text-align: center; background: #000000; color: white; "> #000000</td>
        <td rowspan=5 style="text-align: center; background: #000000; color: white;"> #000000</td>
        <td rowspan=5 style="text-align: center;  background: #000000; color: white;"> #000000</td>
        <td style="text-align: left;">
           行头单元格粗体文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.bolderText.fill</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
           行头单元格粗体链接文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.bolderText.linkTextFill</br>
        </td>
    </tr>
      <tr>
        <td style="text-align: left;">
           行头单元格链接文本颜色 </br>
        </td>
        <td style="text-align: left;">
            rowCell.text.linkTextFill</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
           数据单元格鼠标悬停聚焦态边框颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.interactionState.hoverFocus.borderColor</br>
        </td>
    </tr>
     <tr>
        <td style="text-align: left;">
           数据单元格鼠标刷选预中态边框颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.interactionState.prepareSelect.borderColor</br>
        </td>
    </tr>
    <tr>
    <td colspan=3  style="text-align: center;"> 语义色-semanticColors</td>
    <td colspan=2 style="text-align: center;"> </td>
    </tr>
    <tr>
        <td style="text-align: center; background: #FF4D4F; "> red: #FF4D4F</td>
        <td style="text-align: center; background: #FF4D4F;"> red: #FF4D4F</td>
        <td style="text-align: center;  background: #FF4D4F;"> red: #FF4D4F</td>
        <td style="text-align: left;">
           数据单元格上箭头图标颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.icon.downIconColor</br>
        </td>
    </tr>
    <tr>
        <td style="text-align: center; background: #29A294; "> green: #29A294</td>
        <td style="text-align: center; background: #29A294;"> green: #29A294</td>
        <td style="text-align: center;  background: #29A294;"> green: #29A294</td>
        <td style="text-align: left;">
           数据单元格下箭头图标颜色 </br>
        </td>
        <td style="text-align: left;">
            dataCell.icon.upIconColor</br>
        </td>
    </tr>
  </tbody>
</table>
