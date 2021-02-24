import {
  sumBy,
  get,
  isNil,
  some,
  isEqual,
  isEmpty,
  noop,
  isNumber,
} from 'lodash';
import { DataItem, Aggregation, TooltipOptions, Position } from '..';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '../common/tooltip/constant';

/**
 * 计算聚合值
 */
export const getAggregationValue = (
  data: DataItem[],
  field: string,
  aggregation: Aggregation,
): number => {
  if (aggregation === 'SUM') {
    return sumBy(data, (datum) => {
      const v = get(datum, field, 0);
      return isNil(v) ? 0 : Number.parseFloat(v);
    });
  }
  return 0;
};

/** hover 的数据是否是选中的 */
export const isHoverDataInSelectedData = (
  selectedData: DataItem[],
  hoverData: DataItem,
): boolean => {
  return some(selectedData, (dataItem: DataItem): boolean =>
    isEqual(dataItem, hoverData),
  );
};

/**
 * 是否显示概要信息 - 是否要改到交互层？
 */
export const shouldShowSummary = (
  hoverData: DataItem,
  selectedData: DataItem[],
  options: TooltipOptions,
): boolean => {
  const { actionType } = options;

  const showSummary =
    actionType === 'cellHover'
      ? isHoverDataInSelectedData(selectedData, hoverData)
      : true;
  return !isEmpty(selectedData) && showSummary;
};

/**
 * 计算tooltip显示位置
 */
export const getPosition = (
  position: Position,
  currContainer: HTMLElement = document.body,
  viewportContainer: HTMLElement = document.body,
): Position => {
  const tooltipBCR = currContainer.getBoundingClientRect();
  const viewportBCR = viewportContainer.getBoundingClientRect();
  let x = position.x + POSITION_X_OFFSET;
  let y = position.y + POSITION_Y_OFFSET;

  if (x + tooltipBCR.width > viewportBCR.width) {
    x = viewportBCR.width - tooltipBCR.width - 2;
  }

  if (y + tooltipBCR.height > viewportBCR.height) {
    y = viewportBCR.height - tooltipBCR.height - 2;
  }

  return {
    x,
    y,
    tipHeight: tooltipBCR.height,
  };
};

/**
 * 获取默认options
 */
export const getOptions = (options?: TooltipOptions) => {
  return {
    actionType: '',
    operator: { onClick: noop, menus: [] },
    enterable: true,
    ...options,
  } as TooltipOptions;
};

export const shouldIgnore = (
  enterable: boolean,
  position: Position,
  currPosition: Position,
): boolean => {
  if (enterable) {
    if (
      Math.abs(position.x - currPosition?.x) < 20 &&
      Math.abs(position.y - currPosition?.y) < 20
    ) {
      return true;
    }
  }
  return false;
};

/**
 * 給container加style
 */
export const manageContainerStyle = (container, styles) => {
  if (container && styles) {
    Object.keys(styles)?.forEach((item) => {
      container.style[item] = styles[item];
    });
  }

  return container;
};

/* 美化 */
export const getFriendlyVal = (val: any): number | string => {
  const isInvalidNumber = isNumber(val) && isNaN(val);
  const isEmptyString = val === '';

  return isNil(val) || isInvalidNumber || isEmptyString ? '-' : val;
};
