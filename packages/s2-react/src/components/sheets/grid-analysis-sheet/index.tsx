import { customMerge, type ThemeCfg } from '@antv/s2';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';
import { GridAnalysisDataCell } from './grid-analysis-data-cell';
import { GridAnalysisTheme } from './grid-analysis-theme';

export const GridAnalysisSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, themeCfg, ...restProps } = props;

    const s2Options = React.useMemo(
      () =>
        customMerge<SheetComponentOptions>(options, {
          dataCell: GridAnalysisDataCell,
          showDefaultHeaderActionIcon: false,
          style: {
            colCell: {
              hideValue: true,
            },
          },
        }),
      [options],
    );

    const S2ThemeCfg = React.useMemo(
      () => customMerge<ThemeCfg>(themeCfg, { theme: GridAnalysisTheme }),
      [themeCfg],
    );

    return (
      <BaseSheet options={s2Options} themeCfg={S2ThemeCfg} {...restProps} />
    );
  },
);

GridAnalysisSheet.displayName = 'GridAnalysisSheet';
