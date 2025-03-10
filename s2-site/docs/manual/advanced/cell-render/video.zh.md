---
title: 视频
order: 5
tag: New
---

在表格中直接基于URL播放视频，可以方便用户快速了解视频内容。基于 [`AntV/G`](https://g.antv.antgroup.com/) 强大的渲染能力，S2 可以在数据单元格内播放视频。

<Playground path="/custom/custom-renderer/demo/video.ts" rid='custom-renderer-video' height='1200'></playground>

## 使用

在[S2DataConfig.meta](https://s2.antv.antgroup.com/api/general/s2-data-config#meta)中，添加视频渲染相关配置项：

```ts
const s2DataConfig = {
  meta: {
    field: string,
    name: string,
    renderer: {
      type: 'VIDEO',  // 单元格渲染为视频
      clickToPreview?: boolean, // 是否开启点击预览
      config?: Partial<HTMLVideoElement> // https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
    }
  }
}
```

## 交互

1. 点击视频主体，可在当前页面预览，并触发 `S2Event.GLOBAL_PREVIEW_CLICK` 事件。预览时支持浏览器原生的视频控制操作，点击空白区域可关闭预览。
2. 视频单元格的复制与导出会显示为原文本数据而不是视频
3. 默认会按照视频原始大小比例缩放显示，若调整单元格宽高，视频也会自适应调整尺寸
