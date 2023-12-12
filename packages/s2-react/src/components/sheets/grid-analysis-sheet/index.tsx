import { customMerge, type ThemeCfg } from '@antv/s2';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';
import { GridAnalysisSheetDataCell } from './custom-cell';
import { GridAnalysisTheme } from './theme';

export const GridAnalysisSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options: defaultOptions, themeCfg, ...restProps } = props;

    const s2Options = React.useMemo<SheetComponentOptions>(() => {
      const options: SheetComponentOptions = {
        dataCell: (viewMeta) =>
          new GridAnalysisSheetDataCell(viewMeta, viewMeta.spreadsheet),
        showDefaultHeaderActionIcon: false,
        style: {
          colCell: {
            hideValue: true,
          },
        },
      };

      return customMerge<SheetComponentOptions>(defaultOptions, options);
    }, [defaultOptions]);

    const s2ThemeCfg = React.useMemo<ThemeCfg>(
      () => customMerge<ThemeCfg>(themeCfg, { theme: GridAnalysisTheme }),
      [themeCfg],
    );

    return (
      <BaseSheet options={s2Options} themeCfg={s2ThemeCfg} {...restProps} />
    );
  },
);

GridAnalysisSheet.displayName = 'GridAnalysisSheet';
