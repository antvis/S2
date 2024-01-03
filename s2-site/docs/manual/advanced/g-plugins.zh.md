---
title: 注册 AntV/G 插件
order: 10
tag: New
---

:::warning{title='提示'}
阅读本章前，请确保已经对 S2 足够了解，并且熟悉 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎的相关内容。
:::

S2 基于 [`AntV/G`](https://g.antv.antgroup.com/) 渲染引擎绘制，因此可以共享其丰富的插件生态。

<Playground path="custom/custom-plugins/demo/a11y.ts" rid='a11y' height='300'></playground>

## 插件系统介绍

请阅读 [G 插件系统介绍](https://g.antv.antgroup.com/plugins/intro) 相关章节。

## 使用

S2 提供 `transformCanvasConfig` 用于访问 `G` 的上下文，用于 [注册插件](https://g.antv.antgroup.com/plugins/intro) 和透传相关 [配置参数](https://g.antv.antgroup.com/api/canvas/options), 由于 `Canvas` 的弊端，内部的文字不可被浏览器搜索，为了更友好实现无障碍功能，我们可以使用 `@antv/g-plugin-a11y` 插件

```ts
import { PivotSheet } from '@antv/s2';
import { Plugin as PluginA11y } from '@antv/g-plugin-a11y';

const s2Options = {
  transformCanvasConfig(renderer) {
    renderer.registerPlugin(
      new PluginA11y({
        enableExtractingText: true,
      }),
    );

    console.log('当前已注册插件：', renderer.getPlugins(), renderer.getConfig());

    return {
      // 是否支持在容器上应用 CSS Transform 的情况下确保交互事件坐标转换正确
      supportsCSSTransform: true,
      devicePixelRatio: 2,
      cursor: 'crosshair',
    };
  }
};

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.render();
```

## 效果

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HIhnRq9EqIwAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview"/>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ag6SSYgDpeYAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview"/>
