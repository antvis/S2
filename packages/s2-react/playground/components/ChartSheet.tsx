/* eslint-disable import/no-extraneous-dependencies */
// import { renderToMountedElement, stdlib } from '@antv/g2';
import { type SpreadSheet } from '@antv/s2';
import React from 'react';
import { ChartDataConfig } from '../../__tests__/data/data-g2-chart';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
} from '../../src/components';
import { usePlaygroundContext } from '../context/playground.context';

const options: SheetComponentOptions = {
  height: 900,
  interaction: {
    copy: { enable: true, withFormat: true },
    brushSelection: {
      rowCell: true,
      colCell: true,
      dataCell: false,
    },
    selectedCellMove: true,
    selectedCellHighlight: true,
    selectedCellsSpotlight: true,
    hoverFocus: true,
    hoverHighlight: false,
    multiSelection: true,
    overscrollBehavior: 'none',
  },
};

export const ChartSheet = React.forwardRef<
  SpreadSheet,
  Partial<SheetComponentProps>
>((props, ref) => {
  const context = usePlaygroundContext();

  return (
    <SheetComponent
      {...props}
      {...context}
      sheetType="chart"
      dataCfg={ChartDataConfig}
      options={options}
      ref={ref}
      adaptive={true}
    />
  );
});
