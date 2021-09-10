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
import {
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
} from '..';
import { handleDataItem } from './cell/data-cell';
import { isMultiDataItem } from './data-item-type-checker';
import { getRightFieldInQuery } from '@/facet/layout/util/get-right-field-in-query';
import { i18n } from '@/common/i18n';
import {
  POSITION_X_OFFSET,
  POSITION_Y_OFFSET,
} from '@/common/constant/tooltip';
import {
  CellTypes,
  EXTRA_FIELD,
  PRECISION,
  VALUE_FIELD,
} from '@/common/constant';

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

  return (Number.parseInt(number1) + Number.parseInt(number2)) / m;
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
      const v = isNotNumber(fieldValue) ? 0 : Number.parseFloat(fieldValue);

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

export const getMergedQuery = (meta) => {
  return { ...meta?.colQuery, ...meta?.rowQuery };
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
  const { cells = [], nodes = [] } = spreadsheet.interaction.getState();
  const cellType = cells?.[0]?.cellType;

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
    (cell) => cell.getMeta()?.data || getMergedQuery(cell.getMeta()),
  );
};

export const getSummaries = (params: SummaryParam): TooltipSummaryOptions[] => {
  const { spreadsheet, getShowValue, options = {} } = params;
  const summaries = [];
  const summary = {};
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
    if (every(selected, (item) => isNotNumber(get(item, VALUE_FIELD)))) {
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

export const getActiveCellsTooltipData = (
  spreadsheet: SpreadSheet,
): TooltipData[] => {
  const cellInfos: TooltipData[] = [];
  if (!spreadsheet.interaction.isSelectedState()) {
    return [];
  }
  spreadsheet.interaction.getActiveCells().forEach((cell) => {
    const valueInCols = spreadsheet.options.valueInCols;
    const meta = cell.getMeta();
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
