import { customMerge } from '@antv/s2';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentsProps } from '../interface';
import { ChartSheetDataCell } from './custom-cell';

export const ChartSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options: defaultOptions, ...restProps } = props;
    const s2Options = React.useMemo<SheetComponentOptions>(() => {
      const options: SheetComponentOptions = {
        dataCell: (viewMeta) =>
          new ChartSheetDataCell(viewMeta, viewMeta.spreadsheet),
        showDefaultHeaderActionIcon: false,
        interaction: {
          hoverFocus: false,
        },
        // TODO: 刷选时获取不到正确的 tooltip 配置
        tooltip: {
          // cornerCell: {
          //   enable: true,
          // },
          // colCell: {
          //   enable: true,
          // },
          // rowCell: {
          //   enable: true,
          // },
          // enable: false,
          enable: true,
          dataCell: {
            enable: false,
          },
        },
      };

      return customMerge<SheetComponentOptions>(defaultOptions, options);
    }, [defaultOptions]);

    return <BaseSheet {...restProps} options={s2Options} />;
  },
);

ChartSheet.displayName = 'ChartSheet';
