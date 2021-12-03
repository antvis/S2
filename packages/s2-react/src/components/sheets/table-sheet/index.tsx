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
  TableSheet as BaseTableSheet,
} from '@antv/s2';
import { Header } from '@/components/header';
import { BaseSheetProps } from '@/components/sheets/interface';
import { useResizeEffect, usePaginationEffect } from '@/hooks';
import { S2Pagination } from '@/components/pagination';
import { getSheetComponentOptions } from '@/utils';

export const TableSheet: React.FC<BaseSheetProps> = memo((props) => {
  const {
    spreadsheet,
    dataCfg,
    options,
    adaptive,
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
    getSpreadSheet,
    showPagination,
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

  const renderSpreadSheet = (): SpreadSheet => {
    const params: S2Constructor = [
      container.current,
      dataCfg,
      getSheetComponentOptions(options),
    ];

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
      [S2Event.DATA_CELL_MOUSE_UP]: (event: GEvent) => {
        onDataCellMouseUp?.(getBaseCellData(event));
      },
      [S2Event.MERGED_CELLS_CLICK]: (event: GEvent) => {
        onMergedCellsClick?.(getBaseCellData(event));
      },
      [S2Event.ROW_CELL_CLICK]: (event: GEvent) => {
        onRowCellClick?.(getBaseCellData(event));
      },
      [S2Event.COL_CELL_CLICK]: (event: GEvent) => {
        onColCellClick?.(getBaseCellData(event));
      },
      [S2Event.DATA_CELL_CLICK]: (event: GEvent) => {
        onDataCellClick?.(getBaseCellData(event));
      },
      [S2Event.DATA_CELL_HOVER]: (event: GEvent) => {
        onDataCellClick?.(getBaseCellData(event));
      },
      [S2Event.MERGED_CELLS_DOUBLE_CLICK]: (event: GEvent) => {
        onMergedCellsDoubleClick?.(getBaseCellData(event));
      },
      [S2Event.ROW_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onRowCellDoubleClick?.(getBaseCellData(event));
      },
      [S2Event.COL_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onColCellDoubleClick?.(getBaseCellData(event));
      },
      [S2Event.DATA_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onDataCellDoubleClick?.(getBaseCellData(event));
      },
      [S2Event.GLOBAL_CONTEXT_MENU]: (event: GEvent) => {
        onContextMenu?.(getBaseCellData(event));
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

  const setOptions = (newOptions?: S2Options) => {
    const curOptions = newOptions || options;
    ownSpreadsheet.setOptions(curOptions);
  };

  const setDataCfg = () => {
    // reset the options since it could be changed by layout
    setOptions();
    ownSpreadsheet.setDataCfg(dataCfg);
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
    baseSpreadsheet.current = renderSpreadSheet();
    bindEvent();
    baseSpreadsheet.current.setDataCfg(dataCfg);
    baseSpreadsheet.current.setOptions(options);
    baseSpreadsheet.current.setThemeCfg(themeCfg);
    baseSpreadsheet.current.render();
    setLoading(false);
    setOwnSpreadsheet(baseSpreadsheet.current);
    getSpreadSheet?.(baseSpreadsheet.current);
  };

  useEffect(() => {
    buildSpreadSheet();
    return () => {
      baseSpreadsheet.current.destroy();
    };
  }, []);

  // handle box size change and resize
  useResizeEffect({
    spreadsheet: ownSpreadsheet,
    container: container.current,
    adaptive,
    options,
  });

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
    ownSpreadsheet?.interaction.hideColumns(
      options.interaction?.hiddenColumnFields,
    );
  }, [ownSpreadsheet, options.interaction?.hiddenColumnFields]);

  useEffect(() => {
    setCurrent(options?.pagination?.current || 1);
    setPageSize(options?.pagination?.pageSize || 10);
  }, [options?.pagination]);

  return (
    <StrictMode>
      <Spin spinning={isLoading === undefined ? loading : isLoading}>
        {header && (
          <Header
            {...header}
            sheet={ownSpreadsheet}
            dataCfg={getSafetyDataConfig(dataCfg)}
            options={getSheetComponentOptions(options)}
          />
        )}
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

TableSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: true,
};
TableSheet.displayName = 'TableSheet';
