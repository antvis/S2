import React from 'react';
import { SpreadSheet, customMerge } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';
import { SheetComponentsProps } from '@/components/sheets/interface';

export const GridAnalysisSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, ...restProps } = props;

    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge(options, {
        dataCell: GridAnalysisDataCell,
        showDefaultHeaderActionIcon: false,
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
  },
);

GridAnalysisSheet.displayName = 'GridAnalysisSheet';
