import React from 'react';
import { customMerge, SpreadSheet } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { StrategyDataCell } from './strategy-data-cell';
import { StrategyTheme } from './strategy-theme';
import { SheetComponentsProps } from '@/components/sheets/interface';

export const StrategySheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, ...restProps } = props;

    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge(options, {
        dataCell: StrategyDataCell,
        hierarchyType: 'tree',
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
          theme: StrategyTheme,
        }}
        options={s2Options}
        ref={s2Ref}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
