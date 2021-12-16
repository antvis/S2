import React from 'react';
import { customMerge, SpreadSheet, S2Options } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { StrategyDataCell } from './strategy-data-cell';
import { StrategyTheme } from './strategy-theme';
import { RowTooltip } from './custom-tooltip/custom-row-tooltip';
import { ColTooltip } from './custom-tooltip/custom-col-tooltip';
import { DataTooltip } from './custom-tooltip/custom-data-tooltip';
import { StrategySheetProps } from '@/components/sheets/interface';

export type GetStrategySheetOptions = (
  props: StrategySheetProps,
) => Partial<S2Options<React.ReactNode>>;

const getStrategySheetOptions: GetStrategySheetOptions = (
  props: StrategySheetProps,
) => {
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
    },
    tooltip: {
      operation: {
        hiddenColumns: true,
      },
      row: {
        content: (cell, detail) => <RowTooltip cell={cell} detail={detail} />,
      },
      col: {
        content: (cell, detail) => <ColTooltip cell={cell} detail={detail} />,
      },
      data: {
        content: (cell, detail) => (
          <DataTooltip
            cell={cell}
            detail={detail}
            valuesConfig={props.valuesConfig}
          />
        ),
      },
    },
  };
};

export const StrategySheet: React.FC<StrategySheetProps> = React.memo(
  (props) => {
    const { options, ...restProps } = props;
    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge({}, options, getStrategySheetOptions(props));
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
