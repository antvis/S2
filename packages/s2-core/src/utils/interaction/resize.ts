import { IGroup, ShapeAttrs } from '@antv/g-canvas';
import { ResizeInfo } from '@/common/interface/resize';
import { SpreadSheet } from '@/sheet-type/spread-sheet';

export const getResizeAreaAttrs = (options: ResizeInfo): ShapeAttrs => {
  const {
    type,
    id,
    theme,
    width: resizeAreaWidth,
    height: resizeAreaHeight,
    ...otherOptions
  } = options;
  const width = type === 'col' ? theme.size : null;
  const height = type === 'row' ? theme.size : null;

  return {
    fill: theme.background,
    fillOpacity: theme.backgroundOpacity,
    cursor: `${type}-resize`,
    width,
    height,
    appendInfo: {
      ...otherOptions,
      isResizeArea: true,
      class: 'resize-trigger',
      type,
      id,
      width: resizeAreaWidth,
      height: resizeAreaHeight,
    } as Omit<ResizeInfo, 'theme'>,
  };
};

export const getOrCreateResizeAreaGroupById = (
  spreadsheet: SpreadSheet,
  id: string,
): IGroup => {
  if (!spreadsheet.foregroundGroup) {
    return;
  }

  const existedResizeArea = spreadsheet.foregroundGroup.findById(id) as IGroup;

  return (
    existedResizeArea ||
    spreadsheet.foregroundGroup.addGroup({
      id,
    })
  );
};
