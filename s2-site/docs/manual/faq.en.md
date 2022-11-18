---
title: FAQ
order: 8
---

```ts
pivotSheet.setDataCfg({ ... }, true)
pivotSheet.render(true) // re-render and update data
```

Update theme:[optional](#/en/docs/api/general/S2Theme)

```ts
pivotSheet.setThemeCfg({ ... })
pivotSheet.render(false) // re-render without updating data
```

### The chart can't be rendered, what's going on?

The chart needs to be mounted in`dom` node, make sure the node exists

```html
<div id="container"></div>
```

```ts
const pivotSheet = new PivotSheet(document.getElementById('container'), dataCfg, options);
```

If a selector is passed in, S2 will use[`document.querySelector()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector) to find, which means that as long as the node exists and the selector matches`querySelector` syntax is possible

```ts
const pivotSheet = new PivotSheet('#container', dataCfg, options);
const pivotSheet = new PivotSheet('.container', dataCfg, options);
const pivotSheet = new PivotSheet('#container > div', dataCfg, options);
const pivotSheet = new PivotSheet('#container > div[title="xx"]', dataCfg, options);
```

### Why is the scroll bar not displayed after manually updating the width and height of the table?

The form is not aware of changes and needs to be called once after updating the configuration`render` method triggers an update

```ts
s2.changeSheetSize(200, 200)
s2.render(false)
```

### Can the table automatically fill according to the width and height of the outer container?

Yes, please see[This article](#/en/docs/manual/advanced/adaptive)

### How to get cell data?

please check [This article](#/en/docs/manual/advanced/get-cell-data)

### why tooltip is in`@antv/s2` is not displayed in the`@antv/s2-react` `@antv/s2-vue` can be displayed normally?

please check [Tooltip Notes](#/en/docs/manual/basic/tooltip#%E7%AE%80%E4%BB%8B)

### How to Customize Tooltip in Vue

Vue3 version that works directly with S2`@antv/s2-vue`, or view[Customize in Vue3](<#/en/docs/manual/basic/tooltip/#customize in -vue3->)

### Table support export`Excel` ?

support, please see[This article](#/en/docs/manual/basic/analysis/export), or [Example](#/en/examples/react-component/export#export)

### What should I do if the form is exported with garbled characters?

Please check `Excel` Is the encoding setting correct?

![excel](https://gw.alipayobjects.com/zos/antfincdn/G1FBvKgYe/5e4e38fd-cd0d-4d98-b897-b40dd97effdc.png)

### How to scroll horizontally with mouse wheel

press and hold`Shift` key while scrolling the mouse

### S2 has a corresponding`Vue` or `Angular` version?

Currently, S2 consists of three packages

* `@antv/s2`: based on `canvas` and [AntV/G](https://g.antv.vision/zh/docs/guide/introduce) Develop, provide basic table display/interaction capabilities
* `@antv/s2-react`: based on `@antv/s2` package, providing supporting analysis components
* `@antv/s2-vue`: based on `Vue3` and `@antv/s2` package, providing supporting analysis components

That is to say`@antv/s2` Regardless of the framework, you can`Vue`,`Angular` used in other frameworks.

Here is an overview of the versions:

<embed src="@/docs/common/packages.en.md"></embed>

supplementary [Analysis component](<#/en/examples/gallery#category-table component>),not yet `@antv/s2-angular` The development plan of , welcome the community to build together 👏🏻.

### How to contribute code?

please check [Contribution Guidelines](#/en/docs/manual/contribution)

### Why can't the table be displayed on the applet?

Currently `S2` only support`web` Platforms and Mini Programs are not currently supported.

### Why is my issue closed?

Please strictly follow`Issue 模板` fill in, provide some**Significant**information, including but not limited to:

* you**actual**Installed version number:

> avoid `latest` or `*` This kind of meaningless version number, providing the version you actually use can help us locate the problem faster. It is possible that the function you are using is only supported in the new version, or the bug has been fixed in the new version.

* **detailed** bug description

> Not everyone understands the context of your text, provide complete reproduction steps, paste screenshots of error reports, gifs, please don't waste words.

* yours**Steps to reproduce**, and a reproducible link

> It is recommended to use official[codesandbox template](https://codesandbox.io/s/29zle) Build some minimal reproducible demos

* yours**configuration information**, and use markdown's`code` Label

> Do not post a large piece of unformatted business code, please provide configuration files such as s2Options s2DataConfig and use them reasonably`markdown` Grammar, save everyone's time

* What are your expectations? What is the current behavior?

> Expected to be "no problem", currently it is "problem", this description is no different from not saying, please try to be as specific as possible

* Try to erase some nouns and descriptions with your own business semantics

Before asking a question, please make sure you have read[official documentation](#/en/docs/manual/introduction) and [common problem](#/en/docs/manual/faq), and have searched for related[Issues list](https://github.com/antvis/S2/issues?q=is%3Aissue+is%3Aclosed)

Highly recommended reading:

* [How to Submit Unanswered Questions to Open Source Projects](https://zhuanlan.zhihu.com/p/25795393)
* ["How to Report Bugs Effectively"](https://www.chiark.greenend.org.uk/~sgtatham/bugs-cn.html)
* ["The Wisdom of Asking"](https://github.com/ryanhanwu/How-To-Ask-Questions-The-Smart-Way)
* ["How to Ask Questions to the Open Source Community"](https://github.com/seajs/seajs/issues/545)

✅ A good example:[#852](https://github.com/antvis/S2/issues/852)

❌ A bad example:[#1057](https://github.com/antvis/S2/issues/1057)

### I want to report bugs, how to provide a reproducible online demo?

Recommended Use `codesandbox`, We provide various versions of the template to facilitate your feedback.[view all templates](https://www.yuque.com/antv/vo4vyz/bam4vz)

## 2. Errors and Warnings
