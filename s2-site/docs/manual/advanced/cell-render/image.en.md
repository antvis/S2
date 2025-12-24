---
title: Image
order: 2
---

Sometimes, displaying images directly in a table based on a URL can greatly optimize the workflow and improve work efficiency. Based on the powerful rendering capabilities of [`AntV/G`](https://g.antv.antgroup.com/), S2 can draw images in row headers, column headers, and data cells.

<Playground path="/custom/custom-renderer/demo/image.ts" rid='custom-renderer-image' height='300'></playground>

## Image Rendering Introduction

Please read the relevant sections of [`AntV/G`](https://g.antv.antgroup.com/) [Image](https://g.antv.antgroup.com/api/basic/image).

## Usage

In [S2DataConfig.meta](https://s2.antv.antgroup.com/api/general/s2-data-config#meta), add the image rendering configuration items:

```ts
const s2DataConfig = {
  meta: {
    field: string,
    name: string,
    renderer: {
      type: 'IMAGE',  // Render the cell as an image
      fallback?: string, // Fallback image address when rendering fails
      clickToPreview?: boolean, // Whether to enable click to preview
      prepareText?: (value: SimpleData) => Promise<string>, // Asynchronously process text before rendering
      timeout?: number, // Image loading timeout, default is 10 seconds
      config?: Partial<ImageStyleProps> // G's image configuration, https://g.antv.antgroup.com/api/basic/image
    }
  }
}
```

Use `qrcode` to convert a URL/link into a QR code through `prepareText`, making it convenient to scan the code on a mobile phone and jump to the link.

<Playground path="/custom/custom-renderer/demo/qrcode.ts" rid='custom-renderer-qrcode' height='300'></playground>

## Interaction

1. Clicking on the main body of the image allows for a preview on the current page and triggers the `S2Event.GLOBAL_PREVIEW_CLICK` event. During the preview, native browser operations such as right-clicking to copy the image address are supported. Clicking on a blank area closes the preview. The preview style can be modified through theme configuration, for example:

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

2. Clicking on the non-image area of an image cell can trigger the original click events, as well as selection, tree expansion, drill-down, and other events. The `Tooltip` will display the original text information.

3. Copying and exporting image cells will display the original text data instead of the image.

4. It is compatible with the horizontal alignment of the header and body of the table.

5. By default, the image will be displayed according to its original size ratio. If the cell's width and height are adjusted, the image will also adapt its size accordingly.
