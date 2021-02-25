import {
  sumBy,
  get,
  isNil,
  some,
  isEqual,
  isEmpty,
  noop,
  isNumber,
  uniq,
} from 'lodash';
import { DataItem, Aggregation, TooltipOptions, Position } from '..';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '../common/tooltip/constant';

/**
 * calculate aggregate value
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

/** whether the data of hover is selected */
export const isHoverDataInSelectedData = (
  selectedData: DataItem[],
  hoverData: DataItem,
): boolean => {
  return some(selectedData, (dataItem: DataItem): boolean =>
    isEqual(dataItem, hoverData),
  );
};

/**
 * whether show summary - change to interaction?
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
 * calculate tooltip show position
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
 * get default options
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
 * add style to container
 */
export const manageContainerStyle = (container, styles) => {
  if (container && styles) {
    Object.keys(styles)?.forEach((item) => {
      container.style[item] = styles[item];
    });
  }

  return container;
};

/* formate */
export const getFriendlyVal = (val: any): number | string => {
  const isInvalidNumber = isNumber(val) && isNaN(val);
  const isEmptyString = val === '';

  return isNil(val) || isInvalidNumber || isEmptyString ? '-' : val;
};

export const getSelectedValueFields = (
  selectedData: DataItem[],
  field: string,
): string[] => {
  return uniq(selectedData.map((d) => d[field]));
};
