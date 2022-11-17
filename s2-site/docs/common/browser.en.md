---
title: Import in browser
order: 5
---

Check out the example:

[![Edit @antv/s2 import in browser](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/antv-s2-import-in-browser-z6uspx?autoresize=1\&fontsize=14\&hidenavigation=1\&theme=dark)

We provide the `UMD` compilation file of the `dist` directory, import `dist/index.min.js` , and access the global variable `window.S2`

```ts
<script src="./dist/index.min.js"></script>
<script>
   const s2 = new S2.PivotSheet(container, s2DataConfig, s2Options);
   s2.render();
</script>
```

If you are using the `React` version `@antv/s2-react` , or `Vue3` version `@antv/s2-vue` , additional style files need to be introduced

```html
<link rel="stylesheet" href="./dist/style.min.css"/>
```

You can also use `CDN` directly (recommended), such as [UNPKG](https://unpkg.com/@antv/s2@latest) or [![preview](https://data.jsdelivr.com/v1/package/npm/@antv/s2/badge)](https://www.jsdelivr.com/package/npm/@antv/s2)

```js
<script src="https://unpkg.com/@antv/s2@latest/dist/index.min.js"></script>

// React 需额外引入样式：
<link rel="stylesheet" href="https://unpkg.com/@antv/s2-react@latest/dist/style.min.css"/>

// Vue3 版本 需额外引入样式：
<link rel="stylesheet" href="https://unpkg.com/@antv/s2-vue@latest/dist/style.min.css"/>
```
