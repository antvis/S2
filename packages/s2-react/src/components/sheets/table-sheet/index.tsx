import React from 'react';
import { SpreadSheet } from '@antv/s2';
import { BaseSheet } from '../base-sheet';
import { SheetComponentsProps } from '@/components/sheets/interface';

export const TableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    const s2Ref = React.useRef<SpreadSheet>();

    return <BaseSheet {...props} ref={s2Ref} />;
  },
);

TableSheet.displayName = 'TableSheet';
