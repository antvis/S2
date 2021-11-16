/**
 * 获取tooltip中需要显示的数据项
 */

import {
  assign,
  concat,
  filter,
  find,
  forEach,
  get,
  isEmpty,
  isEqual,
  isNil,
  isNumber,
  map,
  pick,
  some,
  reduce,
  uniq,
  noop,
  mapKeys,
  every,
} from 'lodash';
import * as CSS from 'csstype';
import { Event as CanvasEvent } from '@antv/g-canvas';
import { handleDataItem } from './cell/data-cell';
import { isMultiDataItem } from './data-item-type-checker';
import {
  AutoAdjustPositionOptions,
  LayoutResult,
  ListItem,
  S2CellType,
  SpreadSheet,
  SummaryParam,
  TooltipData,
  TooltipDataItem,
  TooltipDataParam,
  TooltipHeadInfo,
  TooltipOptions,
  TooltipPosition,
  TooltipSummaryOptions,
} from '@/index';
import { i18n } from '@/common/i18n';
import {
  CellTypes,
  EXTRA_FIELD,
  PRECISION,
  VALUE_FIELD,
} from '@/common/constant';
import { Tooltip, ViewMeta } from '@/common/interface';

const isNotNumber = (v) => {
  return Number.isNaN(Number(v));
};

/**
 * 浮点数加法，解决精度问题
 * 因为乘法也有精度问题，故用字符串形式
 * TODO：因为暂时只支持加法，自己先实现，如果有其他场景考虑用现有库
 * @param arg1
 * @param arg2
 */
function accAdd(arg1: number, arg2: number) {
  const [pre1, next1 = ''] = arg1?.toString()?.split('.');
  const [pre2, next2 = ''] = arg2?.toString()?.split('.');
  const r1 = next1?.length || 0;
  const r2 = next2?.length || 0;
  const m = Math.pow(10, Math.max(r1, r2));
  const suffix = Array(Math.abs(r1 - r2))
    .fill('0')
    ?.join('');
  const number1 = r2 > r1 ? `${pre1}${next1}${suffix}` : `${pre1}${next1}`;
  const number2 = r1 > r2 ? `${pre2}${next2}${suffix}` : `${pre2}${next2}`;

  return (Number.parseInt(number1, 10) + Number.parseInt(number2, 10)) / m;
}

/**
 * calculate sum value
 */
export const getDataSumByField = (
  data: TooltipDataItem[],
  field: string,
): number => {
  const sum = reduce(
    data,
    (pre, next) => {
      const fieldValue = get(next, field, 0);
      const v = isNotNumber(fieldValue)
        ? 0
        : Number.parseFloat(fieldValue) || Number(fieldValue);
      return accAdd(pre, v);
    },
    0,
  );
  return sum;
};

/** whether the data of hover is selected */
export const isHoverDataInSelectedData = (
  selectedData: TooltipDataItem[],
  activeData: TooltipDataItem,
): boolean => {
  return some(selectedData, (dataItem: TooltipDataItem): boolean =>
    isEqual(dataItem, activeData),
  );
};

/**
 * calculate tooltip show position
 */
export const getAutoAdjustPosition = ({
  spreadsheet,
  position,
  tooltipContainer,
  autoAdjustBoundary,
}: AutoAdjustPositionOptions): TooltipPosition => {
  if (!autoAdjustBoundary) {
    return position;
  }

  const isAdjustBodyBoundary = autoAdjustBoundary === 'body';
  const { maxX, maxY } = spreadsheet.facet.panelBBox;
  const { width, height } = spreadsheet.options;
  const canvas = spreadsheet.container.get('el') as HTMLCanvasElement;

  const { top: canvasOffsetTop, left: canvasOffsetLeft } =
    canvas.getBoundingClientRect();
  const { width: tooltipWidth, height: tooltipHeight } =
    tooltipContainer.getBoundingClientRect();
  const { width: viewportWidth, height: viewportHeight } =
    document.body.getBoundingClientRect();

  const maxWidth = isAdjustBodyBoundary
    ? viewportWidth
    : Math.min(width, maxX) + canvasOffsetLeft;
  const maxHeight = isAdjustBodyBoundary
    ? viewportHeight
    : Math.min(height, maxY) + canvasOffsetTop;

  let x = position.x;
  let y = position.y;

  if (x + tooltipWidth >= maxWidth) {
    x = maxWidth - tooltipWidth;
  }

  if (y + tooltipHeight >= maxHeight) {
    y = maxHeight - tooltipHeight;
  }

  return {
    x,
    y,
  };
};

