import type { IGroup, ShapeAttrs, SimpleBBox } from '@antv/g-canvas';
import {
  FRONT_GROUND_GROUP_RESIZE_AREA_Z_INDEX,
  ResizeDirectionType,
} from '../../common/constant';
import type { ResizeInfo } from '../../common/interface/resize';
import type { SpreadSheet } from '../../sheet-type/spread-sheet';

export const getResizeAreaAttrs = (
  options: Omit<ResizeInfo, 'size'>,
): ShapeAttrs => {
  const {
    type,
    id,
    theme,
    width: resizeAreaWidth,
    height: resizeAreaHeight,
    ...otherOptions
  } = options;
  const width =
    type === ResizeDirectionType.Horizontal ? theme.size : undefined;
  const height = type === ResizeDirectionType.Vertical ? theme.size : undefined;

  return {
    fill: theme.background,
    fillOpacity: theme.backgroundOpacity,
    cursor: `${type}-resize`,
    width,
    height,
    appendInfo: {
      ...otherOptions,
      isResizeArea: true,
      type,
      id,
      width: resizeAreaWidth,
      height: resizeAreaHeight,
      size: theme.size,
    } as ResizeInfo,
  };
};

export const getOrCreateResizeAreaGroupById = (
  spreadsheet: SpreadSheet,
  id: string,
): IGroup | undefined => {
  if (!spreadsheet.facet?.foregroundGroup) {
    return;
  }

  const existedResizeArea = spreadsheet.facet.foregroundGroup.findById(
    id,
  ) as IGroup;

  return (
    existedResizeArea ||
    spreadsheet.facet.foregroundGroup.addGroup({
      id,
      zIndex: FRONT_GROUND_GROUP_RESIZE_AREA_Z_INDEX,
    })
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
