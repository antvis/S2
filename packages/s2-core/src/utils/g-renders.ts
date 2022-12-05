/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import {
  Group,
  type DisplayObject,
  type RectStyleProps,
  Rect,
  type PolygonStyleProps,
  Polygon,
  Polyline,
  type PolylineStyleProps,
  Circle,
  type CircleStyleProps,
  type LineStyleProps,
  Line,
  Text,
  type TextStyleProps,
} from '@antv/g';
import { forEach, isEmpty, isFunction } from 'lodash';
import type { SimpleBBox } from '../engine';
import { GuiIcon, type GuiIconCfg } from '../common/icons/gui-icon';
import type { TextTheme } from '../common/interface/theme';

export function renderRect(group: Group, style: RectStyleProps): DisplayObject {
  return group?.appendChild(
    new Rect({
      style,
    }),
  );
}

export function renderPolygon(
  group: Group,
  style: PolygonStyleProps,
): DisplayObject {
  return group?.appendChild(new Polygon({ style }));
}

export function renderPolyline(
  group: Group,
  style: PolylineStyleProps,
): DisplayObject {
  return group?.appendChild(
    new Polyline({
      style,
    }),
  );
}

export function renderCircle(
  group: Group,
  style: CircleStyleProps,
): DisplayObject {
  return group?.appendChild(
    new Circle({
      style,
    }),
  );
}

export function renderText(
  group: Group,
  shapes: DisplayObject[],
  x: number,
  y: number,
  text: string,
  textStyle: TextTheme,
  extraStyle?: TextStyleProps,
): DisplayObject {
  if (!isEmpty(shapes) && group) {
    forEach(shapes, (shape: DisplayObject) => {
      if (group.contains(shape)) {
        group.removeChild(shape);
      }
    });
  }
  return group?.appendChild(
    new Text({
      style: {
        x,
        y,
        text,
        /**
         * 补充 g5.0 内部 measureText 时的必要参数（variant|fontStyle|lineWidth）
         * 否则创建完 Text 后，实例 getBBox 返回为全 0
         * @see https://github.com/antvis/GUI/blob/302ae68d93dbb5675f35fca37e8821d4427d495b/src/util/style.ts#L18-L29
         */
        fontVariant: 'normal',
        fontStyle: 'normal',
        lineWidth: 1,
        ...textStyle,
        ...extraStyle,
      },
    }),
  );
}

export function renderLine(
  group: Group,
  coordinate: { x1: number; y1: number; x2: number; y2: number },
  lineStyle: Omit<LineStyleProps, 'x1' | 'x2' | 'y1' | 'y2'>,
): DisplayObject {
  return group?.appendChild(
    new Line({
      style: {
        zIndex: 100,
        ...coordinate,
        ...lineStyle,
      },
    }),
  );
}

export function updateShapeAttr<
  T extends DisplayObject,
  K extends keyof T['style'],
>(shape: T, styleName: K, styleValue: T['style'][K]) {
  // https://g-next.antv.vision/zh/docs/api/basic/display-object#%E8%8E%B7%E5%8F%96%E8%AE%BE%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%80%BC
  shape?.style.setProperty(styleName, styleValue);
}

export function renderIcon(group: Group, iconCfg: GuiIconCfg) {
  const iconShape = new GuiIcon(iconCfg);
  group?.appendChild(iconShape);
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
    icon.addEventListener('click', onClick);
  }
  group?.appendChild(icon);
  return icon;
}