/**
 * get default options
 */
export const getOptions = (options?: TooltipOptions) => {
  return {
    operator: { onClick: noop, menus: [] },
    enterable: true,
    ...options,
  } as TooltipOptions;
};

export const getMergedQuery = (meta: ViewMeta) => {
  return { ...meta?.colQuery, ...meta?.rowQuery };
};

/**
 * add style to container
 */
export const setContainerStyle = (
  container: HTMLElement,
  styles: CSS.Properties,
) => {
  if (container && styles) {
    Object.keys(styles)?.forEach((item) => {
      container.style[item] = styles[item];
    });
  }
};

/* formate */
export const getFriendlyVal = (val: any): number | string => {
  const isInvalidNumber = isNumber(val) && Number.isNaN(val);
  const isEmptyString = val === '';

  return isNil(val) || isInvalidNumber || isEmptyString ? '-' : val;
};

export const getFieldFormatter = (spreadsheet: SpreadSheet, field: string) => {
  const formatter = spreadsheet?.dataSet?.getFieldFormatter(field);

  return (v: any) => {
    return getFriendlyVal(formatter(v));
  };
};

export const getListItem = (
  spreadsheet: SpreadSheet,
  data: TooltipDataItem,
  field: string,
  valueField?: string,
): ListItem => {
  const name = spreadsheet?.dataSet?.getFieldName(field);
  const formatter = getFieldFormatter(spreadsheet, field);
  // eslint-disable-next-line
  const value = formatter(valueField ? valueField : data[field]);

  return {
    name,
    value,
  };
};

export const getFieldList = (
  spreadsheet: SpreadSheet,
  fields: string[],
  activeData: TooltipDataItem,
): ListItem[] => {
  const currFields = filter(
    concat([], fields),
    (field) => field !== EXTRA_FIELD && activeData[field],
  );
  const fieldList = map(currFields, (field: string): ListItem => {
    return getListItem(spreadsheet, activeData, field);
  });
  return fieldList;
};

/**
 * 获取选中格行/列头信息
 * @param spreadsheet
 * @param activeData
 */
export const getHeadInfo = (
  spreadsheet: SpreadSheet,
  activeData: TooltipDataItem,
  options?: TooltipOptions,
): TooltipHeadInfo => {
  const { isTotals } = options || {};
  let colList = [];
  let rowList = [];
  if (activeData) {
    const colFields = spreadsheet?.dataSet?.fields?.columns;
    const rowFields = spreadsheet?.dataSet?.fields?.rows;
    colList = getFieldList(spreadsheet, colFields, activeData);
    rowList = getFieldList(spreadsheet, rowFields, activeData);
  }

  // 此时是总计-总计
  if (isEmpty(colList) && isEmpty(rowList) && isTotals) {
    colList = [{ value: i18n('总计') }];
  }

  return { cols: colList, rows: rowList };
};

/**
 * 获取数据明细
 * @param spreadsheet
 * @param activeData
 * @param options
 */
export const getDetailList = (
  spreadsheet: SpreadSheet,
  activeData: TooltipDataItem,
  options: TooltipOptions,
): ListItem[] => {
  if (activeData) {
    const { isTotals } = options;
    const field = activeData[EXTRA_FIELD];
    const value = activeData[field];
    const valItem = [];
    if (isTotals) {
      // total/subtotal
      valItem.push(
        getListItem(
          spreadsheet,
          activeData,
          field,
          get(activeData, VALUE_FIELD),
        ),
      );
    }
    // the value hangs at the head of the column, match the displayed fields according to the metric itself
    // 1、multiple derivative indicators
    // 2、only one column scene
    // 3、the clicked cell belongs to the derived index column
    // tooltip need to show all derivative indicators
    else if (
      isMultiDataItem(value) &&
      spreadsheet.getTooltipDataItemMappingCallback()
    ) {
      const mappedResult = handleDataItem(
        activeData,
        spreadsheet.getTooltipDataItemMappingCallback(),
      ) as Record<string, string | number>;

      forEach(mappedResult, (_, key) => {
        valItem.push(getListItem(spreadsheet, mappedResult, key));
      });
    } else {
      valItem.push(getListItem(spreadsheet, activeData, field));
    }

    return valItem;
  }
};

