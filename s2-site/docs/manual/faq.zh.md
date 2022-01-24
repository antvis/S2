---
title: 常见问题
order: 8
---

**在提出问题前，建议仔细阅读一遍文档。**

## 1. 使用问题

### 性能问题

使用 [`S2`](https://github.com/antvis/S2) 过程中，如果出现性能问题，比如渲染时间长，浏览器无响应等，可能原因如下：

- 数据量大。正常 `1w` 数据渲染时间是 `150ms`，`100w` 数据渲染时间是 `4s`，数据超过 `100w` 感受会比较明显，详见 [性能介绍](/zh/docs/manual/advanced/performance)。
- 属性频繁变化。比如 `<SheetComponent />` 组件中，`options`、`dataCfg`等属性的引用频繁变化，每一次变化都会重新计算布局和渲染，因此属性改变时建议使用新的数据对象，避免重复渲染，[更多了解](https://zh-hans.reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data)。

   举个例子：

   ```ts
   // bad
   options.hierarchyType = 'tree';

   // good
   const newOptions = Object.assign({}, options, { hierarchyType: 'tree' });
   ```

   此外，当处理深层嵌套对象时，以 immutable （不可变）的方式更新它们，帮助你编写高可读性、高性能的代码。

### 浏览器兼容性

如果出现兼容性问题请结合 `babel` 和 `@babel/polyfill` 使用，更多问题欢迎进群交流

> 由于条件限制，版本下限仅供参考，并不意味着不能支持更低版本，该测试在 CDN 模式下测试完成，[在线 Demo](https://lxfu1.github.io/browser-compatibility-of-antv/?tab=s2)

|        | Chrome | Edge | Firefox | IE  | Opera | Safari | UC  | 360 极速浏览器 | 360 安全浏览器 |
| ------ | :----: | :--: | :-----: | :-: | :---: | :----: | :-: | :------------: | :------------: |
| **AntV S2** |   40   |  12  |   85    |  9  |  40   |   14   |   6.2   |    12    |   7.3     |

### 浏览器引入

我们提供了 `dist` 目录的 `umd` 编译文件，引入 `dist/index.min.js` , 可访问全局变量 `window.S2`

```ts
<script src="./dist/index.min.js"></script>
<script>
   const s2 = new window.S2.PivotSheet(container, s2DataConfig, s2options);
   s2.render();
</script>
```

如果使用的是 `React` 版本 `@antv/s2-react`, 还需额外引入样式文件

```html
<link rel="stylesheet" href="./dist/style.min.css"/>
```

也可以直接使用 CDN, 比如 [UNPKG](https://unpkg.com/@antv/s2@latest) 或者 [![preview](https://data.jsdelivr.com/v1/package/npm/@antv/s2/badge)](https://www.jsdelivr.com/package/npm/@antv/s2)

```js
<script src="https://unpkg.com/@antv/s2@latest/dist/index.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@antv/s2-react@latest/dist/style.min.css"/>
```

### 官网访问有点慢，或打不开，有国内镜像吗？

有，国内镜像部署在 `gitee` 上面 [点击访问](https://antv-s2.gitee.io/)

### 父级元素使用了 `transform: scale` 后，图表鼠标坐标响应不正确

可以开启 `supportCSSTransform` 属性

```ts
const s2Options = {
   supportCSSTransform: true
}
```

也可以手动调用 `s2.changeSize` 根据缩放比改变图表大小，使图表和父元素缩放比保持一致

```ts
const scale = 0.8
s2.changeSize(width * scale, height * scale)
s2.render(false)
```

可参考 issue [#808](https://github.com/antvis/S2/issues/808) [#990](https://github.com/antvis/S2/pull/990) （感谢 [@cylnet](https://github.com/cylnet) [@xiaochong44](https://github.com/xiaochong44))

### 如何更新表格配置？

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

更新 options: [可选项](https://s2.antv.vision/zh/docs/api/general/S2Options)

```ts
pivotSheet.setOptions({ ... })
pivotSheet.render(false) // 重新渲染，不更新数据
```

更新 dataCfg: [可选项](https://s2.antv.vision/zh/docs/api/general/S2DataConfig)

```ts
pivotSheet.setDataCfg({ ... })
pivotSheet.render(true) // 重新渲染，且更新数据
```

更新 theme: [可选项](https://s2.antv.vision/zh/docs/api/general/S2Theme)

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
s2.changeSize(200, 200)
s2.render(false)
```

### 表格可以根据外部容器的宽高自动撑满吗？

可以，请查看 [这篇文章](/zh/docs/manual/advanced/adaptive)

### 表格支持导出 `Excel` 吗？

支持，请查看 [这篇文章](/zh/docs/manual/basic/analysis/export), 或者 [示例](/zh/examples/react-component/export#export)

### 表格导出乱码怎么办？

请检查 `Excel` 的编码设置是否正确

![excel](https://gw.alipayobjects.com/zos/antfincdn/G1FBvKgYe/5e4e38fd-cd0d-4d98-b897-b40dd97effdc.png)

### S2 有对应的 `Vue` 或者 `Angular` 版本吗？

目前，S2 由两个包构成

- `@antv/s2`: 基于 `canvas` 开发，提供表格渲染
- `@antv/s2-react`: 基于 `@antv/s2` 封装，提供配套的分析组件

也就是说 `@antv/s2` 和框架无关，你可以在 `Vue`, `Angular` 等框架中使用。

配套的 [分析组件](/zh/examples/react-component), 目前还没有 `@antv/s2-vue`, `@antv/s2-angular` 的开发计划，欢迎社区一起建设 👏🏻.

### 怎样贡献代码？

请查看 [贡献指南](https://s2.antv.vision/zh/docs/manual/contribution)

### 为什么在小程序上面表格无法显示？

目前 `S2` 只支持 `web` 平台，小程序暂不支持。

## 2. 错误和警告
