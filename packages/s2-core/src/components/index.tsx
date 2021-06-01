import React from 'react';
import { BaseSheet } from './sheets/base-sheet';
import { TabularSheet } from './sheets/tabular-sheet';
import { BaseSheetProps } from './sheets/interface';

export { PartDrillDown, PartDrillDownInfo } from './sheets/interface';
export interface SpreadsheetProps extends BaseSheetProps {
  sheetType?: 'base' | 'tabular';
}

export const SheetComponent = (props: SpreadsheetProps) => {
  const { sheetType } = props;
  switch (sheetType) {
    case 'tabular':
      return <TabularSheet {...props} />;
    default:
      return <BaseSheet {...props} />;
  }
};
