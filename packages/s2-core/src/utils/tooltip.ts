/**
 * 获取tooltip中需要显示的数据项
 */

import {
  sumBy,
  get,
  isNil,
  some,
  isEqual,
  noop,
  isNumber,
  uniq,
  forEach,
  map,
  filter,
  concat,
  compact,
  find,
  findIndex,
  each,
  isEmpty,
} from 'lodash';
import { i18n } from '../common/i18n';
import { CellTypes, EXTRA_FIELD, VALUE_FIELD } from '@/common/constant';
import getRightFieldInQuery from '../facet/layout/util/get-right-field-in-query';
import {
  TooltipDataItem,
  TooltipDataParam,
  TooltipOptions,
  SummaryParam,
  Position,
  SummaryProps,
  ListItem,
  HeadInfo,
  DataProps,
  SpreadSheet,
} from '..';
import { getDerivedDataState } from '../utils/text';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '../common/tooltip/constant';

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
  hoverData: TooltipDataItem,
): boolean => {
  return some(selectedData, (dataItem: TooltipDataItem): boolean =>
    isEqual(dataItem, hoverData),
  );
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
  let icon;
  if (spreadsheet?.isDerivedValue(field)) {
    if (data[field]) {
      if (!getDerivedDataState(data[field])) {
        icon = 'CellDown';
      } else {
        icon = 'CellUp';
      }
    }
  }
  return {
    name,
    value,
    icon,
  };
};

export const getFieldList = (
  spreadsheet: SpreadSheet,
  fields: string[],
  hoverData: TooltipDataItem,
): ListItem[] => {
  const currFields = filter(
    concat([], fields),
    (field) => field !== EXTRA_FIELD && hoverData[field],
  );
  const fieldList = map(currFields, (field: string): ListItem => {
    return getListItem(spreadsheet, hoverData, field);
  });
  return fieldList;
};

/**
 * 获取选中格行/列头信息
 * @param spreadsheet
 * @param hoverData
 */
export const getHeadInfo = (
  spreadsheet: SpreadSheet,
  hoverData: TooltipDataItem,
  options?: TooltipOptions,
): HeadInfo => {
  const { isTotals } = options || {};
  let colList = [];
  let rowList = [];
  if (hoverData) {
    const colFields = get(spreadsheet?.dataSet?.fields, 'columns', []);
    const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
    colList = getFieldList(spreadsheet, colFields, hoverData);
    rowList = getFieldList(spreadsheet, rowFields, hoverData);
  }

  // 此时是总计-总计
  if (isEmpty(colList) && isEmpty(rowList) && isTotals) {
    colList = [{ value: i18n('总计') }];
  }

  return { cols: colList, rows: rowList };
};

export const getDerivedItemList = (
  spreadsheet: SpreadSheet,
  valItem,
  derivedValue,
  hoverData: TooltipDataItem,
) => {
  // replace old valItem
  valItem = map(derivedValue.derivedValueField, (value: any) => {
    return getListItem(spreadsheet, hoverData, value);
  });
  // add main indicator -- not empty
  if (hoverData[derivedValue.valueField]) {
    valItem.unshift(
      getListItem(spreadsheet, hoverData, derivedValue.valueField),
    );
  }
  return valItem;
};

/**
 * 获取数据明细
 * @param spreadsheet
 * @param hoverData
 * @param options
 */
