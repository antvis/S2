---
title: Video
order: 5
---

Rendering videos based on URLs in a table allows users to quickly understand the video content.

<Playground path="/custom/custom-renderer/demo/video.ts" rid='custom-renderer-video' height='1200'></playground>

## Usage

In [S2DataConfig.meta](https://s2.antv.antgroup.com/en/api/general/s2-data-config#meta), add the video rendering configuration items:

```ts
const s2DataConfig = {
  meta: {
    field: string,
    name: string,
    renderer: {
      type: 'VIDEO',  // Render the cell as a video
      fallback?: string, // Fallback image address when rendering fails
      timeout?: number, // Video loading timeout, default is 10 seconds
      clickToPreview?: boolean, // Whether to enable click to preview
      prepareText?: (value: SimpleData) => Promise<string>, // Asynchronously process text before rendering
      config?: Partial<RectStyleProps>, // Video rectangle area configuration within the cell https://g.antv.antgroup.com/api/css/pattern#htmlvideoelement
      videoConfig?: Partial<HTMLVideoElement> // https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement
    }
  }
}
```

## Interaction

1. Clicking on the main body of the video allows for preview playback on the current page and triggers the `S2Event.GLOBAL_PREVIEW_CLICK` event. During the preview, native browser video controls are supported. Clicking on a blank area closes the preview. The preview style can be modified through theme configuration, for example:

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

2. Copying and exporting video cells will display the original text data instead of the video.
3. By default, the video will be displayed scaled according to its original aspect ratio. If the cell's width and height are adjusted, the video will also adapt its size accordingly.
