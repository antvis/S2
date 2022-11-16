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
    const { options, renderConfig, ...restProps } = props;
    const s2Ref = React.useRef<SpreadSheet>();
    const s2Options = React.useMemo(() => {
      return customMerge(options, {
        dataCell: ChartCell,
        showDefaultHeaderActionIcon: false,
      });
    }, [options]);

    const onCellMounted = (cell: S2CellType) => {
      if (isEmpty(renderConfig) || !isFunction(renderConfig?.render)) {
        return;
      }
      renderToMountedCell(
        cell,
        renderConfig?.render,
        renderConfig?.renderOptions,
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
