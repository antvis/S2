import { Event as GEvent } from '@antv/g-canvas';
import { Spin } from 'antd';
import { forIn, isEmpty, isFunction } from 'lodash';
import React, { memo, StrictMode, useEffect, useRef, useState } from 'react';
import {
  S2Event,
  S2_PREFIX_CLS,
  CellScrollPosition,
  LayoutCol,
  LayoutResult,
  LayoutRow,
  ListSortParams,
  S2Constructor,
  S2Options,
  TargetLayoutNode,
  EmitterType,
  SpreadSheet,
  PivotSheet,
  getBaseCellData,
  getTooltipOptions,
  getSafetyDataConfig,
  customMerge,
} from '@antv/s2';
import { DrillDown } from '@/components/drill-down';
import { Header } from '@/components/header';
import { BaseSheetProps } from '@/components/sheets/interface';
import { useResizeEffect } from '@/hooks';
import { S2Pagination } from '@/components/pagination';
import {
  handleDrillDown,
  handleDrillDownIcon,
  getSheetComponentOptions,
} from '@/utils';

import './index.less';

export const BaseSheet: React.FC<BaseSheetProps> = memo((props) => {
  const {
    spreadsheet,
    dataCfg,
    options,
    adaptive,
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
    onRowCellHover,
    onRowCellDoubleClick,

    onColCellClick,
    onColCellHover,
    onColCellDoubleClick,

    onDataCellClick,
    onDataCellHover,
    onDataCellDoubleClick,

    onMergedCellClick,
    onMergedCellHover,
    onMergedCellsDoubleClick,

    onCornerCellDoubleClick,
    onCornerCellHover,
    onCornerCellClick,

    onDataCellMouseUp,
    getSpreadSheet,
    partDrillDown,
    showPagination,
  } = props;
  const container = useRef<HTMLDivElement>();
  const baseSpreadsheet = useRef<SpreadSheet>();

  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [drillFields, setDrillFields] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(
    options.pagination?.current || 1,
  );
  const [pageSize, setPageSize] = useState<number>(
    options.pagination?.pageSize || 10,
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
      [S2Event.DATA_CELL_MOUSE_UP]: (event: GEvent) => {
        onDataCellMouseUp?.(getBaseCellData(event));
      },

      [S2Event.MERGED_CELLS_CLICK]: (event: GEvent) => {
        onMergedCellClick?.(getBaseCellData(event));
      },
      [S2Event.MERGED_CELLS_HOVER]: (event: GEvent) => {
        onMergedCellHover?.(getBaseCellData(event));
      },
      [S2Event.MERGED_CELLS_DOUBLE_CLICK]: (event: GEvent) => {
        onMergedCellsDoubleClick?.(getBaseCellData(event));
      },

      [S2Event.ROW_CELL_CLICK]: (event: GEvent) => {
        onRowCellClick?.(getBaseCellData(event));
      },
      [S2Event.ROW_CELL_HOVER]: (event: GEvent) => {
        onRowCellHover?.(getBaseCellData(event));
      },
      [S2Event.ROW_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onRowCellDoubleClick?.(getBaseCellData(event));
      },

      [S2Event.COL_CELL_CLICK]: (event: GEvent) => {
        onColCellClick?.(getBaseCellData(event));
      },
      [S2Event.COL_CELL_HOVER]: (event: GEvent) => {
        onColCellHover?.(getBaseCellData(event));
      },
      [S2Event.COL_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onColCellDoubleClick?.(getBaseCellData(event));
      },

      [S2Event.DATA_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onDataCellDoubleClick?.(getBaseCellData(event));
      },
      [S2Event.DATA_CELL_CLICK]: (event: GEvent) => {
        onDataCellClick?.(getBaseCellData(event));
      },
      [S2Event.DATA_CELL_HOVER]: (event: GEvent) => {
        onDataCellHover?.(getBaseCellData(event));
      },

      [S2Event.CORNER_CELL_DOUBLE_CLICK]: (event: GEvent) => {
        onCornerCellDoubleClick?.(getBaseCellData(event));
      },
      [S2Event.CORNER_CELL_HOVER]: (event: GEvent) => {
        onCornerCellHover?.(getBaseCellData(event));
      },
      [S2Event.CORNER_CELL_CLICK]: (event: GEvent) => {
        onCornerCellClick?.(getBaseCellData(event));
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

  const onIconClick = (
    sheetInstance: SpreadSheet,
    cacheDrillFields?: string[],
    disabledFields?: string[],
    event?: GEvent,
  ) => {
    const content = (
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
      sheetInstance.showTooltip<React.ReactNode>({
        position: {
          x: event.clientX,
          y: event.clientY,
        },
        content,
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
      curOptions = handleDrillDownIcon(curProps, curSheet, onIconClick);
    }

    curSheet.setOptions(curOptions);
  };

  const setDataCfg = () => {
    // reset the options since it could be changed by layout
    setOptions();
    ownSpreadsheet.setDataCfg(getSafetyDataConfig(dataCfg));
  };

  const update = (reset?: () => void, reloadData?: boolean) => {
    if (!ownSpreadsheet) return;
    if (isFunction(reset)) reset();
    ownSpreadsheet.render(reloadData);
    setTotal(
      options?.pagination?.total ??
        ownSpreadsheet.facet.viewCellHeights.getTotalLength(),
    );
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
    baseSpreadsheet.current = renderSpreadSheet();
    bindEvent();
    baseSpreadsheet.current.setDataCfg(getSafetyDataConfig(dataCfg));
    setOptions(baseSpreadsheet.current, props);
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
      clearDrillDownInfo(ownSpreadsheet.store.get('drillDownNode')?.id);
    } else {
      setLoading(true);
      handleDrillDown({
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
    if (!ownSpreadsheet || isEmpty(options.pagination)) return;
    const newOptions = customMerge(options, {
      pagination: {
        current,
        pageSize,
      },
    });
    const newProps = customMerge(props, {
      options: newOptions,
    });
    setOptions(ownSpreadsheet, newProps);
    update(null, false);
  }, [pageSize, current]);

  return (
    <StrictMode>
      <Spin spinning={isLoading === undefined ? loading : isLoading}>
        {header && (
          <Header
            {...header}
            sheet={ownSpreadsheet}
            width={options.width}
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
            pagination={options.pagination}
          />
        )}
      </Spin>
    </StrictMode>
  );
});

BaseSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: true,
};
