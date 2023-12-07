/**
 * 获取tooltip中需要显示的数据项
 */

import type { Event as CanvasEvent } from '@antv/g-canvas';
import type * as CSS from 'csstype';
import {
  assign,
  compact,
  concat,
  every,
  filter,
  find,
  forEach,
  get,
  isEmpty,
  isEqual,
  isFunction,
  isNil,
  isNumber,
  isObject,
  map,
  mapKeys,
  noop,
  pick,
} from 'lodash';
import {
  CellTypes,
  EXTRA_FIELD,
  PRECISION,
  VALUE_FIELD,
} from '../common/constant';
import {
  TOOLTIP_CONTAINER_HIDE_CLS,
  TOOLTIP_CONTAINER_SHOW_CLS,
  TOOLTIP_POSITION_OFFSET,
} from '../common/constant/tooltip';
import { i18n } from '../common/i18n';
import type {
  AutoAdjustPositionOptions,
  Data,
  LayoutResult,
  Tooltip,
  TooltipDetailListItem,
  TooltipSummaryOptionsValue,
  ViewMeta,
} from '../common/interface';
import type { S2CellType } from '../common/interface/interaction';
import type {
  BaseTooltipConfig,
  SummaryParam,
  TooltipData,
  TooltipDataItem,
  TooltipDataParam,
  TooltipHeadInfo,
  TooltipOperation,
  TooltipOperatorMenu,
  TooltipOperatorOptions,
  TooltipOptions,
  TooltipPosition,
  TooltipSummaryOptions,
} from '../common/interface/tooltip';
import { getLeafColumnsWithKey } from '../facet/utils';
import type { SpreadSheet } from '../sheet-type';
import { getDataSumByField, isNotNumber } from '../utils/number-calculate';
import { handleDataItem } from './cell/data-cell';
import { isMultiDataItem } from './data-item-type-checker';
import { customMerge } from './merge';
import { getEmptyPlaceholder } from './text';

/**
 * calculate tooltip show position
 */
