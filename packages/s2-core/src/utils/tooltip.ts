// TODO: tooltip util 有点case by case
import {
  CellTypes,
  EXTRA_FIELD,
  InteractionStateName,
  TOTAL_VALUE,
  VALUE_FIELD,
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
  noop,
  size,
  some,
  sumBy,
  uniq,
} from 'lodash';
import {
  Aggregation,
  Data,
  DataItem,
  ListItem,
  SpreadSheet,
  TooltipData,
  TooltipHeadInfo,
  TooltipOptions,
  TooltipPosition,
  TooltipSummaryOptions,
} from '..';
import { i18n } from '../common/i18n';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '../common/tooltip/constant';
import getRightFieldInQuery from '../facet/layout/util/get-right-field-in-query';
import { handleDataItem } from './data-cell';
import { isMultiDataItem } from './data-item-type-checker';

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
  data: Data,
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
  hoverData: Data,
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
  hoverData: Data,
): TooltipHeadInfo => {
  if (hoverData) {
    const colFields = get(spreadsheet?.dataSet?.fields, 'columns', []);
    const rowFields = get(spreadsheet?.dataSet?.fields, 'rows', []);
    const colList = getFieldList(spreadsheet, colFields, hoverData);
    const rowList = getFieldList(spreadsheet, rowFields, hoverData);

    return { cols: colList, rows: rowList };
  }

  return { cols: [], rows: [] };
};

export const getDetailList = (
  spreadsheet: SpreadSheet,
  hoverData: Data,
  options: TooltipOptions,
): ListItem[] => {
  if (hoverData) {
    const { isTotals } = options;

    const valItem = [];
    if (isTotals) {
      // total/subtotal
      valItem.push(
        getListItem(
          spreadsheet,
          hoverData,
          TOTAL_VALUE,
          get(hoverData, VALUE_FIELD) as string,
        ),
      );
    } else {
      const field = hoverData[EXTRA_FIELD] as string;
      const value = hoverData[field];
      // filter empty
      if (value) {
        // multiple data should be mapped firstly
        if (
          isMultiDataItem(value) &&
          spreadsheet.getTooltipDataItemMappingCallback()
        ) {
          const mappedResult = handleDataItem(
            hoverData,
            spreadsheet.getTooltipDataItemMappingCallback(),
          ) as Record<string, string | number>;

          forEach(mappedResult, (_, key) => {
            valItem.push(getListItem(spreadsheet, mappedResult, key));
          });
        } else {
          valItem.push(getListItem(spreadsheet, hoverData, field));
        }
      }
    }

    return compact(valItem);
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
  cellInfo: DataItem,
): DataItem[] => {
  const layoutResult = spreadsheet?.facet?.layoutResult;
  let selectedData = [];
  const currentState = spreadsheet.interaction.getState();
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
): TooltipSummaryOptions => {
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
  // each(summaries, (summary) => {
  //   const summaryInResultIndex = findIndex(
  //     result,
  //     (i) => i?.name === summary?.name,
  //   );
  //   if (summaryInResultIndex > -1) {
  //     result[summaryInResultIndex].value += summary.value;
  //     result[summaryInResultIndex].selectedData = result[
  //       summaryInResultIndex
  //     ].selectedData.concat(summary.selectedData);
  //   } else {
  //     result.push(summary);
  //   }
  // });
  return result;
};

// TODO: tooltip 很多cellInfos类型不正确，需要整体重新梳理
export const getTooltipData = (
  spreadsheet: SpreadSheet,
  cellInfos?: TooltipData[],
  options?: TooltipOptions,
  aggregation?: Aggregation,
): TooltipData => {
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
    headInfo = getHeadInfo(spreadsheet, cellInfos[0] as Data);
    details = getDetailList(spreadsheet, cellInfos[0] as Data, options);
    console.log('details,', details);
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
