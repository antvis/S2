import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentsProps } from '../interface';

export const TableSheet: React.FC<SheetComponentsProps> = React.memo(
  (props) => {
    return <BaseSheet {...props} />;
  },
);

TableSheet.displayName = 'TableSheet';
