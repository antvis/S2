/**
 * 获取tooltip中需要显示的数据项
 */

import {
  CellTypes,
  EXTRA_FIELD,
  VALUE_FIELD,
  PRECISION,
} from '@/common/constant';
import {
  compact,
  concat,
  each,
  filter,
  find,
  findIndex,
  forEach,
  get,
  isEqual,
  isNil,
  isNumber,
  map,
  isEmpty,
  sumBy,
  some,
  assign,
  pick,
  uniq,
  noop,
} from 'lodash';
import {
  TooltipDataItem,
  TooltipDataParam,
  TooltipOptions,
  SummaryParam,
  ListItem,
  S2CellType,
  SpreadSheet,
  TooltipData,
  TooltipHeadInfo,
  TooltipPosition,
  TooltipSummaryOptions,
} from '..';
import { i18n } from '@/common/i18n';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '@/common/tooltip/constant';
import getRightFieldInQuery from '../facet/layout/util/get-right-field-in-query';
import { handleDataItem } from './data-cell';
import { isMultiDataItem } from './data-item-type-checker';

/**
 * calculate sum value
 */
export const getDataSumByField = (
  data: TooltipDataItem[],
  field: string,
): number => {
  return sumBy(data, (datum) => {
    const v = get(datum, field, 0);
    return Number.isNaN(Number(v)) ? 0 : Number.parseFloat(v);
  });
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
export const getPosition = (
  position: TooltipPosition,
  currContainer: HTMLElement = document.body,
  viewportContainer: HTMLElement = document.body,
): TooltipPosition => {
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
    operator: { onClick: noop, menus: [] },
    enterable: true,
    ...options,
  } as TooltipOptions;
};

