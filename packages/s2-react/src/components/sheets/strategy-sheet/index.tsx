import React from 'react';
import { customMerge, SpreadSheet, S2Options } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { StrategyTheme } from './strategy-theme';
import { RowTooltip } from './custom-tooltip/custom-row-tooltip';
import { ColTooltip } from './custom-tooltip/custom-col-tooltip';
import { DataTooltip } from './custom-tooltip/custom-data-tooltip';
import { CustomColCell } from './custom-col-cell';
import { CustomDataCell } from './custom-data-cell';
import { SheetComponentsProps } from '@/components/sheets/interface';

const strategySheetOptions: Partial<S2Options<React.ReactNode>> = {
  dataCell: (viewMeta) => new CustomDataCell(viewMeta, viewMeta.spreadsheet),
  colCell: (...args) => new CustomColCell(...args),
  showDefaultHeaderActionIcon: false,
  style: {
    colCfg: {
      height: 38,
      hideMeasureColumn: true,
    },
  },
  interaction: {
    autoResetSheetStyle: true,
    // 趋势分析表禁用 刷选, 多选, 区间多选
    brushSelection: false,
    multiSelection: false,
    rangeSelection: false,
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

export const StrategySheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, themeCfg, ...restProps } = props;
    const s2Ref = React.useRef<SpreadSheet>();

    const s2ThemeCfg = React.useMemo(() => {
      return customMerge({}, themeCfg, { theme: StrategyTheme });
    }, [themeCfg]);

    const s2Options = React.useMemo(() => {
      return customMerge({}, options, strategySheetOptions);
    }, [options]);

    return (
      <BaseSheet
        options={s2Options}
        themeCfg={s2ThemeCfg}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);

StrategySheet.displayName = 'StrategySheet';
