import React, { useEffect, useState } from 'react';
import { isEmpty, debounce, isFunction, get, merge } from 'lodash';
import { Spin, Pagination } from 'antd';
import { i18n } from 'src/common/i18n';
import {
  S2DataConfig,
  safetyDataConfig,
  safetyOptions,
  Pagination as PaginationCfg,
} from 'src/common/interface';
import { DrillDown } from '../../drill-down';
import { Header } from '../../header';
import {
  ClearDrillDownInfo,
  HandleConfigWhenDrillDown,
  HandleOptions,
  HandleDrillDown,
  SpreadSheet,
} from 'src/index';
import {
  KEY_AFTER_HEADER_LAYOUT,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_CELL_SCROLL,
  KEY_LIST_SORT,
  KEY_PAGINATION,
} from 'src/common/constant';
import { S2Event } from 'src/interaction/events/types';
import { getBaseCellData } from 'src/utils/interactions/formatter';
import { resetDrillDownCfg } from 'src/utils/drill-down/helper';
import { BaseSheetProps } from '../interface';
import { Event as GEvent } from '@antv/g-canvas';

import './index.less';

export const BaseSheet = (props: BaseSheetProps) => {
  const {
    spreadsheet,
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
    onMergedCellsClick,
    onDataCellMouseUp,
    getSpreadsheet,
    partDrillDown,
  } = props;
  let container: HTMLDivElement;
  const PRECLASS = 's2-pagination';
  let baseSpreadsheet: SpreadSheet;
  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [drillFields, setDrillFields] = useState<string[]>([]);
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>();
  const [current, setCurrent] = useState<number>(
    options?.pagination?.current || 1,
  );

  const getSpreadSheet = (): SpreadSheet => {
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

    baseSpreadsheet.on(KEY_PAGINATION, (data: PaginationCfg) => {
      setTotal(data?.total);
    });

    baseSpreadsheet.on(S2Event.DATACELL_MOUSEUP, (ev: GEvent) => {
      if (isFunction(onDataCellMouseUp)) {
        onDataCellMouseUp(getBaseCellData(ev));
      }
    });

    baseSpreadsheet.on(S2Event.MERGEDCELLS_CLICK, (ev: GEvent) => {
      if (isFunction(onMergedCellsClick)) {
        onMergedCellsClick(getBaseCellData(ev));
      }
    });

    baseSpreadsheet.on(S2Event.ROWCELL_CLICK, (ev: GEvent) => {
      if (isFunction(onRowCellClick)) {
        onRowCellClick(getBaseCellData(ev));
      }
    });
    baseSpreadsheet.on(S2Event.COLCELL_CLICK, (ev: GEvent) => {
      if (isFunction(onColCellClick)) {
        onColCellClick(getBaseCellData(ev));
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

    baseSpreadsheet.on(KEY_LIST_SORT, (value) => {
      if (isFunction(onListSort)) onListSort(value);
    });
  };

  const unBindEvent = () => {
    baseSpreadsheet.off(KEY_AFTER_HEADER_LAYOUT);
    baseSpreadsheet.off(KEY_PAGINATION);
    baseSpreadsheet.off(KEY_ROW_NODE_BORDER_REACHED);
    baseSpreadsheet.off(KEY_COL_NODE_BORDER_REACHED);
    baseSpreadsheet.off(KEY_CELL_SCROLL);
    baseSpreadsheet.off(KEY_LIST_SORT);
    baseSpreadsheet.off(S2Event.MERGEDCELLS_CLICK);
    baseSpreadsheet.off(S2Event.ROWCELL_CLICK);
    baseSpreadsheet.off(S2Event.COLCELL_CLICK);
    baseSpreadsheet.off(S2Event.DATACELL_MOUSEUP);
  };

  const iconClickCallback = (
    event: MouseEvent,
    sheetInstance: SpreadSheet,
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

  const preHandleDataCfg = (config: S2DataConfig) => {
    if (partDrillDown) {
      resetDrillDownCfg(ownSpreadsheet);
    }
    return config;
  };

  const setOptions = (
    sheetInstance?: SpreadSheet,
    sheetProps?: BaseSheetProps,
  ) => {
    const curSheet = sheetInstance || ownSpreadsheet;
    const curProps = sheetProps || props;
    curSheet.setOptions(
      safetyOptions(HandleOptions(curProps, curSheet, iconClickCallback)),
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

  const renderPagination = (): JSX.Element => {
    const paginationCfg = get(options, 'pagination', false);
    // not show the pagination
    if (isEmpty(paginationCfg)) {
      return null;
    }
    const pageSize = get(paginationCfg, 'pageSize', Infinity);
    // only show the pagenation when the pageSize > 5
    const showQuickJumper = total / pageSize > 5;

    return (
      <div className={PRECLASS}>
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          // TODO 外部定义的pageSize和内部PageSize改变的优先级处理
          showSizeChanger={false}
          size={'small'}
          showQuickJumper={showQuickJumper}
          onChange={(page) => setCurrent(page)}
        />
        <span
          className={`${PRECLASS}-count`}
          title={`${i18n('共计')}${total}${i18n('条')}`}
        >
          {i18n('共计')}
          {total || ' - '}
          {i18n('条')}
        </span>
      </div>
    );
  };

  const buildSpreadSheet = () => {
    if (!baseSpreadsheet) {
      baseSpreadsheet = getSpreadSheet();
      bindEvent();
      baseSpreadsheet.setDataCfg(safetyDataConfig(dataCfg));
      baseSpreadsheet.store.set('originalDataCfg', dataCfg);
      setOptions(baseSpreadsheet, props);
      baseSpreadsheet.setTheme(theme);
      baseSpreadsheet.render();
      setLoading(false);
      setOwnSpreadsheet(baseSpreadsheet);
      console.log(baseSpreadsheet.getPanelAllCells());
      if (getSpreadsheet) getSpreadsheet(baseSpreadsheet);
    }
  };

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
    if (isEmpty(partDrillDown?.drillConfig?.dataSet)) {
      resetDrillDownCfg(ownSpreadsheet);
    }
    update(setOptions);
  }, [partDrillDown?.drillConfig?.dataSet]);

  useEffect(() => {
    if (!ownSpreadsheet || isEmpty(options?.pagination)) return;
    const newOptions = merge({}, options, {
      pagination: {
        current: current,
      },
    });
    const newProps = merge({}, props, {
      options: newOptions,
    });
    setOptions(ownSpreadsheet, newProps);
    update();
  }, [current]);

  return (
    <Spin spinning={isLoading === undefined ? loading : isLoading}>
      {header && <Header {...header} sheet={ownSpreadsheet} />}
      <div
        ref={(e: HTMLDivElement) => {
          container = e;
        }}
      />
      {renderPagination()}
    </Spin>
  );
};
