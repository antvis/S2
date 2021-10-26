// TODO 抽取不同sheet组件的公共方法
import React, { useEffect, useState } from 'react';
import { forEach, isEmpty, isFunction, forIn, isObject, max } from 'lodash';
import { merge } from 'lodash';
import { Spin } from 'antd';
import { Event } from '@antv/g-canvas';
import { Header } from '../../header';
import { BaseSheetProps } from '../interface';
import { TabularDataCell } from './tabular-data-cell';
import { TabularTheme } from './tabular-theme';
import { S2Event } from '@/common/constant';
import { getBaseCellData } from '@/utils/interaction/formatter';
import { S2Options } from '@/common/interface';
import { getSafetyDataConfig, getSafetyOptions } from '@/utils/merge';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { useResizeEffect } from '@/components/sheets/hooks';

export const TabularSheet = (props: BaseSheetProps) => {
  const {
    spreadsheet,
    // TODO dataCfg细化
    dataCfg,
    options,
    adaptive = true,
    header,
    themeCfg = {
      theme: TabularTheme,
    },
    isLoading,
    onRowCellClick,
    onColCellClick,
    onMergedCellsClick,
    onRowCellDoubleClick,
    onColCellDoubleClick,
    onMergedCellsDoubleClick,
    onDataCellMouseUp,
    getSpreadsheet,
  } = props;
  let container: HTMLDivElement;
  let baseSpreadsheet: SpreadSheet;
  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [loading, setLoading] = useState<boolean>(true);

  // 网格内行高
  const CELL_LINE_HEIGHT = 30;

  const getCellHeight = (): number => {
    const { data } = dataCfg;
    const height = options?.style?.cellCfg?.height;
    if (height) return height;
    const lineHeight = options?.style?.cellCfg?.lineHeight || CELL_LINE_HEIGHT;
    if (isEmpty(data)) return lineHeight;
    const lengths = [];
    // TODO 还没想清楚需不需要找最大的，需不需要限定都一样的个数，先让子弹飞一飞
    forEach(data, (value) => {
      forIn(value, (v) => {
        if (isObject(v) && v?.values) {
          lengths.push(v?.values.length);
        }
      });
    });
    const maxLength = max(lengths) || 1;
    return maxLength * lineHeight;
  };

  const buildOptions = (): S2Options => {
    return getSafetyOptions(
      merge(options, {
        dataCell: TabularDataCell,
        style: {
          colCfg: {
            colWidthType: 'adaptive',
            hideMeasureColumn: true,
          },
          cellCfg: {
            height: getCellHeight(),
          },
          device: 'pc',
        },
      }),
    );
  };

  const setOptions = (sheetInstance?: SpreadSheet) => {
    const newOptions = buildOptions();
    const curSheet = sheetInstance || ownSpreadsheet;
    curSheet.setOptions(newOptions);
  };

  const setDataCfg = () => {
    ownSpreadsheet.setDataCfg(dataCfg);
  };

  const update = (reset?: () => void, callBack?: () => void) => {
    if (!ownSpreadsheet) return;

    reset?.();
    callBack?.();
    ownSpreadsheet.render();
    setLoading(false);
  };

  const getSpreadSheet = (): SpreadSheet => {
    if (spreadsheet) {
      return spreadsheet(container, dataCfg, buildOptions());
    }
    return new PivotSheet(container, dataCfg, buildOptions());
  };

  const bindEvent = () => {
    baseSpreadsheet.on(S2Event.DATA_CELL_MOUSE_UP, (ev: Event) => {
      if (isFunction(onDataCellMouseUp)) {
        onDataCellMouseUp(getBaseCellData(ev));
      }
    });
    baseSpreadsheet.on(S2Event.ROW_CELL_CLICK, (ev: Event) => {
      if (isFunction(onRowCellClick)) {
        onRowCellClick(getBaseCellData(ev));
      }
    });
    baseSpreadsheet.on(S2Event.COL_CELL_CLICK, (ev: Event) => {
      if (isFunction(onColCellClick)) {
        onColCellClick(getBaseCellData(ev));
      }
    });

    baseSpreadsheet.on(S2Event.MERGED_CELLS_CLICK, (ev: Event) => {
      if (isFunction(onMergedCellsClick)) {
        onMergedCellsClick(getBaseCellData(ev));
      }
    });
    baseSpreadsheet.on(S2Event.ROW_CELL_DOUBLE_CLICK, (ev: Event) => {
      if (isFunction(onRowCellClick)) {
        onRowCellDoubleClick(getBaseCellData(ev));
      }
    });
    baseSpreadsheet.on(S2Event.COL_CELL_DOUBLE_CLICK, (ev: Event) => {
      if (isFunction(onColCellClick)) {
        onColCellDoubleClick(getBaseCellData(ev));
      }
    });

    baseSpreadsheet.on(S2Event.MERGED_CELLS_DOUBLE_CLICK, (ev: Event) => {
      if (isFunction(onMergedCellsClick)) {
        onMergedCellsDoubleClick(getBaseCellData(ev));
      }
    });
  };

  const unBindEvent = () => {
    baseSpreadsheet.off(S2Event.MERGED_CELLS_CLICK);
    baseSpreadsheet.off(S2Event.ROW_CELL_CLICK);
    baseSpreadsheet.off(S2Event.COL_CELL_CLICK);
    baseSpreadsheet.off(S2Event.DATA_CELL_MOUSE_UP);
  };

  const buildSpreadSheet = () => {
    if (!baseSpreadsheet) {
      baseSpreadsheet = getSpreadSheet();
      bindEvent();
      const newDataCfg = getSafetyDataConfig(dataCfg);
      baseSpreadsheet.setDataCfg(newDataCfg);
      setOptions(baseSpreadsheet);
      baseSpreadsheet.setThemeCfg(themeCfg);
      baseSpreadsheet.render();
      setLoading(false);
      setOwnSpreadsheet(baseSpreadsheet);
      if (getSpreadsheet) getSpreadsheet(baseSpreadsheet);
    }
  };

  useEffect(() => {
    buildSpreadSheet();
    return () => {
      unBindEvent();
      baseSpreadsheet.destroy();
    };
  }, []);

  // handle box size change and resize
  useResizeEffect(container, ownSpreadsheet, adaptive, options);

  useEffect(() => {
    update(setDataCfg, setOptions);
  }, [dataCfg]);

  useEffect(() => {
    update(setOptions);
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

TabularSheet.displayName = 'TabularSheet';
