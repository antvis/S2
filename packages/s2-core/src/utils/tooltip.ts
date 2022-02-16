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
  uniq,
  noop,
  mapKeys,
  every,
  isObject,
  isFunction,
  compact,
} from 'lodash';
import * as CSS from 'csstype';
import { Event as CanvasEvent } from '@antv/g-canvas';
import { handleDataItem } from './cell/data-cell';
import { isMultiDataItem } from './data-item-type-checker';
import { customMerge } from './merge';
import { AutoAdjustPositionOptions, Data, ListItem } from '@/common/interface';
import { LayoutResult } from '@/common/interface/basic';
import {
  SummaryParam,
  TooltipData,
  TooltipDataItem,
  TooltipDataParam,
  TooltipHeadInfo,
  TooltipOptions,
  TooltipPosition,
  TooltipSummaryOptions,
  BaseTooltipConfig,
  TooltipOperatorOptions,
  TooltipOperation,
  TooltipOperatorMenu,
} from '@/common/interface/tooltip';
import { TOOLTIP_POSITION_OFFSET } from '@/common/constant/tooltip';
import { S2CellType } from '@/common/interface/interaction';
import { SpreadSheet } from '@/sheet-type';
import { i18n } from '@/common/i18n';
import {
  CellTypes,
  EXTRA_FIELD,
  PRECISION,
  VALUE_FIELD,
} from '@/common/constant';
import { Tooltip, ViewMeta } from '@/common/interface';
import { isNotNumber, getDataSumByField } from '@/utils/number-calculate';

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
  let x = position.x + TOOLTIP_POSITION_OFFSET.x;
  let y = position.y + TOOLTIP_POSITION_OFFSET.y;

  if (!autoAdjustBoundary) {
    return {
      x,
      y,
    };
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

export const getTooltipDefaultOptions = (options?: TooltipOptions) => {
  return {
    operator: { onClick: noop, menus: [] },
    enterable: true,
    enableFormat: true,
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
  options: { style?: CSS.Properties; className?: string } = {
    className: '',
  },
) => {
  if (!container) {
    return;
  }
  const { style, className } = options;
  if (style) {
    Object.keys(style).forEach((item) => {
      container.style[item] = style[item];
    });
  }
  if (className) {
    container.classList.add(className);
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

  return (v: unknown, data?: Data) => {
    return getFriendlyVal(formatter(v, data));
  };
};

export const getListItem = (
  spreadsheet: SpreadSheet,
  {
    data,
    field,
    valueField,
    useCompleteDataForFormatter = true,
  }: {
    data: TooltipDataItem;
    field: string;
    valueField?: string;
    useCompleteDataForFormatter?: boolean;
  },
): ListItem => {
  const name = spreadsheet?.dataSet?.getFieldName(field);
  const formatter = getFieldFormatter(spreadsheet, field);
  // 暂时对 object 类型 data 不作处理，上层通过自定义 tooltip 的方式去自行定制
  const dataValue = isObject(data[field])
    ? JSON.stringify(data[field])
    : data[field];
  const value = formatter(
    valueField || dataValue,
    useCompleteDataForFormatter ? data : undefined,
  );

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
    return getListItem(spreadsheet, {
      data: activeData,
      field,
      useCompleteDataForFormatter: false,
    });
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
        getListItem(spreadsheet, {
          data: activeData,
          field,
          valueField: get(activeData, VALUE_FIELD),
        }),
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
        valItem.push(
          getListItem(spreadsheet, { data: mappedResult, field: key }),
        );
      });
    } else {
      valItem.push(getListItem(spreadsheet, { data: activeData, field }));
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
      value = spreadsheet.options.placeholder;
    } else {
      const dataSum = getDataSumByField(selected, VALUE_FIELD);
      value = parseFloat(dataSum.toPrecision(PRECISION)); // solve accuracy problems
      if (currentFormatter) {
        value = currentFormatter(dataSum, selected);
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
  if (!options?.hideSummary) {
    // 计算多项的sum（默认为sum，可自定义）
    summaries = getSummaries({
      spreadsheet,
      options,
      getShowValue,
    });
  } else if (options.showSingleTips) {
    // 行列头hover & 明细表所有hover
    const getFieldName = (field: string) =>
      find(spreadsheet.dataCfg?.meta, (item) => item?.field === field)?.name;

    const currentFormatter = getFieldFormatter(
      spreadsheet,
      firstCellInfo.valueField,
    );
    const formattedValue = currentFormatter(firstCellInfo.value);
    const cellName = options.enableFormat
      ? getFieldName(firstCellInfo.value) || formattedValue
      : getFieldName(firstCellInfo.valueField);

    firstCellInfo.name = cellName || '';
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
  cellTooltipConfig: Tooltip = {},
  cellType: CellTypes,
): Tooltip => {
  const getOptionsByCell = (cellConfig: BaseTooltipConfig) => {
    return customMerge(cellTooltipConfig, cellConfig);
  };

  const { col, row, data, corner } = cellTooltipConfig;

  if (cellType === CellTypes.COL_CELL) {
    return getOptionsByCell(col);
  }
  if (cellType === CellTypes.ROW_CELL) {
    return getOptionsByCell(row);
  }
  if (cellType === CellTypes.DATA_CELL) {
    return getOptionsByCell(data);
  }
  if (cellType === CellTypes.CORNER_CELL) {
    return getOptionsByCell(corner);
  }

  return { ...cellTooltipConfig };
};

export const getTooltipOptions = (
  spreadsheet: SpreadSheet,
  event: CanvasEvent | MouseEvent | Event,
): Tooltip => {
  const cellType = spreadsheet.getCellType?.(event.target);
  return getTooltipOptionsByCellType(spreadsheet.options.tooltip, cellType);
};

export const getTooltipVisibleOperator = (
  operation: TooltipOperation,
  options: { defaultMenus?: TooltipOperatorMenu[]; cell: S2CellType },
): TooltipOperatorOptions => {
  const { defaultMenus = [], cell } = options;

  const getDisplayMenus = (menus: TooltipOperatorMenu[] = []) => {
    return menus
      .filter((menu) => {
        return isFunction(menu.visible)
          ? menu.visible(cell)
          : menu.visible ?? true;
      })
      .map((menu) => {
        if (menu.children) {
          menu.children = getDisplayMenus(menu.children);
        }
        return menu;
      });
  };
  const displayMenus = getDisplayMenus(operation.menus);

  return {
    onClick: operation.onClick,
    menus: compact([...defaultMenus, ...displayMenus]),
  };
};
