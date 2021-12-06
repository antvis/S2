import { Event as GEvent } from '@antv/g-canvas';
import { Spin } from 'antd';
import { forIn, isEmpty } from 'lodash';
import React from 'react';
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

export const BaseSheet: React.FC<BaseSheetProps> = React.memo((props) => {
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
    getSpreadSheet,
    partDrillDown,
    showPagination,
  } = props;
  const container = React.useRef<HTMLDivElement>();
  const s2Ref = React.useRef<SpreadSheet>();

  const [drillFields, setDrillFields] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [current, setCurrent] = React.useState<number>(
    options.pagination?.current || 1,
  );
  const [pageSize, setPageSize] = React.useState<number>(
    options.pagination?.pageSize || 10,
  );

  const renderSpreadSheet = React.useCallback<() => SpreadSheet>(() => {
    const s2Options = getSheetComponentOptions(options);
    if (spreadsheet) {
      return spreadsheet(container.current, dataCfg, s2Options);
    }
    return new PivotSheet(container.current, dataCfg, s2Options);
  }, [dataCfg, options, spreadsheet]);

  const bindEvent = React.useCallback(() => {
    s2Ref.current.on(
      S2Event.LAYOUT_AFTER_HEADER_LAYOUT,
      (layoutResult: LayoutResult) => {
        if (rowLevel && colLevel) {
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

          props.onRowColLayout?.(rows, cols);
        }
      },
    );

    const EVENT_LISTENER_CONFIG: Record<string, (...args: unknown[]) => void> =
      {
        [S2Event.DATA_CELL_MOUSE_UP]: (event: GEvent) => {
          props.onDataCellMouseUp?.(getBaseCellData(event));
        },

        [S2Event.MERGED_CELLS_CLICK]: (event: GEvent) => {
          props.onMergedCellClick?.(getBaseCellData(event));
        },
        [S2Event.MERGED_CELLS_HOVER]: (event: GEvent) => {
          props.onMergedCellHover?.(getBaseCellData(event));
        },
        [S2Event.MERGED_CELLS_DOUBLE_CLICK]: (event: GEvent) => {
          props.onMergedCellsDoubleClick?.(getBaseCellData(event));
        },

        [S2Event.ROW_CELL_CLICK]: (event: GEvent) => {
          props.onRowCellClick?.(getBaseCellData(event));
        },
        [S2Event.ROW_CELL_HOVER]: (event: GEvent) => {
          props.onRowCellHover?.(getBaseCellData(event));
        },
        [S2Event.ROW_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onRowCellDoubleClick?.(getBaseCellData(event));
        },

        [S2Event.COL_CELL_CLICK]: (event: GEvent) => {
          props.onColCellClick?.(getBaseCellData(event));
        },
        [S2Event.COL_CELL_HOVER]: (event: GEvent) => {
          props.onColCellHover?.(getBaseCellData(event));
        },
        [S2Event.COL_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onColCellDoubleClick?.(getBaseCellData(event));
        },

        [S2Event.DATA_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onDataCellDoubleClick?.(getBaseCellData(event));
        },
        [S2Event.DATA_CELL_CLICK]: (event: GEvent) => {
          props.onDataCellClick?.(getBaseCellData(event));
        },
        [S2Event.DATA_CELL_HOVER]: (event: GEvent) => {
          props.onDataCellHover?.(getBaseCellData(event));
        },

        [S2Event.CORNER_CELL_DOUBLE_CLICK]: (event: GEvent) => {
          props.onCornerCellDoubleClick?.(getBaseCellData(event));
        },
        [S2Event.CORNER_CELL_HOVER]: (event: GEvent) => {
          props.onCornerCellHover?.(getBaseCellData(event));
        },
        [S2Event.CORNER_CELL_CLICK]: (event: GEvent) => {
          props.onCornerCellClick?.(getBaseCellData(event));
        },

        [S2Event.LAYOUT_ROW_NODE_BORDER_REACHED]: (
          targetRow: TargetLayoutNode,
        ) => {
          props.onRowCellScroll?.(targetRow);
        },
        [S2Event.LAYOUT_COL_NODE_BORDER_REACHED]: (
          targetCol: TargetLayoutNode,
        ) => {
          props.onColCellScroll?.(targetCol);
        },
        [S2Event.LAYOUT_CELL_SCROLL]: (value: CellScrollPosition) => {
          props.onCellScroll?.(value);
        },
        [S2Event.RANGE_SORT]: (value: ListSortParams) => {
          props.onListSort?.(value);
        },
      };

    forIn(EVENT_LISTENER_CONFIG, (handler, event: keyof EmitterType) => {
      s2Ref.current.on(event, handler);
    });
  }, [colLevel, props, rowLevel]);

  const onIconClick = React.useCallback(
    (
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
    },
    [partDrillDown.drillConfig],
  );

  const setOptions = React.useCallback(
    (sheetProps: BaseSheetProps = props) => {
      const curProps = sheetProps;

      const currentOptions = partDrillDown
        ? handleDrillDownIcon(curProps, s2Ref.current, onIconClick)
        : options;

      s2Ref.current.setOptions(currentOptions);
    },
    [onIconClick, options, partDrillDown, props],
  );

  const setDataCfg = () => {
    // reset the options since it could be changed by layout
    setOptions();
    s2Ref.current?.setDataCfg(getSafetyDataConfig(dataCfg));
  };

  const update = (reset?: () => void, reloadData?: boolean) => {
    if (!s2Ref.current) return;
    reset?.();
    s2Ref.current.render(reloadData);
    setTotal(s2Ref.current.facet.viewCellHeights.getTotalLength());
    setLoading(false);
  };

  /**
   * 清空下钻信息
   * @param rowId 不传表示全部清空
   */
  const clearDrillDownInfo = (rowId?: string) => {
    setLoading(true);
    s2Ref.current.clearDrillDownData(rowId);
  };

  const buildSpreadSheet = React.useCallback(() => {
    if (s2Ref.current) {
      return;
    }
    setLoading(true);
    s2Ref.current = renderSpreadSheet();
    s2Ref.current.setDataCfg(dataCfg);
    setOptions(s2Ref.current);
    s2Ref.current.setThemeCfg(themeCfg);
    bindEvent();
    s2Ref.current.render();
    setLoading(false);
    getSpreadSheet?.(s2Ref.current);
  }, [
    bindEvent,
    dataCfg,
    getSpreadSheet,
    renderSpreadSheet,
    setOptions,
    themeCfg,
  ]);

  React.useEffect(() => {
    buildSpreadSheet();
    return () => {
      s2Ref.current.destroy();
    };
  }, [buildSpreadSheet]);

  // handle box size change and resize
  useResizeEffect({
    spreadsheet: s2Ref.current,
    container: container.current,
    adaptive,
    options,
  });

  React.useEffect(() => {
    update(setDataCfg);
  }, [dataCfg]);

  React.useEffect(() => {
    update(setOptions, false);
  }, [options]);

  React.useEffect(() => {
    update(() => {
      s2Ref.current.setThemeCfg(themeCfg);
    });
  }, [themeCfg]);

  React.useEffect(() => {
    buildSpreadSheet();
  }, [buildSpreadSheet, spreadsheet]);

  React.useEffect(() => {
    s2Ref.current.hideTooltip();
    if (isEmpty(drillFields)) {
      clearDrillDownInfo(s2Ref.current.store.get('drillDownNode')?.id);
    } else {
      setLoading(true);
      handleDrillDown({
        rows: dataCfg.fields.rows,
        drillFields: drillFields,
        fetchData: partDrillDown.fetchData,
        drillItemsNum: partDrillDown?.drillItemsNum,
        spreadsheet: s2Ref.current,
      });
    }
    setOptions();
  }, [dataCfg.fields.rows, drillFields, partDrillDown, setOptions]);

  React.useEffect(() => {
    if (isEmpty(partDrillDown?.clearDrillDown)) return;
    clearDrillDownInfo(partDrillDown?.clearDrillDown?.rowId);
  }, [partDrillDown?.clearDrillDown]);

  React.useEffect(() => {
    if (!partDrillDown?.drillItemsNum) return;
    clearDrillDownInfo();
  }, [partDrillDown?.drillItemsNum]);

  React.useEffect(() => {
    if (!partDrillDown) {
      return;
    }
    update(setOptions);
  }, [partDrillDown, partDrillDown.drillConfig.dataSet, setOptions]);

  React.useEffect(() => {
    if (isEmpty(options.pagination)) {
      return;
    }
    const newOptions = customMerge(options, {
      pagination: {
        current,
        pageSize,
      },
    });
    const newProps = customMerge(props, {
      options: newOptions,
    });
    setOptions(newProps);
    update(null, false);
  }, [pageSize, current, options, props, setOptions]);

  return (
    <React.StrictMode>
      <Spin spinning={isLoading === undefined ? loading : isLoading}>
        {header && (
          <Header
            {...header}
            sheet={s2Ref.current}
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
    </React.StrictMode>
  );
});

BaseSheet.defaultProps = {
  options: {} as S2Options,
  adaptive: false,
  showPagination: true,
};
