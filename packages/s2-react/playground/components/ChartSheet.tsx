/* eslint-disable import/no-extraneous-dependencies */
import { renderToMountedElement, stdlib } from '@antv/g2';
import { SpreadSheet, type ThemeCfg } from '@antv/s2';
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
  style: {},
};

const theme: ThemeCfg['theme'] = {
  dataCell: {},
};

const onDataCellRender: SheetComponentsProps['onDataCellRender'] = (cell) => {
  // 普通数值单元格正常展示
  if (!cell.isChartData()) {
    return;
  }

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
      themeCfg={{ theme }}
      dataCfg={ChartDataConfig}
      options={options}
      ref={ref}
      adaptive={true}
      onDataCellRender={onDataCellRender}
      header={{
        title: 'S2 & G2',
        description: '单元格内绘制 G2 图表',
        export: { open: true },
      }}
    />
  );
});
