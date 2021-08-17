/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import { TextTheme } from '@/common/interface/theme';
import { Group, IShape, ShapeAttrs } from '@antv/g-canvas';
import { forEach, isEmpty, set } from 'lodash';

export function renderRect(group: Group, attrs: ShapeAttrs): IShape {
  return group?.addShape?.('rect', {
    zIndex: 1,
    attrs,
  });
}

export function renderPolygon(group: Group, attrs: ShapeAttrs): IShape {
  return group?.addShape?.('polygon', {
    attrs,
  });
}

export function renderText(
  shapes: IShape[],
  x: number,
  y: number,
  text: string,
  textStyle: TextTheme,
  group: Group,
  extraStyle?: any,
): IShape {
  if (!isEmpty(shapes) && group) {
    forEach(shapes, (shape: IShape) => {
      if (group.contain(shape)) group.removeChild(shape, true);
    });
  }
  return group?.addShape?.('text', {
    attrs: {
      x,
      y,
      text,
      ...textStyle,
      ...extraStyle,
    },
  });
}

export function renderLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  lineWidth: number,
  group: Group,
  opacity?: number,
): IShape {
  return group?.addShape?.('line', {
    attrs: {
      x1,
      y1,
      x2,
      y2,
      stroke,
      opacity,
      lineWidth,
    },
  });
}

export function updateShapeAttr<K extends keyof ShapeAttrs>(
  shape: IShape,
  attribute: K,
  value: ShapeAttrs[K],
) {
  if (shape) {
    set(shape, `attrs.${attribute}`, value);
  }
}

export function updateFillOpacity(shape: IShape, opacity: number) {
  updateShapeAttr(shape, 'fillOpacity', opacity);
}

export function updateStrokeOpacity(shape: IShape, opacity: number) {
  updateShapeAttr(shape, 'strokeOpacity', opacity);
}
