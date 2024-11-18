---
title: 常见问题
order: 8
---

:::warning{title="一些建议"}
**在提出问题前，请确保你已经仔细阅读了一遍文档，查看了相关图表示例，并且已经查看了常见问题和 Issues。**
:::

## 1. 使用问题

### 浏览器兼容性

<embed src="@/docs/common/env.zh.md"></embed>

### 浏览器引入

<embed src="@/docs/common/browser.zh.md"></embed>

### 官网访问有点慢，或打不开，有国内镜像吗？

原国内镜像 [https://antv-s2.gitee.io](https://antv-s2.gitee.io/) 和 旧版官网 [https://s2.antv.vision](https://s2.antv.vision) 不再维护，请访问新版官网 [https://s2.antv.antgroup.com](https://s2.antv.antgroup.com/) 速度更快。

- [旧版官网](https://s2.antv.vision/)
- [新版官网](https://s2.antv.antgroup.com/)

### 目前官网是 2.x 版本，在哪里查看 1.x 版本的文档？

官网右上角可以切换文档版本：

- [2.x 官网](https://s2.antv.antgroup.com/)
- [1.x 官网](https://s2-v1.antv.antgroup.com/)

### 父级元素使用了 `transform: scale` 后，图表鼠标坐标响应不正确

可以开启 [AntV/G](https://g.antv.antgroup.com/api/canvas/options#supportscsstransform) 渲染引起的 `supportsCSSTransform` 属性

```ts
const s2Options = {
  transformCanvasConfig() {
    return {
      supportsCSSTransform: true
    }
  }
}
```

也可以手动调用 `s2.changeSheetSize` 根据缩放比改变图表大小，使图表和父元素缩放比保持一致

```ts
const scale = 0.8
s2.changeSheetSize(width * scale, height * scale)
await s2.render(false)
```

可参考 issue [#808](https://github.com/antvis/S2/issues/808) [#990](https://github.com/antvis/S2/pull/990) （感谢 [@cylnet](https://github.com/cylnet) [@xiaochong44](https://github.com/xiaochong44))

### 如何更新表格配置？

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

更新 options: [可选项](/api/general/s2-options)，会与上次的数据进行合并

```ts
pivotSheet.setOptions({ ... })
await pivotSheet.render(false) // 重新渲染，不更新数据
```

重置 options: [可选项](/api/general/s2-options)，直接使用传入的 option，不会与上次的数据进行合并

```ts
pivotSheet.setOptions({ ... }, true)
await pivotSheet.render(false) // 重新渲染，不更新数据
```

更新 dataCfg: [可选项](/api/general/s2-data-config)，会与上次的数据进行合并

```ts
pivotSheet.setDataCfg({ ... })
await pivotSheet.render(true) // 重新渲染，且更新数据
```

重置 dataCfg: [可选项](/api/general/s2-data-config)，直接使用传入的 dataCfg，不会与上次的数据进行合并

```ts
pivotSheet.setDataCfg({ ... }, true)
await pivotSheet.render(true) // 重新渲染，且更新数据
```

更新 theme: [可选项](/api/general/s2-theme)

```ts
pivotSheet.setThemeCfg({ ... })
await pivotSheet.render(false)  // 重新渲染，不更新数据
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
await s2.render(false)
```

### 表格可以根据外部容器的宽高自动撑满吗？

可以，请查看 [这篇文章](/manual/advanced/adaptive)

### 如何获取单元格数据？

请查看 [这篇文章](/manual/advanced/get-cell-data) 和 [示例](/examples/analysis/get-data/#get-cell-data)

### 为什么 Tooltip 在 `@antv/s2` 中不显示，在 `@antv/s2-react` `@antv/s2-vue` 中可以正常显示？

请查看 [Tooltip 注意事项](/manual/basic/tooltip#%E7%AE%80%E4%BB%8B)

### 如果在 `@antv/s2` 中使用 tooltip ?

请查看 [Tooltip 文档](/manual/basic/tooltip) 和 [示例](/examples/react-component/tooltip/#custom-content-base)

### 如何在点击或悬停单元格的时候自定义 Tooltip?

请查看相关文档和示例

- [Tooltip 自定义教程](https://s2.antv.antgroup.com/manual/basic/tooltip#%E8%87%AA%E5%AE%9A%E4%B9%89)
- [自定义点击显示 Tooltip](/examples/react-component/tooltip/#custom-click-show-tooltip)
- [自定义悬停显示 Tooltip](/examples/react-component/tooltip/#custom-hover-show-tooltip)

### 如何在 Tooltip 里自定义操作项？

- 方式 1: 默认 tooltip 内容不变，通过 [自定义操作项](https://s2.antv.antgroup.com/zh/examples/react-component/tooltip/#custom-operation), 在内容上方增加自定义操作菜单。
- 方式 2: 通过 [自定义 Tooltip 内容](https://s2.antv.antgroup.com/zh/examples/react-component/tooltip/#custom-content), 完全自定义组件内容。

### React 组件，自定义显示 tooltip 后，内容未更新怎么回事？

当手动调用实例方法 `s2.showTooltip` 时，如果内容是一个 React 自定义组件，且组件内容未更新时，可以尝试声明 `forceRender` 强制更新组件内容

```ts
s2.showTooltip({
  content: <YourComponent props={"A"}/>
})

s2.showTooltip({
  content: <YourComponent props={"B"} />
  options: {
    forceRender: true
  }
})
```

相关 issue: <https://github.com/antvis/S2/issues/1716>

### 使用 React 组件，Tooltip 莫名其妙被隐藏，不展示了？

```tsx
<SheetComponent options={options} dataCfg={dataCfg}/>
```

- `场景 1`: 当组件重新渲染，或者配置项更新后，组件会 [更新 S2 底表的配置](https://github.com/antvis/S2/blob/next/packages/s2-react/src/hooks/useSpreadSheet.ts#L111), 会触发 [隐藏 Tooltip 的逻辑](https://github.com/antvis/S2/blob/next/packages/s2-core/src/sheet-type/spread-sheet.ts#L381), 请检查并尽量避免你的`上层组件更新`, 或者`配置项的引用被改变` 所导致的 `SheetComponent` 无意义的重渲染。

- `场景 2`: S2 默认点击非表格区域，会隐藏 tooltip, 还原交互状态，请确保你自己的业务逻辑有无相应的 `click` 事件，看是否有被冒泡影响，尝试阻止冒泡

```ts
event.stopPropagation()
```

- `场景 3`: 手动调用 `s2.showTooltip` 展示 tooltip 后，点击内部的某个元素后，再次展示第二个 tooltip, 这个时候 tooltip 被隐藏，和场景 2 类似，请给 `click` 事件增加冒泡处理。

```ts
// 菜单 1-1 => click

s2.showTooltip({ ... })

// 菜单 1-1 => click
event.stopPropagation()
s2.showTooltip({ ... })
```

### 如何在 Vue 中自定义 Tooltip?

可直接使用 S2 的 Vue3 版本 `@antv/s2-vue`, 或查看 [在 Vue3 中自定义](/manual/basic/tooltip/#在-vue3-中自定义)

### 表格支持导出 `Excel` 吗？

支持，请查看 [这篇文章](/manual/basic/analysis/export), 或者 [示例](/examples/react-component/export#export)

### 表格导出乱码怎么办？

请检查 `Excel` 的编码设置是否正确

![excel](https://gw.alipayobjects.com/zos/antfincdn/G1FBvKgYe/5e4e38fd-cd0d-4d98-b897-b40dd97effdc.png)

### 表格导出后数据没有正确按格子分隔怎么办？

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*IfmPQo7qieAAAAAAAAAAAAAADmJ7AQ/original" width="900" alt="现象">

请检查 `Excel` 的分隔符设置是否正确

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*OTz2Toh9H6EAAAAAAAAAAAAADmJ7AQ/original" height="500" alt="excel">

### 鼠标滚轮如何进行水平滚动？

按住 `Shift` 键的同时滚动鼠标

### 如何自定义文字的大小和对齐方式？

可以配置自定义主题，查看 [使用文档](/manual/basic/theme) 和 [示例](/examples/theme/custom#custom-manual-palette)

### 如何自定义单元格宽高？

请查看 [使用文档](/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E5%88%97%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) 和 [示例](/examples/gallery#category-%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E5%88%97%E5%AE%BD%E9%AB%98)

### 如何关闭 hover 单元格出现的黑色边框？

![preview](https://gw.alipayobjects.com/zos/antfincdn/nDIO0OG8fv/4ff6613f-fad3-4ea6-9473-0161509f692c.png)

边框属于 `聚焦 (hoverFocus)` 交互状态的一种，可通过 [主题配置 - 交互通用主题](https://s2.antv.antgroup.com/api/general/s2-theme#interactionstatename) 关闭。

```ts
s2.setTheme({
  dataCell: {
    cell: {
      interactionState: {
        hoverFocus: {
          // 边框设置为透明
          borderColor: 'transparent'
          // 或者边框透明度设置为 0
          // borderOpacity: 0
        }
      }
    }
  }
})
```

### 如何修改选中，悬停，刷选等单元格交互主题配置？

请 [查看文档](/manual/advanced/interaction/basic#%E8%B0%83%E6%95%B4%E4%BA%A4%E4%BA%92%E4%B8%BB%E9%A2%98) 和 [示例](/zh/examples/interaction/basic#state-theme)

### S2 支持对表格进行编辑吗？

请查看 [编辑模式示例](/examples/case/data-preview#excel) 和 [编辑表示例](https://s2.antv.antgroup.com/examples/react-component/sheet/#editable)

目前只有 React 版本 `@antv/s2-react` 支持编辑表格，其他版本暂不支持，需参考 [源码](https://github.com/antvis/S2/blob/2d85d5739f5a3a52e92df699a935df93aa2a6a73/packages/s2-react/src/components/sheets/editable-sheet/index.tsx#L10) 自行实现

### 如何注册 `AntV/G` 渲染引擎的插件/初始化参数？

了解 `AntV/G` [初始化参数](https://g.antv.antgroup.com/api/canvas/options) 和 [插件系统](https://g.antv.antgroup.com/plugins/intro).

```ts
import { Plugin as PluginA11y } from '@antv/g-plugin-a11y';

const s2Options = {
  transformCanvasConfig(renderer) {
    // 修改配置
    renderer.setConfig({
      enableCulling: true,
      enableDirtyCheck: true,
    });
    // 注册插件
    renderer.registerPlugin(
      new PluginA11y({
        enableExtractingText: true,
      }),
    );

    console.log('当前已注册插件：', renderer.getPlugins(), renderer.getConfig());

    // 透传 G 的初始化参数：https://g.antv.antgroup.com/api/canvas/options
    return {
      supportsCSSTransform: true,
      devicePixelRatio: 2,
      dblClickSpeed: 500,
      cursor: 'crosshair',
    };
  },
}
```

### 禁用右键菜单不生效？

表格内部监听 `G` 的 `rightup/rightdown` 事件，而不是 `<canvas/>` DOM 的 `contextmenu` 事件，因此默认行为**并不是弹出右键系统菜单**，所以 `event.preventDefault()` 无效：

```ts | pure
// ❌ 无效写法
s2.on(S2Event.GLOBAL_CONTEXT_MENU, (event) => {
  event.preventDefault();
})

// ✅ 正确写法
s2.getCanvasElement().addEventListener('contextmenu', (event) => {
  event.preventDefault();
});
```

[了解更多](https://g.antv.antgroup.com/api/event/faq#%E7%A6%81%E7%94%A8%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95)

### 使用 `customSVGIcons` 注册自定义图标，在字段标记中使用，无法修改颜色？

`在线链接` 不支持修改颜色，推荐使用 `本地文件` 或者 `字符串`.

```diff | pure
+ import Icon from '/path/to/icon.svg'

const s2Options = {
  customSVGIcons: [
    {
      name: 'CustomIcon',
      // 1. 字符串（支持自定义颜色）
+     src: `<?xml version="1.0" encoding="UTF-8"?><svg t="1634603945212" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="558" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200" fill="currentColor"><defs><style type="text/css"></style></defs><path d="M605.61 884.79h-24.26c-21.34 0-38.66 17.32-38.66 38.66 0 21.34 17.32 38.66 38.66 38.66h24.26c21.34 0 38.66-17.32 38.66-38.66 0-21.35-17.32-38.66-38.66-38.66z" fill="#040000" p-id="559"></path><path d="M950.47 419.76c-22.17-15.48-51.17-16.01-73.92-1.33L715.7 522.53 573.09 223.42c-10.95-22.98-33.55-37.43-58.97-37.75h-0.85c-25.09 0-47.67 13.84-59.05 36.29L302.25 521.82 154.9 419.61c-22-15.18-50.71-15.73-73.27-1.46-22.53 14.32-34.23 40.57-29.8 66.9l70.9 421.76c5.33 32.04 32.82 55.3 65.31 55.3h272.43c21.34 0 38.66-17.32 38.66-38.66 0-21.34-17.32-38.66-38.66-38.66H197.44l-64.99-386.62 136.17 94.46a66.14 66.14 0 0 0 54.01 9.79 66.097 66.097 0 0 0 42.81-34.28l147.54-291.11 138.35 290.2c8.21 17.19 23.41 30.03 41.76 35.19 18.37 5.24 38 2.21 53.99-8.1l148.62-96.17-87.74 386.65h-60.1c-21.34 0-38.66 17.32-38.66 38.66 0 21.34 17.32 38.66 38.66 38.66h68.96c31.16 0 57.71-21.22 64.58-51.57l95.72-421.86c5.97-26.39-4.47-53.42-26.65-68.93zM514.74 151.68c28.08 0 50.85-22.76 50.85-50.85s-22.77-50.85-50.85-50.85c-28.09 0-50.85 22.76-50.85 50.85s22.77 50.85 50.85 50.85zM973.15 277.37c-28.08 0-50.85 22.77-50.85 50.85 0 28.09 22.76 50.85 50.85 50.85 28.08 0 50.85-22.76 50.85-50.85 0-28.08-22.77-50.85-50.85-50.85zM101.69 328.22c0-28.08-22.76-50.85-50.85-50.85S0 300.14 0 328.22c0 28.09 22.76 50.85 50.85 50.85s50.84-22.77 50.84-50.85z" fill="#040000" p-id="560"></path></svg>`,

      // 2. 本地文件（支持自定义颜色，本质上也是字符串）
+     src: Icon,

      // 3. 在线链接（不支持自定义颜色）
-     src: 'https://gw.alipayobjects.com/zos/bmw-prod/f44eb1f5-7cea-45df-875e-76e825a6e0ab.svg',
    },
  ],
  conditions: {
    icon: [
      {
        field: 'number',
        mapping(fieldValue, data) {
          return {
            icon: 'CustomIcon',
+           fill: '#30BF78',
          };
        },
      }
    ],
  }
}
```

### 自定义单元格后绘制图片，滚动表格时图片重复加载并造成闪烁？

1. G 的 [Image 图形](https://g.antv.antgroup.com/api/basic/image#src) 支持传入图片地址字符串，内部会缓存起来，无需创建 [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image), 适用于固定的宽高等场景。

```ts | pure
import { Image as GImage } from '@antv/g';

class CustomColCell extends ColCell {
  drawBackgroundShape() {
    new GImage({
      style: {
        x: 200,
        y: 100,
        width: 200,
        height: 200,
        src: 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png',
      },
    })
  }
}
```

2. 如果图片宽高未知，则可以创建 [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) 后再添加 G 的 [Image 图形](https://g.antv.antgroup.com/api/basic/image#src), 此时需要手动增加缓存，避免图片重复加载

```ts | pure
const ImageCache = new Map<string, HTMLImageElement>();

class CustomColCell extends ColCell {
  drawBackgroundShape() {
    const url = 'https://gw.alipayobjects.com/zos/antfincdn/og1XQOMyyj/1e3a8de1-3b42-405d-9f82-f92cb1c10413.png'

    const imgCache = ImageCache.get(url)
    if (imgCache) {
      this.appendChild(
        new GImage({
          style: {
            x: 200,
            y: 100,
            width: imgCache.width,
            height: imgCache.height,
            src: imgCache
          },
        })
      )
      return;
    }

    const img = new Image();
    img.src = url
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // 图片加载成功后创建
      this.appendChild(
        new GImage({
          style: {
            x: 200,
            y: 100,
            width: img.width,
            height: img.height,
            src: img
          },
        })
      )
    };
  }
}
```

请查看 [自定义特定单元格](/examples/custom/custom-cell#custom-specified-cell) 示例。

### S2 有对应的 `Vue` 或者 `Angular` 版本吗？如何获取新版本发布通知？

<embed src="@/docs/common/packages.zh.md"></embed>

配套的 [分析组件](/manual/basic/analysis/editable-mode)，目前还没有 `@antv/s2-angular` 的开发计划，欢迎社区一起建设 👏🏻.

### 如何贡献代码？

请查看 [贡献指南](/manual/contribution)

### 为什么在小程序上面表格无法显示？

目前 `S2` 只支持 `web` 平台，小程序暂不支持。

### 为什么我的 Issue 被关闭了？

请阅读 [提 Issue 前必读](https://github.com/antvis/S2/issues/1904), 并严格按照 `Issue 模板` 填写，提供一些**有意义**的信息，包括但不限于：

- 你**实际**安装的版本号：

> 避免 `latest`, `next` 或者 `*` 这种没有实际意义的版本号，提供你实际使用的版本可以帮助我们更快的定位问题，有可能你使用的功能在新版本中才支持，或者 bug 在新版本中已经被修复了

- **详细的** bug 描述

> 并不是每个人都了解你这段文字对应的上下文，提供完整的复现步骤，贴上报错截图，gif, 请不要惜字如金

- 你的**复现步骤**, 和可复现链接

> 推荐使用 官方 [codesandbox 模板](https://codesandbox.io/s/29zle) 搭建一些最小的可复现 demo

- 你的**配置信息**, 并且使用 markdown 的 `code` 标签

> 不要贴一大段没格式化过的业务代码，请提供 s2Options s2DataConfig 之类的配置文件，合理的使用 `markdown` 语法，节约大家的时间

- 你的预期是什么？目前的行为是什么？

> 预期是 "没问题", 目前是 "有问题", 这种描述和没说没什么区别，请尽量的描述的具体一点，如：`数据不正确：预期应该是 xx, 实际是 xx. 布局错误：节点应该显示在行头，实际出现在了列头。`

- 尽量抹去一些带有你自己业务语义的一些名词和描述

在提出问题前，请确保你已经阅读过 [官方文档](/manual/introduction) 和 [常见问题](/manual/faq), 并且已经搜索查阅过相关 [Issues 列表](https://github.com/antvis/S2/issues?q=is%3Aissue+is%3Aclosed).

强烈建议阅读：

- [《如何向开源项目提交无法解答的问题》](https://zhuanlan.zhihu.com/p/25795393)
- [《如何有效地报告 Bug》](https://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)
- [《提问的智慧》](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
- [《如何向开源社区提问题》](https://github.com/seajs/seajs/issues/545)

✅  一个很好的示例：[#852](https://github.com/antvis/S2/issues/852)

❌  一个不好的示例：[#1057](https://github.com/antvis/S2/issues/1057)

### 我想反馈 Bug, 如何提供一个可复现的在线 demo 呢？

推荐使用 `codesandbox`, 我们提供了各种版本的模板，方便你反馈问题。[查看所有模板](https://www.yuque.com/antv/vo4vyz/bam4vz)

## 2. 错误和警告
