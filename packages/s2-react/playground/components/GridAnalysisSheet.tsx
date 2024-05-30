import { LayoutWidthType, SpreadSheet, isUpDataValue } from '@antv/s2';
import React from 'react';
import { mockGridAnalysisDataCfg } from '../../__tests__/data/grid-analysis-data';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
} from '../../src/components';
import { usePlaygroundContext } from '../context/playground.context';

export const mockGridAnalysisOptions: SheetComponentOptions = {
  width: 1600,
  height: 600,
  interaction: {
    selectedCellsSpotlight: true,
  },
  style: {
    layoutWidthType: LayoutWidthType.ColAdaptive,
    rowCell: {
      width: 80,
      height: 100,
    },
    dataCell: {
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

          if (+colIndex! <= 1) {
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

export const GridAnalysisSheet = React.forwardRef<
  SpreadSheet,
  Partial<SheetComponentProps>
>((props, ref) => {
  const context = usePlaygroundContext();

  return (
    <SheetComponent
      {...props}
      {...context}
      sheetType="gridAnalysis"
      dataCfg={mockGridAnalysisDataCfg}
      options={mockGridAnalysisOptions}
      ref={ref}
    />
  );
});
