import React from 'react';
import { BaseSheet } from './sheets/base-sheet';
import { TabularSheet } from './sheets/tabular-sheet';
import { TableSheet } from './sheets/table-sheet';
import { SpreadsheetProps } from './sheets/interface';

export { SpreadsheetProps, SheetType } from './sheets/interface';
export { PartDrillDown, PartDrillDownInfo } from './sheets/interface';
export const SheetComponent = (props: SpreadsheetProps) => {
  const { sheetType } = props;
  switch (sheetType) {
    case 'table':
      return <TableSheet {...props} />;
    case 'tabular':
      return <TabularSheet {...props} />;
    default:
      return <BaseSheet {...props} />;
  }
};

export { DrillDown, DrillDownProps } from './drill-down';
export { Switcher, SwitcherProps } from './switcher';
export { AdvancedSort, AdvancedSortProps } from './advanced-sort';
