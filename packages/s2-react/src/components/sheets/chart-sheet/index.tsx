import React from 'react';
import { customMerge, SpreadSheet, renderByG2 } from '@antv/s2';
import type { S2CellType } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { ChartCell } from './chart-cell';

export const ChartSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, ...restProps } = props;

    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge(options, {
        dataCell: ChartCell,
        showDefaultHeaderActionIcon: false,
      });
    }, [options]);

    return (
      <BaseSheet
        options={s2Options}
        onCellMounted={renderByG2}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);
