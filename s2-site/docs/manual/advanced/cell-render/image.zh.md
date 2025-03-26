---
title: 图片
order: 2
tag: New
---

有时在表格中直接基于URL展示图片，会极大的优化工作流程，提高工作效率。基于 [`AntV/G`](https://g.antv.antgroup.com/) 强大的渲染能力，S2 可以在行头、列头、数据单元格内绘制图片。

<Playground path="/custom/custom-renderer/demo/image.ts" rid='custom-renderer-image' height='300'></playground>

## 图片渲染介绍

请阅读 [`AntV/G`](https://g.antv.antgroup.com/)  [Image 图片](https://g.antv.antgroup.com/api/basic/image) 相关章节。

## 使用

在[S2DataConfig.meta](https://s2.antv.antgroup.com/api/general/s2-data-config#meta)中，添加图片渲染相关配置项：

```ts
const s2DataConfig = {
  meta: {
    field: string,
    name: string,
    renderer: {
      type: 'IMAGE',  // 单元格渲染为图片
      fallback?: string, // 渲染失败时的兜底图片地址
      clickToPreview?: boolean, // 是否开启点击预览
      timeout?: number, // 图片加载超时时间，默认为10秒
      config?: Partial<ImageStyleProps> // G的图片配置，https://g.antv.antgroup.com/api/basic/image
    }
  }
}
```

## 交互

1. 点击图片主体，可在当前页面预览，并触发 `S2Event.GLOBAL_PREVIEW_CLICK` 事件。预览时支持浏览器原生的右键复制图片地址等操作，点击空白区域可关闭预览。预览样式可以通过主题配置修改，如：

   ```ts
   s2.setTheme({
       preview: {
         overlay: {
           backgroundColor: 'red',
         },
         mediaContainer: {
           height: '100px',
         },
       },
     });
   ```

2. 点击图片单元格的非图片主体区域，可触发原本的点击事件，以及选中、树状展开、下钻等事件。`Tooltip` 会展示原始的文本信息。

3. 图片单元格的复制与导出会显示为原文本数据而不是图片

4. 兼容表头表身的水平方向对齐方式

5. 默认会按照图片原始大小比例显示，若调整单元格宽高，图片也会自适应调整尺寸
