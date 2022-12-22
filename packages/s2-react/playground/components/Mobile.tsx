import React from 'react';
import { customMerge, DeviceType } from '@antv/s2';
import { MobileSheet } from '../../src/components/sheets/mobile-sheet';
import { defaultOptions, pivotSheetDataCfg } from '../config';

const MobileDataCfg = {
  ...pivotSheetDataCfg,
};

export const MobileSheetComponent = () => {
  const options = customMerge({}, defaultOptions, {
    width: 400,
    device: DeviceType.MOBILE,
  });

  return (
    <div>
      <MobileSheet dataCfg={MobileDataCfg} options={options} />
    </div>
  );
};