export const getSummaryName = (
  spreadsheet: SpreadSheet,
  currentField,
  isTotals,
): string => {
  if (isTotals) {
    return i18n('总计');
  }

  const name = spreadsheet?.dataSet?.getFieldName(currentField);
  return name && name !== 'undefined' ? name : '';
};

export const getSelectedValueFields = (
  selectedData: TooltipDataItem[],
  field: string,
): string[] => {
  return uniq(selectedData.map((d) => get(d, field)));
};

const getRowOrColSelectedIndexes = (nodes, leafNodes, isRow = true) => {
  const selectedIndexes = [];
  forEach(leafNodes, (leaf, index) => {
    forEach(nodes, (item) => {
      if (!isRow && item.colIndex !== -1) {
        selectedIndexes.push([index, item.colIndex]);
      } else if (isRow && item.rowIndex !== -1) {
        selectedIndexes.push([item.rowIndex, index]);
      }
    });
  });

  return selectedIndexes;
};

export const getSelectedCellIndexes = (
  spreadsheet: SpreadSheet,
  layoutResult: LayoutResult,
) => {
  const { rowLeafNodes, colLeafNodes } = layoutResult;
  const { nodes = [] } = spreadsheet.interaction.getState();
  const cells = spreadsheet.interaction.getCells();
  const cellType = cells?.[0]?.type;

  if (cellType === CellTypes.COL_CELL) {
    return getRowOrColSelectedIndexes(nodes, rowLeafNodes, false);
  }
  if (cellType === CellTypes.ROW_CELL) {
    return getRowOrColSelectedIndexes(nodes, colLeafNodes);
  }

  return [];
};

export const getSelectedCellsData = (
  spreadsheet: SpreadSheet,
  showSingleTips?: boolean,
): TooltipDataItem[] => {
  const layoutResult = spreadsheet.facet?.layoutResult;
  // 列头选择和行头选择没有存所有selected的cell，因此要遍历index对比，而selected则不需要
  if (showSingleTips) {
    // 行头列头单选多选
    // TODO：行头是树形时，state里没有nodes了，得重新兼容下
    const selectedCellIndexes = getSelectedCellIndexes(
      spreadsheet,
      layoutResult,
    );
    return map(selectedCellIndexes, ([i, j]) => {
      const viewMeta = layoutResult.getCellMeta(i, j);
      return viewMeta?.data || getMergedQuery(viewMeta);
    });
  }
  // 其他（刷选，data cell多选）
  const cells = spreadsheet.interaction.getActiveCells();
  return map(
    cells,
    (cell) =>
      cell.getMeta()?.data || getMergedQuery(cell.getMeta() as ViewMeta),
  );
};

export const getSummaries = (params: SummaryParam): TooltipSummaryOptions[] => {
  const { spreadsheet, getShowValue, options = {} } = params;
  const summaries = [];
  const summary = {};
  const isTableMode = spreadsheet.isTableMode();
  if (isTableMode && options?.showSingleTips) {
    const selectedCellsData = spreadsheet.dataSet.getMultiData({});
    return [{ selectedData: selectedCellsData, name: '', value: '' }];
  }
  const selectedCellsData = getSelectedCellsData(
    spreadsheet,
    options.showSingleTips,
  ); // 拿到选择的所有data-cell的数据
  forEach(selectedCellsData, (item) => {
    if (summary[item?.[EXTRA_FIELD]]) {
      summary[item?.[EXTRA_FIELD]]?.push(item);
    } else {
      summary[item?.[EXTRA_FIELD]] = [item];
    }
  });

  mapKeys(summary, (selected, field) => {
    const currentFormatter = getFieldFormatter(spreadsheet, field);
    const name = getSummaryName(spreadsheet, field, options?.isTotals);
    let value: number | string;
    if (getShowValue) {
      value = getShowValue(selected, VALUE_FIELD);
    }
    if (isTableMode) {
      value = '';
    } else if (every(selected, (item) => isNotNumber(get(item, VALUE_FIELD)))) {
      // 如果选中的单元格都无数据，则显示"-"
      value = '-';
    } else {
      const dataSum = getDataSumByField(selected, VALUE_FIELD);
      value = parseFloat(dataSum.toPrecision(PRECISION)); // solve accuracy problems
      if (currentFormatter) {
        value = currentFormatter(dataSum);
      }
    }
    summaries.push({
      selectedData: selected as unknown,
      name,
      value,
    });
  });

  return summaries;
};

