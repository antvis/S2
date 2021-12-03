// TODO 抽取不同sheet组件的公共方法
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Event } from '@antv/g-canvas';
import {
  SpreadSheet,
  PivotSheet,
  S2Event,
  S2Options,
  getBaseCellData,
  S2Constructor,
  getSafetyDataConfig,
} from '@antv/s2';
import { Header } from '../../header';
import { BaseSheetProps } from '../interface';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';
import { useResizeEffect } from '@/hooks';
import { getSheetComponentOptions } from '@/utils';

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
    return getSheetComponentOptions(options, {
      dataCell: GridAnalysisDataCell,
      style: {
        colCfg: {
          hideMeasureColumn: true,
        },
      },
    });
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
    const params: S2Constructor = [container, dataCfg, buildOptions()];
    if (spreadsheet) {
      return spreadsheet(...params);
    }
    return new PivotSheet(...params);
  };

  const bindEvent = () => {
    baseSpreadsheet.on(S2Event.DATA_CELL_MOUSE_UP, (event: Event) => {
      onDataCellMouseUp?.(getBaseCellData(event));
    });
    baseSpreadsheet.on(S2Event.ROW_CELL_CLICK, (event: Event) => {
      onRowCellClick?.(getBaseCellData(event));
    });
    baseSpreadsheet.on(S2Event.COL_CELL_CLICK, (event: Event) => {
      onColCellClick?.(getBaseCellData(event));
    });
    baseSpreadsheet.on(S2Event.MERGED_CELLS_CLICK, (event: Event) => {
      onMergedCellsClick?.(getBaseCellData(event));
    });
    baseSpreadsheet.on(S2Event.ROW_CELL_DOUBLE_CLICK, (event: Event) => {
      onRowCellDoubleClick?.(getBaseCellData(event));
    });
    baseSpreadsheet.on(S2Event.COL_CELL_DOUBLE_CLICK, (event: Event) => {
      onColCellDoubleClick?.(getBaseCellData(event));
    });
    baseSpreadsheet.on(S2Event.MERGED_CELLS_DOUBLE_CLICK, (event: Event) => {
      onMergedCellsDoubleClick?.(getBaseCellData(event));
    });
  };

  const buildSpreadSheet = () => {
    if (!baseSpreadsheet) {
      baseSpreadsheet = initSpreadSheet();
      bindEvent();
      baseSpreadsheet.setDataCfg(dataCfg);
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
      {header && (
        <Header
          {...header}
          sheet={ownSpreadsheet}
          dataCfg={getSafetyDataConfig(dataCfg)}
          options={getSheetComponentOptions(options)}
        />
      )}
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
