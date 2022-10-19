import React from 'react';
import { customMerge, DeviceType } from '@antv/s2';
import type { SpreadSheet } from '@antv/s2';
import { SheetComponent } from '../index';
import type { SheetComponentsProps } from '../interface';

export const MobileSheet = React.forwardRef(
  (props: SheetComponentsProps, ref: React.MutableRefObject<SpreadSheet>) => {
    return (
      <>
        <SheetComponent
          {...props}
          options={customMerge(
            { useMobileOption: true, device: DeviceType.MOBILE },
            props.options,
          )}
          ref={ref}
        />
      </>
    );
  },
);

export const MobileSheetComponent = React.memo(MobileSheet);
MobileSheetComponent.displayName = 'MobileSheetComponent';
