/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import {
  Group,
  DisplayObject,
  Text,
  TextStyleProps,
  Rect,
  RectStyleProps,
  Polygon,
  PolygonStyleProps,
  Circle,
  CircleStyleProps,
  Line,
  LineStyleProps,
  BaseStyleProps,
} from '@antv/g';
import { forEach, isEmpty, set, isFunction } from 'lodash';
import { GuiIcon, GuiIconCfg } from '@/common/icons/gui-icon';
import { TextTheme } from '@/common/interface/theme';
import { SimpleBBox } from '@/common/interface';

export function renderRect(
  group: Group,
  style: RectStyleProps,
  extraParams?: Omit<BaseStyleProps, 'style'>,
): DisplayObject {
  const rect = new Rect({
    zIndex: 1,
    style,
    ...(extraParams || {}),
  });
  return group?.appendChild(new Rect(rect));
}

export function renderPolygon(
  group: Group,
  style: PolygonStyleProps,
): DisplayObject {
  const polygon = new Polygon({ style });
  return group?.appendChild?.(polygon);
}

export function renderCircle(
  group: Group,
  style: CircleStyleProps,
): DisplayObject {
  const circle = new Circle({ style });
  return group?.appendChild?.(circle);
}

export function renderText(
  group: Group,
  shapes: DisplayObject[],
  x: number,
  y: number,
  textString: string,
  textStyle: TextTheme,
  extraStyle?: TextStyleProps,
): DisplayObject {
  if (!isEmpty(shapes) && group) {
    forEach(shapes, (shape: DisplayObject) => {
      if (group.contain(shape)) group.removeChild(shape, true);
    });
  }

  const text = new Text({
    style: {
      x,
      y,
      text: textString,
      ...textStyle,
      ...extraStyle,
    },
  });

  return group?.appendChild?.(text);
}

export function renderLine(
  group: Group,
  coordinate: { x1: number; y1: number; x2: number; y2: number },
  lineStyle: LineStyleProps,
): DisplayObject {
  const line = new Line({
    zIndex: 100,
    style: {
      ...coordinate,
      ...lineStyle,
    },
  });
  return group?.appendChild?.(line);
}

export function updateShapeAttr<K extends keyof BaseStyleProps>(
  shape: DisplayObject,
  attribute: K,
  value: BaseStyleProps[K],
) {
  if (shape) {
    set(shape, `attrs.${attribute}`, value);
  }
}

export function updateFillOpacity(shape: DisplayObject, opacity: number) {
  updateShapeAttr(shape, 'fillOpacity', opacity);
}

export function updateStrokeOpacity(shape: DisplayObject, opacity: number) {
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