export const getDetailList = (
  spreadsheet,
  hoverData: TooltipDataItem,
  options: TooltipOptions,
): ListItem[] => {
  if (hoverData) {
    const { isTotals } = options;
    const field = hoverData[EXTRA_FIELD];
    let valItem = [];
    if (isTotals) {
      // total/subtotal
      valItem.push(
        getListItem(spreadsheet, hoverData, field, get(hoverData, VALUE_FIELD)),
      );
    } else {
      valItem.push(getListItem(spreadsheet, hoverData, field));
      const derivedValue = spreadsheet?.getDerivedValue(field);
      if (spreadsheet?.isValueInCols()) {
        // the value hangs at the head of the column, match the displayed fields according to the metric itself
        // 1、multiple derivative indicators
        // 2、only one column scene
        // 3、the clicked cell belongs to the derived index column
        // tooltip need to show all derivative indicators
        if (
          derivedValue.derivedValueField.length > 1 &&
          !isEqual(
            derivedValue.derivedValueField,
            derivedValue.displayDerivedValueField,
          ) &&
          spreadsheet?.isDerivedValue(field)
        ) {
          valItem = getDerivedItemList(
            spreadsheet,
            valItem,
            derivedValue,
            hoverData,
          );
        }
        // the value hangs at the head of the row，need to show all derivative indicators
      } else if (derivedValue.derivedValueField.length > 0) {
        valItem = getDerivedItemList(
          spreadsheet,
          valItem,
          derivedValue,
          hoverData,
        );
      }
    }

    return compact(concat([], [...valItem]));
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
  const currentState = spreadsheet.getCurrentState();
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
  isHeader?: boolean,
): TooltipDataItem[] => {
  const layoutResult = spreadsheet?.facet?.layoutResult;
  let selectedData = [];
  const currentState = spreadsheet.getCurrentState();
  const cells = currentState?.cells;
  // 列头选择和行头选择没有存所有selected的cell，因此要遍历index对比，而selected则不需要
  if (isHeader) {
    // 行头列头单选多选
    const selectedCellIndexes = getSelectedCellIndexes(
      spreadsheet,
      layoutResult,
      cellInfo,
    );
    forEach(selectedCellIndexes, ([i, j]) => {
      const viewMeta = layoutResult.getCellMeta(i, j);
      const data = get(viewMeta, 'data');
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

export const getSummaryProps = (params: SummaryParam): SummaryProps => {
  const { spreadsheet, cellInfo, isHeader, getShowValue, options } = params;
  // 拿到选择的所有data-cell的数据
  const selectedData = getSelectedData(spreadsheet, cellInfo, isHeader);
  // const valueFields = getSelectedValueFields(selectedData, EXTRA_FIELD);
  const currentField = cellInfo[EXTRA_FIELD];
  const currentFormatter = getFieldFormatter(spreadsheet, currentField);
  const name = getSummaryName(spreadsheet, currentField, options?.isTotals);
  let value: number | string;
  if (getShowValue) {
    value = getShowValue(selectedData, VALUE_FIELD);
  }
  const dataSum = getDataSumByField(selectedData, VALUE_FIELD);
  value = parseFloat(dataSum.toPrecision(12)); // solve accuracy problems
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
  const { spreadsheet, cellInfos, isHeader, options, getShowValue } = params;
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
        isHeader,
        options,
        getShowValue,
      }),
    );
    // 如果summaries中有相同name的向，则合并为同一项；
    summaries = mergeSummaries(summaries);
  } else {
    // 如果隐藏总计小计说明是datacell点击，只展示单个cell的详细信息
    headInfo = getHeadInfo(spreadsheet, firstCellInfo, options);
    details = getDetailList(spreadsheet, firstCellInfo, options);
  }
  const { interpretation, infos, tips } = firstCellInfo || {};
  return { summaries, interpretation, infos, tips, headInfo, details };
};

export const getRightAndValueField = (
  spreadsheet: SpreadSheet,
  options: TooltipOptions,
): { rightField: string; valueField: string } => {
  const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
  const rowQuery = options?.rowQuery || {};
  const rightField = getRightFieldInQuery(rowQuery, rowFields);
  const valueField = get(rowQuery, rightField, '');

  return { rightField, valueField };
};

export const getStrategySummary = (
  spreadsheet: SpreadSheet,
  hoverData: Record<string, any>,
  options: TooltipOptions,
): SummaryProps => {
  if (hoverData) {
    const { valueField } = getRightAndValueField(spreadsheet, options);
    const { name, value } = getListItem(
      spreadsheet,
      hoverData as any,
      valueField,
    );

    return {
      selectedData: [hoverData],
      name,
      value,
    };
  }
  return null;
};

export const getDerivedValues = (
  spreadsheet: SpreadSheet,
  valueField: string,
): string[] => {
  const derivedValue = spreadsheet?.getDerivedValue(valueField);
  if (derivedValue) {
    return derivedValue.derivedValueField;
  }
  return [];
};

export const getStrategyDetailList = (
  spreadsheet: SpreadSheet,
  hoverData: Record<string, any>,
  options: TooltipOptions,
): ListItem[] => {
  if (hoverData) {
    const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
    // if rows is not empty and values is data, use normal-tooltip
    if (rowFields.find((item) => item === EXTRA_FIELD)) {
      return getDetailList(spreadsheet, hoverData as any, options);
    }
    // the value hangs at the head of the column
    const { rightField, valueField } = getRightAndValueField(
      spreadsheet,
      options,
    );
    // show all derivative indicators no matter have value
    const valuesField = [
      rightField,
      ...getDerivedValues(spreadsheet, valueField),
    ];

    return map(valuesField, (field: string): ListItem => {
      if (isEqual(field, rightField)) {
        // the value of the measure dimension is taken separately
        return getListItem(spreadsheet, hoverData as any, hoverData[field]);
      }

      return getListItem(spreadsheet, hoverData as any, field);
    });
  }
};

export const getStrategyHeadInfo = (
  spreadsheet: SpreadSheet,
  hoverData: TooltipDataItem,
  options?: TooltipOptions,
): HeadInfo => {
  const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
  // if rows is not empty and values is data, use normal-tooltip
  if (rowFields.find((item) => item === EXTRA_FIELD)) {
    return getHeadInfo(spreadsheet, hoverData);
  }
  // the value hangs at the head of the column
  const { rightField } = getRightAndValueField(spreadsheet, options);
  const index = rowFields.indexOf(rightField);
  const rows = [...rowFields];
  if (index !== -1) {
    rows.splice(index + 1);
  }
  if (hoverData) {
    const colFields = get(spreadsheet?.dataSet?.fields, 'columns', []);
    const colList = getFieldList(spreadsheet, colFields, hoverData);
    const rowList = getFieldList(spreadsheet, rows, hoverData);

    return { cols: colList, rows: rowList };
  }

  return { cols: [], rows: [] };
};

export const getStrategyTooltipData = (
  spreadsheet: SpreadSheet,
  data?: DataProps,
  options?: TooltipOptions,
) => {
  const { interpretation, infos, tips } = data || {};
  const summaries = getStrategySummary(spreadsheet, data, options);
  const headInfo = getStrategyHeadInfo(spreadsheet, data as any);
  const details = getStrategyDetailList(spreadsheet, data, options);

  return { summaries, headInfo, details, interpretation, infos, tips };
};
