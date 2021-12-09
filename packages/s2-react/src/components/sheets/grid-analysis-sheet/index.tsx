import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { BaseSheetComponentProps } from '../interface';
import { BaseSheet } from '../base-sheet';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';
import { getSheetComponentOptions } from '@/utils';

export const GridAnalysisSheet: React.FC<BaseSheetComponentProps> = (props) => {
  const { options, ...restProps } = props;
  const s2Ref = React.useRef<SpreadSheet>();
  const s2Options = React.useMemo(() => {
    return getSheetComponentOptions(options, {
      dataCell: GridAnalysisDataCell,
      style: {
        colCfg: {
          hideMeasureColumn: true,
        },
      },
    });
  }, [options]);

  return (
    <BaseSheet
      {...restProps}
      themeCfg={{
        theme: GridAnalysisTheme,
      }}
      options={s2Options}
      ref={s2Ref}
    />
  );
};

GridAnalysisSheet.displayName = 'GridAnalysisSheet';
