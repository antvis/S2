import { Group, type RectStyleProps } from '@antv/g';
import type { SimpleBBox } from '../../engine';
import {
  FRONT_GROUND_GROUP_RESIZE_AREA_Z_INDEX,
  ResizeDirectionType,
} from '../../common/constant';
import type { ResizeInfo } from '../../common/interface/resize';
import type { SpreadSheet } from '../../sheet-type/spread-sheet';

export const getResizeAreaAttrs = (
  options: Omit<ResizeInfo, 'size'>,
): {
  style: RectStyleProps;
  appendInfo: ResizeInfo;
} => {
  const {
    type,
    theme,
    width: resizeAreaWidth,
    height: resizeAreaHeight,
    ...otherOptions
  } = options;
  const width =
    type === ResizeDirectionType.Horizontal ? theme.size : undefined;
  const height = type === ResizeDirectionType.Vertical ? theme.size : undefined;

  return {
    style: {
      fill: theme.background,
      fillOpacity: theme.backgroundOpacity,
      cursor: `${type}-resize`,
      width: width!,
      height: height!,
    },
    appendInfo: {
      ...otherOptions,
      isResizeArea: true,
      type,
      width: resizeAreaWidth,
      height: resizeAreaHeight,
      size: theme.size,
    } as ResizeInfo,
  };
};

export const getOrCreateResizeAreaGroupById = (
  spreadsheet: SpreadSheet,
  id: string,
): Group | undefined => {
  if (!spreadsheet.facet?.foregroundGroup) {
    return;
  }

  const existedResizeArea =
    spreadsheet.facet.foregroundGroup.getElementById<Group>(id);

  return (
    existedResizeArea ||
    spreadsheet.facet.foregroundGroup.appendChild(
      new Group({
        id,
        style: { zIndex: FRONT_GROUND_GROUP_RESIZE_AREA_Z_INDEX },
      }),
    )
  );
};

export const shouldAddResizeArea = (
  resizeArea: SimpleBBox,
  resizeClipArea: SimpleBBox,
  scrollOffset?: {
    scrollX?: number;
    scrollY?: number;
  },
) => {
  const { scrollX = 0, scrollY = 0 } = scrollOffset ?? {};

  // x轴上有重叠
  const overlapInXAxis = !(
    resizeArea.x - scrollX > resizeClipArea.x + resizeClipArea.width ||
    resizeArea.x + resizeArea.width - scrollX < resizeClipArea.x
  );

  // y轴上有重叠
  const overlapInYAxis = !(
    resizeArea.y - scrollY > resizeClipArea.y + resizeClipArea.height ||
    resizeArea.y + resizeArea.height - scrollY < resizeClipArea.y
  );

  return overlapInXAxis && overlapInYAxis;
};
