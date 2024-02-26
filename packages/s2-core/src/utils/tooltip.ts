/**
 * 获取tooltip中需要显示的数据项
 */

import type { FederatedPointerEvent as CanvasEvent } from '@antv/g';
import type * as CSS from 'csstype';
import {
  assign,
  compact,
  concat,
  every,
  filter,
  flatMap,
  forEach,
  get,
  groupBy,
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
  sumBy,
} from 'lodash';
import {
  CellType,
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
  Tooltip,
  TooltipDetailListItem,
  TooltipSummaryOptionsValue,
  ViewMeta,
  ViewMetaData,
} from '../common/interface';
import type { S2CellType } from '../common/interface/interaction';
import type {
  BaseTooltipConfig,
  BaseTooltipOperatorMenuOptions,
  SummaryParam,
  TooltipData,
  TooltipDataParam,
  TooltipHeadInfo,
  TooltipOperation,
  TooltipOperatorMenuItems,
  TooltipOperatorOptions,
  TooltipOptions,
  TooltipPosition,
  TooltipSummaryOptions,
} from '../common/interface/tooltip';
import { CellData } from '../data-set/cell-data';
import type { Node as S2Node } from '../facet/layout/node';
import { getLeafColumnsWithKey } from '../facet/utils';
import type { SpreadSheet } from '../sheet-type';
import { getDataSumByField, isNotNumber } from '../utils/number-calculate';
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
    : Math.min(width!, maxX) + canvasOffsetLeft;
  const maxHeight = isAdjustBodyBoundary
    ? viewportHeight
    : Math.min(height!, maxY) + canvasOffsetTop;

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

export const getTooltipDefaultOptions = <Menu = BaseTooltipOperatorMenuOptions>(
  options?: TooltipOptions<Menu>,
) => {
  return {
    operator: {
      menu: {
        onClick: noop,
        items: [],
        defaultSelectedKeys: [],
      },
    },
    enableFormat: true,
    ...options,
  };
};

