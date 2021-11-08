---
title: 常见问题
order: 8
---
## 性能问题

使用 `S2` 过程中，如果出现性能问题，比如渲染时间长，浏览器无响应等，可能原因如下：

- 数据量大。正常 `1w` 数据渲染时间是4秒，数据超过 `1w` 感受会比较明显，详见[性能介绍](/zh/docs/manual/advanced/performance)。
- 属性频繁变化。比如 `<SheetComponent />` 组件中，`options`、`dataCfg`等属性的引用频繁变化，每一次变化都会重新计算布局和渲染，因此属性改变时建议使用新的数据对象，避免重复渲染，[更多了解](https://zh-hans.reactjs.org/docs/optimizing-performance.html#the-power-of-not-mutating-data)。

   举个例子：

   ```ts
   // bad
   options.hierarchyType = 'tree';

   // good
   const newOptions = Object.assign({}, options, { hierarchyType: 'tree' });
   ```

   此外，当处理深层嵌套对象时，以 immutable （不可变）的方式更新它们，帮助你编写高可读性、高性能的代码。

## 浏览器兼容性

> 由于条件限制，版本下限仅供参考，并不意味着不能支持更低版本，该测试在 CDN 模式下测试完成，[在线 Demo](等福晋部署好了给)

|        | Chrome | Edge | Firefox | IE  | Opera | Safari | UC  | 360 极速浏览器 | 360 安全浏览器 |
| ------ | :----: | :--: | :-----: | :-: | :---: | :----: | :-: | :------------: | :------------: |
| **AntV S2** |   40   |  12  |   85    |  9  |  40   |   14   |   6.2   |    12    |   7.3     |

### CDN 使用

`head` 里面引入如下 `js` , 各图表挂载全局 `S2` 上。

```ts
<link rel="stylesheet" href="https://unpkg.com/@antv/s2@latest/dist/s2.min.css">
<script src="https://unpkg.com/@babel/polyfill@latest/dist/polyfill.min.js"></script> // 非必需
<script src="https://unpkg.com/@antv/s2@latest"></script>

// s2.js
const s2 = new window.S2.PivotSheet(container, s2DataConfig, s2options);
s2.render();
```

### NPM 使用

使用 `npm` 模式，如果出现兼容性问题请结合 babel 和 @babel/polyfill 使用，更多问题欢迎进群交流。
