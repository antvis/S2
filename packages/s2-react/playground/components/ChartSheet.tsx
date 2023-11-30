/* eslint-disable import/no-extraneous-dependencies */
import { renderToMountedElement, stdlib } from '@antv/g2';
import { SpreadSheet } from '@antv/s2';
import React from 'react';
import { ChartDataConfig } from '../../__tests__/data/data-g2-chart';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src/components';
import { usePlaygroundContext } from '../context/playground.context';

const options: SheetComponentOptions = {
  height: 900,
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
  style: {},
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
      adaptive={true}
      onDataCellRender={onDataCellRender}
      header={{
        title: 'S2 & G2',
        description: '单元格内绘制 G2 图表',
        exportCfg: { open: true },
      }}
    />
  );
});
