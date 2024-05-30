import { SpreadSheet } from '@antv/s2';
import React from 'react';
import {
  SheetComponent,
  type SheetComponentOptions,
  type SheetComponentProps,
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

export const EditableSheet = React.forwardRef<
  SpreadSheet,
  Partial<SheetComponentProps>
>((props, ref) => {
  const context = usePlaygroundContext();

  return (
    <SheetComponent
      {...props}
      {...context}
      sheetType="editable"
      dataCfg={tableSheetDataCfg}
      options={options}
      ref={ref}
    />
  );
});
