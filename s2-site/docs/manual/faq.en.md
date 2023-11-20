---
title: FAQ
order: 8
---

**Before asking a question, it is recommended to read the documentation carefully.**

## 1. Problems of use

### browser compatibility

If there is a compatibility problem, please use it in combination with `babel` and `@babel/polyfill` . More questions are welcome to enter the group exchange

> Due to limited conditions, the lower limit of the version is for reference only, and it does not mean that lower versions cannot be supported. The test was completed in CDN mode, and the [online Demo](https://lxfu1.github.io/browser-compatibility-of-antv/?tab=s2)

|             | Chrome | Edge | firefox |  IE | opera | Safari |  UC | 360 speed browser | 360 Safe Browser |
| ----------- | :----: | :--: | :-----: | :-: | :---: | :----: | :-: | :---------------: | :--------------: |
| **AntV S2** |   40   |  12  |    85   |  9  |   40  |   14   | 6.2 |         12        |        7.3       |

`@antv/s2-react` and `@antv/s2-vue` see official [React JavaScript environment requirements](https://zh-hans.reactjs.org/docs/javascript-environment-requirements.html) and [Vite browser compatibility](https://cn.vitejs.dev/guide/build.html#browser-compatibility)

### browser introduction

<embed src="@/docs/common/browser.en.md"></embed>

### The access to the official website is a bit slow, or it cannot be opened. Is there a domestic mirror?

The original domestic mirror [https://antv-s2.gitee.io](https://antv-s2.gitee.io/) is no longer maintained. It is recommended to visit the new official website [https://s2.antv.antgroup.com](https://s2.antv.antgroup.com/) for faster speed.

[Old official](https://s2.antv.vision/) website New [official website](https://s2.antv.antgroup.com/)

### After the parent element uses `transform: scale` , the mouse coordinates of the chart respond incorrectly

`supportsCSSTransform` property can be turned on

```ts
const s2Options = {
  transformCanvasConfig() {
    return {
      supportsCSSTransform: true
    }
  }
}
```

You can also manually call `s2.changeSheetSize` to change the size of the chart according to the zoom ratio, so that the zoom ratio of the chart and the parent element are consistent

```ts
const scale = 0.8
s2.changeSheetSize(width * scale, height * scale)
s2.render(false)
```

Please refer to issue [#808](https://github.com/antvis/S2/issues/808) [#990](https://github.com/antvis/S2/pull/990) (thanks to [@cylnet](https://github.com/cylnet) [@xiaochong44](https://github.com/xiaochong44) )

### How to update table configuration?

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

Update options: [optional](/docs/api/general/S2Options) , will be merged with the last data

```ts
pivotSheet.setOptions({ ... })
pivotSheet.render(false) // 重新渲染，不更新数据
```

Reset options: [optional, use the incoming options](/docs/api/general/S2Options) directly, and will not merge with the last data

```ts
pivotSheet.setOptions({ ... }, true)
pivotSheet.render(false) // 重新渲染，不更新数据
```

Update dataCfg: [optional](/docs/api/general/S2DataConfig) , it will be merged with the last data

```ts
pivotSheet.setDataCfg({ ... })
pivotSheet.render(true) // 重新渲染，且更新数据
```

Reset dataCfg: [optional](/docs/api/general/S2DataConfig) , use the incoming dataCfg directly without merging with the last data

```ts
pivotSheet.setDataCfg({ ... }, true)
pivotSheet.render(true) // 重新渲染，且更新数据
```

update theme: [optional](/docs/api/general/S2Theme)

```ts
pivotSheet.setThemeCfg({ ... })
pivotSheet.render(false)  // 重新渲染，不更新数据
```

### The graph cannot be rendered, what's the matter?

The chart needs to be mounted on the `dom` node, please make sure the node exists

```html
<div id="container"></div>
```

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

If the input is a selector, S2 will use [`document.querySelector()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector) to find it, which means that as long as the node exists and the selector conforms to the syntax of `querySelector` , it is all possible

```ts
const pivotSheet = new PivotSheet('#container', dataCfg, options);
const pivotSheet = new PivotSheet('.container', dataCfg, options);
const pivotSheet = new PivotSheet('#container > div', dataCfg, options);
const pivotSheet = new PivotSheet('#container > div[title="xx"]', dataCfg, options);
```

### After manually updating the width and height of the table, why is the scroll bar not displayed?

The table is not aware of changes, and the `render` method needs to be called once after the configuration is updated to trigger the update

```ts
s2.changeSheetSize(200, 200)
s2.render(false)
```

### Can the table be filled automatically according to the width and height of the outer container?

Yes, please review [this article](/docs/manual/advanced/adaptive)

### How to get cell data?

Please check [this article](/docs/manual/advanced/get-cell-data)

### Why is the tooltip not displayed in @antv/ `@antv/s2` , but it can be displayed normally in `@antv/s2-react` `@antv/s2-vue` ?

Please see [Tooltip Notes](/docs/manual/basic/tooltip#%E7%AE%80%E4%BB%8B)

### How to customize Tooltip in Vue?

You can directly use the Vue3 version of S2 `@antv/s2-vue` , or see [Customize in Vue3](/docs/manual/basic/tooltip/#%E5%9C%A8-vue3-%E4%B8%AD%E8%87%AA%E5%AE%9A%E4%B9%89)

### Does the table support exporting to `Excel` ?

Support, please check [this article](/docs/manual/basic/analysis/export) , or [example](/examples/react-component/export#export)

### What should I do if the table is exported with garbled characters?

Please check whether the encoding setting of `Excel` is correct

![excel](https://gw.alipayobjects.com/zos/antfincdn/G1FBvKgYe/5e4e38fd-cd0d-4d98-b897-b40dd97effdc.png)

### How does the mouse wheel scroll horizontally?

Hold down the `Shift` key while scrolling the mouse

### How to customize the size and alignment of text?

You can configure custom themes, see [documentation](/docs/manual/basic/theme) and [examples](/examples/theme/custom#custom-manual-palette)

### How to customize cell width and height?

Check out [the usage docs](/docs/manual/advanced/custom/cell-size#%E8%B0%83%E6%95%B4%E5%88%97%E5%A4%B4%E5%8D%95%E5%85%83%E6%A0%BC%E5%AE%BD%E9%AB%98) and [examples](/examples/gallery#category-%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%8C%E5%88%97%E5%AE%BD%E9%AB%98)

### Does S2 support editing of tables?

Please see [edit mode example](/examples/case/data-preview#excel)

### Does S2 have a corresponding `Vue` or `Angular` version?

Currently, S2 consists of three packages

* `@antv/s2` : Developed based on `canvas` and [AntV/G](https://g.antv.vision/zh/docs/guide/introduce) , providing basic table display/interaction capabilities
* `@antv/s2-react` : Based on the `@antv/s2` package, it provides supporting analysis components
* `@antv/s2-vue` : Based on `Vue3` and `@antv/s2` package, provide supporting analysis components

That is to say, `@antv/s2` **has nothing to do with the framework** , you can use it in `Vue` , `Angular` and other frameworks.

Here is an overview of the releases:

<embed src="@/docs/common/packages.en.md"></embed>

Supporting [analysis components](/examples/gallery#category-%E8%A1%A8%E6%A0%BC%E7%BB%84%E4%BB%B6) , currently there is no development plan for `@antv/s2-angular` , the community is welcome to build together 👏🏻.

### How to contribute code?

Please review the [contribution guidelines](/docs/manual/contribution)

### Why can't the form be displayed on the applet?

At present, `S2` only supports the `web` platform, and the applet does not support it for the time being.

### Why is my Issue closed?

Please read [the must-read before submitting an Issue](https://github.com/antvis/S2/issues/1904) , and fill in strictly according to the `Issue 模板`, providing some **meaningful** information, including but not limited to:

* The version number you **actually** installed:

> Avoid meaningless version numbers like `latest` or `*` . Providing the version you actually use can help us locate the problem faster. It is possible that the function you are using is only supported in the new version, or the bug has been fixed in the new version up

* **Detailed** bug description

> Not everyone understands the context of your text, provide complete steps to reproduce, post error screenshots, gif, please don’t waste words like gold

* Your **steps** to reproduce, and links to reproduce

> It is recommended to use the official [codesandbox template](https://codesandbox.io/s/29zle) to build some minimal reproducible demos

* Your **configuration information** , and use markdown `code` tags

> Do not post a large section of unformatted business code, please provide configuration files such as s2Options s2DataConfig, and use `markdown` syntax reasonably to save everyone's time

* What are your expectations? What is the current behavior?

> It is expected to be "no problem", but currently it is "problem". This description is no different from what you said. Please try to be as specific as possible. For example: the`数据不正确：预期应该是 xx, 实际是 xx. 布局错误：节点应该显示在行头，实际出现在了列头。`

* Try to erase some nouns and descriptions with your own business semantics

Before asking a question, please make sure you have read the [official documentation](/docs/manual/introduction) and [FAQ](/docs/manual/faq) , and have searched and checked the related [Issues list](https://github.com/antvis/S2/issues?q=is%3Aissue+is%3Aclosed) .

Highly recommended reading:

* [How to Submit Unanswered Questions to Open Source Projects](https://zhuanlan.zhihu.com/p/25795393)
* ["How to Report Bugs Effectively"](https://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)
* ["The Wisdom of Questioning"](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
* ["How to Ask Questions to the Open Source Community"](https://github.com/seajs/seajs/issues/545)

✅ A great example: [#852](https://github.com/antvis/S2/issues/852)

❌ A bad example: [#1057](https://github.com/antvis/S2/issues/1057)

### I want to report a bug, how can I provide a reproducible online demo?

It is recommended to use `codesandbox` , we provide various versions of templates for your convenience. [view all templates](https://www.yuque.com/antv/vo4vyz/bam4vz)

### Is there a discussion group?

<embed src="@/docs/common/contact-us.en.md"></embed>

## 2. Errors and Warnings
