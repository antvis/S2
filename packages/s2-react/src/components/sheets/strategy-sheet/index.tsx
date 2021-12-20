import React from 'react';
import { customMerge, SpreadSheet, S2Options } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { StrategyDataCell } from './strategy-data-cell';
import { StrategyTheme } from './strategy-theme';
import { RowTooltip } from './custom-tooltip/custom-row-tooltip';
import { ColTooltip } from './custom-tooltip/custom-col-tooltip';
import { DataTooltip } from './custom-tooltip/custom-data-tooltip';
import { SheetComponentsProps } from '@/components/sheets/interface';

export type GetStrategySheetOptions = () => Partial<S2Options<React.ReactNode>>;

const getStrategySheetOptions: GetStrategySheetOptions = () => {
  return {
    dataCell: StrategyDataCell,
    hierarchyType: 'tree',
    showDefaultHeaderActionIcon: false,
    style: {
      colCfg: {
        hideMeasureColumn: true,
      },
    },
    interaction: {
      autoResetSheetStyle: true,
      // 趋势分析表不开启刷选
      brushSelection: false,
    },
    tooltip: {
      operation: {
        hiddenColumns: true,
      },
      row: {
        content: (cell, defaultTooltipShowOptions) => (
          <RowTooltip
            cell={cell}
            defaultTooltipShowOptions={defaultTooltipShowOptions}
          />
        ),
      },
      col: {
        content: (cell, defaultTooltipShowOptions) => (
          <ColTooltip
            cell={cell}
            defaultTooltipShowOptions={defaultTooltipShowOptions}
          />
        ),
      },
      data: {
        content: (cell, defaultTooltipShowOptions) => (
          <DataTooltip
            cell={cell}
            defaultTooltipShowOptions={defaultTooltipShowOptions}
          />
        ),
      },
    },
  };
};

export const StrategySheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, ...restProps } = props;
    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge({}, options, getStrategySheetOptions());
    }, [options, props]);

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
