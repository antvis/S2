// TODO: tooltip util 有点case by case
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
  size,
  filter,
  concat,
  compact,
  find,
  findIndex,
  each,
  isEmpty,
} from 'lodash';
import { i18n } from '../common/i18n';
import {
  CellTypes,
  EXTRA_FIELD,
  TOTAL_VALUE,
  VALUE_FIELD,
} from '@/common/constant';
import getRightFieldInQuery from '../facet/layout/util/get-right-field-in-query';
import {
  DataItem,
  Aggregation,
  TooltipOptions,
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
import { InteractionStateName } from '@/common/constant';

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
  data: DataItem,
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
  hoverData: DataItem,
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

export const getHeadInfo = (
  spreadsheet: SpreadSheet,
  hoverData: DataItem,
): HeadInfo => {
  if (hoverData) {
    const colFields = get(spreadsheet?.dataSet?.fields, 'columns', []);
    const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
    const colList = getFieldList(spreadsheet, colFields, hoverData);
    const rowList = getFieldList(spreadsheet, rowFields, hoverData);

    return { cols: colList, rows: rowList };
  }

  return { cols: [], rows: [] };
};

export const getDerivedItemList = (
  spreadsheet: SpreadSheet,
  valItem,
  derivedValue,
  hoverData: DataItem,
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

export const getDetailList = (
  spreadsheet,
  hoverData: DataItem,
  options: TooltipOptions,
): ListItem[] => {
  if (hoverData) {
    const { isTotals } = options;

    let valItem = [];
    if (isTotals) {
      // total/subtotal
      valItem.push(
        getListItem(
          spreadsheet,
          hoverData,
          TOTAL_VALUE,
          get(hoverData, VALUE_FIELD),
        ),
      );
    } else {
      const field = hoverData[EXTRA_FIELD];
      if (hoverData[field]) {
        // filter empty
        valItem.push(getListItem(spreadsheet, hoverData, field));
      }
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
  valueFields,
  currentField,
  cellInfo,
): string => {
  if (get(cellInfo, 'isGrandTotals')) {
    return i18n('总计');
  }

  return spreadsheet?.dataSet?.getFieldName(currentField);
};

export const getSelectedValueFields = (
  selectedData: DataItem[],
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
  if (isEmpty(cells)) return null;
  if (cells[0]?.cellType === CellTypes.COL_CELL) {
    const currentHeaderCell = find(
      cells,
      (cell) => cell.getMeta().colIndex === cellInfo.colIndex,
    );
    map(rowLeafNodes, (row, index) => {
      selectedIndexes.push([index, currentHeaderCell.getMeta().colIndex]);
    });
  } else if (cells[0]?.cellType === CellTypes.ROW_CELL) {
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
  cellInfo: DataItem,
): DataItem[] => {
  const layoutResult = spreadsheet?.facet?.layoutResult;
  let selectedData = [];
  const currentState = spreadsheet.getCurrentState();
  const stateName = currentState?.stateName;
  const cells = currentState?.cells;
  // 列头选择和行头选择没有存所有selected的cell，因此要遍历index对比，而selected则不需要
  if (stateName === InteractionStateName.SELECTED) {
    // 行头列头单选多选
    const selectedCellIndexes = getSelectedCellIndexes(
      spreadsheet,
      layoutResult,
      cellInfo,
    );
    forEach(selectedCellIndexes, ([i, j]) => {
      const viewMeta = layoutResult.getCellMeta(i, j);
      const data = get(viewMeta, 'data[0]');
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
      get(cell.getMeta(), 'data[0]'),
    );
  }
  return selectedData;
};

export const getSummaryProps = (
  spreadsheet: SpreadSheet,
  cellInfo: DataItem,
  options: TooltipOptions,
  aggregation: Aggregation = 'SUM',
): SummaryProps => {
  // 拿到列内所有data-cell的数据
  const selectedData = getSelectedData(spreadsheet, cellInfo);
  const valueFields = getSelectedValueFields(selectedData, EXTRA_FIELD);
  if (size(valueFields) > 0) {
    const currentField = cellInfo[EXTRA_FIELD];
    const currentFormatter = getFieldFormatter(spreadsheet, currentField);
    const name = getSummaryName(
      spreadsheet,
      valueFields,
      currentField,
      cellInfo,
    );
    let aggregationValue = getAggregationValue(
      selectedData,
      VALUE_FIELD,
      aggregation,
    );
    aggregationValue = parseFloat(aggregationValue.toPrecision(12)); // solve accuracy problems
    const value = currentFormatter(aggregationValue);
    return {
      selectedData: selectedData as any,
      name,
      value,
    };
  }
};

const mergeSummaries = (summaries) => {
  const result = [];
  each(summaries, (summary) => {
    const summaryInResultIndex = findIndex(
      result,
      (i) => i?.name === summary?.name,
    );
    if (summaryInResultIndex > -1) {
      result[summaryInResultIndex].value += summary.value;
      result[summaryInResultIndex].selectedData = result[
        summaryInResultIndex
      ].selectedData.concat(summary.selectedData);
    } else {
      result.push(summary);
    }
  });
  return result;
};

export const getTooltipData = (
  spreadsheet: SpreadSheet,
  cellInfos?: DataProps[],
  options?: TooltipOptions,
  aggregation?: Aggregation,
) => {
  let summaries = null;
  let headInfo = null;
  let details = null;
  if (!options?.hideSummary) {
    // 计算总计小计
    summaries = map(cellInfos, (cellInfo) =>
      getSummaryProps(spreadsheet, cellInfo as any, options, aggregation),
    );
    // 如果summaries中有相同name的向，则合并为同一项；
    summaries = mergeSummaries(summaries);
  } else {
    // 如果隐藏总计小计说明是datacell点击，只展示单个cell的详细信息
    headInfo = getHeadInfo(spreadsheet, cellInfos[0] as any);
    details = getDetailList(spreadsheet, cellInfos[0] as any, options);
  }
  const { interpretation, infos, tips } = cellInfos[0] || {};
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
  hoverData: DataItem,
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
