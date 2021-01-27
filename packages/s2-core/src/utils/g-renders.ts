/**
 * Create By Bruce Too
 * On 2019-10-15
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import { Group, IShape } from '@antv/g-canvas';
import * as _ from '@antv/util';

export function renderRect(
  x,
  y,
  width,
  height,
  fill,
  stroke,
  group: Group,
): IShape {
  return (
    group &&
    group.addShape('rect', {
      attrs: {
        x,
        y,
        width,
        height,
        fill,
        stroke,
      },
    })
  );
}

export function renderTextOnly(
  x,
  y,
  text,
  textStyle,
  fill,
  group: Group,
): IShape {
  return (
    group &&
    group.addShape('text', {
      attrs: {
        x,
        y,
        text,
        ...textStyle,
        fill,
      },
    })
  );
}

export function renderText(
  self: IShape,
  x,
  y,
  text,
  textStyle,
  fill,
  group: Group,
): IShape {
  if (self && group && group.contain(self)) {
    group.removeChild(self, true);
  }
  return (
    group &&
    group.addShape('text', {
      attrs: {
        x,
        y,
        text,
        ...textStyle,
        fill,
      },
    })
  );
}

export function renderLine(
  x1,
  y1,
  x2,
  y2,
  stroke,
  lineWidth,
  group: Group,
): IShape {
  return (
    group &&
    group.addShape('line', {
      attrs: {
        x1,
        y1,
        x2,
        y2,
        stroke,
        lineWidth,
      },
    })
  );
}

export function updateShapeAttr(shape: IShape, attribute: string, value: any) {
  if (shape) {
    _.set(shape, `attrs.${attribute}`, value);
  }
}
