import { SpreadSheet } from '@antv/s2';
import React from 'react';

import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src';
import { usePlaygroundContext } from '../context/playground.context';

const s2Options: SheetComponentOptions = {
  width: 600,
  height: 480,
  interaction: {
    scrollSpeedRatio: {
      vertical: 10,
      horizontal: 10,
    },
  },
};

export function generateRawData(
  row: Record<string, number>,
  col: Record<string, number>,
) {
  const res: Record<string, any>[] = [];
  const rowKeys = Object.keys(row);
  const colKeys = Object.keys(col);

  for (let i = 0; i < row[rowKeys[0]]; i++) {
    for (let j = 0; j < row[rowKeys[1]]; j++) {
      for (let m = 0; m < col[colKeys[0]]; m++) {
        for (let n = 0; n < col[colKeys[1]]; n++) {
          res.push({
            province: `p${i}`,
            city: `c${j}`,
            type: `type${m}`,
            subType: `subType${n}`,
            number: i * n,
          });
        }
      }
    }
  }

  return res;
}

const s2DataConfig = {
  fields: {
    rows: ['type', 'subType'],
    columns: ['province', 'city'],
    values: ['number'],
  },
  data: generateRawData(
    { province: 10, city: 100 },
    { type: 10, sub_type: 100 },
  ),
};

type CustomGridProps = Partial<SheetComponentsProps>;
const sheetType = 'pivot';

export const BigDataSheet = React.forwardRef<SpreadSheet, CustomGridProps>(
  (props, ref) => {
    const context = usePlaygroundContext();

    return (
      <SheetComponent
        {...props}
        {...context}
        sheetType={sheetType}
        dataCfg={s2DataConfig}
        options={s2Options}
        ref={ref}
      />
    );
  },
);
