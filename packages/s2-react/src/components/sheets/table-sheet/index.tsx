// TODO 所有表组件抽取公共hook
import { Event as GEvent } from '@antv/g-canvas';
import { Spin } from 'antd';
import { forIn, isFunction } from 'lodash';
import React, { memo, StrictMode, useEffect, useRef, useState } from 'react';
import {
  SpreadSheet,
  CellScrollPosition,
  ListSortParams,
  S2Constructor,
  S2Options,
  TargetLayoutNode,
  EmitterType,
  S2_PREFIX_CLS,
  S2Event,
  getBaseCellData,
  getSafetyDataConfig,
  getSafetyOptions,
} from '@antv/s2';
import { Header } from '@/components/header';
import { BaseSheetProps } from '@/components/sheets/interface';
import {
  useResizeEffect,
  usePaginationEffect,
} from '@/components/sheets/hooks';
import { S2Pagination } from '@/components/pagination';
import { TableSheet as BaseTableSheet } from '@/components/sheets/table-sheet';

export const TableSheet: React.FC<BaseSheetProps> = memo((props) => {
  const {
    spreadsheet,
    dataCfg,
    options,
    adaptive = false,
    header,
    themeCfg,
    isLoading,
    onListSort,
    onRowCellScroll,
    onColCellScroll,
    onCellScroll,
    onDataCellClick,
    onDataCellDoubleClick,
    onRowCellClick,
    onColCellClick,
    onMergedCellsClick,
    onRowCellDoubleClick,
    onColCellDoubleClick,
    onMergedCellsDoubleClick,
    onDataCellMouseUp,
    onContextMenu,
    getSpreadsheet,
    showPagination = true,
  } = props;
  const container = useRef<HTMLDivElement>();
  const baseSpreadsheet = useRef<SpreadSheet>();

  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(
    options?.pagination?.current || 1,
  );
  const [pageSize, setPageSize] = useState<number>(
    options?.pagination?.pageSize || 10,
  );

  const getSpreadSheet = (): SpreadSheet => {
    const params: S2Constructor = [container.current, dataCfg, options];

    if (spreadsheet) {
      return spreadsheet(...params);
    }
    return new BaseTableSheet(...params);
  };

  const bindEvent = () => {
    const EVENT_LISTENER_CONFIG: Record<
      string,
      (...args: unknown[]) => unknown
    > = {
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
      [S2Event.DATA_CELL_CLICK]: (ev: GEvent) => {
        onDataCellClick?.(getBaseCellData(ev));
      },
      [S2Event.MERGED_CELLS_DOUBLE_CLICK]: (ev: GEvent) => {
        onMergedCellsDoubleClick?.(getBaseCellData(ev));
      },
      [S2Event.ROW_CELL_DOUBLE_CLICK]: (ev: GEvent) => {
        onRowCellDoubleClick?.(getBaseCellData(ev));
      },
      [S2Event.COL_CELL_DOUBLE_CLICK]: (ev: GEvent) => {
        onColCellDoubleClick?.(getBaseCellData(ev));
      },
      [S2Event.DATA_CELL_DOUBLE_CLICK]: (ev: GEvent) => {
        onDataCellDoubleClick?.(getBaseCellData(ev));
      },
      [S2Event.GLOBAL_CONTEXT_MENU]: (ev: GEvent) => {
        onContextMenu?.(getBaseCellData(ev));
      },
      [S2Event.LAYOUT_ROW_NODE_BORDER_REACHED]: (
        targetRow: TargetLayoutNode,
      ) => {
        onRowCellScroll?.(targetRow);
      },
      [S2Event.LAYOUT_COL_NODE_BORDER_REACHED]: (
        targetCol: TargetLayoutNode,
      ) => {
        onColCellScroll?.(targetCol);
      },
      [S2Event.LAYOUT_CELL_SCROLL]: (value: CellScrollPosition) => {
        onCellScroll?.(value);
      },
      [S2Event.RANGE_SORT]: (value: ListSortParams) => {
        onListSort?.(value);
      },
    };

    forIn(EVENT_LISTENER_CONFIG, (handler, event: keyof EmitterType) => {
      baseSpreadsheet.current.on(event, handler);
    });
  };

  const unBindEvent = () => {
    [
      S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
      S2Event.LAYOUT_ROW_NODE_BORDER_REACHED,
      S2Event.LAYOUT_COL_NODE_BORDER_REACHED,
      S2Event.LAYOUT_CELL_SCROLL,
      S2Event.RANGE_SORT,
      S2Event.MERGED_CELLS_CLICK,
      S2Event.ROW_CELL_CLICK,
      S2Event.COL_CELL_CLICK,
      S2Event.DATA_CELL_MOUSE_UP,
    ].forEach((eventName) => {
      baseSpreadsheet.current.off(eventName);
    });
  };

  const setOptions = (newOptions?: S2Options) => {
    const curOptions = newOptions || options;
    ownSpreadsheet.setOptions(getSafetyOptions(curOptions));
  };

  const setDataCfg = () => {
    // reset the options since it could be changed by layout
    setOptions();
    ownSpreadsheet.setDataCfg(getSafetyDataConfig(dataCfg));
  };

  const update = (reset?: () => void, reloadData = true) => {
    if (!ownSpreadsheet) return;
    if (isFunction(reset)) reset();
    ownSpreadsheet.render(reloadData);
    setTotal(ownSpreadsheet.facet.viewCellHeights.getTotalLength());
    setLoading(false);
  };

  const buildSpreadSheet = () => {
    if (baseSpreadsheet.current) {
      return;
    }
    baseSpreadsheet.current = getSpreadSheet();
    bindEvent();
    baseSpreadsheet.current.setDataCfg(getSafetyDataConfig(dataCfg));
    baseSpreadsheet.current.setOptions(getSafetyOptions(options));
    baseSpreadsheet.current.setThemeCfg(themeCfg);
    baseSpreadsheet.current.render();
    setLoading(false);
    setOwnSpreadsheet(baseSpreadsheet.current);
    getSpreadsheet?.(baseSpreadsheet.current);
  };

  useEffect(() => {
    buildSpreadSheet();
    return () => {
      unBindEvent();
      baseSpreadsheet.current.destroy();
    };
  }, []);

  // handle box size change and resize
  useResizeEffect(container.current, ownSpreadsheet, adaptive, options);

  // handle pagination change
  usePaginationEffect(ownSpreadsheet, options, current, pageSize);

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
  }, [ownSpreadsheet, JSON.stringify(themeCfg)]);

  useEffect(() => {
    if (!ownSpreadsheet) return;
    buildSpreadSheet();
  }, [spreadsheet]);

  useEffect(() => {
    ownSpreadsheet?.setOptions({ interaction: { hiddenColumnFields: [] } });
    ownSpreadsheet?.hideColumns(options.interaction?.hiddenColumnFields);
  }, [ownSpreadsheet, options.interaction?.hiddenColumnFields]);

  return (
    <StrictMode>
      <Spin spinning={isLoading === undefined ? loading : isLoading}>
        {header && <Header {...header} sheet={ownSpreadsheet} />}
        <div ref={container} className={`${S2_PREFIX_CLS}-container`} />
        {showPagination && (
          <S2Pagination
            total={total}
            pageSize={pageSize}
            current={current}
            setCurrent={setCurrent}
            setPageSize={setPageSize}
            pagination={options?.pagination}
          />
        )}
      </Spin>
    </StrictMode>
  );
});

TableSheet.displayName = 'TableSheet';
