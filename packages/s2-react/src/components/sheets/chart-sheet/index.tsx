import React from 'react';
import {
  customMerge,
  SpreadSheet,
  renderToMountedCell,
  type S2CellType,
} from '@antv/s2';
import { isEmpty, isFunction } from 'lodash';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';
import { ChartCell } from './chart-cell';

export const ChartSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const { options, renderProps, ...restProps } = props;
    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge(options, {
        dataCell: ChartCell,
        showDefaultHeaderActionIcon: false,
      });
    }, [options]);

    const onCellMounted = (cell: S2CellType) => {
      if (isEmpty(renderProps) || !isFunction(renderProps?.render)) {
        return;
      }
      renderToMountedCell(
        cell,
        renderProps?.render,
        renderProps?.renderOptions,
      );
    };

    return (
      <BaseSheet
        options={s2Options}
        onCellMounted={onCellMounted}
        ref={s2Ref}
        {...restProps}
      />
    );
  },
);
