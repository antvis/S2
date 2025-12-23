---
title: Registering AntV/G Plugins
order: 10

---

:::warning{title='Tip'}
Before reading this chapter, please ensure you are familiar with S2 and the [`AntV/G`](https://g.antv.antgroup.com/) rendering engine.
:::

S2 is built on the [`AntV/G`](https://g.antv.antgroup.com/) rendering engine, allowing it to share its rich plugin ecosystem.

<Playground path="custom/custom-plugins/demo/a11y.ts" rid='a11y' height='300'></playground>

## Introduction to the Plugin System

Please read the [G Plugin System Introduction](https://g.antv.antgroup.com/plugins/intro) section of the G documentation.

## Usage

S2 provides `transformCanvasConfig` to access the `G` context, which can be used to [register plugins](https://g.antv.antgroup.com/plugins/intro) and pass through related [configuration parameters](https://g.antv.antgroup.com/api/canvas/options). Due to the limitations of `Canvas`, the text inside it cannot be searched by the browser. To implement accessibility features more effectively, we can use the `@antv/g-plugin-a11y` plugin.

```ts
import { PivotSheet } from '@antv/s2';
import { Plugin as PluginA11y } from '@antv/g-plugin-a11y';

const s2Options = {
  transformCanvasConfig(renderer) {
    // Register plugin
    renderer.registerPlugin(
      new PluginA11y({
        enableExtractingText: true,
      }),
    );

    console.log('Currently registered plugins and configuration:', renderer.getPlugins(), renderer.getConfig());

    return {
      devicePixelRatio: 2,
      dblClickSpeed: 500,
      cursor: 'crosshair',
    };
  }
};

const s2 = new PivotSheet(container, s2DataConfig, s2Options);

s2.render();
```

## Effect

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*HIhnRq9EqIwAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview"/>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ag6SSYgDpeYAAAAAAAAAAAAADmJ7AQ/original" width="600" alt="preview"/>
