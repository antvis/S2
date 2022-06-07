import type { SpreadSheet } from '@antv/s2';
import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';

export const TableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const s2Ref = React.useRef<SpreadSheet>();

    return <BaseSheet {...props} ref={s2Ref} />;
  },
);

TableSheet.displayName = 'TableSheet';
