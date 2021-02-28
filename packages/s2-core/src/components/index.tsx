import React, { useEffect, useState } from 'react';
import { isEmpty, debounce, isFunction } from 'lodash';
import { Spin } from 'antd';
import { DataCfg, SpreadsheetOptions } from '../common/interface';
import { DrillDown, DrillDownProps } from '../components/drill-down';
import {
  KEY_COLUMN_CELL_CLICK,
  KEY_CORNER_CELL_CLICK,
  KEY_ROW_CELL_CLICK,
  KEY_SINGLE_CELL_CLICK,
} from '..';
import {
  KEY_AFTER_HEADER_LAYOUT,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_CELL_SCROLL,
  KEY_LIST_SORT,
} from '../common/constant';
import { Node } from '..';
import BaseSpreadsheet from '../sheet-type/base-spread-sheet';
import { SpreadSheetTheme } from '..';
import SpreadSheet from '../sheet-type/spread-sheet';
import {
  ClearDrillDownInfo,
  HandleConfigWhenDrillDown,
  HandleOptions,
  HandleDrillDown,
  UseDrillDownLayout,
} from '../utils/drill-down/helper';

export interface PartDrillDownInfo {
  // 下钻的数据
  drillData: Record<string, string | number>[];
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
  // 展示的下钻维值个数
  drillItemsNum?: number;
  fetchData: (meta: Node, drillFields: string[]) => Promise<PartDrillDownInfo>;
}

export interface SpreadsheetProps {
  spreadsheet?: (
    dom: string | HTMLElement,
    dataCfg: DataCfg,
    options: SpreadsheetOptions,
  ) => BaseSpreadsheet;
  dataCfg: DataCfg;
  isLoading?: boolean;
  // 部分下钻功能
  partDrillDown?: PartDrillDown;
  // 窗口自适应
  adaptive?: boolean;
  options: SpreadsheetOptions;
  theme?: SpreadSheetTheme;
  rowLevel?: number;
  colLevel?: number;
  onListSort?: (params: { sortFieldId: string; sortMethod: string }) => void;
  onRowColLayout?: (rows, cols) => void;
  onRowCellScroll?: (reachedRow) => void;
  onColCellScroll?: (reachedCol) => void;
  onCellScroll?: (position: {
    scrollX: number;
    scrollY: number;
    thumbOffset: number;
  }) => void;
  onRowCellClick?: (value) => void;
  onColCellClick?: (value) => void;
  onCornerCellClick?: (value) => void;
  onDataCellClick?: (value) => void;
  getSpreadsheet?: (spreadsheet: BaseSpreadsheet) => void;
}

