---
title: 常见问题
order: 8
---

**在提出问题前，建议仔细阅读一遍文档。**

## 1. 使用问题

### 浏览器兼容性

如果出现兼容性问题请结合 `babel` 和 `@babel/polyfill` 使用，更多问题欢迎进群交流

> 由于条件限制，版本下限仅供参考，并不意味着不能支持更低版本，该测试在 CDN 模式下测试完成，[在线 Demo](https://lxfu1.github.io/browser-compatibility-of-antv/?tab=s2)

|             | Chrome | Edge  | Firefox |  IE   | Opera | Safari |  UC   | 360 极速浏览器 | 360 安全浏览器 |
| ----------- | :----: | :---: | :-----: | :---: | :---: | :----: | :---: | :------------: | :------------: |
| **AntV S2** |   40   |  12   |   85    |   9   |  40   |   14   |  6.2  |       12       |      7.3       |

### 浏览器引入

<embed src="@/docs/common/browser.zh.md"></embed>

### 官网访问有点慢，或打不开，有国内镜像吗？

有，国内镜像部署在 `gitee` 上面 [点击访问](https://antv-s2.gitee.io/)

### 父级元素使用了 `transform: scale` 后，图表鼠标坐标响应不正确

可以开启 `supportCSSTransform` 属性

```ts
const s2Options = {
   supportCSSTransform: true
}
```

也可以手动调用 `s2.changeSheetSize` 根据缩放比改变图表大小，使图表和父元素缩放比保持一致

```ts
const scale = 0.8
s2.changeSheetSize(width * scale, height * scale)
s2.render(false)
```

可参考 issue [#808](https://github.com/antvis/S2/issues/808) [#990](https://github.com/antvis/S2/pull/990) （感谢 [@cylnet](https://github.com/cylnet) [@xiaochong44](https://github.com/xiaochong44))

### 如何更新表格配置？

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

更新 options: [可选项](/zh/docs/api/general/S2Options)，会与上次的数据进行合并

```ts
pivotSheet.setOptions({ ... })
pivotSheet.render(false) // 重新渲染，不更新数据
```

重置 options: [可选项](/zh/docs/api/general/S2Options)，直接使用传入的 option，不会与上次的数据进行合并

```ts
pivotSheet.setOptions({ ... }, true)
pivotSheet.render(false) // 重新渲染，不更新数据
```

更新 dataCfg: [可选项](/zh/docs/api/general/S2DataConfig)，会与上次的数据进行合并

```ts
pivotSheet.setDataCfg({ ... })
pivotSheet.render(true) // 重新渲染，且更新数据
```

重置 dataCfg: [可选项](/zh/docs/api/general/S2DataConfig)，直接使用传入的 dataCfg，不会与上次的数据进行合并

```ts
pivotSheet.setDataCfg({ ... }, true)
pivotSheet.render(true) // 重新渲染，且更新数据
```

更新 theme: [可选项](/zh/docs/api/general/S2Theme)

```ts
pivotSheet.setThemeCfg({ ... })
pivotSheet.render(false)  // 重新渲染，不更新数据
```

### 图表渲染不出来，怎么回事？

图表需要挂载在 `dom` 节点上，请确保该节点存在

```html
<div id="container"></div>
```

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

如果传入的是选择器，S2 会使用 [`document.querySelector()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector) 去查找，也就意味着，只要节点存在，且选择器符合 `querySelector` 的语法，都是可以的

```ts
const pivotSheet = new PivotSheet('#container', dataCfg, options);
const pivotSheet = new PivotSheet('.container', dataCfg, options);
const pivotSheet = new PivotSheet('#container > div', dataCfg, options);
const pivotSheet = new PivotSheet('#container > div[title="xx"]', dataCfg, options);
```

### 手动更新表格宽高后，为什么滚动条不显示了？

表格不感知变化，需要更新完配置后调用一次 `render` 方法触发更新

```ts
s2.changeSheetSize(200, 200)
s2.render(false)
```

### 表格可以根据外部容器的宽高自动撑满吗？

可以，请查看 [这篇文章](/zh/docs/manual/advanced/adaptive)

### 如何获取单元格数据？

请查看 [这篇文章](/zh/docs/manual/advanced/get-cell-data)

### 为什么 tooltip 在 `@antv/s2` 中不显示，在 `@antv/s2-react` `@antv/s2-vue` 中可以正常显示？

请查看 [Tooltip 注意事项](/zh/docs/manual/basic/tooltip#%E7%AE%80%E4%BB%8B)

### 如何在 Vue 中自定义 Tooltip

可直接使用 S2 的 Vue3 版本 `@antv/s2-vue`, 或查看 [在 Vue3 中自定义](/zh/docs/manual/basic/tooltip/#在-vue3-中自定义)

### 表格支持导出 `Excel` 吗？

支持，请查看 [这篇文章](/zh/docs/manual/basic/analysis/export), 或者 [示例](/zh/examples/react-component/export#export)

### 表格导出乱码怎么办？

请检查 `Excel` 的编码设置是否正确

![excel](https://gw.alipayobjects.com/zos/antfincdn/G1FBvKgYe/5e4e38fd-cd0d-4d98-b897-b40dd97effdc.png)

### 鼠标滚轮如何进行水平滚动

按住 `Shift` 键的同时滚动鼠标

### S2 有对应的 `Vue` 或者 `Angular` 版本吗？

目前，S2 由三个包构成

- `@antv/s2`: 基于 `canvas` 和 [AntV/G](https://g.antv.vision/zh/docs/guide/introduce) 开发，提供基本的表格展示/交互等能力
- `@antv/s2-react`: 基于 `@antv/s2` 封装，提供配套的分析组件
- `@antv/s2-vue`: 基于 `Vue3` 和 `@antv/s2` 封装，提供配套的分析组件

也就是说 `@antv/s2` 和框架无关，你可以在 `Vue`, `Angular` 等框架中使用。

以下是版本概览：

<embed src="@/docs/common/packages.zh.md"></embed>

配套的 [分析组件](/zh/examples/gallery#category-表格组件)，目前还没有 `@antv/s2-angular` 的开发计划，欢迎社区一起建设 👏🏻.

### 怎样贡献代码？

请查看 [贡献指南](/zh/docs/manual/contribution)

### 为什么在小程序上面表格无法显示？

目前 `S2` 只支持 `web` 平台，小程序暂不支持。

### 为什么我的 Issue 被关闭了？

请严格按照 `Issue 模板` 填写，提供一些**有意义**的信息，包括但不限于：

- 你**实际**安装的版本号：

> 避免 `latest` 或者 `*` 这种没有实际意义的版本号，提供你实际使用的版本可以帮助我们更快的定位问题，有可能你使用的功能在新版本中才支持，或者 bug 在新版本中已经被修复了

- **详细的** bug 描述

> 并不是每个人都了解你这段文字对应的上下文，提供完整的复现步骤，贴上报错截图，gif, 请不要惜字如金

- 你的**复现步骤**, 和可复现链接

> 推荐使用 官方 [codesandbox 模板](https://codesandbox.io/s/29zle) 搭建一些最小的可复现 demo

- 你的**配置信息**, 并且使用 markdown 的 `code` 标签

> 不要贴一大段没格式化过的业务代码，请提供 s2Options s2DataConfig 之类的配置文件，合理的使用 `markdown` 语法，节约大家的时间

- 你的预期是什么？目前的行为是什么？

> 预期是 "没问题", 目前是 "有问题", 这种描述和没说没什么区别，请尽量的描述的具体一点

- 尽量抹去一些带有你自己业务语义的一些名词和描述

在提出问题前，请确保你已经阅读过 [官方文档](/zh/docs/manual/introduction) 和 [常见问题](/zh/docs/manual/faq), 并且已经搜索查阅过相关 [Issues 列表](https://github.com/antvis/S2/issues?q=is%3Aissue+is%3Aclosed)

强烈建议阅读：

- [《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)
- [《如何有效地报告 Bug》](https://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)
- [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
- [《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545)

✅  一个很好的例子：[#852](https://github.com/antvis/S2/issues/852)

❌  一个不好的例子：[#1057](https://github.com/antvis/S2/issues/1057)

### 我想反馈 Bug, 如何提供一个可复现的在线 demo 呢？

推荐使用 `codesandbox`, 我们提供了各种版本的模板，方便你反馈问题。[查看所有模板](https://www.yuque.com/antv/vo4vyz/bam4vz)

## 2. 错误和警告
