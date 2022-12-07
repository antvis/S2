import { isUpDataValue, SpreadSheet } from '@antv/s2';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src/components';
import { mockGridAnalysisDataCfg } from '../../__tests__/data/grid-analysis-data';

export const mockGridAnalysisOptions: SheetComponentOptions = {
  width: 1600,
  height: 600,
  style: {
    layoutWidthType: 'colAdaptive',
    cellCfg: {
      width: 400,
      height: 100,
      valuesCfg: {
        widthPercent: [40, 0.2, 0.2, 0.2],
      },
    },
  },
  conditions: {
    text: [
      {
        mapping: (value, cellInfo) => {
          const { colIndex } = cellInfo;
          if (colIndex! <= 1) {
            return {
              fill: '#000',
            };
          }
          return {
            fill: isUpDataValue(value) ? '#FF4D4F' : '#29A294',
          };
        },
      },
    ],
  },
};

export const GridAnalysisSheet: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => {
  return (
    <SheetComponent
      {...props}
      sheetType="gridAnalysis"
      dataCfg={mockGridAnalysisDataCfg}
      options={mockGridAnalysisOptions}
      ref={ref}
    />
  );
});
