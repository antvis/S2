import React from 'react';
import { customMerge, type S2DataConfig } from '@antv/s2';
import { MobileSheet } from '../../src/components/sheets/mobile-sheet';
import { defaultOptions, pivotSheetDataCfg } from '../config';
import type { SheetComponentOptions } from '../../src';

const MobileDataCfg: S2DataConfig = {
  ...pivotSheetDataCfg,
};

export const MobileSheetComponent = () => {
  const mobileOptions: SheetComponentOptions = {
    width: 400,
    style: {
      rowCfg: {
        width: 60,
      },
      colCfg: {
        width: 140,
        height: 30,
      },
      cellCfg: {
        width: 60,
      },
    },
  };
  const options = customMerge<SheetComponentOptions>(
    defaultOptions,
    mobileOptions,
  );

  return <MobileSheet dataCfg={MobileDataCfg} options={options} />;
};
