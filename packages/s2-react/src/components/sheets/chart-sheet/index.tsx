import { customMerge, type ThemeCfg } from '@antv/s2';
import { ChartDataCell } from '@antv/s2/extends';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentProps } from '../interface';

export const ChartSheet: React.FC<SheetComponentProps> = React.memo((props) => {
  const {
    options: defaultOptions,
    themeCfg: defaultThemeCfg,
    ...restProps
  } = props;

  const s2Options = React.useMemo<SheetComponentOptions>(() => {
    const options: SheetComponentOptions = {
      dataCell: (viewMeta, spreadsheet) =>
        new ChartDataCell(viewMeta, spreadsheet),
      showDefaultHeaderActionIcon: false,
      interaction: {
        hoverFocus: false,
        brushSelection: {
          dataCell: false,
        },
      },
      style: {
        colCell: {
          hideValue: true,
        },
        rowCell: {
          width: 100,
        },
        dataCell: {
          width: 400,
          height: 400,
        },
      },
      tooltip: {
        enable: true,
      },
    };

    return customMerge<SheetComponentOptions>(defaultOptions, options);
  }, [defaultOptions]);

  const themeCfg = React.useMemo<ThemeCfg>(() => {
    const theme: ThemeCfg['theme'] = {
      dataCell: {
        cell: {
          interactionState: {
            hoverFocus: {
              borderOpacity: 0,
            },
            selected: {
              borderOpacity: 0,
            },
          },
        },
      },
    };

    return customMerge<ThemeCfg>(defaultThemeCfg, {
      theme,
    });
  }, [defaultThemeCfg]);

  return <BaseSheet {...restProps} options={s2Options} themeCfg={themeCfg} />;
});

ChartSheet.displayName = 'ChartSheet';
