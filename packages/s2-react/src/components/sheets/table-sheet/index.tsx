import React from 'react';
import { BaseSheet } from '../base-sheet';
import type { SheetComponentProps } from '../interface';

export const TableSheet: React.FC<SheetComponentProps> = React.memo((props) => {
  return <BaseSheet {...props} />;
});

TableSheet.displayName = 'TableSheet';