export const shouldIgnore = (
  enterable: boolean,
  position: TooltipPosition,
  currPosition: TooltipPosition,
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
export const manageContainerStyle = (container, styles: any) => {
  if (container && styles) {
    Object.keys(styles)?.forEach((item) => {
      container.style[item] = styles[item];
    });
  }

  return container;
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
  const fieldList = map(
    currFields,
    (field: string): ListItem => {
      return getListItem(spreadsheet, activeData, field);
    },
  );
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
  spreadsheet,
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
    // if (spreadsheet?.isValueInCols()) {
    // the value hangs at the head of the column, match the displayed fields according to the metric itself
    // 1、multiple derivative indicators
    // 2、only one column scene
    // 3、the clicked cell belongs to the derived index column
    // tooltip need to show all derivative indicators
    if (
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

    return compact(valItem);
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

  return spreadsheet?.dataSet?.getFieldName(currentField);
};

export const getSelectedValueFields = (
  selectedData: TooltipDataItem[],
  field: string,
): string[] => {
  return uniq(selectedData.map((d) => get(d, field)));
};

export const getSelectedCellIndexes = (
  spreadsheet: SpreadSheet,
  layoutResult,
  cellInfo,
) => {
  const { rowLeafNodes, colLeafNodes } = layoutResult;
  const selectedIndexes = [];
  const currentState = spreadsheet.interaction.getState();
  const cells = currentState?.cells;
  if (cells?.[0]?.cellType === CellTypes.COL_CELL) {
    const currentHeaderCell = find(
      cells,
      (cell) => cell.getMeta().colIndex === cellInfo.colIndex,
    );
    map(rowLeafNodes, (row, index) => {
      selectedIndexes.push([index, currentHeaderCell.getMeta().colIndex]);
    });
  } else if (cells?.[0]?.cellType === CellTypes.ROW_CELL) {
    const currentHeaderCell = find(
      cells,
      (cell) => cell.getMeta().rowIndex === cellInfo.rowIndex,
    );
    map(colLeafNodes, (col, index) => {
      selectedIndexes.push([currentHeaderCell.getMeta().rowIndex, index]);
    });
  }
  return selectedIndexes;
};

export const getSelectedData = (
  spreadsheet: SpreadSheet,
  cellInfo: TooltipDataItem,
  showSingleTips?: boolean,
): TooltipDataItem[] => {
  const layoutResult = spreadsheet?.facet?.layoutResult;
  let selectedData = [];
  const currentState = spreadsheet.interaction.getState();
  const cells = currentState?.cells;
  // 列头选择和行头选择没有存所有selected的cell，因此要遍历index对比，而selected则不需要
  if (showSingleTips) {
    // 行头列头单选多选
    const selectedCellIndexes = getSelectedCellIndexes(
      spreadsheet,
      layoutResult,
      cellInfo,
    );
    forEach(selectedCellIndexes, ([i, j]) => {
      const viewMeta = layoutResult.getCellMeta(i, j);
      const data = viewMeta?.data;
      if (!isNil(data)) {
        selectedData.push(data);
      }
    });
  } else {
    // 其他（刷选，datacell多选）
    const indexName = spreadsheet.options.valueInCols ? 'colIndex' : 'rowIndex';
    // 先筛选出同一index下的cell 避免重复计算
    const cellsWithCellIndex = filter(
      cells,
      (cell) => cell.getMeta()[indexName] === cellInfo[indexName],
    );

    selectedData = map(cellsWithCellIndex, (cell) =>
      get(cell.getMeta(), 'data'),
    );
  }
  return selectedData;
};

export const getSummaryProps = (
  params: SummaryParam,
): TooltipSummaryOptions => {
  const { spreadsheet, cellInfo, getShowValue, options = {} } = params;
  // 拿到选择的所有data-cell的数据
  const selectedData = getSelectedData(
    spreadsheet,
    cellInfo,
    options.showSingleTips,
  );
  const currentField = cellInfo[EXTRA_FIELD];
  const currentFormatter = getFieldFormatter(spreadsheet, currentField);
  const name = getSummaryName(spreadsheet, currentField, options?.isTotals);
  let value: number | string;
  if (getShowValue) {
    value = getShowValue(selectedData, VALUE_FIELD);
  }
  const dataSum = getDataSumByField(selectedData, VALUE_FIELD);
  value = parseFloat(dataSum.toPrecision(PRECISION)); // solve accuracy problems
  if (currentFormatter) {
    value = currentFormatter(dataSum);
  }
  return {
    selectedData: selectedData as any,
    name: name,
    value,
  };
};

const mergeSummaries = (summaries) => {
  const result = [];
  each(summaries, (summary) => {
    if (summary) {
      const summaryInResultIndex = findIndex(
        result,
        (i) => i?.name === summary?.name,
      );
      if (summaryInResultIndex > -1) {
        result[summaryInResultIndex].value += summary.value;
        result[summaryInResultIndex].selectedData = result[
          summaryInResultIndex
        ]?.selectedData?.concat(summary?.selectedData || []);
      } else {
        result.push(summary);
      }
    }
  });
  return result;
};

export const getTooltipData = (params: TooltipDataParam) => {
  const { spreadsheet, cellInfos, options = {}, getShowValue } = params;
  let summaries = null;
  let headInfo = null;
  let details = null;
  const firstCellInfo = get(cellInfos, '0') || {};
  // TODO：tabular类型数据需要补充兼容
  if (!options?.hideSummary) {
    // 计算多项的sum（默认为sum，可自定义）
    summaries = map(cellInfos, (cellInfo) =>
      getSummaryProps({
        spreadsheet,
        cellInfo,
        options,
        getShowValue,
      }),
    );
    // 如果summaries中有相同name的项，则合并为同一项；
    summaries = mergeSummaries(summaries);
  } else if (options.showSingleTips) {
    // 行列头hover
    const metaName = find(
      spreadsheet?.dataCfg?.meta,
      (item) => item?.field === firstCellInfo.value,
    )?.name;
    firstCellInfo.name = metaName || firstCellInfo.value || '';
  } else {
    headInfo = getHeadInfo(spreadsheet, firstCellInfo, options);
    details = getDetailList(spreadsheet, firstCellInfo, options);
  }
  const { interpretation, infos, tips, name } = firstCellInfo || {};
  return { summaries, interpretation, infos, tips, name, headInfo, details };
};

export const getRightAndValueField = (
  spreadsheet: SpreadSheet,
  options: TooltipOptions,
): { rightField: string; valueField: string } => {
  const rowFields = spreadsheet?.dataSet?.fields?.rows || [];
  const rowQuery = options?.rowQuery || {};
  const rightField = getRightFieldInQuery(rowQuery, rowFields);
  const valueField = get(rowQuery, rightField, '');

  return { rightField, valueField };
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
