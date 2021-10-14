import { Event as GEvent } from '@antv/g-canvas';
import { Pagination, Spin } from 'antd';
import { forIn, get, isEmpty, isFunction, merge } from 'lodash';
import React, { memo, StrictMode, useEffect, useRef, useState } from 'react';
import { S2Event } from '@/common/constant';
import { S2_PREFIX_CLS } from '@/common/constant/classnames';
import { i18n } from '@/common/i18n';
import {
  CellScrollPosition,
  LayoutCol,
  LayoutResult,
  LayoutRow,
  ListSortParams,
  S2Constructor,
  safetyDataConfig,
  safetyOptions,
  TargetLayoutNode,
} from '@/common/interface';
import { EmitterType } from '@/common/interface/emitter';
import { DrillDown } from '@/components/drill-down';
import { Header } from '@/components/header';
import { BaseSheetProps } from '@/components/sheets/interface';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { HandleDrillDown, HandleDrillDownIcon } from '@/utils/drill-down';
import { getBaseCellData } from '@/utils/interaction/formatter';
import { useResizeEffect } from '@/components/sheets/hooks';
import { getTooltipOptions } from '@/utils/tooltip';
import { S2Pagination } from '@/components/pagination';

import './index.less';
export const BaseSheet: React.FC<BaseSheetProps> = memo((props) => {
  const {
    spreadsheet,
    dataCfg,
    options,
    adaptive = false,
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
    onRowCellDoubleClick,
    onColCellDoubleClick,
    onMergedCellsDoubleClick,
    onDataCellMouseUp,
    getSpreadsheet,
    partDrillDown,
    showDefaultPagination = true,
  } = props;
  const container = useRef<HTMLDivElement>();
  const baseSpreadsheet = useRef<SpreadSheet>();

  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [drillFields, setDrillFields] = useState<string[]>([]);
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
    return new PivotSheet(...params);
  };

  const bindEvent = () => {
    baseSpreadsheet.current.on(
      S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
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
      [S2Event.MERGED_CELLS_DOUBLE_CLICK]: (ev: GEvent) => {
        onMergedCellsDoubleClick?.(getBaseCellData(ev));
      },
      [S2Event.ROW_CELL_DOUBLE_CLICK]: (ev: GEvent) => {
        onRowCellDoubleClick?.(getBaseCellData(ev));
      },
      [S2Event.COL_CELL_DOUBLE_CLICK]: (ev: GEvent) => {
        onColCellDoubleClick?.(getBaseCellData(ev));
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

  const iconClickCallback = (
    sheetInstance: SpreadSheet,
    cacheDrillFields?: string[],
    disabledFields?: string[],
    event?: GEvent,
  ) => {
    const element = (
      <DrillDown
        {...partDrillDown.drillConfig}
        setDrillFields={setDrillFields}
        drillFields={cacheDrillFields}
        disabledFields={disabledFields}
      />
    );
    if (event) {
      const { showTooltip } = getTooltipOptions(sheetInstance, event);
      if (!showTooltip) {
        return;
      }
      sheetInstance.showTooltip({
        position: {
          x: event.clientX,
          y: event.clientY,
        },
        element,
      });
    }
  };

  const setOptions = (
    sheetInstance?: SpreadSheet,
    sheetProps?: BaseSheetProps,
  ) => {
    const curSheet = sheetInstance || ownSpreadsheet;
    const curProps = sheetProps || props;
    let curOptions = options;

    // 处理下钻参数
    if (partDrillDown) {
      curOptions = HandleDrillDownIcon(curProps, curSheet, iconClickCallback);
    }

    curSheet.setOptions(safetyOptions(curOptions));
  };

  const setDataCfg = () => {
    // reset the options since it could be changed by layout
    setOptions();
    ownSpreadsheet.setDataCfg(safetyDataConfig(dataCfg));
  };

  const update = (reset?: () => void, reloadData?: boolean) => {
    if (!ownSpreadsheet) return;
    if (isFunction(reset)) reset();
    ownSpreadsheet.render(reloadData);
    setTotal(ownSpreadsheet.facet.viewCellHeights.getTotalLength());
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
    return () => {
      unBindEvent();
      baseSpreadsheet.current.destroy();
    };
  }, []);

  // handle box size change and resize
  useResizeEffect(container.current, ownSpreadsheet, adaptive, options);

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
    setOptions();
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
        current,
        pageSize,
      },
    });
    const newProps = merge({}, props, {
      options: newOptions,
    });
    setOptions(ownSpreadsheet, newProps);
    update(null, false);
  }, [pageSize, current]);

  useEffect(() => {
    ownSpreadsheet?.setOptions({ hiddenColumnFields: [] });
    ownSpreadsheet?.hideColumns(options.hiddenColumnFields);
  }, [ownSpreadsheet, options.hiddenColumnFields]);

  return (
    <StrictMode>
      <Spin spinning={isLoading === undefined ? loading : isLoading}>
        {header && <Header {...header} sheet={ownSpreadsheet} />}
        <div ref={container} className={`${S2_PREFIX_CLS}-container`} />
        {showDefaultPagination && (
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
