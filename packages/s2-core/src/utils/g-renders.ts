/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import { TextTheme } from '@/common/interface/theme';
import { Group, IShape } from '@antv/g-canvas';
import _ from 'lodash';

export function renderRect(
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string | number,
  group: Group,
  opacity?: number,
): IShape {
  return group?.addShape?.('rect', {
    zIndex: 1,
    attrs: {
      x,
      y,
      width,
      height,
      fill,
      opacity,
      stroke,
    },
  });
}

export function renderPolygon(
  points: number[][],
  stroke: string,
  fill: string,
  lineWidth: number,
  group: Group,
  opacity?: number,
): IShape {
  return (
    group &&
    group?.addShape?.('polygon', {
      attrs: {
        points,
        stroke,
        fill,
        opacity,
        lineWidth,
      },
    })
  );
}

export function renderText(
  shapes: IShape[],
  x: number,
  y: number,
  text: string,
  textStyle: TextTheme,
  group: Group,
  extrStyle?: any,
): IShape {
  if (!_.isEmpty(shapes) && group) {
    _.forEach(shapes, (shape: IShape) => {
      if (group.contain(shape)) group.removeChild(shape, true);
    });
  }
  return (
    group &&
    group?.addShape?.('text', {
      attrs: {
        x,
        y,
        text,
        ...textStyle,
        ...extrStyle,
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
  opacity?: number,
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
        opacity,
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
