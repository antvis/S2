// TODO 抽取不同sheet组件的公共方法
import React, { useEffect, useState } from 'react';
import { isEmpty, isFunction } from 'lodash';
import { merge } from 'lodash';
import { Spin } from 'antd';
import { Event } from '@antv/g-canvas';
import { Header } from '../../header';
import { BaseSheetProps } from '../interface';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';
import { S2Event } from '@/common/constant';
import { getBaseCellData } from '@/utils/interaction/formatter';
import { S2Options } from '@/common/interface';
import { getSafetyDataConfig, getSafetyOptions } from '@/utils/merge';
import { SpreadSheet, PivotSheet } from '@/sheet-type';
import { useResizeEffect } from '@/components/sheets/hooks';

export const GridAnalysisSheet: React.FC<BaseSheetProps> = (props) => {
  const {
    spreadsheet,
    // TODO dataCfg细化
    dataCfg,
    options,
    adaptive,
    header,
    themeCfg = {
      theme: GridAnalysisTheme,
    },
    isLoading,
    onRowCellClick,
    onColCellClick,
    onMergedCellsClick,
    onRowCellDoubleClick,
    onColCellDoubleClick,
    onMergedCellsDoubleClick,
    onDataCellMouseUp,
    getSpreadSheet,
  } = props;
  let container: HTMLDivElement;
  let baseSpreadsheet: SpreadSheet;
  const [ownSpreadsheet, setOwnSpreadsheet] = useState<SpreadSheet>();
  const [loading, setLoading] = useState<boolean>(true);

  const buildOptions = (): S2Options => {
    return getSafetyOptions(
      merge(options, {
        dataCell: GridAnalysisDataCell,
        style: {
          colCfg: {
            hideMeasureColumn: true,
          },
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

  const initSpreadSheet = (): SpreadSheet => {
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
      baseSpreadsheet = initSpreadSheet();
      bindEvent();
      const newDataCfg = getSafetyDataConfig(dataCfg);
      baseSpreadsheet.setDataCfg(newDataCfg);
      setOptions(baseSpreadsheet);
      baseSpreadsheet.setThemeCfg(themeCfg);
      baseSpreadsheet.render();
      setLoading(false);
      setOwnSpreadsheet(baseSpreadsheet);
      getSpreadSheet?.(baseSpreadsheet);
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
  useResizeEffect({
    spreadsheet: ownSpreadsheet,
    container,
    adaptive,
    options,
  });

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
  }, [themeCfg]);

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

GridAnalysisSheet.defaultProps = {
  adaptive: false,
  options: {} as S2Options,
};
GridAnalysisSheet.displayName = 'GridAnalysisSheet';
