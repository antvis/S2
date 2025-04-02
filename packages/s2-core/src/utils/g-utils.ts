import { BaseStyleProps, DisplayObject } from '@antv/g';

export function batchSetStyle<
  T extends DisplayObject,
  S extends BaseStyleProps & {
    x?: number | string;
    y?: number | string;
  },
>(obj: T, style: S) {
  for (const styleKey in style) {
    obj.style[styleKey] = style[styleKey];
  }
}
