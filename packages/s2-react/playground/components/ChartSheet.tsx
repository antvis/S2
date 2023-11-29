/* eslint-disable import/no-extraneous-dependencies */
import { SpreadSheet } from '@antv/s2';
import { renderToMountedElement, stdlib } from '@antv/g2';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src/components';
import { usePlaygroundContext } from '../context/playground.context';
import { ChartDataConfig } from '../../__tests__/data/data-g2-chart';

const options: SheetComponentOptions = {
  height: 1000,
  interaction: {
    enableCopy: true,
    brushSelection: {
      rowCell: true,
      colCell: true,
      dataCell: true,
    },
    selectedCellMove: true,
    selectedCellHighlight: true,
    selectedCellsSpotlight: true,
    hoverFocus: true,
    hoverHighlight: true,
    multiSelection: true,
    overscrollBehavior: 'none',
  },
  style: {
    colCell: {
      hideValue: true,
    },
    rowCell: {
      width: 100,
    },
    dataCell: {
      width: 500,
      height: 400,
    },
  },
};

const onDataCellRender: SheetComponentsProps['onDataCellRender'] = (cell) => {
  const chartOptions = cell.getRenderChartOptions();

  // https://g2.antv.antgroup.com/manual/extra-topics/bundle#g2stdlib
  renderToMountedElement(chartOptions, {
    group: cell,
    library: stdlib(),
  });
};

export const ChartSheet: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => {
  const context = usePlaygroundContext();

  return (
    <SheetComponent
      {...props}
      {...context}
      sheetType="chart"
      dataCfg={ChartDataConfig}
      options={options}
      ref={ref}
      adaptive
      onDataCellRender={onDataCellRender}
    />
  );
});
