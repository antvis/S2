/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import { Group, IShape, ShapeAttrs, SimpleBBox } from '@antv/g-canvas';
import { forEach, isEmpty, set, isFunction } from 'lodash';
import { GuiIcon, GuiIconCfg } from '@/common/icons/gui-icon';
import { TextTheme } from '@/common/interface/theme';

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
  group: Group,
  shapes: IShape[],
  x: number,
  y: number,
  text: string,
  textStyle: TextTheme,
  extraStyle?: ShapeAttrs,
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
  group: Group,
  coordinate: { x1: number; y1: number; x2: number; y2: number },
  lineStyle: ShapeAttrs,
): IShape {
  return group?.addShape?.('line', {
    zIndex: 100,
    attrs: {
      ...coordinate,
      ...lineStyle,
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

export function renderIcon(group: Group, iconCfg: GuiIconCfg) {
  const iconShape = new GuiIcon(iconCfg);
  group?.add(iconShape);
  return iconShape;
}

export function renderTreeIcon(
  group: Group,
  area: SimpleBBox,
  fill: string,
  isCollapse: boolean,
  onClick?: () => void,
) {
  const icon = new GuiIcon({
    name: isCollapse ? 'Plus' : 'Minus',
    ...area,
    fill,
  });
  if (isFunction(onClick)) {
    icon.on('click', onClick);
  }
  group?.add(icon);
  return icon;
}
