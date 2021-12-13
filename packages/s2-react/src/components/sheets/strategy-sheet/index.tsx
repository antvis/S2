import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { StrategyDataCell } from './strategy-data-cell';
import { StrategyTheme } from './strategy-theme';
import { SheetComponentsProps } from '@/components/sheets/interface';
import { getSheetComponentOptions } from '@/utils';

export const StrategySheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, ...restProps } = props;

    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return getSheetComponentOptions(options, {
        dataCell: StrategyDataCell,
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
          theme: StrategyTheme,
        }}
        options={s2Options}
        ref={s2Ref}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
