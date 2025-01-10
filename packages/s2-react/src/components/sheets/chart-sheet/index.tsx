import { customMerge, type ThemeCfg } from '@antv/s2';
import { ChartDataCell } from '@antv/s2/extends';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentOptions, SheetComponentProps } from '../interface';

export const ChartSheet: React.FC<SheetComponentProps> = React.memo((props) => {
  const {
    options: customOptions,
    themeCfg: customThemeCfg,
    ...restProps
  } = props;

  const s2Options = React.useMemo<SheetComponentOptions>(() => {
    const defaultOptions: SheetComponentOptions = {
      style: {
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
    };

    return customMerge<SheetComponentOptions>(
      defaultOptions,
      customOptions,
      options,
    );
  }, [customOptions]);

  const themeCfg = React.useMemo<ThemeCfg>(() => {
    const defaultTheme: ThemeCfg['theme'] = {
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

    return customMerge<ThemeCfg>(defaultTheme, customThemeCfg);
  }, [customThemeCfg]);

  return <BaseSheet {...restProps} options={s2Options} themeCfg={themeCfg} />;
});

ChartSheet.displayName = 'ChartSheet';
