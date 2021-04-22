import React, { useEffect, useState } from 'react';
import { isEmpty, debounce, isFunction } from 'lodash';
import { Spin } from 'antd';
import { DataCfg } from '@src/common/interface';
import { DrillDown } from '@src/components/drill-down';
import { Header } from '@src/components/header';
import {
  KEY_COLUMN_CELL_CLICK,
  KEY_CORNER_CELL_CLICK,
  KEY_ROW_CELL_CLICK,
  KEY_SINGLE_CELL_CLICK,
  ClearDrillDownInfo,
  HandleConfigWhenDrillDown,
  HandleOptions,
  HandleDrillDown,
} from '@src/index';
import {
  KEY_AFTER_HEADER_LAYOUT,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_CELL_SCROLL,
  KEY_LIST_SORT,
} from '@src/common/constant';
import BaseSpreadsheet from '@src/sheet-type/base-spread-sheet';
import SpreadSheet from '@src/sheet-type/spread-sheet';
import { safetyDataCfg, safetyOptions } from '@src/utils/safety-config';
import { resetDrillDownCfg } from '@src/utils/drill-down/helper';
import { BaseSheetProps } from '../interface';

export const BaseSheet = (props: BaseSheetProps) => {
  const {
    spreadsheet,
    // TODO dataCfg细化
    dataCfg,
    options,
    adaptive = true,
    header,
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
    onCornerCellClick,
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
      if (isFunction(onCornerCellClick)) onCornerCellClick(value);
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
    sheetInstance: BaseSpreadsheet,
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
    sheetInstance.tooltip.show({
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      element,
    });
  };

  const buildSpreadSheet = () => {
    if (!baseSpreadsheet) {
      baseSpreadsheet = getSpreadSheet();
      bindEvent();
      baseSpreadsheet.setDataCfg(safetyDataCfg(dataCfg));
      baseSpreadsheet.store.set('originalDataCfg', dataCfg);
      baseSpreadsheet.setOptions(
        safetyOptions(HandleOptions(props, baseSpreadsheet, iconClickCallback)),
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

  const preHandleDataCfg = (config: DataCfg) => {
    if (partDrillDown) {
      resetDrillDownCfg(ownSpreadsheet);
    }
    return config;
  };

  const setOptions = () => {
    ownSpreadsheet.setOptions(
      safetyOptions(HandleOptions(props, ownSpreadsheet, iconClickCallback)),
    );
  };

  const setDataCfg = () => {
    const newDataCfg = preHandleDataCfg(dataCfg);
    ownSpreadsheet.setDataCfg(newDataCfg);
    ownSpreadsheet.store.set('originalDataCfg', newDataCfg);
  };

  const update = (reset?: () => void) => {
    if (!ownSpreadsheet) return;

    if (isFunction(reset)) reset();

    if (!isEmpty(props.dataCfg)) {
      HandleConfigWhenDrillDown(props, ownSpreadsheet);
    }

    ownSpreadsheet.render();
    setLoading(false);
  };

  /**
   * 清空下钻信息
   * @param rowId 不传表示全部清空
   */
  const clearDrillDownInfo = (rowId?: string) => {
    if (!ownSpreadsheet) return;
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
    update(setDataCfg);
  }, [dataCfg]);

  useEffect(() => {
    update(setOptions);
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
      clearDrillDownInfo(ownSpreadsheet.store.get('drillDownMeta')?.id);
    } else {
      setLoading(true);
      HandleDrillDown({
        rows: dataCfg.fields.rows,
        drillFields: drillFields,
        fetchData: partDrillDown.fetchData,
        drillItemsNum: partDrillDown?.drillItemsNum,
        spreadsheet: ownSpreadsheet,
      });
    }
  }, [drillFields]);

  useEffect(() => {
    if (isEmpty(partDrillDown?.clearDrillDown)) return;
    clearDrillDownInfo(partDrillDown?.clearDrillDown?.rowId);
  }, [partDrillDown?.clearDrillDown]);

  useEffect(() => {
    if (!partDrillDown?.drillItemsNum) return;
    clearDrillDownInfo();
  }, [partDrillDown?.drillItemsNum]);

  useEffect(() => {
    if (!partDrillDown || !ownSpreadsheet) return;
    if (isEmpty(partDrillDown?.drillConfig?.dataSet))
      resetDrillDownCfg(ownSpreadsheet);
    update(setOptions);
  }, [partDrillDown?.drillConfig?.dataSet]);

  return (
    <Spin spinning={isLoading === undefined ? loading : isLoading}>
      {header && <Header {...header} sheet={ownSpreadsheet} />}
      <div
        ref={(e: HTMLDivElement) => {
          container = e;
        }}
      />
    </Spin>
  );
};
