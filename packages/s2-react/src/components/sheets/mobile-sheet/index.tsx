import React from 'react';
import { getMobileSheetComponentOptions } from '@antv/s2-shared';
import { SheetComponent } from '../index';
import type { SheetComponentsProps } from '../interface';

export const MobileSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => (
    <SheetComponent
      {...props}
      options={getMobileSheetComponentOptions(props.options!)}
    />
  ),
);

MobileSheet.displayName = 'MobileSheet';
