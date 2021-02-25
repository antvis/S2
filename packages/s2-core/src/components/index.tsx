/**
 * Create By yingying
 * On 2020-10-12
 * definition for rule not found
 */
import React, { useEffect, useState } from 'react';
import { map, min, max, isEmpty } from 'lodash';
import { DrillDown, DrillDownProps } from './drill-down';
import { S2Event } from '../interaction/events/types'
import {
  Node,
  SpreadSheetTheme,
  BaseSpreadSheet,
  DataCfg,
  SpreadsheetOptions,
  SpreadSheet,
  // ColCell,
  // KEY_COLUMN_CELL_CLICK,
  // KEY_CORNER_CELL_CLICK,
  // KEY_ROW_CELL_CLICK,
  // KEY_SINGLE_CELL_CLICK,
  KEY_AFTER_HEADER_LAYOUT,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_CELL_SCROLL,
} from '../index';

import {
  ClearDrillDownInfo,
  HandleConfigWhenDrillDown,
  HandleOptions,
  HandleDrillDown,
  UseDrillDownLayout,
} from '../utils/drill-down/helper';

export interface PartDrillDownInfo {
  // 下钻的数据
  drillData: Record<string, string | number>;
  // 下钻的维度
  drillField: string;
}

export interface PartDrillDown {
  // 是否开启下钻功能
  open: boolean;
  // 清除下钻信息
  clearDrillDown?: {
    rowId: string;
  };
  // 下钻维度配置信息
  drillConfig: DrillDownProps;
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

export interface SpreadsheetProps {
  spreadsheet?: (
    dom: string | HTMLElement,
    dataCfg: DataCfg,
    options: SpreadsheetOptions,
  ) => BaseSpreadSheet;
  dataCfg: DataCfg;
  // 部分下钻功能
  partDrillDown?: PartDrillDown;
  options: SpreadsheetOptions;
  theme?: SpreadSheetTheme;
  rowLevel?: number;
  colLevel?: number;
  onRowColLayout?: (rows, cols) => void;
  onRowCellScroll?: (reachedRow) => void;
  onColCellScroll?: (reachedCol) => void;
  onCellScroll?: (position) => void;
  onRowCellClick?: (value) => void;
  onColCellClick?: (value) => void;
  onCornerCellClick?: (value) => void;
  onDataCellClick?: (value) => void;
  getSpreadsheet?: (spreadsheet: BaseSpreadSheet) => void;
}

export const SheetComponent = (props: SpreadsheetProps) => {
  const {
    spreadsheet,
    // TODO dataCfg细化
    dataCfg,
    options,
    theme,
    rowLevel,
    colLevel,
    onRowColLayout,
    onRowCellScroll,
    onColCellScroll,
    onCellScroll,
    onRowCellClick,
    onColCellClick,
    onDataCellClick,
    onCornerCellClick,
    getSpreadsheet,
    partDrillDown,
  } = props;
  let container: HTMLDivElement;
  let baseSpreadsheet: BaseSpreadSheet;
  const [ownSpreadsheet, setOwnSpreadsheet] = useState<BaseSpreadSheet>();

  const [drillFields, setDrillFields] = useState<string[]>([]);

  const getSpreadSheet = (): BaseSpreadSheet => {
    if (spreadsheet) {
      return spreadsheet(container, dataCfg, options);
    }
    return new SpreadSheet(container, dataCfg, options);
  };

  const bindEvent = () => {
    baseSpreadsheet.on(KEY_AFTER_HEADER_LAYOUT, (layoutResult) => {
      if (rowLevel && colLevel) {
        const rowNodes = layoutResult.rowsHierarchy
          .getNodesLessThanLevel(rowLevel)
          .map((value) => {
            return [value.level, value.id, value.label];
          });
        const colNodes = layoutResult.colsHierarchy
          .getNodesLessThanLevel(colLevel)
          .map((value) => {
            return [value.level, value.id, value.label];
          });
        if (onRowColLayout) {
          onRowColLayout(rowNodes, colNodes);
        }
      }
    });
    baseSpreadsheet.on(KEY_ROW_NODE_BORDER_REACHED, (value) => {
      if (onRowCellScroll) {
        onRowCellScroll(value);
      }
    });
    baseSpreadsheet.on(KEY_COL_NODE_BORDER_REACHED, (value) => {
      if (onColCellScroll) {
        onColCellScroll(value);
      }
    });
    baseSpreadsheet.on(KEY_CELL_SCROLL, (value) => {
      if (onCellScroll) {
        onCellScroll(value);
      }
    });
    baseSpreadsheet.on(S2Event.ROWCELL_CLICK, (value) => {
      if (onRowCellClick) {
        console.log('ROWCELL_CLICK');
        onRowCellClick(value);
      }
    });
    baseSpreadsheet.on(S2Event.COLCELL_CLICK, (value) => {
      if (onColCellClick) {
        onColCellClick(value);
      }
    });
    baseSpreadsheet.on(S2Event.CORNER_CLICK, (value) => {
      if (onCornerCellClick) {
        onCornerCellClick(value);
      }
    });
    baseSpreadsheet.on(S2Event.DATACELL_CLICK, (value) => {
      if (onDataCellClick) {
        onDataCellClick(value);
      }
    });
  };

  const unBindEvent = () => {
    baseSpreadsheet.off(KEY_AFTER_HEADER_LAYOUT);
    baseSpreadsheet.off(KEY_ROW_NODE_BORDER_REACHED);
    baseSpreadsheet.off(KEY_COL_NODE_BORDER_REACHED);
    baseSpreadsheet.off(KEY_CELL_SCROLL);
    baseSpreadsheet.off(S2Event.ROWCELL_CLICK);
    baseSpreadsheet.off(S2Event.COLCELL_CLICK);
    baseSpreadsheet.off(S2Event.CORNER_CLICK);
    baseSpreadsheet.off(S2Event.DATACELL_CLICK);
  };

  const iconClickCallback = (
    event: MouseEvent,
    ss: BaseSpreadSheet,
    cashDrillFields: string[],
  ) => {
    const element = (
      <DrillDown
        {...partDrillDown.drillConfig}
        setDrillFields={setDrillFields}
        drillFields={cashDrillFields}
      />
    );
    ss.tooltip.show(
      {
        x: event.clientX,
        y: event.clientY,
      },
      {},
      {},
      element,
    );
  };

  const buildSpreadSheet = () => {
    if (!baseSpreadsheet) {
      UseDrillDownLayout(options);
      baseSpreadsheet = getSpreadSheet();
      bindEvent();
      baseSpreadsheet.setDataCfg(dataCfg);
      baseSpreadsheet.setOptions(
        HandleOptions(props, baseSpreadsheet, iconClickCallback),
      );
      baseSpreadsheet.setTheme(theme);
      baseSpreadsheet.render();
      setOwnSpreadsheet(baseSpreadsheet);
      if (getSpreadsheet) getSpreadsheet(baseSpreadsheet);
    }
  };

  // TODO 使用到的时候根据情况增加配置项
  const updateScrollOffset = (nodeKey: string, isRow = true) => {
    let item;
    if (isRow) {
      item = baseSpreadsheet
        .getRowNodes()
        .find((value) => value.id === nodeKey);
      if (item) {
        baseSpreadsheet.updateScrollOffset({
          offsetY: {
            value: item.y,
          },
        });
      }
    } else {
      item = baseSpreadsheet
        .getColumnNodes()
        .find((value) => value.id === nodeKey);
      if (item) {
        baseSpreadsheet.updateScrollOffset({
          offsetX: {
            value: item.x,
          },
        });
      }
    }
  };

  // TODO 使用到的时候根据情况增加配置项
  const selectColCell = (nodeKey: string) => {
    const rowCell = baseSpreadsheet
      .getColumnNodes()
      .find((value) => value.id === nodeKey);
    if (rowCell) {
      if (rowCell.belongsCell) {
        if (rowCell.belongsCell instanceof ColCell) {
          const meta = rowCell.belongsCell.getMeta();
          const idx = meta.cellIndex;
          if (idx === -1) {
            const arr = map(Node.getAllLeavesOfNode(meta), 'cellIndex');
            baseSpreadsheet.store.set('selected', {
              type: 'column',
              indexes: [-1, [min(arr), max(arr)]],
            });
          } else {
            baseSpreadsheet.store.set('selected', {
              type: 'column',
              indexes: [-1, idx],
            });
          }
          baseSpreadsheet.getPanelAllCells().forEach((value) => {
            value.update();
          });
        }
      }
    }
  };

  const update = (reset?: () => void, action?: () => void) => {
    if (!ownSpreadsheet) return;
    if (reset) reset();
    if (action) action();
    HandleConfigWhenDrillDown(props, ownSpreadsheet);
    ownSpreadsheet.render();
  };

  /**
   * 清空下钻信息
   * @param rowId 不传表示全部清空
   */
  const clearDrillDownInfo = (rowId?: string) => {
    ClearDrillDownInfo(ownSpreadsheet, rowId);
    update();
  };

  useEffect(() => {
    buildSpreadSheet();
    return () => {
      unBindEvent();
      baseSpreadsheet.destroy();
    };
  }, []);

  useEffect(() => {
    update(() => {
      ownSpreadsheet.setDataCfg(dataCfg);
    });
  }, [dataCfg]);

  useEffect(() => {
    update(() => {
      ownSpreadsheet.setDataCfg(dataCfg);
    }, clearDrillDownInfo);
  }, [dataCfg.fields.rows]);

  useEffect(() => {
    update(() => {
      ownSpreadsheet.setOptions(
        HandleOptions(props, ownSpreadsheet, iconClickCallback),
      );
    });
  }, [options]);

  useEffect(() => {
    update(() => {
      ownSpreadsheet.setTheme(theme);
    });
  }, [theme]);

  useEffect(() => {
    if (!ownSpreadsheet) return;
    buildSpreadSheet();
  }, [spreadsheet]);

  useEffect(() => {
    if (!ownSpreadsheet) return;
    ownSpreadsheet.tooltip.hide();
    if (isEmpty(drillFields)) {
      clearDrillDownInfo(ownSpreadsheet.store.get('drillMeta').id);
    } else {
      HandleDrillDown({
        rows: dataCfg.fields.rows,
        drillFields,
        fetchData: partDrillDown.fetchData,
        spreadsheet: ownSpreadsheet,
      });
    }
  }, [drillFields]);

  useEffect(() => {
    if (!partDrillDown?.clearDrillDown) return;
    clearDrillDownInfo(partDrillDown.clearDrillDown?.rowId);
  }, [partDrillDown]);

  return (
    <div
      ref={(e: HTMLDivElement) => {
        container = e;
      }}
    />
  );
};
