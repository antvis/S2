import React from 'react';
import { BaseSheet } from './sheets/base-sheet';
import { BaseSheetProps } from './sheets/interface';

export { PartDrillDown, PartDrillDownInfo } from './sheets/interface';
export interface SpreadsheetProps extends BaseSheetProps {
  sheetType?: 'base' | 'grid' | 'strategy' | 'miniChart';
}

export const SheetComponent = (props: SpreadsheetProps) => {
  const { sheetType } = props;
  switch (sheetType) {
    default:
      return <BaseSheet {...props} />;
  }
};
