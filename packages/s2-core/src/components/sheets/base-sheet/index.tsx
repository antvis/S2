import React, { useEffect, useState, useRef, StrictMode, memo } from 'react';
import { isEmpty, debounce, isFunction, get, merge, forIn } from 'lodash';
import { Spin, Pagination } from 'antd';
import { i18n } from 'src/common/i18n';
import {
  safetyDataConfig,
  safetyOptions,
  Pagination as PaginationCfg,
  LayoutResult,
  CellScrollPosition,
  LayoutCol,
  LayoutRow,
  ListSortParams,
  TargetLayoutNode,
  S2Constructor,
} from 'src/common/interface';
import { DrillDown } from '@/components/drill-down';
import { Header } from '@/components/header';
import { HandleDrillDownIcon, HandleDrillDown, SpreadSheet } from 'src/index';
import {
  KEY_AFTER_HEADER_LAYOUT,
  KEY_COL_NODE_BORDER_REACHED,
  KEY_ROW_NODE_BORDER_REACHED,
  KEY_CELL_SCROLL,
  KEY_PAGINATION,
} from 'src/common/constant/events';
import { S2Event } from '@/common/constant';
import { getBaseCellData } from '@/utils/interaction/formatter';
import { BaseSheetProps } from '@/components/sheets/interface';
import { Event as GEvent } from '@antv/g-canvas';
import { S2_PREFIX_CLS } from '@/common/constant/classnames';

import './index.less';