export const SheetComponent = (props: SpreadsheetProps) => {
  const {
    spreadsheet,
    // TODO dataCfg细化
    dataCfg,
    options,
    adaptive = true,
    theme,
    rowLevel,
    colLevel,
    isLoading,
    onListSort,
    onRowColLayout,
    onRowCellScroll,
    onColCellScroll,
    onCellScroll,
    onRowCellClick,
    onColCellClick,
    onDataCellClick,
    getSpreadsheet,
    partDrillDown,
  } = props;
  let container: HTMLDivElement;
  let baseSpreadsheet: BaseSpreadsheet;
  const [ownSpreadsheet, setOwnSpreadsheet] = useState<BaseSpreadsheet>();
  const [drillFields, setDrillFields] = useState<string[]>([]);
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getSpreadSheet = (): BaseSpreadsheet => {
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
        if (isFunction(onRowColLayout)) onRowColLayout(rowNodes, colNodes);
      }
    });
    baseSpreadsheet.on(KEY_ROW_NODE_BORDER_REACHED, (value) => {
      if (isFunction(onRowCellScroll)) onRowCellScroll(value);
    });
    baseSpreadsheet.on(KEY_COL_NODE_BORDER_REACHED, (value) => {
      if (isFunction(onColCellScroll)) onColCellScroll(value);
    });
    baseSpreadsheet.on(KEY_CELL_SCROLL, (value) => {
      if (isFunction(onCellScroll)) onCellScroll(value);
    });
    baseSpreadsheet.on(KEY_ROW_CELL_CLICK, (value) => {
      if (isFunction(onRowCellClick)) onRowCellClick(value);
    });
    baseSpreadsheet.on(KEY_COLUMN_CELL_CLICK, (value) => {
      if (isFunction(onColCellClick)) onColCellClick(value);
    });
    baseSpreadsheet.on(KEY_CORNER_CELL_CLICK, (value) => {
      if (isFunction(onRowCellClick)) onRowCellClick(value);
    });
    baseSpreadsheet.on(KEY_SINGLE_CELL_CLICK, (value) => {
      if (isFunction(onDataCellClick)) onDataCellClick(value);
    });
    baseSpreadsheet.on(KEY_LIST_SORT, (value) => {
      if (isFunction(onListSort)) onListSort(value);
    });
  };

  const unBindEvent = () => {
    baseSpreadsheet.off(KEY_AFTER_HEADER_LAYOUT);
    baseSpreadsheet.off(KEY_ROW_NODE_BORDER_REACHED);
    baseSpreadsheet.off(KEY_COL_NODE_BORDER_REACHED);
    baseSpreadsheet.off(KEY_CELL_SCROLL);
    baseSpreadsheet.off(KEY_ROW_CELL_CLICK);
    baseSpreadsheet.off(KEY_COLUMN_CELL_CLICK);
    baseSpreadsheet.off(KEY_CORNER_CELL_CLICK);
    baseSpreadsheet.off(KEY_SINGLE_CELL_CLICK);
    baseSpreadsheet.off(KEY_LIST_SORT);
  };

  const iconClickCallback = (
    event: MouseEvent,
    sheet: BaseSpreadsheet,
    cashDrillFields: string[],
    disabledFields: string[],
  ) => {
    const element = (
      <DrillDown
        {...partDrillDown.drillConfig}
        setDrillFields={setDrillFields}
        drillFields={cashDrillFields}
        disabledFields={disabledFields}
      />
    );
    sheet.tooltip.show(
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
      setLoading(false);
      setOwnSpreadsheet(baseSpreadsheet);
      if (getSpreadsheet) getSpreadsheet(baseSpreadsheet);
    }
  };

  // TODO 使用到的时候根据情况增加配置项
  // const updateScrollOffset = (nodeKey: string, isRow = true) => {
  //   let item;
  //   if (isRow) {
  //     item = baseSpreadsheet
  //       .getRowNodes()
  //       .find((value) => value.id === nodeKey);
  //     if (item) {
  //       baseSpreadsheet.updateScrollOffset({
  //         offsetY: {
  //           value: item.y,
  //         },
  //       });
  //     }
  //   } else {
  //     item = baseSpreadsheet
  //       .getColumnNodes()
  //       .find((value) => value.id === nodeKey);
  //     if (item) {
  //       baseSpreadsheet.updateScrollOffset({
  //         offsetX: {
  //           value: item.x,
  //         },
  //       });
  //     }
  //   }
  // };

  // TODO 使用到的时候根据情况增加配置项
  // const selectColCell = (nodeKey: string) => {
  //   const rowCell = baseSpreadsheet
  //     .getColumnNodes()
  //     .find((value) => value.id === nodeKey);
  //   if (rowCell) {
  //     if (rowCell.belongsCell) {
  //       // @ts-ignore
  //       const meta = rowCell.belongsCell.getMeta();
  //       const idx = meta.cellIndex;
  //       if (rowCell.belongsCell instanceof ColCell) {
  //         if (idx === -1) {
  //           const arr = map(Node.getAllLeavesOfNode(meta), 'cellIndex');
  //           baseSpreadsheet.store.set('selected', {
  //             type: 'column',
  //             indexes: [-1, [min(arr), max(arr)]],
  //           });
  //         } else {
  //           baseSpreadsheet.store.set('selected', {
  //             type: 'column',
  //             indexes: [-1, idx],
  //           });
  //         }
  //         baseSpreadsheet.getPanelAllCells().forEach((value) => {
  //           value.update();
  //         });
  //       }
  //     }
  //   }
  // };

  const update = (reset?: () => void, action?: () => void) => {
    if (!ownSpreadsheet) return;
    if (reset) reset();
    if (action) action();
    HandleConfigWhenDrillDown(props, ownSpreadsheet);
    ownSpreadsheet.render();
    setLoading(false);
  };

  /**
   * 清空下钻信息
   * @param rowId 不传表示全部清空
   */
  const clearDrillDownInfo = (rowId?: string) => {
    setLoading(true);
    ClearDrillDownInfo(ownSpreadsheet, rowId);
    update();
  };

  const debounceResize = debounce((e: Event) => {
    setResizeTimeStamp(e.timeStamp);
  }, 200);

  useEffect(() => {
    buildSpreadSheet();
    // 监听窗口变化
    if (adaptive) window.addEventListener('resize', debounceResize);
    return () => {
      unBindEvent();
      baseSpreadsheet.destroy();
      if (adaptive) window.removeEventListener('resize', debounceResize);
    };
  }, []);

  useEffect(() => {
    if (!container || !ownSpreadsheet) return;

    const style = getComputedStyle(container);

    const box = {
      width: parseInt(style.getPropertyValue('width').replace('px', ''), 10),
      height: parseInt(style.getPropertyValue('height').replace('px', ''), 10),
    };

    ownSpreadsheet.changeSize(box?.width, box?.height);
    ownSpreadsheet.render(false);
  }, [resizeTimeStamp]);

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
      clearDrillDownInfo(ownSpreadsheet.store.get('drillMeta')?.id);
    } else {
      setLoading(true);
      HandleDrillDown({
        rows: dataCfg.fields.rows,
        drillFields: drillFields,
        fetchData: partDrillDown.fetchData,
        drillItemsNum: partDrillDown?.drillItemsNum,
        spreadsheet: ownSpreadsheet,
      }).then(() => {
        setLoading(false);
        // TODO 异常处理
      });
    }
  }, [drillFields]);

  useEffect(() => {
    if (!partDrillDown || !partDrillDown.clearDrillDown) return;
    clearDrillDownInfo(partDrillDown.clearDrillDown?.rowId);
  }, [partDrillDown]);

  return (
    <Spin spinning={isLoading === undefined ? loading : isLoading}>
      <div
        ref={(e: HTMLDivElement) => {
          container = e;
        }}
      />
    </Spin>
  );
};
