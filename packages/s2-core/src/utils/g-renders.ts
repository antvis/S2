/**
 * Utils to render all g supported shape
 * https://github.com/antvis/g
 */
import {
  Circle,
  Group,
  Line,
  Polygon,
  Polyline,
  Rect,
  type CircleStyleProps,
  type DisplayObject,
  type LineStyleProps,
  type PolygonStyleProps,
  type PolylineStyleProps,
  type RectStyleProps,
  type TextStyleProps,
} from '@antv/g';
import { isArray, isEmpty, isFunction } from 'lodash';
import { GuiIcon, type GuiIconCfg } from '../common/icons/gui-icon';
import { CustomText } from '../engine/CustomText';

export function renderRect(group: Group, style: RectStyleProps): Rect {
  return group?.appendChild(
    new Rect({
      style,
    }),
  );
}

export function renderPolygon(group: Group, style: PolygonStyleProps): Polygon {
  return group?.appendChild(new Polygon({ style }));
}

export function renderPolyline(
  group: Group,
  style: PolylineStyleProps,
): Polyline {
  return group?.appendChild(
    new Polyline({
      style,
    }),
  );
}

export function renderCircle(group: Group, style: CircleStyleProps): Circle {
  return group?.appendChild(
    new Circle({
      style,
    }),
  );
}

/**
 * @description 如果在单元格内绘制, 是使用 cell.renderTextShape(options)
 */
export function renderText<T>(options: {
  group: Group;
  textShape?: DisplayObject;
  style: TextStyleProps;
  appendInfo?: T;
}): CustomText {
  const { group, textShape, style, appendInfo } = options;

  if (textShape && group) {
    if (group.contains(textShape)) {
      group.removeChild(textShape);
    }
  }

  return group?.appendChild(
    new CustomText<T>(
      {
        style: {
          /**
           * 补充 g5.0 内部 measureText 时的必要参数（variant|fontStyle|lineWidth）
           * 否则创建完 Text 后，实例 getBBox 返回为全 0
           * @see https://github.com/antvis/GUI/blob/302ae68d93dbb5675f35fca37e8821d4427d495b/src/util/style.ts#L18-L29
           */
          fontVariant: 'normal',
          fontStyle: 'normal',
          lineWidth: 1,
          ...style,
        },
      },
      appendInfo || ({} as T),
    ),
  ) as CustomText;
}

export function renderLine(group: Group, options: LineStyleProps): Line {
  return group?.appendChild(
    new Line({
      style: {
        zIndex: 100,
        ...options,
      },
    }),
  );
}

export function updateShapeAttr(
  shapeGroup: DisplayObject | undefined | (DisplayObject | undefined)[],
  styleName: DisplayObject['style'],
  styleValue: string | number,
) {
  if (isEmpty(shapeGroup)) {
    return;
  }

  const shapes = isArray(shapeGroup) ? shapeGroup : [shapeGroup];

  shapes.forEach((shape) => {
    // https://g-next.antv.vision/zh/docs/api/basic/display-object#%E8%8E%B7%E5%8F%96%E8%AE%BE%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%80%BC
    shape?.style?.setProperty(styleName, styleValue);
  });
}

export function renderIcon(group: Group, iconCfg: GuiIconCfg) {
  const iconShape = new GuiIcon(iconCfg);

  group?.appendChild(iconShape);

  return iconShape;
}

export function renderTreeIcon(options: {
  group: Group;
  isCollapsed?: boolean | null;
  iconCfg: Omit<GuiIconCfg, 'name'>;
  onClick?: () => void;
}) {
  const { group, iconCfg, isCollapsed, onClick } = options;
  const iconShape = renderIcon(group, {
    ...iconCfg,
    name: isCollapsed ? 'Plus' : 'Minus',
    cursor: 'pointer',
  });

  if (isFunction(onClick)) {
    iconShape.addEventListener('click', onClick);
  }

  return iconShape;
}
