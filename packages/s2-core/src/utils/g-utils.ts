import {
  BaseStyleProps,
  DisplayObject,
  Rect,
  type RectStyleProps,
} from '@antv/g';
import { get, set } from 'lodash';

export function batchSetStyle<
  T extends DisplayObject,
  S extends BaseStyleProps & {
    x?: number | string;
    y?: number | string;
  },
>(obj: T, style: S) {
  obj.setAttributes(style, { skipDispatchAttrModifiedEvent: true });
}

export function createOrUpdateRect(
  propertyPath: string,
  style: RectStyleProps,
) {
  // @ts-ignore
  const context = this as any;
  const obj = get(context, propertyPath);

  if (!obj) {
    set(context, propertyPath, new Rect({ style }));
  } else {
    batchSetStyle(obj, style);
  }
}