export const getMergedQuery = (meta: ViewMeta | null | undefined) => {
  return {
    ...meta?.colQuery,
    ...meta?.rowQuery,
  };
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

/* format */
export const getFriendlyVal = (val: any): number | string => {
  const isInvalidNumber = isNumber(val) && Number.isNaN(val);
  const isEmptyString = val === '';

  return isNil(val) || isInvalidNumber || isEmptyString ? '-' : val;
};

export const getFieldFormatter = (spreadsheet: SpreadSheet, field: string) => {
  const formatter = spreadsheet?.dataSet?.getFieldFormatter(field);

  return (v: unknown, data?: ViewMetaData) =>
    getFriendlyVal(formatter(v, data));
};

export const getListItem = (
  spreadsheet: SpreadSheet,
  {
    data,
    field,
    valueField,
    useCompleteDataForFormatter = true,
    targetCell,
  }: {
    data: ViewMetaData;
    field: string;
    valueField?: string;
    useCompleteDataForFormatter?: boolean;
    targetCell?: S2CellType;
  },
): TooltipDetailListItem => {
  const name =
    spreadsheet?.dataSet.getCustomRowFieldName(targetCell!) ||
    spreadsheet?.dataSet?.getFieldName(field);

  const formatter = getFieldFormatter(spreadsheet, field);

  // 非数值类型的 data 不展示 (趋势分析表/迷你图/G2 图表)，上层通过自定义 tooltip 的方式去自行定制
  const dataValue = CellData.getFieldValue(data, field);
  const displayDataValue = isObject(dataValue) ? null : dataValue;

  const value = formatter(
    valueField || displayDataValue,
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
  activeData: ViewMetaData,
): TooltipDetailListItem[] => {
  const currentFields = filter(
    concat([], fields),
    (field) =>
      field !== EXTRA_FIELD && CellData.getFieldValue(activeData, field),
  );

  return map(currentFields, (field: string) =>
    getListItem(spreadsheet, {
      data: activeData,
      field,
      useCompleteDataForFormatter: false,
    }),
  ) as unknown as TooltipDetailListItem[];
};

/**
 * 获取选中格行/列头信息
 * @param spreadsheet
 * @param activeData
 */
export const getHeadInfo = (
  spreadsheet: SpreadSheet,
  activeData: ViewMetaData,
  options?: TooltipOptions,
): TooltipHeadInfo => {
  const { isTotals } = options || {};
  let colList: TooltipDetailListItem[] = [];
  let rowList: TooltipDetailListItem[] = [];

  if (activeData) {
    const colFields = spreadsheet?.dataSet?.fields?.columns as string[];
    const rowFields = spreadsheet?.dataSet?.fields?.rows as string[];

    colList = getFieldList(
      spreadsheet,
      getLeafColumnsWithKey(colFields || []),
      activeData,
    );
    rowList = getFieldList(spreadsheet, rowFields, activeData);
  }

  // 此时是总计-总计
  if (isEmpty(colList) && isEmpty(rowList) && isTotals) {
    colList = [{ value: i18n('总计') }] as TooltipDetailListItem[];
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
  activeData: ViewMetaData,
  options: TooltipOptions,
  targetCell: S2CellType,
): TooltipDetailListItem[] => {
  if (!activeData) {
    return [];
  }

  const { isTotals } = options;
  const field = activeData[EXTRA_FIELD] as string;
  const detailList: TooltipDetailListItem[] = [];

  if (isTotals) {
    // total/subtotal
    detailList.push(
      getListItem(spreadsheet, {
        data: activeData,
        field,
        targetCell,
        valueField: activeData[VALUE_FIELD] as string,
      }),
    );
  } else {
    detailList.push(
      getListItem(spreadsheet, { data: activeData, field, targetCell }),
    );
  }

  return detailList;
};

export const getSummaryName = (
  spreadsheet: SpreadSheet,
  currentField: string,
  isTotals?: boolean,
): string => {
  if (isTotals) {
    return i18n('总计');
  }

  const name = spreadsheet?.dataSet?.getFieldName(currentField);

  return name && name !== 'undefined' ? name : '';
};

const getRowOrColSelectedIndexes = (
  nodes: S2Node[],
  leafNodes: S2Node[],
  isRow = true,
) => {
  const selectedIndexes: number[][] = [];

  forEach(leafNodes, (_, index) => {
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

export const getSelectedCellIndexes = (spreadsheet: SpreadSheet) => {
  const rowLeafNodes = spreadsheet.facet.getRowLeafNodes();
  const colLeafNodes = spreadsheet.facet.getColLeafNodes();
  const { nodes = [], cells = [] } = spreadsheet.interaction.getState();
  const cellType = cells?.[0]?.type;
  // 高亮所有的子节点, 但是只有叶子节点需要参与数据计算 https://github.com/antvis/S2/pull/1443
  const needCalcNodes = spreadsheet.isHierarchyTreeType()
    ? nodes
    : nodes.filter((node) => node?.isLeaf);

  if (cellType === CellType.COL_CELL) {
    return getRowOrColSelectedIndexes(needCalcNodes, rowLeafNodes, false);
  }

  if (cellType === CellType.ROW_CELL) {
    return getRowOrColSelectedIndexes(needCalcNodes, colLeafNodes);
  }

  return [];
};

export const getSelectedCellsData = (
  spreadsheet: SpreadSheet,
  targetCell: S2CellType,
  onlyShowCellText?: boolean,
): ViewMetaData[] => {
  const { facet } = spreadsheet;

  /**
   * 当开启小计/总计后
   * 1. [点击列头单元格时], 选中列所对应的数值单元格的数据如果是小计/总计, 则不应该参与计算:
   *  - 1.1 [小计/总计 位于行头]: 点击的都是 (普通列头), 需要去除 (数值单元格) 对应 (行头为小计) 的单元格的数据
   *  - 1.2 [小计/总计 位于列头]: 点击的是 (普通列头/小计/总计列头), 由于行头没有, 所有数值单元格参与计算即可
   *  - 1.3 [小计/总计 同时位于行头/列头]: 和 1.1 处理一致

   * 2. [点击行头单元格时]:
   *  - 2.1 如果本身就是小计/总计单元格, 且列头无小计/总计, 则当前行所有 (数值单元格) 参与计算
   *  - 2.2 如果本身不是小计/总计单元格, 去除当前行/列 (含子节点) 所对应小计/总计数据
   *
   * 3. [刷选/多选], 暂不考虑这种场景
   *  - 3.1 如果全部是小计或全部是总计单元格, 则正常计算
   *  - 3.2 如果部分是, 如何处理? 小计/总计不应该被选中, 还是数据不参与计算?
   *  - 3.3 如果选中的含有小计, 并且有总计, 数据参与计算也没有意义, 如何处理?
   */
  const isBelongTotalCell = (cellMeta: ViewMeta | null | undefined) => {
    if (!cellMeta) {
      return false;
    }

    const targetCellMeta = targetCell?.getMeta();

    // target: 当前点击的单元格类型
    const isTargetTotalCell = targetCellMeta?.isTotals;
    const isTargetColCell = targetCell?.cellType === CellType.COL_CELL;
    const isTargetRowCell = targetCell?.cellType === CellType.ROW_CELL;

    if (!isTargetColCell && !isTargetRowCell) {
      return false;
    }

    const currentColCellNode = facet.getColNodeByIndex(cellMeta.colIndex);
    const currentRowCellNode = facet.getRowNodeByIndex(cellMeta.rowIndex);

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
  if (onlyShowCellText) {
    // 行头列头单选多选
    const selectedCellIndexes = getSelectedCellIndexes(spreadsheet);

    return compact(
      map(selectedCellIndexes, ([rowIndex, colIndex]) => {
        const currentCellMeta = facet.getCellMeta(rowIndex, colIndex);

        if (isBelongTotalCell(currentCellMeta)) {
          return;
        }

        return currentCellMeta?.data || getMergedQuery(currentCellMeta);
      }) as ViewMetaData[],
    );
  }

  // 其他（刷选，data cell多选）
  const cells = spreadsheet.interaction.getCells();

  return cells
    .filter((cellMeta) => {
      const meta = facet.getCellMeta(cellMeta.rowIndex, cellMeta.colIndex);

      return !isBelongTotalCell(meta);
    })
    .map((cellMeta) => {
      const meta = facet.getCellMeta(cellMeta.rowIndex, cellMeta.colIndex);

      return meta?.data || getMergedQuery(meta);
    }) as ViewMetaData[];
};

export const getCustomFieldsSummaries = (
  summaries: TooltipSummaryOptions[],
): TooltipSummaryOptions[] => {
  const customFieldGroup = groupBy(summaries, 'name');

  return Object.keys(customFieldGroup).map((name) => {
    const cellsData = customFieldGroup[name];
    const selectedData = flatMap(
      cellsData,
      (cellData: TooltipSummaryOptions) => cellData.selectedData,
    ) as unknown as Data[];

    const validCellsData = cellsData.filter((item) => isNumber(item.value));
    const value = isEmpty(validCellsData)
      ? null
      : sumBy(validCellsData, 'value');

    return {
      name,
      selectedData,
      value,
    };
  });
};

export const getSummaries = (params: SummaryParam): TooltipSummaryOptions[] => {
  const { spreadsheet, targetCell, options = {} } = params;
  const summaries: TooltipSummaryOptions[] = [];
  const summary: Record<string, any> = {};
  const isTableMode = spreadsheet.isTableMode();

  if (isTableMode && options?.onlyShowCellText) {
    const meta = targetCell?.getMeta();
    // 如果是列头, 获取当前列所有数据, 其他则获取当前整行 (1条数据)
    const selectedCellsData = (
      meta?.field
        ? spreadsheet.dataSet.getCellMultiData({ query: { field: meta.field } })
        : [spreadsheet.dataSet.getRowData(meta as ViewMeta)]
    ) as ViewMetaData[];

    return [{ selectedData: selectedCellsData, name: '', value: '' }];
  }

  // 拿到选择的所有 dataCell的数据
  const selectedCellsData = getSelectedCellsData(
    spreadsheet,
    targetCell!,
    options.onlyShowCellText,
  );

  forEach(selectedCellsData, (item) => {
    const key = item?.[EXTRA_FIELD] as string;

    if (summary[key]) {
      summary[key]?.push(item);
    } else {
      summary[key] = [item];
    }
  });

  mapKeys(summary, (selected, field) => {
    const name = spreadsheet.isCustomHeaderFields()
      ? spreadsheet?.dataSet.getCustomRowFieldName(targetCell!)
      : getSummaryName(spreadsheet, field, options?.isTotals);
    let value: TooltipSummaryOptionsValue = '';
    let originVal: TooltipSummaryOptionsValue = '';

    if (every(selected, (item) => isNotNumber(get(item, VALUE_FIELD)))) {
      const { placeholder } = spreadsheet.options;
      const emptyPlaceholder = getEmptyPlaceholder(
        summary as ViewMeta,
        placeholder,
      );

      // 如果选中的单元格都无数据，则显示"-" 或 options 里配置的占位符
      value = emptyPlaceholder;
      originVal = emptyPlaceholder;
    } else {
      const currentFormatter = getFieldFormatter(spreadsheet, field);
      const dataSum = getDataSumByField(selected, VALUE_FIELD);

      originVal = dataSum;
      value =
        currentFormatter?.(dataSum, selected) ??
        parseFloat(dataSum.toPrecision(PRECISION));
    }

    summaries.push({
      selectedData: selected,
      name: name || '',
      value,
      originValue: originVal,
    });
  });

  if (spreadsheet.isCustomHeaderFields()) {
    return getCustomFieldsSummaries(summaries);
  }

  return summaries;
};

export const getTooltipData = (params: TooltipDataParam): TooltipData => {
  const { spreadsheet, cellInfos = [], options = {}, targetCell } = params;

  let name: string | null = null;
  let summaries: TooltipSummaryOptions[] = [];
  let headInfo: TooltipHeadInfo | null = null;
  let details: TooltipDetailListItem[] | null = null;

  const description = spreadsheet.dataSet.getCustomFieldDescription(
    targetCell!,
  );

  const firstCellInfo = (cellInfos[0] || {}) as unknown as ViewMetaData;

  if (!options?.hideSummary) {
    // 计算多项的sum（默认为sum，可自定义）
    summaries = getSummaries({
      spreadsheet,
      options,
      targetCell,
    });
  } else if (options.onlyShowCellText) {
    // 行列头hover & 明细表所有hover

    const value = CellData.getFieldValue(firstCellInfo, 'value') as string;
    const valueField = CellData.getFieldValue(
      firstCellInfo,
      'valueField',
    ) as string;

    const currentFormatter = getFieldFormatter(spreadsheet, valueField);
    const formattedValue = currentFormatter(value) as string;
    const cellText = options.enableFormat
      ? spreadsheet.dataSet.getFieldName(value) || formattedValue
      : spreadsheet.dataSet.getFieldName(valueField);

    name = cellText || '';
  } else {
    headInfo = getHeadInfo(spreadsheet, firstCellInfo, options);
    details = getTooltipDetailList(
      spreadsheet,
      firstCellInfo,
      options,
      targetCell!,
    );
  }

  const { interpretation, infos, tips } = (firstCellInfo || {}) as TooltipData;

  return {
    name,
    summaries,
    interpretation,
    infos,
    tips,
    headInfo,
    details,
    description,
  };
};

export const mergeCellInfo = (cells: S2CellType[]): TooltipData[] =>
  map(cells, (stateCell) => {
    const stateCellMeta = stateCell.getMeta();

    return assign(
      {},
      stateCellMeta.query || {},
      pick(stateCellMeta, ['colIndex', 'rowIndex']),
    );
  });

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
      const meta = spreadsheet.facet.getCellMeta(
        cellMeta?.rowIndex,
        cellMeta?.colIndex,
      );
      const query = getMergedQuery(meta);

      if (isEmpty(meta) || isEmpty(query)) {
        return [];
      }

      const currentCellInfo: TooltipData = {
        ...query,
        colIndex: valueInCols ? meta?.colIndex : null,
        rowIndex: !valueInCols ? meta?.rowIndex : null,
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
  cellType: CellType,
): Tooltip => {
  const getOptionsByCell = (cellConfig?: BaseTooltipConfig) =>
    customMerge<BaseTooltipConfig>(cellTooltipConfig, cellConfig);

  const { colCell, rowCell, dataCell, cornerCell } = cellTooltipConfig;

  if (cellType === CellType.COL_CELL) {
    return getOptionsByCell(colCell);
  }

  if (cellType === CellType.ROW_CELL) {
    return getOptionsByCell(rowCell);
  }

  if (cellType === CellType.DATA_CELL) {
    return getOptionsByCell(dataCell);
  }

  if (cellType === CellType.CORNER_CELL) {
    return getOptionsByCell(cornerCell);
  }

  return { ...cellTooltipConfig };
};

export const getTooltipOptions = (
  spreadsheet: SpreadSheet,
  event: CanvasEvent | MouseEvent | Event,
): Tooltip | null => {
  if (!event || !spreadsheet) {
    return null;
  }

  const { options, interaction } = spreadsheet;
  const cellType = spreadsheet.getCellType?.(event?.target);

  // 如果没有 cellType, 说明是刷选丢失 event target 的场景, 此时从产生过交互状态的单元格里取, 避免刷选读取不到争取 tooltip 配置的问题
  const sampleCell = interaction.getInteractedCells()[0];

  return getTooltipOptionsByCellType(
    options.tooltip!,
    cellType || sampleCell?.cellType!,
  );
};

export const getTooltipVisibleOperator = (
  operation: TooltipOperation,
  options: { defaultMenus?: TooltipOperatorMenuItems; cell: S2CellType },
): TooltipOperatorOptions => {
  const { defaultMenus = [], cell } = options;

  const getDisplayMenus = (menus: TooltipOperatorMenuItems = []) =>
    menus
      .filter((menu) =>
        isFunction(menu.visible) ? menu.visible(cell) : menu.visible ?? true,
      )
      .map((menu) => {
        if (menu.children) {
          menu.children = getDisplayMenus(menu.children);
        }

        return menu;
      });

  const displayMenus = getDisplayMenus(operation?.menu?.items);

  return {
    menu: {
      ...operation?.menu,
      items: compact([...defaultMenus, ...displayMenus]),
    },
  };
};

export const verifyTheElementInTooltip = (
  parent: HTMLElement | null,
  child: Node,
): boolean => {
  let result = false;
  let currentNode: Node = child;

  while (currentNode && currentNode !== document.body) {
    if (parent === currentNode) {
      result = true;
      break;
    }

    currentNode = currentNode.parentElement!;
  }

  return result;
};