export const getAutoAdjustPosition = ({
  spreadsheet,
  position,
  tooltipContainer,
  autoAdjustBoundary,
}: AutoAdjustPositionOptions): TooltipPosition => {
  const canvas = spreadsheet.getCanvasElement();

  let x = position.x + TOOLTIP_POSITION_OFFSET.x;
  let y = position.y + TOOLTIP_POSITION_OFFSET.y;

  if (!autoAdjustBoundary || !canvas) {
    return {
      x,
      y,
    };
  }

  const isAdjustBodyBoundary = autoAdjustBoundary === 'body';
  const { maxX, maxY } = spreadsheet.facet.panelBBox;
  const { width, height } = spreadsheet.options;

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

export const getTooltipDefaultOptions = <
  Icon = Element | string,
  Text = string,
>(
  options?: TooltipOptions<Icon, Text>,
): TooltipOptions<Icon, Text> => {
  return {
    operator: { onClick: noop, menus: [] },
    enterable: true,
    enableFormat: true,
    ...options,
  };
};

export const getMergedQuery = (meta: ViewMeta) => {
  return { ...meta?.colQuery, ...meta?.rowQuery };
};

export const setTooltipContainerStyle = (
  container: HTMLElement,
  options: {
    visible?: boolean;
    style?: CSS.Properties;
    className?: string[];
  },
) => {
  if (!container) {
    return;
  }

  const { style, className = [], visible } = options;

  if (style) {
    Object.assign(container.style, style);
  }

  if (className.length) {
    const classList = className.filter(Boolean);
    container.classList.add(...classList);
  }

  container.classList.toggle(TOOLTIP_CONTAINER_SHOW_CLS, visible);
  container.classList.toggle(TOOLTIP_CONTAINER_HIDE_CLS, !visible);
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
): TooltipDetailListItem => {
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
): TooltipDetailListItem[] => {
  const currFields = filter(
    concat([], fields),
    (field) => field !== EXTRA_FIELD && activeData[field],
  );
  const fieldList = map(currFields, (field: string): TooltipDetailListItem => {
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
    colList = getFieldList(
      spreadsheet,
      getLeafColumnsWithKey(colFields || []),
      activeData,
    );
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
export const getTooltipDetailList = (
  spreadsheet: SpreadSheet,
  activeData: TooltipDataItem,
  options: TooltipOptions,
): TooltipDetailListItem[] => {
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
  currentField: string,
  isTotals: boolean,
): string => {
  if (isTotals) {
    return i18n('总计');
  }

  const name = spreadsheet?.dataSet?.getFieldName(currentField);
  return name && name !== 'undefined' ? name : '';
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
  const { nodes = [], cells = [] } = spreadsheet.interaction.getState();
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
  targetCell: S2CellType,
  showSingleTips?: boolean,
): TooltipDataItem[] => {
  const layoutResult = spreadsheet.facet?.layoutResult;

  /**
   * 当开启小计/总计后
   * 1. [点击列头单元格时], 选中列所对应的数值单元格的数据如果是小计/总计, 则不应该参与计算:
   *  - 1.1 [小计/总计 位于行头]: 点击的都是 (普通列头), 需要去除 (数值单元格) 对应 (行头为小计) 的单元格的数据
   *  - 1.2 [小计/总计 位于列头]: 点击的是 (普通列头/小计/总计列头), 由于行头没有, 所有数值单元格参与计算即可
   *  - 1.3  [小计/总计 同时位于行头/列头]: 和 1.1 处理一致

   * 2. [点击行头单元格时]:
   *  - 2.1 如果本身就是小计/总计单元格, 且列头无小计/总计, 则当前行所有 (数值单元格) 参与计算
   *  - 2.2 如果本身不是小计/总计单元格, 去除当前行/列 (含子节点) 所对应小计/总计数据

   * 3. [刷选/多选], 暂不考虑这种场景
   *  - 3.1 如果全部是小计或全部是总计单元格, 则正常计算
   *  - 3.2 如果部分是, 如何处理? 小计/总计不应该被选中, 还是数据不参与计算?
   *  - 3.3 如果选中的含有小计, 并且有总计, 数据参与计算也没有意义, 如何处理?
   */
  const isBelongTotalCell = (cellMeta: ViewMeta) => {
    const targetCellMeta = targetCell?.getMeta();
    // target: 当前点击的单元格类型
    const isTargetTotalCell = targetCellMeta?.isTotals;
    const isTargetColCell = targetCell?.cellType === CellTypes.COL_CELL;
    const isTargetRowCell = targetCell?.cellType === CellTypes.ROW_CELL;

    if (!isTargetColCell && !isTargetRowCell) {
      return false;
    }

    const currentColCellNode = layoutResult.colNodes.find(
      (node) => node.colIndex === cellMeta.colIndex,
    );

    const currentRowCellNode = layoutResult.rowNodes.find(
      (node) => node.rowIndex === cellMeta.rowIndex,
    );

    // 行头点击, 去除列头对应的小计/总计, 列头相反
    const isTotalCell = isTargetColCell
      ? currentRowCellNode?.isTotals
      : currentColCellNode?.isTotals;

    return (
      (!isTargetTotalCell && cellMeta?.isTotals) ||
      (isTargetTotalCell && isTotalCell)
    );
  };

  // 列头选择和行头选择没有存所有selected的cell，因此要遍历index对比，而selected则不需要
  if (showSingleTips) {
    // 行头列头单选多选
    const selectedCellIndexes = getSelectedCellIndexes(
      spreadsheet,
      layoutResult,
    );

    return compact(
      map(selectedCellIndexes, ([i, j]) => {
        const currentCellMeta = layoutResult.getCellMeta(i, j);
        if (isBelongTotalCell(currentCellMeta)) {
          return;
        }
        return currentCellMeta?.data || getMergedQuery(currentCellMeta);
      }),
    );
  }
  // 其他（刷选，data cell多选）
  const cells = spreadsheet.interaction.getCells();
  return cells
    .filter((cellMeta) => {
      const meta = layoutResult.getCellMeta(
        cellMeta.rowIndex,
        cellMeta.colIndex,
      );
      return !isBelongTotalCell(meta);
    })
    .map((cellMeta) => {
      const meta = layoutResult.getCellMeta(
        cellMeta.rowIndex,
        cellMeta.colIndex,
      );
      return meta?.data || getMergedQuery(meta);
    });
};

export const getSummaries = (params: SummaryParam): TooltipSummaryOptions[] => {
  const { spreadsheet, targetCell, options = {} } = params;
  const summaries: TooltipSummaryOptions[] = [];
  const summary: TooltipDataItem = {};
  const isTableMode = spreadsheet.isTableMode();

  if (isTableMode && options?.showSingleTips) {
    const meta = targetCell.getMeta();
    // 如果是列头, 获取当前列所有数据, 其他则获取当前整行 (1条数据)
    const selectedCellsData = meta?.field
      ? spreadsheet.dataSet.getMultiData({ field: meta.field })
      : [spreadsheet.dataSet.getRowData(meta)];

    return [{ selectedData: selectedCellsData, name: '', value: '' }];
  }

  // 拿到选择的所有 dataCell的数据
  const selectedCellsData = getSelectedCellsData(
    spreadsheet,
    targetCell,
    options.showSingleTips,
  );

  forEach(selectedCellsData, (item) => {
    if (summary[item?.[EXTRA_FIELD]]) {
      summary[item?.[EXTRA_FIELD]]?.push(item);
    } else {
      summary[item?.[EXTRA_FIELD]] = [item];
    }
  });

  mapKeys(summary, (selected, field) => {
    const name = getSummaryName(spreadsheet, field, options?.isTotals);
    let value: TooltipSummaryOptionsValue = '';
    let originVal: TooltipSummaryOptionsValue = '';

    if (every(selected, (item) => isNotNumber(get(item, VALUE_FIELD)))) {
      const { placeholder } = spreadsheet.options;
      const emptyPlaceholder = getEmptyPlaceholder(summary, placeholder);
      // 如果选中的单元格都无数据，则显示"-" 或 options 里配置的占位符
      value = emptyPlaceholder;
      originVal = emptyPlaceholder;
    } else {
      const currentFormatter = getFieldFormatter(spreadsheet, field);
      const dataSum = getDataSumByField(selected, VALUE_FIELD);

      originVal = dataSum;
      value =
        currentFormatter?.(dataSum, selected) ??
        parseFloat(dataSum.toPrecision(PRECISION)); // solve accuracy problems;
    }
    summaries.push({
      selectedData: selected,
      name,
      value,
      originValue: originVal,
    });
  });

  return summaries;
};

export const getDescription = (targetCell: S2CellType): string => {
  if (!targetCell) {
    return;
  }

  const meta = targetCell.getMeta();

  if (meta.isTotals) {
    return;
  }

  const currentMeta = find(meta.spreadsheet.dataCfg.meta, {
    field: meta.field || meta.value || meta.valueField,
  });
  const field = currentMeta?.field;

  return meta.spreadsheet.dataSet.getFieldDescription(field);
};

export const getTooltipData = (params: TooltipDataParam): TooltipData => {
  const { spreadsheet, cellInfos = [], options = {}, targetCell } = params;

  let summaries: TooltipSummaryOptions[] = null;
  let headInfo: TooltipHeadInfo = null;
  let details = null;

  const description = getDescription(targetCell);
  const firstCellInfo = cellInfos[0] || {};

  if (!options?.hideSummary) {
    // 计算多项的sum（默认为sum，可自定义）
    summaries = getSummaries({
      spreadsheet,
      options,
      targetCell,
    });
  } else if (options.showSingleTips) {
    // 行列头hover & 明细表所有hover
    const currentFormatter = getFieldFormatter(
      spreadsheet,
      firstCellInfo.valueField,
    );
    const formattedValue = currentFormatter(firstCellInfo.value);
    const cellName = options.enableFormat
      ? spreadsheet.dataSet.getFieldName(firstCellInfo.value) || formattedValue
      : spreadsheet.dataSet.getFieldName(firstCellInfo.valueField);

    firstCellInfo.name = cellName || '';
  } else {
    headInfo = getHeadInfo(spreadsheet, firstCellInfo, options);
    details = getTooltipDetailList(spreadsheet, firstCellInfo, options);
  }
  const { interpretation, infos, tips, name } = firstCellInfo || {};
  return {
    summaries,
    interpretation,
    infos,
    tips,
    name,
    headInfo,
    details,
    description,
  };
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

export const getCellsTooltipData = (
  spreadsheet: SpreadSheet,
): TooltipData[] => {
  if (!spreadsheet.interaction.isSelectedState()) {
    return [];
  }

  const { valueInCols } = spreadsheet.dataCfg.fields;
  // 包括不在可视区域内的格子, 如: 滚动刷选
  return spreadsheet.interaction
    .getCells()
    .reduce<TooltipData[]>((tooltipData, cellMeta) => {
      const meta = spreadsheet.facet.layoutResult.getCellMeta(
        cellMeta?.rowIndex,
        cellMeta?.colIndex,
      );
      const query = getMergedQuery(meta);

      if (isEmpty(meta) || isEmpty(query)) {
        return [];
      }

      const currentCellInfo: TooltipData = {
        ...query,
        colIndex: valueInCols ? meta.colIndex : null,
        rowIndex: !valueInCols ? meta.rowIndex : null,
      };

      const isEqualCellInfo = tooltipData.find((cellInfo) =>
        isEqual(currentCellInfo, cellInfo),
      );
      if (!isEqualCellInfo) {
        tooltipData.push(currentCellInfo);
      }
      return tooltipData;
    }, []);
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
  if (!event || !spreadsheet) {
    return;
  }
  const cellType = spreadsheet.getCellType?.(event?.target);
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

export const verifyTheElementInTooltip = (
  parent: HTMLElement,
  child: Node,
): boolean => {
  let result = false;
  let currentNode: Node = child;
  while (currentNode && currentNode !== document.body) {
    if (parent === currentNode) {
      result = true;
      break;
    }
    currentNode = currentNode.parentElement;
  }
  return result;
};
