/* eslint-disable import/no-extraneous-dependencies */
// import { renderToMountedElement, stdlib } from '@antv/g2';
import { type SpreadSheet } from '@antv/s2';
import React from 'react';
import dataCfg from '../../__tests__/data/mock-dataset.json';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
} from '../../src/components';
import { usePlaygroundContext } from '../context/playground.context';

const options: SheetComponentOptions = {
  height: 900,
  interaction: {
    brushSelection: {
      rowCell: false,
      colCell: false,
      dataCell: false,
    },
    hoverFocus: false,
  },
  style: {},
};

export const PivotChartSheet = React.forwardRef<
  SpreadSheet,
  Partial<SheetComponentProps>
>((props, ref) => {
  const context = usePlaygroundContext();

  return (
    <SheetComponent
      {...props}
      {...context}
      sheetType="pivotChart"
      dataCfg={dataCfg}
      options={options}
      ref={ref}
      adaptive={true}
    />
  );
});