export const getTooltipData = (params: TooltipDataParam) => {
  const { spreadsheet, cellInfos = [], options = {}, getShowValue } = params;
  let summaries = null;
  let headInfo = null;
  let details = null;
  const firstCellInfo = cellInfos[0] || {};
  // TODO：tabular类型数据需要补充兼容
  if (!options?.hideSummary) {
    // 计算多项的sum（默认为sum，可自定义）
    summaries = getSummaries({
      spreadsheet,
      options,
      getShowValue,
    });
  } else if (options.showSingleTips) {
    // 行列头hover & 明细表所有hover
    const metaName = find(
      spreadsheet?.dataCfg?.meta,
      (item) => item?.field === firstCellInfo.value,
    )?.name;
    const currentFormatter = getFieldFormatter(
      spreadsheet,
      firstCellInfo?.valueField,
    );
    firstCellInfo.name =
      metaName || currentFormatter(firstCellInfo.value) || '';
  } else {
    headInfo = getHeadInfo(spreadsheet, firstCellInfo, options);
    details = getDetailList(spreadsheet, firstCellInfo, options);
  }
  const { interpretation, infos, tips, name } = firstCellInfo || {};
  return { summaries, interpretation, infos, tips, name, headInfo, details };
};

export const mergeCellInfo = (cells: S2CellType[]): TooltipData[] => {
  return map(cells, (stateCell) => {
    const stateCellMeta = stateCell.getMeta();
    return assign(
      {},
      stateCellMeta.query || {},
      pick(stateCellMeta, ['colIndex', 'rowIndex']),
    );
  });
};

export const getActiveCellsTooltipData = (
  spreadsheet: SpreadSheet,
): TooltipData[] => {
  const cellInfos: TooltipData[] = [];
  if (!spreadsheet.interaction.isSelectedState()) {
    return [];
  }
  spreadsheet.interaction.getActiveCells().forEach((cell) => {
    const { valueInCols } = spreadsheet.dataCfg.fields;
    const meta = cell.getMeta() as ViewMeta;
    const query = getMergedQuery(meta);
    if (isEmpty(meta) || isEmpty(query)) {
      return;
    }
    const currentCellInfo: TooltipData = {
      ...query,
      colIndex: valueInCols ? meta.colIndex : null,
      rowIndex: !valueInCols ? meta.rowIndex : null,
    };

    const isEqualCellInfo = cellInfos.find((cellInfo) =>
      isEqual(currentCellInfo, cellInfo),
    );
    if (!isEqualCellInfo) {
      cellInfos.push(currentCellInfo);
    }
  });
  return cellInfos;
};

export const getTooltipOptionsByCellType = (
  cellTooltip: Tooltip,
  cellType: CellTypes,
) => {
  const getOptionsByCell = (cell) => {
    return { ...cellTooltip, ...cell };
  };

  const { col, row, cell } = cellTooltip || {};
  if (col && cellType === CellTypes.COL_CELL) {
    return getOptionsByCell(col);
  }
  if (row && cellType === CellTypes.ROW_CELL) {
    return getOptionsByCell(row);
  }
  if (cell && cellType === CellTypes.DATA_CELL) {
    return getOptionsByCell(cell);
  }

  return { ...cellTooltip };
};

export const getTooltipOptions = (
  spreadsheet: SpreadSheet,
  event: CanvasEvent | MouseEvent | Event,
) => {
  const cellType = spreadsheet.getCellType?.(event.target);
  return getTooltipOptionsByCellType(spreadsheet.options.tooltip, cellType);
};
