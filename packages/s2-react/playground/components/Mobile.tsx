import React from 'react';
import { customMerge, SpreadSheet, type S2DataConfig } from '@antv/s2';
import { MobileSheet } from '../../src/components/sheets/mobile-sheet';
import { defaultOptions, pivotSheetDataCfg } from '../config';
import type { SheetComponentOptions, SheetComponentsProps } from '../../src';
import { usePlaygroundContext } from '../context/playground.context';

const MobileDataCfg: S2DataConfig = {
  ...pivotSheetDataCfg,
};

export const MobileSheetComponent: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => {
  const context = usePlaygroundContext();
  const mobileOptions: SheetComponentOptions = {
    width: 400,
    style: {
      rowCell: {
        width: 60,
      },
      colCell: {
        width: 140,
        height: 30,
      },
      dataCell: {
        width: 60,
      },
    },
  };
  const options = customMerge<SheetComponentOptions>(
    defaultOptions,
    mobileOptions,
  );

  return (
    <MobileSheet
      ref={ref}
      dataCfg={MobileDataCfg}
      options={options}
      {...props}
      {...context}
    />
  );
});