export const BaseSheet: React.FC<BaseSheetProps> = memo((props) => {
  const {
    spreadsheet,
    dataCfg,
    options,
    adaptive = true,
    header,
    themeCfg,
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
  const container = useRef<HTMLDivElement>();
  const baseSpreadsheet = useRef<SpreadSheet>();

  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [drillFields, setDrillFields] = useState<string[]>([]);
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>();
  const [current, setCurrent] = useState<number>(
    options?.pagination?.current || 1,
  );

  const getSpreadSheet = (): SpreadSheet => {
    const params: S2Constructor = [container.current, dataCfg, options];
    // TODO: 改个名字 spreadsheet => customSpreadsheet 之类的?
    if (spreadsheet) {
      return spreadsheet(...params);
    }
    return new SpreadSheet(...params);
  };

  const bindEvent = () => {
    baseSpreadsheet.current.on(
      KEY_AFTER_HEADER_LAYOUT,
      (layoutResult: LayoutResult) => {
        if (rowLevel && colLevel) {
          // TODO: 这里为啥返回 {level: '', id: '', label: ''} 这样的结构
          const rows: LayoutRow[] = layoutResult.rowsHierarchy
            .getNodesLessThanLevel(rowLevel)
            .map((value) => {
              return [value.level, value.id, value.label];
            });

          const cols: LayoutCol[] = layoutResult.colsHierarchy
            .getNodesLessThanLevel(colLevel)
            .map((value) => {
              return [value.level, value.id, value.label];
            });

          onRowColLayout?.(rows, cols);
        }
      },
    );

    const EVENT_LISTENER_CONFIG: Record<
      string,
      (...args: unknown[]) => unknown
    > = {
      [KEY_PAGINATION]: (data: PaginationCfg) => {
        setTotal(data?.total);
      },
      [S2Event.DATA_CELL_MOUSE_UP]: (ev: GEvent) => {
        onDataCellMouseUp?.(getBaseCellData(ev));
      },
      [S2Event.MERGED_CELLS_CLICK]: (ev: GEvent) => {
        onMergedCellsClick?.(getBaseCellData(ev));
      },
      [S2Event.ROW_CELL_CLICK]: (ev: GEvent) => {
        onRowCellClick?.(getBaseCellData(ev));
      },
      [S2Event.COL_CELL_CLICK]: (ev: GEvent) => {
        onColCellClick?.(getBaseCellData(ev));
      },
      [S2Event.RANGE_SORT]: (value: ListSortParams) => {
        onListSort?.(value);
      },
      [KEY_ROW_NODE_BORDER_REACHED]: (targetRow: TargetLayoutNode) => {
        onRowCellScroll?.(targetRow);
      },
      [KEY_COL_NODE_BORDER_REACHED]: (targetCol: TargetLayoutNode) => {
        onColCellScroll?.(targetCol);
      },
      [KEY_CELL_SCROLL]: (value: CellScrollPosition) => {
        onCellScroll?.(value);
      },
    };

    forIn(EVENT_LISTENER_CONFIG, (handler, event) => {
      baseSpreadsheet.current.on(event, handler);
    });
  };

  const unBindEvent = () => {
    [
      KEY_AFTER_HEADER_LAYOUT,
      KEY_PAGINATION,
      KEY_ROW_NODE_BORDER_REACHED,
      KEY_COL_NODE_BORDER_REACHED,
      KEY_CELL_SCROLL,
      S2Event.RANGE_SORT,
      S2Event.MERGED_CELLS_CLICK,
      S2Event.ROW_CELL_CLICK,
      S2Event.COL_CELL_CLICK,
      S2Event.DATA_CELL_MOUSE_UP,
    ].forEach((eventName) => {
      baseSpreadsheet.current.off(eventName);
    });
  };

  const iconClickCallback = (
    event: MouseEvent,
    sheetInstance: SpreadSheet,
    cacheDrillFields?: string[],
    disabledFields?: string[],
  ) => {
    const element = (
      <DrillDown
        {...partDrillDown.drillConfig}
        setDrillFields={setDrillFields}
        drillFields={cacheDrillFields}
        disabledFields={disabledFields}
      />
    );
    sheetInstance.showTooltip({
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

  const setOptions = (
    sheetInstance?: SpreadSheet,
    sheetProps?: BaseSheetProps,
  ) => {
    const curSheet = sheetInstance || ownSpreadsheet;
    const curProps = sheetProps || props;
    curSheet.setOptions(
      safetyOptions(HandleDrillDownIcon(curProps, curSheet, iconClickCallback)),
    );
  };

  const setDataCfg = () => {
    ownSpreadsheet.setDataCfg(dataCfg);
  };

  const update = (reset?: () => void, reloadData = true) => {
    if (!ownSpreadsheet) return;
    if (isFunction(reset)) reset();
    ownSpreadsheet.render(reloadData);
    setLoading(false);
  };

  /**
   * 清空下钻信息
   * @param rowId 不传表示全部清空
   */
  const clearDrillDownInfo = (rowId?: string) => {
    if (!ownSpreadsheet) return;
    setLoading(true);
    ownSpreadsheet.clearDrillDownData(rowId);
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
    // only show the pagination when the pageSize > 5
    const showQuickJumper = total / pageSize > 5;
    const preCls = `${S2_PREFIX_CLS}-pagination`;

    return (
      <div className={preCls}>
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
          className={`${preCls}-count`}
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
    if (baseSpreadsheet.current) {
      return;
    }
    baseSpreadsheet.current = getSpreadSheet();
    bindEvent();
    baseSpreadsheet.current.setDataCfg(safetyDataConfig(dataCfg));
    baseSpreadsheet.current.store.set('originalDataCfg', dataCfg);
    setOptions(baseSpreadsheet.current, props);
    baseSpreadsheet.current.setThemeCfg(themeCfg);
    baseSpreadsheet.current.render();
    setLoading(false);
    setOwnSpreadsheet(baseSpreadsheet.current);
    getSpreadsheet?.(baseSpreadsheet.current);
  };

  useEffect(() => {
    buildSpreadSheet();
    // 监听窗口变化
    if (adaptive) window.addEventListener('resize', debounceResize);
    return () => {
      unBindEvent();
      baseSpreadsheet.current.destroy();
      if (adaptive) window.removeEventListener('resize', debounceResize);
    };
  }, []);

  useEffect(() => {
    if (!container.current || !ownSpreadsheet) return;

    const style = getComputedStyle(container.current);

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
    update(setOptions, false);
  }, [options]);

  useEffect(() => {
    update(() => {
      ownSpreadsheet.setThemeCfg(themeCfg);
    });
  }, [JSON.stringify(themeCfg)]);

  useEffect(() => {
    if (!ownSpreadsheet) return;
    buildSpreadSheet();
  }, [spreadsheet]);

  useEffect(() => {
    if (!ownSpreadsheet) return;
    ownSpreadsheet.hideTooltip();
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
    <StrictMode>
      <Spin spinning={isLoading === undefined ? loading : isLoading}>
        {header && <Header {...header} sheet={ownSpreadsheet} />}
        <div ref={container} className={`${S2_PREFIX_CLS}-container`} />
        {renderPagination()}
      </Spin>
    </StrictMode>
  );
});
