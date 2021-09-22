// TODO 所有表组件抽取公共hook
import { Event as GEvent } from '@antv/g-canvas';
import { Pagination, Spin } from 'antd';
import { debounce, forIn, get, isEmpty, isFunction, merge } from 'lodash';
import React, { memo, StrictMode, useEffect, useRef, useState } from 'react';
import { S2Event } from '@/common/constant';
import { S2_PREFIX_CLS } from '@/common/constant/classnames';
import { i18n } from '@/common/i18n';
import {
  CellScrollPosition,
  ListSortParams,
  Pagination as PaginationCfg,
  S2Constructor,
  S2Options,
  safetyDataConfig,
  safetyOptions,
  TargetLayoutNode,
} from '@/common/interface';
import { EmitterType } from '@/common/interface/emitter';
import { Header } from '@/components/header';
import { BaseSheetProps } from '@/components/sheets/interface';
import { SpreadSheet, TableSheet as BaseTableSheet } from '@/sheet-type';
import { getBaseCellData } from '@/utils/interaction/formatter';

export const TableSheet: React.FC<BaseSheetProps> = memo((props) => {
  const {
    spreadsheet,
    dataCfg,
    options,
    adaptive = true,
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
  } = props;
  const container = useRef<HTMLDivElement>();
  const baseSpreadsheet = useRef<SpreadSheet>();

  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [resizeTimeStamp, setResizeTimeStamp] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>();
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
      [S2Event.LAYOUT_PAGINATION]: (data: PaginationCfg) => {
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
      S2Event.LAYOUT_PAGINATION,
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
    ownSpreadsheet.setOptions(safetyOptions(curOptions));
  };

  const setDataCfg = () => {
    // reset the options since it could be changed by layout
    setOptions();
    ownSpreadsheet.setDataCfg(safetyDataConfig(dataCfg));
  };

  const update = (reset?: () => void, reloadData = true) => {
    if (!ownSpreadsheet) return;
    if (isFunction(reset)) reset();
    ownSpreadsheet.render(reloadData);
    setLoading(false);
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
    // only show the pagination when the pageSize > 5
    const showQuickJumper = total / pageSize > 5;
    const preCls = `${S2_PREFIX_CLS}-pagination`;

    return (
      <div className={preCls}>
        <Pagination
          defaultCurrent={current}
          total={total}
          pageSize={pageSize}
          // TODO 外部定义的pageSize和内部PageSize改变的优先级处理
          showSizeChanger
          onShowSizeChange={(current, size) => {
            setCurrent(1);
            setPageSize(size);
          }}
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
    baseSpreadsheet.current.setOptions(safetyOptions(options));
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
    if (!ownSpreadsheet || isEmpty(options?.pagination)) return;
    const newOptions = merge({}, options, {
      pagination: {
        current: current,
      },
    });

    setOptions(newOptions);
    update();
  }, [current]);

  useEffect(() => {
    if (!ownSpreadsheet || isEmpty(options?.pagination)) return;
    const newOptions = merge({}, options, {
      pagination: {
        pageSize: pageSize,
      },
    });

    setOptions(newOptions);
    update();
  }, [pageSize]);

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
