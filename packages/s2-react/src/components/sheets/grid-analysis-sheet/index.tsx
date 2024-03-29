import { customMerge, SpreadSheet } from '@antv/s2';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';

export const GridAnalysisSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, themeCfg, ...restProps } = props;

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

    const S2ThemeCfg = React.useMemo(() => {
      return customMerge({}, themeCfg, { theme: GridAnalysisTheme });
    }, [themeCfg]);

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={S2ThemeCfg}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);

GridAnalysisSheet.displayName = 'GridAnalysisSheet';
