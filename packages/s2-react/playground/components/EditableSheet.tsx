import { SpreadSheet } from '@antv/s2';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentsProps,
} from '../../src/components';
import { tableSheetDataCfg } from '../config';
import { usePlaygroundContext } from '../context/playground.context';

export const options: SheetComponentOptions = {
  width: 600,
  height: 480,
  tooltip: {
    enable: false,
  },
};

export const EditableSheet: React.FC<
  Partial<SheetComponentsProps> & React.RefAttributes<SpreadSheet>
> = React.forwardRef((props, ref) => {
  const context = usePlaygroundContext();

  return (
    <SheetComponent
      sheetType="editable"
      dataCfg={tableSheetDataCfg}
      options={options}
      ref={ref}
      {...props}
      {...context}
    />
  );
});
