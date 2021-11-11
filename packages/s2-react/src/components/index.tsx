import React from 'react';
import debounceRender from 'react-debounce-render';
import { BaseSheet } from './sheets/base-sheet';
import { TabularSheet } from './sheets/tabular-sheet';
import { TableSheet } from './sheets/table-sheet';
import { SpreadsheetProps } from './sheets/interface';
export { DrillDown } from './drill-down';
export { Switcher } from './switcher';
export { AdvancedSort } from './advanced-sort';
export * from './sheets';

export const SheetComponent: React.FC<SpreadsheetProps> = debounceRender(
  (props: SpreadsheetProps) => {
    const { sheetType } = props;
    switch (sheetType) {
      case 'table':
        return <TableSheet {...props} />;
      case 'tabular':
        return <TabularSheet {...props} />;
      default:
        return <BaseSheet {...props} />;
    }
  },
  100,
);
