/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import { Group, IShape } from '@antv/g-canvas';
import * as _ from 'lodash';
import { TextTheme } from '@/theme/interface';

export function renderRect(
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string | number,
  group: Group,
): IShape {
  return (
    group &&
    group?.addShape?.('rect', {
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

export function renderPolygon(
  points: number[][],
  stroke: string,
  fill: string,
  lineWidth: number,
  group: Group,
): IShape {
  return (
    group &&
    group?.addShape?.('polygon', {
      attrs: {
        points,
        stroke,
        fill,
        lineWidth,
      },
    })
  );
}

export function renderText(
  self: IShape,
  x: number,
  y: number,
  text: any,
  textStyle: TextTheme,
  fill: string,
  group: Group,
): IShape {
  if (self && group && group.contain(self)) {
    group.removeChild(self, true);
  }
  return (
    group &&
    group?.addShape?.('text', {
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
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  lineWidth: number,
  group: Group,
): IShape {
  return (
    group &&
    group?.addShape?.('line', {
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
